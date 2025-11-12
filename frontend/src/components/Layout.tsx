import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LayoutDashboard, Zap, Database, BarChart3, CreditCard, HelpCircle, Settings, LogOut } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

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
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '288px' : '0px',
        transition: 'width 300ms ease-in-out'
      }} className="bg-white border-r border-gray-200 overflow-hidden flex flex-col shadow-sm">
        {/* Sidebar Header */}
        <div 
          onClick={() => navigate('/')}
          className="px-4 py-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
              ✦
            </div>
            <div>
              <div className="text-base font-bold text-gray-900">Pivori</div>
              <div className="text-xs text-gray-600">Studio</div>
            </div>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-gray-100 text-blue-600 font-semibold border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon size={18} className="flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="px-3 py-4 border-t border-gray-200">
          <button
            onClick={() => navigate('/logout')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-all duration-200 text-sm font-medium"
          >
            <LogOut size={18} className="flex-shrink-0" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-700"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors">
              👤
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-white px-8 py-8">
          <div className="w-full h-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 px-6 py-4 text-center text-xs text-gray-600">
          <p>© 2025 Pivori Studio. Tous droits réservés.</p>
        </footer>
      </div>
    </div>
  )
}

