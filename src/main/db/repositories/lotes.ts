import { getDatabase } from '../connection'
import type { Lote } from '../../../shared/types'

const MAX_LOTES_ABERTOS = 10

export function listLotesAbertos(): Lote[] {
  const db = getDatabase()
  return db
    .prepare(
      `SELECT l.*, o.nome AS operador_nome
       FROM lotes l
       LEFT JOIN operadores o ON l.operador_id = o.id
       WHERE l.status = 'ABERTO'
       ORDER BY l.criado_em DESC`
    )
    .all() as Lote[]
}

export function createLote(codigo: string, operadorId: number): Lote {
  const db = getDatabase()

  const { count } = db
    .prepare("SELECT COUNT(*) AS count FROM lotes WHERE status = 'ABERTO'")
    .get() as { count: number }

  if (count >= MAX_LOTES_ABERTOS) {
    throw new Error(`Limite de ${MAX_LOTES_ABERTOS} lotes abertos atingido`)
  }

  const result = db
    .prepare('INSERT INTO lotes (codigo, operador_id) VALUES (?, ?)')
    .run(codigo, operadorId)

  return db
    .prepare('SELECT * FROM lotes WHERE id = ?')
    .get(result.lastInsertRowid) as Lote
}

export function encerrarLote(loteId: number): void {
  const db = getDatabase()

  const lote = db
    .prepare('SELECT status FROM lotes WHERE id = ?')
    .get(loteId) as { status: string } | undefined

  if (!lote) throw new Error('Lote não encontrado')
  if (lote.status === 'ENCERRADO') throw new Error('Lote já encerrado')

  db.prepare(
    `UPDATE lotes SET status = 'ENCERRADO', encerrado_em = datetime('now') WHERE id = ?`
  ).run(loteId)
}

export function findLoteById(loteId: number): Lote | null {
  const db = getDatabase()
  return (
    (db.prepare('SELECT * FROM lotes WHERE id = ?').get(loteId) as Lote) ?? null
  )
}
