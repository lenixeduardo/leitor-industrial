import { useState } from 'react'
import { useSession } from '../store/sessionStore'
import type { Sessao } from '../../shared/types'

type Status = 'idle' | 'loading' | 'error'

export default function AuthPage() {
  const { dispatch } = useSession()
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleAuth = async (operadorId = 1) => {
    setStatus('loading')
    setErrorMsg('')

    try {
      const result = await window.batchReader.auth.verifyFingerprint({ operadorId })

      if (result.success && result.operador) {
        const sessao: Sessao = {
          operadorId: result.operador.id,
          nome: result.operador.nome,
          loginAt: new Date().toISOString(),
        }
        dispatch({ type: 'LOGIN', sessao })
      } else {
        setErrorMsg(result.error ?? 'Autenticação falhou')
        setStatus('error')
        setTimeout(() => dispatch({ type: 'GO_HIBERNACAO' }), 3000)
      }
    } catch {
      setErrorMsg('Erro de comunicação com o sistema')
      setStatus('error')
      setTimeout(() => dispatch({ type: 'GO_HIBERNACAO' }), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-10">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-amber-500 tracking-[0.3em] uppercase">
          BatchReader
        </h1>
        <p className="text-gray-600 text-xs mt-1 tracking-widest">
          Autenticação Biométrica
        </p>
      </div>

      {/* Card */}
      <div className="bg-[#111] border border-gray-800 rounded-2xl p-10 flex flex-col items-center gap-6 w-80">
        {/* Ícone impressão digital */}
        <div
          className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all duration-300
            ${status === 'error'
              ? 'border-red-500/60 bg-red-500/10'
              : status === 'loading'
              ? 'border-amber-500/60 bg-amber-500/10 animate-pulse'
              : 'border-amber-500/30 bg-amber-500/5'
            }`}
        >
          <svg
            viewBox="0 0 64 64"
            className={`w-10 h-10 transition-colors duration-300
              ${status === 'error' ? 'text-red-500' : 'text-amber-500'}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
          >
            <path d="M20 16 C20 10 25.4 6 32 6 C38.6 6 44 10 44 16" />
            <path d="M14 28 C14 18 22.5 11 32 11 C41.5 11 50 18 50 28" />
            <path d="M20 32 C20 26 25.4 22 32 22 C38.6 22 44 26 44 32 C44 40 38.6 46 32 52" />
            <path d="M26 32 C26 29 28.7 27 32 27 C35.3 27 38 29 38 32 C38 36 35 40 32 44" />
          </svg>
        </div>

        {/* Status */}
        {status === 'idle' && (
          <p className="text-gray-500 text-sm text-center leading-relaxed">
            Aguardando leitura biométrica...
          </p>
        )}
        {status === 'loading' && (
          <div className="flex items-center gap-2 text-amber-500 text-sm">
            <span className="animate-spin inline-block">⟳</span>
            <span>Verificando...</span>
          </div>
        )}
        {status === 'error' && (
          <div className="text-center space-y-1">
            <p className="text-red-400 text-sm">{errorMsg}</p>
            <p className="text-gray-700 text-xs">Retornando em 3s...</p>
          </div>
        )}

        {/* Botão mock de desenvolvimento */}
        {status === 'idle' && (
          <div className="w-full space-y-2 pt-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-gray-800" />
              <span className="text-gray-700 text-xs tracking-wider">DEV</span>
              <div className="flex-1 h-px bg-gray-800" />
            </div>
            <button
              onClick={() => handleAuth(1)}
              className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600
                         text-black font-bold py-3 px-4 rounded-lg text-sm
                         tracking-wide transition-colors uppercase"
            >
              Simular digital aprovada
            </button>
          </div>
        )}
      </div>

      {/* Cancelar */}
      <button
        onClick={() => dispatch({ type: 'GO_HIBERNACAO' })}
        className="text-gray-700 hover:text-gray-500 text-xs tracking-widest uppercase transition-colors"
      >
        Cancelar
      </button>
    </div>
  )
}
