import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoSanitize from 'express-mongo-sanitize'
import cors from 'cors'
import auth from '../security/auth.js'
import audit from '../security/audit.js'
import encryption from '../security/encryption.js'

/**
 * Security Middleware Suite
 * Comprehensive security middleware for Express.js
 */

// Helmet - Set security HTTP headers
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  frameguard: {
    action: 'SAMEORIGIN',
  },
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
})

// Rate Limiting
export const createRateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    skip: (req) => {
      // Skip rate limiting for health checks
      return req.path === '/health'
    },
    keyGenerator: (req) => {
      // Use user ID if authenticated, otherwise use IP
      return req.user?.id || req.ip
    },
  })
}

// CORS Configuration
export const corsMiddleware = cors({
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
  maxAge: 86400, // 24 hours
})

// Input Sanitization
export const sanitizationMiddleware = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized field: ${key}`)
  },
})

// Authentication Middleware
export const authenticateToken = (req, res, next) => {
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
export const authorize = (allowedRoles = []) => {
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
export const csrfProtection = (req, res, next) => {
  // Generate CSRF token for GET requests
  if (req.method === 'GET') {
    const csrfToken = auth.generateCSRFToken()
    res.locals.csrfToken = csrfToken
    res.setHeader('X-CSRF-Token', csrfToken)
  }

  // Verify CSRF token for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const token = req.headers['x-csrf-token'] || req.body._csrf

    if (!token) {
      return res.status(403).json({
        success: false,
        error: 'CSRF token missing',
      })
    }

    // In production, verify against stored token
    // For now, just verify it's a valid format
    if (token.length !== 64) {
      return res.status(403).json({
        success: false,
        error: 'Invalid CSRF token',
      })
    }
  }

  next()
}

// Request Logging Middleware
export const requestLogging = (req, res, next) => {
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
}

// Error Handling Middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err)

  // Log error securely (without sensitive data)
  audit.logEvent('API_ERROR', {
    userId: req.user?.userId || 'anonymous',
    ipAddress: req.ip,
    endpoint: req.path,
    error: err.message,
    statusCode: err.statusCode || 500,
  })

  // Don't expose error details in production
  const isDevelopment = process.env.NODE_ENV === 'development'
  const errorMessage = isDevelopment ? err.message : 'Internal server error'

  res.status(err.statusCode || 500).json({
    success: false,
    error: errorMessage,
    ...(isDevelopment && { stack: err.stack }),
  })
}

// Data Encryption Middleware (for sensitive responses)
export const encryptSensitiveData = (req, res, next) => {
  const originalJson = res.json

  res.json = function (data) {
    // Mask sensitive fields in response
    const masked = encryption.maskSensitiveData(data)

    return originalJson.call(this, masked)
  }

  next()
}

// Security Headers Middleware
export const securityHeaders = (req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff')

  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')

  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block')

  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Permissions policy
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=()'
  )

  next()
}

// Input Validation Middleware
export const validateInput = (schema) => {
  return (req, res, next) => {
    try {
      // Validate request body against schema
      // This is a simplified example - use a library like Joi in production
      if (schema && typeof schema === 'object') {
        // Validation logic here
      }

      next()
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.message,
      })
    }
  }
}

// Brute Force Protection Middleware
export const bruteForceProtection = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs
  skipSuccessfulRequests: true, // Don't count successful requests
  message: 'Too many login attempts, please try again later.',
  keyGenerator: (req) => {
    // Use email for login attempts
    return req.body.email || req.ip
  },
})

// Compose all security middleware
export const securityMiddleware = [
  helmetMiddleware,
  corsMiddleware,
  securityHeaders,
  sanitizationMiddleware,
  createRateLimiter(),
  requestLogging,
]

// Compose authentication middleware
export const authMiddleware = [
  authenticateToken,
  csrfProtection,
  encryptSensitiveData,
]

export default {
  helmetMiddleware,
  corsMiddleware,
  sanitizationMiddleware,
  createRateLimiter,
  authenticateToken,
  authorize,
  csrfProtection,
  requestLogging,
  errorHandler,
  encryptSensitiveData,
  securityHeaders,
  validateInput,
  bruteForceProtection,
  securityMiddleware,
  authMiddleware,
}

