import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, LayoutDashboard, Zap, Database, BarChart3, CreditCard, Settings, HelpCircle, LogOut } from 'lucide-react'

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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* Sidebar */}
      <aside style={{
        position: sidebarOpen ? 'relative' : 'fixed',
        left: 0,
        top: 0,
        width: sidebarOpen ? '250px' : '0px',
        height: '100vh',
        backgroundColor: '#FFFFFF',
        borderRight: sidebarOpen ? '1px solid #E5E5EA' : 'none',
        transition: 'all 300ms ease',
        zIndex: 1000,
        overflowY: 'auto',
        boxShadow: sidebarOpen ? '0 4px 12px rgba(0, 0, 0, 0.05)' : 'none'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '24px 16px',
          borderBottom: '1px solid #E5E5EA',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/')}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #007AFF 0%, #AF52DE 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '20px',
            fontWeight: '700'
          }}>
            ✦
          </div>
          <div>
            <div style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#000000'
            }}>
              Pivori
            </div>
            <div style={{
              fontSize: '12px',
              color: '#666666'
            }}>
              Studio
            </div>
          </div>
        </div>

        {/* Sidebar Menu */}
        <nav style={{ padding: '16px 0' }}>
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path)
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: active ? '#F5F5F7' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: active ? '#007AFF' : '#666666',
                  fontSize: '14px',
                  fontWeight: active ? '600' : '500',
                  transition: 'all 200ms ease',
                  borderLeft: active ? '3px solid #007AFF' : '3px solid transparent'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = '#F5F5F7'
                    e.currentTarget.style.color = '#000000'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#666666'
                  }
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px',
          borderTop: '1px solid #E5E5EA',
          backgroundColor: '#FFFFFF'
        }}>
          <button
            onClick={() => navigate('/logout')}
            style={{
              width: '100%',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#F5F5F7',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#666666',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E5E5EA'
              e.currentTarget.style.color = '#000000'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F5F7'
              e.currentTarget.style.color = '#666666'
            }}
          >
            <LogOut size={18} />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        marginLeft: sidebarOpen ? '0px' : '0px'
      }}>
        {/* Header */}
        <header style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E5E5EA',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666666',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#000000'
              e.currentTarget.style.backgroundColor = '#F5F5F7'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#666666'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <button style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#F5F5F7',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#666666',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#E5E5EA'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F5F7'
            }}>
              👤
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: '#FFFFFF'
        }}>
          {children}
        </main>

        {/* Footer */}
        <footer style={{
          backgroundColor: '#F5F5F7',
          borderTop: '1px solid #E5E5EA',
          padding: '24px',
          textAlign: 'center',
          color: '#666666',
          fontSize: '12px'
        }}>
          <p>© 2025 Pivori Studio. Tous droits réservés.</p>
        </footer>
      </div>
    </div>
  )
}

