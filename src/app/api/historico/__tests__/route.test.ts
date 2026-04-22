import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Supabase mock ────────────────────────────────────────────────────────────
const mockGetUser   = vi.fn()
const mockPerfilSingle = vi.fn()
const mockLeituraQuery = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  getSupabaseServerClient: async () => ({
    auth: { getUser: mockGetUser },
    from: (table: string) => {
      if (table === 'perfis') {
        return {
          select: () => ({ eq: () => ({ single: mockPerfilSingle }) }),
        }
      }
      if (table === 'leituras') {
        const chain: Record<string, unknown> = {}
        chain.select  = () => chain
        chain.order   = () => chain
        chain.range   = () => chain
        chain.eq      = () => chain
        chain.then    = (resolve: (v: unknown) => void) => resolve(mockLeituraQuery())
        return chain
      }
      return {}
    },
  }),
}))

vi.mock('@/lib/env', () => ({
  env: { supabaseUrl: 'http://localhost', supabaseAnonKey: 'anon' },
}))

const { GET } = await import('../route')

function makeRequest(params: Record<string, string> = {}) {
  const url = new URL('http://localhost/api/historico')
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  return new Request(url)
}

const workerReading = {
  id: 'r1', serial: 'SN-001', operario_id: 'worker-id',
  registrado_em: '2026-04-22T10:00:00Z', latitude: null, longitude: null,
  criado_em: '2026-04-22T10:00:00Z', equipamentos: null,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('GET /api/historico', () => {
  it('returns 401 when unauthenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const res = await GET(makeRequest())
    expect(res.status).toBe(401)
  })

  it('worker receives only own readings (filtered by operario_id)', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'worker-id' } } })
    mockPerfilSingle.mockResolvedValue({ data: { role: 'worker' } })
    mockLeituraQuery.mockReturnValue({ data: [workerReading], count: 1, error: null })

    const res = await GET(makeRequest())
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.total).toBe(1)
    expect(json.data[0].operario_id).toBe('worker-id')
  })

  it('supervisor receives all readings (no operario filter)', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'supervisor-id' } } })
    mockPerfilSingle.mockResolvedValue({ data: { role: 'supervisor' } })
    const otherReading = { ...workerReading, id: 'r2', operario_id: 'another-worker' }
    mockLeituraQuery.mockReturnValue({ data: [workerReading, otherReading], count: 2, error: null })

    const res = await GET(makeRequest())
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.total).toBe(2)
  })

  it('returns paginated response with correct shape', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'worker-id' } } })
    mockPerfilSingle.mockResolvedValue({ data: { role: 'worker' } })
    mockLeituraQuery.mockReturnValue({ data: [workerReading], count: 45, error: null })

    const res = await GET(makeRequest({ page: '3', limit: '10' }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.page).toBe(3)
    expect(json.limit).toBe(10)
    expect(json.total).toBe(45)
  })

  it('clamps limit to max 100', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    mockPerfilSingle.mockResolvedValue({ data: { role: 'worker' } })
    mockLeituraQuery.mockReturnValue({ data: [], count: 0, error: null })

    const res = await GET(makeRequest({ limit: '9999' }))
    const json = await res.json()
    expect(json.limit).toBe(100)
  })
})
