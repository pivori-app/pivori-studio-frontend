import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import { Upload, FileUp, Package } from 'lucide-react'

interface FormData {
  name: string
  description: string
  category: string
  icon: string
  template: string
}

export default function NewApplication() {
  const navigate = useNavigate()
  const { addApplication } = useAppContext()
  const [activeTab, setActiveTab] = useState<'create' | 'import'>('create')
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    icon: '📱',
    template: 'blank'
  })

  const [submitted, setSubmitted] = useState(false)
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importProgress, setImportProgress] = useState(0)
  const [importError, setImportError] = useState('')

  const categories = [
    { value: 'ecommerce', label: 'E-commerce', icon: '🛍️' },
    { value: 'saas', label: 'SaaS', icon: '☁️' },
    { value: 'social', label: 'Réseau Social', icon: '👥' },
    { value: 'productivity', label: 'Productivité', icon: '📊' },
    { value: 'education', label: 'Éducation', icon: '📚' },
    { value: 'health', label: 'Santé', icon: '🏥' },
    { value: 'entertainment', label: 'Divertissement', icon: '🎮' },
    { value: 'other', label: 'Autre', icon: '⚙️' }
  ]

  const templates = [
    { value: 'blank', label: 'Vierge', description: 'Commencer de zéro' },
    { value: 'blog', label: 'Blog', description: 'Plateforme de blogging' },
    { value: 'marketplace', label: 'Marketplace', description: 'Marché en ligne' },
    { value: 'community', label: 'Communauté', description: 'Réseau social' }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCategorySelect = (value: string) => {
    const category = categories.find(c => c.value === value)
    setFormData(prev => ({
      ...prev,
      category: value,
      icon: category?.icon || '📱'
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || !formData.category) {
      setSubmitted(true)
      return
    }

    addApplication({
      name: formData.name,
      description: formData.description,
      category: formData.category,
      icon: formData.icon,
      template: formData.template,
      currency: 'EUR'
    })

    navigate('/applications')
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImportFile(file)
      setImportError('')
    }
  }

  const handleImport = async () => {
    if (!importFile) {
      setImportError('Veuillez sélectionner un fichier')
      return
    }

    // Vérifier le type de fichier
    const validTypes = ['application/zip', 'application/x-zip-compressed', 'application/x-tar', 'application/gzip']
    if (!validTypes.includes(importFile.type) && !importFile.name.match(/\.(zip|tar|tar\.gz|tgz)$/i)) {
      setImportError('Format non supporté. Utilisez ZIP ou TAR.')
      return
    }

    try {
      setImportProgress(30)

      // Simuler l'extraction du projet
      const projectName = importFile.name.replace(/\.(zip|tar|tar\.gz|tgz)$/i, '')
      
      setImportProgress(60)

      // Détecter le type de projet
      let category = 'other'
      let template = 'blank'
      
      if (projectName.toLowerCase().includes('blog')) {
        category = 'entertainment'
        template = 'blog'
      } else if (projectName.toLowerCase().includes('shop') || projectName.toLowerCase().includes('store')) {
        category = 'ecommerce'
        template = 'marketplace'
      } else if (projectName.toLowerCase().includes('community') || projectName.toLowerCase().includes('social')) {
        category = 'social'
        template = 'community'
      }

      setImportProgress(90)

      // Créer l'application
      addApplication({
        name: projectName,
        description: `Projet importé depuis ${importFile.name}`,
        category: category,
        icon: '📦',
        template: template,
        currency: 'EUR'
      })

      setImportProgress(100)

      // Rediriger après 1 seconde
      setTimeout(() => {
        navigate('/applications')
      }, 1000)
    } catch (error) {
      setImportError('Erreur lors de l\'import du projet')
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Retour */}
        <button
          onClick={() => navigate('/applications')}
          className="mb-8 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-2"
        >
          ← Retour aux applications
        </button>

        {/* Titre */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Créer une nouvelle application
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Suivez ces étapes simples pour créer votre première application
          </p>
        </div>

        {/* Onglets */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'create'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Package className="inline mr-2" size={20} />
            Créer une App
          </button>
          <button
            onClick={() => setActiveTab('import')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'import'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <FileUp className="inline mr-2" size={20} />
            Importer un Projet
          </button>
        </div>

        {/* Contenu - Créer */}
        {activeTab === 'create' && (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Étape 1: Informations de base */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Informations de base
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nom de l'application *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Ma Super App"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {submitted && !formData.name && (
                    <p className="text-red-500 text-sm mt-1">Le nom est requis</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Décrivez votre application..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {submitted && !formData.description && (
                    <p className="text-red-500 text-sm mt-1">La description est requise</p>
                  )}
                </div>
              </div>
            </div>

            {/* Étape 2: Catégorie */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Choisir une catégorie
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleCategorySelect(cat.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      formData.category === cat.value
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{cat.label}</div>
                  </button>
                ))}
              </div>
              {submitted && !formData.category && (
                <p className="text-red-500 text-sm mt-4">La catégorie est requise</p>
              )}
            </div>

            {/* Étape 3: Template */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Choisir un template
                </h2>
              </div>

              <div className="space-y-3">
                {templates.map(tmpl => (
                  <label
                    key={tmpl.value}
                    className="flex items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-all"
                  >
                    <input
                      type="radio"
                      name="template"
                      value={tmpl.value}
                      checked={formData.template === tmpl.value}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="ml-4">
                      <div className="font-semibold text-gray-900 dark:text-white">{tmpl.label}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{tmpl.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Bouton Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Créer l'application
            </button>
          </form>
        )}

        {/* Contenu - Importer */}
        {activeTab === 'import' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
            <div className="text-center mb-8">
              <Upload className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Importer un projet
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Téléchargez un fichier ZIP ou TAR contenant votre projet
              </p>
            </div>

            <div className="mb-6">
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".zip,.tar,.tar.gz,.tgz"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <div className="font-semibold text-gray-900 dark:text-white mb-1">
                    {importFile ? importFile.name : 'Cliquez pour sélectionner un fichier'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    ou glissez-déposez un fichier ZIP ou TAR
                  </div>
                </div>
              </label>
            </div>

            {importError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
                {importError}
              </div>
            )}

            {importProgress > 0 && importProgress < 100 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Import en cours...
                  </span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {importProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${importProgress}%` }}
                  />
                </div>
              </div>
            )}

            {importProgress === 100 && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg mb-6">
                ✓ Projet importé avec succès! Redirection...
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/applications')}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleImport}
                disabled={!importFile || importProgress > 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Importer le projet
              </button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Formats supportés:</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>✓ ZIP (.zip)</li>
                <li>✓ TAR (.tar)</li>
                <li>✓ TAR.GZ (.tar.gz, .tgz)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

