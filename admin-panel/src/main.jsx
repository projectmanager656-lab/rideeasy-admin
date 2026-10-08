import { createRoot } from 'react-dom/client'
import './index.css'
import 'leaflet/dist/leaflet.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { initSentry } from './initSentry'
import SocketProvider from './context/SocketContext'
import { AdminLanguageProvider } from './context/AdminLanguageContext'

void initSentry()

createRoot(document.getElementById('root')).render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <SocketProvider>
      <AdminLanguageProvider>
        <App />
      </AdminLanguageProvider>
    </SocketProvider>
  </BrowserRouter>
)
