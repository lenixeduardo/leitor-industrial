---
name: test-runner
description: Executa testes unitários, de integração e E2E, e garante cobertura mínima antes do quality gate. Use when the implementation is complete and needs full test verification.
---

# Test Runner

## Overview

Executa e verifica todos os tipos de teste antes do quality gate.

## When to Use

- Ao iniciar o passo 6 do pipeline de execução (Test)
- Após frontend-builder e design-polish concluídos

## Process

1. Rodar testes unitários (`vitest`)
2. Rodar testes de integração (API + banco real, não mockado)
3. Rodar testes E2E para os fluxos principais (`playwright`)
4. Verificar cobertura de código
5. Reportar falhas com contexto suficiente para correção

### Comandos

```bash
# Unitários e integração
pnpm test

# Com cobertura
pnpm test --coverage

# E2E
pnpm test:e2e

# Watch mode
pnpm test --watch
```

### Cobertura mínima

- Linhas: >= 80% nos arquivos tocados pela feature
- Branches: >= 70% nos arquivos tocados

### Cenários obrigatórios por feature

Para cada endpoint:
- [ ] Caminho feliz (200/201)
- [ ] Input inválido (400)
- [ ] Não autenticado (401)
- [ ] Sem permissão (403)
- [ ] Recurso não encontrado (404)
- [ ] Cenários de borda da spec

Para cada componente:
- [ ] Renderiza em estado loading
- [ ] Renderiza em estado de erro
- [ ] Renderiza em estado vazio
- [ ] Renderiza com dados válidos

## Output

- Relatório de cobertura em `coverage/`
- Resultado de cada suite no terminal

## Critério de aceite

- [ ] Todos os testes passando (zero falhas)
- [ ] Cobertura >= 80% nos arquivos tocados
- [ ] Nenhum teste pulado com `.skip` sem justificativa

## Red Flags

- Testes que mockam o banco de dados (usar banco de teste real)
- Testes que dependem de ordem de execução
- `expect(true).toBe(true)` ou assertions triviais
