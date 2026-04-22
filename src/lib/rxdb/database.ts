import { createRxDatabase, addRxPlugin } from 'rxdb'
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie'
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode'
import { leituraSchema } from './schema'
import type { RxDatabase, RxCollection } from 'rxdb'
import type { LeituraPendenteDoc } from './schema'

if (process.env.NODE_ENV === 'development') {
  addRxPlugin(RxDBDevModePlugin)
}

type LeitorDB = RxDatabase<{
  leituras_pendentes: RxCollection<LeituraPendenteDoc>
}>

let dbPromise: Promise<LeitorDB> | null = null

export function getDatabase(): Promise<LeitorDB> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await createRxDatabase<{ leituras_pendentes: RxCollection<LeituraPendenteDoc> }>({
        name: 'leitor_industrial',
        storage: getRxStorageDexie(),
      })

      await db.addCollections({
        leituras_pendentes: { schema: leituraSchema },
      })

      return db as LeitorDB
    })()
  }
  return dbPromise
}
