.PHONY: help install dev dev-docker stop logs seed test lint format build deploy clean

help:
	@echo "PIVORI Studio v2.0 - Available Commands"
	@echo "========================================"
	@echo ""
	@echo "Development:"
	@echo "  make install      - Install dependencies"
	@echo "  make dev          - Start development servers (local)"
	@echo "  make dev-docker   - Start development servers (Docker)"
	@echo "  make stop         - Stop all services"
	@echo "  make logs         - View service logs"
	@echo ""
	@echo "Database:"
	@echo "  make seed         - Seed sample data"
	@echo "  make migrate      - Run database migrations"
	@echo ""
	@echo "Testing & Quality:"
	@echo "  make test         - Run all tests"
	@echo "  make lint         - Run linter"
	@echo "  make format       - Format code"
	@echo ""
	@echo "Build & Deploy:"
	@echo "  make build        - Build for production"
	@echo "  make deploy       - Deploy to Vercel"
	@echo "  make clean        - Clean build artifacts"
	@echo ""

install:
	@echo "📦 Installing dependencies..."
	cd frontend && npm install
	cd ../backend && npm install
	@echo "✅ Dependencies installed"

dev:
	@echo "🚀 Starting development servers..."
	@echo "Frontend: http://localhost:5173"
	@echo "Backend:  http://localhost:3000"
	@echo ""
	@echo "Press Ctrl+C to stop"
	@echo ""
	@(cd backend && npm run dev) & \
	(cd frontend && npm run dev)

dev-docker:
	@echo "🐳 Starting Docker development environment..."
	./start-dev.sh

stop:
	@echo "🛑 Stopping services..."
	docker-compose -f docker-compose.dev.yml down
	@echo "✅ Services stopped"

logs:
	@echo "📊 Service Logs"
	@echo "==============="
	@echo ""
	@echo "Backend logs:"
	@echo "  docker logs -f pivori-backend-dev"
	@echo ""
	@echo "Frontend logs:"
	@echo "  docker logs -f pivori-frontend-dev"
	@echo ""
	@echo "Database logs:"
	@echo "  docker logs -f pivori-postgres-dev"
	@echo ""

seed:
	@echo "🌱 Seeding database..."
	cd backend && node seed.mjs
	@echo "✅ Database seeded"

migrate:
	@echo "📝 Running migrations..."
	@echo "Option 1: Using Supabase CLI"
	@echo "  supabase link --project-ref YOUR_PROJECT_REF"
	@echo "  supabase db push"
	@echo ""
	@echo "Option 2: Manual SQL execution"
	@echo "  Copy backend/migrations.sql to Supabase SQL Editor"

test:
	@echo "🧪 Running tests..."
	cd backend && npm test
	cd ../frontend && npm test
	@echo "✅ Tests completed"

lint:
	@echo "🔍 Running linter..."
	cd backend && npm run lint
	cd ../frontend && npm run lint
	@echo "✅ Linting completed"

format:
	@echo "✨ Formatting code..."
	cd backend && npm run format
	cd ../frontend && npm run format
	@echo "✅ Code formatted"

build:
	@echo "🏗️  Building for production..."
	cd frontend && npm run build
	cd ../backend && npm run build
	@echo "✅ Build completed"

deploy:
	@echo "🚀 Deploying to Vercel..."
	@echo "1. Create checkpoint: make checkpoint"
	@echo "2. Push to GitHub: git push origin main"
	@echo "3. Click Publish in Vercel dashboard"
	@echo ""
	@echo "Or use Vercel CLI:"
	@echo "  vercel --prod"

clean:
	@echo "🧹 Cleaning up..."
	rm -rf frontend/dist
	rm -rf backend/dist
	rm -rf node_modules
	find . -name ".DS_Store" -delete
	@echo "✅ Cleanup completed"

.DEFAULT_GOAL := help

