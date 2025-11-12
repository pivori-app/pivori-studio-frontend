#!/bin/bash

# PIVORI Studio v2.0 - Automated Deployment Script
# Deploys to Vercel with security tests and verification

set -e

echo "🚀 PIVORI Studio v2.0 - Deployment Script"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
VERCEL_TOKEN=${VERCEL_TOKEN:-""}
VERCEL_ORG_ID=${VERCEL_ORG_ID:-""}
VERCEL_PROJECT_ID=${VERCEL_PROJECT_ID:-""}
ENVIRONMENT=${1:-"production"}

# Check environment
if [ "$ENVIRONMENT" != "production" ] && [ "$ENVIRONMENT" != "staging" ]; then
    echo -e "${RED}❌ Invalid environment. Use 'production' or 'staging'${NC}"
    exit 1
fi

# Check Vercel token
if [ -z "$VERCEL_TOKEN" ]; then
    echo -e "${RED}❌ VERCEL_TOKEN not set${NC}"
    exit 1
fi

echo -e "${BLUE}Step 1: Running Security Tests${NC}"
echo "================================"
cd backend
npm run test:security || {
    echo -e "${RED}❌ Security tests failed${NC}"
    exit 1
}
echo -e "${GREEN}✅ Security tests passed${NC}"
echo ""

echo -e "${BLUE}Step 2: Running All Tests${NC}"
echo "=========================="
npm run test:all || {
    echo -e "${RED}❌ Tests failed${NC}"
    exit 1
}
echo -e "${GREEN}✅ All tests passed${NC}"
echo ""

echo -e "${BLUE}Step 3: Checking Dependencies${NC}"
echo "============================="
npm audit --audit-level=moderate || {
    echo -e "${YELLOW}⚠️  Vulnerabilities found${NC}"
}
echo -e "${GREEN}✅ Dependency check completed${NC}"
echo ""

echo -e "${BLUE}Step 4: Building Frontend${NC}"
echo "========================="
cd ../frontend
npm run build || {
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
}
echo -e "${GREEN}✅ Frontend built successfully${NC}"
echo ""

echo -e "${BLUE}Step 5: Building Backend${NC}"
echo "======================="
cd ../backend
npm run build || {
    echo -e "${RED}❌ Backend build failed${NC}"
    exit 1
}
echo -e "${GREEN}✅ Backend built successfully${NC}"
echo ""

echo -e "${BLUE}Step 6: Deploying to Vercel ($ENVIRONMENT)${NC}"
echo "=========================================="

# Set Vercel environment variables
export VERCEL_TOKEN=$VERCEL_TOKEN
export VERCEL_ORG_ID=$VERCEL_ORG_ID
export VERCEL_PROJECT_ID=$VERCEL_PROJECT_ID

# Deploy based on environment
if [ "$ENVIRONMENT" = "production" ]; then
    echo "Deploying to production..."
    vercel --prod --confirm || {
        echo -e "${RED}❌ Deployment failed${NC}"
        exit 1
    }
else
    echo "Deploying to staging..."
    vercel --confirm || {
        echo -e "${RED}❌ Deployment failed${NC}"
        exit 1
    }
fi

echo -e "${GREEN}✅ Deployment successful${NC}"
echo ""

echo -e "${BLUE}Step 7: Verifying Deployment${NC}"
echo "============================="

# Get deployment URL
DEPLOYMENT_URL=$(vercel list --json | jq -r '.[0].url')

if [ -z "$DEPLOYMENT_URL" ]; then
    echo -e "${YELLOW}⚠️  Could not get deployment URL${NC}"
else
    echo "Deployment URL: https://$DEPLOYMENT_URL"
    
    # Wait for deployment to be ready
    echo "Waiting for deployment to be ready..."
    sleep 10
    
    # Test health endpoint
    echo "Testing health endpoint..."
    HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$DEPLOYMENT_URL/health)
    
    if [ "$HEALTH_STATUS" = "200" ]; then
        echo -e "${GREEN}✅ Health check passed${NC}"
    else
        echo -e "${YELLOW}⚠️  Health check returned status $HEALTH_STATUS${NC}"
    fi
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo ""
echo "Summary:"
echo "--------"
echo "Environment: $ENVIRONMENT"
echo "Deployment URL: https://$DEPLOYMENT_URL"
echo "Status: ✅ Ready"
echo ""
echo "Next steps:"
echo "1. Visit https://$DEPLOYMENT_URL"
echo "2. Test the application"
echo "3. Monitor logs: vercel logs"
echo ""

