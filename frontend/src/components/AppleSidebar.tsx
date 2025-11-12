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

  const NavLink = ({ icon: Icon, label, path, id }: any) => (
    <Link
      to={path}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
        ${isActive(path)
          ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
        }
      `}
      onClick={() => setMobileOpen(false)}
    >
      <Icon size={20} />
      <span className={`${!isOpen && 'hidden md:inline'}`}>{label}</span>
    </Link>
  )

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
        className={`
          fixed md:static top-0 left-0 h-screen bg-white dark:bg-gray-950 
          border-r border-gray-200 dark:border-gray-800
          transition-all duration-300 z-40
          ${mobileOpen ? 'w-64' : 'w-64 md:w-20'}
          flex flex-col
        `}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">✦</span>
            </div>
            <div className={`${!isOpen && 'hidden md:hidden'}`}>
              <h1 className="text-lg font-bold text-gray-900 dark:text-white">Pivori</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Studio</p>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-2 py-6 space-y-2">
          {menuItems.map((item) => (
            <NavLink key={item.id} {...item} />
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2">
          <Link
            to="/help"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive('/help')
                ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
              }
            `}
            onClick={() => setMobileOpen(false)}
          >
            <HelpCircle size={20} />
            <span className={`${!isOpen && 'hidden md:inline'}`}>Aide</span>
          </Link>

          <Link
            to="/settings"
            className={`
              flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
              ${isActive('/settings')
                ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
              }
            `}
            onClick={() => setMobileOpen(false)}
          >
            <Settings size={20} />
            <span className={`${!isOpen && 'hidden md:inline'}`}>Paramètres</span>
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

