# /seo — Auditoria de SEO

Valida e otimiza presença orgânica do produto.

## Checks

### 1. On-page
- Title tag único e descritivo em todas as páginas (< 60 chars)
- Meta description em todas as páginas (< 160 chars)
- H1 único por página
- Hierarquia de headings correta (H1 > H2 > H3)

### 2. Dados estruturados
- Schema.org implementado (Organization, Product, FAQ conforme o caso)
- Open Graph tags em todas as páginas públicas
- Twitter Card configurado

### 3. Técnico
- Sitemap.xml gerado e atualizado
- Robots.txt configurado corretamente
- URLs canônicas definidas
- Nenhuma página indexável com conteúdo duplicado
- Core Web Vitals dentro do budget (ver /performance)

### 4. Links
- Nenhum link interno quebrado
- Breadcrumbs implementados onde relevante
- Links externos com `rel="noopener noreferrer"`

### 5. Indexação
- Google Search Console sem erros críticos
- Todas as páginas importantes indexadas
- Nenhuma página importante bloqueada por noindex acidental

## Output

- `docs/audits/seo-{{data}}.md`
- Lista de correções por prioridade (crítico / importante / melhoria)
- Comparativo de posicionamento com auditoria anterior

## Frequência recomendada

- Mensal
- Após qualquer mudança de URL ou estrutura de navegação
