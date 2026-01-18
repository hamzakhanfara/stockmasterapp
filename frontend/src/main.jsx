import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global-bg.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { StoreProvider } from './context/StoreContext'
import './i18n'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <StoreProvider>
        <App />
      </StoreProvider>
    </ClerkProvider>
  </StrictMode>,
)
