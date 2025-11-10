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
import Navigation from './components/Navigation'
import ErrorBoundary from './components/ErrorBoundary'
import { useServiceWorker } from './hooks/useServiceWorker'

function App() {
  // Initialize Service Worker
  useServiceWorker()

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="container mx-auto px-4 py-6 md:py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/applications/new" element={<NewApplication />} />
              <Route path="/services" element={<Services />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/connecteurs" element={<Connecteurs />} />
              <Route path="/connaissances" element={<Connaissances />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/payments" element={<PaymentHub />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
