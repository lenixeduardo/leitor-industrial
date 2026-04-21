import { useState, useEffect, useCallback } from 'react'
import { useSession } from '../store/sessionStore'
import type { Lote } from '../../shared/types'

const MAX_LOTES = 10

export default function MainPage() {
  const { state, dispatch } = useSession()
  const [lotes, setLotes] = useState<Lote[]>([])
  const [loading, setLoading] = useState(true)
  const [mostrarInput, setMostrarInput] = useState(false)
  const [novoCodigo, setNovoCodigo] = useState('')
  const [criando, setCriando] = useState(false)
  const [erroCriacao, setErroCriacao] = useState('')

  const loadLotes = useCallback(async () => {
    setLoading(true)
    const data = await window.batchReader.lotes.list()
    setLotes(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadLotes()
  }, [loadLotes])

  const handleAbrirInput = () => {
    setMostrarInput(true)
    setErroCriacao('')
    setNovoCodigo('')
  }

  const handleCancelarInput = () => {
    setMostrarInput(false)
    setNovoCodigo('')
    setErroCriacao('')
  }

  const handleCriarLote = async () => {
    const codigo = novoCodigo.trim()
    if (!codigo || !state.sessao) return

    setCriando(true)
    setErroCriacao('')

    const result = await window.batchReader.lotes.create({
      codigo: codigo.toUpperCase(),
      operadorId: state.sessao.operadorId,
    })

    if (result.success && result.lote) {
      setMostrarInput(false)
      setNovoCodigo('')
      // Navega direto para o lote recém-criado
      dispatch({ type: 'SET_LOTE_ATIVO', lote: result.lote })
    } else {
      setErroCriacao(result.error ?? 'Erro ao criar lote')
    }

    setCriando(false)
  }

  const handleSelecionarLote = (lote: Lote) => {
    dispatch({ type: 'SET_LOTE_ATIVO', lote })
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800/60 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-amber-500 tracking-[0.25em] uppercase">
            BatchReader
          </h1>
          <p className="text-gray-600 text-xs mt-0.5">
            Operador:{' '}
            <span className="text-gray-400">{state.sessao?.nome}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch({ type: 'NAVIGATE', page: 'admin' })}
            className="text-gray-700 hover:text-gray-400 text-xs tracking-widest uppercase
                       border border-gray-800 hover:border-gray-600 px-3 py-1.5 rounded
                       transition-colors"
          >
            Admin
          </button>
          <button
            onClick={() => dispatch({ type: 'GO_HIBERNACAO' })}
            className="text-gray-700 hover:text-gray-400 text-xs tracking-widest uppercase
                       border border-gray-800 hover:border-gray-600 px-3 py-1.5 rounded
                       transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 max-w-3xl w-full mx-auto">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white text-sm font-semibold tracking-wider uppercase">
              Lotes Abertos
            </h2>
            <p className="text-gray-700 text-xs mt-0.5">
              {lotes.length}/{MAX_LOTES} ativos
            </p>
          </div>
          <button
            onClick={handleAbrirInput}
            disabled={lotes.length >= MAX_LOTES || mostrarInput}
            className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600
                       disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed
                       text-black font-bold py-2 px-4 rounded-lg text-xs
                       tracking-widest transition-colors uppercase"
          >
            + Novo Lote
          </button>
        </div>

        {/* Formulário novo lote */}
        {mostrarInput && (
          <div className="bg-[#111] border border-gray-800 rounded-xl p-4 mb-4 flex items-start gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={novoCodigo}
                onChange={(e) =>
                  setNovoCodigo(
                    e.target.value.replace(/[^A-Za-z0-9\-_]/g, '').toUpperCase()
                  )
                }
                onKeyDown={(e) => e.key === 'Enter' && handleCriarLote()}
                placeholder="CÓDIGO ALFANUMÉRICO (ex: LOTE-2024-001)"
                maxLength={30}
                autoFocus
                className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-3 py-2
                           text-white text-sm font-mono placeholder-gray-700
                           focus:outline-none focus:border-amber-500 uppercase tracking-widest
                           transition-colors"
              />
              {erroCriacao && (
                <p className="text-red-400 text-xs mt-1.5">{erroCriacao}</p>
              )}
            </div>
            <button
              onClick={handleCriarLote}
              disabled={criando || !novoCodigo.trim()}
              className="bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700
                         disabled:text-gray-500 text-black font-bold py-2 px-4
                         rounded-lg text-sm transition-colors whitespace-nowrap"
            >
              {criando ? '...' : 'Criar'}
            </button>
            <button
              onClick={handleCancelarInput}
              className="text-gray-600 hover:text-gray-400 py-2 px-2 text-sm transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* Lista de lotes */}
        {loading ? (
          <div className="text-gray-700 text-sm text-center py-24">
            Carregando...
          </div>
        ) : lotes.length === 0 ? (
          <div className="text-center py-24 space-y-2">
            <p className="text-gray-700 text-sm">Nenhum lote aberto.</p>
            <p className="text-gray-800 text-xs">
              Clique em "Novo Lote" para começar.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {lotes.map((lote) => (
              <button
                key={lote.id}
                onClick={() => handleSelecionarLote(lote)}
                className="w-full bg-[#111] hover:bg-[#161616] border border-gray-800/60
                           hover:border-amber-500/20 rounded-xl p-4 text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-amber-500 font-bold font-mono tracking-wider text-sm
                                  group-hover:text-amber-400 transition-colors">
                      {lote.codigo}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span>
                        {new Date(lote.criado_em).toLocaleString('pt-BR')}
                      </span>
                      {lote.operador_nome && <span>· {lote.operador_nome}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20
                                     text-xs px-2 py-0.5 rounded-full tracking-wider">
                      ABERTO
                    </span>
                    <span className="text-gray-700 group-hover:text-gray-400 transition-colors text-sm">
                      →
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
