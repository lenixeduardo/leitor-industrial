'use client'

import { useState } from 'react'
import { useScanner } from '@/hooks/useScanner'
import ScannerCamera from '@/components/scan/ScannerCamera'
import ManualInput from '@/components/scan/ManualInput'
import ScanResult from '@/components/scan/ScanResult'
import { Button } from '@/components/ui/button'

type Tab = 'camera' | 'manual'

export default function ScanPage() {
  const [tab, setTab] = useState<Tab>('camera')
  const { state, result, error, startScan, submitManual, reset } = useScanner()

  const isResultState = state === 'success' || state === 'error'
  const isLoading = state === 'scanning'

  function handleCameraDetected(serial: string) {
    submitManual(serial)
  }

  function handleTabChange(next: Tab) {
    reset()
    setTab(next)
    if (next === 'camera') startScan()
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="p-4 border-b">
        <h1 className="text-lg font-semibold mb-3">Registrar Leitura</h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={tab === 'camera' ? 'default' : 'outline'}
            onClick={() => handleTabChange('camera')}
          >
            Câmera
          </Button>
          <Button
            size="sm"
            variant={tab === 'manual' ? 'default' : 'outline'}
            onClick={() => handleTabChange('manual')}
          >
            Manual
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {isResultState ? (
          <ScanResult
            state={state as 'success' | 'error'}
            serial={result?.serial}
            nome={result?.nome}
            registrado_em={result?.registrado_em}
            error={error}
            onReset={() => {
              reset()
              if (tab === 'camera') startScan()
            }}
          />
        ) : (
          <>
            {tab === 'camera' && (
              <ScannerCamera
                active={state === 'scanning'}
                onDetected={handleCameraDetected}
              />
            )}
            {tab === 'manual' && (
              <ManualInput onSubmit={submitManual} disabled={isLoading} />
            )}
            {isLoading && (
              <p className="text-sm text-muted-foreground mt-4 animate-pulse">
                Registrando…
              </p>
            )}
          </>
        )}
      </div>
    </div>
  )
}
