import { useNavigate } from 'react-router-dom'
import { Plus, BarChart3, HelpCircle, Zap } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

export default function Dashboard() {
  const navigate = useNavigate()

  const quickActions = [
    {
      id: 'create-app',
      icon: Plus,
      title: 'Créer une App',
      description: 'Lancez votre première application en 5 minutes',
      action: () => navigate('/new-application'),
      color: 'blue',
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Voir les Stats',
      description: 'Analysez les performances de vos apps',
      action: () => navigate('/analytics'),
      color: 'green',
    },
    {
      id: 'help',
      icon: HelpCircle,
      title: 'Aide & Tutos',
      description: 'Guides et tutoriels pour débuter',
      action: () => navigate('/help'),
      color: 'purple',
    },
  ]

  const { applications: contextApps } = useAppContext()
  const applications = contextApps.slice(0, 2).map(app => ({
    id: app.id,
    name: app.name,
    status: app.status === 'active' ? 'En ligne' : 'Maintenance',
    users: app.users,
    connections: Math.floor(Math.random() * 200) + 10,
    lastUpdate: '2 heures',
  }))

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; icon: string }> = {
      blue: { bg: 'bg-blue-50 dark:bg-blue-900/10', border: 'border-l-blue-500', icon: 'bg-blue-500' },
      green: { bg: 'bg-green-50 dark:bg-green-900/10', border: 'border-l-green-500', icon: 'bg-green-500' },
      purple: { bg: 'bg-purple-50 dark:bg-purple-900/10', border: 'border-l-purple-500', icon: 'bg-purple-500' },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Bonjour! 👋
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Créez votre première application en quelques clics
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {quickActions.map((action) => {
            const Icon = action.icon
            const colors = getColorClasses(action.color)
            
            return (
              <button
                key={action.id}
                onClick={action.action}
                className={`${colors.bg} border-l-4 ${colors.border} border-r border-t border-b border-gray-200 dark:border-gray-700 rounded-xl p-6 text-left hover:shadow-lg transition-all duration-200 cursor-pointer group`}
              >
                {/* Icon */}
                <div className={`${colors.icon} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {action.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </button>
            )
          })}
        </div>

        {/* Applications Section */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Section Header */}
          <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Mes Applications
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gérez et surveillez vos applications
              </p>
            </div>
            <button
              onClick={() => navigate('/new-application')}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Nouvelle App</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Application
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white hidden sm:table-cell">
                    Utilisateurs
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white hidden md:table-cell">
                    Connexions
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white hidden lg:table-cell">
                    Mise à jour
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr
                    key={app.id}
                    className={`border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                      index === applications.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {app.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 hidden sm:table-cell">
                      {app.users.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 hidden md:table-cell">
                      {app.connections}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                      {app.lastUpdate}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {applications.length === 0 && (
            <div className="px-6 py-12 text-center">
              <Zap size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Aucune application créée
              </p>
              <button
                onClick={() => navigate('/new-application')}
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={20} />
                Créer une application
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

