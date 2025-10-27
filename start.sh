#!/bin/bash
set -e

# MyMentalHealthBuddy - Bulletproof Startup Script
# This script ensures both frontend and backend start reliably every time

echo "🚀 MyMentalHealthBuddy - Starting Application..."
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Kill any stale processes
echo -e "${YELLOW}🧹 Cleaning up stale processes...${NC}"
killall node 2>/dev/null || true
killall tsx 2>/dev/null || true
killall vite 2>/dev/null || true
sleep 2

# Step 2: Kill ports that might be in use
echo -e "${YELLOW}🔓 Freeing up ports 3001, 5000...${NC}"
npx kill-port 3000 3001 5000 9999 2>/dev/null || true
sleep 2

# Step 3: Verify workspace integrity
echo -e "${BLUE}🔍 Verifying workspace structure...${NC}"
if [ ! -d "apps/server" ]; then
    echo -e "${RED}❌ ERROR: apps/server directory not found!${NC}"
    exit 1
fi

if [ ! -d "apps/client" ]; then
    echo -e "${RED}❌ ERROR: apps/client directory not found!${NC}"
    exit 1
fi

# Step 4: Check dependencies
echo -e "${BLUE}📦 Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules not found. Installing dependencies...${NC}"
    npm install --workspaces --include-workspace-root
fi

# Step 5: Verify concurrently is installed
if ! command -v concurrently &> /dev/null; then
    echo -e "${RED}❌ ERROR: concurrently not found. Installing...${NC}"
    npm install concurrently
fi

# Step 6: Create health check function
check_server() {
    for i in {1..30}; do
        if curl -s http://localhost:3001/health > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Backend is healthy!${NC}"
            return 0
        fi
        sleep 1
    done
    echo -e "${RED}❌ Backend health check failed${NC}"
    return 1
}

check_client() {
    for i in {1..30}; do
        if curl -s http://localhost:5000 > /dev/null 2>&1; then
            echo -e "${GREEN}✅ Frontend is healthy!${NC}"
            return 0
        fi
        sleep 1
    done
    echo -e "${RED}❌ Frontend health check failed${NC}"
    return 1
}

# Step 7: Start both services with concurrently
echo -e "${GREEN}🎯 Starting backend and frontend...${NC}"
echo ""

# Use concurrently with proper settings
npx concurrently \
    --names "SERVER,CLIENT" \
    --prefix-colors "cyan,magenta" \
    --kill-others \
    --success first \
    --raw \
    "npm run start:server" \
    "npm run start:client"

# If we get here, something stopped
echo -e "${YELLOW}⚠️  Application stopped${NC}"
