import { getDatabase } from '../connection'

export function registrarLog(
  operadorId: number | null,
  tipo: 'ENTRADA' | 'FALHA'
): void {
  const db = getDatabase()
  db.prepare(
    'INSERT INTO logs_acesso (operador_id, tipo) VALUES (?, ?)'
  ).run(operadorId, tipo)
}
