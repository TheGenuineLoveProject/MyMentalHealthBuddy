#!/bin/bash
set -e
echo "💾 Starting Auto-Backup + GitHub Sync + Replit Redeploy"

# --- 1️⃣ Ensure repo exists ---
if [ ! -d ".git" ]; then
  echo "⚙️ Initializing git repository..."
  git init
  git branch -M main
  git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/MyMentalHealthBuddy.git
fi

# --- 2️⃣ Stage + commit changes ---
git add -A
timestamp=$(date +"%Y-%m-%d %H:%M:%S")
git commit -m "🧠 Auto-Backup @ $timestamp" || echo "⚠️ Nothing new to commit."

# --- 3️⃣ Push to GitHub with token auth ---
echo "🚀 Pushing to GitHub..."
git push -u origin main --force || echo "⚠️ Push failed — check token."

# --- 4️⃣ Local backup snapshot ---
tar -czf .backup/mhb-\$(date +%Y%m%d%H%M%S).tar.gz . 2>/dev/null || true
echo "✅ Local snapshot saved."

# --- 5️⃣ Launch combined frontend + backend ---
echo "💫 Launching npm run start:all"
npm run start:all
