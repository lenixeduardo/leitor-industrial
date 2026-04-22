import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { ApiError, Leitura } from '@/types'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ serial: string }> }
) {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json<ApiError>(
      { error: { code: 'UNAUTHORIZED', message: 'Autenticação necessária' } },
      { status: 401 }
    )
  }

  const { serial } = await params

  const { data: equipamento, error: eqError } = await supabase
    .from('equipamentos')
    .select('id, serial, nome, criado_em')
    .eq('serial', serial)
    .single()

  if (eqError || !equipamento) {
    return NextResponse.json<ApiError>(
      { error: { code: 'NOT_FOUND', message: 'Equipamento não encontrado' } },
      { status: 404 }
    )
  }

  const { data: leituras, error: leiturasError } = await supabase
    .from('leituras')
    .select('id, serial, operario_id, registrado_em, latitude, longitude, criado_em')
    .eq('serial', serial)
    .order('registrado_em', { ascending: false })
    .limit(20)

  if (leiturasError) {
    return NextResponse.json<ApiError>(
      { error: { code: 'DB_ERROR', message: leiturasError.message } },
      { status: 500 }
    )
  }

  const leiturasMapped: Leitura[] = (leituras ?? []).map((l) => ({
    id: l.id,
    serial: l.serial,
    operario_id: l.operario_id,
    registrado_em: l.registrado_em,
    latitude: l.latitude ?? null,
    longitude: l.longitude ?? null,
    criado_em: l.criado_em,
  }))

  return NextResponse.json({ data: { equipamento, leituras: leiturasMapped } })
}
