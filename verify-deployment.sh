#!/bin/bash

# 🚀 Janashiri LMS Deployment Verification Script
# This script helps verify that the deployment is ready

echo "🔍 Janashiri LMS Deployment Verification"
echo "========================================"

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ "$2" = "success" ]; then
        echo -e "${GREEN}✅ $1${NC}"
    elif [ "$2" = "error" ]; then
        echo -e "${RED}❌ $1${NC}"
    elif [ "$2" = "warning" ]; then
        echo -e "${YELLOW}⚠️  $1${NC}"
    else
        echo -e "${BLUE}ℹ️  $1${NC}"
    fi
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_status "Please run this script from the root directory of the project" "error"
    exit 1
fi

print_status "Checking project structure..." "info"

# Check backend files
if [ -f "backend/server.js" ]; then
    print_status "Backend server.js found" "success"
else
    print_status "Backend server.js missing" "error"
fi

if [ -f "backend/.env" ]; then
    print_status "Backend .env file found" "success"
else
    print_status "Backend .env file missing - copy from .env.example" "warning"
fi

if [ -f "backend/package.json" ]; then
    print_status "Backend package.json found" "success"
else
    print_status "Backend package.json missing" "error"
fi

# Check frontend files
if [ -f "frontend/package.json" ]; then
    print_status "Frontend package.json found" "success"
else
    print_status "Frontend package.json missing" "error"
fi

if [ -f "frontend/vite.config.js" ]; then
    print_status "Frontend vite.config.js found" "success"
else
    print_status "Frontend vite.config.js missing" "error"
fi

# Check deployment files
if [ -f "backend/clearDatabase.js" ]; then
    print_status "Database clearing script found" "success"
else
    print_status "Database clearing script missing" "error"
fi

if [ -f "backend/setupProduction.js" ]; then
    print_status "Production setup script found" "success"
else
    print_status "Production setup script missing" "error"
fi

if [ -f "DEPLOYMENT.md" ]; then
    print_status "Deployment guide found" "success"
else
    print_status "Deployment guide missing" "error"
fi

echo ""
print_status "Checking environment variables..." "info"

# Check if NODE_ENV is set
if [ -z "$NODE_ENV" ]; then
    print_status "NODE_ENV not set - will default to development" "warning"
else
    print_status "NODE_ENV is set to: $NODE_ENV" "success"
fi

# Check for required directories
if [ -d "backend/models" ]; then
    print_status "Backend models directory exists" "success"
else
    print_status "Backend models directory missing" "error"
fi

if [ -d "backend/routes" ]; then
    print_status "Backend routes directory exists" "success"
else
    print_status "Backend routes directory missing" "error"
fi

if [ -d "frontend/src" ]; then
    print_status "Frontend src directory exists" "success"
else
    print_status "Frontend src directory missing" "error"
fi

echo ""
print_status "Dependencies check..." "info"

# Check if node_modules exist
if [ -d "backend/node_modules" ]; then
    print_status "Backend dependencies installed" "success"
else
    print_status "Backend dependencies missing - run 'npm install' in backend/" "warning"
fi

if [ -d "frontend/node_modules" ]; then
    print_status "Frontend dependencies installed" "success"
else
    print_status "Frontend dependencies missing - run 'npm install' in frontend/" "warning"
fi

echo ""
print_status "Deployment readiness checklist:" "info"
echo "1. ☐ Database cleared and admin user created"
echo "2. ☐ Environment variables configured"
echo "3. ☐ Frontend built for production"
echo "4. ☐ CORS origins updated"
echo "5. ☐ SSL certificates configured"
echo "6. ☐ Domain DNS configured"
echo "7. ☐ Email delivery tested"
echo "8. ☐ File uploads tested"

echo ""
print_status "Quick commands for deployment preparation:" "info"
echo "• Clear database:        cd backend && npm run clear-database"
echo "• Setup production:      cd backend && npm run setup-production"
echo "• Build frontend:        cd frontend && npm run build"
echo "• Test backend:          cd backend && npm start"
echo "• Test frontend:         cd frontend && npm run preview"

echo ""
print_status "Deployment verification completed!" "success"
print_status "Review the checklist above before deploying to production." "info"

exit 0