import { useSession } from '../store/sessionStore'
import type { Sessao } from '../../shared/types'

export function useAuth() {
  const { state, dispatch } = useSession()

  const login = async (operadorId = 1): Promise<{ success: boolean; error?: string }> => {
    const result = await window.batchReader.auth.verifyFingerprint({ operadorId })

    if (result.success && result.operador) {
      const sessao: Sessao = {
        operadorId: result.operador.id,
        nome: result.operador.nome,
        loginAt: new Date().toISOString(),
      }
      dispatch({ type: 'LOGIN', sessao })
      return { success: true }
    }

    return { success: false, error: result.error }
  }

  const logout = () => {
    dispatch({ type: 'GO_HIBERNACAO' })
  }

  return {
    sessao: state.sessao,
    login,
    logout,
  }
}
