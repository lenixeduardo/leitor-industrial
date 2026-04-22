import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { scanSchema } from '@/lib/validations/scan'
import { rateLimit } from '@/lib/rate-limit'
import type { ApiError } from '@/types'

const SCAN_RATE_LIMIT = 60 // requests per minute per user

export async function POST(request: Request) {
  const supabase = await getSupabaseServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json<ApiError>(
      { error: { code: 'UNAUTHORIZED', message: 'Autenticação necessária' } },
      { status: 401 }
    )
  }

  const { allowed, remaining, resetAt } = rateLimit(`scan:${user.id}`, SCAN_RATE_LIMIT)
  if (!allowed) {
    return NextResponse.json<ApiError>(
      { error: { code: 'RATE_LIMITED', message: 'Limite de requisições atingido. Tente novamente em 1 minuto.' } },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(SCAN_RATE_LIMIT),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(resetAt / 1000)),
          'Retry-After': '60',
        },
      }
    )
  }
  void remaining // consumed in headers only when not rate-limited

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json<ApiError>(
      { error: { code: 'INVALID_JSON', message: 'JSON inválido' } },
      { status: 400 }
    )
  }

  const parsed = scanSchema.safeParse(body)
  if (!parsed.success) {
    const fields: Record<string, string[]> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.') || '_root'
      fields[key] = [...(fields[key] ?? []), issue.message]
    }
    return NextResponse.json<ApiError>(
      { error: { code: 'VALIDATION_ERROR', message: 'Dados inválidos', fields } },
      { status: 400 }
    )
  }

  const { serial, registrado_em, latitude, longitude } = parsed.data

  // upsert: create equipment record if serial is unknown
  const { error: upsertError } = await supabase
    .from('equipamentos')
    .upsert({ serial }, { onConflict: 'serial', ignoreDuplicates: true })

  if (upsertError) {
    return NextResponse.json<ApiError>(
      { error: { code: 'DB_ERROR', message: upsertError.message } },
      { status: 500 }
    )
  }

  const { data: leitura, error: insertError } = await supabase
    .from('leituras')
    .insert({
      serial,
      operario_id: user.id,
      registrado_em,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
    })
    .select('id, serial, registrado_em')
    .single()

  if (insertError) {
    return NextResponse.json<ApiError>(
      { error: { code: 'DB_ERROR', message: insertError.message } },
      { status: 500 }
    )
  }

  return NextResponse.json({ data: leitura }, { status: 201 })
}
