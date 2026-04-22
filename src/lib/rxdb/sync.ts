import { getDatabase } from './database'

export async function syncPendingLeituras(): Promise<void> {
  const db = await getDatabase()
  const pending = await db.leituras_pendentes.find({ selector: { synced: false } }).exec()

  for (const doc of pending) {
    const payload: Record<string, unknown> = {
      serial: doc.serial,
      registrado_em: doc.registrado_em,
    }
    if (doc.latitude !== undefined) payload.latitude = doc.latitude
    if (doc.longitude !== undefined) payload.longitude = doc.longitude

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        await doc.patch({ synced: true })
      }
    } catch {
      // network still unavailable — will retry next online event
    }
  }
}
