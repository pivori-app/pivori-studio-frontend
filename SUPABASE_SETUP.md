# PIVORI Studio v2.0 - Supabase Setup Guide

Complete guide to setup and configure Supabase for PIVORI Studio.

## Table of Contents

1. [Create Supabase Project](#create-supabase-project)
2. [Get Credentials](#get-credentials)
3. [Run Migrations](#run-migrations)
4. [Configure Authentication](#configure-authentication)
5. [Setup Environment Variables](#setup-environment-variables)
6. [Test Connection](#test-connection)
7. [Seed Sample Data](#seed-sample-data)
8. [Troubleshooting](#troubleshooting)

---

## Create Supabase Project

### Step 1: Sign Up / Login

1. Go to [supabase.com](https://supabase.com)
2. Click "Sign In" or "Start Your Project"
3. Login with GitHub or email

### Step 2: Create New Project

1. Click "New Project"
2. Fill in project details:
   - **Project Name**: `pivori-studio-v2`
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine for development

3. Click "Create new project"
4. Wait for project to initialize (2-3 minutes)

---

## Get Credentials

### Step 1: Access Project Settings

1. In Supabase dashboard, click your project
2. Go to **Settings** (gear icon)
3. Click **API** in left sidebar

### Step 2: Copy Credentials

You'll see three keys:

| Key | Environment Variable | Usage |
|-----|----------------------|-------|
| **Project URL** | `VITE_SUPABASE_URL` | Frontend API endpoint |
| **Anon Public Key** | `VITE_SUPABASE_ANON_KEY` | Frontend authentication |
| **Service Role Secret** | `SUPABASE_SERVICE_KEY` | Backend server-to-server |

**Copy all three and save them securely!**

### Example Credentials

```
Project URL:      https://abcdefghijk.supabase.co
Anon Key:         eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Key:      eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Run Migrations

### Option A: Using Supabase CLI (Recommended)

#### Install CLI

```bash
npm install -g supabase
```

#### Link Project

```bash
supabase link --project-ref your-project-ref
```

Get `project-ref` from your project URL:
- URL: `https://abcdefghijk.supabase.co`
- Ref: `abcdefghijk`

#### Push Migrations

```bash
supabase db push
```

This will:
- Create all tables
- Setup RLS policies
- Create indexes
- Create views
- Create triggers

### Option B: Manual SQL Execution

#### Step 1: Open SQL Editor

1. In Supabase dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**

#### Step 2: Copy Migration SQL

1. Open `backend/migrations.sql`
2. Copy entire content
3. Paste into SQL Editor

#### Step 3: Execute

1. Click **Run** button
2. Wait for completion
3. Check for any errors

---

## Configure Authentication

### Enable Email/Password Auth

1. Go to **Authentication** → **Providers**
2. Find **Email** provider
3. Click to expand
4. Enable **Email/Password**
5. Click **Save**

### Enable OAuth Providers (Optional)

#### Google OAuth

1. Go to **Authentication** → **Providers**
2. Find **Google**
3. Click to expand
4. Add your Google OAuth credentials:
   - Client ID
   - Client Secret
5. Click **Save**

#### GitHub OAuth

1. Go to **Authentication** → **Providers**
2. Find **GitHub**
3. Click to expand
4. Add your GitHub OAuth credentials:
   - Client ID
   - Client Secret
5. Click **Save**

### Setup Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize templates:
   - Confirmation email
   - Password reset email
   - Magic link email
3. Click **Save**

---

## Setup Environment Variables

### Backend (.env)

Create `backend/.env`:

```env
# Server
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# JWT
JWT_SECRET=your-secret-key-generate-with-openssl-rand-base64-32

# Database
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
```

### Frontend (.env.production)

Create `frontend/.env.production`:

```env
VITE_API_URL=https://api.your-domain.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Generate JWT Secret

```bash
# On macOS/Linux
openssl rand -base64 32

# On Windows (with OpenSSL installed)
openssl rand -base64 32
```

---

## Test Connection

### Test Backend Connection

```bash
cd backend

# Create .env with Supabase credentials
cp .env.example .env
# Edit .env with your Supabase credentials

# Install dependencies
npm install

# Start server
npm run dev

# In another terminal, test API
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-11-12T10:30:00Z"
}
```

### Test Frontend Connection

```bash
cd frontend

# Create .env.local with Supabase credentials
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Install dependencies
npm install

# Start dev server
npm run dev

# Open http://localhost:5173 in browser
```

### Test Database Connection

```bash
# Using psql
psql postgresql://postgres:password@db.supabase.co:5432/postgres

# Or using Adminer
# Open http://localhost:8080
# Enter credentials:
# - Server: db.supabase.co
# - Username: postgres
# - Password: your-password
# - Database: postgres
```

---

## Seed Sample Data

### Using Script

```bash
cd backend

# Install dependencies if not done
npm install

# Run seed script
node seed.mjs
```

This creates:
- 1 sample user
- 4 sample applications
- 20 sample transactions
- 8 sample API keys
- 12 sample connectors

### Manual Seeding

```bash
# Connect to database
psql postgresql://postgres:password@db.supabase.co:5432/postgres

# Insert sample user
INSERT INTO users (email, name, role) VALUES ('demo@pivori.com', 'Demo User', 'user');

# Insert sample application
INSERT INTO applications (user_id, name, description, category, currency)
VALUES (
  (SELECT id FROM users WHERE email = 'demo@pivori.com'),
  'Sample App',
  'Sample application',
  'productivity',
  'EUR'
);
```

---

## Troubleshooting

### Connection Refused

**Problem**: `Connection refused` when connecting to Supabase

**Solution**:
1. Verify credentials are correct
2. Check project is running in Supabase dashboard
3. Ensure IP is whitelisted (if applicable)
4. Try from different network

### Authentication Failed

**Problem**: `Invalid API key` error

**Solution**:
1. Verify you're using correct key:
   - Frontend: Use **Anon Key**
   - Backend: Use **Service Role Key**
2. Check key is not expired
3. Regenerate key if needed

### RLS Policy Errors

**Problem**: `new row violates row level security policy`

**Solution**:
1. Check RLS policies in Supabase dashboard
2. Verify user ID matches in JWT token
3. Ensure policies are enabled correctly
4. Check `auth.uid()` function is working

### Migration Errors

**Problem**: Migration fails to apply

**Solution**:
1. Check SQL syntax in migrations.sql
2. Verify all tables don't already exist
3. Check for foreign key conflicts
4. Try running migrations manually in SQL Editor

### Performance Issues

**Problem**: Queries are slow

**Solution**:
1. Add indexes to frequently queried columns
2. Check query performance in Supabase dashboard
3. Optimize queries in backend
4. Consider caching with Redis

---

## Verify Setup

### Checklist

- [ ] Supabase project created
- [ ] Credentials copied and saved
- [ ] Migrations applied successfully
- [ ] Authentication configured
- [ ] Environment variables set
- [ ] Backend can connect to Supabase
- [ ] Frontend can authenticate
- [ ] Sample data seeded
- [ ] API endpoints tested
- [ ] Database queries working

---

## Next Steps

1. **Deploy to Vercel**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **Setup CI/CD**: Configure GitHub Actions
3. **Add Custom Domain**: Setup domain in Vercel
4. **Monitor Performance**: Setup Sentry and analytics
5. **Scale Database**: Upgrade Supabase plan if needed

---

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [GitHub Issues](https://github.com/pivori-app/pivori-studio-v2/issues)

---

**Last Updated**: November 2024
**Version**: 2.0.0

