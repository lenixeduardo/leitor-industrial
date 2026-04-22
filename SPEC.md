# SPEC.md — Leitor Industrial

**Versão:** 1.0  
**Data:** 2026-04-21  
**Status:** Aguardando aprovação

---

## Objetivo

Sistema SaaS PWA para operários de fábrica registrarem o uso de equipamentos industriais via leitura de serial number. O operário abre o app, escaneia (câmera/QR/barcode) ou digita o serial number do equipamento, e o sistema registra quem usou, quando e onde — funcionando mesmo sem internet.

**Problema resolvido:** Rastreamento de equipamentos hoje é feito em planilhas ou em sistemas CMMS complexos que operários não adotam (taxa de falha 50–70%). O produto remove o atrito: 1–2 taps, sem treinamento, offline-first.

**Usuários primários:** Operários de chão de fábrica (baixa familiaridade técnica, smartphones Android/iOS básicos, conectividade intermitente).

**Usuários secundários:** Supervisores e gestores (visualizam histórico e relatórios pelo dashboard).

**Hipótese do MVP:** Operários usarão o app consistentemente se o fluxo de scan for de 1–2 taps e funcionar offline.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 15 (App Router) |
| Linguagem | TypeScript strict |
| UI | Tailwind CSS + shadcn/ui |
| Banco (cloud) | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Scanning | qr-scanner |
| Offline (local) | RxDB + SQLite (Capacitor) |
| PWA / Service Worker | Serwist |
| Deploy | Vercel |
| Testes unitários | Vitest |
| Testes E2E | Playwright |

---

## Comandos

```bash
# Desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Testes unitários
pnpm test

# Testes com cobertura
pnpm test:coverage

# Testes E2E
pnpm test:e2e

# Type check
pnpm typecheck

# Lint
pnpm lint
```

---

## Estrutura do Projeto

```
src/
  app/
    (auth)/
      login/
        page.tsx
    (app)/
      dashboard/
        page.tsx          → lista de leituras recentes + stats
      scan/
        page.tsx          → tela principal de scan
      equipamentos/
        page.tsx          → lista de equipamentos cadastrados
        [serial]/
          page.tsx        → histórico de um equipamento específico
      historico/
        page.tsx          → histórico de leituras do operário logado
    api/
      scan/
        route.ts          → POST /api/scan
      equipamentos/
        route.ts          → GET /api/equipamentos
        [serial]/
          route.ts        → GET /api/equipamentos/[serial]
      historico/
        route.ts          → GET /api/historico
    layout.tsx
    page.tsx              → redirect para /scan se logado, /login se não
  components/
    scan/
      ScannerCamera.tsx   → componente de câmera com qr-scanner
      ManualInput.tsx     → input manual de serial number
      ScanResult.tsx      → feedback após leitura (sucesso/erro)
    equipamentos/
      EquipamentoCard.tsx
      EquipamentoList.tsx
    historico/
      LeituraItem.tsx
      HistoricoList.tsx
    ui/                   → componentes shadcn/ui
  hooks/
    useScanner.ts         → lógica de scan (câmera + manual)
    useOfflineSync.ts     → gerencia sync RxDB → Supabase
    useEquipamentos.ts    → query de equipamentos
  lib/
    supabase/
      client.ts           → Supabase browser client
      server.ts           → Supabase server client
    rxdb/
      schema.ts           → schemas das coleções offline
      sync.ts             → lógica de sincronização
    validations/
      scan.ts             → Zod schemas para /api/scan
      equipamento.ts      → Zod schemas para equipamentos
  types/
    index.ts              → tipos compartilhados
supabase/
  migrations/             → migrations SQL
  seed.sql                → seeds para testes
docs/
  discovery/              → relatórios da Camada 1
  specs/
    features/             → specs técnicas por feature
    flows/                → UX flows por feature
  decisions/              → ADRs
```

---

## Features do MVP

### Feature 1 — Scan de Serial Number

**Objetivo:** Operário registra o uso de um equipamento em 1–2 taps.

**Fluxo principal:**
1. Operário abre o app → vai direto para `/scan`
2. Câmera ativa automaticamente
3. Operário aponta para QR code / barcode **ou** digita o serial manualmente
4. App exibe feedback imediato: nome do equipamento + confirmação de registro
5. Leitura é salva localmente (RxDB) e sincronizada com Supabase quando online

**Dados capturados na leitura:**
- `serial_number` (string, obrigatório)
- `operario_id` (do usuário logado)
- `timestamp` (gerado no cliente)
- `latitude` / `longitude` (geolocalização, opcional — somente se permissão concedida)
- `synced` (boolean, controle de sync offline)

**Regras de negócio:**
- Um equipamento pode ser lido por múltiplos operários (sem controle de "posse exclusiva" no MVP)
- Leitura de serial desconhecido é permitida — o serial é registrado mesmo que não exista cadastro prévio do equipamento
- Operário só vê suas próprias leituras; supervisor vê todas

**Estados da tela:**
- `idle` — câmera ativa, aguardando scan
- `scanning` — processando leitura
- `success` — serial lido, exibe nome do equipamento (ou "Equipamento não cadastrado" se serial novo)
- `error` — falha na câmera ou serial inválido
- `offline` — sem internet, leitura salva localmente com indicador visual

---

### Feature 2 — Histórico de Leituras

**Objetivo:** Operário consulta o que registrou; supervisor consulta tudo.

**Fluxo:**
1. Operário acessa `/historico`
2. Lista de leituras em ordem cronológica decrescente
3. Cada item: serial number, nome do equipamento (se cadastrado), timestamp, indicador online/offline

**Regras de negócio:**
- Operário com role `worker` vê apenas suas leituras
- Usuário com role `supervisor` vê leituras de todos os operários
- Paginação: 20 itens por página

**Estados:**
- `loading` — skeleton
- `empty` — "Nenhuma leitura registrada ainda"
- `error` — "Erro ao carregar histórico. Tente novamente."
- `success` — lista de leituras

---

### Feature 3 — Lista de Equipamentos

**Objetivo:** Consultar equipamentos cadastrados e ver quem usou por último.

**Fluxo:**
1. Usuário acessa `/equipamentos`
2. Lista de equipamentos com serial, nome, último operário e timestamp da última leitura
3. Clica num equipamento → `/equipamentos/[serial]` → histórico completo daquele serial

**Regras de negócio:**
- Equipamentos são criados automaticamente na primeira leitura de um serial desconhecido (com `nome = null`)
- Supervisor pode editar o nome do equipamento
- Operário vê a lista mas não edita

**Estados:**
- `loading` → `empty` → `error` → `success` (padrão)

---

## Modelo de Dados

### Tabela `equipamentos`

```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
serial      text NOT NULL UNIQUE
nome        text
criado_em   timestamptz DEFAULT now()
```

### Tabela `leituras`

```sql
id             uuid PRIMARY KEY DEFAULT gen_random_uuid()
serial         text NOT NULL REFERENCES equipamentos(serial)
operario_id    uuid NOT NULL REFERENCES auth.users(id)
registrado_em  timestamptz NOT NULL
latitude       numeric(9,6)
longitude      numeric(9,6)
criado_em      timestamptz DEFAULT now()
```

### Tabela `perfis`

```sql
id      uuid PRIMARY KEY REFERENCES auth.users(id)
nome    text NOT NULL
role    text NOT NULL CHECK (role IN ('worker', 'supervisor'))
```

### RLS

- `leituras`: worker lê apenas as próprias; supervisor lê todas
- `equipamentos`: todos os autenticados leem; somente supervisor edita
- `perfis`: usuário lê apenas o próprio perfil

---

## Endpoints da API

### `POST /api/scan`

**Payload:**
```json
{
  "serial": "ABC-12345",
  "registrado_em": "2026-04-21T14:00:00Z",
  "latitude": -23.5505,
  "longitude": -46.6333
}
```

**Respostas:**
- `201` — leitura registrada
- `400` — payload inválido
- `401` — não autenticado

### `GET /api/equipamentos`

**Query params:** `?page=1&limit=20&q=<serial ou nome>`  
**Resposta:** `200` com lista paginada de equipamentos

### `GET /api/equipamentos/[serial]`

**Resposta:** `200` com equipamento + últimas 20 leituras | `404` se não encontrado

### `GET /api/historico`

**Query params:** `?page=1&limit=20`  
**Resposta:** `200` com leituras do operário logado (ou todas, se supervisor)

---

## Code Style

### Nomenclatura

```typescript
// Arquivos: kebab-case
scan-result.tsx
use-scanner.ts

// Componentes: PascalCase
export function ScanResult({ ... }) {}

// Hooks: camelCase com prefixo "use"
export function useScanner() {}

// Utilitários: camelCase
export function formatSerial(serial: string) {}

// Tipos: PascalCase
type Leitura = { ... }
interface EquipamentoProps { ... }
```

### Sem `any`

```typescript
// ❌ Errado
const data: any = await res.json()

// ✅ Correto
const data: LeituraResponse = await res.json()
```

### Validação com Zod

```typescript
// lib/validations/scan.ts
import { z } from 'zod'

export const scanSchema = z.object({
  serial: z.string().min(1).max(100),
  registrado_em: z.string().datetime(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
})
```

### Formato de erro da API

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Serial number é obrigatório",
    "fields": { "serial": ["Required"] }
  }
}
```

### Componente com todos os estados

```typescript
export function HistoricoList() {
  const { data, isLoading, error } = useHistorico()

  if (isLoading) return <HistoricoSkeleton />
  if (error) return <ErrorState message="Erro ao carregar histórico" onRetry={refetch} />
  if (!data?.length) return <EmptyState message="Nenhuma leitura registrada" />

  return <ul>{data.map(l => <LeituraItem key={l.id} leitura={l} />)}</ul>
}
```

---

## Estratégia de Testes

### Unitários (Vitest)

- Localização: `src/**/__tests__/*.test.ts(x)`
- Cobertura mínima: **80%** nos arquivos tocados pela feature
- O que testar: validações Zod, hooks, utilitários puros

```typescript
// src/lib/validations/__tests__/scan.test.ts
describe('scanSchema', () => {
  it('aceita serial válido', () => {
    expect(scanSchema.safeParse({ serial: 'ABC-123', registrado_em: '...' }).success).toBe(true)
  })
  it('rejeita serial vazio', () => {
    expect(scanSchema.safeParse({ serial: '' }).success).toBe(false)
  })
})
```

### Integração (Vitest + Supabase real)

- Banco de teste real (nunca mockado)
- Cobrir: caminho feliz, input inválido, não autenticado, não autorizado

### E2E (Playwright)

- Cobrir o happy path completo: login → scan → histórico
- Testar comportamento offline (intercept de rede)

---

## Critérios de Aceite do MVP

- [ ] Operário consegue escanear um QR/barcode e ver confirmação em menos de 3 segundos
- [ ] Leitura é salva offline e sincronizada ao reconectar
- [ ] Indicador visual claro quando o app está offline
- [ ] Histórico carrega as últimas 20 leituras do operário
- [ ] Lista de equipamentos exibe serial, nome e última leitura
- [ ] Supervisor vê leituras de todos os operários
- [ ] Nenhum endpoint sem validação de input
- [ ] Nenhum endpoint sem verificação de autenticação
- [ ] TypeScript sem erros, lint sem warnings
- [ ] Todos os testes passando com cobertura ≥ 80%

---

## Boundaries

### Sempre
- Validar todo input com Zod antes de qualquer operação
- Implementar loading, error e empty em todo componente cliente
- Salvar leitura localmente (RxDB) antes de tentar enviar ao servidor
- Reautorizar no servidor (não confiar em dados do cliente)
- Escrever teste antes do código (TDD)

### Perguntar primeiro
- Adicionar campos novos ao modelo de dados
- Adicionar dependências não previstas nesta spec
- Alterar regras de RLS

### Nunca
- `console.log` em produção
- `any` em TypeScript
- Mockar banco em teste de integração
- Editar migration já aplicada
- Implementar feature fora desta spec sem aprovação
- Fazer deploy sem executar `/ship`

---

## Fora do Escopo (MVP)

- Notificações push
- Dashboard com gráficos/analytics avançados
- Gestão de usuários pelo supervisor (criar/excluir contas)
- Integração com ERP ou CMMS externo
- Suporte a RFID
- App nativo (iOS/Android via Capacitor) — fica para sprint 2
- Modo multi-empresa (multi-tenant) — fica para sprint 3
- Pagamentos / billing — fica para sprint 3
