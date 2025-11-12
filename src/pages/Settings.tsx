import { useState } from 'react'
import { ChevronDown, Plus, Trash2, Edit2, Eye, EyeOff, Copy, Check } from 'lucide-react'

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

interface Role {
  id: number
  name: string
  description: string
  permissions: Permission[]
}

interface Permission {
  id: string
  name: string
  description: string
  enabled: boolean
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  content: string
  variables: string[]
  type: 'transactional' | 'marketing' | 'notification'
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'api' | 'connecteurs' | 'connaissances' | 'utilisateurs' | 'email'>('api')
  
  // ============ API Settings ============
  const [settings, setSettings] = useState({
    apiUrl: 'http://localhost:8000',
    theme: 'light',
    notifications: true,
    autoBackup: true,
    language: 'fr'
  })
  const [saved, setSaved] = useState(false)

  // ============ Connecteurs State ============
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

  // ============ Connaissances State ============
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
  ])
  const [showKnowledgeModal, setShowKnowledgeModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedKnowledge, setSelectedKnowledge] = useState<Knowledge | null>(null)

  // ============ Utilisateurs / Rôles State ============
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      name: 'Administrateur',
      description: 'Accès complet à toutes les fonctionnalités',
      permissions: [
        { id: 'create', name: 'Créer', description: 'Créer de nouvelles ressources', enabled: true },
        { id: 'read', name: 'Lire', description: 'Consulter les ressources', enabled: true },
        { id: 'update', name: 'Modifier', description: 'Modifier les ressources existantes', enabled: true },
        { id: 'delete', name: 'Supprimer', description: 'Supprimer les ressources', enabled: true },
        { id: 'admin', name: 'Administration', description: 'Gérer les utilisateurs et les rôles', enabled: true },
      ]
    },
    {
      id: 2,
      name: 'Éditeur',
      description: 'Peut créer et modifier le contenu',
      permissions: [
        { id: 'create', name: 'Créer', description: 'Créer de nouvelles ressources', enabled: true },
        { id: 'read', name: 'Lire', description: 'Consulter les ressources', enabled: true },
        { id: 'update', name: 'Modifier', description: 'Modifier les ressources existantes', enabled: true },
        { id: 'delete', name: 'Supprimer', description: 'Supprimer les ressources', enabled: false },
        { id: 'admin', name: 'Administration', description: 'Gérer les utilisateurs et les rôles', enabled: false },
      ]
    },
  ])
  const [showPermissionsModal, setShowPermissionsModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showNewRoleTab, setShowNewRoleTab] = useState(false)
  const [newRole, setNewRole] = useState({ name: '', description: '' })

  // ============ Email State ============
  const [emailConfig, setEmailConfig] = useState({
    smtpHost: 'smtp.sendgrid.net',
    smtpPort: 587,
    smtpUsername: 'apikey',
    smtpPassword: '••••••••••••••••',
    fromEmail: 'noreply@locasimple.com',
    fromName: 'PIVORI Studio'
  })
  const [showEmailPassword, setShowEmailPassword] = useState(false)
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([
    {
      id: 'welcome',
      name: 'Bienvenue',
      subject: 'Bienvenue sur PIVORI Studio',
      content: 'Bonjour {{name}},\n\nBienvenue sur PIVORI Studio. Nous sommes heureux de vous avoir parmi nous.',
      variables: ['name', 'email', 'company'],
      type: 'transactional'
    },
    {
      id: 'password-reset',
      name: 'Réinitialisation de mot de passe',
      subject: 'Réinitialiser votre mot de passe',
      content: 'Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe:\n{{reset_link}}',
      variables: ['name', 'reset_link', 'expiry_time'],
      type: 'transactional'
    },
    {
      id: 'payment-confirmation',
      name: 'Confirmation de paiement',
      subject: 'Paiement confirmé - {{order_id}}',
      content: 'Merci pour votre paiement de {{amount}} €. Numéro de commande: {{order_id}}',
      variables: ['name', 'amount', 'order_id', 'date'],
      type: 'transactional'
    },
    {
      id: 'invoice',
      name: 'Facture',
      subject: 'Votre facture - {{invoice_number}}',
      content: 'Veuillez trouver ci-joint votre facture pour la période {{period}}.',
      variables: ['name', 'invoice_number', 'period', 'amount'],
      type: 'transactional'
    },
    {
      id: 'notification',
      name: 'Notification générale',
      subject: '{{notification_title}}',
      content: '{{notification_content}}',
      variables: ['name', 'notification_title', 'notification_content'],
      type: 'notification'
    },
    {
      id: 'newsletter',
      name: 'Infolettre',
      subject: '{{newsletter_title}}',
      content: '{{newsletter_content}}',
      variables: ['name', 'newsletter_title', 'newsletter_content', 'unsubscribe_link'],
      type: 'marketing'
    },
  ])
  const [showTemplateEditor, setShowTemplateEditor] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [templatePreview, setTemplatePreview] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // ============ API Handlers ============
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

  // ============ Connecteurs Handlers ============
  const handleConnect = (id: number) => {
    setConnectors(connectors.map(c => c.id === id ? { ...c, connected: !c.connected } : c))
  }

  const filteredConnectors = connectors.filter(c => {
    if (connectorTab === 'applications') return ['cloud', 'ai', 'communication'].includes(c.category)
    if (connectorTab === 'api') return ['database', 'workflow'].includes(c.category)
    return false
  })

  // ============ Connaissances Handlers ============
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

  // ============ Utilisateurs / Rôles Handlers ============
  const handleManagePermissions = (role: Role) => {
    setSelectedRole(role)
    setShowPermissionsModal(true)
  }

  const handlePermissionToggle = (permissionId: string) => {
    if (!selectedRole) return
    const updatedRole = {
      ...selectedRole,
      permissions: selectedRole.permissions.map(p =>
        p.id === permissionId ? { ...p, enabled: !p.enabled } : p
      )
    }
    setSelectedRole(updatedRole)
    setRoles(roles.map(r => r.id === selectedRole.id ? updatedRole : r))
  }

  const handleSaveNewRole = () => {
    if (!newRole.name.trim()) return
    const newRoleObj: Role = {
      id: Math.max(...roles.map(r => r.id), 0) + 1,
      name: newRole.name,
      description: newRole.description,
      permissions: roles[0].permissions.map(p => ({ ...p, enabled: false }))
    }
    setRoles([...roles, newRoleObj])
    setNewRole({ name: '', description: '' })
    setShowNewRoleTab(false)
  }

  // ============ Email Handlers ============
  const handleEmailConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEmailConfig(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTemplateEdit = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setShowTemplateEditor(true)
  }

  const handleTemplateChange = (field: keyof EmailTemplate, value: any) => {
    if (!selectedTemplate) return
    setSelectedTemplate({
      ...selectedTemplate,
      [field]: value
    })
  }

  const handleSaveTemplate = () => {
    if (!selectedTemplate) return
    setEmailTemplates(emailTemplates.map(t =>
      t.id === selectedTemplate.id ? selectedTemplate : t
    ))
    setShowTemplateEditor(false)
    setSelectedTemplate(null)
  }

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Paramètres
        </h2>
        <p className="text-gray-600">
          Configuration API, intégrations et gestion des utilisateurs
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
        {[
          { id: 'api', label: 'API' },
          { id: 'connecteurs', label: 'Connecteurs' },
          { id: 'connaissances', label: 'Connaissances' },
          { id: 'utilisateurs', label: 'Utilisateurs' },
          { id: 'email', label: 'Email' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ============ API TAB ============ */}
      {activeTab === 'api' && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {saved && (
            <div className="mb-6 p-4 bg-white border border-green-200 rounded-lg flex items-center gap-3">
              <span className="text-green-600 text-xl">✓</span>
              <p className="text-green-800 font-medium">Paramètres sauvegardés avec succès</p>
            </div>
          )}

          {/* API Keys */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🔑</span> Clés API
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clé API principale</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Clé API de test</label>
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
              <span>⚡</span> Rate Limiting
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">Contrôlez le nombre de requêtes API autorisées par période.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requêtes par minute</label>
                <input
                  type="number"
                  defaultValue="1000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Limite de rafale</label>
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
              <span>🔒</span> CORS
            </h3>
            
            <p className="text-sm text-gray-600 mb-4">Gérez les domaines autorisés à accéder à votre API.</p>

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

      {/* ============ CONNECTEURS TAB ============ */}
      {activeTab === 'connecteurs' && (
        <div>
          <div className="flex gap-4 mb-6 border-b border-gray-200">
            {['applications', 'api', 'mcp'].map(tab => (
              <button
                key={tab}
                onClick={() => setConnectorTab(tab as any)}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  connectorTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'applications' ? 'Applications' : tab === 'api' ? 'API personnalisée' : 'MCP personnalisé'}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Rechercher un connecteur..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

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
                  {connector.connected && <div className="text-green-600 text-sm font-medium">✓</div>}
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

          <button
            onClick={() => setShowConnectorModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus size={20} />
            <span>Ajouter des connecteurs</span>
          </button>

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

      {/* ============ CONNAISSANCES TAB ============ */}
      {activeTab === 'connaissances' && (
        <div>
          <div className="mb-6">
            <p className="text-gray-600">
              La connaissance permet à Manus d'apprendre et de se souvenir de vos préférences et des meilleures pratiques spécifiques à une tâche. Jusqu'à 100 entrées prises en charge.
            </p>
          </div>

          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowKnowledgeModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Plus size={20} />
              <span>Ajouter</span>
            </button>
          </div>

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
                          <Trash2 size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(knowledge)}
                          className="text-gray-600 hover:text-gray-700 transition-colors"
                          title="Éditer"
                        >
                          <Edit2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            {knowledges.length} sur 100 résultats
          </div>

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

      {/* ============ UTILISATEURS TAB ============ */}
      {activeTab === 'utilisateurs' && (
        <div>
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Gestion des Rôles et Permissions</h3>
            <p className="text-gray-600 mb-6">
              Gérez les rôles utilisateur et leurs permissions d'accès aux différentes fonctionnalités.
            </p>

            {/* Rôles existants */}
            <div className="space-y-4 mb-6">
              {roles.map(role => (
                <div key={role.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{role.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleManagePermissions(role)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Gérer les permissions
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.filter(p => p.enabled).map(p => (
                      <span key={p.id} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Nouveau rôle */}
            {!showNewRoleTab ? (
              <button
                onClick={() => setShowNewRoleTab(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Plus size={20} />
                <span>Ajouter un nouveau rôle</span>
              </button>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Ajouter un nouveau rôle</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom du rôle</label>
                    <input
                      type="text"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                      placeholder="Ex: Modérateur"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      placeholder="Décrivez les responsabilités de ce rôle"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Permissions</label>
                    <div className="space-y-2">
                      {roles[0].permissions.map(p => (
                        <label key={p.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded" />
                          <div>
                            <div className="font-medium text-gray-900">{p.name}</div>
                            <div className="text-xs text-gray-600">{p.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowNewRoleTab(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveNewRole}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Créer le rôle
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Permissions */}
          {showPermissionsModal && selectedRole && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Permissions - {selectedRole.name}</h2>
                  <button
                    onClick={() => setShowPermissionsModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 mb-6">
                  {selectedRole.permissions.map(permission => (
                    <label key={permission.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permission.enabled}
                        onChange={() => handlePermissionToggle(permission.id)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{permission.name}</div>
                        <div className="text-sm text-gray-600">{permission.description}</div>
                      </div>
                      {permission.enabled && (
                        <span className="text-green-600 font-medium">Activé</span>
                      )}
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowPermissionsModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => setShowPermissionsModal(false)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============ EMAIL TAB ============ */}
      {activeTab === 'email' && (
        <div className="space-y-8">
          {/* Configuration SMTP */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📧</span> Configuration SMTP
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hôte SMTP</label>
                <input
                  type="text"
                  name="smtpHost"
                  value={emailConfig.smtpHost}
                  onChange={handleEmailConfigChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Port SMTP</label>
                  <input
                    type="number"
                    name="smtpPort"
                    value={emailConfig.smtpPort}
                    onChange={handleEmailConfigChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
                  <input
                    type="text"
                    name="smtpUsername"
                    value={emailConfig.smtpUsername}
                    onChange={handleEmailConfigChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe SMTP</label>
                <div className="flex gap-2">
                  <input
                    type={showEmailPassword ? 'text' : 'password'}
                    name="smtpPassword"
                    value={emailConfig.smtpPassword}
                    onChange={handleEmailConfigChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmailPassword(!showEmailPassword)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {showEmailPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Adresse email d'envoi</label>
                  <input
                    type="email"
                    name="fromEmail"
                    value={emailConfig.fromEmail}
                    onChange={handleEmailConfigChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom d'expéditeur</label>
                  <input
                    type="text"
                    name="fromName"
                    value={emailConfig.fromName}
                    onChange={handleEmailConfigChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium mt-4">
                Tester la connexion
              </button>
            </div>
          </div>

          {/* Templates d'emails */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📨</span> Templates d'Emails
            </h3>
            
            <p className="text-sm text-gray-600 mb-6">
              Personnalisez les modèles d'emails pour différentes notifications et communications.
            </p>

            <div className="space-y-3">
              {emailTemplates.map(template => (
                <div key={template.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">Sujet: {template.subject}</p>
                  </div>
                  <button
                    onClick={() => handleTemplateEdit(template)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Éditer
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Suivi */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📊</span> Suivi des ouvertures et clics
            </h3>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                <div>
                  <div className="font-medium text-gray-900">Suivi des ouvertures</div>
                  <div className="text-xs text-gray-600">Enregistrer quand un email est ouvert</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                <div>
                  <div className="font-medium text-gray-900">Suivi des clics</div>
                  <div className="text-xs text-gray-600">Enregistrer les clics sur les liens</div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ============ MODAL ÉDITEUR DE TEMPLATE ============ */}
      {showTemplateEditor && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Éditer le template: {selectedTemplate.name}</h2>
              <button
                onClick={() => {
                  setShowTemplateEditor(false)
                  setSelectedTemplate(null)
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sujet de l'email</label>
                <input
                  type="text"
                  value={selectedTemplate.subject}
                  onChange={(e) => handleTemplateChange('subject', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Éditeur */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
                  <textarea
                    value={selectedTemplate.content}
                    onChange={(e) => handleTemplateChange('content', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-64 font-mono text-sm"
                  />
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Variables disponibles</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.variables.map(variable => (
                        <button
                          key={variable}
                          onClick={() => {
                            const textarea = document.querySelector('textarea') as HTMLTextAreaElement
                            if (textarea) {
                              textarea.value += `{{${variable}}}`
                            }
                          }}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors font-mono"
                        >
                          {`{{${variable}}}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Aperçu */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Aperçu</label>
                    <button
                      onClick={() => setTemplatePreview(!templatePreview)}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      {templatePreview ? 'Masquer' : 'Afficher'}
                    </button>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 h-64 overflow-y-auto">
                    <div className="bg-white rounded p-4">
                      <div className="text-xs text-gray-600 mb-2">Sujet:</div>
                      <div className="font-semibold text-gray-900 mb-4">{selectedTemplate.subject}</div>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedTemplate.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowTemplateEditor(false)
                    setSelectedTemplate(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveTemplate}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
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

