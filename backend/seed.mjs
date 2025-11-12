import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  try {
    // Create sample user
    console.log('📝 Creating sample user...')
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          email: 'demo@pivori.com',
          name: 'Demo User',
          role: 'user',
          status: 'active',
        },
      ])
      .select()

    if (userError) throw userError
    const userId = userData[0].id
    console.log(`✅ User created: ${userId}`)

    // Create sample applications
    console.log('📝 Creating sample applications...')
    const applications = [
      {
        user_id: userId,
        name: 'LocaSimple',
        description: 'Plateforme de location de véhicules',
        category: 'marketplace',
        icon: '🚗',
        template: 'marketplace',
        currency: 'EUR',
        users_count: 1250,
        revenue: 45000,
        health: 98,
        status: 'active',
      },
      {
        user_id: userId,
        name: 'Wingly',
        description: 'Partage de vols privés',
        category: 'travel',
        icon: '✈️',
        template: 'travel',
        currency: 'EUR',
        users_count: 3500,
        revenue: 125000,
        health: 95,
        status: 'active',
      },
      {
        user_id: userId,
        name: 'ThémaLink',
        description: 'Plateforme de parcs à thème',
        category: 'entertainment',
        icon: '🎢',
        template: 'entertainment',
        currency: 'EUR',
        users_count: 2100,
        revenue: 89000,
        health: 92,
        status: 'active',
      },
      {
        user_id: userId,
        name: 'HeroChildren',
        description: 'Plateforme pour enfants',
        category: 'education',
        icon: '👶',
        template: 'education',
        currency: 'EUR',
        users_count: 5000,
        revenue: 200000,
        health: 99,
        status: 'active',
      },
    ]

    const { data: appsData, error: appsError } = await supabase
      .from('applications')
      .insert(applications)
      .select()

    if (appsError) throw appsError
    console.log(`✅ ${appsData.length} applications created`)

    // Create sample transactions
    console.log('📝 Creating sample transactions...')
    const transactions = []
    for (const app of appsData) {
      for (let i = 0; i < 5; i++) {
        transactions.push({
          application_id: app.id,
          user_id: userId,
          amount: Math.random() * 1000 + 50,
          currency: app.currency,
          status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
          type: ['payment', 'refund', 'subscription'][Math.floor(Math.random() * 3)],
          description: `Transaction ${i + 1}`,
        })
      }
    }

    const { data: txData, error: txError } = await supabase
      .from('transactions')
      .insert(transactions)
      .select()

    if (txError) throw txError
    console.log(`✅ ${txData.length} transactions created`)

    // Create sample API keys
    console.log('📝 Creating sample API keys...')
    const apiKeys = []
    for (const app of appsData) {
      apiKeys.push({
        application_id: app.id,
        name: 'Production Key',
        key: `sk_live_${Math.random().toString(36).substr(2, 32)}`,
        status: 'active',
      })
      apiKeys.push({
        application_id: app.id,
        name: 'Development Key',
        key: `sk_test_${Math.random().toString(36).substr(2, 32)}`,
        status: 'active',
      })
    }

    const { data: keysData, error: keysError } = await supabase
      .from('api_keys')
      .insert(apiKeys)
      .select()

    if (keysError) throw keysError
    console.log(`✅ ${keysData.length} API keys created`)

    // Create sample connectors
    console.log('📝 Creating sample connectors...')
    const connectors = []
    const connectorTypes = [
      { name: 'Google Drive', type: 'google_drive' },
      { name: 'GitHub', type: 'github' },
      { name: 'Anthropic Claude', type: 'anthropic' },
      { name: 'Google Gemini', type: 'gemini' },
      { name: 'Supabase', type: 'supabase' },
      { name: 'Vercel', type: 'vercel' },
      { name: 'Gmail', type: 'gmail' },
    ]

    for (const app of appsData) {
      for (let i = 0; i < 3; i++) {
        const connector = connectorTypes[Math.floor(Math.random() * connectorTypes.length)]
        connectors.push({
          application_id: app.id,
          name: connector.name,
          type: connector.type,
          config: { enabled: true },
          status: 'active',
        })
      }
    }

    const { data: connectorsData, error: connectorsError } = await supabase
      .from('connectors')
      .insert(connectors)
      .select()

    if (connectorsError) throw connectorsError
    console.log(`✅ ${connectorsData.length} connectors created`)

    console.log('✨ Database seeding completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seedDatabase()

