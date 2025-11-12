import crypto from 'crypto'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

/**
 * Secure Secrets Management System
 * Handles encryption, storage, and rotation of sensitive data
 */

class SecretsManager {
  constructor() {
    this.encryptionKey = process.env.ENCRYPTION_KEY || this.generateEncryptionKey()
    this.secrets = new Map()
    this.auditLog = []
    this.rotationSchedule = new Map()
  }

  /**
   * Generate a secure encryption key
   */
  generateEncryptionKey() {
    return crypto.randomBytes(32).toString('hex')
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(data) {
    try {
      const iv = crypto.randomBytes(16)
      const cipher = crypto.createCipheriv(
        'aes-256-gcm',
        Buffer.from(this.encryptionKey, 'hex'),
        iv
      )

      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex')
      encrypted += cipher.final('hex')

      const authTag = cipher.getAuthTag()

      return {
        iv: iv.toString('hex'),
        encryptedData: encrypted,
        authTag: authTag.toString('hex'),
      }
    } catch (error) {
      console.error('Encryption failed:', error)
      throw new Error('Failed to encrypt data')
    }
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedObject) {
    try {
      const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        Buffer.from(this.encryptionKey, 'hex'),
        Buffer.from(encryptedObject.iv, 'hex')
      )

      decipher.setAuthTag(Buffer.from(encryptedObject.authTag, 'hex'))

      let decrypted = decipher.update(encryptedObject.encryptedData, 'hex', 'utf8')
      decrypted += decipher.final('utf8')

      return JSON.parse(decrypted)
    } catch (error) {
      console.error('Decryption failed:', error)
      throw new Error('Failed to decrypt data')
    }
  }

  /**
   * Store a secret securely
   */
  storeSecret(key, value, metadata = {}) {
    try {
      const encrypted = this.encrypt(value)
      const secretEntry = {
        key,
        encrypted,
        metadata: {
          ...metadata,
          createdAt: new Date(),
          expiresAt: metadata.expiresAt || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
          rotationRequired: false,
        },
      }

      this.secrets.set(key, secretEntry)
      this.auditLog.push({
        action: 'SECRET_STORED',
        key,
        timestamp: new Date(),
        userId: metadata.userId || 'system',
      })

      return { success: true, message: `Secret '${key}' stored securely` }
    } catch (error) {
      console.error('Failed to store secret:', error)
      throw error
    }
  }

  /**
   * Retrieve a secret
   */
  getSecret(key, userId = 'system') {
    try {
      const secretEntry = this.secrets.get(key)

      if (!secretEntry) {
        throw new Error(`Secret '${key}' not found`)
      }

      // Check if secret has expired
      if (new Date() > secretEntry.metadata.expiresAt) {
        this.secrets.delete(key)
        throw new Error(`Secret '${key}' has expired`)
      }

      // Log access
      this.auditLog.push({
        action: 'SECRET_ACCESSED',
        key,
        timestamp: new Date(),
        userId,
      })

      return this.decrypt(secretEntry.encrypted)
    } catch (error) {
      console.error('Failed to retrieve secret:', error)
      throw error
    }
  }

  /**
   * Rotate a secret
   */
  rotateSecret(key, newValue, userId = 'system') {
    try {
      const oldSecret = this.getSecret(key, userId)

      // Store new secret
      this.storeSecret(key, newValue, { userId, rotated: true })

      // Log rotation
      this.auditLog.push({
        action: 'SECRET_ROTATED',
        key,
        timestamp: new Date(),
        userId,
        oldHash: crypto.createHash('sha256').update(JSON.stringify(oldSecret)).digest('hex'),
      })

      return { success: true, message: `Secret '${key}' rotated successfully` }
    } catch (error) {
      console.error('Failed to rotate secret:', error)
      throw error
    }
  }

  /**
   * Schedule automatic secret rotation
   */
  scheduleRotation(key, rotationIntervalDays = 30, rotationCallback) {
    const intervalMs = rotationIntervalDays * 24 * 60 * 60 * 1000

    const rotationId = setInterval(() => {
      try {
        console.log(`Rotating secret: ${key}`)
        rotationCallback()
        this.auditLog.push({
          action: 'SECRET_AUTO_ROTATED',
          key,
          timestamp: new Date(),
          userId: 'system',
        })
      } catch (error) {
        console.error(`Failed to auto-rotate secret '${key}':`, error)
      }
    }, intervalMs)

    this.rotationSchedule.set(key, rotationId)
    return rotationId
  }

  /**
   * Delete a secret
   */
  deleteSecret(key, userId = 'system') {
    try {
      if (!this.secrets.has(key)) {
        throw new Error(`Secret '${key}' not found`)
      }

      this.secrets.delete(key)

      this.auditLog.push({
        action: 'SECRET_DELETED',
        key,
        timestamp: new Date(),
        userId,
      })

      return { success: true, message: `Secret '${key}' deleted` }
    } catch (error) {
      console.error('Failed to delete secret:', error)
      throw error
    }
  }

  /**
   * Get audit log
   */
  getAuditLog(filters = {}) {
    let log = this.auditLog

    if (filters.action) {
      log = log.filter((entry) => entry.action === filters.action)
    }

    if (filters.key) {
      log = log.filter((entry) => entry.key === filters.key)
    }

    if (filters.userId) {
      log = log.filter((entry) => entry.userId === filters.userId)
    }

    if (filters.startDate) {
      log = log.filter((entry) => entry.timestamp >= filters.startDate)
    }

    if (filters.endDate) {
      log = log.filter((entry) => entry.timestamp <= filters.endDate)
    }

    return log
  }

  /**
   * Export audit log to file
   */
  exportAuditLog(filename = 'audit-log.json') {
    try {
      const logPath = path.join(process.cwd(), 'logs', filename)
      fs.writeFileSync(logPath, JSON.stringify(this.auditLog, null, 2))
      return { success: true, path: logPath }
    } catch (error) {
      console.error('Failed to export audit log:', error)
      throw error
    }
  }

  /**
   * Check for secrets requiring rotation
   */
  checkRotationStatus() {
    const status = []

    this.secrets.forEach((secretEntry, key) => {
      const daysUntilExpiry = Math.floor(
        (secretEntry.metadata.expiresAt - new Date()) / (1000 * 60 * 60 * 24)
      )

      if (daysUntilExpiry <= 7) {
        status.push({
          key,
          daysUntilExpiry,
          requiresRotation: true,
        })
      }
    })

    return status
  }

  /**
   * Validate secret strength
   */
  validateSecretStrength(secret) {
    const strength = {
      score: 0,
      issues: [],
    }

    if (typeof secret !== 'string' || secret.length < 32) {
      strength.issues.push('Secret must be at least 32 characters long')
    } else {
      strength.score += 25
    }

    if (!/[A-Z]/.test(secret)) {
      strength.issues.push('Secret must contain uppercase letters')
    } else {
      strength.score += 25
    }

    if (!/[a-z]/.test(secret)) {
      strength.issues.push('Secret must contain lowercase letters')
    } else {
      strength.score += 25
    }

    if (!/[0-9]/.test(secret)) {
      strength.issues.push('Secret must contain numbers')
    } else {
      strength.score += 25
    }

    return strength
  }
}

export default new SecretsManager()

