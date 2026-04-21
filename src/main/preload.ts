import { contextBridge, ipcRenderer } from 'electron'
import type {
  AuthVerifyPayload,
  AuthVerifyResult,
  LoteCreatePayload,
  LoteCreateResult,
  LoteEncerrarPayload,
  LoteEncerrarResult,
  LeiturasPaginadasParams,
  LeiturasPaginadas,
  SerialReadAllPayload,
  SerialReadAllResult,
  Lote,
  Operador,
  OperadorCreatePayload,
  OperadorCreateResult,
  OperadorTogglePayload,
  OperadorToggleResult,
  BatchReaderAPI,
} from '../shared/types'

const api: BatchReaderAPI = {
  auth: {
    verifyFingerprint: (payload: AuthVerifyPayload): Promise<AuthVerifyResult> =>
      ipcRenderer.invoke('auth:verify-fingerprint', payload),
  },

  lotes: {
    list: (): Promise<Lote[]> => ipcRenderer.invoke('lotes:list'),

    create: (payload: LoteCreatePayload): Promise<LoteCreateResult> =>
      ipcRenderer.invoke('lotes:create', payload),

    encerrar: (payload: LoteEncerrarPayload): Promise<LoteEncerrarResult> =>
      ipcRenderer.invoke('lotes:encerrar', payload),

    getLeituras: (params: LeiturasPaginadasParams): Promise<LeiturasPaginadas> =>
      ipcRenderer.invoke('lotes:get-leituras', params),
  },

  serial: {
    readAll: (payload: SerialReadAllPayload): Promise<SerialReadAllResult> =>
      ipcRenderer.invoke('serial:read-all', payload),
  },

  admin: {
    listOperadores: (): Promise<Operador[]> =>
      ipcRenderer.invoke('admin:list-operadores'),

    createOperador: (payload: OperadorCreatePayload): Promise<OperadorCreateResult> =>
      ipcRenderer.invoke('admin:create-operador', payload),

    toggleOperador: (payload: OperadorTogglePayload): Promise<OperadorToggleResult> =>
      ipcRenderer.invoke('admin:toggle-operador', payload),
  },

  onSerialComplete: (callback: () => void): (() => void) => {
    const handler = () => callback()
    ipcRenderer.on('serial:complete', handler)
    return () => {
      ipcRenderer.removeListener('serial:complete', handler)
    }
  },
}

contextBridge.exposeInMainWorld('batchReader', api)
