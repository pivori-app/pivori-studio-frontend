import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import auth from '../security/auth.js'

describe('Authentication Security Tests', () => {
  let userId = 'test-user-123'
  let sessionId = null

  beforeEach(() => {
    // Clean up before each test
    sessionId = null
  })

  describe('Password Hashing', () => {
    it('should hash password securely', async () => {
      const password = 'SecurePassword123!@#'
      const hash = await auth.hashPassword(password)

      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(50) // bcrypt hash length
    })

    it('should reject weak passwords', async () => {
      const weakPasswords = [
        'short', // Too short
        'onlylowercase', // No uppercase
        'ONLYUPPERCASE', // No lowercase
        'NoNumbers!', // No numbers
        'NoSpecial123', // No special characters
      ]

      for (const password of weakPasswords) {
        try {
          await auth.hashPassword(password)
          expect.fail(`Should reject weak password: ${password}`)
        } catch (error) {
          expect(error.message).toContain('too weak')
        }
      }
    })

    it('should compare passwords correctly', async () => {
      const password = 'SecurePassword123!@#'
      const hash = await auth.hashPassword(password)

      const isValid = await auth.comparePassword(password, hash)
      expect(isValid).toBe(true)

      const isInvalid = await auth.comparePassword('WrongPassword123!@#', hash)
      expect(isInvalid).toBe(false)
    })

    it('should validate password strength', () => {
      const strength = auth.validatePasswordStrength('WeakPass')
      expect(strength.score).toBeLessThan(100)
      expect(strength.issues.length).toBeGreaterThan(0)

      const strongStrength = auth.validatePasswordStrength('SecurePassword123!@#')
      expect(strongStrength.score).toBe(100)
      expect(strongStrength.issues.length).toBe(0)
    })
  })

  describe('JWT Token Generation', () => {
    it('should generate valid JWT token', () => {
      const payload = { userId, email: 'test@example.com', role: 'user' }
      const token = auth.generateToken(payload)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.').length).toBe(3) // JWT format: header.payload.signature
    })

    it('should include payload in token', () => {
      const payload = { userId, email: 'test@example.com', role: 'user' }
      const token = auth.generateToken(payload)

      const decoded = auth.verifyToken(token)
      expect(decoded.userId).toBe(userId)
      expect(decoded.email).toBe('test@example.com')
      expect(decoded.role).toBe('user')
    })

    it('should set correct token expiry', () => {
      const payload = { userId }
      const token = auth.generateToken(payload, '1h')

      const decoded = auth.verifyToken(token)
      const expiryTime = decoded.exp - decoded.iat
      expect(expiryTime).toBe(3600) // 1 hour in seconds
    })
  })

  describe('JWT Token Verification', () => {
    it('should verify valid token', () => {
      const payload = { userId, email: 'test@example.com' }
      const token = auth.generateToken(payload)

      const decoded = auth.verifyToken(token)
      expect(decoded).toBeDefined()
      expect(decoded.userId).toBe(userId)
    })

    it('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here'

      expect(() => {
        auth.verifyToken(invalidToken)
      }).toThrow()
    })

    it('should reject tampered token', () => {
      const payload = { userId }
      const token = auth.generateToken(payload)
      const tampered = token.slice(0, -10) + 'tampered00'

      expect(() => {
        auth.verifyToken(tampered)
      }).toThrow()
    })

    it('should reject expired token', () => {
      const payload = { userId }
      const expiredToken = auth.generateToken(payload, '0s')

      // Wait for token to expire
      setTimeout(() => {
        expect(() => {
          auth.verifyToken(expiredToken)
        }).toThrow()
      }, 100)
    })

    it('should reject blacklisted token', () => {
      const payload = { userId }
      const token = auth.generateToken(payload)

      // Verify token works
      expect(auth.verifyToken(token)).toBeDefined()

      // Blacklist token
      auth.blacklistedTokens.add(token)

      // Token should now be rejected
      expect(() => {
        auth.verifyToken(token)
      }).toThrow('revoked')
    })
  })

  describe('Refresh Token', () => {
    it('should generate refresh token', () => {
      const refreshToken = auth.generateRefreshToken(userId)

      expect(refreshToken).toBeDefined()
      expect(typeof refreshToken).toBe('string')
    })

    it('should verify refresh token', () => {
      const refreshToken = auth.generateRefreshToken(userId)
      const decoded = auth.verifyRefreshToken(refreshToken)

      expect(decoded.userId).toBe(userId)
      expect(decoded.type).toBe('refresh')
    })

    it('should have longer expiry than access token', () => {
      const accessToken = auth.generateToken({ userId }, '1h')
      const refreshToken = auth.generateRefreshToken(userId)

      const accessDecoded = auth.verifyToken(accessToken)
      const refreshDecoded = auth.verifyRefreshToken(refreshToken)

      const accessExpiry = accessDecoded.exp - accessDecoded.iat
      const refreshExpiry = refreshDecoded.exp - refreshDecoded.iat

      expect(refreshExpiry).toBeGreaterThan(accessExpiry)
    })
  })

  describe('Session Management', () => {
    it('should create session', () => {
      const token = auth.generateToken({ userId })
      const refreshToken = auth.generateRefreshToken(userId)

      sessionId = auth.createSession(userId, token, refreshToken, {
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      })

      expect(sessionId).toBeDefined()
      expect(typeof sessionId).toBe('string')
    })

    it('should retrieve session', () => {
      const token = auth.generateToken({ userId })
      const refreshToken = auth.generateRefreshToken(userId)

      sessionId = auth.createSession(userId, token, refreshToken)
      const session = auth.getSession(sessionId)

      expect(session).toBeDefined()
      expect(session.userId).toBe(userId)
      expect(session.isActive).toBe(true)
    })

    it('should revoke session', () => {
      const token = auth.generateToken({ userId })
      const refreshToken = auth.generateRefreshToken(userId)

      sessionId = auth.createSession(userId, token, refreshToken)
      auth.revokeSession(sessionId)

      expect(() => {
        auth.getSession(sessionId)
      }).toThrow('inactive')
    })

    it('should revoke all user sessions', () => {
      const token1 = auth.generateToken({ userId })
      const refreshToken1 = auth.generateRefreshToken(userId)
      const sessionId1 = auth.createSession(userId, token1, refreshToken1)

      const token2 = auth.generateToken({ userId })
      const refreshToken2 = auth.generateRefreshToken(userId)
      const sessionId2 = auth.createSession(userId, token2, refreshToken2)

      const result = auth.revokeAllUserSessions(userId)

      expect(result.revokedCount).toBe(2)
      expect(() => auth.getSession(sessionId1)).toThrow()
      expect(() => auth.getSession(sessionId2)).toThrow()
    })

    it('should get user sessions', () => {
      const token = auth.generateToken({ userId })
      const refreshToken = auth.generateRefreshToken(userId)

      auth.createSession(userId, token, refreshToken)
      auth.createSession(userId, token, refreshToken)

      const sessions = auth.getUserSessions(userId)
      expect(sessions.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('CSRF Protection', () => {
    it('should generate CSRF token', () => {
      const csrfToken = auth.generateCSRFToken()

      expect(csrfToken).toBeDefined()
      expect(typeof csrfToken).toBe('string')
      expect(csrfToken.length).toBe(64) // 32 bytes hex
    })

    it('should verify CSRF token', () => {
      const csrfToken = auth.generateCSRFToken()
      const isValid = auth.verifyCSRFToken(csrfToken, csrfToken)

      expect(isValid).toBe(true)
    })

    it('should reject invalid CSRF token', () => {
      const csrfToken = auth.generateCSRFToken()
      const invalidToken = auth.generateCSRFToken()

      expect(() => {
        auth.verifyCSRFToken(invalidToken, csrfToken)
      }).toThrow()
    })
  })

  describe('2FA (Two-Factor Authentication)', () => {
    it('should generate 2FA code', () => {
      const code = auth.generate2FACode()

      expect(code).toBeDefined()
      expect(typeof code).toBe('string')
      expect(code.length).toBe(6)
      expect(/^\d{6}$/.test(code)).toBe(true)
    })

    it('should verify 2FA code', () => {
      const code = auth.generate2FACode()
      const isValid = auth.verify2FACode(code, code)

      expect(isValid).toBe(true)
    })

    it('should reject invalid 2FA code', () => {
      const code = auth.generate2FACode()
      const invalidCode = auth.generate2FACode()

      const isValid = auth.verify2FACode(invalidCode, code)
      expect(isValid).toBe(false)
    })
  })

  describe('Session Cleanup', () => {
    it('should cleanup expired sessions', () => {
      const token = auth.generateToken({ userId })
      const refreshToken = auth.generateRefreshToken(userId)

      // Create session with past expiry
      const session = {
        sessionId: 'expired-session',
        userId,
        token,
        refreshToken,
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isActive: true,
      }

      auth.sessions.set('expired-session', session)

      const cleanedCount = auth.cleanupExpiredSessions()
      expect(cleanedCount).toBeGreaterThan(0)
      expect(auth.sessions.has('expired-session')).toBe(false)
    })
  })
})

