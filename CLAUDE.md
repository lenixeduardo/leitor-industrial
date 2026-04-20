# leitor-industrial

Sistema de leitura industrial — projeto guiado pelo framework [agent-skills](https://github.com/addyosmani/agent-skills).

## Desenvolvimento com Agent Skills

Este projeto adota o framework agent-skills: workflows de engenharia de produção que guiam o desenvolvimento desde a especificação até o deploy.

### Comandos Disponíveis

| Comando | Fase | Descrição |
|---------|------|-----------|
| `/spec` | Define | Coleta requisitos e cria `SPEC.md` antes de codificar |
| `/plan` | Plan | Divide o trabalho em tarefas verificáveis com critérios de aceitação |
| `/build` | Build | Implementação incremental com TDD (RED → GREEN → REFACTOR) |
| `/test` | Verify | Ciclo TDD completo e padrão Prove-It para correção de bugs |
| `/review` | Review | Revisão em 5 eixos: correção, legibilidade, arquitetura, segurança, performance |
| `/code-simplify` | Review | Simplificação de código preservando comportamento exato |
| `/ship` | Ship | Checklist pré-deploy para produção |

### Ciclo de Desenvolvimento

```
DEFINE  →  PLAN  →  BUILD  →  VERIFY  →  REVIEW  →  SHIP
 /spec     /plan    /build     /test      /review    /ship
```

## Skills por Fase

**Define:** `spec-driven-development`
**Plan:** `planning-and-task-breakdown`
**Build:** `incremental-implementation`, `test-driven-development`, `context-engineering`, `source-driven-development`, `frontend-ui-engineering`, `api-and-interface-design`
**Verify:** `browser-testing-with-devtools`, `debugging-and-error-recovery`
**Review:** `code-review-and-quality`, `code-simplification`, `security-and-hardening`, `performance-optimization`
**Ship:** `git-workflow-and-versioning`, `ci-cd-and-automation`, `deprecation-and-migration`, `documentation-and-adrs`, `shipping-and-launch`

Skills disponíveis localmente em `skills/<nome>/SKILL.md`.

## Estrutura do Projeto

```
.claude/
  commands/           → Slash commands (/spec, /plan, /build, /test, /review, /code-simplify, /ship)
skills/               → Definições das skills de engenharia
tasks/                → Plano e checklist gerados pelo /plan (tasks/plan.md, tasks/todo.md)
SPEC.md               → Especificação do projeto (gerada pelo /spec)
CLAUDE.md             → Este arquivo
AGENTS.md             → Guia para agentes de IA
```

## Regras do Projeto

**Sempre:**
- Executar `/spec` antes de começar qualquer novo recurso
- Executar `/plan` após aprovação da spec
- Escrever testes antes do código (TDD)
- Commitar em incrementos pequenos e verificáveis

**Perguntar primeiro:**
- Mudanças arquiteturais significativas
- Adição de novas dependências
- Alterações no schema do banco de dados

**Nunca:**
- Implementar sem spec e plano aprovados
- Fazer deploy sem executar o checklist do `/ship`
- Commitar segredos ou credenciais
- Pular testes para acelerar
