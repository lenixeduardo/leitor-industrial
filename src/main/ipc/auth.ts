import { ipcMain } from 'electron'
import type { AuthVerifyPayload, AuthVerifyResult } from '../../shared/types'
import { findOperadorById } from '../db/repositories/operadores'
import { registrarLog } from '../db/repositories/logs'

export function registerAuthHandlers(): void {
  ipcMain.handle(
    'auth:verify-fingerprint',
    async (_, payload: AuthVerifyPayload): Promise<AuthVerifyResult> => {
      try {
        // MOCK: usa operadorId do payload (padrão: 1 = Operador Teste)
        const operadorId = payload.operadorId ?? 1
        const operador = findOperadorById(operadorId)

        if (!operador) {
          registrarLog(null, 'FALHA')
          return { success: false, error: 'Operador não encontrado ou inativo' }
        }

        registrarLog(operador.id, 'ENTRADA')
        return {
          success: true,
          operador: { id: operador.id, nome: operador.nome },
        }
      } catch (err) {
        return { success: false, error: String(err) }
      }
    }
  )
}
