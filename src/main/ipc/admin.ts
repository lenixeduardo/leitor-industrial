import { ipcMain } from 'electron'
import type {
  Operador,
  OperadorCreatePayload,
  OperadorCreateResult,
  OperadorTogglePayload,
  OperadorToggleResult,
} from '../../shared/types'
import {
  listAllOperadores,
  createOperador,
  toggleOperador,
} from '../db/repositories/operadores'

export function registerAdminHandlers(): void {
  ipcMain.handle('admin:list-operadores', async (): Promise<Operador[]> => {
    return listAllOperadores()
  })

  ipcMain.handle(
    'admin:create-operador',
    async (_, payload: OperadorCreatePayload): Promise<OperadorCreateResult> => {
      try {
        const nome = payload.nome.trim()
        if (!nome) throw new Error('Nome não pode ser vazio')
        const operador = createOperador(nome)
        return { success: true, operador }
      } catch (err) {
        return { success: false, error: String(err) }
      }
    }
  )

  ipcMain.handle(
    'admin:toggle-operador',
    async (_, payload: OperadorTogglePayload): Promise<OperadorToggleResult> => {
      try {
        toggleOperador(payload.id, payload.habilitado)
        return { success: true }
      } catch (err) {
        return { success: false, error: String(err) }
      }
    }
  )
}
