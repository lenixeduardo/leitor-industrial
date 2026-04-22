import type { Leitura } from '@/types'

interface LeituraItemProps {
  leitura: Leitura
}

export default function LeituraItem({ leitura }: LeituraItemProps) {
  const nome = leitura.equipamento?.nome
  const time = new Date(leitura.registrado_em).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="flex items-center justify-between py-3 px-4 border-b last:border-b-0">
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-medium truncate">{nome ?? leitura.serial}</span>
        {nome && (
          <span className="text-xs text-muted-foreground font-mono truncate">{leitura.serial}</span>
        )}
      </div>
      <span className="text-xs text-muted-foreground shrink-0 ml-3">{time}</span>
    </div>
  )
}
