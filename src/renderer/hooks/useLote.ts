import { useState, useCallback } from 'react'
import { useSession } from '../store/sessionStore'
import type { Lote, LoteCreateResult, LoteEncerrarResult } from '../../shared/types'

export function useLote() {
  const { state, dispatch } = useSession()
  const [lotes, setLotes] = useState<Lote[]>([])
  const [loading, setLoading] = useState(false)

  const loadLotes = useCallback(async () => {
    setLoading(true)
    const data = await window.batchReader.lotes.list()
    setLotes(data)
    setLoading(false)
  }, [])

  const criarLote = async (codigo: string): Promise<LoteCreateResult> => {
    if (!state.sessao) return { success: false, error: 'Sem sessão ativa' }

    const result = await window.batchReader.lotes.create({
      codigo: codigo.toUpperCase(),
      operadorId: state.sessao.operadorId,
    })

    if (result.success && result.lote) {
      dispatch({ type: 'SET_LOTE_ATIVO', lote: result.lote })
    }

    return result
  }

  const selecionarLote = (lote: Lote) => {
    dispatch({ type: 'SET_LOTE_ATIVO', lote })
  }

  const encerrarLote = async (loteId: number): Promise<LoteEncerrarResult> => {
    const result = await window.batchReader.lotes.encerrar({ loteId })
    if (result.success) {
      dispatch({ type: 'SET_LOTE_ATIVO', lote: null })
    }
    return result
  }

  return {
    lotes,
    loading,
    loteAtivo: state.loteAtivo,
    loadLotes,
    criarLote,
    selecionarLote,
    encerrarLote,
  }
}
