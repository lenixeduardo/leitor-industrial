'use client'

import { useState, useEffect } from 'react'
import { syncPendingLeituras } from '@/lib/rxdb/sync'
import { getDatabase } from '@/lib/rxdb/database'

interface UseOfflineSyncReturn {
  isOnline: boolean
  pendingCount: number
  syncing: boolean
}

export function useOfflineSync(): UseOfflineSyncReturn {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingCount, setPendingCount] = useState(0)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    async function updatePendingCount() {
      try {
        const db = await getDatabase()
        const count = await db.leituras_pendentes.count({ selector: { synced: false } }).exec()
        setPendingCount(count)
      } catch {
        // db not ready yet
      }
    }

    async function handleOnline() {
      setIsOnline(true)
      setSyncing(true)
      try {
        await syncPendingLeituras()
        await updatePendingCount()
      } finally {
        setSyncing(false)
      }
    }

    function handleOffline() {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    updatePendingCount()

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, pendingCount, syncing }
}
