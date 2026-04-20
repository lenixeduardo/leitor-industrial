---
name: backend-builder
description: Implementa endpoints a partir da spec, com validação, autenticação e testes de integração. Use when a feature spec defines API endpoints that need to be implemented.
---

# Backend Builder

## Overview

Implementa rotas, lógica de negócio e testes de integração a partir da spec.

## When to Use

- Ao iniciar o passo 3 do pipeline de execução (Backend)
- Após o database-designer ter concluído as migrations

## Process

1. Ler spec da feature em `docs/specs/features/{{feature}}.md`
2. Criar/atualizar rotas no app router (`src/app/api/`)
3. Implementar validação de input com Zod
4. Implementar lógica de negócio
5. Reautorizar no servidor (nunca confiar apenas no cliente)
6. Escrever testes de integração cobrindo:
   - Caminho feliz
   - Erros de validação
   - Erros de autorização
   - Cenários de borda listados na spec

### Padrão de endpoint

```typescript
// src/app/api/<feature>/route.ts
import { z } from 'zod'

const schema = z.object({ ... })

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  // lógica de negócio
}
```

### Padrão de erro

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "fields": {} } }
```

## Output

- Arquivos de rota em `src/app/api/`
- Testes em `src/app/api/__tests__/`

## Critério de aceite

- [ ] 100% dos critérios de aceite da spec cobertos por teste
- [ ] Nenhum endpoint sem validação de input (Zod)
- [ ] Nenhum endpoint sem verificação de autorização no servidor
- [ ] Erros retornam formato consistente
- [ ] Logs estruturados em cada endpoint

## Red Flags

- `req.body` usado sem validação
- Autorização baseada apenas em dados enviados pelo cliente
- `any` em TypeScript
- `console.log` no código de produção
