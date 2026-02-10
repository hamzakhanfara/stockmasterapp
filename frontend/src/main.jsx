import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global-bg.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { StoreProvider } from './context/StoreContext'
import './i18n'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}
const theme = createTheme({
  typography: {
    fontFamily: [
      'Nunito',
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'Roboto',
      'Helvetica',
      'Arial',
      'Apple Color Emoji',
      'Segoe UI Emoji'
    ].join(', '),
  },
})

const clerkAppearance = {
  baseTheme: undefined,
  variables: {
    colorPrimary: '#2563eb',
    colorText: '#0f172a',
    colorTextSecondary: '#64748b',
    colorBackground: '#ffffff',
    colorInputBackground: '#ffffff',
    colorInputText: '#0f172a',
    fontFamily: 'Nunito, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial',
    borderRadius: '0.5rem',
  },
  elements: {
    card: 'box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); border-radius: 1rem;',
    headerTitle: 'font-weight: 800; color: #0f172a;',
    headerSubtitle: 'color: #64748b;',
    formButtonPrimary: 'background-color: #2563eb; border-radius: 0.5rem; text-transform: none; font-weight: 600; padding: 0.75rem 1rem; font-size: 1rem;',
    formFieldInput: 'border-color: #cbd5e1; border-radius: 0.5rem;',
    footerActionLink: 'color: #2563eb; font-weight: 600;',
    footerAction: 'display: none;',
    identityPreviewText: 'color: #0f172a;',
    identityPreviewEditButton: 'color: #2563eb;',
    socialButtonsBlockButton: 'border-color: #cbd5e1; border-radius: 0.5rem; color: #0f172a;',
    dividerLine: 'background-color: #e2e8f0;',
    dividerText: 'color: #64748b;',
  },
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={clerkAppearance}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StoreProvider>
          <App />
        </StoreProvider>
      </ThemeProvider>
    </ClerkProvider>
  </StrictMode>,
)
