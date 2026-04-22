'use client'

import { useOfflineSync } from '@/hooks/useOfflineSync'

export default function OfflineBanner() {
  const { isOnline, pendingCount, syncing } = useOfflineSync()

  if (isOnline && pendingCount === 0) return null

  return (
    <div
      role="status"
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-600"
    >
      {syncing ? (
        <span className="animate-pulse">Sincronizando leituras…</span>
      ) : isOnline && pendingCount > 0 ? (
        <span>Sincronizando {pendingCount} leitura{pendingCount !== 1 ? 's' : ''}…</span>
      ) : (
        <span>
          Sem internet
          {pendingCount > 0 && ` · ${pendingCount} leitura${pendingCount !== 1 ? 's' : ''} salva${pendingCount !== 1 ? 's' : ''} localmente`}
        </span>
      )}
    </div>
  )
}
