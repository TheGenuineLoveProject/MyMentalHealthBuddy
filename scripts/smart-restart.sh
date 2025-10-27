#!/bin/bash

# Smart Restart Script - Maximum Cleanup + Fresh Start

echo "🔄 Smart Restart - Maximum Cleanup Mode"
echo "========================================"

# Step 1: Graceful shutdown
echo "📴 Step 1/7: Gracefully stopping all services..."
killall node 2>/dev/null || true
killall tsx 2>/dev/null || true
killall vite 2>/dev/null || true
sleep 3

# Step 2: Force kill if needed
echo "🔨 Step 2/7: Force killing remaining processes..."
pkill -9 node 2>/dev/null || true
pkill -9 tsx 2>/dev/null || true
pkill -9 vite 2>/dev/null || true
sleep 2

# Step 3: Free up ports
echo "🔓 Step 3/7: Freeing ports 3000, 3001, 5000, 9999..."
npx kill-port 3000 3001 5000 9999 2>/dev/null || true
sleep 3

# Step 4: Clean any stuck lock files
echo "🧹 Step 4/7: Removing lock files..."
rm -f .vite-lock 2>/dev/null || true
rm -f apps/client/.vite-lock 2>/dev/null || true

# Step 5: Verify workspace health
echo "🔍 Step 5/7: Verifying workspace structure..."
if [ ! -f "package.json" ]; then
    echo "❌ ERROR: Not in project root!"
    exit 1
fi

if [ ! -d "apps/server" ] || [ ! -d "apps/client" ]; then
    echo "⚠️  WARNING: Workspace structure may be incomplete"
fi

# Step 6: One more wait for good measure
echo "⏳ Step 6/7: Waiting for ports to be fully released..."
sleep 3

# Step 7: Start the application
echo "✅ Step 7/7: Environment clean and ready!"
echo ""
echo "🚀 Starting application with fresh state..."
echo ""

# Start the application
exec bash start.sh
