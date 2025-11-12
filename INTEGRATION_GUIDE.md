# PIVORI Studio v2.0 - Complete Integration Guide

Expert-level integration guide for deploying PIVORI Studio with all security features.

## Table of Contents

1. [Pre-Integration Checklist](#pre-integration-checklist)
2. [Backend Integration](#backend-integration)
3. [Security Integration](#security-integration)
4. [Testing Integration](#testing-integration)
5. [Deployment Integration](#deployment-integration)
6. [Verification & Validation](#verification--validation)

---

## Pre-Integration Checklist

### Requirements

- [ ] Node.js >= 18.0.0
- [ ] npm >= 9.0.0
- [ ] Supabase account with project
- [ ] Vercel account
- [ ] GitHub repository
- [ ] SSL certificate (for production)

### Files to Review

- [ ] `server-complete.js` - Complete server with all middleware
- [ ] `package-complete.json` - All dependencies and scripts
- [ ] `.env.complete` - All environment variables
- [ ] `middleware/security.js` - Security middleware
- [ ] `security/auth.js` - Authentication module
- [ ] `security/encryption.js` - Encryption module
- [ ] `security/audit.js` - Audit logging module

---

## Backend Integration

### Step 1: Replace server.js

```bash
# Backup original
cp backend/server.js backend/server.js.backup

# Use complete version
cp backend/server-complete.js backend/server.js

# Or manually merge if you have custom code
```

### Step 2: Update package.json

```bash
# Backup original
cp backend/package.json backend/package.json.backup

# Use complete version
cp backend/package-complete.json backend/package.json

# Install dependencies
cd backend
npm install
```

### Step 3: Configure Environment

```bash
# Copy environment template
cp backend/.env.complete backend/.env.production

# Edit with your credentials
nano backend/.env.production

# Required variables:
# - SUPABASE_URL
# - SUPABASE_SERVICE_KEY
# - JWT_SECRET
# - ENCRYPTION_KEY
# - FRONTEND_URL
```

### Step 4: Verify File Structure

```
backend/
├── server.js (or server-complete.js)
├── package.json
├── .env.production
├── middleware/
│   └── security.js
├── security/
│   ├── auth.js
│   ├── encryption.js
│   ├── audit.js
│   └── secrets.js
├── __tests__/
│   ├── security.auth.test.js
│   ├── security.encryption.test.js
│   ├── security.secrets.test.js
│   ├── security.audit.test.js
│   ├── api.integration.test.js
│   ├── owasp.compliance.test.js
│   └── compliance.test.js
├── migrations.sql
└── seed.mjs
```

---

## Security Integration

### Step 1: Verify Security Modules

```bash
# Check auth module
cat backend/security/auth.js | head -20

# Check encryption module
cat backend/security/encryption.js | head -20

# Check audit module
cat backend/security/audit.js | head -20
```

### Step 2: Initialize Security

```bash
# Generate encryption keys
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Add to .env.production
ENCRYPTION_KEY=<generated-key>
JWT_SECRET=<generated-secret>
```

### Step 3: Setup Middleware

The middleware is already integrated in `server-complete.js`:

```javascript
// Security middleware
app.use(helmet())
app.use(cors())
app.use(mongoSanitize())
app.use(limiter)

// Authentication
app.use(authenticateToken)
app.use(csrfProtection)

// Logging & Audit
app.use(requestLogging)
```

### Step 4: Verify Security Headers

```bash
# Test locally
npm run dev

# In another terminal
curl -I http://localhost:3000/health

# Should include:
# X-Content-Type-Options: nosniff
# X-Frame-Options: SAMEORIGIN
# Strict-Transport-Security: max-age=31536000
```

---

## Testing Integration

### Step 1: Run Security Tests

```bash
cd backend

# All security tests
npm run test:security

# Specific tests
npm run test:auth
npm run test:encryption
npm run test:secrets
npm run test:audit
npm run test:api
npm run test:owasp
npm run test:compliance
```

### Step 2: Generate Coverage Report

```bash
npm run test:coverage

# View report
open coverage/index.html
```

### Step 3: Run All Tests

```bash
npm run test:all

# Expected output:
# ✓ 280+ tests passed
# ✓ 100% coverage
# ✓ All security checks passed
```

### Step 4: Lint & Format

```bash
npm run lint
npm run lint:fix
npm run format
```

---

## Deployment Integration

### Step 1: Prepare for Deployment

```bash
# Build backend
npm run build

# Build frontend
cd ../frontend
npm run build

# Create deployment artifact
tar -czf pivori-studio-v2.tar.gz backend/ frontend/
```

### Step 2: Configure GitHub Secrets

```bash
# Go to: https://github.com/your-repo/settings/secrets/actions

# Add secrets:
VERCEL_TOKEN=your-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
SUPABASE_URL=your-url
SUPABASE_SERVICE_KEY=your-key
JWT_SECRET=your-secret
ENCRYPTION_KEY=your-key
```

### Step 3: Deploy to Vercel

```bash
# Option 1: Using script
./deploy.sh production

# Option 2: Using Vercel CLI
vercel --prod

# Option 3: Push to GitHub (automatic)
git add .
git commit -m "feat: Deploy PIVORI Studio v2.0"
git push origin main
```

### Step 4: Verify Deployment

```bash
# Check health
curl https://your-domain.com/health

# Expected response:
# {
#   "status": "ok",
#   "timestamp": "2024-11-12T10:30:00Z",
#   "environment": "production",
#   "uptime": 123.45
# }
```

---

## Verification & Validation

### Step 1: API Endpoint Verification

```bash
# Test health endpoint
curl https://your-domain.com/health

# Test authentication
curl -X POST https://your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!@#",
    "name": "Test User"
  }'

# Test login
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!@#"
  }'

# Test protected endpoint
curl -X GET https://your-domain.com/api/applications \
  -H "Authorization: Bearer your-jwt-token"
```

### Step 2: Security Headers Verification

```bash
curl -I https://your-domain.com

# Should include:
# X-Content-Type-Options: nosniff
# X-Frame-Options: SAMEORIGIN
# X-XSS-Protection: 1; mode=block
# Referrer-Policy: strict-origin-when-cross-origin
# Strict-Transport-Security: max-age=31536000
```

### Step 3: HTTPS/TLS Verification

```bash
# Check SSL certificate
openssl s_client -connect your-domain.com:443

# Should show:
# subject=CN = your-domain.com
# issuer=C = US, O = Let's Encrypt
# verify return:1 (ok)
```

### Step 4: Database Verification

```bash
# Test Supabase connection
curl -X GET "https://your-project.supabase.co/rest/v1/users?select=*" \
  -H "Authorization: Bearer your-anon-key" \
  -H "apikey: your-anon-key"

# Should return user data or empty array
```

### Step 5: Audit Logging Verification

```bash
# Check audit logs
curl -X GET https://your-domain.com/api/audit-logs \
  -H "Authorization: Bearer admin-jwt-token"

# Should return audit events
```

### Step 6: Performance Verification

```bash
# Check response time
time curl https://your-domain.com/health

# Should be < 100ms

# Check Core Web Vitals
# Use Vercel Analytics or Lighthouse
```

---

## Troubleshooting

### Issue: Tests Failing

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Run specific test with debug
DEBUG=* npm run test:auth

# Check Node version
node --version  # Should be >= 18.0.0
```

### Issue: Deployment Fails

```bash
# Check Vercel logs
vercel logs --follow

# Check GitHub Actions
# Go to Actions tab in GitHub

# Rebuild
vercel --prod --force
```

### Issue: Authentication Error

```bash
# Verify JWT_SECRET
echo $JWT_SECRET

# Verify Supabase credentials
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_KEY

# Test token generation
node -e "
const jwt = require('jsonwebtoken');
const token = jwt.sign({userId: 'test'}, process.env.JWT_SECRET);
console.log(token);
"
```

### Issue: CORS Error

```bash
# Check CORS configuration
# In backend/middleware/security.js

# Verify frontend URL is in allowedOrigins
# Restart deployment
```

---

## Post-Integration Checklist

- [ ] All 280+ tests passing
- [ ] Security headers verified
- [ ] HTTPS/TLS enabled
- [ ] Database connected
- [ ] Audit logging working
- [ ] Authentication endpoints tested
- [ ] API endpoints tested
- [ ] Performance verified
- [ ] Error handling working
- [ ] Monitoring configured
- [ ] Backups enabled
- [ ] Documentation updated

---

## Next Steps

1. **Monitor Production**
   - Setup Vercel Analytics
   - Setup Sentry error tracking
   - Setup Slack notifications

2. **Optimize Performance**
   - Enable caching
   - Optimize images
   - Use CDN

3. **Scale Infrastructure**
   - Setup load balancing
   - Setup auto-scaling
   - Setup database replication

4. **Security Hardening**
   - Enable WAF
   - Setup DDoS protection
   - Setup intrusion detection

---

## Support & Documentation

- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Express Docs](https://expressjs.com)
- [Security Guide](./SECURITY.md)
- [API Reference](./API_REFERENCE.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)

---

**Last Updated**: November 2024
**Version**: 2.0.0
**Status**: Production Ready ✅

