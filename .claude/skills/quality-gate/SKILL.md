---
name: quality-gate
description: Última parada antes do merge. Verifica todos os critérios de qualidade e rejeita sem dó se algum falhar. Use when all pipeline steps are complete and the feature is ready for merge review.
---

# Quality Gate

## Overview

Verificação final antes do merge. Se qualquer check falhar, a feature volta ao passo que falhou.

## When to Use

- Ao iniciar o passo 7 do pipeline de execução (Quality Gate)
- Após test-runner ter concluído com sucesso

## Process

Executar todos os checks em ordem. **Qualquer falha interrompe e gera relatório de rejeição.**

## Checks obrigatórios

### Código
- [ ] TypeScript sem erros (`tsc --noEmit`)
- [ ] Lint sem warnings (`eslint`)
- [ ] Nenhum `console.log` no código de produção
- [ ] Nenhum `any` em TypeScript
- [ ] Nenhum `TODO` sem issue vinculada

### Testes
- [ ] Todos os testes passando
- [ ] Cobertura >= 80% nos arquivos tocados
- [ ] Nenhum teste com `.skip` sem justificativa

### Spec
- [ ] 100% dos critérios de aceite da spec verificados
- [ ] Nenhum comportamento implementado fora da spec

### Banco de dados
- [ ] Migration testada em banco limpo
- [ ] Migration testada em banco já populado
- [ ] RLS configurada em todas as tabelas com dado sensível

### Performance
- [ ] Nenhuma query N+1 introduzida
- [ ] p95 de novos endpoints dentro do budget (< 500ms)

### Segurança
- [ ] Nenhum input sem validação
- [ ] Nenhum endpoint sem verificação de autorização
- [ ] `npm audit` sem HIGH/CRITICAL nas novas dependências

## Comandos de verificação

```bash
pnpm tsc --noEmit
pnpm lint
pnpm test --coverage
pnpm audit
```

## Output

- Se TUDO passa: **aprovar merge**
- Se qualquer check falha: gerar `docs/decisions/rejection-{{feature}}-{{data}}.md`
  com o que falhou, qual passo reabrir e o que corrigir

## Critério de aceite

- [ ] Todos os checks marcados como aprovados
- [ ] Relatório de rejeição gerado se algum check falhou
