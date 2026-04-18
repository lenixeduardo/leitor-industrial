import { useState, useEffect } from 'react'
import { useSession } from '../store/sessionStore'
import type { SerialReadAllResult } from '../../shared/types'

export function useSerial(loteId: number | null) {
  const { state, dispatch } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Listener global: serial:complete navega para hibernação
  useEffect(() => {
    const unsubscribe = window.batchReader.onSerialComplete(() => {
      dispatch({ type: 'GO_HIBERNACAO' })
    })
    return unsubscribe
  }, [dispatch])

  const readAll = async (): Promise<SerialReadAllResult | null> => {
    if (!loteId || !state.sessao) return null

    setError('')
    setLoading(true)

    const result = await window.batchReader.serial.readAll({
      loteId,
      operadorId: state.sessao.operadorId,
    })

    if (!result.success) {
      setError(result.error ?? 'Erro na leitura')
      setLoading(false)
    }
    // Em caso de sucesso: serial:complete dispara GO_HIBERNACAO, não precisa setar loading=false

    return result
  }

  return { loading, error, readAll }
}
