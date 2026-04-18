import { useState, useEffect, useCallback } from 'react'
import { useSession } from '../store/sessionStore'
import type { Leitura } from '../../shared/types'

export default function LotePage() {
  const { state, dispatch } = useSession()
  const lote = state.loteAtivo

  const [leituras, setLeituras] = useState<Leitura[]>([])
  const [loadingLeituras, setLoadingLeituras] = useState(true)
  const [coletando, setColetando] = useState(false)
  const [erroColeta, setErroColeta] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [encerrando, setEncerrando] = useState(false)

  const loadLeituras = useCallback(async () => {
    if (!lote) return
    setLoadingLeituras(true)
    const data = await window.batchReader.lotes.getLeituras(lote.id)
    setLeituras(data)
    setLoadingLeituras(false)
  }, [lote])

  useEffect(() => {
    loadLeituras()
  }, [loadLeituras])

  // Quando serial:complete chega → vai para hibernação (fluxo normal pós-coleta)
  useEffect(() => {
    const unsubscribe = window.batchReader.onSerialComplete(() => {
      dispatch({ type: 'GO_HIBERNACAO' })
    })
    return unsubscribe
  }, [dispatch])

  const handleColetar = async () => {
    if (!lote || !state.sessao) return
    setErroColeta('')
    setColetando(true)

    const result = await window.batchReader.serial.readAll({
      loteId: lote.id,
      operadorId: state.sessao.operadorId,
    })

    // Em caso de sucesso, serial:complete dispara GO_HIBERNACAO antes desta linha.
    // Este branch trata apenas erros que impedem a coleta.
    if (!result.success) {
      setErroColeta(result.error ?? 'Erro na leitura das portas')
      setColetando(false)
    }
  }

  const handleEncerrar = async () => {
    if (!lote) return
    setEncerrando(true)

    const result = await window.batchReader.lotes.encerrar({ loteId: lote.id })

    if (result.success) {
      dispatch({ type: 'SET_LOTE_ATIVO', lote: null }) // volta para MainPage
    } else {
      setEncerrando(false)
      setModalAberto(false)
    }
  }

  const handleVoltar = () => {
    dispatch({ type: 'SET_LOTE_ATIVO', lote: null })
  }

  if (!lote) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-gray-700 text-sm">Nenhum lote selecionado.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800/60 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={handleVoltar}
              className="text-gray-600 hover:text-gray-400 text-sm transition-colors"
            >
              ← Voltar
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-base font-bold text-amber-500 font-mono tracking-wider">
                  {lote.codigo}
                </h1>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20
                                 text-xs px-2 py-0.5 rounded-full tracking-wider">
                  ABERTO
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                <span>{new Date(lote.criado_em).toLocaleString('pt-BR')}</span>
                {state.sessao && <span>· {state.sessao.nome}</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleColetar}
              disabled={coletando}
              className="bg-amber-500 hover:bg-amber-400 active:bg-amber-600
                         disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed
                         text-black font-bold py-2 px-5 rounded-lg text-xs
                         tracking-widest transition-colors uppercase"
            >
              {coletando ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin inline-block">⟳</span>
                  Lendo portas...
                </span>
              ) : (
                'Coletar Leitura'
              )}
            </button>
            <button
              onClick={() => setModalAberto(true)}
              disabled={coletando}
              className="border border-red-900/60 hover:border-red-700 text-red-700
                         hover:text-red-500 py-2 px-4 rounded-lg text-xs
                         tracking-widest transition-colors uppercase"
            >
              Encerrar Lote
            </button>
          </div>
        </div>

        {erroColeta && (
          <p className="text-red-400 text-xs mt-2">{erroColeta}</p>
        )}
      </header>

      {/* Leituras */}
      <main className="flex-1 p-6 max-w-4xl w-full mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-400 text-xs tracking-widest uppercase">
            Leituras registradas
          </h2>
          <span className="text-gray-700 text-xs">{leituras.length} registro(s)</span>
        </div>

        {loadingLeituras ? (
          <div className="text-gray-700 text-sm text-center py-24">
            Carregando leituras...
          </div>
        ) : leituras.length === 0 ? (
          <div className="text-center py-24 space-y-2">
            <p className="text-gray-700 text-sm">Nenhuma leitura registrada.</p>
            <p className="text-gray-800 text-xs">
              Clique em "Coletar Leitura" para iniciar a coleta nas 5 portas.
            </p>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800/60 text-gray-600 text-xs tracking-widest uppercase">
                  <th className="text-left py-2 pr-6 font-normal">Data/Hora</th>
                  <th className="text-left py-2 pr-6 font-normal">Porta</th>
                  <th className="text-left py-2 font-normal">Valor</th>
                </tr>
              </thead>
              <tbody>
                {leituras.map((l) => (
                  <tr
                    key={l.id}
                    className="border-b border-gray-900 hover:bg-[#111]/50 transition-colors"
                  >
                    <td className="py-2.5 pr-6 text-gray-600 font-mono text-xs">
                      {new Date(l.coletado_em).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-2.5 pr-6 text-amber-500/60 font-mono text-xs">
                      {l.porta}
                    </td>
                    <td
                      className={`py-2.5 font-mono text-xs ${
                        l.valor === 'TIMEOUT'
                          ? 'text-yellow-600'
                          : l.valor.startsWith('ERRO')
                          ? 'text-red-500'
                          : 'text-emerald-400'
                      }`}
                    >
                      {l.valor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Modal de confirmação de encerramento */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-8 w-96 text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20
                            flex items-center justify-center mx-auto">
              <span className="text-red-500 text-lg font-bold">!</span>
            </div>

            <div className="space-y-2">
              <h3 className="text-white font-bold">Encerrar Lote</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Esta ação é{' '}
                <span className="text-red-400 font-semibold">irreversível</span>.
                O lote{' '}
                <span className="text-amber-500 font-mono">{lote.codigo}</span>{' '}
                será encerrado e não aceitará novas leituras.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setModalAberto(false)}
                disabled={encerrando}
                className="flex-1 border border-gray-700 hover:border-gray-500
                           text-gray-400 hover:text-gray-300 py-2.5 rounded-lg
                           text-sm transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleEncerrar}
                disabled={encerrando}
                className="flex-1 bg-red-800 hover:bg-red-700 disabled:bg-gray-800
                           disabled:text-gray-600 text-white font-bold py-2.5 rounded-lg
                           text-sm transition-colors"
              >
                {encerrando ? 'Encerrando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
