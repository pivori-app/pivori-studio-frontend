import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import secrets from '../security/secrets.js'

describe('Secrets Management Security Tests', () => {
  const testSecret = 'SuperSecretApiKey123!@#'
  const userId = 'test-user-123'

  beforeEach(() => {
    // Clear secrets before each test
    secrets.secrets.clear()
    secrets.auditLog = []
  })

  describe('Secret Storage', () => {
    it('should store secret securely', () => {
      const result = secrets.storeSecret('api-key', testSecret, { userId })

      expect(result.success).toBe(true)
      expect(secrets.secrets.has('api-key')).toBe(true)
    })

    it('should encrypt stored secret', () => {
      secrets.storeSecret('api-key', testSecret, { userId })

      const secretEntry = secrets.secrets.get('api-key')
      expect(secretEntry.encrypted).toBeDefined()
      expect(secretEntry.encrypted.encryptedData).not.toBe(testSecret)
    })

    it('should add metadata to secret', () => {
      secrets.storeSecret('api-key', testSecret, {
        userId,
        description: 'Test API key',
      })

      const secretEntry = secrets.secrets.get('api-key')
      expect(secretEntry.metadata).toBeDefined()
      expect(secretEntry.metadata.createdAt).toBeDefined()
      expect(secretEntry.metadata.expiresAt).toBeDefined()
    })

    it('should set default expiry', () => {
      secrets.storeSecret('api-key', testSecret, { userId })

      const secretEntry = secrets.secrets.get('api-key')
      const expiryDate = secretEntry.metadata.expiresAt
      const now = new Date()
      const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)

      // Should be close to 90 days
      expect(expiryDate.getTime()).toBeCloseTo(ninetyDaysFromNow.getTime(), -5)
    })
  })

  describe('Secret Retrieval', () => {
    it('should retrieve stored secret', () => {
      secrets.storeSecret('api-key', testSecret, { userId })
      const retrieved = secrets.getSecret('api-key', userId)

      expect(retrieved).toBe(testSecret)
    })

    it('should throw error for non-existent secret', () => {
      expect(() => {
        secrets.getSecret('non-existent', userId)
      }).toThrow('not found')
    })

    it('should log secret access', () => {
      secrets.storeSecret('api-key', testSecret, { userId })
      secrets.getSecret('api-key', userId)

      const accessLogs = secrets.auditLog.filter((log) => log.action === 'SECRET_ACCESSED')
      expect(accessLogs.length).toBeGreaterThan(0)
    })

    it('should reject expired secret', () => {
      // Store secret with past expiry
      secrets.storeSecret('api-key', testSecret, {
        userId,
        expiresAt: new Date(Date.now() - 1000), // 1 second ago
      })

      expect(() => {
        secrets.getSecret('api-key', userId)
      }).toThrow('expired')
    })
  })

  describe('Secret Rotation', () => {
    it('should rotate secret', () => {
      const newSecret = 'NewSecretKey456!@#'

      secrets.storeSecret('api-key', testSecret, { userId })
      const result = secrets.rotateSecret('api-key', newSecret, userId)

      expect(result.success).toBe(true)
      expect(secrets.getSecret('api-key', userId)).toBe(newSecret)
    })

    it('should log rotation in audit trail', () => {
      const newSecret = 'NewSecretKey456!@#'

      secrets.storeSecret('api-key', testSecret, { userId })
      secrets.rotateSecret('api-key', newSecret, userId)

      const rotationLogs = secrets.auditLog.filter((log) => log.action === 'SECRET_ROTATED')
      expect(rotationLogs.length).toBeGreaterThan(0)
    })

    it('should hash old secret in audit log', () => {
      const newSecret = 'NewSecretKey456!@#'

      secrets.storeSecret('api-key', testSecret, { userId })
      secrets.rotateSecret('api-key', newSecret, userId)

      const rotationLog = secrets.auditLog.find((log) => log.action === 'SECRET_ROTATED')
      expect(rotationLog.oldHash).toBeDefined()
    })
  })

  describe('Secret Deletion', () => {
    it('should delete secret', () => {
      secrets.storeSecret('api-key', testSecret, { userId })
      const result = secrets.deleteSecret('api-key', userId)

      expect(result.success).toBe(true)
      expect(secrets.secrets.has('api-key')).toBe(false)
    })

    it('should log deletion', () => {
      secrets.storeSecret('api-key', testSecret, { userId })
      secrets.deleteSecret('api-key', userId)

      const deletionLogs = secrets.auditLog.filter((log) => log.action === 'SECRET_DELETED')
      expect(deletionLogs.length).toBeGreaterThan(0)
    })

    it('should throw error deleting non-existent secret', () => {
      expect(() => {
        secrets.deleteSecret('non-existent', userId)
      }).toThrow('not found')
    })
  })

  describe('Audit Log', () => {
    it('should log all operations', () => {
      secrets.storeSecret('key1', 'secret1', { userId })
      secrets.getSecret('key1', userId)
      secrets.deleteSecret('key1', userId)

      expect(secrets.auditLog.length).toBeGreaterThanOrEqual(3)
    })

    it('should filter audit log by action', () => {
      secrets.storeSecret('key1', 'secret1', { userId })
      secrets.storeSecret('key2', 'secret2', { userId })
      secrets.getSecret('key1', userId)

      const storedLogs = secrets.getAuditLog({ action: 'SECRET_STORED' })
      expect(storedLogs.length).toBe(2)

      const accessLogs = secrets.getAuditLog({ action: 'SECRET_ACCESSED' })
      expect(accessLogs.length).toBe(1)
    })

    it('should filter audit log by key', () => {
      secrets.storeSecret('key1', 'secret1', { userId })
      secrets.storeSecret('key2', 'secret2', { userId })

      const key1Logs = secrets.getAuditLog({ key: 'key1' })
      expect(key1Logs.length).toBeGreaterThan(0)
      expect(key1Logs.every((log) => log.key === 'key1')).toBe(true)
    })

    it('should filter audit log by user', () => {
      const user1 = 'user-1'
      const user2 = 'user-2'

      secrets.storeSecret('key1', 'secret1', { userId: user1 })
      secrets.storeSecret('key2', 'secret2', { userId: user2 })

      const user1Logs = secrets.getAuditLog({ userId: user1 })
      expect(user1Logs.every((log) => log.userId === user1)).toBe(true)
    })

    it('should filter audit log by date range', () => {
      const now = new Date()
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

      secrets.storeSecret('key1', 'secret1', { userId })

      const logsToday = secrets.getAuditLog({
        startDate: new Date(now.getTime() - 1000),
        endDate: now,
      })

      expect(logsToday.length).toBeGreaterThan(0)

      const logsTomorrow = secrets.getAuditLog({
        startDate: tomorrow,
        endDate: new Date(tomorrow.getTime() + 1000),
      })

      expect(logsTomorrow.length).toBe(0)
    })
  })

  describe('Secret Strength Validation', () => {
    it('should validate strong secret', () => {
      const strength = secrets.validateSecretStrength('StrongSecret123!@#$%^&*()')

      expect(strength.score).toBe(100)
      expect(strength.issues.length).toBe(0)
    })

    it('should reject short secret', () => {
      const strength = secrets.validateSecretStrength('short')

      expect(strength.score).toBeLessThan(100)
      expect(strength.issues).toContain('Secret must be at least 32 characters long')
    })

    it('should reject secret without uppercase', () => {
      const strength = secrets.validateSecretStrength('lowercase123456789012345678901234')

      expect(strength.issues).toContain('Secret must contain uppercase letters')
    })

    it('should reject secret without lowercase', () => {
      const strength = secrets.validateSecretStrength('UPPERCASE123456789012345678901234')

      expect(strength.issues).toContain('Secret must contain lowercase letters')
    })

    it('should reject secret without numbers', () => {
      const strength = secrets.validateSecretStrength('NoNumbersHereAtAllInThisSecret')

      expect(strength.issues).toContain('Secret must contain numbers')
    })
  })

  describe('Rotation Scheduling', () => {
    it('should schedule rotation', (done) => {
      const rotationCallback = () => {
        done()
      }

      // Schedule rotation every 100ms for testing
      const rotationId = secrets.scheduleRotation('test-key', 0.000001, rotationCallback)

      expect(rotationId).toBeDefined()
      expect(secrets.rotationSchedule.has('test-key')).toBe(true)

      // Cleanup
      setTimeout(() => {
        clearInterval(rotationId)
      }, 200)
    })

    it('should track rotation schedule', () => {
      const rotationCallback = () => {}
      const rotationId = secrets.scheduleRotation('test-key', 0.000001, rotationCallback)

      expect(secrets.rotationSchedule.has('test-key')).toBe(true)

      clearInterval(rotationId)
    })
  })

  describe('Rotation Status', () => {
    it('should check rotation status', () => {
      secrets.storeSecret('key1', 'secret1', {
        userId,
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      })

      const status = secrets.checkRotationStatus()
      const key1Status = status.find((s) => s.key === 'key1')

      expect(key1Status).toBeDefined()
      expect(key1Status.requiresRotation).toBe(true)
    })

    it('should not require rotation for new secret', () => {
      secrets.storeSecret('key1', 'secret1', {
        userId,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
      })

      const status = secrets.checkRotationStatus()
      const key1Status = status.find((s) => s.key === 'key1')

      expect(key1Status).toBeUndefined() // Not in status (doesn't require rotation)
    })
  })

  describe('Export Audit Log', () => {
    it('should export audit log', () => {
      secrets.storeSecret('key1', 'secret1', { userId })
      secrets.getSecret('key1', userId)

      const result = secrets.exportAuditLog('audit-test.json')

      expect(result.success).toBe(true)
      expect(result.filepath).toBeDefined()
    })
  })
})

