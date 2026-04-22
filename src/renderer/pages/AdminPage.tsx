import { useState, useEffect, useCallback } from 'react'
import { useSession } from '../store/sessionStore'
import type { Operador } from '../../shared/types'

export default function AdminPage() {
  const { state, dispatch } = useSession()

  const [operadores, setOperadores] = useState<Operador[]>([])
  const [loading, setLoading] = useState(true)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [novoNome, setNovoNome] = useState('')
  const [criando, setCriando] = useState(false)
  const [erroCriacao, setErroCriacao] = useState('')
  const [toggling, setToggling] = useState<number | null>(null)

  const loadOperadores = useCallback(async () => {
    setLoading(true)
    const data = await window.batchReader.admin.listOperadores()
    setOperadores(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadOperadores()
  }, [loadOperadores])

  const handleAbrirForm = () => {
    setMostrarForm(true)
    setNovoNome('')
    setErroCriacao('')
  }

  const handleFecharForm = () => {
    setMostrarForm(false)
    setNovoNome('')
    setErroCriacao('')
  }

  const handleCriar = async () => {
    if (!novoNome.trim()) return
    setCriando(true)
    setErroCriacao('')

    const result = await window.batchReader.admin.createOperador({
      nome: novoNome.trim(),
    })

    if (result.success) {
      handleFecharForm()
      await loadOperadores()
    } else {
      setErroCriacao(result.error ?? 'Erro ao criar operador')
    }

    setCriando(false)
  }

  const handleToggle = async (op: Operador) => {
    // Proteção: operador logado não pode se desativar
    if (op.id === state.sessao?.operadorId) return

    setToggling(op.id)
    await window.batchReader.admin.toggleOperador({
      id: op.id,
      habilitado: op.habilitado !== 1,
    })
    await loadOperadores()
    setToggling(null)
  }

  const ativos = operadores.filter((o) => o.habilitado === 1).length
  const inativos = operadores.length - ativos

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800/60 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <button
            onClick={() => dispatch({ type: 'NAVIGATE', page: 'main' })}
            className="text-gray-600 hover:text-gray-400 text-sm transition-colors"
          >
            ← Voltar
          </button>
          <div>
            <h1 className="text-base font-bold text-amber-500 tracking-[0.25em] uppercase">
              Administração
            </h1>
            <p className="text-gray-600 text-xs mt-0.5">
              Gerenciamento de operadores
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-700">
          <span>
            <span className="text-emerald-400">{ativos}</span> ativos
          </span>
          <span>
            <span className="text-gray-600">{inativos}</span> inativos
          </span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 max-w-2xl w-full mx-auto">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-gray-400 text-xs tracking-widest uppercase">
            Operadores
          </h2>
          <button
            onClick={handleAbrirForm}
            disabled={mostrarForm}
            className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600
                       disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed
                       text-black font-bold py-2 px-4 rounded-lg text-xs
                       tracking-widest transition-colors uppercase"
          >
            + Novo Operador
          </button>
        </div>

        {/* Formulário inline */}
        {mostrarForm && (
          <div className="bg-[#111] border border-amber-500/20 rounded-xl p-4 mb-4 flex items-start gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCriar()}
                placeholder="Nome completo do operador"
                maxLength={80}
                autoFocus
                className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-3 py-2
                           text-white text-sm placeholder-gray-700
                           focus:outline-none focus:border-amber-500 transition-colors"
              />
              {erroCriacao && (
                <p className="text-red-400 text-xs mt-1.5">{erroCriacao}</p>
              )}
            </div>
            <button
              onClick={handleCriar}
              disabled={criando || !novoNome.trim()}
              className="bg-amber-500 hover:bg-amber-400 disabled:bg-gray-700
                         disabled:text-gray-500 text-black font-bold py-2 px-4
                         rounded-lg text-sm transition-colors whitespace-nowrap"
            >
              {criando ? '...' : 'Criar'}
            </button>
            <button
              onClick={handleFecharForm}
              className="text-gray-600 hover:text-gray-400 py-2 px-2 text-sm transition-colors"
            >
              ✕
            </button>
          </div>
        )}

        {/* Lista */}
        {loading ? (
          <div className="text-gray-700 text-sm text-center py-24">
            Carregando...
          </div>
        ) : operadores.length === 0 ? (
          <div className="text-gray-700 text-sm text-center py-24">
            Nenhum operador cadastrado.
          </div>
        ) : (
          <div className="space-y-2">
            {operadores.map((op) => {
              const isCurrentUser = op.id === state.sessao?.operadorId
              const isActive = op.habilitado === 1
              const isToggling = toggling === op.id

              return (
                <div
                  key={op.id}
                  className={`bg-[#111] border rounded-xl px-4 py-3 flex items-center justify-between
                    transition-colors
                    ${isCurrentUser
                      ? 'border-amber-500/20'
                      : 'border-gray-800/60'
                    }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-medium truncate ${
                          isActive ? 'text-white' : 'text-gray-600'
                        }`}
                      >
                        {op.nome}
                      </span>
                      {isCurrentUser && (
                        <span className="text-amber-500/50 text-xs shrink-0">
                          (sessão atual)
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 text-xs">
                      Cadastrado em{' '}
                      {new Date(op.criado_em).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border tracking-wider whitespace-nowrap
                        ${isActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-gray-800/60 text-gray-600 border-gray-700/60'
                        }`}
                    >
                      {isActive ? 'ATIVO' : 'INATIVO'}
                    </span>

                    <button
                      onClick={() => handleToggle(op)}
                      disabled={isCurrentUser || isToggling}
                      title={
                        isCurrentUser
                          ? 'Não é possível desativar o operador da sessão atual'
                          : isActive
                          ? 'Desativar operador'
                          : 'Ativar operador'
                      }
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors
                        disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap
                        ${isActive
                          ? 'border-red-900/60 hover:border-red-700 text-red-700 hover:text-red-500'
                          : 'border-emerald-900/60 hover:border-emerald-700 text-emerald-700 hover:text-emerald-500'
                        }`}
                    >
                      {isToggling
                        ? '...'
                        : isActive
                        ? 'Desativar'
                        : 'Ativar'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
