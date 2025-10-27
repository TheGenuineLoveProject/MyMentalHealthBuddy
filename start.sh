#!/bin/bash

# MyMentalHealthBuddy - Simple Startup Script
# Starts both frontend and backend together

echo "🚀 MyMentalHealthBuddy - Starting Application..."

# Start both services with concurrently
# Frontend (Vite) on port 5000, Backend (Express) on port 3001
exec npx concurrently \
    --names "SERVER,CLIENT" \
    --prefix-colors "cyan,magenta" \
    --kill-others \
    --raw \
    "npm run start:server" \
    "npm run start:client"
