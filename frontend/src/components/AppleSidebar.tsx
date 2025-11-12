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
  X,
  ChevronRight,
  Moon,
  Sun
} from 'lucide-react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'

interface AppleSidebarProps {
  isOpen: boolean
  onToggle: () => void
  darkMode: boolean
  onDarkModeToggle: () => void
}

export default function AppleSidebar({ isOpen, onToggle, darkMode, onDarkModeToggle }: AppleSidebarProps) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const menuItems = [
    { icon: LayoutDashboard, label: 'Tableau de bord', path: '/', id: 'dashboard' },
    { icon: Package, label: 'Applications', path: '/applications', id: 'apps' },
    { icon: Plug, label: 'Connecteurs', path: '/connecteurs', id: 'connectors' },
    { icon: BookOpen, label: 'Connaissances', path: '/connaissances', id: 'knowledge' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics', id: 'analytics' },
    { icon: CreditCard, label: 'Paiements', path: '/payments', id: 'payments' },
    { icon: Zap, label: 'Services', path: '/services', id: 'services' },
    { icon: HelpCircle, label: 'Aide', path: '/aide', id: 'help' },
    { icon: Settings, label: 'Paramètres', path: '/settings', id: 'settings' },
  ]

  const isActive = (path: string) => {
    return location.pathname === path || (path === '/' && location.pathname === '/')
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white dark:bg-gray-900 p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-40 flex flex-col
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className={`flex items-center gap-2 ${collapsed ? 'justify-center w-full' : ''}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">✦</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 dark:text-white">Pivori</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Studio</span>
              </div>
            )}
          </div>
          
          {/* Collapse Button - Desktop Only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            <ChevronRight size={18} className={`transition-transform ${collapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              
              return (
                <li key={item.id}>
                  <a
                    href={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                      ${active 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                    title={collapsed ? item.label : ''}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {!collapsed && (
                      <span className="flex-1 text-sm">{item.label}</span>
                    )}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Dark Mode Toggle Button */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onDarkModeToggle}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
              ${darkMode
                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-medium'
                : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 font-medium'
              }
            `}
            title={darkMode ? 'Mode clair' : 'Mode sombre'}
          >
            {darkMode ? (
              <>
                <Sun size={20} className="flex-shrink-0" />
                {!collapsed && <span className="flex-1 text-sm">Mode clair</span>}
              </>
            ) : (
              <>
                <Moon size={20} className="flex-shrink-0" />
                {!collapsed && <span className="flex-1 text-sm">Mode sombre</span>}
              </>
            )}
          </button>
        </div>

        {/* Footer - Hidden when collapsed on mobile */}
        {!collapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 hidden lg:block">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              © 2025 Pivori Studio
            </p>
          </div>
        )}
      </aside>

      {/* Main Content Spacer */}
      <div className={`transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`} />
    </>
  )
}

