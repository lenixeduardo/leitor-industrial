# Estado atual da sessão — 2026-04-22

## Em andamento

- Fase: BUILD completo (Slices 1–7)
- Próximo passo: deploy Vercel (Slice 7 parcial — infra pendente)

## O que foi entregue

### Slice 1 — Fundação + Auth
- Next.js 15 + TypeScript strict + Tailwind + shadcn/ui (manual)
- Supabase browser/server clients, tipos compartilhados
- Login page + middleware + redirect automático (/ → /scan ou /login)
- BottomNav (Scan / Histórico / Ativos)

### Slice 2 — Banco de Dados
- `supabase/migrations/202604210001_initial.sql`: perfis, equipamentos, leituras, índices
- `supabase/migrations/202604210002_rls.sql`: RLS worker/supervisor
- `supabase/seed.sql`: 2 usuários, 3 equipamentos, 5 leituras

### Slice 3 — Scan Online
- `scanSchema` com Zod (10 testes passando)
- `POST /api/scan`: auth, validação, upsert equipamento, insert leitura
- ScannerCamera (qr-scanner), ManualInput, ScanResult
- /scan page com tabs Câmera / Manual

### Slice 4 — Offline + Sync
- RxDB + Dexie: coleção `leituras_pendentes`
- `syncPendingLeituras()`: flush automático ao reconectar
- `useOfflineSync` hook: isOnline, pendingCount, syncing
- `useScanner` atualizado: offline-first (salva local antes da API)
- OfflineBanner: banner fixo no topo quando offline
- Serwist service worker + manifest PWA

### Slice 5 — Histórico
- `GET /api/historico`: paginação, worker vs supervisor, join com equipamentos
- LeituraItem, HistoricoSkeleton, HistoricoList (skeleton/empty/error/load-more)
- /historico page completo

### Slice 6 — Equipamentos
- `GET /api/equipamentos`: paginação, busca (serial/nome), última leitura
- `GET /api/equipamentos/[serial]`: detalhes + 20 últimas leituras, 404 se não existe
- EquipamentoCard, EquipamentoList (search debounced 300ms)
- /equipamentos page + /equipamentos/[serial] page (SSR)

### Slice 7 — Quality Gate
- `pnpm typecheck`: zero erros
- `pnpm lint`: zero warnings/errors
- `pnpm test`: 14 testes passando (2 suites)

## Bloqueios

- Sem Supabase real configurado (env vars): testes de integração contra banco real pendentes
- Ícones PWA (icons/icon-192.png, icons/icon-512.png) não gerados — necessário antes do deploy
- Deploy Vercel: conectar repo + configurar env vars no dashboard

## Próximo passo

1. Criar ícones PWA em `public/icons/`
2. Configurar variáveis de ambiente no Vercel
3. `pnpm build` para verificar build de produção
4. Deploy via git push para Vercel

## Decisões arquiteturais ativas

- Asset-based pricing (não per-user)
- Offline-first: RxDB local → sync automático
- RLS: worker vê apenas próprias leituras; supervisor vê todas
- qr-scanner (não @zxing/library) — menor bundle, melhor mobile
