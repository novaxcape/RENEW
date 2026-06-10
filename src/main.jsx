import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import initClipboardHandler from './utils/clipboardHandler'

// // Initialize clipboard handler to prevent service worker errors
// initClipboardHandler()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
