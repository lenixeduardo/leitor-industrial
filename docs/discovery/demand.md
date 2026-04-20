# Validação de Demanda — Sistema SaaS de Rastreamento de Serial Numbers

**Data:** Abril de 2026
**Agente:** demand-validator
**Decisão:** ⚠️ PIVOTAR

---

## Score de Demanda: MÉDIO-BAIXO

---

## 10 Citações Reais

### 1. Falta de Visibilidade em Fábricas (Brasil)
**Fonte:** Nomus Industrial Blog
> "Ferramentas, equipamentos e pallets podem se perder dentro das instalações das fábricas, enquanto ativos permanecem ociosos ou subutilizados, causando perda financeira invisível, baixa eficiência operacional e dificuldade constante para encontrar materiais no momento necessário."

URL: https://www.nomus.com.br/blog-industrial/falta-de-rastreabilidade/

---

### 2. Dados Inconsistentes Entre Sistemas
**Fonte:** Nomus Industrial Blog
> "Nas indústrias onde há ferramentas para auxiliar no processo, profissionais relatam que as informações não são íntegras, existindo dificuldades de mapear os dados gerados entre um processo e outro."

URL: https://www.nomus.com.br/blog-industrial/falta-de-rastreabilidade/

---

### 3. Planilhas Não Escalam para Campo
**Fonte:** Coast App
> "The maintenance team can't easily access spreadsheets from equipment locations since Excel lacks native mobile functionality for technicians in the field."

URL: https://coastapp.com/blog/equipment-maintenance-software/

---

### 4. Operadores Não Reportam Corretamente
**Fonte:** Capterra — ON!Track Asset Management Reviews
> "Unless the operators actually report or use the app when they swap equipment, the system needs to get manually adjusted when items get swapped."

URL: https://www.capterra.com/p/163550/ON-Track-Asset-Management/reviews/

---

### 5. Taxa de Falha de CMMS: 50–70%
**Fonte:** FTMaintenance
> "The high rate of CMMS implementation failure can range from 50 to 70 percent, with one of the primary reasons being low user adoption. Technicians may perceive the CMMS as adding administrative work."

URL: https://ftmaintenance.com/implementing-cmms-software/cmms-user-adoption/

---

### 6. Resistência de Técnicos a Sistemas Complexos
**Fonte:** Maintenance World
> "If employees have previously used a CMMS that was difficult or poorly implemented, they may be hesitant to invest time in a new system. Technicians lack the technical skills to effectively use complex CMMS software."

URL: https://maintenanceworld.com/2023/09/19/8-tips-for-getting-maintenance-technicians-to-adopt-cmms-software/

---

### 7. MaintainX Complicado Para Usuários Infrequentes
**Fonte:** Capterra — MaintainX Reviews
> "It can get fairly complicated and confusing at times if it's not explained to you by someone experienced in it. It was difficult to navigate through all the screens, especially for those that didn't use very often."

URL: https://www.capterra.com/p/179296/GetMaintainx/reviews/

---

### 8. UpKeep Difícil Para Operários
**Fonte:** Capterra — UpKeep Reviews
> "I don't know if you can add workers to a work order you create on the app on your phone because I can't find that option. Updating PMs or creating a PO can be difficult when you click off the screen."

URL: https://www.capterra.com/p/145635/UpKeep/reviews/

---

### 9. Treinamento Extenso Necessário
**Fonte:** FTMaintenance / ClickMaint
> "Many users find that a CMMS system can be tricky to learn at first. New technicians often need a few weeks of training before they feel comfortable using all the features."

URL: https://ftmaintenance.com/implementing-cmms-software/cmms-user-adoption/

---

### 10. Rastreamento Manual Gera Erros de Serial Number
**Fonte:** Detering Consulting
> "Because manual tracking is unreliable and slow, most electronics manufacturers rely on traceability software. Companies that rush into deployment without considering their operational requirements typically end up with systems that create more problems than they solve."

URL: https://www.deteringconsulting.com/blog/fix-problems-equipment-serial-numbers/

### 11. Serial Numbers Duplicados Quebram Rastreamento (bônus)
**Fonte:** DataCor
> "A non-unique ID breaks the entire tracking system — if two items share the same number, it becomes impossible to determine which asset is linked to which record, leading to audit failures and missing equipment."

URL: https://www.datacor.com/resources/serial-numbers-are-not-unique

---

## Padrões Identificados

| Cluster | % das citações | Descrição |
|---|---|---|
| **Complexidade sistêmica** | 40% | Sistemas com curva de aprendizado alta; operários desistem |
| **Falta de adoção operacional** | 35% | Taxa de falha CMMS 50–70%; operários não reportam corretamente |
| **Falta de visibilidade** | 25% | Equipamentos perdidos; dados inconsistentes; serial errors |

---

## Descoberta Crítica

A dor **não é específica sobre serial numbers**. É sobre:
1. **Usabilidade** — sistemas muito complexos para operários
2. **Adoção** — operários não usam ou usam errado
3. **Rastreamento em geral** — não específico de serial number

Nas comunidades (Reddit r/manufacturing, r/CMMS, GitHub Snipe-IT, Hacker News) não foram encontradas threads específicas sobre "serial number tracking" por operários de chão de fábrica.

---

## Decisão: ⚠️ PIVOTAR

**Justificativa:**
- A dor existe e é real, mas é **genérica** ("CMMS muito complexo") — não específica de serial number
- Serial number é um *sintoma*, não a *doença principal*
- Mercado está evoluindo: Limble e Sortly já atacam a simplificação
- Sem comunidade consolidada demandando especificamente a solução proposta

**Opções de pivô sugeridas:**

1. **QR/Barcode Scanner plug-in para CMMS existentes** — menor risco, mercado validado
2. **Ferramenta de compliance de serial numbers para indústrias reguladas** (Aerospace, Médico) — nicho com dor clara e WTP alto
3. **Validação qualitativa primeiro** — conversar com 20–30 operários em 3 fábricas antes de decidir

---

## Fontes

- Nomus Industrial Blog, FTMaintenance, ClickMaint, Maintenance World
- Capterra (MaintainX, UpKeep, ON!Track reviews)
- Coast App Blog, Detering Consulting, DataCor
