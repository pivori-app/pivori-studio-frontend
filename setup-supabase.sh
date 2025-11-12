#!/bin/bash

# PIVORI Studio v2.0 - Supabase Setup Script
# This script helps configure Supabase for production

set -e

echo "🔧 PIVORI Studio v2.0 - Supabase Configuration"
echo "=============================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${YELLOW}⚠️  Supabase CLI not found${NC}"
    echo "Install it with: npm install -g supabase"
    echo ""
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${BLUE}Step 1: Supabase Project Information${NC}"
echo "======================================"
echo ""
echo "Go to https://supabase.com and create a new project if you haven't already."
echo ""

read -p "Enter your Supabase Project URL (e.g., https://xxx.supabase.co): " SUPABASE_URL
read -p "Enter your Supabase Anon Key: " SUPABASE_ANON_KEY
read -p "Enter your Supabase Service Role Key: " SUPABASE_SERVICE_KEY
read -p "Enter your Supabase Project Reference (e.g., xxx): " PROJECT_REF

echo ""
echo -e "${BLUE}Step 2: Save Configuration${NC}"
echo "============================"
echo ""

# Create .env files
echo "Creating backend/.env..."
cat > backend/.env << EOF
# Server Configuration
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-domain.com

# Supabase Configuration
SUPABASE_URL=$SUPABASE_URL
SUPABASE_SERVICE_KEY=$SUPABASE_SERVICE_KEY

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 32)

# Database
DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres

# API Keys
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Logging
LOG_LEVEL=info
EOF

echo -e "${GREEN}✅ backend/.env created${NC}"

echo "Creating frontend/.env.production..."
cat > frontend/.env.production << EOF
VITE_API_URL=https://api.your-domain.com
VITE_SUPABASE_URL=$SUPABASE_URL
VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
EOF

echo -e "${GREEN}✅ frontend/.env.production created${NC}"

echo ""
echo -e "${BLUE}Step 3: Run Database Migrations${NC}"
echo "=================================="
echo ""

if command -v supabase &> /dev/null; then
    echo "Linking Supabase project..."
    supabase link --project-ref $PROJECT_REF
    
    echo "Pushing migrations..."
    supabase db push
    
    echo -e "${GREEN}✅ Migrations completed${NC}"
else
    echo -e "${YELLOW}⚠️  Supabase CLI not available${NC}"
    echo "Manual steps:"
    echo "1. Go to Supabase Dashboard → SQL Editor"
    echo "2. Create new query"
    echo "3. Copy content of backend/migrations.sql"
    echo "4. Run the query"
fi

echo ""
echo -e "${BLUE}Step 4: Enable Authentication${NC}"
echo "=============================="
echo ""
echo "In Supabase Dashboard:"
echo "1. Go to Authentication → Providers"
echo "2. Enable Email/Password"
echo "3. Enable Google OAuth (optional)"
echo "4. Enable GitHub OAuth (optional)"
echo ""

echo -e "${BLUE}Step 5: Setup Environment Variables${NC}"
echo "===================================="
echo ""
echo "For Vercel deployment, add these secrets:"
echo ""
echo "VITE_SUPABASE_URL=$SUPABASE_URL"
echo "VITE_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY"
echo ""

echo -e "${GREEN}✅ Supabase configuration completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your production values"
echo "2. Update frontend/.env.production with your domain"
echo "3. Deploy to Vercel: git push origin main"
echo "4. Add environment variables in Vercel dashboard"
echo ""

