import { useSession } from './store/sessionStore'
import HibernacaoPage from './pages/HibernacaoPage'
import AuthPage from './pages/AuthPage'
import MainPage from './pages/MainPage'
import LotePage from './pages/LotePage'
import AdminPage from './pages/AdminPage'

export default function App() {
  const { state } = useSession()

  const pages = {
    hibernacao: <HibernacaoPage />,
    auth: <AuthPage />,
    main: <MainPage />,
    lote: <LotePage />,
    admin: <AdminPage />,
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono">
      {pages[state.page]}
    </div>
  )
}
