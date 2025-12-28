#!/usr/bin/env bash
set -e
echo "Stopping any existing node processes..."
pkill -9 node || true
sleep 2
echo "Starting dev server..."
npm run dev
