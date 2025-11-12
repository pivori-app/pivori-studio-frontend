import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Supabase Client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' })
  }
}

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ============ APPLICATIONS API ============

// Get all applications for user
app.get('/api/applications', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create application
app.post('/api/applications', authenticateToken, async (req, res) => {
  try {
    const { name, description, category, icon, template, currency } = req.body

    if (!name || !description || !category) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const { data, error } = await supabase
      .from('applications')
      .insert([{
        name,
        description,
        category,
        icon: icon || '📱',
        template: template || 'blank',
        currency: currency || 'EUR',
        user_id: req.user.id,
        status: 'active'
      }])
      .select()

    if (error) throw error
    res.status(201).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update application
app.put('/api/applications/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const updates = req.body

    const { data, error } = await supabase
      .from('applications')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()

    if (error) throw error
    if (data.length === 0) {
      return res.status(404).json({ error: 'Application not found' })
    }

    res.json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete application
app.delete('/api/applications/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id)

    if (error) throw error
    res.json({ message: 'Application deleted' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============ TRANSACTIONS API ============

// Get transactions for application
app.get('/api/applications/:id/transactions', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('application_id', id)
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create transaction
app.post('/api/applications/:id/transactions', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { amount, currency, type } = req.body

    if (!amount || !currency) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        application_id: id,
        user_id: req.user.id,
        amount,
        currency,
        type: type || 'payment',
        status: 'completed'
      }])
      .select()

    if (error) throw error
    res.status(201).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============ API KEYS API ============

// Get API keys for application
app.get('/api/applications/:id/keys', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, key, last_used, created_at')
      .eq('application_id', id)

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create API key
app.post('/api/applications/:id/keys', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }

    const key = `sk_${Math.random().toString(36).substr(2, 32)}`

    const { data, error } = await supabase
      .from('api_keys')
      .insert([{
        application_id: id,
        name,
        key
      }])
      .select()

    if (error) throw error
    res.status(201).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============ CONNECTORS API ============

// Get connectors for application
app.get('/api/applications/:id/connectors', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('connectors')
      .select('*')
      .eq('application_id', id)

    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create connector
app.post('/api/applications/:id/connectors', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { name, type, config } = req.body

    if (!name || !type) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const { data, error } = await supabase
      .from('connectors')
      .insert([{
        application_id: id,
        name,
        type,
        config: config || {},
        status: 'active'
      }])
      .select()

    if (error) throw error
    res.status(201).json(data[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============ ANALYTICS API ============

// Get analytics for application
app.get('/api/applications/:id/analytics', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    // Get application data
    const { data: appData, error: appError } = await supabase
      .from('applications')
      .select('*')
      .eq('id', id)
      .single()

    if (appError) throw appError

    // Get transactions data
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('amount, currency, created_at')
      .eq('application_id', id)

    if (txError) throw txError

    // Calculate analytics
    const totalRevenue = transactions.reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
    const transactionCount = transactions.length

    res.json({
      application: appData,
      totalRevenue,
      transactionCount,
      transactions
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// ============ ERROR HANDLING ============

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

// Error Handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

// ============ START SERVER ============

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})

export default app

