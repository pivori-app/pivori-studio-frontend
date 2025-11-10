import { useState } from 'react'

interface Connector {
  id: number
  name: string
  description: string
  icon: string
  category: 'cloud' | 'ai' | 'database' | 'workflow' | 'communication'
  connected: boolean
}

interface Knowledge {
  id: number
  name: string
  content: string
  createdAt: string
  status: boolean
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'api' | 'connecteurs' | 'connaissances'>('api')
  
  // API Settings
  const [settings, setSettings] = useState({
    apiUrl: 'http://localhost:8000',
    theme: 'light',
    notifications: true,
    autoBackup: true,
    language: 'fr'
  })
  const [saved, setSaved] = useState(false)

  // Connecteurs State
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
  const [connectorTab, setConnectorTab] = useState<'applications' | 'api' | 'mcp'>('applications')
  const [showConnectorModal, setShowConnectorModal] = useState(false)

  // Connaissances State
  const [knowledges, setKnowledges] = useState<Knowledge[]>([
    {
      id: 1,
      name: 'Workflow preference: Implementation order for suggestions and phases',
      content: 'When implementing numbered suggestions and project phases, especially in the context of project management or development.',
      createdAt: '11:58',
      status: true,
    },
    {
      id: 2,
      name: 'Préférence de validation de phases sur URL spécifique',
      content: 'L\'utilisateur exige que les résultats des phases 2 à 5 (Développement...',
      createdAt: '11:04',
      status: true,
    },
    {
      id: 3,
      name: 'Préférence de version d\'application: Version officielle la plus récente et complète',
      content: 'L\'utilisateur exige que la version de l\'application présentée via le lien ...',
      createdAt: '10:15',
      status: true,
    },
    {
      id: 4,
      name: 'Préférence de mode d\'interaction: Expert, approfondi et précis',
      content: 'L\'utilisateur préfère que toutes les interactions et les réponses soient...',
      createdAt: 'samedi',
      status: true,
    },
    {
      id: 5,
      name: 'Gestion du code source: Suppression des doublons et conservation de la dernière version',
      content: 'Lors de la gestion du code source sur des plateformes comme...',
      createdAt: 'samedi',
      status: true,
    },
    {
      id: 6,
      name: 'Music Box Sound Aesthetic Preference',
      content: 'When creating or modifying music in the style of a "boîte à musique"...',
      createdAt: 'samedi',
      status: true,
    },
    {
      id: 7,
      name: 'CONNECTEUR #51-Final UX/UI Optimization: Interface utilisateur professionnelle',
      content: 'FONCTIONNALITÉS PRINCIPALES: - Conception d\'une interface...',
      createdAt: '10/22',
      status: true,
    },
  ])
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedKnowledge, setSelectedKnowledge] = useState<Knowledge | null>(null)

  // API Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    setSaved(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  // Connecteurs Handlers
  const handleConnect = (id: number) => {
    setConnectors(connectors.map(c => c.id === id ? { ...c, connected: !c.connected } : c))
  }

  const filteredConnectors = connectors.filter(c => {
    if (connectorTab === 'applications') return ['cloud', 'ai', 'communication'].includes(c.category)
    if (connectorTab === 'api') return ['database', 'workflow'].includes(c.category)
    return false
  })

  // Connaissances Handlers
  const handleToggleStatus = (id: number) => {
    setKnowledges(knowledges.map(k => k.id === id ? { ...k, status: !k.status } : k))
  }

  const handleDelete = (id: number) => {
    setKnowledges(knowledges.filter(k => k.id !== id))
  }

  const handleEdit = (knowledge: Knowledge) => {
    setSelectedKnowledge(knowledge)
    setShowEditModal(true)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          API
        </h2>
        <p className="text-gray-600">
          Configuration API et intégrations
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('api')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'api'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          API
        </button>
        <button
          onClick={() => setActiveTab('connecteurs')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'connecteurs'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Connecteurs
        </button>
        <button
          onClick={() => setActiveTab('connaissances')}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === 'connaissances'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Connaissances
        </button>
      </div>

      {/* API Tab Content */}
      {activeTab === 'api' && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Success Message */}
          {saved && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <p className="text-green-800 font-medium">
                Paramètres sauvegardés avec succès
              </p>
            </div>
          )}

          {/* API Configuration */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🔑</span>
              Clés API
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clé API principale
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value="sk_live_••••••••••••••••"
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Régénérer
                  </button>
                  <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Copier
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Clé API de test
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value="sk_test_••••••••••••••••"
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Régénérer
                  </button>
                  <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Copier
                  </button>
                </div>
              </div>

              <button type="button" className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">
                Ajouter une nouvelle clé API
              </button>
            </div>
          </div>

          {/* Rate Limiting */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>⚡</span>
              Rate Limiting
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Contrôlez le nombre de requêtes API autorisées par période.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requêtes par minute
                </label>
                <input
                  type="number"
                  defaultValue="1000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Limite de rafale
                </label>
                <input
                  type="number"
                  defaultValue="500"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* CORS */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🔒</span>
              CORS (Cross-Origin Resource Sharing)
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Gérez les domaines autorisés à accéder à votre API.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Enregistrer les modifications
            </button>
            <button
              type="button"
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      )}

      {/* Connecteurs Tab Content */}
      {activeTab === 'connecteurs' && (
        <div>
          {/* Connecteurs Tabs */}
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button
              onClick={() => setConnectorTab('applications')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                connectorTab === 'applications'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setConnectorTab('api')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                connectorTab === 'api'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              API personnalisée
            </button>
            <button
              onClick={() => setConnectorTab('mcp')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                connectorTab === 'mcp'
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
            onClick={() => setShowConnectorModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <span>+</span>
            <span>Ajouter des connecteurs</span>
          </button>

          {/* Add Connector Modal */}
          {showConnectorModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Ajouter un connecteur</h2>
                  <button
                    onClick={() => setShowConnectorModal(false)}
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
                      onClick={() => setShowConnectorModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => setShowConnectorModal(false)}
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
      )}

      {/* Connaissances Tab Content */}
      {activeTab === 'connaissances' && (
        <div>
          {/* Header */}
          <div className="mb-6">
            <p className="text-gray-600">
              La connaissance permet à Manus d\'apprendre et de se souvenir de vos préférences et des meilleures pratiques spécifiques à une tâche. Jusqu\'à 100 entrées prises en charge.
            </p>
          </div>

          {/* Add Button */}
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowKnowledgeModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span>+</span>
              <span>Ajouter</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Nom</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Contenu</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Créé le</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-900">Statut</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {knowledges.map(knowledge => (
                  <tr key={knowledge.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{knowledge.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{knowledge.content}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{knowledge.createdAt}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleStatus(knowledge.id)}
                        className={`inline-flex items-center justify-center w-12 h-6 rounded-full transition-colors ${
                          knowledge.status ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${knowledge.status ? 'translate-x-3' : ''}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDelete(knowledge.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Supprimer"
                        >
                          🗑️
                        </button>
                        <button
                          onClick={() => handleEdit(knowledge)}
                          className="text-gray-600 hover:text-gray-700 transition-colors"
                          title="Éditer"
                        >
                          ✏️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Counter */}
          <div className="mt-4 text-sm text-gray-600">
            {knowledges.length} sur 100 résultats
          </div>

          {/* Add Knowledge Modal */}
          {showKnowledgeModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Ajouter une connaissance</h2>
                  <button
                    onClick={() => setShowKnowledgeModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nom de la connaissance"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <textarea
                    placeholder="Contenu (0/2000)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowKnowledgeModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => setShowKnowledgeModal(false)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Edit Knowledge Modal */}
          {showEditModal && selectedKnowledge && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Modifier la connaissance</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <input
                    type="text"
                    defaultValue={selectedKnowledge.name}
                    placeholder="Nom de la connaissance"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <textarea
                    defaultValue={selectedKnowledge.content}
                    placeholder="Contenu"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg h-24"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

