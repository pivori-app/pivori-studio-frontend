import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import crypto from 'crypto'

// Import security modules
import auth from './security/auth.js'
import encryption from './security/encryption.js'
import audit from './security/audit.js'
import secrets from './security/secrets.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'

// ============ SUPABASE CLIENT ============
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// ============ SECURITY MIDDLEWARE ============

// Helmet - Set security HTTP headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}))

// CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL || 'https://pivori-studio.vercel.app',
    ]

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}))

// Body Parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Input Sanitization
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized field: ${key}`)
  },
}))

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts, please try again later.',
})

app.use('/api/', limiter)
app.use('/api/auth/login', loginLimiter)
app.use('/api/auth/register', loginLimiter)

// Request Logging Middleware
app.use((req, res, next) => {
  const startTime = Date.now()

  res.on('finish', () => {
    const duration = Date.now() - startTime

    audit.logEvent('API_CALL', {
      userId: req.user?.userId || 'anonymous',
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.path,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get('user-agent'),
    })
  })

  next()
})

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()')
  next()
})

// ============ AUTHENTICATION MIDDLEWARE ============

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
      audit.logEvent('UNAUTHORIZED_ACCESS', {
        userId: 'unknown',
        ipAddress: req.ip,
        endpoint: req.path,
        reason: 'Missing token',
      })

      return res.status(401).json({
        success: false,
        error: 'Missing authorization token',
      })
    }

    const decoded = auth.verifyToken(token)
    req.user = decoded

    audit.logEvent('SUCCESSFUL_AUTH', {
      userId: decoded.userId,
      ipAddress: req.ip,
      endpoint: req.path,
    })

    next()
  } catch (error) {
    audit.logEvent('FAILED_AUTH', {
      userId: 'unknown',
      ipAddress: req.ip,
      endpoint: req.path,
      error: error.message,
    })

    res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    })
  }
}

// Authorization Middleware
const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
        })
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        audit.logEvent('PERMISSION_DENIED', {
          userId: req.user.userId,
          ipAddress: req.ip,
          endpoint: req.path,
          requiredRole: allowedRoles,
          userRole: req.user.role,
        })

        return res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
        })
      }

      next()
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Authorization check failed',
      })
    }
  }
}

// CSRF Protection Middleware
const csrfProtection = (req, res, next) => {
  if (req.method === 'GET') {
    const csrfToken = auth.generateCSRFToken()
    res.locals.csrfToken = csrfToken
    res.setHeader('X-CSRF-Token', csrfToken)
  }

  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const token = req.headers['x-csrf-token'] || req.body._csrf

    if (!token) {
      return res.status(403).json({
        success: false,
        error: 'CSRF token missing',
      })
    }

    if (token.length !== 64) {
      return res.status(403).json({
        success: false,
        error: 'Invalid CSRF token',
      })
    }
  }

  next()
}

// ============ ERROR HANDLER ============

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  audit.logEvent('API_ERROR', {
    userId: req.user?.userId || 'anonymous',
    ipAddress: req.ip,
    endpoint: req.path,
    error: err.message,
    statusCode: err.statusCode || 500,
  })

  const isDevelopment = NODE_ENV === 'development'
  const errorMessage = isDevelopment ? err.message : 'Internal server error'

  res.status(err.statusCode || 500).json({
    success: false,
    error: errorMessage,
    ...(isDevelopment && { stack: err.stack }),
  })
}

// ============ HEALTH CHECK ============

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    uptime: process.uptime(),
  })
})

// ============ AUTHENTICATION ROUTES ============

// Register
app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { email, password, name } = req.body

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      })
    }

    // Validate password strength
    const strength = auth.validatePasswordStrength(password)
    if (strength.score < 50) {
      return res.status(400).json({
        success: false,
        error: 'Password is too weak',
        issues: strength.issues,
      })
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      audit.logEvent('REGISTRATION_FAILED', {
        email,
        ipAddress: req.ip,
        reason: 'User already exists',
      })

      return res.status(409).json({
        success: false,
        error: 'User already exists',
      })
    }

    // Hash password
    const passwordHash = await auth.hashPassword(password)

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert([{
        email,
        name,
        password_hash: passwordHash,
        role: 'user',
      }])
      .select()

    if (error) throw error

    // Generate tokens
    const accessToken = auth.generateToken({
      userId: user[0].id,
      email: user[0].email,
      role: user[0].role,
    })

    const refreshToken = auth.generateRefreshToken(user[0].id)

    // Create session
    const sessionId = auth.createSession(user[0].id, accessToken, refreshToken, {
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    })

    audit.logEvent('SUCCESSFUL_REGISTRATION', {
      userId: user[0].id,
      email,
      ipAddress: req.ip,
    })

    res.status(201).json({
      success: true,
      user: {
        id: user[0].id,
        email: user[0].email,
        name: user[0].name,
      },
      sessionId,
      accessToken,
      refreshToken,
      expiresIn: 3600,
    })
  } catch (error) {
    audit.logEvent('REGISTRATION_ERROR', {
      email: req.body.email,
      ipAddress: req.ip,
      error: error.message,
    })

    next(error)
  }
})

// Login
app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing email or password',
      })
    }

    // Find user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (userError || !user) {
      audit.logEvent('FAILED_LOGIN', {
        email,
        ipAddress: req.ip,
        reason: 'User not found',
      })

      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      })
    }

    // Verify password
    const isPasswordValid = await auth.comparePassword(password, user.password_hash)

    if (!isPasswordValid) {
      audit.logEvent('FAILED_LOGIN', {
        userId: user.id,
        email,
        ipAddress: req.ip,
        reason: 'Invalid password',
      })

      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      })
    }

    // Generate tokens
    const accessToken = auth.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const refreshToken = auth.generateRefreshToken(user.id)

    // Create session
    const sessionId = auth.createSession(user.id, accessToken, refreshToken, {
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    })

    audit.logEvent('SUCCESSFUL_LOGIN', {
      userId: user.id,
      email,
      ipAddress: req.ip,
    })

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      sessionId,
      accessToken,
      refreshToken,
      expiresIn: 3600,
    })
  } catch (error) {
    audit.logEvent('LOGIN_ERROR', {
      email: req.body.email,
      ipAddress: req.ip,
      error: error.message,
    })

    next(error)
  }
})

// Refresh Token
app.post('/api/auth/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: 'Refresh token required',
      })
    }

    const decoded = auth.verifyRefreshToken(refreshToken)

    const newAccessToken = auth.generateToken({
      userId: decoded.userId,
      role: decoded.role,
    })

    const newRefreshToken = auth.generateRefreshToken(decoded.userId)

    res.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 3600,
    })
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token',
    })
  }
})

// Logout
app.post('/api/auth/logout', authenticateToken, async (req, res, next) => {
  try {
    const { sessionId } = req.body

    if (sessionId) {
      auth.revokeSession(sessionId)
    } else {
      auth.revokeAllUserSessions(req.user.userId)
    }

    audit.logEvent('SUCCESSFUL_LOGOUT', {
      userId: req.user.userId,
      ipAddress: req.ip,
    })

    res.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    next(error)
  }
})

// Get User Profile
app.get('/api/users/profile', authenticateToken, async (req, res, next) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, role, created_at, updated_at')
      .eq('id', req.user.userId)
      .single()

    if (error) throw error

    res.json({
      success: true,
      user,
    })
  } catch (error) {
    next(error)
  }
})

// ============ APPLICATIONS API ============

app.get('/api/applications', authenticateToken, async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', req.user.userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({
      success: true,
      data,
    })
  } catch (error) {
    next(error)
  }
})

app.post('/api/applications', authenticateToken, csrfProtection, async (req, res, next) => {
  try {
    const { name, description, category, currency } = req.body

    if (!name || !description || !category) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      })
    }

    const { data, error } = await supabase
      .from('applications')
      .insert([{
        name,
        description,
        category,
        currency: currency || 'EUR',
        user_id: req.user.userId,
        status: 'active',
      }])
      .select()

    if (error) throw error

    audit.logEvent('APPLICATION_CREATED', {
      userId: req.user.userId,
      applicationId: data[0].id,
      name,
    })

    res.status(201).json({
      success: true,
      data: data[0],
    })
  } catch (error) {
    next(error)
  }
})

app.put('/api/applications/:id', authenticateToken, csrfProtection, async (req, res, next) => {
  try {
    const { id } = req.params
    const updates = req.body

    const { data, error } = await supabase
      .from('applications')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', id)
      .eq('user_id', req.user.userId)
      .select()

    if (error) throw error

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Application not found',
      })
    }

    audit.logEvent('APPLICATION_UPDATED', {
      userId: req.user.userId,
      applicationId: id,
    })

    res.json({
      success: true,
      data: data[0],
    })
  } catch (error) {
    next(error)
  }
})

app.delete('/api/applications/:id', authenticateToken, csrfProtection, async (req, res, next) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.userId)

    if (error) throw error

    audit.logEvent('APPLICATION_DELETED', {
      userId: req.user.userId,
      applicationId: id,
    })

    res.json({
      success: true,
      message: 'Application deleted',
    })
  } catch (error) {
    next(error)
  }
})

// ============ TRANSACTIONS API ============

app.get('/api/transactions', authenticateToken, async (req, res, next) => {
  try {
    const { applicationId } = req.query

    let query = supabase
      .from('transactions')
      .select('*')

    if (applicationId) {
      query = query.eq('application_id', applicationId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    res.json({
      success: true,
      data,
    })
  } catch (error) {
    next(error)
  }
})

app.post('/api/transactions', authenticateToken, csrfProtection, async (req, res, next) => {
  try {
    const { applicationId, amount, currency, status, type } = req.body

    if (!applicationId || !amount || !currency) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      })
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        application_id: applicationId,
        user_id: req.user.userId,
        amount,
        currency,
        status: status || 'pending',
        type: type || 'payment',
      }])
      .select()

    if (error) throw error

    audit.logEvent('TRANSACTION_CREATED', {
      userId: req.user.userId,
      transactionId: data[0].id,
      amount,
      currency,
    })

    res.status(201).json({
      success: true,
      data: data[0],
    })
  } catch (error) {
    next(error)
  }
})

// ============ AUDIT LOGS API ============

app.get('/api/audit-logs', authenticateToken, authorize(['admin']), async (req, res, next) => {
  try {
    const { startDate, endDate, userId, action } = req.query

    let filters = {}
    if (startDate) filters.startDate = new Date(startDate)
    if (endDate) filters.endDate = new Date(endDate)
    if (userId) filters.userId = userId
    if (action) filters.action = action

    const logs = audit.getEvents(filters)

    res.json({
      success: true,
      data: logs,
      count: logs.length,
    })
  } catch (error) {
    next(error)
  }
})

// ============ SECURITY ALERTS API ============

app.get('/api/security/alerts', authenticateToken, authorize(['admin']), async (req, res, next) => {
  try {
    const { severity, status } = req.query

    let filters = {}
    if (severity) filters.severity = severity
    if (status) filters.status = status

    const alerts = audit.getAlerts(filters)

    res.json({
      success: true,
      data: alerts,
      count: alerts.length,
    })
  } catch (error) {
    next(error)
  }
})

// ============ SECURITY REPORT API ============

app.get('/api/security/report', authenticateToken, authorize(['admin']), async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()

    const report = audit.generateSecurityReport(start, end)

    res.json({
      success: true,
      data: report,
    })
  } catch (error) {
    next(error)
  }
})

// ============ ERROR HANDLING ============

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
  })
})

app.use(errorHandler)

// ============ SERVER START ============

const server = app.listen(PORT, () => {
  console.log(`🚀 PIVORI Studio Backend v2.0`)
  console.log(`📍 Server running on port ${PORT}`)
  console.log(`🌍 Environment: ${NODE_ENV}`)
  console.log(`🔐 Security: Enabled`)
  console.log(`📊 Audit Logging: Enabled`)
  console.log(``)
  console.log(`Health Check: http://localhost:${PORT}/health`)
  console.log(`API Documentation: http://localhost:${PORT}/api/docs`)
})

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
    process.exit(0)
  })
})

export default app

