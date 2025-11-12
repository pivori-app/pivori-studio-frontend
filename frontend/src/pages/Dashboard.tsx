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
      action: () => navigate('/new-application'),
    },
    {
      id: 'analytics',
      icon: BarChart3,
      title: 'Voir les Stats',
      description: 'Analysez les performances de vos apps',
      action: () => navigate('/analytics'),
    },
    {
      id: 'help',
      icon: HelpCircle,
      title: 'Aide & Tutos',
      description: 'Guides et tutoriels pour débuter',
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
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Bonjour! 👋
        </h1>
        <p className="text-base text-gray-600">
          Créez votre première application en quelques clics
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.id}
                onClick={action.action}
                className={`bg-white border-l-4 border-r border-t border-b border-gray-200 rounded-xl p-6 text-left hover:shadow-lg transition-all duration-200 cursor-pointer ${
                  action.id === 'create-app' ? 'border-l-blue-600' :
                  action.id === 'analytics' ? 'border-l-green-600' :
                  'border-l-purple-600'
                }`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 ${
                  action.id === 'create-app' ? 'bg-blue-600' :
                  action.id === 'analytics' ? 'bg-green-600' :
                  'bg-purple-600'
                }`}>
                  <Icon size={24} className="text-white" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600">
                  {action.description}
                </p>
              </button>
            )
          })}
        </div>

        {/* Applications Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Mes Applications</h2>
              <p className="text-sm text-gray-600 mt-1">Gérez et surveillez vos applications</p>
            </div>
            <button
              onClick={() => navigate('/new-application')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <Plus size={20} />
              Nouvelle App
            </button>
          </div>

          {/* Applications Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Application</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Utilisateurs</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Connexions</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mise à jour</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Statut</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.users.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.connections}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.lastUpdate}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-green-700 bg-green-100">
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

