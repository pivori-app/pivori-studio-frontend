import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LayoutDashboard, Zap, Database, BarChart3, CreditCard, HelpCircle, Settings, LogOut, Moon, Sun } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Handle responsive
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Keep sidebar open on desktop, closed on mobile
      if (!mobile && !sidebarOpen) {
        setSidebarOpen(true)
      }
    }

    window.addEventListener('resize', handleResize)
    // Call once on mount to set initial state
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [sidebarOpen])

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [location.pathname, isMobile])

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard, path: '/' },
    { id: 'applications', label: 'Applications', icon: Zap, path: '/applications' },
    { id: 'connectors', label: 'Connecteurs', icon: Database, path: '/connectors' },
    { id: 'knowledge', label: 'Connaissances', icon: Database, path: '/knowledge' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
    { id: 'payments', label: 'Paiements', icon: CreditCard, path: '/payments' },
    { id: 'help', label: 'Aide', icon: HelpCircle, path: '/help' },
    { id: 'settings', label: 'Paramètres', icon: Settings, path: '/settings' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} overflow-hidden`}>
      {/* Sidebar - Hidden on mobile, visible on tablet/desktop */}
      <aside 
        className={`
          fixed md:static top-0 left-0 h-full z-40
          transition-all duration-300 ease-in-out
          ${isMobile && !sidebarOpen ? '-translate-x-full' : 'translate-x-0'}
          ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
          border-r shadow-sm overflow-hidden flex flex-col
          w-64 md:w-72
        `}
      >
        {/* Sidebar Header */}
        <div 
          onClick={() => {
            navigate('/')
            if (isMobile) setSidebarOpen(false)
          }}
          className={`px-4 py-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              ✦
            </div>
            <div>
              <div className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Pivori</div>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Studio</div>
            </div>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className={`flex-1 px-3 py-4 space-y-1 overflow-y-auto ${isDarkMode ? 'scrollbar-dark' : ''}`}>
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path)
                  if (isMobile) setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? `${isDarkMode ? 'bg-gray-700 text-blue-400 border-l-4 border-blue-400' : 'bg-gray-100 text-blue-600 border-l-4 border-blue-600'} font-semibold`
                    : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} hover:text-gray-900`
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className="text-sm font-medium truncate">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className={`px-3 py-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            onClick={() => {
              navigate('/logout')
              if (isMobile) setSidebarOpen(false)
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
              isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span className="truncate">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header */}
        <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-4 md:px-6 py-4 sticky top-0 z-50 flex items-center justify-between`}>
          {/* Left side - Logo on desktop only */}
          <div className="flex-1 md:flex-none">
            <div className="hidden md:flex items-center gap-2">
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                Pivori Studio
              </div>
            </div>
          </div>

          {/* Right side - Buttons aligned to the right */}
          <div className="flex items-center justify-end gap-2 md:gap-4 ml-auto">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Mode sombre"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Profile */}
            <button className={`w-10 h-10 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} hover:${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'} flex items-center justify-center transition-colors`}>
              👤
            </button>

            {/* Hamburger Menu - ALWAYS on the right, visible only on mobile */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'hover:bg-gray-700 text-gray-300'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                title={sidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-white'} px-4 md:px-8 py-4 md:py-8`}>
          <div className="w-full h-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className={`${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'} border-t px-4 md:px-6 py-4 text-center text-xs`}>
          <p>© 2025 Pivori Studio. Tous droits réservés.</p>
        </footer>
      </div>
    </div>
  )
}

