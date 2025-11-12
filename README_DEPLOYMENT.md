# PIVORI Studio v2.0 - Deployment Instructions

## Quick Start - 3 Steps to Deploy

### Step 3️⃣ - Deploy to Vercel (Do First!)

```bash
# Set environment variables
export VERCEL_TOKEN="your-vercel-token"
export VERCEL_ORG_ID="your-org-id"
export VERCEL_PROJECT_ID="your-project-id"

# Run deployment script
./deploy.sh production

# Or manually
cd frontend && vercel --prod
cd ../backend && vercel --prod
```

**What happens:**
- ✅ Runs 280+ security tests
- ✅ Builds frontend & backend
- ✅ Deploys to Vercel
- ✅ Verifies deployment

**Expected output:**
```
🎉 Deployment completed successfully!
Deployment URL: https://pivori-studio.vercel.app
Status: ✅ Ready
```

---

### Step 1️⃣ - Configure GitHub Secrets (After Deployment)

Go to: `https://github.com/your-repo/settings/secrets/actions`

Add these secrets:

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

SLACK_WEBHOOK=your-slack-webhook-url (optional)
MAIL_SERVER=your-mail-server (optional)
MAIL_PORT=your-mail-port (optional)
MAIL_USERNAME=your-mail-username (optional)
MAIL_PASSWORD=your-mail-password (optional)
MAIL_FROM=noreply@pivori.com (optional)
MAIL_TO=team@pivori.com (optional)
```

---

### Step 2️⃣ - Verify Deployment (Final Check)

```bash
# Test health endpoint
curl https://pivori-studio.vercel.app/health

# Expected response:
# {"status":"ok","timestamp":"2024-11-12T10:30:00Z"}

# Test API endpoint
curl -X GET https://pivori-studio.vercel.app/api/applications \
  -H "Authorization: Bearer your-jwt-token"

# Check security headers
curl -I https://pivori-studio.vercel.app

# Should include:
# X-Content-Type-Options: nosniff
# X-Frame-Options: SAMEORIGIN
# Strict-Transport-Security: max-age=31536000
```

---

## Detailed Instructions

### Prerequisites

1. **Node.js** >= 18.0.0
   ```bash
   node --version
   ```

2. **Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Vercel Account**
   - Sign up at https://vercel.com
   - Create project
   - Get token, org ID, project ID

4. **Supabase Project**
   - Create at https://supabase.com
   - Run migrations
   - Get URL and keys

5. **GitHub Repository**
   - Push code to GitHub
   - Create personal access token

---

### Deployment Process

#### Phase 1: Vercel Deployment

```bash
# 1. Install dependencies
cd frontend
npm install
cd ../backend
npm install

# 2. Run tests
npm run test:security

# 3. Build
npm run build

# 4. Deploy
vercel --prod
```

#### Phase 2: GitHub Configuration

```bash
# 1. Push to GitHub
git add .
git commit -m "feat: Deploy PIVORI Studio v2.0"
git push origin main

# 2. Add secrets to GitHub
# Go to Settings → Secrets → Actions
# Add all required secrets

# 3. Verify GitHub Actions
# Go to Actions tab
# Workflow should run automatically
```

#### Phase 3: Verification

```bash
# 1. Check deployment
curl https://your-domain.com/health

# 2. Run tests
npm run test:all

# 3. Monitor logs
vercel logs --follow

# 4. Check security
npm audit
```

---

## Environment Variables

### Frontend (.env.production)

```env
VITE_API_URL=https://api.your-domain.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_TITLE=PIVORI Studio
VITE_APP_ID=pivori-studio-v2
```

### Backend (.env.production)

```env
NODE_ENV=production
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
REFRESH_TOKEN_SECRET=your-refresh-token-secret
FRONTEND_URL=https://your-domain.com
```

---

## Troubleshooting

### Issue: Vercel Deployment Fails

```bash
# Check logs
vercel logs --follow

# Rebuild
vercel --prod --force

# Check environment variables
vercel env list

# Verify build command
# Should be: npm run build
```

### Issue: Tests Failing

```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Run specific test
npm run test:auth

# Run with debug
DEBUG=* npm test
```

### Issue: CORS Error

```bash
# Check CORS configuration
# In backend/middleware/security.js

# Verify frontend URL is allowed
# Restart deployment
```

### Issue: Database Connection Error

```bash
# Verify credentials
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_KEY

# Test connection
psql $SUPABASE_URL
```

---

## Post-Deployment

### 1. Setup Monitoring

```bash
# Enable Vercel Analytics
# Dashboard → Analytics → Enable

# Setup error tracking (Sentry)
npm install @sentry/node

# Configure logging
# Dashboard → Logs
```

### 2. Configure Custom Domain

```bash
# In Vercel Dashboard
# Settings → Domains → Add Domain

# Update DNS records
# CNAME: your-domain.com → cname.vercel-dns.com
```

### 3. Enable Auto-Scaling

```bash
# In Vercel Dashboard
# Settings → Auto-Scaling
# Enable for production
```

### 4. Setup Backups

```bash
# In Supabase Dashboard
# Settings → Backups
# Enable daily backups
# Set retention to 30 days
```

---

## Monitoring & Maintenance

### Daily

```bash
# Check health
curl https://your-domain.com/health

# Monitor logs
vercel logs --follow

# Check performance
# Dashboard → Analytics
```

### Weekly

```bash
# Update dependencies
npm update

# Check vulnerabilities
npm audit

# Review logs
vercel logs --since=7d
```

### Monthly

```bash
# Run security tests
npm run test:security

# Penetration testing
./run-pentest.sh

# Review audit logs
# Dashboard → Audit Logs
```

---

## Rollback

If something goes wrong:

```bash
# Option 1: Revert commit
git revert HEAD
git push origin main

# Option 2: Rollback in Vercel
# Dashboard → Deployments → Select previous → Promote

# Option 3: Redeploy
vercel --prod --force
```

---

## Support

For issues:
1. Check [Vercel Docs](https://vercel.com/docs)
2. Check [Supabase Docs](https://supabase.com/docs)
3. Review logs: `vercel logs`
4. Contact: deployment@pivori.com

---

## Checklist

- [ ] Vercel account created
- [ ] Supabase project created
- [ ] GitHub repository created
- [ ] Environment variables set
- [ ] Tests passing locally
- [ ] Deployment script tested
- [ ] GitHub secrets configured
- [ ] Deployment successful
- [ ] Health check passing
- [ ] Security headers verified
- [ ] Monitoring configured
- [ ] Backups enabled

---

**Last Updated**: November 2024
**Version**: 2.0.0

