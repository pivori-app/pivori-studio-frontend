import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Copy, Code2, MoreVertical, Zap, Globe } from 'lucide-react'
import { useAppContext } from '../context/AppContext'

const CURRENCIES = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'Dollar US' },
  { code: 'GBP', symbol: '£', name: 'Livre Sterling' },
  { code: 'JPY', symbol: '¥', name: 'Yen Japonais' },
  { code: 'CAD', symbol: 'C$', name: 'Dollar Canadien' },
  { code: 'AUD', symbol: 'A$', name: 'Dollar Australien' },
  { code: 'CHF', symbol: 'CHF', name: 'Franc Suisse' },
  { code: 'CNY', symbol: '¥', name: 'Yuan Chinois' },
  { code: 'INR', symbol: '₹', name: 'Roupie Indienne' },
  { code: 'MXN', symbol: '$', name: 'Peso Mexicain' }
]

export default function Applications() {
  const { applications, updateApplication } = useAppContext()
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [showCurrencyMenu, setShowCurrencyMenu] = useState<string | null>(null)

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; icon: string; label: string }> = {
      active: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', icon: '●', label: 'Actif' },
      maintenance: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', icon: '●', label: 'Maintenance' },
      inactive: { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400', icon: '●', label: 'Inactif' }
    }
    const config = statusMap[status] || statusMap.active
    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 ${config.bg} ${config.text} rounded-full text-sm font-medium`}>
        <span className="w-2 h-2 rounded-full bg-current" />
        {config.label}
      </span>
    )
  }

  const getCurrencySymbol = (code: string) => {
    const currency = CURRENCIES.find(c => c.code === code)
    return currency ? currency.symbol : code
  }

  const handleCurrencyChange = (appId: string, newCurrency: string) => {
    updateApplication(appId, { currency: newCurrency })
    setShowCurrencyMenu(null)
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Mes Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gérez et surveillez toutes vos applications
          </p>
        </div>
        <Link
          to="/applications/new"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 self-start sm:self-auto"
        >
          <Plus size={20} />
          Nouvelle App
        </Link>
      </div>

      {/* Applications Grid */}
      {applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Aucune application créée</p>
          <Link
            to="/applications/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            <Plus size={18} />
            Créer une application
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-all duration-300"
            >
              {/* App Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{app.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {app.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {app.description}
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <MoreVertical size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Utilisateurs</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {app.users.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Revenu</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {getCurrencySymbol(app.currency)}{(app.revenue / 1000).toFixed(1)}k
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Santé</p>
                  <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        app.health >= 90 ? 'bg-green-500' :
                        app.health >= 70 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${app.health}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{app.health}%</p>
                </div>
              </div>

              {/* Currency & Status */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="relative">
                  <button
                    onClick={() => setShowCurrencyMenu(showCurrencyMenu === app.id ? null : app.id)}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-colors"
                  >
                    <Globe size={16} />
                    {app.currency}
                  </button>
                  
                  {showCurrencyMenu === app.id && (
                    <div className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-max">
                      {CURRENCIES.map((curr) => (
                        <button
                          key={curr.code}
                          onClick={() => handleCurrencyChange(app.id, curr.code)}
                          className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                            app.currency === curr.code ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {curr.symbol} {curr.code} - {curr.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {getStatusBadge(app.status)}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  <Code2 size={18} />
                  Générer
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  <Copy size={18} />
                  Cloner
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

