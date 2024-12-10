import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <>
    <meta httpEquiv="Cross-Origin-Opener-Policy" content="same-origin" />
    <StrictMode>
      <App />
    </StrictMode>
  </>
)
