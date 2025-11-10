export default function Services() {
  const services = [
    { id: 1, name: 'Géolocalisation', port: 8010, status: 'healthy', uptime: '99.99%', requests: '125K' },
    { id: 2, name: 'Routage', port: 8020, status: 'healthy', uptime: '99.95%', requests: '98K' },
    { id: 3, name: 'Trading', port: 8040, status: 'healthy', uptime: '99.98%', requests: '156K' },
    { id: 4, name: 'Streaming', port: 8050, status: 'healthy', uptime: '99.99%', requests: '234K' },
    { id: 5, name: 'Paiement', port: 8060, status: 'healthy', uptime: '99.97%', requests: '87K' },
  ]

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      healthy: { bg: 'bg-green-100', text: 'text-green-800', label: 'Sain' },
      warning: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Attention' },
      error: { bg: 'bg-red-100', text: 'text-red-800', label: 'Erreur' }
    }
    const config = statusMap[status] || statusMap.healthy
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 ${config.bg} ${config.text} rounded-full text-sm font-medium`}>
        <span className="w-2 h-2 bg-current rounded-full"></span>
        {config.label}
      </span>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Services
        </h2>
        <p className="text-gray-600">
          Gestion et monitoring de tous les microservices
        </p>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Service
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Port
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Statut
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Disponibilité
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Requêtes
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4">
                  <span className="font-medium text-gray-900">{service.name}</span>
                </td>
                <td className="px-6 py-4">
                  <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                    {service.port}
                  </code>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(service.status)}
                </td>
                <td className="px-6 py-4">
                  <span className="text-green-600 font-medium">{service.uptime}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-700">{service.requests}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-bold text-gray-900 text-lg">{service.name}</h3>
              {getStatusBadge(service.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Port</p>
                <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm block">
                  {service.port}
                </code>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Disponibilité</p>
                <p className="text-green-600 font-medium">{service.uptime}</p>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Requêtes</p>
              <p className="text-gray-900 font-medium">{service.requests}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <p className="text-gray-700 text-sm font-medium mb-1">Services actifs</p>
          <p className="text-3xl font-bold text-green-600">{services.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <p className="text-gray-700 text-sm font-medium mb-1">Disponibilité moyenne</p>
          <p className="text-3xl font-bold text-blue-600">99.98%</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
          <p className="text-gray-700 text-sm font-medium mb-1">Total requêtes</p>
          <p className="text-3xl font-bold text-purple-600">700K</p>
        </div>
      </div>
    </div>
  )
}

