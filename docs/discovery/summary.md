# Discovery Summary — Leitor Industrial

**Data:** Abril de 2026
**Produto:** Sistema SaaS de leitura e rastreamento de serial numbers para operários industriais
**Decisão Final:** ✅ SEGUIR

---

## Consolidação dos 6 Agentes

### 1. Market Analyst
- **TAM Global:** USD 20–24 bi (asset tracking software, 2024)
- **SAM Brasil:** USD 1,0–1,9 bi
- **CAGR:** 10,5–13,25%
- **Timing:** Janela de oportunidade 2025–2026 no Brasil antes da consolidação regional
- **Segmentos prioritários:** Manufatura (45/60) e Mineração (45/60)
- **Veredito:** Mercado forte, crescendo acima da média

### 2. Competitor Hunter
- **White space confirmado:** Nenhum concorrente combina serial-first + UX para operário + offline-true + asset-based pricing
- **Mais próximos:** MaintainX (CMMS-first, não serial-first), Sortly (simples mas lento), GoCodes (campo-ready mas caro)
- **Diferencial defensável:** Preço por ativo (não por usuário) + 1 tap para scan + offline 100%
- **Veredito:** Posicionamento diferenciado possível

### 3. Pricing Engineer
- **Modelo recomendado:** Asset-based tiered + freemium (sem per-user)
- **Tiers:** Pilot (free, 10 ativos) → Starter ($55–$115/mês) → Growth ($200–$800/mês) → Enterprise (custom)
- **LTV:CAC estimado:** 57:1 a 184:1 por tier
- **ARR projetado Y1 (50 clientes):** $243.600
- **Gross margin:** 80–87%
- **Veredito:** Modelo economicamente viável e diferenciado

### 4. Demand Validator
- **Score:** Médio-baixo
- **Citações reais encontradas:** 11 (limiar mínimo: 10)
- **Resultado do agente:** PIVOTAR
- **Decisão do founder:** Opção A — manter foco em serial number (validação própria)
- **Nota:** A dor rastreada (CMMS complexo para operários) é real com taxa de falha de 50–70% nos sistemas existentes

### 5. Tool Scout
- **Stack MVP:** Next.js 15 + Supabase + qr-scanner + RxDB + Serwist (PWA)
- **Custo infra MVP:** ~$5/mês (free tiers)
- **Custo 100–1K usuários:** ~$106–$140/mês
- **Risco de vendor lock-in:** BAIXO (PostgreSQL aberto, Next.js portável, scanning open-source)
- **Prazo MVP:** 15 dias viável com o stack definido
- **Veredito:** Stack validado, baixo risco técnico

### 6. SEO Validator
- **Oportunidade PT-BR:** Alta — concorrentes não cobrem conteúdo local para operários
- **Keyword #1:** "rastreamento de equipamentos industriais" [1.000–1.500/mês, PT-BR]
- **Quick win:** "como rastrear equipamentos fábrica" [dificuldade BAIXA, 0 exact match]
- **Gap principal:** Zero conteúdo PT-BR específico para operários de chão de fábrica
- **Veredito:** Canal orgânico viável com investimento baixo

---

## Matriz de Decisão

| Critério | Resultado | Peso | Score |
|---|---|---|---|
| Tamanho de mercado | USD 20 bi, CAGR 13% | Alto | ✅ |
| White space competitivo | Confirmado | Alto | ✅ |
| Modelo de precificação | Diferenciado, LTV:CAC 57:1+ | Alto | ✅ |
| Validação de demanda | Parcial (citações genéricas) | Alto | ⚠️ |
| Viabilidade técnica | Stack validado, 15 dias | Médio | ✅ |
| Oportunidade SEO | Alta em PT-BR | Médio | ✅ |

---

## Decisão: ✅ SEGUIR

**Justificativa:**
1. Mercado grande e crescendo (TAM $20 bi, CAGR 13%)
2. White space real — nenhum concorrente domina o quadrante serial-first + operário + offline + asset pricing
3. Modelo econômico validado com LTV:CAC excepcional
4. Stack técnico viável em 15 dias com custo ~$5/mês
5. Canal orgânico disponível com baixa concorrência em PT-BR
6. Founder tem validação própria além do discovery (Opção A)

**Ressalva registrada:** Demand validator não encontrou comunidade ativa reclamando especificamente de serial number tracking. Recomenda-se coletar feedback qualitativo com operários reais nas primeiras 4 semanas pós-lançamento.

---

## Próximo Passo: `/spec`

Com o discovery concluído, passar para a Camada 2 (Planning):

```
PRÓXIMO COMANDO: /spec
CONTEXTO: Usar docs/discovery/ como input para definir MVP
FOCO: Feature mínima que valida a hipótese em 15 dias
```

### Hipótese central a validar no MVP:
> Operários de fábrica usarão um app ultra-simples para escanear serial numbers de equipamentos se o fluxo for de 1–2 taps e funcionar offline.

### 3 features core candidatas ao MVP:
1. Scan de serial (câmera/barcode/QR/digitação manual)
2. Histórico de leituras por operário
3. Lista de equipamentos com última localização

---

## Arquivos gerados nesta Discovery

```
docs/discovery/
  market.md       ✅ TAM/SAM/SOM, segmentos, tendências, riscos
  competitors.md  ✅ 10 diretos, 5 indiretos, white space
  pricing.md      ✅ Modelo asset-based, tiers, LTV/CAC
  demand.md       ⚠️ PIVOTAR (agente) → SEGUIR (founder, Opção A)
  tools.md        ✅ Stack validado, custos por tier
  seo.md          ✅ 25 keywords, estratégia 90 dias
  summary.md      ✅ Este arquivo
```
