'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Leitura, PaginatedResponse } from '@/types'
import LeituraItem from './LeituraItem'
import HistoricoSkeleton from './HistoricoSkeleton'
import { Button } from '@/components/ui/button'

export default function HistoricoList() {
  const [leituras, setLeituras] = useState<Leitura[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPage = useCallback(async (p: number, append: boolean) => {
    if (p === 1) setLoading(true)
    else setLoadingMore(true)
    setError(null)

    try {
      const res = await fetch(`/api/historico?page=${p}&limit=20`)
      if (!res.ok) throw new Error('Erro ao carregar histórico')
      const json: PaginatedResponse<Leitura> = await res.json()
      setLeituras((prev) => append ? [...prev, ...json.data] : json.data)
      setTotal(json.total)
      setPage(p)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => { fetchPage(1, false) }, [fetchPage])

  if (loading) return <HistoricoSkeleton />

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center px-4">
        <p className="text-destructive text-sm">{error}</p>
        <Button variant="outline" size="sm" onClick={() => fetchPage(1, false)}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (leituras.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center px-4">
        <p className="font-medium">Nenhuma leitura registrada ainda</p>
        <p className="text-sm text-muted-foreground">Use a aba Scan para registrar seriais</p>
      </div>
    )
  }

  const hasMore = leituras.length < total

  return (
    <div>
      <div className="divide-y rounded-lg border mx-4 mt-2">
        {leituras.map((l) => <LeituraItem key={l.id} leitura={l} />)}
      </div>
      {hasMore && (
        <div className="flex justify-center py-4">
          <Button
            variant="outline"
            size="sm"
            disabled={loadingMore}
            onClick={() => fetchPage(page + 1, true)}
          >
            {loadingMore ? 'Carregando…' : 'Carregar mais'}
          </Button>
        </div>
      )}
    </div>
  )
}
