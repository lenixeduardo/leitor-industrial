# /performance — Auditoria de Performance

Mede e otimiza performance em todas as camadas.

## Checks

### 1. Core Web Vitals
- LCP (Largest Contentful Paint) < 2.5s
- FID / INP (Interaction to Next Paint) < 200ms
- CLS (Cumulative Layout Shift) < 0.1

### 2. APIs
- p50, p95, p99 de latência por endpoint
- Endpoints com p95 > 500ms entram em backlog de otimização
- Nenhuma query N+1

### 3. Banco de dados
- `EXPLAIN ANALYZE` nas queries mais frequentes
- Índices faltantes identificados
- Queries lentas (> 100ms) logadas e revisadas

### 4. Bundle
- Bundle size do JS < 200kb gzipped no first load
- Code splitting funcionando por rota
- Imagens otimizadas (next/image ou equivalente)

### 5. Cache
- Cache headers corretos em assets estáticos
- Cache de queries frequentes no banco
- CDN configurado para assets

## Output

- `docs/audits/performance-{{data}}.md`
- Lista de otimizações priorizadas por impacto
- Comparativo com auditoria anterior (se existir)

## Ferramentas

- Lighthouse (via CLI ou PageSpeed Insights)
- Supabase Dashboard para queries lentas
- Vercel Analytics / similar para Web Vitals reais
