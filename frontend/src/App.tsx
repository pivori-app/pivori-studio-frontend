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
import { useState } from 'react'

function App() {
  // Initialize Service Worker
  useServiceWorker()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="flex h-screen bg-white dark:bg-black">
          {/* Apple-style Sidebar */}
          <AppleSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
          
          {/* Main Content */}
          <main className={`flex-1 overflow-auto transition-all duration-300 ${sidebarOpen ? 'md:ml-0' : 'md:ml-0'}`}>
            <div className="min-h-screen bg-white dark:bg-black">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/applications/new" element={<NewApplication />} />
                <Route path="/new-application" element={<NewApplication />} />
                <Route path="/services" element={<Services />} />
                <Route path="/help" element={<Help />} />
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
    </ErrorBoundary>
  )
}

export default App

