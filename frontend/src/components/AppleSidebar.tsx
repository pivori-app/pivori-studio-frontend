import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Zap, 
  Settings, 
  HelpCircle,
  BarChart3,
  CreditCard,
  Plug,
  BookOpen,
  Package,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

interface AppleSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export default function AppleSidebar({ isOpen, onToggle }: AppleSidebarProps) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/', id: 'dashboard' },
    { icon: Package, label: 'Applications', path: '/applications', id: 'apps' },
    { icon: Plug, label: 'Connecteurs', path: '/connecteurs', id: 'connectors' },
    { icon: BookOpen, label: 'Connaissances', path: '/connaissances', id: 'knowledge' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', id: 'analytics' },
    { icon: CreditCard, label: 'Paiements', path: '/payments', id: 'payments' },
    { icon: Zap, label: 'Services', path: '/services', id: 'services' },
  ]

  const isActive = (path: string) => {
    return location.pathname === path || (path === '/' && location.pathname === '/')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 md:hidden bg-white dark:bg-gray-900 p-2 rounded-lg shadow-md"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        style={{
          width: isOpen ? '280px' : '80px',
          transition: 'width 300ms ease-in-out'
        }}
        className="fixed md:static top-0 left-0 h-screen bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 z-40 flex flex-col"
      >
        {/* Logo Section */}
        <div className="px-4 py-6 border-b border-gray-200 dark:border-gray-800">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">✦</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">Pivori</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Studio</p>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  active
                    ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold border-l-4 border-blue-600'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 px-3 py-4 space-y-1">
          <Link
            to="/help"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap ${
              isActive('/help')
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold border-l-4 border-blue-600'
                : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900'
            }`}
          >
            <HelpCircle size={20} className="flex-shrink-0" />
            <span className="text-sm font-medium">Aide</span>
          </Link>

          <Link
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 whitespace-nowrap ${
              isActive('/settings')
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-semibold border-l-4 border-blue-600'
                : 'text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900'
            }`}
          >
            <Settings size={20} className="flex-shrink-0" />
            <span className="text-sm font-medium">Paramètres</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  )
}

