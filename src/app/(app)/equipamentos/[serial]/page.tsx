import { notFound } from 'next/navigation'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { Leitura } from '@/types'

interface PageProps {
  params: Promise<{ serial: string }>
}

export default async function EquipamentoDetailPage({ params }: PageProps) {
  const { serial } = await params
  const decoded = decodeURIComponent(serial)

  const supabase = await getSupabaseServerClient()

  const { data: equipamento } = await supabase
    .from('equipamentos')
    .select('id, serial, nome, criado_em')
    .eq('serial', decoded)
    .single()

  if (!equipamento) notFound()

  const { data: leituras } = await supabase
    .from('leituras')
    .select('id, serial, operario_id, registrado_em, latitude, longitude, criado_em')
    .eq('serial', decoded)
    .order('registrado_em', { ascending: false })
    .limit(20)

  const leiturasMapped: Leitura[] = (leituras ?? []).map((l) => ({
    id: l.id,
    serial: l.serial,
    operario_id: l.operario_id,
    registrado_em: l.registrado_em,
    latitude: l.latitude ?? null,
    longitude: l.longitude ?? null,
    criado_em: l.criado_em,
  }))

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="p-4 border-b">
        <h1 className="text-lg font-semibold">{equipamento.nome ?? equipamento.serial}</h1>
        {equipamento.nome && (
          <p className="text-sm text-muted-foreground font-mono">{equipamento.serial}</p>
        )}
      </div>

      <div className="p-4">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          Últimas leituras ({leiturasMapped.length})
        </h2>

        {leiturasMapped.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma leitura registrada</p>
        ) : (
          <div className="divide-y rounded-lg border">
            {leiturasMapped.map((l) => {
              const time = new Date(l.registrado_em).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })
              return (
                <div key={l.id} className="flex items-center justify-between py-3 px-4">
                  <span className="text-xs text-muted-foreground font-mono truncate">
                    {l.operario_id.slice(0, 8)}…
                  </span>
                  <span className="text-xs text-muted-foreground">{time}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
