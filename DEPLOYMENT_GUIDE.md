# PIVORI Studio v2.0 - Complete Deployment Guide

Comprehensive guide for deploying PIVORI Studio to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Supabase Configuration](#supabase-configuration)
4. [GitHub Setup](#github-setup)
5. [Vercel Deployment](#vercel-deployment)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Pre-Deployment Checklist

### Security

- [ ] All security tests passing (280+ test cases)
- [ ] No vulnerabilities in npm audit
- [ ] OWASP Top 10 compliance verified
- [ ] GDPR/SOC 2 requirements met
- [ ] Encryption keys generated and secured
- [ ] JWT secrets configured
- [ ] Environment variables secured

### Code Quality

- [ ] ESLint passing
- [ ] Code formatting verified
- [ ] No console.log statements in production code
- [ ] Error handling implemented
- [ ] Logging configured

### Documentation

- [ ] README updated
- [ ] API documentation complete
- [ ] Deployment guide reviewed
- [ ] Security guide reviewed
- [ ] CHANGELOG updated

### Testing

- [ ] All unit tests passing
- [ ] Integration tests passing
- [ ] Security tests passing
- [ ] Manual testing completed
- [ ] Performance testing completed

---

## Environment Setup

### 1. Create GitHub Repository

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: PIVORI Studio v2.0"

# Create repository on GitHub
# Then push
git remote add origin https://github.com/your-username/pivori-studio-v2.git
git branch -M main
git push -u origin main
```

### 2. Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Create new team (optional)
4. Note your:
   - Vercel Token
   - Org ID
   - Project ID

### 3. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Note your:
   - Project URL
   - Anon Key
   - Service Role Key

---

## Supabase Configuration

### 1. Run Migrations

```bash
# Using Supabase CLI
supabase link --project-ref your-project-ref
supabase db push

# Or manually in Supabase SQL Editor
# Copy content of backend/migrations.sql and run
```

### 2. Enable Authentication

1. Go to Supabase Dashboard → Authentication
2. Enable Email/Password
3. Enable OAuth providers (Google, GitHub)
4. Configure email templates

### 3. Setup Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE connectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
```

### 4. Create Service Role

1. Go to Settings → API
2. Create new service role
3. Copy service role key

---

## GitHub Setup

### 1. Create GitHub Secrets

Go to Settings → Secrets and variables → Actions

Add the following secrets:

```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
VERCEL_PROJECT_ID_STAGING=your-staging-project-id

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
REFRESH_TOKEN_SECRET=your-refresh-token-secret

SLACK_WEBHOOK=your-slack-webhook-url
MAIL_SERVER=your-mail-server
MAIL_PORT=your-mail-port
MAIL_USERNAME=your-mail-username
MAIL_PASSWORD=your-mail-password
MAIL_FROM=noreply@pivori.com
MAIL_TO=team@pivori.com
```

### 2. Generate Secrets

```bash
# Generate JWT Secret
openssl rand -base64 32

# Generate Encryption Key
openssl rand -hex 32

# Generate Refresh Token Secret
openssl rand -base64 32
```

### 3. Enable GitHub Actions

1. Go to Actions tab
2. Enable GitHub Actions
3. Review workflow file: `.github/workflows/security-tests.yml`

---

## Vercel Deployment

### 1. Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select GitHub repository
4. Configure project settings

### 2. Set Environment Variables

In Vercel Dashboard → Settings → Environment Variables

Add:

```
VITE_API_URL=https://api.your-domain.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

NODE_ENV=production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-jwt-secret
```

### 3. Configure Build Settings

**Frontend:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm ci`

**Backend:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm ci`

### 4. Deploy

```bash
# Option 1: Push to GitHub (automatic)
git push origin main

# Option 2: Deploy via Vercel CLI
vercel --prod
```

### 5. Configure Custom Domain

1. Go to Vercel Dashboard → Settings → Domains
2. Add custom domain
3. Update DNS records
4. Wait for SSL certificate

---

## Post-Deployment Verification

### 1. Verify Deployment

```bash
# Check API health
curl https://api.your-domain.com/health

# Expected response:
# {"status":"ok","timestamp":"2024-11-12T10:30:00Z"}
```

### 2. Run Security Tests

```bash
# All tests should pass
npm run test:security

# Check coverage
npm run test:coverage
```

### 3. Verify Environment Variables

```bash
# Check backend
echo $SUPABASE_URL
echo $JWT_SECRET

# Check frontend
echo $VITE_SUPABASE_URL
echo $VITE_API_URL
```

### 4. Test Authentication

```bash
# Register
curl -X POST https://api.your-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!@#",
    "name": "Test User"
  }'

# Login
curl -X POST https://api.your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!@#"
  }'
```

### 5. Verify HTTPS

```bash
# Check SSL certificate
curl -I https://api.your-domain.com

# Should show:
# HTTP/2 200
# Strict-Transport-Security: max-age=31536000
```

### 6. Check Security Headers

```bash
curl -I https://api.your-domain.com

# Should include:
# X-Content-Type-Options: nosniff
# X-Frame-Options: SAMEORIGIN
# Content-Security-Policy: ...
# Strict-Transport-Security: ...
```

---

## Monitoring & Maintenance

### 1. Setup Monitoring

#### Vercel Analytics

1. Go to Vercel Dashboard → Analytics
2. Enable Web Analytics
3. Monitor performance metrics

#### Sentry (Error Tracking)

```bash
npm install @sentry/node

# Configure in backend
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
})
```

### 2. Setup Logging

```bash
# View logs
vercel logs

# Follow logs
vercel logs --follow
```

### 3. Database Backups

```bash
# Supabase automatic backups
# Go to Settings → Backups
# Enable daily backups
# Set retention to 30 days
```

### 4. Security Monitoring

```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Check outdated packages
npm outdated
```

### 5. Performance Optimization

- Monitor Core Web Vitals
- Optimize images
- Enable caching
- Minify assets
- Use CDN

### 6. Scheduled Tasks

```bash
# Daily security scan
0 2 * * * npm run test:security

# Weekly dependency check
0 3 * * 0 npm audit

# Monthly penetration testing
0 4 1 * * ./run-pentest.sh
```

---

## Rollback Procedure

If deployment fails:

```bash
# Option 1: Revert to previous commit
git revert HEAD
git push origin main

# Option 2: Rollback in Vercel
# Go to Deployments → Select previous deployment → Promote to Production

# Option 3: Use checkpoint
webdev_rollback_checkpoint version_id
```

---

## Troubleshooting

### Issue: Tests Failing

```bash
# Check Node version
node --version  # Should be >= 18.0.0

# Clear cache
rm -rf node_modules package-lock.json
npm install

# Run tests with debug
DEBUG=* npm test
```

### Issue: Deployment Stuck

```bash
# Check Vercel logs
vercel logs --follow

# Rebuild
vercel --prod --force
```

### Issue: Database Connection Error

```bash
# Verify credentials
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_KEY

# Test connection
psql $SUPABASE_URL
```

### Issue: CORS Error

```bash
# Check CORS configuration
# In backend/middleware/security.js

# Verify frontend URL is in allowedOrigins
# Restart deployment
```

---

## Production Checklist

- [ ] All tests passing
- [ ] Security headers configured
- [ ] HTTPS enabled
- [ ] SSL certificate valid
- [ ] Database backups enabled
- [ ] Monitoring configured
- [ ] Logging configured
- [ ] Error tracking enabled
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] Team trained
- [ ] Incident response plan ready

---

## Support

For deployment issues:
1. Check Vercel logs
2. Review GitHub Actions logs
3. Check Supabase status
4. Contact support: deployment@pivori.com

---

**Last Updated**: November 2024
**Version**: 2.0.0

