import { getDatabase } from './connection'

export function runMigrations(): void {
  const db = getDatabase()

  db.exec(`
    CREATE TABLE IF NOT EXISTS operadores (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      nome              TEXT    NOT NULL,
      biometria_template BLOB,
      habilitado        INTEGER DEFAULT 1,
      criado_em         TEXT    DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS lotes (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo       TEXT    NOT NULL UNIQUE,
      status       TEXT    CHECK(status IN ('ABERTO','ENCERRADO')) DEFAULT 'ABERTO',
      operador_id  INTEGER REFERENCES operadores(id),
      criado_em    TEXT    DEFAULT CURRENT_TIMESTAMP,
      encerrado_em TEXT
    );

    CREATE TABLE IF NOT EXISTS leituras (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      lote_id      INTEGER REFERENCES lotes(id),
      operador_id  INTEGER REFERENCES operadores(id),
      porta        TEXT    NOT NULL,
      valor        TEXT    NOT NULL,
      coletado_em  TEXT    DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS logs_acesso (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      operador_id  INTEGER,
      tipo         TEXT    CHECK(tipo IN ('ENTRADA','FALHA')),
      timestamp    TEXT    DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // Seed: operador de teste para desenvolvimento com mock biométrico
  const existingOp = db.prepare('SELECT id FROM operadores WHERE id = 1').get()
  if (!existingOp) {
    db.prepare(
      `INSERT INTO operadores (nome, habilitado) VALUES ('Operador Teste', 1)`
    ).run()
  }
}
