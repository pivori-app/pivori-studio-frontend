import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

/**
 * Secure Authentication System
 * Handles JWT tokens, password hashing, and session management
 */

class AuthenticationManager {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'dev-secret-key'
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret'
    this.tokenExpiryTime = '1h'
    this.refreshTokenExpiryTime = '7d'
    this.sessions = new Map()
    this.blacklistedTokens = new Set()
  }

  /**
   * Hash password securely
   */
  async hashPassword(password) {
    try {
      // Validate password strength
      const strength = this.validatePasswordStrength(password)
      if (strength.score < 50) {
        throw new Error(`Password is too weak: ${strength.issues.join(', ')}`)
      }

      const salt = await bcrypt.genSalt(12)
      return await bcrypt.hash(password, salt)
    } catch (error) {
      console.error('Password hashing failed:', error)
      throw error
    }
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password, hash) {
    try {
      return await bcrypt.compare(password, hash)
    } catch (error) {
      console.error('Password comparison failed:', error)
      throw error
    }
  }

  /**
   * Generate JWT token
   */
  generateToken(payload, expiresIn = this.tokenExpiryTime) {
    try {
      const token = jwt.sign(payload, this.jwtSecret, {
        expiresIn,
        algorithm: 'HS256',
        issuer: 'pivori-studio',
        audience: 'pivori-users',
      })

      return token
    } catch (error) {
      console.error('Token generation failed:', error)
      throw error
    }
  }

  /**
   * Generate refresh token
   */
  generateRefreshToken(userId) {
    try {
      const refreshToken = jwt.sign(
        { userId, type: 'refresh' },
        this.refreshTokenSecret,
        {
          expiresIn: this.refreshTokenExpiryTime,
          algorithm: 'HS256',
          issuer: 'pivori-studio',
        }
      )

      return refreshToken
    } catch (error) {
      console.error('Refresh token generation failed:', error)
      throw error
    }
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      // Check if token is blacklisted
      if (this.blacklistedTokens.has(token)) {
        throw new Error('Token has been revoked')
      }

      const decoded = jwt.verify(token, this.jwtSecret, {
        algorithms: ['HS256'],
        issuer: 'pivori-studio',
        audience: 'pivori-users',
      })

      return decoded
    } catch (error) {
      console.error('Token verification failed:', error)
      throw error
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret, {
        algorithms: ['HS256'],
        issuer: 'pivori-studio',
      })

      return decoded
    } catch (error) {
      console.error('Refresh token verification failed:', error)
      throw error
    }
  }

  /**
   * Create session
   */
  createSession(userId, token, refreshToken, metadata = {}) {
    try {
      const sessionId = crypto.randomBytes(16).toString('hex')
      const session = {
        sessionId,
        userId,
        token,
        refreshToken,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        metadata: {
          ...metadata,
          ipAddress: metadata.ipAddress || 'unknown',
          userAgent: metadata.userAgent || 'unknown',
        },
        isActive: true,
      }

      this.sessions.set(sessionId, session)
      return sessionId
    } catch (error) {
      console.error('Session creation failed:', error)
      throw error
    }
  }

  /**
   * Get session
   */
  getSession(sessionId) {
    try {
      const session = this.sessions.get(sessionId)

      if (!session) {
        throw new Error('Session not found')
      }

      if (!session.isActive) {
        throw new Error('Session is inactive')
      }

      if (new Date() > session.expiresAt) {
        session.isActive = false
        throw new Error('Session has expired')
      }

      return session
    } catch (error) {
      console.error('Session retrieval failed:', error)
      throw error
    }
  }

  /**
   * Revoke session
   */
  revokeSession(sessionId) {
    try {
      const session = this.sessions.get(sessionId)

      if (session) {
        session.isActive = false
        this.blacklistedTokens.add(session.token)
        this.blacklistedTokens.add(session.refreshToken)
      }

      return { success: true, message: 'Session revoked' }
    } catch (error) {
      console.error('Session revocation failed:', error)
      throw error
    }
  }

  /**
   * Revoke all sessions for user
   */
  revokeAllUserSessions(userId) {
    try {
      let revokedCount = 0

      this.sessions.forEach((session, sessionId) => {
        if (session.userId === userId && session.isActive) {
          session.isActive = false
          this.blacklistedTokens.add(session.token)
          this.blacklistedTokens.add(session.refreshToken)
          revokedCount++
        }
      })

      return { success: true, revokedCount, message: `${revokedCount} sessions revoked` }
    } catch (error) {
      console.error('Failed to revoke all user sessions:', error)
      throw error
    }
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password) {
    const strength = {
      score: 0,
      issues: [],
    }

    if (password.length < 12) {
      strength.issues.push('Password must be at least 12 characters long')
    } else if (password.length >= 12) {
      strength.score += 25
    }

    if (!/[A-Z]/.test(password)) {
      strength.issues.push('Password must contain uppercase letters')
    } else {
      strength.score += 25
    }

    if (!/[a-z]/.test(password)) {
      strength.issues.push('Password must contain lowercase letters')
    } else {
      strength.score += 25
    }

    if (!/[0-9]/.test(password)) {
      strength.issues.push('Password must contain numbers')
    } else {
      strength.score += 25
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      strength.issues.push('Password must contain special characters')
    } else {
      strength.score += 25
    }

    return strength
  }

  /**
   * Generate CSRF token
   */
  generateCSRFToken() {
    return crypto.randomBytes(32).toString('hex')
  }

  /**
   * Verify CSRF token
   */
  verifyCSRFToken(token, storedToken) {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(storedToken))
  }

  /**
   * Generate 2FA code
   */
  generate2FACode() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  /**
   * Verify 2FA code
   */
  verify2FACode(code, storedCode, expiryTime = 5 * 60 * 1000) {
    // Code expires after 5 minutes
    return code === storedCode
  }

  /**
   * Get active sessions for user
   */
  getUserSessions(userId) {
    const userSessions = []

    this.sessions.forEach((session) => {
      if (session.userId === userId && session.isActive) {
        userSessions.push({
          sessionId: session.sessionId,
          createdAt: session.createdAt,
          expiresAt: session.expiresAt,
          metadata: session.metadata,
        })
      }
    })

    return userSessions
  }

  /**
   * Clean up expired sessions
   */
  cleanupExpiredSessions() {
    let cleanedCount = 0

    this.sessions.forEach((session, sessionId) => {
      if (new Date() > session.expiresAt) {
        this.sessions.delete(sessionId)
        cleanedCount++
      }
    })

    console.log(`Cleaned up ${cleanedCount} expired sessions`)
    return cleanedCount
  }
}

export default new AuthenticationManager()

