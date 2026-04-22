# /security — Auditoria de Segurança

Auditoria de segurança completa. Roda semanal ou sob demanda.

## Checks

### 1. Dependências
- `npm audit` / `pnpm audit`
- Nenhuma vulnerabilidade HIGH ou CRITICAL pendente

### 2. Headers HTTP
- CSP (Content-Security-Policy)
- HSTS (Strict-Transport-Security)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

### 3. Autenticação
- Todas as rotas protegidas de fato protegidas
- Tokens com expiração adequada
- Refresh token rotation ativado

### 4. Autorização
- RLS ativa em todas as tabelas com dado sensível
- Testes cobrindo acesso cruzado entre usuários
- Nenhum endpoint que confia apenas no cliente

### 5. Secrets e configuração
- Nenhum `.env` commitado
- Nenhum token ou credencial hardcoded
- Variáveis de ambiente documentadas em `.env.example`

### 6. Input validation
- Todo input do usuário validado com Zod (ou equivalente)
- Nenhum SQL dinâmico sem parametrização
- Upload de arquivos com validação de tipo e tamanho

## Output

- `docs/audits/security-{{data}}.md` com resultado de cada check
- Issues abertas para tudo que não passou
- PRs bloqueados se encontrar HIGH/CRITICAL

## Frequência recomendada

- Semanal em produção
- Obrigatório antes de qualquer release
