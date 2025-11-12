import { describe, it, expect, beforeEach } from 'vitest'
import encryption from '../security/encryption.js'

describe('Encryption Security Tests', () => {
  const testData = 'sensitive-data-12345'
  const testObject = {
    email: 'user@example.com',
    phone: '+1234567890',
    ssn: '123-45-6789',
  }

  describe('Field Encryption', () => {
    it('should encrypt field', () => {
      const encrypted = encryption.encryptField(testData)

      expect(encrypted).toBeDefined()
      expect(encrypted.iv).toBeDefined()
      expect(encrypted.encryptedData).toBeDefined()
      expect(encrypted.authTag).toBeDefined()
      expect(encrypted.encryptedData).not.toBe(testData)
    })

    it('should decrypt field', () => {
      const encrypted = encryption.encryptField(testData)
      const decrypted = encryption.decryptField(encrypted)

      expect(decrypted).toBe(testData)
    })

    it('should produce different ciphertext for same plaintext', () => {
      const encrypted1 = encryption.encryptField(testData)
      const encrypted2 = encryption.encryptField(testData)

      // Different IVs should produce different ciphertexts
      expect(encrypted1.encryptedData).not.toBe(encrypted2.encryptedData)
      expect(encrypted1.iv).not.toBe(encrypted2.iv)
    })

    it('should reject tampered ciphertext', () => {
      const encrypted = encryption.encryptField(testData)
      encrypted.encryptedData = encrypted.encryptedData.slice(0, -10) + '0000000000'

      expect(() => {
        encryption.decryptField(encrypted)
      }).toThrow()
    })

    it('should reject invalid auth tag', () => {
      const encrypted = encryption.encryptField(testData)
      encrypted.authTag = 'invalid' + encrypted.authTag.slice(6)

      expect(() => {
        encryption.decryptField(encrypted)
      }).toThrow()
    })
  })

  describe('Object Encryption', () => {
    it('should encrypt object', () => {
      const encrypted = encryption.encryptObject(testObject)

      expect(encrypted).toBeDefined()
      expect(encrypted.iv).toBeDefined()
      expect(encrypted.encryptedData).toBeDefined()
      expect(encrypted.authTag).toBeDefined()
    })

    it('should decrypt object', () => {
      const encrypted = encryption.encryptObject(testObject)
      const decrypted = encryption.decryptObject(encrypted)

      expect(decrypted).toEqual(testObject)
      expect(decrypted.email).toBe(testObject.email)
      expect(decrypted.phone).toBe(testObject.phone)
    })

    it('should preserve object structure', () => {
      const complexObject = {
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          nested: {
            data: [1, 2, 3],
          },
        },
      }

      const encrypted = encryption.encryptObject(complexObject)
      const decrypted = encryption.decryptObject(encrypted)

      expect(decrypted).toEqual(complexObject)
    })
  })

  describe('Data Hashing', () => {
    it('should hash data with SHA256', () => {
      const hash = encryption.hashData(testData, 'sha256')

      expect(hash).toBeDefined()
      expect(typeof hash).toBe('string')
      expect(hash.length).toBe(64) // SHA256 hex length
    })

    it('should produce consistent hash', () => {
      const hash1 = encryption.hashData(testData, 'sha256')
      const hash2 = encryption.hashData(testData, 'sha256')

      expect(hash1).toBe(hash2)
    })

    it('should produce different hashes for different data', () => {
      const hash1 = encryption.hashData('data1', 'sha256')
      const hash2 = encryption.hashData('data2', 'sha256')

      expect(hash1).not.toBe(hash2)
    })

    it('should hash with different algorithms', () => {
      const sha256Hash = encryption.hashData(testData, 'sha256')
      const sha512Hash = encryption.hashData(testData, 'sha512')

      expect(sha256Hash).not.toBe(sha512Hash)
      expect(sha512Hash.length).toBe(128) // SHA512 hex length
    })
  })

  describe('Token Generation', () => {
    it('should generate secure random token', () => {
      const token = encryption.generateToken(32)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.length).toBe(64) // 32 bytes hex
    })

    it('should generate unique tokens', () => {
      const token1 = encryption.generateToken(32)
      const token2 = encryption.generateToken(32)

      expect(token1).not.toBe(token2)
    })

    it('should generate token of specified length', () => {
      const token16 = encryption.generateToken(16)
      const token32 = encryption.generateToken(32)
      const token64 = encryption.generateToken(64)

      expect(token16.length).toBe(32) // 16 bytes hex
      expect(token32.length).toBe(64) // 32 bytes hex
      expect(token64.length).toBe(128) // 64 bytes hex
    })
  })

  describe('Data Masking', () => {
    it('should mask sensitive fields', () => {
      const data = {
        password: 'SecurePassword123!',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        email: 'user@example.com',
      }

      const masked = encryption.maskSensitiveData(data)

      expect(masked.password).not.toBe(data.password)
      expect(masked.password).toContain('*')
      expect(masked.token).not.toBe(data.token)
      expect(masked.email).toBe(data.email) // Not in sensitive fields
    })

    it('should preserve data structure when masking', () => {
      const data = {
        password: 'SecurePassword123!',
        username: 'john_doe',
      }

      const masked = encryption.maskSensitiveData(data)

      expect(masked).toHaveProperty('password')
      expect(masked).toHaveProperty('username')
      expect(masked.username).toBe(data.username)
    })
  })

  describe('HMAC', () => {
    it('should generate HMAC', () => {
      const hmac = encryption.generateHMAC(testData)

      expect(hmac).toBeDefined()
      expect(typeof hmac).toBe('string')
      expect(hmac.length).toBe(64) // SHA256 hex length
    })

    it('should verify valid HMAC', () => {
      const hmac = encryption.generateHMAC(testData)
      const isValid = encryption.verifyHMAC(testData, hmac)

      expect(isValid).toBe(true)
    })

    it('should reject invalid HMAC', () => {
      const hmac = encryption.generateHMAC(testData)
      const isValid = encryption.verifyHMAC('different-data', hmac)

      expect(isValid).toBe(false)
    })

    it('should reject tampered HMAC', () => {
      const hmac = encryption.generateHMAC(testData)
      const tamperedHmac = hmac.slice(0, -10) + '0000000000'

      const isValid = encryption.verifyHMAC(testData, tamperedHmac)
      expect(isValid).toBe(false)
    })
  })

  describe('Key Derivation', () => {
    it('should derive key from password', () => {
      const password = 'SecurePassword123!@#'
      const result = encryption.deriveKeyFromPassword(password)

      expect(result).toBeDefined()
      expect(result.key).toBeDefined()
      expect(result.salt).toBeDefined()
      expect(result.key.length).toBe(64) // 32 bytes hex
    })

    it('should derive consistent key with same salt', () => {
      const password = 'SecurePassword123!@#'
      const result1 = encryption.deriveKeyFromPassword(password)
      const result2 = encryption.deriveKeyFromPassword(password, result1.salt)

      expect(result1.key).toBe(result2.key)
    })

    it('should derive different keys with different passwords', () => {
      const result1 = encryption.deriveKeyFromPassword('Password1')
      const result2 = encryption.deriveKeyFromPassword('Password2')

      expect(result1.key).not.toBe(result2.key)
    })
  })

  describe('Secure Random Numbers', () => {
    it('should generate secure random number in range', () => {
      const number = encryption.generateSecureRandomNumber(1, 100)

      expect(number).toBeGreaterThanOrEqual(1)
      expect(number).toBeLessThanOrEqual(100)
    })

    it('should generate different random numbers', () => {
      const numbers = new Set()

      for (let i = 0; i < 10; i++) {
        numbers.add(encryption.generateSecureRandomNumber(1, 1000))
      }

      // Should have multiple different numbers
      expect(numbers.size).toBeGreaterThan(1)
    })

    it('should respect range boundaries', () => {
      for (let i = 0; i < 100; i++) {
        const number = encryption.generateSecureRandomNumber(10, 20)
        expect(number).toBeGreaterThanOrEqual(10)
        expect(number).toBeLessThanOrEqual(20)
      }
    })
  })
})

