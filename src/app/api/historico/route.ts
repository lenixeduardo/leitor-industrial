import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { ApiError, PaginatedResponse, Leitura } from '@/types'

export async function GET(request: Request) {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json<ApiError>(
      { error: { code: 'UNAUTHORIZED', message: 'Autenticação necessária' } },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
  const from = (page - 1) * limit
  const to = from + limit - 1

  // determine role
  const { data: perfil } = await supabase
    .from('perfis')
    .select('role')
    .eq('id', user.id)
    .single()

  const isSupervisor = perfil?.role === 'supervisor'

  let query = supabase
    .from('leituras')
    .select(
      'id, serial, operario_id, registrado_em, latitude, longitude, criado_em, equipamentos(serial, nome)',
      { count: 'exact' }
    )
    .order('registrado_em', { ascending: false })
    .range(from, to)

  if (!isSupervisor) {
    query = query.eq('operario_id', user.id)
  }

  const { data, count, error } = await query

  if (error) {
    return NextResponse.json<ApiError>(
      { error: { code: 'DB_ERROR', message: error.message } },
      { status: 500 }
    )
  }

  const leituras: Leitura[] = (data ?? []).map((row) => ({
    id: row.id,
    serial: row.serial,
    operario_id: row.operario_id,
    registrado_em: row.registrado_em,
    latitude: row.latitude ?? null,
    longitude: row.longitude ?? null,
    criado_em: row.criado_em,
    equipamento: Array.isArray(row.equipamentos)
      ? row.equipamentos[0]
      : (row.equipamentos as { serial: string; nome: string | null } | null) ?? undefined,
  }))

  return NextResponse.json<PaginatedResponse<Leitura>>({
    data: leituras,
    total: count ?? 0,
    page,
    limit,
  })
}
