import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Supabase mock ────────────────────────────────────────────────────────────
const mockGetUser = vi.fn()
const mockUpsert  = vi.fn()
const mockInsert  = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  getSupabaseServerClient: async () => ({
    auth: { getUser: mockGetUser },
    from: (table: string) => {
      if (table === 'equipamentos') return { upsert: mockUpsert }
      if (table === 'leituras')     return { insert: () => ({ select: () => ({ single: mockInsert }) }) }
      return {}
    },
  }),
}))

vi.mock('@/lib/env', () => ({
  env: { supabaseUrl: 'http://localhost', supabaseAnonKey: 'anon' },
}))

// ── Rate-limit mock (always allow in tests) ──────────────────────────────────
vi.mock('@/lib/rate-limit', () => ({
  rateLimit: () => ({ allowed: true, remaining: 59, resetAt: Date.now() + 60_000 }),
}))

const { POST } = await import('../route')

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/scan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  mockUpsert.mockResolvedValue({ error: null })
  mockInsert.mockResolvedValue({
    data: { id: 'uuid-1', serial: 'SN-001', registrado_em: '2026-04-22T10:00:00.000Z' },
    error: null,
  })
})

describe('POST /api/scan', () => {
  it('returns 401 when unauthenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const res = await POST(makeRequest({ serial: 'SN-001', registrado_em: '2026-04-22T10:00:00.000Z' }))
    expect(res.status).toBe(401)
  })

  it('returns 400 for empty serial', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    const res = await POST(makeRequest({ serial: '', registrado_em: '2026-04-22T10:00:00.000Z' }))
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error.code).toBe('VALIDATION_ERROR')
  })

  it('returns 400 for invalid registrado_em', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    const res = await POST(makeRequest({ serial: 'SN-001', registrado_em: 'not-a-date' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid JSON body', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    const req = new Request('http://localhost/api/scan', {
      method: 'POST',
      body: 'not json',
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.error.code).toBe('INVALID_JSON')
  })

  it('returns 201 for valid scan with known serial', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    const res = await POST(makeRequest({ serial: 'SN-001', registrado_em: '2026-04-22T10:00:00.000Z' }))
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.data.serial).toBe('SN-001')
  })

  it('returns 201 for valid scan with unknown serial (upserts equipment)', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    const res = await POST(makeRequest({ serial: 'NEW-999', registrado_em: '2026-04-22T10:00:00.000Z' }))
    expect(res.status).toBe(201)
    expect(mockUpsert).toHaveBeenCalledWith({ serial: 'NEW-999' }, expect.any(Object))
  })

  it('returns 201 with latitude and longitude', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    const res = await POST(makeRequest({
      serial: 'SN-001',
      registrado_em: '2026-04-22T10:00:00.000Z',
      latitude: -23.55,
      longitude: -46.63,
    }))
    expect(res.status).toBe(201)
  })
})
