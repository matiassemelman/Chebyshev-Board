import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Importar configuración de i18n
import './infrastructure/i18n/config.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <React.Suspense fallback="loading...">
      <App />
    </React.Suspense>
  </StrictMode>,
)
