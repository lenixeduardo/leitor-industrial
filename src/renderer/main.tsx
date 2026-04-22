import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app'
import { SessionProvider } from './store/sessionStore'
import './index.css'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Elemento #root não encontrado no DOM')

createRoot(rootEl).render(
  <StrictMode>
    <SessionProvider>
      <App />
    </SessionProvider>
  </StrictMode>
)
