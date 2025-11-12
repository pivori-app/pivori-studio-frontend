import crypto from 'crypto'

/**
 * Data Encryption System
 * Handles encryption of sensitive data fields
 */

class EncryptionManager {
  constructor() {
    this.encryptionKey = process.env.DATA_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex')
    this.algorithm = 'aes-256-gcm'
  }

  /**
   * Encrypt sensitive data
   */
  encryptField(data) {
    try {
      const iv = crypto.randomBytes(16)
      const cipher = crypto.createCipheriv(
        this.algorithm,
        Buffer.from(this.encryptionKey, 'hex'),
        iv
      )

      let encrypted = cipher.update(String(data), 'utf8', 'hex')
      encrypted += cipher.final('hex')

      const authTag = cipher.getAuthTag()

      return {
        iv: iv.toString('hex'),
        encryptedData: encrypted,
        authTag: authTag.toString('hex'),
      }
    } catch (error) {
      console.error('Field encryption failed:', error)
      throw error
    }
  }

  /**
   * Decrypt sensitive data
   */
  decryptField(encryptedObject) {
    try {
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        Buffer.from(this.encryptionKey, 'hex'),
        Buffer.from(encryptedObject.iv, 'hex')
      )

      decipher.setAuthTag(Buffer.from(encryptedObject.authTag, 'hex'))

      let decrypted = decipher.update(encryptedObject.encryptedData, 'hex', 'utf8')
      decrypted += decipher.final('utf8')

      return decrypted
    } catch (error) {
      console.error('Field decryption failed:', error)
      throw error
    }
  }

  /**
   * Hash sensitive data (one-way)
   */
  hashData(data, algorithm = 'sha256') {
    try {
      return crypto.createHash(algorithm).update(String(data)).digest('hex')
    } catch (error) {
      console.error('Data hashing failed:', error)
      throw error
    }
  }

  /**
   * Generate secure random token
   */
  generateToken(length = 32) {
    return crypto.randomBytes(length).toString('hex')
  }

  /**
   * Encrypt entire object
   */
  encryptObject(obj) {
    try {
      const jsonString = JSON.stringify(obj)
      return this.encryptField(jsonString)
    } catch (error) {
      console.error('Object encryption failed:', error)
      throw error
    }
  }

  /**
   * Decrypt entire object
   */
  decryptObject(encryptedObject) {
    try {
      const decryptedString = this.decryptField(encryptedObject)
      return JSON.parse(decryptedString)
    } catch (error) {
      console.error('Object decryption failed:', error)
      throw error
    }
  }

  /**
   * Mask sensitive data for logging
   */
  maskSensitiveData(data, fields = ['password', 'token', 'key', 'secret']) {
    const masked = { ...data }

    fields.forEach((field) => {
      if (masked[field]) {
        const value = String(masked[field])
        masked[field] = value.substring(0, 3) + '*'.repeat(value.length - 6) + value.substring(value.length - 3)
      }
    })

    return masked
  }

  /**
   * Verify data integrity with HMAC
   */
  generateHMAC(data) {
    try {
      return crypto
        .createHmac('sha256', this.encryptionKey)
        .update(String(data))
        .digest('hex')
    } catch (error) {
      console.error('HMAC generation failed:', error)
      throw error
    }
  }

  /**
   * Verify HMAC
   */
  verifyHMAC(data, hmac) {
    try {
      const expectedHmac = this.generateHMAC(data)
      return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))
    } catch (error) {
      console.error('HMAC verification failed:', error)
      return false
    }
  }

  /**
   * Derive key from password
   */
  deriveKeyFromPassword(password, salt = null) {
    try {
      const derivedSalt = salt || crypto.randomBytes(16)
      const key = crypto.pbkdf2Sync(password, derivedSalt, 100000, 32, 'sha256')

      return {
        key: key.toString('hex'),
        salt: derivedSalt.toString('hex'),
      }
    } catch (error) {
      console.error('Key derivation failed:', error)
      throw error
    }
  }

  /**
   * Generate secure random number
   */
  generateSecureRandomNumber(min, max) {
    const range = max - min
    const bytesNeeded = Math.ceil(Math.log2(range) / 8)
    let randomValue

    do {
      randomValue = crypto.randomBytes(bytesNeeded).readUIntBE(0, bytesNeeded)
    } while (randomValue >= Math.pow(256, bytesNeeded) - (Math.pow(256, bytesNeeded) % range))

    return min + (randomValue % range)
  }
}

export default new EncryptionManager()

