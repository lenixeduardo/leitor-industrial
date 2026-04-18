import { getDatabase } from '../connection'
import type { Operador } from '../../../shared/types'

export function findOperadorById(id: number): Operador | null {
  const db = getDatabase()
  const row = db
    .prepare('SELECT * FROM operadores WHERE id = ? AND habilitado = 1')
    .get(id)
  return (row as Operador) ?? null
}

export function findAllOperadores(): Operador[] {
  const db = getDatabase()
  return db
    .prepare('SELECT * FROM operadores WHERE habilitado = 1 ORDER BY nome')
    .all() as Operador[]
}
