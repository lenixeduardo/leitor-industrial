# leitor-industrial — regras globais

Sistema de leitura industrial — projeto guiado pelo framework [agent-skills](https://github.com/addyosmani/agent-skills) e pela arquitetura SaaS de 5 camadas.

## Stack

- Next.js 15 (app router)
- TypeScript strict
- Supabase (auth + db + storage)
- Tailwind + shadcn/ui
- Vitest + Playwright

## Princípios

- Clareza > cleverness
- Nenhum endpoint sem validação e teste
- Nenhum componente cliente sem estados de loading/erro/vazio
- Nunca mockar banco em teste de integração
- Discovery antes de qualquer linha de código
- Spec aprovada antes de liberar execução

## Padrões

- Arquivos em kebab-case
- Componentes em PascalCase
- Hooks custom em `/hooks`, prefixo `use`
- Utilitários puros em `/lib`
- Migrations em `supabase/migrations/YYYYMMDDHHMM_<feature>.sql`
- Relatórios de discovery em `docs/discovery/`
- Specs de features em `docs/specs/features/`
- Decisões arquiteturais em `docs/decisions/`

## Proibido

- `console.log` em produção
- `any` em TypeScript
- Editar migrations já aplicadas (criar nova)
- Depender de secrets fora de `.env.local`
- Implementar sem spec aprovada
- Fazer deploy sem executar o checklist do `/ship`
- Commitar segredos ou credenciais
- Pular testes para acelerar

## Quando tiver dúvida

- Ler `docs/specs/features/<feature>.md`
- Consultar `current-state.md` para contexto da sessão
- Nunca inventar comportamento fora da spec

---

## Desenvolvimento com Agent Skills

Este projeto adota o framework agent-skills: workflows de engenharia de produção que guiam o desenvolvimento desde a especificação até o deploy.

### Comandos Disponíveis

| Comando | Fase | Descrição |
|---------|------|-----------|
| `/discovery` | Discovery | Roda os 6 agentes de validação de mercado |
| `/spec` | Define | Coleta requisitos e cria `SPEC.md` antes de codificar |
| `/plan` | Plan | Divide o trabalho em tarefas verificáveis com critérios de aceitação |
| `/build` | Build | Implementação incremental com TDD (RED → GREEN → REFACTOR) |
| `/test` | Verify | Ciclo TDD completo e padrão Prove-It para correção de bugs |
| `/review` | Review | Revisão em 5 eixos: correção, legibilidade, arquitetura, segurança, performance |
| `/code-simplify` | Review | Simplificação de código preservando comportamento exato |
| `/ship` | Ship | Checklist pré-deploy para produção |
| `/security` | Post-launch | Auditoria de segurança completa |
| `/performance` | Post-launch | Core Web Vitals, p95 de APIs, query plans |
| `/seo` | Post-launch | Meta tags, sitemap, schema, canonical, OG |
| `/monitor` | Post-launch | Alertas, dashboards, error budget |

### Ciclo de Desenvolvimento

```
DISCOVERY → DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP
/discovery   /spec   /plan  /build   /test   /review  /ship
```

### Skills por Fase

**Discovery:** agentes em `.claude/agents/`
**Define:** `spec-driven-development`
**Plan:** `planning-and-task-breakdown`
**Build:** `incremental-implementation`, `test-driven-development`
**Execution Pipeline:** `database-designer`, `backend-builder`, `frontend-builder`, `design-polish`, `test-runner`, `quality-gate`
**Verify:** `browser-testing-with-devtools`, `debugging-and-error-recovery`
**Review:** `code-review-and-quality`, `code-simplification`, `security-and-hardening`, `performance-optimization`
**Ship:** `git-workflow-and-versioning`, `ci-cd-and-automation`, `documentation-and-adrs`, `shipping-and-launch`

## Estrutura do Projeto

```
.claude/
  agents/             → Agentes de Discovery e Planning
  commands/           → Slash commands
  skills/             → Skills do pipeline de execução
skills/               → Skills do framework agent-skills
tasks/                → Plano e checklist gerados pelo /plan
docs/
  discovery/          → Relatórios da Camada 1
  specs/
    features/         → Specs técnicas por feature
    flows/            → UX flows por feature
  decisions/          → ADRs
src/                  → Código-fonte
supabase/
  migrations/         → Migrations SQL
  seed.sql            → Seeds para testes
SPEC.md               → Especificação do projeto
CLAUDE.md             → Este arquivo
AGENTS.md             → Guia para agentes de IA
current-state.md      → Estado atual da sessão
```

## Regras do Projeto

**Sempre:**
- Executar `/discovery` antes de começar qualquer novo produto
- Executar `/spec` antes de começar qualquer novo recurso
- Executar `/plan` após aprovação da spec
- Escrever testes antes do código (TDD)
- Atualizar `current-state.md` ao mudar de passo no pipeline
- Commitar em incrementos pequenos e verificáveis

**Perguntar primeiro:**
- Mudanças arquiteturais significativas
- Adição de novas dependências
- Alterações no schema do banco de dados

**Nunca:**
- Pular a camada de Discovery
- Implementar sem spec e plano aprovados
- Fazer deploy sem executar o checklist do `/ship`
- Commitar segredos ou credenciais
- Pular testes para acelerar
