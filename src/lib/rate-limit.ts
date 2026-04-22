// In-memory sliding window rate limiter (per-user, per-minute).
// For multi-instance deployments, replace the Map with Redis (Upstash).

interface WindowEntry {
  count: number
  resetAt: number
}

const store = new Map<string, WindowEntry>()

const WINDOW_MS = 60_000

export function rateLimit(key: string, maxRequests: number): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now >= entry.resetAt) {
    const resetAt = now + WINDOW_MS
    store.set(key, { count: 1, resetAt })
    return { allowed: true, remaining: maxRequests - 1, resetAt }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt }
}
