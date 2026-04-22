import { useSession } from '../store/sessionStore'

export default function HibernacaoPage() {
  const { dispatch } = useSession()

  const handleActivate = () => {
    dispatch({ type: 'NAVIGATE', page: 'auth' })
  }

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center cursor-pointer select-none"
      onClick={handleActivate}
      onKeyDown={(e) => e.key === 'Enter' && handleActivate()}
      role="button"
      tabIndex={0}
      aria-label="Clique para autenticar"
    >
      <div className="flex flex-col items-center gap-8 opacity-50 hover:opacity-70 transition-opacity duration-500">
        {/* Ícone industrial */}
        <div className="w-32 h-32 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <svg
            viewBox="0 0 64 64"
            className="w-16 h-16 text-amber-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Representa um leitor de dados industrial */}
            <rect x="8" y="14" width="48" height="36" rx="3" />
            <line x1="8" y1="26" x2="56" y2="26" />
            <line x1="16" y1="34" x2="24" y2="34" />
            <line x1="16" y1="40" x2="20" y2="40" />
            <rect x="30" y="32" width="18" height="12" rx="1" />
            <circle cx="39" cy="38" r="3" />
          </svg>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-amber-500 tracking-[0.3em] uppercase">
            BatchReader
          </h1>
          <p className="text-gray-700 text-xs tracking-[0.2em] uppercase">
            Toque para iniciar
          </p>
        </div>
      </div>
    </div>
  )
}
