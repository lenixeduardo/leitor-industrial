# /discovery — Camada 1: Validação de Mercado

Roda os 6 agentes de discovery em sequência antes de qualquer linha de código.

## Quando usar

Antes de iniciar qualquer novo produto ou feature estratégica.

## Fluxo

```
FASE 1 — paralelo
  → market-analyst     (TAM/SAM/SOM, segmentos, tendências)
  → competitor-hunter  (10 diretos, 5 indiretos, matriz de posicionamento)

FASE 2 — com outputs da Fase 1
  → pricing-engineer   (modelos de precificação, LTV estimado)
  → demand-validator   (10 citações reais, score de demanda)

FASE 3 — paralelo
  → tool-scout         (stack recomendado, custo de infra)
  → seo-validator      (keywords, volume, gaps de conteúdo)

GATE — consolidação
  → Criar docs/discovery/summary.md
  → Se demand-validator = PARAR: interromper todo o fluxo
  → Se demand-validator = PIVOTAR: revisar ideia antes de continuar
```

## Inputs necessários

- `{{ideia}}` — descrição do produto em 1–3 frases
- `{{publico}}` — público-alvo com especificidade (cargo, setor, empresa)
- `{{restricoes}}` — tempo disponível, orçamento, stack preferida (opcional)

## Outputs

```
docs/discovery/
  market.md       → análise de mercado
  competitors.md  → mapeamento competitivo
  pricing.md      → modelos de precificação
  demand.md       → validação de demanda
  tools.md        → stack e ferramentas
  seo.md          → oportunidades de busca orgânica
  summary.md      → consolidação e decisão final
```

## Critério de aceite

- Todos os 6 relatórios gerados
- `summary.md` com decisão explícita: SEGUIR / PIVOTAR / PARAR
- Se SEGUIR: passar para `/spec`
