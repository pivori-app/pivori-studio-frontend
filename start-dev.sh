#!/bin/bash

# PIVORI Studio v2.0 - Development Startup Script
# This script starts all services for local development

set -e

echo "🚀 PIVORI Studio v2.0 - Development Environment"
echo "=================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker daemon is not running${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker is running${NC}"

# Create .env files if they don't exist
echo -e "${YELLOW}📝 Setting up environment files...${NC}"

# Backend .env
if [ ! -f backend/.env ]; then
    echo "Creating backend/.env..."
    cat > backend/.env << EOF
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://pivori:pivori_dev_password@postgres:5432/pivori_studio
SUPABASE_URL=http://postgres:5432
SUPABASE_SERVICE_KEY=dev-service-key
JWT_SECRET=dev-jwt-secret-key-change-in-production
FRONTEND_URL=http://localhost:5173
EOF
    echo -e "${GREEN}✅ backend/.env created${NC}"
fi

# Frontend .env.local
if [ ! -f frontend/.env.local ]; then
    echo "Creating frontend/.env.local..."
    cat > frontend/.env.local << EOF
VITE_API_URL=http://localhost:3000
VITE_SUPABASE_URL=http://localhost:5432
VITE_SUPABASE_ANON_KEY=dev-anon-key
EOF
    echo -e "${GREEN}✅ frontend/.env.local created${NC}"
fi

echo ""
echo -e "${YELLOW}🐳 Starting Docker containers...${NC}"
echo ""

# Start Docker Compose
docker-compose -f docker-compose.dev.yml up -d

echo ""
echo -e "${GREEN}✅ Docker containers started${NC}"
echo ""

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Check if services are running
if docker ps | grep -q pivori-postgres-dev; then
    echo -e "${GREEN}✅ PostgreSQL is running${NC}"
else
    echo -e "${RED}❌ PostgreSQL failed to start${NC}"
    exit 1
fi

if docker ps | grep -q pivori-backend-dev; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    exit 1
fi

if docker ps | grep -q pivori-frontend-dev; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
else
    echo -e "${RED}❌ Frontend failed to start${NC}"
    exit 1
fi

echo ""
echo "=================================================="
echo -e "${GREEN}🎉 All services are running!${NC}"
echo "=================================================="
echo ""
echo "📍 Services URLs:"
echo "   Frontend:  http://localhost:5173"
echo "   Backend:   http://localhost:3000"
echo "   Database:  localhost:5432"
echo "   Adminer:   http://localhost:8080"
echo "   Redis:     localhost:6379"
echo ""
echo "📊 Database Credentials:"
echo "   Username: pivori"
echo "   Password: pivori_dev_password"
echo "   Database: pivori_studio"
echo ""
echo "🔑 JWT Secret: dev-jwt-secret-key-change-in-production"
echo ""
echo "📝 Logs:"
echo "   Backend:  docker logs -f pivori-backend-dev"
echo "   Frontend: docker logs -f pivori-frontend-dev"
echo "   Database: docker logs -f pivori-postgres-dev"
echo ""
echo "🛑 To stop all services:"
echo "   docker-compose -f docker-compose.dev.yml down"
echo ""
echo "💾 To seed sample data:"
echo "   docker exec pivori-backend-dev node seed.mjs"
echo ""
echo "🧪 To run tests:"
echo "   docker exec pivori-backend-dev npm test"
echo ""

