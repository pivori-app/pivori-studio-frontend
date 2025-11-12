import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Application {
  id: string
  name: string
  description: string
  category: string
  icon: string
  template: string
  users: number
  revenue: number
  currency: string
  health: number
  status: 'active' | 'maintenance'
  createdAt: string
}

interface AppContextType {
  applications: Application[]
  addApplication: (app: Omit<Application, 'id' | 'users' | 'revenue' | 'health' | 'status' | 'createdAt'>) => void
  updateApplication: (id: string, updates: Partial<Application>) => void
  deleteApplication: (id: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [applications, setApplications] = useState<Application[]>([])

  // Charger les applications depuis localStorage au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('pivori_applications')
    if (saved) {
      try {
        setApplications(JSON.parse(saved))
      } catch (error) {
        console.error('Erreur lors du chargement des applications:', error)
        // Charger les données par défaut
        setApplications(getDefaultApplications())
      }
    } else {
      setApplications(getDefaultApplications())
    }
  }, [])

  // Sauvegarder les applications dans localStorage
  useEffect(() => {
    localStorage.setItem('pivori_applications', JSON.stringify(applications))
  }, [applications])

  const addApplication = (app: Omit<Application, 'id' | 'users' | 'revenue' | 'health' | 'status' | 'createdAt'>) => {
    const newApp: Application = {
      ...app,
      id: `app_${Date.now()}`,
      users: Math.floor(Math.random() * 5000) + 100,
      revenue: Math.floor(Math.random() * 50000) + 5000,
      health: Math.floor(Math.random() * 30) + 70,
      status: 'active',
      createdAt: new Date().toISOString()
    }
    setApplications(prev => [newApp, ...prev])
  }

  const updateApplication = (id: string, updates: Partial<Application>) => {
    setApplications(prev =>
      prev.map(app => (app.id === id ? { ...app, ...updates } : app))
    )
  }

  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id))
  }

  return (
    <AppContext.Provider value={{ applications, addApplication, updateApplication, deleteApplication }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext doit être utilisé dans un AppProvider')
  }
  return context
}

function getDefaultApplications(): Application[] {
  return [
    {
      id: 'app_1',
      name: 'LocaSimple',
      description: 'Gestion locative intelligente',
      category: 'productivity',
      icon: '🏠',
      template: 'blank',
      users: 1247,
      revenue: 15420,
      currency: 'EUR',
      health: 98,
      status: 'active',
      createdAt: '2025-01-15T10:30:00Z'
    },
    {
      id: 'app_2',
      name: 'Wingly',
      description: 'Plateforme de vols partagés',
      category: 'saas',
      icon: '✈️',
      template: 'marketplace',
      users: 892,
      revenue: 8930,
      currency: 'USD',
      health: 95,
      status: 'active',
      createdAt: '2025-02-20T14:45:00Z'
    },
    {
      id: 'app_3',
      name: 'ThémaLink',
      description: 'Liens thématiques intelligents',
      category: 'entertainment',
      icon: '🔗',
      template: 'blog',
      users: 2156,
      revenue: 12340,
      currency: 'GBP',
      health: 87,
      status: 'maintenance',
      createdAt: '2025-03-10T09:15:00Z'
    },
    {
      id: 'app_4',
      name: 'HeroChildren',
      description: 'Plateforme éducative pour enfants',
      category: 'education',
      icon: '🎓',
      template: 'community',
      users: 3421,
      revenue: 24560,
      currency: 'EUR',
      health: 99,
      status: 'active',
      createdAt: '2025-04-05T16:20:00Z'
    }
  ]
}

