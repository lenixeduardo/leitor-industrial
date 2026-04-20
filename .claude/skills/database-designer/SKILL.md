---
name: database-designer
description: Cria migrations idempotentes, seeds e RLS a partir de uma spec. Use when a feature spec defines a data model that needs database migrations, Row Level Security policies, or seed data.
---

# Database Designer

## Overview

Gera migrations SQL, seeds e policies de RLS a partir da spec da feature.

## When to Use

- Ao iniciar o passo 2 do pipeline de execução (Database)
- Quando uma spec define modelo de dados novo ou alterado
- Quando RLS precisa ser configurada para uma nova tabela

## Process

1. Ler modelo de dados em `docs/specs/features/{{feature}}.md`
2. Verificar migrations existentes em `supabase/migrations/` para evitar conflitos
3. Gerar migration SQL com `up` e `down`
4. Gerar seeds mínimas para testes em `supabase/seed.sql`
5. Definir policies de Row Level Security
6. Testar migration em banco limpo
7. Testar migration em banco já populado

### Formato da migration

```sql
-- Migration: YYYYMMDDHHMM_<feature>.sql
-- Up
CREATE TABLE IF NOT EXISTS ...;
ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...;

-- Down
DROP TABLE IF EXISTS ...;
```

### Formato das RLS policies

```sql
ALTER TABLE <tabela> ENABLE ROW LEVEL SECURITY;

CREATE POLICY "<tabela>_select_own" ON <tabela>
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "<tabela>_insert_own" ON <tabela>
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Output

- `supabase/migrations/YYYYMMDDHHMM_{{feature}}.sql`
- `supabase/seed.sql` atualizado

## Critério de aceite

- [ ] Migration roda em banco limpo sem erro
- [ ] Migration roda em banco já populado sem erro
- [ ] Down migration reverte tudo sem erro
- [ ] RLS bloqueia acesso cruzado entre usuários
- [ ] Seeds populam dados mínimos para os testes da feature passarem

## Red Flags

- Migration sem `IF NOT EXISTS` / `IF EXISTS` (não é idempotente)
- Tabela sem RLS quando armazena dados de usuário
- Foreign keys sem índice na coluna referenciada
