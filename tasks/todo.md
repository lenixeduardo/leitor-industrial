# TODO — Leitor Industrial MVP

> Atualizar status conforme avança. Marcar `[x]` ao concluir cada item.

---

## Slice 1 — Fundação (D1–2)

### 1.1 Scaffolding
- [ ] Criar projeto Next.js 15 com TypeScript + Tailwind + App Router
- [ ] Configurar `tsconfig.json` com `strict: true`
- [ ] Instalar dependências: `@supabase/supabase-js`, `@supabase/ssr`, `zod`
- [ ] Instalar Vitest + `@playwright/test`
- [ ] Inicializar shadcn/ui
- [ ] Adicionar componentes base: button, input, card, skeleton, badge
- [ ] Configurar scripts: `test`, `test:coverage`, `test:e2e`, `typecheck`, `lint`
- [ ] Verificar: `pnpm dev` sobe sem erros

### 1.2 Supabase clients
- [ ] `src/lib/supabase/client.ts` — browser client
- [ ] `src/lib/supabase/server.ts` — server client com cookies
- [ ] `.env.local.example` com variáveis documentadas

### 1.3 Tipos
- [ ] `src/types/index.ts` — `UserRole`, `Perfil`, `Equipamento`, `Leitura`

### 1.4 Auth
- [ ] `src/app/(auth)/login/page.tsx` — formulário com loading/error
- [ ] `src/middleware.ts` — redirecionar por auth status
- [ ] `src/app/page.tsx` — redirect automático
- [ ] Testar: login válido → `/scan`, sem auth → `/login`

---

## Slice 2 — Banco de Dados (D3)

### 2.1 Migration
- [ ] `supabase/migrations/202604210001_initial.sql` — tabelas perfis, equipamentos, leituras
- [ ] Rodar em banco limpo: sem erros
- [ ] Rodar em banco populado: sem erros

### 2.2 RLS
- [ ] `supabase/migrations/202604210002_rls.sql` — policies por tabela
- [ ] Testar: worker não lê leituras de outro worker
- [ ] Testar: supervisor lê leituras de todos
- [ ] Testar: worker não edita equipamentos

### 2.3 Seeds
- [ ] `supabase/seed.sql` — 2 usuários, 3 equipamentos, 5 leituras
- [ ] Seeds executam sem erro

---

## Slice 3 — Scan Online (D4–6)

### 3.1 Validação Zod
- [ ] `src/lib/validations/scan.ts` — `scanSchema`
- [ ] `src/lib/validations/__tests__/scan.test.ts` — testes unitários
  - [ ] Aceita serial válido
  - [ ] Rejeita serial vazio
  - [ ] Rejeita `registrado_em` inválido
  - [ ] Lat/lng opcionais validados

### 3.2 Endpoint POST /api/scan
- [ ] `src/app/api/scan/route.ts`
- [ ] `src/app/api/scan/__tests__/route.test.ts`
  - [ ] 201 — serial existente
  - [ ] 201 — serial desconhecido (upsert equipamento)
  - [ ] 400 — serial ausente
  - [ ] 400 — registrado_em inválido
  - [ ] 401 — sem autenticação

### 3.3 Hook useScanner
- [ ] `src/hooks/useScanner.ts` — estados idle/scanning/success/error
- [ ] Integra com `POST /api/scan`

### 3.4 Componente ScannerCamera
- [ ] `src/components/scan/ScannerCamera.tsx`
- [ ] Instalar `qr-scanner`
- [ ] Câmera ativa ao montar
- [ ] Detecta QR/barcode e chama `useScanner`

### 3.5 Componente ManualInput
- [ ] `src/components/scan/ManualInput.tsx`
- [ ] Input + botão submit
- [ ] Chama `useScanner.submitManual`

### 3.6 Componente ScanResult
- [ ] `src/components/scan/ScanResult.tsx`
- [ ] Estado success: nome + serial + hora
- [ ] Estado error: mensagem + retry

### 3.7 Página /scan
- [ ] `src/app/(app)/scan/page.tsx`
- [ ] Toggle câmera / manual
- [ ] Exibe ScanResult após leitura
- [ ] Testar em smartphone real (câmera)

### ✅ Checkpoint 1
- [ ] Scan funciona online (desktop + smartphone)
- [ ] Leitura aparece no Supabase
- [ ] `pnpm test` verde
- [ ] `pnpm typecheck` verde

---

## Slice 4 — Offline + Sync (D7–9)

### 4.1 RxDB schema
- [ ] Instalar `rxdb`
- [ ] `src/lib/rxdb/schema.ts` — coleção `leituras_pendentes`

### 4.2 Lógica de sync
- [ ] `src/lib/rxdb/sync.ts` — `syncPendingLeituras()`
- [ ] Acionado por evento `online`

### 4.3 Hook useOfflineSync
- [ ] `src/hooks/useOfflineSync.ts` — `isOnline`, `pendingCount`, `syncing`

### 4.4 Atualizar useScanner
- [ ] Salvar no RxDB antes de chamar API
- [ ] Estado `offline` quando sem internet

### 4.5 Serwist
- [ ] Instalar `serwist`
- [ ] Configurar em `next.config.ts`
- [ ] `public/manifest.json`
- [ ] Cache-first para assets

### 4.6 Indicador offline
- [ ] `src/components/OfflineBanner.tsx`
- [ ] Exibido no layout `(app)` quando `!isOnline`
- [ ] Contador de leituras pendentes

### ✅ Checkpoint 2
- [ ] Scan offline funciona
- [ ] Sync automático ao reconectar
- [ ] Banner offline aparece/desaparece
- [ ] App carrega sem internet (cache)
- [ ] `pnpm test` verde

---

## Slice 5 — Histórico (D10–11)

### 5.1 Endpoint GET /api/historico
- [ ] `src/app/api/historico/route.ts` — paginação + role filter
- [ ] `src/app/api/historico/__tests__/route.test.ts`
  - [ ] 200 — worker vê só as próprias
  - [ ] 200 — supervisor vê todas
  - [ ] 200 — paginação funciona
  - [ ] 401 — sem autenticação

### 5.2 Componentes
- [ ] `src/components/historico/LeituraItem.tsx`
- [ ] `src/components/historico/HistoricoSkeleton.tsx`
- [ ] `src/components/historico/HistoricoList.tsx` — loading/empty/error/success

### 5.3 Página /historico
- [ ] `src/app/(app)/historico/page.tsx`
- [ ] Unifica RxDB (offline) + Supabase (online)
- [ ] Estado empty: "Nenhuma leitura registrada ainda"
- [ ] Estado error: mensagem + retry

---

## Slice 6 — Equipamentos (D12–13)

### 6.1 Endpoint GET /api/equipamentos
- [ ] `src/app/api/equipamentos/route.ts` — paginação + busca
- [ ] Subquery: última leitura por serial
- [ ] Testes de integração

### 6.2 Endpoint GET /api/equipamentos/[serial]
- [ ] `src/app/api/equipamentos/[serial]/route.ts`
- [ ] 200 — equipamento + 20 leituras
- [ ] 404 — serial não encontrado

### 6.3 Componentes
- [ ] `src/components/equipamentos/EquipamentoCard.tsx`
- [ ] `src/components/equipamentos/EquipamentoList.tsx` — loading/empty/error/success

### 6.4 Páginas
- [ ] `src/app/(app)/equipamentos/page.tsx` — lista com busca
- [ ] `src/app/(app)/equipamentos/[serial]/page.tsx` — detalhes + histórico

### ✅ Checkpoint 3
- [ ] Scan → histórico → equipamentos: fluxo completo
- [ ] RLS testado worker vs supervisor
- [ ] `pnpm test` verde, `pnpm typecheck` verde

---

## Slice 7 — Quality Gate + Deploy (D14–15)

### 7.1 Navegação
- [ ] Layout `(app)` com bottom nav: Scan / Histórico / Equipamentos
- [ ] Item ativo destacado

### 7.2 Quality checks
- [ ] `pnpm typecheck` — zero erros
- [ ] `pnpm lint` — zero warnings
- [ ] Nenhum `console.log` no código

### 7.3 Cobertura
- [ ] `pnpm test:coverage` — cobertura ≥ 80% nos arquivos tocados

### 7.4 Testes E2E
- [ ] `src/e2e/scan-flow.spec.ts` — login → scan → histórico
- [ ] `src/e2e/offline-flow.spec.ts` — intercept rede → scan offline → sync

### 7.5 PWA
- [ ] Ícones 192×192 e 512×512 em `public/`
- [ ] Meta tags no `layout.tsx`
- [ ] Lighthouse PWA score ≥ 90

### 7.6 Deploy
- [ ] Conectar repo ao Vercel
- [ ] Configurar variáveis de ambiente
- [ ] `pnpm build` sem erros
- [ ] Testar URL de produção em smartphone real

### ✅ Checkpoint Final
- [ ] TypeScript sem erros
- [ ] Lint sem warnings
- [ ] Testes passando
- [ ] Cobertura ≥ 80%
- [ ] Nenhum console.log
- [ ] Spec 100% respeitada
- [ ] Migrations testadas
- [ ] RLS validado
- [ ] Deploy em produção
- [ ] PWA instalável
