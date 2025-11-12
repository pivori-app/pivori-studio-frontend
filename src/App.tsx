import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Applications from './pages/Applications'
import NewApplication from './pages/NewApplication'
import Services from './pages/Services'
import Settings from './pages/Settings'
import Connecteurs from './pages/Connecteurs'
import Connaissances from './pages/Connaissances'
import AnalyticsDashboard from './pages/AnalyticsDashboard'
import PaymentHub from './pages/PaymentHub'
import Help from './pages/Help'
import AppleSidebar from './components/AppleSidebar'
import ErrorBoundary from './components/ErrorBoundary'
import { useServiceWorker } from './hooks/useServiceWorker'
import { AppProvider } from './context/AppContext'
import { useState, useEffect } from 'react'

function App() {
  // Initialize Service Worker
  useServiceWorker()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(() => {
    // Récupérer le mode depuis localStorage
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      return JSON.parse(saved)
    }
    // Vérifier la préférence système
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  // Appliquer le dark mode au document
  useEffect(() => {
    const html = document.documentElement
    if (darkMode) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
          {/* Apple-style Sidebar */}
          <AppleSidebar 
            isOpen={sidebarOpen} 
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            darkMode={darkMode}
            onDarkModeToggle={() => setDarkMode(!darkMode)}
          />
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto transition-all duration-300">
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/applications/new" element={<NewApplication />} />
                <Route path="/new-application" element={<NewApplication />} />
                <Route path="/services" element={<Services />} />
                <Route path="/aide" element={<Help />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/connecteurs" element={<Connecteurs />} />
                <Route path="/connaissances" element={<Connaissances />} />
                <Route path="/analytics" element={<AnalyticsDashboard />} />
                <Route path="/payments" element={<PaymentHub />} />
              </Routes>
            </div>
          </main>
          </div>
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  )
}

export default App

