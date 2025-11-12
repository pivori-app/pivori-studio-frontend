import { createClient } from '@supabase/supabase-js'

// Supabase Configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Initialize Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Schema
export const DATABASE_SCHEMA = {
  // Applications Table
  applications: {
    id: 'uuid',
    name: 'text',
    description: 'text',
    category: 'text',
    icon: 'text',
    template: 'text',
    currency: 'text',
    users_count: 'integer',
    revenue: 'numeric',
    health: 'integer',
    status: 'text',
    created_at: 'timestamp',
    updated_at: 'timestamp',
    user_id: 'uuid'
  },

  // Users Table
  users: {
    id: 'uuid',
    email: 'text',
    name: 'text',
    avatar: 'text',
    role: 'text',
    created_at: 'timestamp',
    updated_at: 'timestamp'
  },

  // Transactions Table
  transactions: {
    id: 'uuid',
    application_id: 'uuid',
    user_id: 'uuid',
    amount: 'numeric',
    currency: 'text',
    status: 'text',
    type: 'text',
    created_at: 'timestamp'
  },

  // API Keys Table
  api_keys: {
    id: 'uuid',
    application_id: 'uuid',
    key: 'text',
    name: 'text',
    last_used: 'timestamp',
    created_at: 'timestamp'
  },

  // Connectors Table
  connectors: {
    id: 'uuid',
    application_id: 'uuid',
    name: 'text',
    type: 'text',
    config: 'jsonb',
    status: 'text',
    created_at: 'timestamp'
  }
}

// SQL Migrations
export const MIGRATIONS = [
  // Create applications table
  `CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    icon TEXT,
    template TEXT,
    currency TEXT DEFAULT 'EUR',
    users_count INTEGER DEFAULT 0,
    revenue NUMERIC DEFAULT 0,
    health INTEGER DEFAULT 100,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id)
  )`,

  // Create users table
  `CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar TEXT,
    role TEXT DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`,

  // Create transactions table
  `CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id),
    user_id UUID REFERENCES auth.users(id),
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'completed',
    type TEXT,
    created_at TIMESTAMP DEFAULT NOW()
  )`,

  // Create api_keys table
  `CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id),
    key TEXT UNIQUE NOT NULL,
    name TEXT,
    last_used TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
  )`,

  // Create connectors table
  `CREATE TABLE IF NOT EXISTS connectors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    config JSONB,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW()
  )`,

  // Create RLS Policies
  `ALTER TABLE applications ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE transactions ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY`,
  `ALTER TABLE connectors ENABLE ROW LEVEL SECURITY`,

  // RLS Policy: Users can only see their own applications
  `CREATE POLICY "Users can see their own applications"
    ON applications FOR SELECT
    USING (auth.uid() = user_id)`,

  // RLS Policy: Users can create applications
  `CREATE POLICY "Users can create applications"
    ON applications FOR INSERT
    WITH CHECK (auth.uid() = user_id)`,

  // RLS Policy: Users can update their own applications
  `CREATE POLICY "Users can update their own applications"
    ON applications FOR UPDATE
    USING (auth.uid() = user_id)`,

  // RLS Policy: Users can delete their own applications
  `CREATE POLICY "Users can delete their own applications"
    ON applications FOR DELETE
    USING (auth.uid() = user_id)`
]

// Supabase Service Functions
export const supabaseService = {
  // Applications
  async getApplications(userId: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  },

  async createApplication(app: any) {
    const { data, error } = await supabase
      .from('applications')
      .insert([app])
      .select()
    
    if (error) throw error
    return data[0]
  },

  async updateApplication(id: string, updates: any) {
    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  async deleteApplication(id: string) {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Transactions
  async getTransactions(applicationId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('application_id', applicationId)
    
    if (error) throw error
    return data
  },

  async createTransaction(transaction: any) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // API Keys
  async getApiKeys(applicationId: string) {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('application_id', applicationId)
    
    if (error) throw error
    return data
  },

  async createApiKey(apiKey: any) {
    const { data, error } = await supabase
      .from('api_keys')
      .insert([apiKey])
      .select()
    
    if (error) throw error
    return data[0]
  },

  // Connectors
  async getConnectors(applicationId: string) {
    const { data, error } = await supabase
      .from('connectors')
      .select('*')
      .eq('application_id', applicationId)
    
    if (error) throw error
    return data
  },

  async createConnector(connector: any) {
    const { data, error } = await supabase
      .from('connectors')
      .insert([connector])
      .select()
    
    if (error) throw error
    return data[0]
  }
}

export default supabase

