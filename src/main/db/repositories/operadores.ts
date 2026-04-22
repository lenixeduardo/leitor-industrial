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

export function listAllOperadores(): Operador[] {
  const db = getDatabase()
  return db
    .prepare(
      'SELECT * FROM operadores ORDER BY habilitado DESC, nome ASC'
    )
    .all() as Operador[]
}

export function createOperador(nome: string): Operador {
  const db = getDatabase()
  const result = db
    .prepare('INSERT INTO operadores (nome, habilitado) VALUES (?, 1)')
    .run(nome.trim())
  return db
    .prepare('SELECT * FROM operadores WHERE id = ?')
    .get(result.lastInsertRowid) as Operador
}

export function toggleOperador(id: number, habilitado: boolean): void {
  const db = getDatabase()
  db.prepare('UPDATE operadores SET habilitado = ? WHERE id = ?').run(
    habilitado ? 1 : 0,
    id
  )
}
