import { useNavigate } from 'react-router-dom'
import { Plus, BarChart3, HelpCircle } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()

  const quickActions = [
    {
      id: 'create-app',
      icon: Plus,
      title: 'Créer une App',
      description: 'Lancez votre première application en 5 minutes',
      bgColor: '#007AFF',
      action: () => navigate('/new-application'),
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Voir les Stats',
      description: 'Analysez les performances de vos apps',
      bgColor: '#34C759',
      action: () => navigate('/analytics'),
    },
    {
      id: 'help',
      icon: HelpCircle,
      title: 'Aide & Tutos',
      description: 'Guides et tutoriels pour débuter',
      bgColor: '#AF52DE',
      action: () => navigate('/help'),
    },
  ]

  const applications = [
    {
      id: 1,
      name: 'Mon App Fitness',
      status: 'En ligne',
      users: 1250,
      connections: 45,
      lastUpdate: '2 heures',
    },
    {
      id: 2,
      name: 'Plateforme E-learning',
      status: 'En ligne',
      users: 3420,
      connections: 128,
      lastUpdate: '1 heure',
    },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid #E5E5EA',
        padding: '32px 24px',
        backgroundColor: '#FFFFFF'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#000000'
          }}>
            Bonjour! 👋
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#666666'
          }}>
            Créez votre première application en quelques clics
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: '32px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Quick Actions */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '48px'
          }}>
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.id}
                  onClick={action.action}
                  style={{
                    backgroundColor: '#F5F5F7',
                    border: '1px solid #E5E5EA',
                    borderRadius: '12px',
                    padding: '24px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 200ms ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)'
                    e.currentTarget.style.borderColor = '#007AFF'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = '#E5E5EA'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                    backgroundColor: action.bgColor,
                    color: 'white'
                  }}>
                    <Icon size={24} />
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    color: '#000000'
                  }}>
                    {action.title}
                  </h3>

                  {/* Description */}
                  <p style={{
                    fontSize: '14px',
                    color: '#666666'
                  }}>
                    {action.description}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Applications Section */}
          <div style={{ marginBottom: '48px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  marginBottom: '8px',
                  color: '#000000'
                }}>
                  Mes Applications
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: '#666666'
                }}>
                  Gérez et surveillez vos applications
                </p>
              </div>
              <button
                onClick={() => navigate('/new-application')}
                style={{
                  backgroundColor: '#000000',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 200ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#333333'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#000000'
                }}
              >
                <Plus size={16} />
                Nouvelle App
              </button>
            </div>

            {/* Applications List */}
            <div>
              {applications.map((app) => (
                <div
                  key={app.id}
                  style={{
                    backgroundColor: '#F5F5F7',
                    border: '1px solid #E5E5EA',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '16px',
                    transition: 'all 200ms ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
                    e.currentTarget.style.borderColor = '#007AFF'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none'
                    e.currentTarget.style.borderColor = '#E5E5EA'
                  }}
                >
                  {/* App Header */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#000000'
                    }}>
                      {app.name}
                    </h3>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: '#34C759',
                      color: 'white'
                    }}>
                      {app.status}
                    </span>
                  </div>

                  {/* App Stats */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '16px'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#007AFF',
                        marginBottom: '4px'
                      }}>
                        {app.users}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#666666'
                      }}>
                        Utilisateurs
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#007AFF',
                        marginBottom: '4px'
                      }}>
                        {app.connections}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#666666'
                      }}>
                        Connexions
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#007AFF',
                        marginBottom: '4px'
                      }}>
                        {app.lastUpdate}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#666666'
                      }}>
                        Mise à jour
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

