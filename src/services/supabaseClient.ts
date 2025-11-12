import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Auth Service
export const authService = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) throw error
  },

  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })
    if (error) throw error
  },

  onAuthStateChange(callback: any) {
    return supabase.auth.onAuthStateChange(callback)
  },
}

// Applications Service
export const applicationsService = {
  async getAll() {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(application: any) {
    const { data, error } = await supabase
      .from('applications')
      .insert([application])
      .select()

    if (error) throw error
    return data[0]
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async subscribeToChanges(callback: any) {
    return supabase
      .from('applications')
      .on('*', (payload) => {
        callback(payload)
      })
      .subscribe()
  },
}

// Transactions Service
export const transactionsService = {
  async getByApplicationId(applicationId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  async create(transaction: any) {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()

    if (error) throw error
    return data[0]
  },

  async getStats(applicationId: string) {
    const { data, error } = await supabase
      .from('transactions')
      .select('amount, currency, status')
      .eq('application_id', applicationId)

    if (error) throw error

    const stats = {
      total: 0,
      completed: 0,
      pending: 0,
      failed: 0,
      byStatus: {},
    }

    data?.forEach((tx: any) => {
      stats.total += parseFloat(tx.amount)
      stats[tx.status as keyof typeof stats]++
      if (!stats.byStatus[tx.status]) {
        stats.byStatus[tx.status] = 0
      }
      stats.byStatus[tx.status]++
    })

    return stats
  },
}

// API Keys Service
export const apiKeysService = {
  async getByApplicationId(applicationId: string) {
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, key, last_used, created_at')
      .eq('application_id', applicationId)

    if (error) throw error
    return data
  },

  async create(apiKey: any) {
    const { data, error } = await supabase
      .from('api_keys')
      .insert([apiKey])
      .select()

    if (error) throw error
    return data[0]
  },

  async revoke(id: string) {
    const { error } = await supabase
      .from('api_keys')
      .update({ status: 'revoked' })
      .eq('id', id)

    if (error) throw error
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}

// Connectors Service
export const connectorsService = {
  async getByApplicationId(applicationId: string) {
    const { data, error } = await supabase
      .from('connectors')
      .select('*')
      .eq('application_id', applicationId)

    if (error) throw error
    return data
  },

  async create(connector: any) {
    const { data, error } = await supabase
      .from('connectors')
      .insert([connector])
      .select()

    if (error) throw error
    return data[0]
  },

  async update(id: string, updates: any) {
    const { data, error } = await supabase
      .from('connectors')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) throw error
    return data[0]
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('connectors')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async testConnection(id: string) {
    const { data, error } = await supabase
      .from('connectors')
      .select('config')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },
}

// Analytics Service
export const analyticsService = {
  async getApplicationStats(applicationId: string) {
    const { data: app, error: appError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single()

    if (appError) throw appError

    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .eq('application_id', applicationId)

    if (txError) throw txError

    const totalRevenue = transactions?.reduce(
      (sum, tx) => sum + parseFloat(tx.amount),
      0
    ) || 0

    return {
      application: app,
      totalRevenue,
      transactionCount: transactions?.length || 0,
      transactions: transactions || [],
    }
  },

  async getUserStats(userId: string) {
    const { data: apps, error: appsError } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', userId)

    if (appsError) throw appsError

    const stats = {
      totalApplications: apps?.length || 0,
      totalRevenue: 0,
      totalTransactions: 0,
    }

    for (const app of apps || []) {
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('application_id', app.id)

      if (!txError && transactions) {
        stats.totalRevenue += transactions.reduce(
          (sum, tx) => sum + parseFloat(tx.amount),
          0
        )
        stats.totalTransactions += transactions.length
      }
    }

    return stats
  },
}

export default supabase

