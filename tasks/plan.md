# Plano de Execução — Leitor Industrial MVP

**Versão:** 1.0  
**Data:** 2026-04-21  
**Prazo:** 15 dias  
**Referência:** SPEC.md v1.0

---

## Princípio de Execução

Cada slice entrega um **caminho vertical completo** — do banco ao componente — funcionando e testado. Não há camada horizontal entregue pela metade.

```
Slice 1 → Slice 2 → CHECKPOINT 1 → Slice 3 → Slice 4 → CHECKPOINT 2
       → Slice 5 → Slice 6 → CHECKPOINT 3 → Slice 7 → DEPLOY
```

---

## Mapa de Dependências

```
[Slice 1: Fundação]
  ↓ Supabase clients + auth + tipos
[Slice 2: Banco de Dados]
  ↓ tabelas + RLS + seeds
[Slice 3: Scan Online]          ← depende de Slice 1 + 2
  ↓ POST /api/scan + câmera + feedback
[Slice 4: Offline + Sync]       ← depende de Slice 3
  ↓ RxDB + Serwist + sync automático
         ↓ CHECKPOINT 1 — scan funciona online e offline
[Slice 5: Histórico]            ← depende de Slice 1 + 2
  ↓ GET /api/historico + HistoricoList
[Slice 6: Equipamentos]         ← depende de Slice 2 + 3 (upsert no scan)
  ↓ GET /api/equipamentos + EquipamentoList
         ↓ CHECKPOINT 2 — todas as features funcionam
[Slice 7: Quality Gate + Deploy] ← depende de tudo
  ↓ typecheck + lint + cobertura + E2E + Vercel
         ↓ CHECKPOINT 3 — MVP pronto para produção
```

---

## Slice 1 — Fundação (D1–2)

**Entrega:** App carrega, login funciona, usuário autenticado cai em `/scan`.

### Tarefas

#### 1.1 Scaffolding do projeto
- `pnpm create next-app@latest leitor-industrial --typescript --tailwind --app`
- Configurar `tsconfig.json` com `strict: true`
- Instalar dependências: `@supabase/supabase-js`, `@supabase/ssr`, `zod`, `vitest`, `@playwright/test`
- Instalar shadcn/ui: `pnpm dlx shadcn@latest init`
- Adicionar componentes base: `button`, `input`, `card`, `skeleton`, `badge`
- Configurar `pnpm test`, `pnpm test:coverage`, `pnpm typecheck`, `pnpm lint`

**Critério de aceite:**
- [ ] `pnpm dev` sobe sem erros
- [ ] `pnpm typecheck` passa
- [ ] `pnpm lint` passa

#### 1.2 Supabase clients
- `src/lib/supabase/client.ts` — browser client (singleton)
- `src/lib/supabase/server.ts` — server client com cookies
- `.env.local.example` com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Critério de aceite:**
- [ ] Clients exportados sem erros de tipo
- [ ] Variáveis de ambiente documentadas em `.env.local.example`

#### 1.3 Tipos compartilhados
- `src/types/index.ts` com tipos: `Leitura`, `Equipamento`, `Perfil`, `UserRole`

```typescript
export type UserRole = 'worker' | 'supervisor'

export type Perfil = {
  id: string
  nome: string
  role: UserRole
}

export type Equipamento = {
  id: string
  serial: string
  nome: string | null
  criado_em: string
}

export type Leitura = {
  id: string
  serial: string
  operario_id: string
  registrado_em: string
  latitude: number | null
  longitude: number | null
  criado_em: string
  equipamento?: Pick<Equipamento, 'serial' | 'nome'>
}
```

**Critério de aceite:**
- [ ] Nenhum `any` nos tipos
- [ ] Tipos importáveis sem erro em qualquer módulo

#### 1.4 Auth — Login page + middleware
- `src/app/(auth)/login/page.tsx` — formulário email/senha com estados loading/error
- `src/middleware.ts` — redireciona `/` → `/scan` se autenticado, `/login` se não
- `src/app/page.tsx` — redirect automático

**Critério de aceite:**
- [ ] Login com credenciais válidas redireciona para `/scan`
- [ ] Acesso a `/scan` sem autenticação redireciona para `/login`
- [ ] Formulário exibe estado de loading durante submit
- [ ] Formulário exibe mensagem de erro em credencial inválida

---

## Slice 2 — Banco de Dados (D3)

**Entrega:** Schema criado, RLS funcionando, seeds disponíveis para testes.

### Tarefas

#### 2.1 Migration inicial
Arquivo: `supabase/migrations/202604210001_initial.sql`

```sql
-- perfis
create table perfis (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  role text not null check (role in ('worker', 'supervisor'))
);

-- equipamentos
create table equipamentos (
  id uuid primary key default gen_random_uuid(),
  serial text not null unique,
  nome text,
  criado_em timestamptz default now()
);

-- leituras
create table leituras (
  id uuid primary key default gen_random_uuid(),
  serial text not null references equipamentos(serial),
  operario_id uuid not null references auth.users(id),
  registrado_em timestamptz not null,
  latitude numeric(9,6),
  longitude numeric(9,6),
  criado_em timestamptz default now()
);

-- índices
create index leituras_operario_id_idx on leituras(operario_id);
create index leituras_serial_idx on leituras(serial);
create index leituras_registrado_em_idx on leituras(registrado_em desc);
```

**Critério de aceite:**
- [ ] Migration roda em banco limpo sem erro
- [ ] Migration roda em banco já populado sem erro
- [ ] Down manual (drop tables) funciona sem foreign key errors

#### 2.2 RLS Policies
Arquivo: `supabase/migrations/202604210002_rls.sql`

```sql
-- perfis
alter table perfis enable row level security;
create policy "perfis_select_own" on perfis for select using (auth.uid() = id);

-- equipamentos
alter table equipamentos enable row level security;
create policy "equipamentos_select_auth" on equipamentos for select using (auth.uid() is not null);
create policy "equipamentos_update_supervisor" on equipamentos for update using (
  exists (select 1 from perfis where id = auth.uid() and role = 'supervisor')
);

-- leituras
alter table leituras enable row level security;
create policy "leituras_select_own" on leituras for select using (
  operario_id = auth.uid() or
  exists (select 1 from perfis where id = auth.uid() and role = 'supervisor')
);
create policy "leituras_insert_auth" on leituras for insert with check (
  auth.uid() is not null and operario_id = auth.uid()
);
```

**Critério de aceite:**
- [ ] Worker não consegue ler leituras de outro worker
- [ ] Supervisor consegue ler leituras de todos
- [ ] Worker não consegue editar equipamentos

#### 2.3 Seeds para testes
Arquivo: `supabase/seed.sql`

- 2 usuários: `worker@test.com` (worker) e `supervisor@test.com` (supervisor)
- 3 equipamentos com serial conhecido
- 5 leituras distribuídas entre os usuários

**Critério de aceite:**
- [ ] Seeds executam sem erro
- [ ] Dados disponíveis para testes de integração

---

## Slice 3 — Scan Online (D4–6)

**Entrega:** Operário abre `/scan`, aponta câmera ou digita serial, vê confirmação. Leitura salva no Supabase.

### Tarefas

#### 3.1 Validação Zod
- `src/lib/validations/scan.ts` — `scanSchema`
- Testes unitários em `src/lib/validations/__tests__/scan.test.ts`

**Critério de aceite:**
- [ ] Aceita serial válido com `registrado_em` ISO
- [ ] Rejeita serial vazio
- [ ] Rejeita `registrado_em` inválido
- [ ] Latitude/longitude opcionais mas validados quando presentes

#### 3.2 Endpoint `POST /api/scan`
- `src/app/api/scan/route.ts`
- Validar com `scanSchema`
- Autenticar via Supabase server client
- Upsert em `equipamentos` (cria se serial desconhecido)
- Insert em `leituras`
- Testes de integração em `src/app/api/scan/__tests__/route.test.ts`

**Cenários de teste obrigatórios:**
- [ ] `201` — scan válido com serial existente
- [ ] `201` — scan válido com serial desconhecido (cria equipamento)
- [ ] `400` — serial ausente
- [ ] `400` — `registrado_em` inválido
- [ ] `401` — sem autenticação

#### 3.3 Hook `useScanner`
- `src/hooks/useScanner.ts`
- Estado: `idle | scanning | success | error`
- Expõe: `startScan`, `stopScan`, `submitManual`, `result`, `state`
- Chama `POST /api/scan` após leitura bem-sucedida

#### 3.4 Componente `ScannerCamera`
- `src/components/scan/ScannerCamera.tsx`
- Integra `qr-scanner`
- Ativa câmera automaticamente ao montar
- Chama `useScanner` ao detectar código

#### 3.5 Componente `ManualInput`
- `src/components/scan/ManualInput.tsx`
- Input + botão "Registrar"
- Chama `useScanner.submitManual`

#### 3.6 Componente `ScanResult`
- `src/components/scan/ScanResult.tsx`
- Estado `success`: exibe nome do equipamento + serial + "Registrado às HH:mm"
- Estado `error`: mensagem de erro + botão "Tentar novamente"

#### 3.7 Página `/scan`
- `src/app/(app)/scan/page.tsx`
- Tabs ou toggle: "Câmera" / "Manual"
- Monta `ScannerCamera` ou `ManualInput`
- Exibe `ScanResult` após leitura

**Critério de aceite do Slice 3:**
- [ ] Scan via câmera funciona em smartphone real (Android/iOS)
- [ ] Scan manual funciona
- [ ] Confirmação aparece em menos de 3 segundos (online)
- [ ] Todos os testes de integração do endpoint passam
- [ ] Cobertura ≥ 80% nos arquivos do slice

---

## ✅ CHECKPOINT 1 — Scan Online Validado

Antes de avançar para offline, verificar:
- [ ] Scan funciona no browser desktop (dev)
- [ ] Scan funciona em smartphone real (câmera)
- [ ] Leitura aparece no Supabase dashboard
- [ ] Testes passando: `pnpm test`
- [ ] TypeScript sem erros: `pnpm typecheck`

---

## Slice 4 — Offline + Sync (D7–9)

**Entrega:** Scan funciona sem internet. Ao reconectar, leituras pendentes sobem automaticamente.

### Tarefas

#### 4.1 RxDB schema
- `src/lib/rxdb/schema.ts` — coleção `leituras_pendentes`

```typescript
export const leituraSchema = {
  version: 0,
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 36 },
    serial: { type: 'string' },
    operario_id: { type: 'string' },
    registrado_em: { type: 'string' },
    latitude: { type: 'number' },
    longitude: { type: 'number' },
    synced: { type: 'boolean' },
  },
  required: ['id', 'serial', 'operario_id', 'registrado_em'],
  primaryKey: 'id',
}
```

#### 4.2 Lógica de sync
- `src/lib/rxdb/sync.ts` — `syncPendingLeituras()`
- Busca `leituras_pendentes` onde `synced = false`
- Para cada uma: `POST /api/scan`
- Marca `synced = true` se sucesso
- Acionado por evento `window.addEventListener('online', ...)`

#### 4.3 Hook `useOfflineSync`
- `src/hooks/useOfflineSync.ts`
- Expõe: `isOnline`, `pendingCount`, `syncing`
- Atualiza estado ao mudar conectividade

#### 4.4 Atualizar `useScanner`
- Antes de chamar `POST /api/scan`, salvar no RxDB com `synced: false`
- Se online: chamar API e marcar `synced: true`
- Se offline: retornar estado `offline` com sucesso local

#### 4.5 Serwist (Service Worker + PWA)
- `next.config.ts` — configurar Serwist
- `public/manifest.json` — nome, ícones, `display: standalone`
- Cache-first para assets estáticos
- Offline fallback page

#### 4.6 Indicador offline
- `src/components/OfflineBanner.tsx` — banner visível quando `!isOnline`
- Exibido globalmente no layout `(app)`
- Mostra contador de leituras pendentes se `pendingCount > 0`

**Critério de aceite do Slice 4:**
- [ ] Desconectar internet → banner offline aparece
- [ ] Scan offline → feedback "Salvo localmente" + contador no banner
- [ ] Reconectar → sync automático → banner desaparece
- [ ] Leituras offline aparecem no histórico após sync
- [ ] App carrega sem internet após primeiro acesso (cache)

---

## ✅ CHECKPOINT 2 — Scan Online + Offline Validado

- [ ] Fluxo completo: login → scan online → scan offline → sync
- [ ] Teste E2E básico passando (Playwright interceptando rede)
- [ ] `pnpm test` verde
- [ ] `pnpm typecheck` verde

---

## Slice 5 — Histórico (D10–11)

**Entrega:** Operário vê suas leituras. Supervisor vê todas.

### Tarefas

#### 5.1 Endpoint `GET /api/historico`
- `src/app/api/historico/route.ts`
- Query params: `page`, `limit` (default 20)
- Worker: filtra por `operario_id = auth.uid()`
- Supervisor: retorna todas (sem filtro de operario)
- Join com `equipamentos` para trazer `nome`
- Testes de integração

**Cenários de teste:**
- [ ] `200` — worker recebe apenas as próprias leituras
- [ ] `200` — supervisor recebe leituras de todos
- [ ] `200` — paginação funciona (`page=2`)
- [ ] `401` — sem autenticação

#### 5.2 Componentes
- `src/components/historico/LeituraItem.tsx` — serial, nome (se cadastrado), timestamp, badge online/offline
- `src/components/historico/HistoricoList.tsx` — lista + skeleton + empty + error
- `src/components/historico/HistoricoSkeleton.tsx`

#### 5.3 Página `/historico`
- `src/app/(app)/historico/page.tsx`
- Infinite scroll ou botão "carregar mais"
- Puxar leituras do RxDB (offline) + Supabase (online) de forma unificada

**Critério de aceite:**
- [ ] Operário vê somente suas leituras
- [ ] Supervisor vê todas (incluindo de outros operários)
- [ ] Estado empty: "Nenhuma leitura registrada ainda"
- [ ] Estado error: mensagem + botão retry
- [ ] Skeleton durante loading

---

## Slice 6 — Lista de Equipamentos (D12–13)

**Entrega:** Lista de equipamentos com último uso. Clique abre histórico do serial.

### Tarefas

#### 6.1 Endpoint `GET /api/equipamentos`
- `src/app/api/equipamentos/route.ts`
- Query params: `page`, `limit`, `q` (busca por serial ou nome)
- Retorna: serial, nome, última leitura (timestamp + operario_id)
- Subquery para pegar a leitura mais recente por serial

#### 6.2 Endpoint `GET /api/equipamentos/[serial]`
- `src/app/api/equipamentos/[serial]/route.ts`
- Retorna equipamento + últimas 20 leituras
- `404` se serial não encontrado

#### 6.3 Componentes
- `src/components/equipamentos/EquipamentoCard.tsx` — serial, nome (ou "—" se null), última leitura
- `src/components/equipamentos/EquipamentoList.tsx` — lista + skeleton + empty + error

#### 6.4 Páginas
- `src/app/(app)/equipamentos/page.tsx` — lista com busca
- `src/app/(app)/equipamentos/[serial]/page.tsx` — detalhes + histórico do serial

**Critério de aceite:**
- [ ] Lista mostra equipamentos com última leitura
- [ ] Serial desconhecido aparece na lista após primeiro scan (auto-criado)
- [ ] Busca por serial ou nome funciona
- [ ] Página de detalhe mostra histórico completo do serial

---

## ✅ CHECKPOINT 3 — Todas as Features Funcionando

- [ ] Scan → histórico → equipamentos: fluxo completo sem erros
- [ ] RLS testado: worker e supervisor com comportamentos corretos
- [ ] Offline → sync: dados consistentes
- [ ] `pnpm test` verde, `pnpm typecheck` verde

---

## Slice 7 — Quality Gate + Deploy (D14–15)

**Entrega:** MVP em produção, todos os checks passando.

### Tarefas

#### 7.1 Navegação
- Layout `(app)`: bottom nav mobile com 3 itens: Scan, Histórico, Equipamentos
- Ativo destaca item atual

#### 7.2 TypeScript strict
- `pnpm typecheck` sem erros
- Resolver todos os `@ts-ignore` e tipos ausentes

#### 7.3 Lint
- `pnpm lint` sem warnings
- Sem `console.log` no código de produção

#### 7.4 Cobertura de testes
- `pnpm test:coverage`
- ≥ 80% nos arquivos tocados por cada slice
- Relatório em `coverage/`

#### 7.5 Testes E2E (Playwright)
- `src/e2e/scan-flow.spec.ts`: login → scan → ver no histórico
- `src/e2e/offline-flow.spec.ts`: interceptar rede → scan offline → reconectar → sync

#### 7.6 PWA completo
- `public/manifest.json` com ícones 192×192 e 512×512
- Meta tags no `layout.tsx`: `apple-mobile-web-app-capable`, `theme-color`
- Lighthouse PWA score ≥ 90

#### 7.7 Deploy Vercel
- Conectar repositório GitHub ao Vercel
- Configurar variáveis de ambiente no Vercel dashboard
- Verificar build de produção: `pnpm build` sem erros
- Deploy via `git push` (CI/CD automático)
- Testar URL de produção em smartphone real

**Critério de aceite final:**
- [ ] `pnpm typecheck` — zero erros
- [ ] `pnpm lint` — zero warnings
- [ ] `pnpm test:coverage` — cobertura ≥ 80%
- [ ] `pnpm test:e2e` — todos os cenários E2E passando
- [ ] Deploy em produção acessível
- [ ] App instalável como PWA no smartphone
- [ ] Scan funciona na URL de produção

---

## ✅ CHECKPOINT FINAL — MVP Pronto para Produção

```
[ ] TypeScript sem erros
[ ] Lint sem warnings
[ ] Todos os testes passando
[ ] Cobertura >= 80% nos arquivos tocados
[ ] Nenhum console.log no código
[ ] Spec respeitada em 100% dos critérios
[ ] Migrations testadas em banco limpo e populado
[ ] RLS validado (worker vs supervisor)
[ ] Deploy em produção funcionando
[ ] PWA instalável e offline funcional
```

---

## Cronograma

| Dia | Slice | Entrega |
|---|---|---|
| D1–2 | Slice 1 | Projeto sobe, login, redirect, tipos |
| D3 | Slice 2 | Migrations, RLS, seeds |
| D4–6 | Slice 3 | Scan online: câmera + manual + API |
| D7–9 | Slice 4 | Offline: RxDB + Serwist + sync |
| D10–11 | Slice 5 | Histórico: worker vs supervisor |
| D12–13 | Slice 6 | Equipamentos: lista + detalhe |
| D14–15 | Slice 7 | Quality gate + deploy |
