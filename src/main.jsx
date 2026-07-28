import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { inject } from '@vercel/analytics'
import { SiteContentProvider } from './content/SiteContent'
import { LangueProvider } from './i18n'

inject()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LangueProvider>
      <SiteContentProvider>
        <App />
      </SiteContentProvider>
    </LangueProvider>
  </React.StrictMode>
)
