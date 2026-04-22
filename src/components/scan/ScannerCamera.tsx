'use client'

import { useEffect, useRef } from 'react'

interface ScannerCameraProps {
  onDetected: (serial: string) => void
  active: boolean
}

export default function ScannerCamera({ onDetected, active }: ScannerCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const scannerRef = useRef<import('qr-scanner').default | null>(null)

  useEffect(() => {
    if (!active || !videoRef.current) return

    let destroyed = false

    import('qr-scanner').then(({ default: QrScanner }) => {
      if (destroyed || !videoRef.current) return

      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          onDetected(result.data)
          scanner.stop()
        },
        { returnDetailedScanResult: true }
      )

      scannerRef.current = scanner
      scanner.start().catch(() => {
        // camera permission denied or unavailable
      })
    })

    return () => {
      destroyed = true
      scannerRef.current?.stop()
      scannerRef.current?.destroy()
      scannerRef.current = null
    }
  }, [active, onDetected])

  return (
    <div className="relative w-full aspect-square max-w-sm mx-auto rounded-lg overflow-hidden bg-black">
      <video ref={videoRef} className="w-full h-full object-cover" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-48 border-2 border-white/70 rounded-lg" />
      </div>
    </div>
  )
}
