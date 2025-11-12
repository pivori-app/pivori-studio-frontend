import { useState } from 'react'
import { Plus, Search, Plug, CheckCircle2, Circle } from 'lucide-react'

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
  const [searchQuery, setSearchQuery] = useState('')

  const handleConnect = (id: number) => {
    setConnectors(connectors.map(c => c.id === id ? { ...c, connected: !c.connected } : c))
  }

  const filteredConnectors = connectors.filter(c => {
    const matchesTab = activeTab === 'applications' ? ['cloud', 'ai', 'communication'].includes(c.category) :
                       activeTab === 'api' ? ['database', 'workflow'].includes(c.category) :
                       false
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const tabs = [
    { id: 'applications', label: 'Applications', count: connectors.filter(c => ['cloud', 'ai', 'communication'].includes(c.category)).length },
    { id: 'api', label: 'API & Workflow', count: connectors.filter(c => ['database', 'workflow'].includes(c.category)).length },
    { id: 'mcp', label: 'MCP Personnalisé', count: 0 },
  ]

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Connecteurs
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Intégrez vos outils préférés pour automatiser vos flux de travail
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'applications' | 'api' | 'mcp')}
              className={`px-4 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-gray-200 dark:bg-gray-800 rounded-full text-xs font-medium">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un connecteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Connectors Grid */}
        {filteredConnectors.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
            <Plug size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 dark:text-gray-400">
              Aucun connecteur trouvé
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConnectors.map((connector) => (
              <div
                key={connector.id}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-4xl">{connector.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {connector.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {connector.category}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConnect(connector.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      connector.connected
                        ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                        : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {connector.connected ? (
                      <CheckCircle2 size={24} />
                    ) : (
                      <Circle size={24} />
                    )}
                  </button>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {connector.description}
                </p>

                {/* Footer */}
                <button
                  onClick={() => handleConnect(connector.id)}
                  className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                    connector.connected
                      ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
                  }`}
                >
                  {connector.connected ? 'Connecté' : 'Connecter'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

