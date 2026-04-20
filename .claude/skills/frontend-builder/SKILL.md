---
name: frontend-builder
description: Implementa componentes React a partir da spec e do UX flow, com todos os estados obrigatórios. Use when a feature spec defines UI components that need to be implemented.
---

# Frontend Builder

## Overview

Implementa componentes, páginas e integração com APIs a partir da spec e do UX flow.

## When to Use

- Ao iniciar o passo 4 do pipeline de execução (Frontend)
- Após backend-builder ter concluído os endpoints

## Process

1. Ler spec em `docs/specs/features/{{feature}}.md`
2. Ler UX flow em `docs/specs/flows/{{feature}}.md`
3. Implementar componentes com todos os estados:
   - loading
   - erro
   - vazio
   - sucesso
4. Integrar com endpoints da API
5. Implementar tratamento de erros visível ao usuário
6. Garantir acessibilidade básica (labels, ARIA, keyboard navigation)

### Estrutura de componente

```typescript
// src/components/<feature>/<Component>.tsx
'use client'

export function Component() {
  const [state, setState] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')

  if (state === 'loading') return <Skeleton />
  if (state === 'error') return <ErrorState message="..." onRetry={...} />
  if (state === 'success' && items.length === 0) return <EmptyState />

  return <div>...</div>
}
```

## Output

- Componentes em `src/components/<feature>/`
- Páginas em `src/app/<rota>/page.tsx`

## Critério de aceite

- [ ] Todos os estados definidos no UX flow implementados
- [ ] Nenhum estado de loading faltando
- [ ] Erros exibidos de forma legível ao usuário (não stacktrace)
- [ ] Estado vazio com call-to-action quando aplicável
- [ ] Formulários com feedback de validação inline

## Red Flags

- Componente sem estado de loading
- Erro capturado mas não exibido ao usuário
- `useEffect` com dependências faltando
- Fetch direto no componente sem tratamento de erro
