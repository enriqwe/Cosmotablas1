import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'
import { SoundProvider } from '@/contexts/SoundContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <SoundProvider>
        <App />
      </SoundProvider>
    </ErrorBoundary>
  </StrictMode>,
)
