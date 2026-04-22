import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from 'react'
import type { Sessao, Page, Lote } from '../../shared/types'

// ── State ─────────────────────────────────────────────────────────────────────

interface SessionState {
  page: Page
  sessao: Sessao | null
  loteAtivo: Lote | null
}

// ── Actions ───────────────────────────────────────────────────────────────────

type SessionAction =
  | { type: 'NAVIGATE'; page: Page }
  | { type: 'LOGIN'; sessao: Sessao }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOTE_ATIVO'; lote: Lote | null }
  | { type: 'GO_HIBERNACAO' }

// ── Reducer ───────────────────────────────────────────────────────────────────

const initialState: SessionState = {
  page: 'hibernacao',
  sessao: null,
  loteAtivo: null,
}

function sessionReducer(
  state: SessionState,
  action: SessionAction
): SessionState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, page: action.page }

    case 'LOGIN':
      return { ...state, sessao: action.sessao, page: 'main' }

    case 'LOGOUT':
      return { ...initialState }

    case 'SET_LOTE_ATIVO':
      return {
        ...state,
        loteAtivo: action.lote,
        page: action.lote ? 'lote' : 'main',
      }

    case 'GO_HIBERNACAO':
      return { ...state, page: 'hibernacao', loteAtivo: null }

    default:
      return state
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

const SessionContext = createContext<{
  state: SessionState
  dispatch: Dispatch<SessionAction>
} | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState)

  return (
    <SessionContext.Provider value={{ state, dispatch }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession deve ser usado dentro de SessionProvider')
  return ctx
}
