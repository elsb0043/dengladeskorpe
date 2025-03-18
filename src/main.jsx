import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AlertProvider } from './context/alertContext.jsx'
import { AuthContextProvider } from './context/authContext.jsx'
import { BasketProvider } from './context/basketContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <BasketProvider>
          <AlertProvider>
            <App />
          </AlertProvider>
        </BasketProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)