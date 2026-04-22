# /monitor — Monitoramento e Alertas

Configura e verifica a saúde do sistema em produção.

## Checks

### 1. Uptime e disponibilidade
- Uptime >= 99.9% no mês corrente
- Alertas de downtime configurados (< 1min para notificar)
- Status page pública atualizada

### 2. Error budget
- Taxa de erros 5xx < 0.1% das requisições
- Alertas disparados ao ultrapassar threshold
- Erros agrupados por tipo e frequência no dashboard

### 3. Logs
- Logs estruturados em produção (JSON)
- Retenção mínima de 30 dias
- Alertas para padrões de erro recorrentes

### 4. Alertas configurados
- [ ] Downtime > 1 minuto
- [ ] Taxa de erro > 1%
- [ ] Latência p95 > 1s por 5 minutos
- [ ] Uso de disco > 80%
- [ ] Falha em jobs agendados (cron)

### 5. Dashboards
- Requisições por minuto (RPM)
- Latência p50/p95/p99
- Taxa de erro por endpoint
- Usuários ativos (DAU/MAU)
- Métricas de negócio (conversão, churn, MRR)

## Output

- `docs/audits/monitor-{{data}}.md` com estado atual de cada check
- Issues abertas para alertas não configurados
- Link para dashboard principal

## Ferramentas sugeridas

- Sentry (erros)
- Vercel Analytics / Datadog (performance)
- BetterStack / UptimeRobot (uptime)
- Supabase Dashboard (banco)
