# Análise de Precificação — Sistema SaaS de Rastreamento de Serial Numbers

**Data:** Abril de 2026
**Agente:** pricing-engineer

---

## 1. Modelos dos Concorrentes

| Produto | Modelo | Entry | Mid | Enterprise |
|---|---|---|---|---|
| MaintainX | Per-user (freemium) | Free | $16–21/user/mês | Custom |
| UpKeep | Per-user | $20/user/mês | $45–75/user/mês | Custom |
| Limble CMMS | Per-user | Free | $28–69/user/mês | Custom |
| Tractian | Per-user (mín. 5) | $60/user/mês | $100/user/mês | Custom |
| Asset Panda | Hybrid (user + asset) | $3k/ano (5 users) | $7.2k/ano | Custom |
| GoCodes | Per-asset (bundled) | $500/ano (~200 ativos) | $2.2k/ano | $5k/ano |
| Sortly | Flat por empresa | Free | $24–74/mês | Custom |
| Snipe-IT | Dual (OSS + cloud) | Free (self-hosted) | $40–100/mês cloud | $250–5k/mês |

**Problema do per-user no contexto de operários:** cria incentivo perverso — empresa restringe adoção para controlar custo; operários ficam fora do sistema.

---

## 2. Recomendação: Asset-Based Tiered + Freemium

### Por quê asset-based?
- Alinha incentivos: mais ativos rastreados = mais valor entregue
- Não penaliza adoção (unlimited users)
- Diferencia do mercado (todos os CMMS cobram per-user)
- Simples de comunicar ($/ativo/mês)

---

## 3. Tiers Recomendados para o MVP

### Tier 0 — Pilot (Freemium)
- **Preço:** $0 / 30 dias
- **Limites:** até 10 ativos, histórico 30 dias
- **Objetivo:** aquisição viral, prova de valor sem atrito

### Tier 1 — Starter (PME)
- **Preço:** $15/mês fixo + $2/ativo/mês
- **Exemplos:** 20 ativos = $55/mês ($660/ano) | 50 ativos = $115/mês ($1.380/ano)
- **Inclui:** até 500 ativos, 5 usuários simultâneos, histórico 90 dias, relatórios básicos, chat support

### Tier 2 — Growth (Operação completa)
- **Preço:** $50/mês fixo + $1,50/ativo/mês
- **Exemplos:** 100 ativos = $200/mês | 200 ativos = $350/mês | 500 ativos = $800/mês
- **Inclui:** até 2.000 ativos, 20 usuários simultâneos, histórico 1 ano, API, priority support, multi-filial

### Tier 3 — Enterprise
- **Preço:** negociado ($1.500–$5.000/mês estimado)
- **Inclui:** ativos e usuários ilimitados, SLA 15 min, SSO/LDAP, integração ERP/CMMS, data residency

---

## 4. Estimativas de LTV, CAC e Payback

> [assunção] Baseado em benchmarks B2B SaaS 2026 e premissas de mercado

| Tier | MRR médio | LTV (36m, 3% churn) | CAC estimado | LTV:CAC | Payback |
|---|---|---|---|---|---|
| Starter | $85 | $11.500 | $200 | 57:1 | ~5 dias |
| Growth | $350 | $34.500 | $300 | 115:1 | ~2 dias |
| Enterprise | $2.500 | $92.000 | $500 | 184:1 | ~1 dia |

- Gross margin estimada: **80–87%** (SaaS leve, Supabase hosting, suporte async)
- Benchmarks: LTV:CAC saudável = 3:1 mínimo; elite = 4:1+

---

## 5. Projeção Y1 (50 clientes pagantes)

| Tier | Clientes | MRR médio | MRR Total | ARR |
|---|---|---|---|---|
| Starter | 30 | $85 | $2.550 | $30.600 |
| Growth | 15 | $350 | $5.250 | $63.000 |
| Enterprise | 5 | $2.500 | $12.500 | $150.000 |
| **Total** | **50** | **$600** | **$20.300** | **$243.600** |

---

## 6. Estratégia de Entrada Recomendada

**Freemium + Pilot Pago Híbrido** (score 9/10 vs paid-only 3/10 e trial-CC 5/10)

| Fase | Tática | Resultado esperado |
|---|---|---|
| Aquisição (M1–3) | App + web sem CC, 30 dias free | 500–1.000 trials |
| Conversão (M3–6) | In-app onboarding <5 min, email sequence | 18% trial-to-paid |
| Expansão (M6–12) | Upsell ativos, parcerias integradores ERP | +12% expansion/ano |

---

## 7. O Que Evitar

- ❌ Per-user pricing (penaliza operários)
- ❌ Paid-only sem freemium (CAC alto, tração lenta)
- ❌ Mínimo $3k–5k como ERPs (inviável para PME)
- ❌ Cobrança por leitura/scan (fricção desnecessária)

---

## Fontes

- Pricing pages: MaintainX, UpKeep, Limble, Tractian, GoCodes, Asset Panda, Sortly, Snipe-IT
- SaaS Hero (LTV:CAC benchmarks 2026)
- Proven SaaS (CAC Payback benchmarks)
- FirstPageSage (freemium conversion rates)
- Chargebee, Maxio (SaaS pricing models guide)
- Stripe (gross margin SaaS)
