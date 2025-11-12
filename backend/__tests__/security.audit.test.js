import { describe, it, expect, beforeEach } from 'vitest'
import audit from '../security/audit.js'

describe('Security Audit & Monitoring Tests', () => {
  const userId = 'test-user-123'
  const ipAddress = '192.168.1.1'

  beforeEach(() => {
    // Clear events and alerts before each test
    audit.events = []
    audit.alerts = []
    audit.suspiciousPatterns.clear()
  })

  describe('Event Logging', () => {
    it('should log security event', () => {
      const eventId = audit.logEvent('SUCCESSFUL_LOGIN', {
        userId,
        ipAddress,
      })

      expect(eventId).toBeDefined()
      expect(audit.events.length).toBe(1)
    })

    it('should include event details', () => {
      audit.logEvent('API_CALL', {
        userId,
        ipAddress,
        endpoint: '/api/users',
      })

      const event = audit.events[0]
      expect(event.type).toBe('API_CALL')
      expect(event.userId).toBe(userId)
      expect(event.ipAddress).toBe(ipAddress)
    })

    it('should set event severity', () => {
      audit.logEvent('FAILED_LOGIN', { userId, ipAddress })
      audit.logEvent('SUCCESSFUL_LOGIN', { userId, ipAddress })

      const failedLoginEvent = audit.events.find((e) => e.type === 'FAILED_LOGIN')
      const successEvent = audit.events.find((e) => e.type === 'SUCCESSFUL_LOGIN')

      expect(failedLoginEvent.severity).toBe('high')
      expect(successEvent.severity).toBe('low')
    })

    it('should mask sensitive data in logs', () => {
      audit.logEvent('DATA_ACCESS', {
        userId,
        ipAddress,
        password: 'SecurePassword123!',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      })

      const event = audit.events[0]
      expect(event.details.password).toContain('*')
      expect(event.details.token).toContain('*')
    })

    it('should timestamp events', () => {
      const beforeTime = new Date()
      audit.logEvent('API_CALL', { userId, ipAddress })
      const afterTime = new Date()

      const event = audit.events[0]
      expect(event.timestamp.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime())
      expect(event.timestamp.getTime()).toBeLessThanOrEqual(afterTime.getTime())
    })
  })

  describe('Alert Creation', () => {
    it('should create security alert', () => {
      const alertId = audit.createAlert('BRUTE_FORCE_ATTEMPT', {
        userId,
        ipAddress,
        attempts: 5,
      })

      expect(alertId).toBeDefined()
      expect(audit.alerts.length).toBe(1)
    })

    it('should set alert severity', () => {
      audit.createAlert('BRUTE_FORCE_ATTEMPT', { userId, ipAddress })
      audit.createAlert('RATE_LIMIT_ABUSE', { ipAddress })

      const bruteForceAlert = audit.alerts.find((a) => a.type === 'BRUTE_FORCE_ATTEMPT')
      const rateLimitAlert = audit.alerts.find((a) => a.type === 'RATE_LIMIT_ABUSE')

      expect(bruteForceAlert.severity).toBe('critical')
      expect(rateLimitAlert.severity).toBe('high')
    })

    it('should mark alert as active', () => {
      audit.createAlert('BRUTE_FORCE_ATTEMPT', { userId, ipAddress })

      const alert = audit.alerts[0]
      expect(alert.status).toBe('active')
      expect(alert.acknowledged).toBe(false)
    })
  })

  describe('Suspicious Pattern Detection', () => {
    it('should detect brute force attempts', () => {
      // Simulate 5 failed login attempts
      for (let i = 0; i < 5; i++) {
        audit.logEvent('FAILED_LOGIN', { userId, ipAddress })
      }

      const alerts = audit.alerts
      const bruteForceAlert = alerts.find((a) => a.type === 'BRUTE_FORCE_ATTEMPT')

      expect(bruteForceAlert).toBeDefined()
      expect(bruteForceAlert.details.attempts).toBe(5)
    })

    it('should detect rate limit abuse', () => {
      // Simulate 101 API calls in 1 minute
      for (let i = 0; i < 101; i++) {
        audit.logEvent('API_CALL', { ipAddress })
      }

      const alerts = audit.alerts
      const rateLimitAlert = alerts.find((a) => a.type === 'RATE_LIMIT_ABUSE')

      expect(rateLimitAlert).toBeDefined()
      expect(rateLimitAlert.details.callCount).toBeGreaterThan(100)
    })

    it('should detect large data access', () => {
      audit.logEvent('DATA_ACCESS', {
        userId,
        ipAddress,
        dataSize: 2000000, // 2MB
      })

      const alerts = audit.alerts
      const largeAccessAlert = alerts.find((a) => a.type === 'LARGE_DATA_ACCESS')

      expect(largeAccessAlert).toBeDefined()
    })
  })

  describe('Event Filtering', () => {
    it('should filter events by type', () => {
      audit.logEvent('SUCCESSFUL_LOGIN', { userId, ipAddress })
      audit.logEvent('FAILED_LOGIN', { userId, ipAddress })
      audit.logEvent('API_CALL', { userId, ipAddress })

      const loginEvents = audit.getEvents({ type: 'SUCCESSFUL_LOGIN' })
      expect(loginEvents.length).toBe(1)
      expect(loginEvents[0].type).toBe('SUCCESSFUL_LOGIN')
    })

    it('should filter events by severity', () => {
      audit.logEvent('SUCCESSFUL_LOGIN', { userId, ipAddress })
      audit.logEvent('FAILED_LOGIN', { userId, ipAddress })

      const highSeverityEvents = audit.getEvents({ severity: 'high' })
      expect(highSeverityEvents.every((e) => e.severity === 'high')).toBe(true)
    })

    it('should filter events by user', () => {
      const user1 = 'user-1'
      const user2 = 'user-2'

      audit.logEvent('API_CALL', { userId: user1, ipAddress })
      audit.logEvent('API_CALL', { userId: user2, ipAddress })

      const user1Events = audit.getEvents({ userId: user1 })
      expect(user1Events.every((e) => e.userId === user1)).toBe(true)
    })

    it('should filter events by IP address', () => {
      const ip1 = '192.168.1.1'
      const ip2 = '192.168.1.2'

      audit.logEvent('API_CALL', { userId, ipAddress: ip1 })
      audit.logEvent('API_CALL', { userId, ipAddress: ip2 })

      const ip1Events = audit.getEvents({ ipAddress: ip1 })
      expect(ip1Events.every((e) => e.ipAddress === ip1)).toBe(true)
    })

    it('should filter events by date range', () => {
      const now = new Date()
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

      audit.logEvent('API_CALL', { userId, ipAddress })

      const todayEvents = audit.getEvents({
        startDate: new Date(now.getTime() - 1000),
        endDate: now,
      })

      expect(todayEvents.length).toBeGreaterThan(0)

      const tomorrowEvents = audit.getEvents({
        startDate: tomorrow,
        endDate: new Date(tomorrow.getTime() + 1000),
      })

      expect(tomorrowEvents.length).toBe(0)
    })
  })

  describe('Alert Management', () => {
    it('should acknowledge alert', () => {
      const alertId = audit.createAlert('BRUTE_FORCE_ATTEMPT', { userId, ipAddress })
      const acknowledgedAlert = audit.acknowledgeAlert(alertId, 'admin-user')

      expect(acknowledgedAlert.acknowledged).toBe(true)
      expect(acknowledgedAlert.acknowledgedBy).toBe('admin-user')
      expect(acknowledgedAlert.acknowledgedAt).toBeDefined()
    })

    it('should filter alerts by type', () => {
      audit.createAlert('BRUTE_FORCE_ATTEMPT', { userId, ipAddress })
      audit.createAlert('RATE_LIMIT_ABUSE', { ipAddress })

      const bruteForceAlerts = audit.getAlerts({ type: 'BRUTE_FORCE_ATTEMPT' })
      expect(bruteForceAlerts.length).toBe(1)
      expect(bruteForceAlerts[0].type).toBe('BRUTE_FORCE_ATTEMPT')
    })

    it('should filter alerts by severity', () => {
      audit.createAlert('BRUTE_FORCE_ATTEMPT', { userId, ipAddress }) // critical
      audit.createAlert('RATE_LIMIT_ABUSE', { ipAddress }) // high

      const criticalAlerts = audit.getAlerts({ severity: 'critical' })
      expect(criticalAlerts.every((a) => a.severity === 'critical')).toBe(true)
    })

    it('should filter alerts by status', () => {
      const alertId = audit.createAlert('BRUTE_FORCE_ATTEMPT', { userId, ipAddress })
      audit.acknowledgeAlert(alertId, 'admin')

      const activeAlerts = audit.getAlerts({ status: 'active' })
      expect(activeAlerts.every((a) => a.status === 'active')).toBe(true)
    })
  })

  describe('Security Reports', () => {
    it('should generate security report', () => {
      audit.logEvent('SUCCESSFUL_LOGIN', { userId, ipAddress })
      audit.logEvent('FAILED_LOGIN', { userId, ipAddress })
      audit.createAlert('BRUTE_FORCE_ATTEMPT', { userId, ipAddress })

      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const endDate = new Date()

      const report = audit.generateSecurityReport(startDate, endDate)

      expect(report).toBeDefined()
      expect(report.generatedAt).toBeDefined()
      expect(report.summary).toBeDefined()
      expect(report.summary.totalEvents).toBeGreaterThan(0)
      expect(report.summary.totalAlerts).toBeGreaterThan(0)
    })

    it('should include event statistics in report', () => {
      audit.logEvent('SUCCESSFUL_LOGIN', { userId, ipAddress })
      audit.logEvent('FAILED_LOGIN', { userId, ipAddress })

      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const endDate = new Date()

      const report = audit.generateSecurityReport(startDate, endDate)

      expect(report.eventsByType).toBeDefined()
      expect(report.eventsBySeverity).toBeDefined()
    })

    it('should include top users in report', () => {
      for (let i = 0; i < 5; i++) {
        audit.logEvent('API_CALL', { userId: 'user-1', ipAddress })
      }

      for (let i = 0; i < 3; i++) {
        audit.logEvent('API_CALL', { userId: 'user-2', ipAddress })
      }

      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const endDate = new Date()

      const report = audit.generateSecurityReport(startDate, endDate)

      expect(report.topUsers).toBeDefined()
      expect(report.topUsers[0].userId).toBe('user-1')
      expect(report.topUsers[0].count).toBe(5)
    })

    it('should include top IP addresses in report', () => {
      for (let i = 0; i < 5; i++) {
        audit.logEvent('API_CALL', { userId, ipAddress: '192.168.1.1' })
      }

      for (let i = 0; i < 3; i++) {
        audit.logEvent('API_CALL', { userId, ipAddress: '192.168.1.2' })
      }

      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const endDate = new Date()

      const report = audit.generateSecurityReport(startDate, endDate)

      expect(report.topIPAddresses).toBeDefined()
      expect(report.topIPAddresses[0].ipAddress).toBe('192.168.1.1')
      expect(report.topIPAddresses[0].count).toBe(5)
    })
  })

  describe('Data Masking', () => {
    it('should mask sensitive fields', () => {
      const data = {
        password: 'SecurePassword123!',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        email: 'user@example.com',
      }

      const masked = audit.maskSensitiveData(data)

      expect(masked.password).toContain('*')
      expect(masked.token).toContain('*')
      expect(masked.email).toBe(data.email) // Not masked
    })
  })

  describe('Export Audit Log', () => {
    it('should export audit log as JSON', () => {
      audit.logEvent('API_CALL', { userId, ipAddress })

      const result = audit.exportAuditLog('json')

      expect(result.success).toBe(true)
      expect(result.filepath).toBeDefined()
    })

    it('should export audit log as CSV', () => {
      audit.logEvent('API_CALL', { userId, ipAddress })

      const result = audit.exportAuditLog('csv')

      expect(result.success).toBe(true)
      expect(result.filepath).toBeDefined()
    })
  })
})

