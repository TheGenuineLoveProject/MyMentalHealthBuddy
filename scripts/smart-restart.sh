#!/bin/bash

# Smart Restart Script - Handles all edge cases
set -e

echo "🔄 Smart Restart Initiated..."

# Step 1: Graceful shutdown
echo "📴 Gracefully stopping services..."
killall node 2>/dev/null || true
killall tsx 2>/dev/null || true
killall vite 2>/dev/null || true
sleep 3

# Step 2: Force kill if needed
echo "🔨 Ensuring all processes are stopped..."
pkill -9 node 2>/dev/null || true
pkill -9 tsx 2>/dev/null || true
pkill -9 vite 2>/dev/null || true
sleep 2

# Step 3: Free up ports
echo "🔓 Freeing ports..."
npx kill-port 3000 3001 5000 9999 2>/dev/null || true
sleep 2

# Step 4: Verify ports are free
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 3001 still in use, forcing..."
    kill -9 $(lsof -t -i:3001) 2>/dev/null || true
fi

if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port 5000 still in use, forcing..."
    kill -9 $(lsof -t -i:5000) 2>/dev/null || true
fi

sleep 2

# Step 5: Clean any stuck lock files
rm -f .vite-lock 2>/dev/null || true
rm -f apps/client/.vite-lock 2>/dev/null || true

# Step 6: Verify workspace health
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: Not in project root!"
    exit 1
fi

echo "✅ Environment clean and ready"
echo ""
echo "🚀 Starting application..."
echo ""

# Step 7: Start the application
bash start.sh
