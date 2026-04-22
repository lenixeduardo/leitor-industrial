import HistoricoList from '@/components/historico/HistoricoList'

export default function HistoricoPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="p-4 border-b">
        <h1 className="text-lg font-semibold">Histórico de Leituras</h1>
      </div>
      <HistoricoList />
    </div>
  )
}
