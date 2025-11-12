import { useState } from 'react'

interface Knowledge {
  id: number
  name: string
  content: string
  createdAt: string
  status: boolean
  actions?: string
}

export default function Connaissances() {
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

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedKnowledge, setSelectedKnowledge] = useState<Knowledge | null>(null)

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Connaissances</h1>
        <p className="text-gray-600">
          La connaissance permet à Manus d\'apprendre et de se souvenir de vos préférences et des meilleures pratiques spécifiques à une tâche. Jusqu\'à 100 entrées prises en charge.
        </p>
      </div>

      {/* Add Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
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
              <th className="text-center px-4 py-3 font-semibold text-gray-900">Statut ⬇</th>
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
                      knowledge.status ? 'bg-white0' : 'bg-gray-300'
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

      {/* Count */}
      <div className="mt-4 text-sm text-gray-600">
        {knowledges.length} sur 100 résultats
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ajouter une connaissance</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Nom</label>
                <input
                  type="text"
                  placeholder="Nom de la connaissance"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Utiliser quand</label>
                <input
                  type="text"
                  placeholder="Contexte d\'utilisation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Contenu</label>
                <textarea
                  placeholder="Contenu de la connaissance"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-right text-xs text-gray-500 mt-1">0 / 2000</div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedKnowledge && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ←
              </button>
              <h2 className="text-xl font-bold">Modifier la connaissance</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="ml-auto text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Activer les connaissances actuelles</label>
                <button className="w-12 h-6 bg-white0 rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 bg-white rounded-full translate-x-3" />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Nom</label>
                <input
                  type="text"
                  defaultValue={selectedKnowledge.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Utiliser quand</label>
                <input
                  type="text"
                  placeholder="Contexte d\'utilisation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Contenu</label>
                <textarea
                  defaultValue={selectedKnowledge.content}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-blue-500"
                />
                <div className="text-right text-xs text-gray-500 mt-1">216 / 2000</div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-white"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler les modifications
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

