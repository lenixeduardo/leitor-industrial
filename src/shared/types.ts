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

// ── Navegação ────────────────────────────────────────────────────────────────

export type Page = 'hibernacao' | 'auth' | 'main' | 'lote'

// ── API exposta via contextBridge ─────────────────────────────────────────────

export interface BatchReaderAPI {
  auth: {
    verifyFingerprint: (payload: AuthVerifyPayload) => Promise<AuthVerifyResult>
  }
  lotes: {
    list: () => Promise<Lote[]>
    create: (payload: LoteCreatePayload) => Promise<LoteCreateResult>
    encerrar: (payload: LoteEncerrarPayload) => Promise<LoteEncerrarResult>
    getLeituras: (loteId: number) => Promise<Leitura[]>
  }
  serial: {
    readAll: (payload: SerialReadAllPayload) => Promise<SerialReadAllResult>
  }
  onSerialComplete: (callback: () => void) => () => void
}
