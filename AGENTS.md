# AGENTS.md

Guia para agentes de IA (Claude Code, Cursor, Copilot, etc.) trabalhando neste repositório.

## Visão Geral

Este projeto usa o framework [agent-skills](https://github.com/addyosmani/agent-skills) para guiar o desenvolvimento com workflows de engenharia de produção sênior. Os skills são instruções estruturadas que os agentes devem seguir rigorosamente.

## Regras Fundamentais

- Se uma tarefa corresponde a um skill, você **DEVE** invocá-lo
- Skills estão em `skills/<skill-name>/SKILL.md`
- Nunca implemente diretamente se um skill se aplica
- Siga as instruções do skill na íntegra

## Mapeamento de Intenção → Skill

| Intenção do Usuário | Skills a Usar |
|---------------------|---------------|
| Novo projeto ou funcionalidade | `spec-driven-development` → `planning-and-task-breakdown` → `incremental-implementation` + `test-driven-development` |
| Planejamento / decomposição | `planning-and-task-breakdown` |
| Bug / falha / comportamento inesperado | `debugging-and-error-recovery` |
| Code review | `code-review-and-quality` |
| Refatoração / simplificação | `code-simplification` |
| Design de API ou interface | `api-and-interface-design` |
| Trabalho de UI / frontend | `frontend-ui-engineering` |
| Deploy / preparação para produção | `shipping-and-launch` |

## Ciclo de Desenvolvimento (Lifecycle Mapping)

```
DEFINE   → spec-driven-development
   ↓
PLAN     → planning-and-task-breakdown
   ↓
BUILD    → incremental-implementation + test-driven-development
   ↓
VERIFY   → debugging-and-error-recovery
   ↓
REVIEW   → code-review-and-quality
   ↓
SHIP     → shipping-and-launch
```

## Comandos Slash Disponíveis

| Comando | Skill Invocado |
|---------|----------------|
| `/spec` | spec-driven-development |
| `/plan` | planning-and-task-breakdown |
| `/build` | incremental-implementation + test-driven-development |
| `/test` | test-driven-development |
| `/review` | code-review-and-quality |
| `/code-simplify` | code-simplification |
| `/ship` | shipping-and-launch |

## Modelo de Execução

Para cada requisição:

1. Determine se algum skill se aplica (mesmo 1% de chance)
2. Invoque o skill apropriado
3. Siga o workflow do skill estritamente
4. Só prossiga à implementação após as etapas obrigatórias (spec, plan, etc.) estarem completas

## Anti-Racionalização

Os seguintes pensamentos estão **errados** e devem ser ignorados:

- "Isso é pequeno demais para um skill"
- "Vou implementar rapidamente isso"
- "Vou reunir contexto primeiro, depois aplico o skill"

Comportamento correto:

- **Sempre verificar e usar os skills primeiro**

## Criando Novos Skills

Para adicionar um novo skill ao projeto:

```
skills/
  {skill-name}/
    SKILL.md        # Definição do skill (obrigatório)
    scripts/        # Scripts bash opcionais
```

### Formato do SKILL.md

```markdown
---
name: {skill-name}
description: {Uma frase descrevendo quando usar este skill, na terceira pessoa.}
---

# {Título do Skill}

## Overview
## When to Use
## Process
## Common Rationalizations
## Red Flags
## Verification
```

Mantenha o SKILL.md abaixo de 500 linhas. Descrições devem começar com o que o skill faz (terceira pessoa) seguido de condições de gatilho ("Use when...").
