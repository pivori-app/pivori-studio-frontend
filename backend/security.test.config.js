/**
 * Security Test Configuration
 * Configuration for running security tests
 */

export const securityTestConfig = {
  // Test Timeouts
  timeouts: {
    default: 5000,
    longRunning: 10000,
    cryptographic: 15000,
  },

  // Password Test Cases
  passwords: {
    weak: [
      'short',
      'onlylowercase',
      'ONLYUPPERCASE',
      'NoNumbers!',
      'NoSpecial123',
      '12345678',
      'password',
    ],
    strong: [
      'SecurePassword123!@#',
      'MyP@ssw0rd2024!',
      'C0mpl3x!P@ssw0rd',
      'Str0ng#Secure$Key',
    ],
  },

  // Encryption Test Cases
  encryption: {
    algorithms: ['aes-256-gcm'],
    keyLengths: [16, 32, 64],
    testData: [
      'simple-string',
      'user@example.com',
      '{"nested": {"object": "data"}}',
      '12345678901234567890',
    ],
  },

  // JWT Test Cases
  jwt: {
    algorithms: ['HS256'],
    expiryTimes: ['1h', '7d', '30d'],
    payloads: [
      { userId: 'test-user', role: 'user' },
      { userId: 'admin-user', role: 'admin', permissions: ['read', 'write'] },
      { sub: 'user-123', email: 'user@example.com', iat: Math.floor(Date.now() / 1000) },
    ],
  },

  // Rate Limiting Test Cases
  rateLimiting: {
    limits: {
      perIP: 100,
      perUser: 1000,
      perEndpoint: 50,
    },
    windows: {
      short: 60 * 1000, // 1 minute
      medium: 15 * 60 * 1000, // 15 minutes
      long: 60 * 60 * 1000, // 1 hour
    },
  },

  // Brute Force Detection
  bruteForce: {
    failedLoginThreshold: 5,
    failedLoginWindow: 15 * 60 * 1000, // 15 minutes
    lockoutDuration: 30 * 60 * 1000, // 30 minutes
  },

  // Audit Log Test Cases
  auditLog: {
    eventTypes: [
      'SUCCESSFUL_LOGIN',
      'FAILED_LOGIN',
      'UNAUTHORIZED_ACCESS',
      'DATA_ACCESS',
      'DATA_MODIFICATION',
      'API_ERROR',
      'RATE_LIMIT_EXCEEDED',
    ],
    severities: ['critical', 'high', 'medium', 'low'],
  },

  // OWASP Top 10 Test Cases
  owasp: {
    sqlInjection: [
      "'; DROP TABLE users; --",
      "1' OR '1'='1",
      "admin'--",
      "1 UNION SELECT * FROM users--",
    ],
    xss: [
      '<script>alert("XSS")</script>',
      '<img src=x onerror="alert(\'XSS\')">',
      'javascript:alert("XSS")',
      '<svg onload="alert(\'XSS\')">',
    ],
    csrf: {
      validTokenLength: 64,
      tokenAlgorithm: 'sha256',
    },
  },

  // Data Masking Test Cases
  dataMasking: {
    sensitiveFields: ['password', 'token', 'key', 'secret', 'apiKey'],
    maskPatterns: {
      password: /^.{3}.*(.{3})$/,
      token: /^.{3}.*(.{3})$/,
      email: /^[^@]{3}.*@/,
      phone: /^\+?1?(\d{3})\d{3}(\d{4})$/,
    },
  },

  // Performance Benchmarks
  performance: {
    passwordHashing: 1000, // ms
    encryption: 100, // ms
    tokenGeneration: 50, // ms
    auditLogging: 10, // ms
  },

  // Compliance Checks
  compliance: {
    gdpr: {
      dataRetention: 30 * 24 * 60 * 60 * 1000, // 30 days
      userRights: ['access', 'delete', 'export'],
    },
    soc2: {
      auditLogging: true,
      encryptionRequired: true,
      accessControl: true,
    },
  },

  // Test Database
  testDatabase: {
    host: 'localhost',
    port: 5432,
    database: 'pivori_test',
    user: 'pivori',
    password: 'pivori_test_password',
  },

  // Mock Data
  mockData: {
    users: [
      {
        id: 'user-1',
        email: 'user1@example.com',
        name: 'User One',
        role: 'user',
      },
      {
        id: 'user-2',
        email: 'user2@example.com',
        name: 'User Two',
        role: 'admin',
      },
    ],
    apiKeys: [
      {
        id: 'key-1',
        key: 'sk_test_' + 'a'.repeat(32),
        name: 'Test Key 1',
      },
      {
        id: 'key-2',
        key: 'sk_test_' + 'b'.repeat(32),
        name: 'Test Key 2',
      },
    ],
  },

  // Logging
  logging: {
    level: 'debug',
    format: 'json',
    output: 'logs/security-tests.log',
  },

  // Reporting
  reporting: {
    generateReport: true,
    reportFormat: 'html',
    reportOutput: 'reports/security-test-report.html',
    includeMetrics: true,
    includeCoverage: true,
  },
}

export default securityTestConfig

