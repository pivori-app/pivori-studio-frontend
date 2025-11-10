export default function Dashboard() {
  const stats = [
    {
      id: 1,
      label: 'Services',
      value: '15',
      color: 'blue',
      icon: '⚙️',
      description: 'Services actifs'
    },
    {
      id: 2,
      label: 'Sains',
      value: '15',
      color: 'green',
      icon: '✓',
      description: 'Services en bonne santé'
    },
    {
      id: 3,
      label: 'Disponibilité',
      value: '99.9%',
      color: 'emerald',
      icon: '📈',
      description: 'Uptime mensuel'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'from-blue-50 to-blue-100 border-blue-200',
      green: 'from-green-50 to-green-100 border-green-200',
      emerald: 'from-emerald-50 to-emerald-100 border-emerald-200'
    }
    return colors[color] || colors.blue
  }

  const getTextColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      emerald: 'text-emerald-600'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Tableau de bord
        </h2>
        <p className="text-gray-600">
          Aperçu en temps réel de vos services et de leur état de santé
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`bg-gradient-to-br ${getColorClasses(stat.color)} border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-gray-700 text-sm font-medium mb-1">
                  {stat.label}
                </p>
                <p className={`text-3xl md:text-4xl font-bold ${getTextColorClasses(stat.color)}`}>
                  {stat.value}
                </p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
            <p className="text-gray-600 text-xs md:text-sm">
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Activité récente
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600">📊</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-medium truncate">
                Tous les services sont opérationnels
              </p>
              <p className="text-gray-500 text-sm">
                Il y a 2 minutes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-green-600">✓</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-medium truncate">
                Sauvegarde automatique complétée
              </p>
              <p className="text-gray-500 text-sm">
                Il y a 1 heure
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600">🔄</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-medium truncate">
                Mise à jour de sécurité appliquée
              </p>
              <p className="text-gray-500 text-sm">
                Il y a 3 heures
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
          Voir les détails
        </button>
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors duration-200">
          Exporter le rapport
        </button>
      </div>
    </div>
  )
}

