import { describe, it, expect, beforeEach, vi } from 'vitest'

// reset module state between tests by re-importing with a fresh Map
beforeEach(() => {
  vi.resetModules()
})

describe('rateLimit', () => {
  it('allows first request', async () => {
    const { rateLimit: rl } = await import('../rate-limit')
    const result = rl('user-a', 5)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('counts requests within window', async () => {
    const { rateLimit: rl } = await import('../rate-limit')
    rl('user-b', 3)
    rl('user-b', 3)
    const result = rl('user-b', 3)
    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(0)
  })

  it('blocks after limit exceeded', async () => {
    const { rateLimit: rl } = await import('../rate-limit')
    rl('user-c', 2)
    rl('user-c', 2)
    const result = rl('user-c', 2)
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('isolates keys independently', async () => {
    const { rateLimit: rl } = await import('../rate-limit')
    rl('user-d', 1)
    // user-d is exhausted; user-e should still be allowed
    const blocked = rl('user-d', 1)
    const allowed = rl('user-e', 1)
    expect(blocked.allowed).toBe(false)
    expect(allowed.allowed).toBe(true)
  })

  it('resets after window expires', async () => {
    vi.useFakeTimers()
    const { rateLimit: rl } = await import('../rate-limit')
    rl('user-f', 1)
    const blocked = rl('user-f', 1)
    expect(blocked.allowed).toBe(false)

    // advance past the 60-second window
    vi.advanceTimersByTime(61_000)
    const reset = rl('user-f', 1)
    expect(reset.allowed).toBe(true)
    vi.useRealTimers()
  })
})
