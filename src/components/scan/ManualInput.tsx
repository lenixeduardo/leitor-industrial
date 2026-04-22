'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ManualInputProps {
  onSubmit: (serial: string) => void
  disabled?: boolean
}

export default function ManualInput({ onSubmit, disabled }: ManualInputProps) {
  const [serial, setSerial] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = serial.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setSerial('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm mx-auto">
      <Input
        placeholder="Digite o serial (ex: SN-001)"
        value={serial}
        onChange={(e) => setSerial(e.target.value)}
        disabled={disabled}
        autoComplete="off"
        autoCapitalize="characters"
      />
      <Button type="submit" disabled={disabled || !serial.trim()}>
        Registrar
      </Button>
    </form>
  )
}
