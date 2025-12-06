import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { AuthProvider } from './lib/auth.tsx'
import { GoogleMapsProvider } from './components/maps/GoogleMapsProvider.tsx'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <GoogleMapsProvider>
          <App />
        </GoogleMapsProvider>
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
