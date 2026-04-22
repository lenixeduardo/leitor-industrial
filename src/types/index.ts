export type UserRole = 'worker' | 'supervisor'

export type Perfil = {
  id: string
  nome: string
  role: UserRole
}

export type Equipamento = {
  id: string
  serial: string
  nome: string | null
  criado_em: string
}

export type Leitura = {
  id: string
  serial: string
  operario_id: string
  registrado_em: string
  latitude: number | null
  longitude: number | null
  criado_em: string
  equipamento?: Pick<Equipamento, 'serial' | 'nome'>
}

export type ApiError = {
  error: {
    code: string
    message: string
    fields?: Record<string, string[]>
  }
}

export type PaginatedResponse<T> = {
  data: T[]
  total: number
  page: number
  limit: number
}
