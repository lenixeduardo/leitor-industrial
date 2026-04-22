import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import type { ApiError, PaginatedResponse } from '@/types'

interface EquipamentoComUltimaLeitura {
  id: string
  serial: string
  nome: string | null
  criado_em: string
  ultima_leitura: string | null
}

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
  // strip PostgREST filter metacharacters to prevent filter injection via the or() string
  const q = (searchParams.get('q') ?? '').trim().replace(/[%_,.()"']/g, '')
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('equipamentos')
    .select('id, serial, nome, criado_em', { count: 'exact' })
    .order('criado_em', { ascending: false })
    .range(from, to)

  if (q) {
    query = query.or(`serial.ilike.%${q}%,nome.ilike.%${q}%`)
  }

  const { data, count, error } = await query

  if (error) {
    return NextResponse.json<ApiError>(
      { error: { code: 'DB_ERROR', message: error.message } },
      { status: 500 }
    )
  }

  // fetch last reading timestamp for each equipment in a single query
  const serials = (data ?? []).map((e) => e.serial)
  const { data: ultimasLeituras } = serials.length
    ? await supabase
        .from('leituras')
        .select('serial, registrado_em')
        .in('serial', serials)
        .order('registrado_em', { ascending: false })
    : { data: [] }

  const ultimaMap: Record<string, string> = {}
  for (const l of ultimasLeituras ?? []) {
    if (!ultimaMap[l.serial]) ultimaMap[l.serial] = l.registrado_em
  }

  const equipamentos: EquipamentoComUltimaLeitura[] = (data ?? []).map((e) => ({
    id: e.id,
    serial: e.serial,
    nome: e.nome ?? null,
    criado_em: e.criado_em,
    ultima_leitura: ultimaMap[e.serial] ?? null,
  }))

  return NextResponse.json<PaginatedResponse<EquipamentoComUltimaLeitura>>({
    data: equipamentos,
    total: count ?? 0,
    page,
    limit,
  })
}
