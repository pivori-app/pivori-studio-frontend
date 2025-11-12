import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Application {
  id: number
  name: string
  description: string
  icon: string
  status: 'active' | 'maintenance' | 'inactive'
  users: number
  revenue: string
  health: number
}

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      name: 'LocaSimple',
      description: 'Gestion locative intelligente',
      icon: '🏠',
      status: 'active',
      users: 1247,
      revenue: '€15 420',
      health: 98
    },
    {
      id: 2,
      name: 'Wingly',
      description: 'Plateforme de vols partagés',
      icon: '✈️',
      status: 'active',
      users: 892,
      revenue: '€8 930',
      health: 95
    },
    {
      id: 3,
      name: 'ThémaLink',
      description: 'Liens thématiques intelligents',
      icon: '🔗',
      status: 'maintenance',
      users: 2156,
      revenue: '€12 340',
      health: 87
    },
    {
      id: 4,
      name: 'HeroChildren',
      description: 'Plateforme éducative pour enfants',
      icon: '🦸',
      status: 'active',
      users: 3421,
      revenue: '€24 560',
      health: 99
    }
  ])

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Actif' },
      maintenance: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Maintenance' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Inactif' }
    }
    const config = statusMap[status] || statusMap.active
    return (
      <span className={`inline-block px-3 py-1 ${config.bg} ${config.text} rounded-full text-xs font-medium`}>
        {config.label}
      </span>
    )
  }

  const handleGenerate = (appId: number) => {
    alert(`Génération du code pour l'application ${appId}...`)
  }

  const handleClone = (appId: number) => {
    alert(`Clonage de l'application ${appId}...`)
  }

  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = (appId: number) => {
    setOpenMenuId(openMenuId === appId ? null : appId)
  }

  const handleMenuAction = (action: string, appId: number) => {
    alert(`${action} pour l'application ${appId}`)
    setOpenMenuId(null)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Mes Applications
          </h2>
          <p className="text-gray-600">
            Gérez et surveillez toutes vos applications
          </p>
        </div>
        <Link
          to="/applications/new"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 w-full md:w-auto"
        >
          <span className="text-xl">+</span>
          Nouvelle Application
        </Link>
      </div>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* App Header */}
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-5xl">{app.icon}</div>
                  <div className="w-3 h-3 bg-white0 rounded-full"></div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(app.status)}
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => toggleMenu(app.id)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Plus d'options"
                    >
                      <span className="text-xl font-bold text-gray-600">...</span>
                    </button>
                    {openMenuId === app.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1">
                        <button
                          onClick={() => handleMenuAction('Éditer', app.id)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700"
                        >
                          ✏️ Éditer
                        </button>
                        <button
                          onClick={() => handleMenuAction('Dupliquer', app.id)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700"
                        >
                          📋 Dupliquer
                        </button>
                        <button
                          onClick={() => handleMenuAction('Paramètres', app.id)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700"
                        >
                          ⚙️ Paramètres
                        </button>
                        <button
                          onClick={() => handleMenuAction('Analyser', app.id)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-gray-700"
                        >
                          📊 Analyser
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={() => handleMenuAction('Archiver', app.id)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors text-sm text-orange-600"
                        >
                          📦 Archiver
                        </button>
                        <button
                          onClick={() => handleMenuAction('Supprimer', app.id)}
                          className="w-full text-left px-4 py-2 hover:bg-white transition-colors text-sm text-red-600"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{app.name}</h3>
              <p className="text-gray-600 text-sm">{app.description}</p>
            </div>

            {/* App Stats */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Utilisateurs</p>
                  <p className="text-lg font-bold text-blue-600">{app.users.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Revenus</p>
                  <p className="text-lg font-bold text-green-600">{app.revenue}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Santé</p>
                  <p className="text-lg font-bold text-emerald-600">{app.health}%</p>
                </div>
              </div>
              <div className="text-xs text-gray-500 pt-2">
                Mis à jour il y a 2 min
              </div>

              {/* Health Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${app.health}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-gray-50 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => handleGenerate(app.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
              >
                Générer
              </button>
              <button
                onClick={() => handleClone(app.id)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm"
              >
                Cloner
              </button>
              <Link
                to="/applications/new"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 text-sm text-center"
              >
                Nouveau
              </Link>
            </div>
          </div>
        ))}

        {/* New Application Card */}
        <Link
          to="/applications/new"
          className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-white transition-all duration-300 flex flex-col items-center justify-center p-8 cursor-pointer group"
        >
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">+</div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            Nouvelle Application
          </h3>
          <p className="text-gray-600 text-sm text-center mt-2">
            Créez une nouvelle application en quelques clics
          </p>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <p className="text-gray-700 text-sm font-medium mb-1">Applications</p>
          <p className="text-3xl font-bold text-blue-600">{applications.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <p className="text-gray-700 text-sm font-medium mb-1">Utilisateurs totaux</p>
          <p className="text-3xl font-bold text-green-600">
            {applications.reduce((sum, app) => sum + app.users, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <p className="text-gray-700 text-sm font-medium mb-1">Revenus totaux</p>
          <p className="text-3xl font-bold text-purple-600">
            €{applications.reduce((sum, app) => sum + parseInt(app.revenue.replace(/[€\s]/g, '')), 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-lg p-4">
          <p className="text-gray-700 text-sm font-medium mb-1">Santé moyenne</p>
          <p className="text-3xl font-bold text-emerald-600">
            {Math.round(applications.reduce((sum, app) => sum + app.health, 0) / applications.length)}%
          </p>
        </div>
      </div>
    </div>
  )
}

