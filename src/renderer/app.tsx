import { useSession } from './store/sessionStore'
import HibernacaoPage from './pages/HibernacaoPage'
import AuthPage from './pages/AuthPage'
import MainPage from './pages/MainPage'
import LotePage from './pages/LotePage'

export default function App() {
  const { state } = useSession()

  const pages = {
    hibernacao: <HibernacaoPage />,
    auth: <AuthPage />,
    main: <MainPage />,
    lote: <LotePage />,
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono">
      {pages[state.page]}
    </div>
  )
}
