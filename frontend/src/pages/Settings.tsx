import { useState } from 'react'

export default function Settings() {
  const [settings, setSettings] = useState({
    apiUrl: 'http://localhost:8000',
    theme: 'light',
    notifications: true,
    autoBackup: true,
    language: 'fr'
  })

  const [saved, setSaved] = useState(false)

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

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Paramètres
        </h2>
        <p className="text-gray-600">
          Configurez les préférences de votre plateforme
        </p>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
          <span className="text-green-600 text-xl">✓</span>
          <p className="text-green-800 font-medium">
            Paramètres sauvegardés avec succès
          </p>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* API Configuration */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>⚙️</span>
            Configuration API
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-700 mb-2">
                URL de l'API
              </label>
              <input
                type="url"
                id="apiUrl"
                name="apiUrl"
                value={settings.apiUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="http://localhost:8000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Adresse du serveur API pour les requêtes
              </p>
            </div>
          </div>
        </div>

        {/* Display Preferences */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🎨</span>
            Préférences d'affichage
          </h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-2">
                Thème
              </label>
              <select
                id="theme"
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="light">Clair</option>
                <option value="dark">Sombre</option>
                <option value="auto">Automatique</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Choisissez votre thème préféré
              </p>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                Langue
              </label>
              <select
                id="language"
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Langue de l'interface
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🔔</span>
            Notifications
          </h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="notifications"
                checked={settings.notifications}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-gray-700 font-medium">
                Activer les notifications
              </span>
            </label>
            <p className="text-xs text-gray-500 ml-8">
              Recevez les alertes importantes sur l'état de vos services
            </p>
          </div>
        </div>

        {/* Backup Settings */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>💾</span>
            Sauvegarde
          </h3>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="autoBackup"
                checked={settings.autoBackup}
                onChange={handleChange}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-gray-700 font-medium">
                Sauvegarde automatique
              </span>
            </label>
            <p className="text-xs text-gray-500 ml-8">
              Sauvegarder automatiquement vos données chaque jour
            </p>
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

      {/* Additional Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-900 text-sm">
          <strong>💡 Conseil:</strong> Vos paramètres sont sauvegardés localement. 
          Les modifications prennent effet immédiatement.
        </p>
      </div>
    </div>
  )
}

