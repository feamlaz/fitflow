import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './styles/global.css'
import './styles/components.css'
import { useInitializeApp } from './hooks/useAppStore'

// Initialize app data
const InitializeApp = () => {
  useInitializeApp()
  return <App />
}

// Remove loading screen
const loadingScreen = document.getElementById('loading')
if (loadingScreen) {
  loadingScreen.style.opacity = '0'
  setTimeout(() => loadingScreen.remove(), 300)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <InitializeApp />
    </BrowserRouter>
  </React.StrictMode>,
)
