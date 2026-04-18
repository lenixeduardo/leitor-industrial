import { getDatabase } from '../connection'
import type { Leitura, SerialReadResult } from '../../../shared/types'

export function insertLeituras(
  loteId: number,
  operadorId: number,
  resultados: SerialReadResult[]
): void {
  const db = getDatabase()

  // Validação de imutabilidade: lote deve estar ABERTO
  const lote = db
    .prepare('SELECT status FROM lotes WHERE id = ?')
    .get(loteId) as { status: string } | undefined

  if (!lote) throw new Error('Lote não encontrado')
  if (lote.status !== 'ABERTO') {
    throw new Error('Lote encerrado não aceita novas leituras')
  }

  const insert = db.prepare(
    'INSERT INTO leituras (lote_id, operador_id, porta, valor) VALUES (?, ?, ?, ?)'
  )

  // Transação atômica: todas as 5 portas ou nenhuma
  const insertAll = db.transaction((rows: SerialReadResult[]) => {
    for (const row of rows) {
      insert.run(loteId, operadorId, row.porta, row.valor)
    }
  })

  insertAll(resultados)
}

export function getLeiturasByLote(loteId: number): Leitura[] {
  const db = getDatabase()
  return db
    .prepare(
      'SELECT * FROM leituras WHERE lote_id = ? ORDER BY coletado_em DESC'
    )
    .all(loteId) as Leitura[]
}
