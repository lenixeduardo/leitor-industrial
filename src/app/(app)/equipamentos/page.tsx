import EquipamentoList from '@/components/equipamentos/EquipamentoList'

export default function EquipamentosPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="p-4 border-b">
        <h1 className="text-lg font-semibold">Ativos</h1>
      </div>
      <EquipamentoList />
    </div>
  )
}
