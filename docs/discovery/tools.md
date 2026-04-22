# Stack Técnico e Ferramentas — Sistema SaaS de Leitura de Serial Numbers

**Data:** Abril de 2026
**Agente:** tool-scout
**Restrições:** MVP 15 dias, Next.js 15 + Supabase, offline-first, mobile-first

---

## 1. Stack Recomendado

| Camada | Recomendação | Alternativa | Justificativa |
|---|---|---|---|
| **Frontend Web** | Next.js 15 + TypeScript | Remix | App Router, PWA via Serwist, deploy Vercel instantâneo |
| **Mobile** | PWA (Next.js) + Capacitor | Expo / React Native | PWA-first para 15 dias: sem App Store review; Capacitor quando precisar de nativo |
| **Banco de dados** | Supabase (PostgreSQL) | Neon, AWS RDS | Free tier robusto (50K MAUs, 500MB storage); auth integrada; realtime |
| **Auth** | Supabase Auth | Clerk, Auth0 | Incluída no Supabase, gratuita até 50K MAUs |
| **Sync offline** | RxDB + SQLite (Capacitor) | PouchDB, WatermelonDB | Offline-first maduro, queries reativas, persiste no filesystem (não na memória) |
| **Scanning** | qr-scanner | html5-qrcode, ZXing | Web Worker → não trava UI; leve; open-source; melhor performance mobile |
| **Deploy** | Vercel | Railway, Netlify | Free tier 100GB/mês; GitHub integration automática |
| **Storage** | Supabase Storage | Cloudflare R2 | 1GB free; integrado; egress $0.09/GB após 5GB |
| **Monitoring** | Sentry (free) | Datadog | 5K events/mês grátis; developer-friendly |
| **Analytics** | PostHog (free) | Plausible, Mixpanel | 1M eventos/mês grátis; feature flags, session replay |

---

## 2. Ferramentas de Terceiros

| Ferramenta | Função | MVP | Escala |
|---|---|---|---|
| **Stripe** | Pagamento | $0 (cobra ao vender) | 2,9% + $0,30/transação |
| **Mailgun** | Email transacional | $0 (100 emails/dia) | $35/mês (50K emails) |
| **Sentry** | Error tracking | $0 | $26/mês (Team) |
| **PostHog** | Product analytics | $0 | $450+/mês (scale) |
| **Capacitor** | Bridge iOS/Android | $0 (open-source) | $0 |

---

## 3. Custo Mensal de Infra por Tier

| Componente | 0–100 users | 100–1K users | 1K–10K users |
|---|---|---|---|
| Supabase | $0 (free) | $0–$25 | $25 + overages |
| Vercel | $0 (Hobby) | $20 (Pro) | $20 + bandwidth |
| Mailgun | $0 | $35 | $35–$90 |
| Stripe | $0 | 2,9% da receita | 2,9% da receita |
| Sentry | $0 | $26 | $26–$80 |
| PostHog | $0 | $0 | $450+ |
| **TOTAL** | **~$5/mês** | **~$106–$140/mês** | **~$239–$1.239/mês** |

---

## 4. Vendor Lock-in

| Dependência | Risco | Mitigação |
|---|---|---|
| Supabase (PostgreSQL) | **BAIXO** | PostgreSQL aberto; dump SQL migra em 1–2 dias |
| Vercel | **MÉDIO** | Next.js roda em Railway/self-hosted; evitar Edge Functions vendor-specific |
| Stripe | **ALTO** | Histórico de transações travado; backup webhooks em PostgreSQL |
| Mailgun | **BAIXO** | Mudança em 1h (SPF/DKIM); multi-provider fácil |
| Sentry | **MÉDIO** | Self-host community edition disponível |
| PostHog | **BAIXO** | Open-source; self-host sem migração |
| Capacitor | **MUITO BAIXO** | Open-source; substituível por RN puro |
| qr-scanner | **MUITO BAIXO** | Open-source; troca por jsQR/ZXing trivial |

---

## 5. Solução Offline + Scanning

### Scanning — qr-scanner (recomendado)
- Web Worker → não bloqueia UI
- Suporta QR, EAN, Code 128 e outros formatos industriais
- Fallback: `<input type="file" capture="environment">` para dispositivos sem Web API

### Arquitetura Offline-First

```
PWA (Next.js 15 + Serwist)
  ├── Service Worker → cache assets + offline page
  └── RxDB + SQLite (local)
        ├── Persiste scans offline
        └── Sincroniza com Supabase quando online (event: 'online')
```

### PWA vs Expo vs React Native

| | PWA (Next.js) | Expo | Bare RN |
|---|---|---|---|
| **Tempo MVP** | **7 dias** | 10 dias | 15+ dias |
| **App Store** | Não | Sim | Sim |
| **Offline** | Service Worker + RxDB | RxDB + SQLite | RxDB + SQLite |
| **Camera/Scan** | Web API | Expo Camera | Native plugin |
| **Recomendação MVP** | ✅ | — | — |

---

## 6. Cronograma 15 Dias

| Sprint | Entregas | Dias |
|---|---|---|
| Setup | Next.js 15 + Supabase + schema | D1–2 |
| Frontend | shadcn/ui: login, dashboard, lista serials | D3–4 |
| Scanning | qr-scanner integrado + test câmera mobile | D5–7 |
| Offline | RxDB + SQLite + Serwist | D8–10 |
| API | POST /api/scan, GET /api/serials, sync webhook | D11–13 |
| Deploy | Vercel + PWA manifest + testes | D14–15 |

---

## 7. Stack Final (JSON)

```json
{
  "frontend": {
    "framework": "Next.js 15",
    "language": "TypeScript",
    "ui": "shadcn/ui + Tailwind",
    "scanning": "qr-scanner",
    "offline": "Serwist (PWA)",
    "db-offline": "RxDB + SQLite"
  },
  "backend": {
    "auth": "Supabase Auth",
    "database": "Supabase (PostgreSQL)",
    "storage": "Supabase Storage",
    "api": "Next.js API routes"
  },
  "infra": {
    "deploy": "Vercel",
    "monitoring": "Sentry (free)",
    "analytics": "PostHog (free)"
  },
  "integracoes": {
    "payment": "Stripe",
    "email": "Mailgun",
    "mobile": "Capacitor (pós-MVP)"
  },
  "custo_mvp": "~$5/mês"
}
```

---

## Fontes

- Supabase Pricing (abril 2026): supabase.com/pricing
- Vercel Pricing: vercel.com/pricing
- Mailgun Pricing: mailgun.com/pricing
- Stripe Fees: stripe.com/pricing
- Sentry Pricing: sentry.io/pricing
- PostHog Pricing: posthog.com/pricing
- RxDB Capacitor Guide: rxdb.info/capacitor-database.html
- Next.js PWA Guide: nextjs.org/docs/app/guides/progressive-web-apps
- PWA vs Expo (2026): appik-studio.ch/en/blog/pwa-vs-native-app-expo-best-choice
