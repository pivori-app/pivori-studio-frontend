# PIVORI Studio v2.0 - Security Guide

Comprehensive security documentation for PIVORI Studio.

## Table of Contents

1. [Security Overview](#security-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [Data Protection](#data-protection)
4. [API Security](#api-security)
5. [Infrastructure Security](#infrastructure-security)
6. [Monitoring & Audit](#monitoring--audit)
7. [Incident Response](#incident-response)
8. [Compliance](#compliance)

---

## Security Overview

PIVORI Studio implements a comprehensive security framework covering:

- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Role-based access control (RBAC)
- **Encryption**: AES-256-GCM for data at rest
- **Transport Security**: HTTPS/TLS 1.3+
- **Secrets Management**: Encrypted secrets with rotation
- **Audit Logging**: Complete audit trail of all security events
- **Monitoring**: Real-time threat detection and alerting

---

## Authentication & Authorization

### JWT Tokens

#### Token Structure

```javascript
{
  "sub": "user-id",
  "email": "user@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234571490,
  "iss": "pivori-studio",
  "aud": "pivori-users"
}
```

#### Token Expiry

- **Access Token**: 1 hour
- **Refresh Token**: 7 days
- **Session**: 24 hours

#### Token Rotation

```javascript
// Refresh token endpoint
POST /api/auth/refresh
{
  "refreshToken": "..."
}

// Response
{
  "accessToken": "new-token",
  "refreshToken": "new-refresh-token",
  "expiresIn": 3600
}
```

### Password Requirements

Passwords must meet these criteria:

- **Minimum Length**: 12 characters
- **Uppercase**: At least one A-Z
- **Lowercase**: At least one a-z
- **Numbers**: At least one 0-9
- **Special Characters**: At least one !@#$%^&*

### Multi-Factor Authentication (MFA)

#### Setup 2FA

```javascript
// Generate 2FA code
POST /api/auth/2fa/setup
{
  "userId": "user-id"
}

// Response
{
  "qrCode": "data:image/png;base64,...",
  "secret": "JBSWY3DPEBLW64TMMQ======"
}
```

#### Verify 2FA

```javascript
POST /api/auth/2fa/verify
{
  "code": "123456"
}
```

### Session Management

#### Create Session

```javascript
// Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}

// Response
{
  "sessionId": "session-id",
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token",
  "expiresIn": 3600
}
```

#### Revoke Session

```javascript
POST /api/auth/logout
{
  "sessionId": "session-id"
}
```

#### Revoke All Sessions

```javascript
POST /api/auth/logout-all
```

---

## Data Protection

### Encryption at Rest

#### Field-Level Encryption

Sensitive fields are encrypted using AES-256-GCM:

```javascript
// Encrypted fields
- password_hash (bcrypt)
- api_keys
- oauth_tokens
- payment_information
- personal_data
```

#### Encryption Process

```javascript
import encryption from './security/encryption.js'

// Encrypt
const encrypted = encryption.encryptField(sensitiveData)

// Decrypt
const decrypted = encryption.decryptField(encrypted)
```

### Encryption in Transit

#### HTTPS/TLS

- **Minimum Version**: TLS 1.3
- **Cipher Suites**: Only strong ciphers
- **HSTS**: Enabled with 1-year max-age
- **Certificate**: Valid and auto-renewed

#### HTTPS Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

### Password Hashing

Passwords are hashed using bcrypt with cost factor 12:

```javascript
import auth from './security/auth.js'

// Hash password
const hash = await auth.hashPassword(password)

// Verify password
const isValid = await auth.comparePassword(password, hash)
```

---

## API Security

### Rate Limiting

```javascript
// Rate limits
- Per IP: 100 requests per 15 minutes
- Per User: 1000 requests per 15 minutes
- Per Endpoint: Specific limits for sensitive endpoints

// Response headers
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

### CORS Configuration

```javascript
// Allowed origins
- http://localhost:5173 (development)
- https://pivori-studio.vercel.app (production)
- https://your-domain.com (custom domain)

// Allowed methods
- GET, POST, PUT, DELETE, PATCH, OPTIONS

// Allowed headers
- Content-Type
- Authorization
- X-CSRF-Token
```

### Input Validation

All inputs are validated and sanitized:

```javascript
// Validation rules
- Email: RFC 5322 compliant
- URL: Valid URL format
- Phone: E.164 format
- Date: ISO 8601 format
- Numbers: Min/max range checks
- Strings: Length and character restrictions
```

### SQL Injection Prevention

- **Parameterized Queries**: All database queries use parameterized statements
- **ORM**: Supabase ORM prevents SQL injection
- **Input Sanitization**: All inputs are sanitized

### CSRF Protection

```javascript
// Generate CSRF token
GET /api/csrf-token

// Response
{
  "token": "csrf-token-value"
}

// Use in requests
POST /api/endpoint
X-CSRF-Token: csrf-token-value
```

---

## Infrastructure Security

### Network Security

#### Firewall Rules

```
- Allow HTTPS (443) from anywhere
- Allow HTTP (80) from anywhere (redirect to HTTPS)
- Allow SSH (22) from specific IPs only
- Allow database (5432) from backend only
- Deny all other traffic
```

#### VPN Access

- SSH access requires VPN
- Database access requires VPN
- Admin panel requires VPN

### Database Security

#### Access Control

- **Users**: Limited to necessary permissions
- **Roles**: Separate roles for different functions
- **Row Level Security**: Enforced at database level
- **Column Encryption**: Sensitive columns encrypted

#### Backup Security

- **Frequency**: Daily automated backups
- **Encryption**: Backups encrypted at rest
- **Retention**: 30-day retention policy
- **Testing**: Monthly restore tests

### Secrets Management

#### Secret Storage

Secrets are stored encrypted using AES-256-GCM:

```javascript
import secrets from './security/secrets.js'

// Store secret
secrets.storeSecret('api-key', 'secret-value', {
  userId: 'admin',
  expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
})

// Retrieve secret
const secret = secrets.getSecret('api-key', 'user-id')

// Rotate secret
secrets.rotateSecret('api-key', 'new-secret-value', 'user-id')
```

#### Secret Rotation

- **Frequency**: Every 30 days
- **Automatic**: Scheduled rotation
- **Manual**: On-demand rotation
- **Audit**: All rotations logged

---

## Monitoring & Audit

### Security Events

All security events are logged:

```javascript
import audit from './security/audit.js'

// Log event
audit.logEvent('FAILED_LOGIN', {
  userId: 'user-id',
  ipAddress: '192.168.1.1',
  userAgent: 'Mozilla/5.0...'
})
```

#### Event Types

- `SUCCESSFUL_LOGIN`: User logged in
- `FAILED_LOGIN`: Login attempt failed
- `UNAUTHORIZED_ACCESS`: Access denied
- `DATA_ACCESS`: Data accessed
- `DATA_MODIFICATION`: Data modified
- `API_ERROR`: API error occurred
- `RATE_LIMIT_EXCEEDED`: Rate limit exceeded

### Threat Detection

#### Suspicious Patterns

- **Brute Force**: 5+ failed logins in 15 minutes
- **Rate Limit Abuse**: 100+ requests per minute
- **Unusual Activity**: Access from new IP/location
- **Large Data Access**: Accessing >1MB of data

#### Alerts

```javascript
// Create alert
audit.createAlert('BRUTE_FORCE_ATTEMPT', {
  userId: 'user-id',
  ipAddress: '192.168.1.1',
  attempts: 5
})

// Get alerts
const alerts = audit.getAlerts({ severity: 'critical' })

// Acknowledge alert
audit.acknowledgeAlert('alert-id', 'admin-id')
```

### Audit Reports

```javascript
// Generate security report
const report = audit.generateSecurityReport(
  new Date('2024-01-01'),
  new Date('2024-01-31')
)

// Export audit log
audit.exportAuditLog('json')
audit.exportAuditLog('csv')
```

---

## Incident Response

### Security Incident Procedure

#### 1. Detection

- Monitor security alerts
- Review audit logs
- Analyze suspicious patterns

#### 2. Assessment

- Determine incident severity
- Identify affected systems
- Estimate impact

#### 3. Containment

- Revoke compromised credentials
- Block suspicious IPs
- Disable affected accounts

#### 4. Eradication

- Remove malware/backdoors
- Patch vulnerabilities
- Update security rules

#### 5. Recovery

- Restore from backups
- Verify system integrity
- Resume normal operations

#### 6. Post-Incident

- Document incident
- Notify affected users
- Update security measures
- Conduct post-mortem

### Incident Contact

- **Security Team**: security@pivori.com
- **Incident Hotline**: +1-XXX-XXX-XXXX
- **Emergency**: emergency@pivori.com

---

## Compliance

### GDPR Compliance

- **Data Processing**: Only necessary data collected
- **User Consent**: Explicit consent for data processing
- **Data Rights**: Users can access/delete their data
- **Data Breach**: 72-hour notification requirement
- **DPA**: Data Processing Agreement in place

### SOC 2 Compliance

- **Security**: Comprehensive security controls
- **Availability**: 99.9% uptime SLA
- **Processing Integrity**: Data accuracy and completeness
- **Confidentiality**: Data encryption and access controls
- **Privacy**: User privacy protection

### Security Standards

- **OWASP Top 10**: Addressed all vulnerabilities
- **CWE**: Common Weakness Enumeration compliance
- **NIST**: NIST Cybersecurity Framework alignment
- **ISO 27001**: Information security management

---

## Security Checklist

### Development

- [ ] Use HTTPS for all communications
- [ ] Validate all inputs
- [ ] Use parameterized queries
- [ ] Hash passwords with bcrypt
- [ ] Implement rate limiting
- [ ] Use CSRF tokens
- [ ] Log security events
- [ ] Encrypt sensitive data

### Deployment

- [ ] Enable HTTPS/TLS 1.3+
- [ ] Configure firewall rules
- [ ] Setup VPN access
- [ ] Enable audit logging
- [ ] Configure backups
- [ ] Setup monitoring
- [ ] Enable 2FA for admins
- [ ] Rotate secrets

### Operations

- [ ] Monitor security alerts
- [ ] Review audit logs weekly
- [ ] Rotate secrets monthly
- [ ] Update dependencies
- [ ] Patch vulnerabilities
- [ ] Test incident response
- [ ] Conduct security training
- [ ] Perform penetration testing

---

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Security Headers](https://securityheaders.com/)
- [SSL Labs](https://www.ssllabs.com/)

---

## Support

For security issues:
1. Email: security@pivori.com
2. Do not disclose publicly
3. Allow 48 hours for response
4. Follow responsible disclosure

---

**Last Updated**: November 2024
**Version**: 2.0.0

