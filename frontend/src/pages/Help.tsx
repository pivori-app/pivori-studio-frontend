import { BookOpen, Video, MessageCircle, Mail, Phone } from 'lucide-react'

export default function Help() {
  const guides = [
    {
      id: 1,
      title: 'Débuter avec PIVORI Studio',
      description: 'Guide complet pour créer votre première application',
      icon: BookOpen,
      category: 'Guide',
      readTime: '10 min'
    },
    {
      id: 2,
      title: 'Configuration des connecteurs',
      description: 'Apprenez à configurer les 8 connecteurs disponibles',
      icon: BookOpen,
      category: 'Guide',
      readTime: '15 min'
    },
    {
      id: 3,
      title: 'Gestion des utilisateurs et permissions',
      description: 'Tutoriel sur la gestion des rôles et permissions',
      icon: BookOpen,
      category: 'Guide',
      readTime: '12 min'
    },
    {
      id: 4,
      title: 'Configuration SMTP et templates email',
      description: 'Guide complet pour configurer vos emails',
      icon: BookOpen,
      category: 'Guide',
      readTime: '8 min'
    }
  ]

  const videos = [
    {
      id: 1,
      title: 'Créer votre première app en 5 minutes',
      duration: '5:30',
      thumbnail: '🎬'
    },
    {
      id: 2,
      title: 'Utiliser les connecteurs',
      duration: '12:45',
      thumbnail: '🎬'
    },
    {
      id: 3,
      title: 'Analytics et monitoring',
      duration: '8:20',
      thumbnail: '🎬'
    }
  ]

  const faqs = [
    {
      id: 1,
      question: 'Comment créer une nouvelle application?',
      answer: 'Cliquez sur le bouton "Nouvelle App" depuis le tableau de bord, remplissez les informations requises et cliquez sur "Créer".'
    },
    {
      id: 2,
      question: 'Quels connecteurs sont disponibles?',
      answer: 'PIVORI Studio propose 8 connecteurs: Google Drive, GitHub, Anthropic, Google Gemini, Supabase, Vercel, Gmail et API personnalisée.'
    },
    {
      id: 3,
      question: 'Comment gérer les permissions des utilisateurs?',
      answer: 'Accédez aux Paramètres > Utilisateurs, créez des rôles et assignez les permissions (Créer, Lire, Modifier, Supprimer, Administration).'
    },
    {
      id: 4,
      question: 'Comment configurer les emails?',
      answer: 'Allez à Paramètres > Email, configurez votre serveur SMTP et créez/modifiez les templates d\'emails.'
    }
  ]

  const support = [
    {
      id: 1,
      title: 'Email Support',
      description: 'Contactez notre équipe par email',
      icon: Mail,
      contact: 'support@pivori.studio',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      title: 'Chat Support',
      description: 'Chat en direct avec notre équipe',
      icon: MessageCircle,
      contact: 'Disponible 24/7',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 3,
      title: 'Téléphone',
      description: 'Appelez notre support',
      icon: Phone,
      contact: '+33 1 XX XX XX XX',
      color: 'from-purple-500 to-purple-600'
    }
  ]

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white shadow-lg">
          <h1 className="text-4xl font-bold mb-2">Aide & Tutoriels</h1>
          <p className="text-blue-100 text-lg">
            Trouvez les réponses à vos questions et apprenez à utiliser PIVORI Studio
          </p>
        </div>
      </div>

      {/* Guides Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          Guides & Tutoriels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide) => {
            const Icon = guide.icon
            return (
              <div
                key={guide.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {guide.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {guide.description}
                    </p>
                    <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {guide.category}
                      </span>
                      <span>{guide.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Videos Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Video className="w-6 h-6 text-purple-600" />
          Vidéos Tutoriels
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
            >
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 h-40 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                {video.thumbnail}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-gray-500 text-sm mt-2">
                  Durée: {video.duration}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Questions Fréquemment Posées
        </h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {faq.question}
              </h3>
              <p className="text-gray-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Support Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Besoin d'aide supplémentaire?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {support.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className={`bg-gradient-to-br ${item.color} rounded-lg p-6 text-white hover:shadow-lg transition-shadow duration-300 cursor-pointer`}
              >
                <Icon className="w-8 h-8 mb-4" />
                <h3 className="text-xl font-bold mb-2">
                  {item.title}
                </h3>
                <p className="text-white/90 mb-4">
                  {item.description}
                </p>
                <p className="text-white/80 text-sm font-semibold">
                  {item.contact}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Vous n'avez pas trouvé votre réponse?
        </h3>
        <p className="text-gray-600 mb-6">
          Contactez notre équipe de support, nous sommes là pour vous aider
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
          Contacter le Support
        </button>
      </div>
    </div>
  )
}

