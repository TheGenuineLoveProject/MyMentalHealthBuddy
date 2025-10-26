#!/bin/bash
echo "💫 Auto-starting MyMentalHealthBuddy frontend + backend..."
npm run start:all || (echo "⚠️ Restarting after crash..." && sleep 3 && ./start-all.sh)
