import { contextBridge, ipcRenderer } from 'electron'
import type {
  AuthVerifyPayload,
  AuthVerifyResult,
  LoteCreatePayload,
  LoteCreateResult,
  LoteEncerrarPayload,
  LoteEncerrarResult,
  SerialReadAllPayload,
  SerialReadAllResult,
  Lote,
  Leitura,
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

    getLeituras: (loteId: number): Promise<Leitura[]> =>
      ipcRenderer.invoke('lotes:get-leituras', loteId),
  },

  serial: {
    readAll: (payload: SerialReadAllPayload): Promise<SerialReadAllResult> =>
      ipcRenderer.invoke('serial:read-all', payload),
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
