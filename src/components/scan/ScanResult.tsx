'use client'

import { Button } from '@/components/ui/button'

interface ScanResultProps {
  state: 'success' | 'error'
  serial?: string
  nome?: string | null
  registrado_em?: string
  error?: string | null
  onReset: () => void
}

export default function ScanResult({ state, serial, nome, registrado_em, error, onReset }: ScanResultProps) {
  if (state === 'error') {
    return (
      <div className="flex flex-col items-center gap-4 text-center p-6">
        <div className="text-4xl">⚠️</div>
        <p className="text-destructive font-medium">{error ?? 'Erro ao registrar leitura'}</p>
        <Button variant="outline" onClick={onReset}>
          Tentar novamente
        </Button>
      </div>
    )
  }

  const time = registrado_em
    ? new Date(registrado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <div className="flex flex-col items-center gap-3 text-center p-6">
      <div className="text-4xl">✅</div>
      <p className="text-lg font-semibold">{nome ?? serial}</p>
      {nome && <p className="text-sm text-muted-foreground font-mono">{serial}</p>}
      <p className="text-sm text-muted-foreground">Registrado às {time}</p>
      <Button variant="outline" onClick={onReset} className="mt-2">
        Novo scan
      </Button>
    </div>
  )
}
