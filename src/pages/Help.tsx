import React, { useState } from 'react'
import {
  BookOpen, Play, MessageCircle, Mail, Phone, FileText,
  ChevronDown, Search, Lightbulb, Zap, Shield, BarChart3
} from 'lucide-react'

interface Tutorial {
  id: string
  title: string
  description: string
  duration: string
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé'
  icon: React.ReactNode
  content: string
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

const Help: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tutorials' | 'faq' | 'support'>('tutorials')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const tutorials: Tutorial[] = [
    {
      id: '1',
      title: 'Créer votre première application',
      description: 'Apprenez à créer une application en quelques minutes',
      duration: '5 min',
      difficulty: 'Débutant',
      icon: <Zap className="w-6 h-6" />,
      content: 'Cliquez sur "Nouvelle App" et suivez le formulaire de création...'
    },
    {
      id: '2',
      title: 'Intégrer des connecteurs',
      description: 'Connectez vos outils préférés à votre application',
      duration: '10 min',
      difficulty: 'Intermédiaire',
      icon: <Lightbulb className="w-6 h-6" />,
      content: 'Allez à la section Connecteurs et sélectionnez les services...'
    },
    {
      id: '3',
      title: 'Configurer les paiements',
      description: 'Mettez en place un système de paiement sécurisé',
      duration: '15 min',
      difficulty: 'Intermédiaire',
      icon: <Shield className="w-6 h-6" />,
      content: 'Accédez à Paiements et configurez vos méthodes de paiement...'
    },
    {
      id: '4',
      title: 'Analyser les performances',
      description: 'Utilisez le dashboard Analytics pour surveiller vos apps',
      duration: '8 min',
      difficulty: 'Débutant',
      icon: <BarChart3 className="w-6 h-6" />,
      content: 'Consultez la section Analytics pour voir vos statistiques...'
    },
    {
      id: '5',
      title: 'Gérer les utilisateurs',
      description: 'Administrez les accès et les permissions des utilisateurs',
      duration: '12 min',
      difficulty: 'Avancé',
      icon: <BookOpen className="w-6 h-6" />,
      content: 'Allez aux Paramètres pour gérer les utilisateurs...'
    },
    {
      id: '6',
      title: 'Optimiser les performances',
      description: 'Conseils pour améliorer la vitesse de votre application',
      duration: '20 min',
      difficulty: 'Avancé',
      icon: <Zap className="w-6 h-6" />,
      content: 'Consultez les recommandations dans Analytics...'
    }
  ]

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'Comment créer une nouvelle application?',
      answer: 'Cliquez sur le bouton "Nouvelle App" dans le dashboard. Remplissez le formulaire avec le nom de votre application et les paramètres de base. Votre application sera créée en quelques secondes.',
      category: 'Applications'
    },
    {
      id: '2',
      question: 'Quels connecteurs sont disponibles?',
      answer: 'PIVORI Studio supporte 8 connecteurs principaux: Google Drive, GitHub, Anthropic (Claude), Google Gemini, Supabase, Vercel, et Gmail. D\'autres connecteurs peuvent être ajoutés sur demande.',
      category: 'Connecteurs'
    },
    {
      id: '3',
      question: 'Comment gérer les paiements?',
      answer: 'Accédez à la section Paiements pour configurer vos méthodes de paiement, voir vos transactions, et gérer vos factures. Vous pouvez ajouter plusieurs méthodes de paiement.',
      category: 'Paiements'
    },
    {
      id: '4',
      question: 'Comment consulter mes statistiques?',
      answer: 'Allez à la section Analytics pour voir vos performances. Vous pouvez visualiser le revenu, les utilisateurs actifs, le taux de conversion, et bien d\'autres métriques.',
      category: 'Analytics'
    },
    {
      id: '5',
      question: 'Puis-je changer la devise de mon application?',
      answer: 'Oui! Dans les paramètres de votre application, vous pouvez sélectionner la devise parmi EUR (€), USD ($), GBP (£), JPY (¥), et bien d\'autres.',
      category: 'Configuration'
    },
    {
      id: '6',
      question: 'Comment supprimer une application?',
      answer: 'Allez à Applications, trouvez l\'application à supprimer, et cliquez sur le menu d\'options. Sélectionnez "Supprimer" et confirmez votre choix.',
      category: 'Applications'
    },
    {
      id: '7',
      question: 'Y a-t-il une limite au nombre d\'applications?',
      answer: 'Non, vous pouvez créer autant d\'applications que vous le souhaitez. Chaque application a ses propres paramètres et configurations.',
      category: 'Applications'
    },
    {
      id: '8',
      question: 'Comment obtenir de l\'aide?',
      answer: 'Vous pouvez nous contacter par email à support@pivori.com, par téléphone au +33 1 23 45 67 89, ou utiliser le chat en ligne disponible 24/7.',
      category: 'Support'
    }
  ]

  const filteredTutorials = tutorials.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredFAQs = faqs.filter(f =>
    f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      case 'Intermédiaire':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      case 'Avancé':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Aide & Tutoriels
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Apprenez à utiliser PIVORI Studio avec nos guides complets
              </p>
            </div>
            <div className="flex gap-2">
              <a href="mailto:support@pivori.com" className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors whitespace-nowrap">
                <Mail size={20} />
                <span className="hidden sm:inline">Nous contacter</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Rechercher un tutoriel ou une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('tutorials')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'tutorials'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Play size={20} />
              <span>Tutoriels</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'faq'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageCircle size={20} />
              <span>FAQ</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'support'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Phone size={20} />
              <span>Support</span>
            </div>
          </button>
        </div>

        {/* Tutoriels */}
        {activeTab === 'tutorials' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map((tutorial) => (
              <div key={tutorial.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    {tutorial.icon}
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(tutorial.difficulty)}`}>
                    {tutorial.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{tutorial.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{tutorial.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-500">⏱️ {tutorial.duration}</span>
                  <button className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors">
                    Regarder
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1 text-left">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{faq.question}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{faq.category}</span>
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-gray-600 dark:text-gray-400 flex-shrink-0 transition-transform ${
                      expandedFAQ === faq.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFAQ === faq.id && (
                  <div className="px-6 pb-6 pt-0 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Support */}
        {activeTab === 'support' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400 w-fit mb-4">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Email</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Nous répondons en moins de 24 heures</p>
              <a href="mailto:support@pivori.com" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                support@pivori.com
              </a>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400 w-fit mb-4">
                <Phone size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Téléphone</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Disponible du lundi au vendredi</p>
              <a href="tel:+33123456789" className="text-green-600 dark:text-green-400 font-semibold hover:underline">
                +33 1 23 45 67 89
              </a>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400 w-fit mb-4">
                <MessageCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Chat en Ligne</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Support 24/7 disponible</p>
              <button className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">
                Démarrer une conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Help

