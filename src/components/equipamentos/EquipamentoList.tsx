'use client'

import { useState, useEffect, useCallback } from 'react'
import type { PaginatedResponse } from '@/types'
import EquipamentoCard from './EquipamentoCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

interface EquipamentoRow {
  id: string
  serial: string
  nome: string | null
  criado_em: string
  ultima_leitura: string | null
}

export default function EquipamentoList() {
  const [items, setItems] = useState<EquipamentoRow[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const fetchPage = useCallback(async (p: number, append: boolean, q: string) => {
    if (p === 1) setLoading(true)
    else setLoadingMore(true)
    setError(null)

    try {
      const params = new URLSearchParams({ page: String(p), limit: '20' })
      if (q) params.set('q', q)
      const res = await fetch(`/api/equipamentos?${params}`)
      if (!res.ok) throw new Error('Erro ao carregar equipamentos')
      const json: PaginatedResponse<EquipamentoRow> = await res.json()
      setItems((prev) => append ? [...prev, ...json.data] : json.data)
      setTotal(json.total)
      setPage(p)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    fetchPage(1, false, debouncedSearch)
  }, [fetchPage, debouncedSearch])

  return (
    <div>
      <div className="px-4 py-3">
        <Input
          placeholder="Buscar por serial ou nome…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="divide-y border-t">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-3 px-4">
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center px-4">
          <p className="text-destructive text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={() => fetchPage(1, false, debouncedSearch)}>
            Tentar novamente
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center px-4">
          <p className="font-medium">Nenhum equipamento encontrado</p>
          <p className="text-sm text-muted-foreground">
            {debouncedSearch ? 'Tente outro termo de busca' : 'Registre o primeiro serial via Scan'}
          </p>
        </div>
      ) : (
        <>
          <div className="divide-y rounded-lg border mx-4 mt-1">
            {items.map((e) => (
              <EquipamentoCard
                key={e.id}
                serial={e.serial}
                nome={e.nome}
                ultima_leitura={e.ultima_leitura}
              />
            ))}
          </div>
          {items.length < total && (
            <div className="flex justify-center py-4">
              <Button
                variant="outline"
                size="sm"
                disabled={loadingMore}
                onClick={() => fetchPage(page + 1, true, debouncedSearch)}
              >
                {loadingMore ? 'Carregando…' : 'Carregar mais'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
