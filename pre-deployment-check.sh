#!/bin/bash

# PIVORI Studio v2.0 - Pre-Deployment Verification Script
# Comprehensive checks before production deployment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 PIVORI Studio v2.0 - Pre-Deployment Verification${NC}"
echo "=================================================="
echo ""

PASSED=0
FAILED=0
WARNINGS=0

# Function to check condition
check() {
    local name=$1
    local condition=$2
    
    if eval "$condition"; then
        echo -e "${GREEN}✅ $name${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ $name${NC}"
        ((FAILED++))
    fi
}

# Function to warn
warn() {
    local name=$1
    echo -e "${YELLOW}⚠️  $name${NC}"
    ((WARNINGS++))
}

echo -e "${BLUE}1. Environment Checks${NC}"
echo "====================="
check "Node.js installed" "command -v node &> /dev/null"
check "npm installed" "command -v npm &> /dev/null"
check "Node version >= 18" "node -v | grep -E 'v(1[8-9]|[2-9][0-9]|[0-9]{3})' &> /dev/null"
echo ""

echo -e "${BLUE}2. Project Structure${NC}"
echo "===================="
check "Backend directory exists" "[ -d backend ]"
check "Frontend directory exists" "[ -d frontend ]"
check "server.js exists" "[ -f backend/server.js ] || [ -f backend/server-complete.js ]"
check "package.json exists" "[ -f backend/package.json ]"
check "migrations.sql exists" "[ -f backend/migrations.sql ]"
check ".env file exists" "[ -f backend/.env.production ] || [ -f backend/.env ]"
echo ""

echo -e "${BLUE}3. Dependencies${NC}"
echo "==============="
cd backend
check "Node modules installed" "[ -d node_modules ]"
check "Express installed" "npm list express &> /dev/null"
check "Supabase SDK installed" "npm list @supabase/supabase-js &> /dev/null"
check "JWT installed" "npm list jsonwebtoken &> /dev/null"
check "Bcrypt installed" "npm list bcryptjs &> /dev/null"
cd ..
echo ""

echo -e "${BLUE}4. Security Files${NC}"
echo "=================="
check "auth.js exists" "[ -f backend/security/auth.js ]"
check "encryption.js exists" "[ -f backend/security/encryption.js ]"
check "audit.js exists" "[ -f backend/security/audit.js ]"
check "secrets.js exists" "[ -f backend/security/secrets.js ]"
check "security middleware exists" "[ -f backend/middleware/security.js ]"
echo ""

echo -e "${BLUE}5. Test Files${NC}"
echo "=============="
check "Auth tests exist" "[ -f backend/__tests__/security.auth.test.js ]"
check "Encryption tests exist" "[ -f backend/__tests__/security.encryption.test.js ]"
check "Secrets tests exist" "[ -f backend/__tests__/security.secrets.test.js ]"
check "Audit tests exist" "[ -f backend/__tests__/security.audit.test.js ]"
check "API integration tests exist" "[ -f backend/__tests__/api.integration.test.js ]"
check "OWASP tests exist" "[ -f backend/__tests__/owasp.compliance.test.js ]"
check "Compliance tests exist" "[ -f backend/__tests__/compliance.test.js ]"
echo ""

echo -e "${BLUE}6. Configuration Files${NC}"
echo "======================="
check "vercel.json exists" "[ -f vercel.json ]"
check "docker-compose.yml exists" "[ -f docker-compose.yml ]"
check "Dockerfile exists" "[ -f backend/Dockerfile ]"
check "GitHub Actions workflow exists" "[ -f .github/workflows/security-tests.yml ]"
echo ""

echo -e "${BLUE}7. Documentation${NC}"
echo "================="
check "README exists" "[ -f README.md ]"
check "SECURITY.md exists" "[ -f SECURITY.md ]"
check "DEPLOYMENT_GUIDE.md exists" "[ -f DEPLOYMENT_GUIDE.md ]"
check "API_REFERENCE.md exists" "[ -f API_REFERENCE.md ]"
check "ARCHITECTURE.md exists" "[ -f ARCHITECTURE.md ]"
echo ""

echo -e "${BLUE}8. Environment Variables${NC}"
echo "========================"
if [ -f backend/.env.production ]; then
    check "SUPABASE_URL set" "grep -q 'SUPABASE_URL' backend/.env.production"
    check "JWT_SECRET set" "grep -q 'JWT_SECRET' backend/.env.production"
    check "ENCRYPTION_KEY set" "grep -q 'ENCRYPTION_KEY' backend/.env.production"
    check "FRONTEND_URL set" "grep -q 'FRONTEND_URL' backend/.env.production"
else
    warn "No .env.production file found"
fi
echo ""

echo -e "${BLUE}9. Code Quality${NC}"
echo "==============="
cd backend
if command -v eslint &> /dev/null; then
    check "ESLint passes" "npm run lint &> /dev/null"
else
    warn "ESLint not installed"
fi
cd ..
echo ""

echo -e "${BLUE}10. Security Tests${NC}"
echo "=================="
cd backend
if npm list vitest &> /dev/null; then
    check "Auth tests pass" "npm run test:auth &> /dev/null"
    check "Encryption tests pass" "npm run test:encryption &> /dev/null"
    check "Audit tests pass" "npm run test:audit &> /dev/null"
else
    warn "Vitest not installed - skipping tests"
fi
cd ..
echo ""

echo -e "${BLUE}11. Git Status${NC}"
echo "=============="
check "Git repository initialized" "[ -d .git ]"
check "No uncommitted changes" "git status --porcelain | wc -l | grep -q '^0$' || [ -z \"$(git status --porcelain)\" ]"
check "Remote configured" "git remote -v | grep -q 'origin'"
echo ""

echo -e "${BLUE}12. Deployment Tools${NC}"
echo "===================="
check "Vercel CLI installed" "command -v vercel &> /dev/null"
check "Docker installed" "command -v docker &> /dev/null"
check "Supabase CLI installed" "command -v supabase &> /dev/null"
echo ""

echo -e "${BLUE}13. Build Verification${NC}"
echo "====================="
cd backend
check "Backend builds successfully" "npm run build &> /dev/null"
cd ../frontend
check "Frontend builds successfully" "npm run build &> /dev/null"
cd ..
echo ""

echo -e "${BLUE}14. Security Checklist${NC}"
echo "====================="
check "HTTPS enabled" "grep -q 'Strict-Transport-Security' backend/middleware/security.js"
check "CORS configured" "grep -q 'cors' backend/server.js || grep -q 'cors' backend/server-complete.js"
check "Rate limiting enabled" "grep -q 'rateLimit' backend/server.js || grep -q 'rateLimit' backend/server-complete.js"
check "Authentication middleware" "grep -q 'authenticateToken' backend/server.js || grep -q 'authenticateToken' backend/server-complete.js"
check "Audit logging enabled" "grep -q 'audit.logEvent' backend/server.js || grep -q 'audit.logEvent' backend/server-complete.js"
echo ""

echo "=================================================="
echo -e "${BLUE}Summary${NC}"
echo "=================================================="
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo -e "${YELLOW}⚠️  Warnings: $WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Ready for deployment.${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some checks failed. Please fix before deployment.${NC}"
    exit 1
fi

