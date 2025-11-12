# PIVORI Studio v2.0 - Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Supabase Setup](#supabase-setup)
4. [Vercel Deployment](#vercel-deployment)
5. [GitHub Actions CI/CD](#github-actions-cicd)
6. [Environment Variables](#environment-variables)
7. [Database Migrations](#database-migrations)
8. [Monitoring & Logging](#monitoring--logging)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 or **pnpm** >= 8.0.0
- **Docker** & **Docker Compose** (optional, for local development)
- **Git** account with repository access
- **Supabase** account (free tier available)
- **Vercel** account (free tier available)
- **GitHub** account

---

## Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/pivori-app/pivori-studio-v2.git
cd pivori-studio-v2
```

### 2. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 3. Setup Environment Variables

Create `.env.local` files:

**Frontend** (`frontend/.env.local`):
```env
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Backend** (`backend/.env`):
```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-jwt-secret-key
```

### 4. Run with Docker Compose

```bash
docker-compose up -d
```

Services will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Database: localhost:5432
- Adminer: http://localhost:8080

### 5. Run Locally (without Docker)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign in or create account
3. Click "New Project"
4. Fill in project details:
   - **Project Name**: pivori-studio-v2
   - **Database Password**: (generate strong password)
   - **Region**: Choose closest to your users
5. Click "Create new project"

### 2. Get Credentials

After project creation, go to **Settings → API**:
- Copy **Project URL** → `VITE_SUPABASE_URL`
- Copy **anon public key** → `VITE_SUPABASE_ANON_KEY`
- Copy **service_role secret** → `SUPABASE_SERVICE_KEY`

### 3. Run Database Migrations

Option A - Using Supabase CLI:
```bash
npm install -g supabase
supabase link --project-ref your-project-ref
supabase db push
```

Option B - Using SQL Editor:
1. Go to Supabase Dashboard → SQL Editor
2. Create new query
3. Paste contents of `backend/migrations.sql`
4. Click "Run"

### 4. Enable Authentication

1. Go to **Authentication → Providers**
2. Enable desired providers:
   - Email/Password
   - Google OAuth
   - GitHub OAuth

### 5. Setup Email Templates

1. Go to **Authentication → Email Templates**
2. Customize email templates as needed

---

## Vercel Deployment

### 1. Create Vercel Project

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import repository: `pivori-app/pivori-studio-v2`

### 2. Configure Build Settings

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```bash
npm install
```

### 3. Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=https://your-backend-url.com
```

### 4. Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Access your deployment at: `https://pivori-studio-v2.vercel.app`

### 5. Setup Custom Domain (Optional)

1. Go to **Domains** in Vercel
2. Add your custom domain
3. Update DNS records as instructed

---

## GitHub Actions CI/CD

### 1. Setup Secrets

Go to GitHub Repository → Settings → Secrets and add:

```
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
VERCEL_TOKEN=your-vercel-token
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SNYK_TOKEN=your-snyk-token (optional)
SLACK_WEBHOOK=your-slack-webhook (optional)
```

### 2. Workflow Triggers

The workflow runs on:
- Push to `main` branch
- Push to `develop` branch
- Pull requests to `main` or `develop`

### 3. Workflow Steps

1. **Build & Test**
   - Install dependencies
   - Run linter
   - Run tests
   - Build frontend

2. **Deploy** (only on main branch)
   - Deploy to Vercel

3. **Security Scan**
   - Run Snyk security checks

4. **Notify**
   - Send Slack notification

---

## Environment Variables

### Frontend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000` |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | `eyJ...` |

### Backend Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `SUPABASE_URL` | Supabase URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Service role key | `eyJ...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `FRONTEND_URL` | Frontend URL | `http://localhost:5173` |

---

## Database Migrations

### Running Migrations

**Using Supabase CLI:**
```bash
supabase db push
```

**Using SQL Editor:**
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Create new query
4. Paste migration SQL
5. Click Run

### Creating New Migrations

1. Create migration file: `backend/migrations/001_create_table.sql`
2. Write SQL migration
3. Run with Supabase CLI or SQL Editor

### Rollback

To rollback a migration:
1. Create a new migration file with rollback SQL
2. Run it through Supabase

---

## Monitoring & Logging

### Vercel Analytics

1. Go to Vercel Dashboard → Analytics
2. View:
   - Web Vitals
   - Request metrics
   - Error rates

### Supabase Monitoring

1. Go to Supabase Dashboard → Logs
2. View:
   - Database logs
   - API logs
   - Authentication logs

### Application Logs

**Backend logs:**
```bash
# View logs
docker logs pivori-backend

# Follow logs
docker logs -f pivori-backend
```

### Error Tracking

Setup Sentry for error tracking:

1. Create Sentry account at [sentry.io](https://sentry.io)
2. Create new project
3. Add Sentry SDK to frontend and backend
4. Configure error reporting

---

## Troubleshooting

### Build Issues

**Problem**: Build fails with "Module not found"
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Problem**: Tailwind CSS classes not generating
```bash
# Solution: Rebuild Tailwind
npm run build:css
```

### Database Issues

**Problem**: Migration fails
```bash
# Solution: Check Supabase logs
# Go to Supabase Dashboard → Logs
# Look for SQL errors
```

**Problem**: RLS policies blocking queries
```bash
# Solution: Check RLS policies
# Go to Supabase Dashboard → Authentication → Policies
# Verify policies are correct
```

### Deployment Issues

**Problem**: Vercel deployment fails
```bash
# Solution: Check build logs
# Go to Vercel Dashboard → Deployments
# Click failed deployment to see logs
```

**Problem**: Environment variables not loading
```bash
# Solution: Verify variables in Vercel
# Go to Settings → Environment Variables
# Ensure all required variables are set
```

### API Issues

**Problem**: CORS errors
```bash
# Solution: Check CORS configuration
# In backend/server.js, verify CORS origin matches frontend URL
```

**Problem**: Authentication fails
```bash
# Solution: Check JWT configuration
# Verify JWT_SECRET matches between frontend and backend
# Check Supabase authentication settings
```

---

## Performance Optimization

### Frontend

1. **Code Splitting**: Use React lazy loading
2. **Image Optimization**: Use WebP format
3. **Caching**: Configure browser cache headers
4. **CDN**: Use Vercel's built-in CDN

### Backend

1. **Database Indexing**: Ensure proper indexes
2. **Query Optimization**: Use efficient queries
3. **Caching**: Implement Redis caching
4. **Rate Limiting**: Prevent abuse

### Database

1. **Connection Pooling**: Use PgBouncer
2. **Query Optimization**: Analyze slow queries
3. **Backup Strategy**: Regular backups
4. **Monitoring**: Setup alerts

---

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Enable HTTPS everywhere
- [ ] Setup rate limiting
- [ ] Enable CORS only for trusted domains
- [ ] Rotate API keys regularly
- [ ] Enable 2FA on all accounts
- [ ] Setup security headers
- [ ] Enable database backups
- [ ] Monitor for suspicious activity
- [ ] Keep dependencies updated

---

## Support

For issues or questions:
1. Check this guide's Troubleshooting section
2. Review [Supabase docs](https://supabase.com/docs)
3. Review [Vercel docs](https://vercel.com/docs)
4. Open GitHub issue

---

**Last Updated**: November 2024
**Version**: 2.0.0

