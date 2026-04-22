import Link from 'next/link'

interface EquipamentoCardProps {
  serial: string
  nome: string | null
  ultima_leitura: string | null
}

export default function EquipamentoCard({ serial, nome, ultima_leitura }: EquipamentoCardProps) {
  const lastSeen = ultima_leitura
    ? new Date(ultima_leitura).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Nunca lido'

  return (
    <Link
      href={`/equipamentos/${encodeURIComponent(serial)}`}
      className="flex items-center justify-between py-3 px-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors"
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-medium truncate">{nome ?? serial}</span>
        {nome && (
          <span className="text-xs text-muted-foreground font-mono truncate">{serial}</span>
        )}
      </div>
      <span className="text-xs text-muted-foreground shrink-0 ml-3">{lastSeen}</span>
    </Link>
  )
}
