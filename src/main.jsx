import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { inject } from '@vercel/analytics'
import { SiteContentProvider } from './content/SiteContent'

inject()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SiteContentProvider>
      <App />
    </SiteContentProvider>
  </React.StrictMode>
)
