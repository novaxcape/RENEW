import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
 import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './redox/store.js'
import './index.css'
import App from './App.jsx'
// import initClipboardHandler from './utils/clipboardHandler'

// // Initialize clipboard handler to prevent service worker errors
// initClipboardHandler()

// Simple loading component
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontSize: '20px'
  }}>
    Loading...
  </div>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
)