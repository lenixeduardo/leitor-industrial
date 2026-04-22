import { describe, it, expect } from 'vitest'
import { scanSchema } from '../scan'

describe('scanSchema', () => {
  const validPayload = {
    serial: 'SN-001',
    registrado_em: '2026-04-21T10:00:00.000Z',
  }

  it('accepts valid serial and registrado_em', () => {
    const result = scanSchema.safeParse(validPayload)
    expect(result.success).toBe(true)
  })

  it('rejects empty serial', () => {
    const result = scanSchema.safeParse({ ...validPayload, serial: '' })
    expect(result.success).toBe(false)
  })

  it('rejects missing serial', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { serial: _serial, ...rest } = validPayload
    const result = scanSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('rejects invalid registrado_em format', () => {
    const result = scanSchema.safeParse({ ...validPayload, registrado_em: 'not-a-date' })
    expect(result.success).toBe(false)
  })

  it('rejects missing registrado_em', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { registrado_em: _registrado_em, ...rest } = validPayload
    const result = scanSchema.safeParse(rest)
    expect(result.success).toBe(false)
  })

  it('accepts optional latitude and longitude', () => {
    const result = scanSchema.safeParse({
      ...validPayload,
      latitude: -23.550520,
      longitude: -46.633308,
    })
    expect(result.success).toBe(true)
  })

  it('rejects latitude out of range', () => {
    const result = scanSchema.safeParse({ ...validPayload, latitude: 200 })
    expect(result.success).toBe(false)
  })

  it('rejects longitude out of range', () => {
    const result = scanSchema.safeParse({ ...validPayload, longitude: -200 })
    expect(result.success).toBe(false)
  })

  it('rejects latitude present without longitude', () => {
    const result = scanSchema.safeParse({ ...validPayload, latitude: -23.5 })
    expect(result.success).toBe(false)
  })

  it('rejects longitude present without latitude', () => {
    const result = scanSchema.safeParse({ ...validPayload, longitude: -46.6 })
    expect(result.success).toBe(false)
  })
})
