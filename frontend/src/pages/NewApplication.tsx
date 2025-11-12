import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface FormData {
  name: string
  description: string
  category: string
  icon: string
  template: string
}

export default function NewApplication() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    category: '',
    icon: '📱',
    template: 'blank'
  })

  const [submitted, setSubmitted] = useState(false)

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

  const handleCategorySelect = (category: string, icon: string) => {
    setFormData(prev => ({
      ...prev,
      category,
      icon
    }))
  }

  const handleTemplateSelect = (template: string) => {
    setFormData(prev => ({
      ...prev,
      template
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    
    setTimeout(() => {
      alert(`Application "${formData.name}" créée avec succès!`)
      navigate('/applications')
    }, 1500)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/applications')}
          className="text-blue-600 hover:text-blue-700 font-medium mb-4 flex items-center gap-2"
        >
          ← Retour aux applications
        </button>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Créer une nouvelle application
        </h2>
        <p className="text-gray-600">
          Suivez ces étapes simples pour créer votre première application
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Basic Info */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
            Informations de base
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'application *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ex: Ma Super App"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Décrivez votre application..."
              />
            </div>
          </div>
        </div>

        {/* Step 2: Category */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
            Choisir une catégorie
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => handleCategorySelect(cat.value, cat.icon)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-center ${
                  formData.category === cat.value
                    ? 'border-blue-600 bg-white'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <p className="text-sm font-medium text-gray-900">{cat.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Template */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
            Choisir un modèle
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tmpl) => (
              <button
                key={tmpl.value}
                type="button"
                onClick={() => handleTemplateSelect(tmpl.value)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  formData.template === tmpl.value
                    ? 'border-blue-600 bg-white'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <p className="font-medium text-gray-900">{tmpl.label}</p>
                <p className="text-sm text-gray-600 mt-1">{tmpl.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        {formData.name && formData.category && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-3">Résumé</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium text-gray-700">Nom:</span>
                <span className="text-gray-900 ml-2">{formData.name}</span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Catégorie:</span>
                <span className="text-gray-900 ml-2">
                  {categories.find(c => c.value === formData.category)?.label}
                </span>
              </p>
              <p>
                <span className="font-medium text-gray-700">Modèle:</span>
                <span className="text-gray-900 ml-2">
                  {templates.find(t => t.value === formData.template)?.label}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={!formData.name || !formData.category || submitted}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {submitted ? 'Création en cours...' : 'Créer l\'application'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/applications')}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}

