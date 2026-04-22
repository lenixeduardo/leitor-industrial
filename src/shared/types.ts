// Tipos compartilhados entre main process e renderer

export interface Operador {
  id: number
  nome: string
  biometria_template: Buffer | null
  habilitado: number
  criado_em: string
}

export interface Lote {
  id: number
  codigo: string
  status: 'ABERTO' | 'ENCERRADO'
  operador_id: number
  operador_nome?: string
  criado_em: string
  encerrado_em: string | null
}

export interface Leitura {
  id: number
  lote_id: number
  operador_id: number
  porta: string
  valor: string
  coletado_em: string
}

export interface LeiturasPaginadasParams {
  loteId: number
  page: number
  pageSize: number
}

export interface LeiturasPaginadas {
  data: Leitura[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface LogAcesso {
  id: number
  operador_id: number | null
  tipo: 'ENTRADA' | 'FALHA'
  timestamp: string
}

export interface Sessao {
  operadorId: number
  nome: string
  loginAt: string
}

// ── IPC Payloads & Results ────────────────────────────────────────────────────

export interface AuthVerifyPayload {
  operadorId?: number
}

export interface AuthVerifyResult {
  success: boolean
  operador?: Pick<Operador, 'id' | 'nome'>
  error?: string
}

export interface LoteCreatePayload {
  codigo: string
  operadorId: number
}

export interface LoteCreateResult {
  success: boolean
  lote?: Lote
  error?: string
}

export interface LoteEncerrarPayload {
  loteId: number
}

export interface LoteEncerrarResult {
  success: boolean
  error?: string
}

export interface SerialReadResult {
  porta: string
  valor: string
}

export interface SerialReadAllPayload {
  loteId: number
  operadorId: number
}

export interface SerialReadAllResult {
  success: boolean
  leituras: SerialReadResult[]
  error?: string
}

export interface OperadorCreatePayload {
  nome: string
}

export interface OperadorCreateResult {
  success: boolean
  operador?: Operador
  error?: string
}

export interface OperadorTogglePayload {
  id: number
  habilitado: boolean
}

export interface OperadorToggleResult {
  success: boolean
  error?: string
}

// ── Navegação ────────────────────────────────────────────────────────────────

export type Page = 'hibernacao' | 'auth' | 'main' | 'lote' | 'admin'

// ── API exposta via contextBridge ─────────────────────────────────────────────

export interface BatchReaderAPI {
  auth: {
    verifyFingerprint: (payload: AuthVerifyPayload) => Promise<AuthVerifyResult>
  }
  lotes: {
    list: () => Promise<Lote[]>
    create: (payload: LoteCreatePayload) => Promise<LoteCreateResult>
    encerrar: (payload: LoteEncerrarPayload) => Promise<LoteEncerrarResult>
    getLeituras: (params: LeiturasPaginadasParams) => Promise<LeiturasPaginadas>
  }
  serial: {
    readAll: (payload: SerialReadAllPayload) => Promise<SerialReadAllResult>
  }
  admin: {
    listOperadores: () => Promise<Operador[]>
    createOperador: (payload: OperadorCreatePayload) => Promise<OperadorCreateResult>
    toggleOperador: (payload: OperadorTogglePayload) => Promise<OperadorToggleResult>
  }
  onSerialComplete: (callback: () => void) => () => void
}
