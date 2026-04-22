'use client'

import { useState, useCallback } from 'react'

type ScanState = 'idle' | 'scanning' | 'success' | 'error'

interface ScanResult {
  serial: string
  nome: string | null
  registrado_em: string
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

    let latitude: number | undefined
    let longitude: number | undefined

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 })
      })
      latitude = position.coords.latitude
      longitude = position.coords.longitude
    } catch {
      // geolocation denied or unavailable — proceed without coordinates
    }

    const payload = {
      serial,
      registrado_em,
      ...(latitude !== undefined && longitude !== undefined ? { latitude, longitude } : {}),
    }

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
