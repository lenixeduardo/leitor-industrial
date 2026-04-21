import { ipcMain } from 'electron'
import type {
  Lote,
  LoteCreatePayload,
  LoteCreateResult,
  LoteEncerrarPayload,
  LoteEncerrarResult,
  LeiturasPaginadasParams,
  LeiturasPaginadas,
} from '../../shared/types'
import {
  listLotesAbertos,
  createLote,
  encerrarLote,
} from '../db/repositories/lotes'
import { getLeiturasByLote } from '../db/repositories/leituras'

export function registerLotesHandlers(): void {
  ipcMain.handle('lotes:list', async (): Promise<Lote[]> => {
    return listLotesAbertos()
  })

  ipcMain.handle(
    'lotes:create',
    async (_, payload: LoteCreatePayload): Promise<LoteCreateResult> => {
      try {
        const lote = createLote(payload.codigo, payload.operadorId)
        return { success: true, lote }
      } catch (err) {
        return { success: false, error: String(err) }
      }
    }
  )

  ipcMain.handle(
    'lotes:encerrar',
    async (_, payload: LoteEncerrarPayload): Promise<LoteEncerrarResult> => {
      try {
        encerrarLote(payload.loteId)
        return { success: true }
      } catch (err) {
        return { success: false, error: String(err) }
      }
    }
  )

  ipcMain.handle(
    'lotes:get-leituras',
    async (_, params: LeiturasPaginadasParams): Promise<LeiturasPaginadas> => {
      return getLeiturasByLote(params.loteId, params.page, params.pageSize)
    }
  )
}
