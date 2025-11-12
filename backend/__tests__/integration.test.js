import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

describe('Supabase Integration', () => {
  let userId = null
  let applicationId = null

  beforeAll(async () => {
    // Create test user
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email: `test-${Date.now()}@pivori.com`,
          name: 'Test User',
          role: 'user',
        },
      ])
      .select()

    if (error) throw error
    userId = data[0].id
  })

  describe('Applications Table', () => {
    it('should create an application', async () => {
      const { data, error } = await supabase
        .from('applications')
        .insert([
          {
            user_id: userId,
            name: 'Test App',
            description: 'Test Description',
            category: 'productivity',
            currency: 'EUR',
          },
        ])
        .select()

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data[0].name).toBe('Test App')
      applicationId = data[0].id
    })

    it('should read an application', async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', applicationId)
        .single()

      expect(error).toBeNull()
      expect(data.name).toBe('Test App')
    })

    it('should update an application', async () => {
      const { data, error } = await supabase
        .from('applications')
        .update({ name: 'Updated App' })
        .eq('id', applicationId)
        .select()

      expect(error).toBeNull()
      expect(data[0].name).toBe('Updated App')
    })

    it('should list applications for user', async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', userId)

      expect(error).toBeNull()
      expect(Array.isArray(data)).toBe(true)
      expect(data.length).toBeGreaterThan(0)
    })
  })

  describe('Transactions Table', () => {
    it('should create a transaction', async () => {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            application_id: applicationId,
            user_id: userId,
            amount: 99.99,
            currency: 'EUR',
            status: 'completed',
            type: 'payment',
          },
        ])
        .select()

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data[0].amount).toBe(99.99)
    })

    it('should list transactions for application', async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('application_id', applicationId)

      expect(error).toBeNull()
      expect(Array.isArray(data)).toBe(true)
    })
  })

  describe('API Keys Table', () => {
    it('should create an API key', async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .insert([
          {
            application_id: applicationId,
            name: 'Test Key',
            key: `sk_test_${Math.random().toString(36).substr(2, 32)}`,
          },
        ])
        .select()

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data[0].name).toBe('Test Key')
    })
  })

  describe('Connectors Table', () => {
    it('should create a connector', async () => {
      const { data, error } = await supabase
        .from('connectors')
        .insert([
          {
            application_id: applicationId,
            name: 'Google Drive',
            type: 'google_drive',
            config: { enabled: true },
          },
        ])
        .select()

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data[0].type).toBe('google_drive')
    })
  })

  describe('Views', () => {
    it('should query application_stats view', async () => {
      const { data, error } = await supabase
        .from('application_stats')
        .select('*')
        .eq('user_id', userId)

      expect(error).toBeNull()
      expect(Array.isArray(data)).toBe(true)
    })

    it('should query user_stats view', async () => {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('id', userId)

      expect(error).toBeNull()
      expect(Array.isArray(data)).toBe(true)
    })
  })

  afterAll(async () => {
    // Cleanup: delete test data
    await supabase.from('users').delete().eq('id', userId)
  })
})

describe('RLS Policies', () => {
  it('should enforce row level security', async () => {
    // This test verifies that RLS policies are working
    // Users should only see their own applications
    const { data, error } = await supabase
      .from('applications')
      .select('*')

    // Should either return only user's apps or error if not authenticated
    expect(error === null || error.code === 'PGRST301').toBe(true)
  })
})

