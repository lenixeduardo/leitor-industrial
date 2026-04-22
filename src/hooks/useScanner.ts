'use client'

import { useState, useCallback } from 'react'
import { getDatabase } from '@/lib/rxdb/database'

type ScanState = 'idle' | 'scanning' | 'success' | 'error' | 'offline'

interface ScanResult {
  serial: string
  nome: string | null
  registrado_em: string
  savedLocally?: boolean
}

interface UseScannerReturn {
  state: ScanState
  result: ScanResult | null
  error: string | null
  startScan: () => void
  stopScan: () => void
  submitManual: (serial: string) => Promise<void>
  reset: () => void
}

async function getCoords(): Promise<{ latitude: number; longitude: number } | undefined> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(undefined); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve(undefined),
      { timeout: 3000 }
    )
  })
}

export function useScanner(): UseScannerReturn {
  const [state, setState] = useState<ScanState>('idle')
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startScan = useCallback(() => {
    setState('scanning')
    setError(null)
    setResult(null)
  }, [])

  const stopScan = useCallback(() => {
    setState('idle')
  }, [])

  const reset = useCallback(() => {
    setState('idle')
    setResult(null)
    setError(null)
  }, [])

  const submitScan = useCallback(async (serial: string) => {
    setState('scanning')
    setError(null)

    const registrado_em = new Date().toISOString()
    const coords = await getCoords()

    // persist locally first (offline-first)
    const localId = crypto.randomUUID()
    try {
      const db = await getDatabase()
      await db.leituras_pendentes.insert({
        id: localId,
        serial,
        operario_id: 'pending',
        registrado_em,
        ...(coords ?? {}),
        synced: false,
      })
    } catch {
      // indexeddb unavailable in SSR/test — skip local save
    }

    if (!navigator.onLine) {
      setResult({ serial, nome: null, registrado_em, savedLocally: true })
      setState('offline')
      return
    }

    const payload = { serial, registrado_em, ...(coords ?? {}) }

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json?.error?.message ?? 'Erro ao registrar leitura')
      }

      const json = await res.json()

      // mark local copy as synced
      try {
        const db = await getDatabase()
        const doc = await db.leituras_pendentes.findOne(localId).exec()
        await doc?.patch({ synced: true })
      } catch {
        // ignore
      }

      setResult({
        serial: json.data.serial,
        nome: json.data.nome ?? null,
        registrado_em: json.data.registrado_em,
      })
      setState('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setState('error')
    }
  }, [])

  const submitManual = useCallback(
    (serial: string) => submitScan(serial),
    [submitScan]
  )

  return { state, result, error, startScan, stopScan, submitManual, reset }
}
