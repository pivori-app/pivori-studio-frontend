import { useState } from 'react'

interface Connector {
  id: number
  name: string
  description: string
  icon: string
  category: 'cloud' | 'ai' | 'database' | 'workflow' | 'communication'
  connected: boolean
}

export default function Connecteurs() {
  const [connectors, setConnectors] = useState<Connector[]>([
    {
      id: 1,
      name: 'Google Drive',
      description: 'Ajouter des Docs, Sheets, Slides et d\'autres fichiers depuis Google Drive.',
      icon: '🔵',
      category: 'cloud',
      connected: false,
    },
    {
      id: 2,
      name: 'GitHub',
      description: 'Gérez des dépôts, suivez les modifications de code et collaborez sur des projets d\'équipe',
      icon: '⚫',
      category: 'workflow',
      connected: true,
    },
    {
      id: 3,
      name: 'Anthropic',
      description: 'Accédez à des services d\'assistant AI fiables avec des conversations sûres et intelligentes',
      icon: '🔤',
      category: 'ai',
      connected: false,
    },
    {
      id: 4,
      name: 'Google Gemini',
      description: 'Traitez du contenu multimodal, notamment du texte, des images et du code, de manière transparente',
      icon: '✨',
      category: 'ai',
      connected: false,
    },
    {
      id: 5,
      name: 'API Supabase',
      description: 'Gérez des bases de données Postgres avec authentification, stockage de fichiers et plus encore',
      icon: '🟢',
      category: 'database',
      connected: true,
    },
    {
      id: 6,
      name: 'Supabase',
      description: 'Gérer les projets Supabase, interroger les bases de données et organiser les données efficacement',
      icon: '🟢',
      category: 'database',
      connected: false,
    },
    {
      id: 7,
      name: 'Vercel',
      description: 'Gérez les projets, déploiements et domaines Vercel',
      icon: '⬛',
      category: 'cloud',
      connected: false,
    },
    {
      id: 8,
      name: 'Gmail',
      description: 'Rédigez des réponses, recherchez dans votre boîte de réception et résumez instantanément les...',
      icon: '📧',
      category: 'communication',
      connected: false,
    },
  ])

  const [activeTab, setActiveTab] = useState<'applications' | 'api' | 'mcp'>('applications')
  const [showAddModal, setShowAddModal] = useState(false)

  const handleConnect = (id: number) => {
    setConnectors(connectors.map(c => c.id === id ? { ...c, connected: !c.connected } : c))
  }

  const filteredConnectors = connectors.filter(c => {
    if (activeTab === 'applications') return ['cloud', 'ai', 'communication'].includes(c.category)
    if (activeTab === 'api') return ['database', 'workflow'].includes(c.category)
    return false
  })

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Connecteurs</h1>
        <p className="text-gray-600">Intégrez vos outils préférés pour automatiser vos flux de travail</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'applications'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Applications
        </button>
        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'api'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          API personnalisée
        </button>
        <button
          onClick={() => setActiveTab('mcp')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'mcp'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          MCP personnalisé
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher un connecteur..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {filteredConnectors.map(connector => (
          <div
            key={connector.id}
            className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="text-4xl">{connector.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{connector.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{connector.description}</p>
                </div>
              </div>
              {connector.connected && (
                <div className="text-green-600 text-sm font-medium">✓</div>
              )}
            </div>
            <button
              onClick={() => handleConnect(connector.id)}
              className={`mt-4 w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                connector.connected
                  ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {connector.connected ? 'Connecté' : 'Connecter'}
            </button>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
      >
        <span>+</span>
        <span>Ajouter des connecteurs</span>
      </button>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ajouter un connecteur</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom du connecteur"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <textarea
                placeholder="Description"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

