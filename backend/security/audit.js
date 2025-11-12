import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

/**
 * Security Audit & Monitoring System
 * Tracks security events and generates alerts
 */

class AuditManager {
  constructor() {
    this.events = []
    this.alerts = []
    this.suspiciousPatterns = new Map()
    this.logPath = path.join(process.cwd(), 'logs', 'audit.log')
    this.alertThresholds = {
      failedLoginAttempts: 5,
      failedLoginWindow: 15 * 60 * 1000, // 15 minutes
      suspiciousActivityThreshold: 10,
      rateLimitThreshold: 100,
    }
  }

  /**
   * Log security event
   */
  logEvent(eventType, details = {}) {
    try {
      const event = {
        id: crypto.randomBytes(8).toString('hex'),
        timestamp: new Date(),
        type: eventType,
        severity: this.getEventSeverity(eventType),
        details: this.maskSensitiveData(details),
        userId: details.userId || 'unknown',
        ipAddress: details.ipAddress || 'unknown',
        userAgent: details.userAgent || 'unknown',
      }

      this.events.push(event)
      this.writeToLog(event)

      // Check for suspicious patterns
      this.checkSuspiciousPatterns(event)

      return event.id
    } catch (error) {
      console.error('Failed to log event:', error)
    }
  }

  /**
   * Get event severity
   */
  getEventSeverity(eventType) {
    const severityMap = {
      // Critical
      UNAUTHORIZED_ACCESS: 'critical',
      PRIVILEGE_ESCALATION: 'critical',
      DATA_BREACH: 'critical',
      ENCRYPTION_FAILURE: 'critical',

      // High
      FAILED_LOGIN: 'high',
      INVALID_TOKEN: 'high',
      PERMISSION_DENIED: 'high',
      RATE_LIMIT_EXCEEDED: 'high',

      // Medium
      SUSPICIOUS_ACTIVITY: 'medium',
      CONFIG_CHANGE: 'medium',
      API_ERROR: 'medium',

      // Low
      SUCCESSFUL_LOGIN: 'low',
      DATA_ACCESS: 'low',
      API_CALL: 'low',
    }

    return severityMap[eventType] || 'medium'
  }

  /**
   * Check for suspicious patterns
   */
  checkSuspiciousPatterns(event) {
    try {
      // Pattern 1: Multiple failed login attempts
      if (event.type === 'FAILED_LOGIN') {
        const key = `failed_login_${event.userId}_${event.ipAddress}`
        const attempts = this.suspiciousPatterns.get(key) || []

        attempts.push(event.timestamp)

        // Keep only recent attempts
        const recentAttempts = attempts.filter(
          (time) => Date.now() - time < this.alertThresholds.failedLoginWindow
        )

        if (recentAttempts.length >= this.alertThresholds.failedLoginAttempts) {
          this.createAlert('BRUTE_FORCE_ATTEMPT', {
            userId: event.userId,
            ipAddress: event.ipAddress,
            attempts: recentAttempts.length,
          })
        }

        this.suspiciousPatterns.set(key, recentAttempts)
      }

      // Pattern 2: Unusual activity from IP
      if (event.type === 'API_CALL') {
        const key = `api_calls_${event.ipAddress}`
        const calls = this.suspiciousPatterns.get(key) || []

        calls.push(event.timestamp)

        // Keep only recent calls
        const recentCalls = calls.filter(
          (time) => Date.now() - time < 60 * 1000 // 1 minute
        )

        if (recentCalls.length > this.alertThresholds.rateLimitThreshold) {
          this.createAlert('RATE_LIMIT_ABUSE', {
            ipAddress: event.ipAddress,
            callCount: recentCalls.length,
          })
        }

        this.suspiciousPatterns.set(key, recentCalls)
      }

      // Pattern 3: Unusual data access
      if (event.type === 'DATA_ACCESS' && event.details.dataSize > 1000000) {
        this.createAlert('LARGE_DATA_ACCESS', {
          userId: event.userId,
          dataSize: event.details.dataSize,
        })
      }
    } catch (error) {
      console.error('Pattern detection failed:', error)
    }
  }

  /**
   * Create security alert
   */
  createAlert(alertType, details = {}) {
    try {
      const alert = {
        id: crypto.randomBytes(8).toString('hex'),
        timestamp: new Date(),
        type: alertType,
        severity: this.getAlertSeverity(alertType),
        details,
        status: 'active',
        acknowledged: false,
      }

      this.alerts.push(alert)

      // Log alert
      console.warn(`🚨 SECURITY ALERT: ${alertType}`, details)

      // Send notification (implement based on your needs)
      this.notifySecurityTeam(alert)

      return alert.id
    } catch (error) {
      console.error('Failed to create alert:', error)
    }
  }

  /**
   * Get alert severity
   */
  getAlertSeverity(alertType) {
    const severityMap = {
      BRUTE_FORCE_ATTEMPT: 'critical',
      RATE_LIMIT_ABUSE: 'high',
      LARGE_DATA_ACCESS: 'high',
      UNAUTHORIZED_ACCESS: 'critical',
      DATA_BREACH: 'critical',
    }

    return severityMap[alertType] || 'medium'
  }

  /**
   * Notify security team
   */
  notifySecurityTeam(alert) {
    try {
      // Implement based on your notification system
      // Examples: Email, Slack, PagerDuty, etc.

      if (alert.severity === 'critical') {
        console.error(`CRITICAL ALERT: ${alert.type}`, alert.details)
        // Send immediate notification
      }
    } catch (error) {
      console.error('Failed to notify security team:', error)
    }
  }

  /**
   * Write event to log file
   */
  writeToLog(event) {
    try {
      const logDir = path.dirname(this.logPath)

      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true })
      }

      const logEntry = JSON.stringify(event) + '\n'
      fs.appendFileSync(this.logPath, logEntry)
    } catch (error) {
      console.error('Failed to write to log file:', error)
    }
  }

  /**
   * Get events with filters
   */
  getEvents(filters = {}) {
    let events = this.events

    if (filters.type) {
      events = events.filter((e) => e.type === filters.type)
    }

    if (filters.severity) {
      events = events.filter((e) => e.severity === filters.severity)
    }

    if (filters.userId) {
      events = events.filter((e) => e.userId === filters.userId)
    }

    if (filters.ipAddress) {
      events = events.filter((e) => e.ipAddress === filters.ipAddress)
    }

    if (filters.startDate) {
      events = events.filter((e) => e.timestamp >= filters.startDate)
    }

    if (filters.endDate) {
      events = events.filter((e) => e.timestamp <= filters.endDate)
    }

    // Sort by timestamp descending
    events.sort((a, b) => b.timestamp - a.timestamp)

    return events
  }

  /**
   * Get alerts with filters
   */
  getAlerts(filters = {}) {
    let alerts = this.alerts

    if (filters.type) {
      alerts = alerts.filter((a) => a.type === filters.type)
    }

    if (filters.severity) {
      alerts = alerts.filter((a) => a.severity === filters.severity)
    }

    if (filters.status) {
      alerts = alerts.filter((a) => a.status === filters.status)
    }

    // Sort by timestamp descending
    alerts.sort((a, b) => b.timestamp - a.timestamp)

    return alerts
  }

  /**
   * Acknowledge alert
   */
  acknowledgeAlert(alertId, acknowledgedBy = 'system') {
    try {
      const alert = this.alerts.find((a) => a.id === alertId)

      if (!alert) {
        throw new Error('Alert not found')
      }

      alert.acknowledged = true
      alert.acknowledgedBy = acknowledgedBy
      alert.acknowledgedAt = new Date()

      return alert
    } catch (error) {
      console.error('Failed to acknowledge alert:', error)
      throw error
    }
  }

  /**
   * Generate security report
   */
  generateSecurityReport(startDate, endDate) {
    try {
      const events = this.getEvents({ startDate, endDate })
      const alerts = this.getAlerts()

      const report = {
        generatedAt: new Date(),
        period: { startDate, endDate },
        summary: {
          totalEvents: events.length,
          totalAlerts: alerts.length,
          criticalAlerts: alerts.filter((a) => a.severity === 'critical').length,
          highAlerts: alerts.filter((a) => a.severity === 'high').length,
        },
        eventsByType: this.groupBy(events, 'type'),
        eventsBySeverity: this.groupBy(events, 'severity'),
        topUsers: this.getTopUsers(events),
        topIPAddresses: this.getTopIPAddresses(events),
        alerts,
      }

      return report
    } catch (error) {
      console.error('Failed to generate security report:', error)
      throw error
    }
  }

  /**
   * Group events by field
   */
  groupBy(events, field) {
    return events.reduce((acc, event) => {
      const key = event[field]
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})
  }

  /**
   * Get top users by event count
   */
  getTopUsers(events, limit = 10) {
    const userCounts = this.groupBy(events, 'userId')
    return Object.entries(userCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([userId, count]) => ({ userId, count }))
  }

  /**
   * Get top IP addresses by event count
   */
  getTopIPAddresses(events, limit = 10) {
    const ipCounts = this.groupBy(events, 'ipAddress')
    return Object.entries(ipCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([ipAddress, count]) => ({ ipAddress, count }))
  }

  /**
   * Mask sensitive data for logging
   */
  maskSensitiveData(data) {
    const masked = { ...data }
    const sensitiveFields = ['password', 'token', 'key', 'secret', 'apiKey']

    sensitiveFields.forEach((field) => {
      if (masked[field]) {
        const value = String(masked[field])
        masked[field] = value.substring(0, 3) + '*'.repeat(Math.max(0, value.length - 6)) + value.substring(value.length - 3)
      }
    })

    return masked
  }

  /**
   * Export audit log
   */
  exportAuditLog(format = 'json') {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `audit-export-${timestamp}.${format}`
      const filepath = path.join(process.cwd(), 'exports', filename)

      if (!fs.existsSync(path.dirname(filepath))) {
        fs.mkdirSync(path.dirname(filepath), { recursive: true })
      }

      if (format === 'json') {
        fs.writeFileSync(filepath, JSON.stringify(this.events, null, 2))
      } else if (format === 'csv') {
        const csv = this.convertToCSV(this.events)
        fs.writeFileSync(filepath, csv)
      }

      return { success: true, filepath }
    } catch (error) {
      console.error('Failed to export audit log:', error)
      throw error
    }
  }

  /**
   * Convert events to CSV
   */
  convertToCSV(events) {
    const headers = ['ID', 'Timestamp', 'Type', 'Severity', 'User ID', 'IP Address']
    const rows = events.map((e) => [
      e.id,
      e.timestamp,
      e.type,
      e.severity,
      e.userId,
      e.ipAddress,
    ])

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n')
    return csv
  }
}

export default new AuditManager()

