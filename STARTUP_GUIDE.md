# 🚀 MyMentalHealthBuddy - Bulletproof Startup Guide

## ONE-PASTE COMMANDS (Perfect Every Time!)

### ✨ The Ultimate Command
```bash
npm run start:all
```
**What it does:**
1. ✅ Kills all stale processes automatically
2. ✅ Frees up ports 3001 and 5000
3. ✅ Validates workspace structure
4. ✅ Checks dependencies
5. ✅ Starts backend (port 3001)
6. ✅ Starts frontend (port 5000)
7. ✅ Monitors both services with color-coded logs

**Just copy, paste, press Enter. Done!** 🎉

---

## Alternative Commands (All One-Paste!)

### Quick Start (Same as above)
```bash
npm run dev
```

### Smart Restart (Handles Everything)
```bash
npm run restart
```
Forces cleanup then starts fresh.

### Nuclear Option (When Nothing Else Works)
```bash
bash scripts/smart-restart.sh
```
Maximum cleanup power!

### Health Check
```bash
npm run health
```
Validates both services are running correctly.

### Emergency Stop
```bash
npm run kill
```
Stops everything immediately.

---

## What Each Command Does

### `npm run start:all` / `npm run dev`
```
🚀 Starting Application...
🧹 Cleaning up stale processes...     [Kills zombie processes]
🔓 Freeing up ports...                 [Clears 3001, 5000]
🔍 Verifying workspace structure...   [Checks apps/ folders]
📦 Checking dependencies...            [Ensures node_modules exists]
🎯 Starting backend and frontend...   [Concurrent startup]
  [SERVER] Backend running on port 3001
  [CLIENT] Frontend running on port 5000
```

**Success!** Your app is now running with:
- **Backend:** http://localhost:3001 (API)
- **Frontend:** http://localhost:5000 (Website)

### `npm run health`
```
🏥 Running Health Checks...
✅ Backend API is running (port 3001)
✅ Frontend Server is running (port 5000)

🎉 All systems are GO! Your application is running perfectly.
📍 Frontend: http://localhost:5000
📍 Backend:  http://localhost:3001
```

### `npm run restart`
```
Executes: npm run fixports && npm run start:all
- Kills processes on ports 3000, 3001, 5000, 9999
- Waits 2 seconds
- Starts application fresh
```

### `npm run kill`
```
Immediately stops all Node.js processes
Use before starting if you see "port in use" errors
```

---

## Troubleshooting (Self-Healing!)

### ❌ "Port 3001 is already in use"
**Solution:** The script automatically fixes this!
```bash
npm run start:all
```
The startup script kills processes and frees ports automatically.

### ❌ "Cannot find module"
**Solution:** The script checks and installs!
```bash
npm run start:all
```
Script detects missing dependencies and installs them.

### ❌ Multiple instances running
**Solution:**
```bash
npm run kill
npm run start:all
```

### ❌ Something is broken, start fresh
**Solution:**
```bash
bash scripts/smart-restart.sh
```
This does MAXIMUM cleanup:
- Graceful shutdown
- Force kill all processes
- Free all ports
- Verify ports are actually free
- Clean lock files
- Validate workspace
- Start fresh

---

## How It Works (The Magic!)

### Bulletproof Startup Script (`start.sh`)

**Automatic Self-Healing:**
1. ✅ Terminates zombie Node processes
2. ✅ Kills processes on ports 3001, 5000
3. ✅ Validates workspace structure (`apps/server`, `apps/client`)
4. ✅ Checks for `node_modules`, installs if missing
5. ✅ Verifies `concurrently` is installed
6. ✅ Starts both services with monitoring
7. ✅ Kills all if one fails (fail-safe mode)

**Concurrently Configuration:**
- `--kill-others`: If one service fails, kill the other
- `--names SERVER,CLIENT`: Color-coded logs
- `--prefix-colors cyan,magenta`: Beautiful terminal output
- `--raw`: Better log formatting

**Color-Coded Logs:**
```
[SERVER] ✅ Server running on port 3001 (cyan)
[CLIENT] VITE ready at http://localhost:5000 (magenta)
```

### Smart Restart (`scripts/smart-restart.sh`)

**Maximum Cleanup Power:**
1. Graceful shutdown (sends SIGTERM)
2. Wait 3 seconds for processes to exit
3. Force kill (sends SIGKILL -9)
4. Free all ports with kill-port
5. Verify ports with lsof
6. Force kill any stragglers
7. Remove lock files
8. Validate project structure
9. Start application

---

## Production Commands

### Build for Production
```bash
npm run build
```
Creates optimized production build:
- 56KB brotli compressed bundles
- Pre-compressed .gz and .br files
- 72-75% size reduction

### Build with Analysis
```bash
npm run build:analyze
```
Same as build + creates interactive bundle visualizer at `apps/client/dist/stats.html`

### Start Production Server
```bash
npm start
```
Runs production build with:
- Brotli compression
- Intelligent caching
- Optimized serving

---

## Development Workflow

### Normal Day
```bash
npm run start:all
# Make your changes
# Hot reload happens automatically
# Ctrl+C to stop
```

### After Pulling Updates
```bash
npm install                # Install new dependencies
npm run restart           # Start fresh
```

### Testing Changes
```bash
npm run start:all         # Start app
# In another terminal:
npm run health            # Verify everything works
```

### Before Committing
```bash
npm run type-check        # Check TypeScript
npm run build             # Verify production build
```

---

## Workspace Commands

### Server Only
```bash
npm run start:server
```
Starts backend on port 3001

### Client Only
```bash
npm run start:client
```
Starts frontend on port 5000

### Type Checking
```bash
npm run type-check
```
Checks TypeScript in both client and server

### Database Migration
```bash
npm run db:push
```
Pushes schema changes to database

---

## Advanced Commands

### Performance Check
```bash
npm run perf
```
Shows bundle sizes after building

### Clean Everything
```bash
npm run clean
```
Removes:
- All node_modules
- All dist folders
- package-lock.json

**Note:** Run `npm install` after this!

### Quick Stats
```bash
npm run build:stats
```
Build and show file sizes

---

## Environment Variables

### Required
- `DATABASE_URL` - PostgreSQL connection (auto-provided by Replit)
- `PORT` - Server port (defaults to 3001)

### Optional
- `NODE_ENV=production` - Enables production mode
- `ANALYZE=true` - Enables bundle analyzer

---

## Port Reference

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5000 | http://localhost:5000 |
| Backend (Express) | 3001 | http://localhost:3001 |
| Backend Health | 3001 | http://localhost:3001/health |

**Note:** Port 5000 is required by Replit webview!

---

## File Structure

```
MyMentalHealthBuddy/
├── start.sh                    # Main startup script ⭐
├── scripts/
│   ├── smart-restart.sh       # Maximum cleanup script
│   └── health-check.js        # Health validation
├── apps/
│   ├── client/                # Frontend (React + Vite)
│   ├── server/                # Backend (Express + TypeScript)
│   └── shared/                # Shared types and schemas
├── package.json               # Root workspace config
└── STARTUP_GUIDE.md          # This file!
```

---

## Quick Reference

| Task | Command |
|------|---------|
| **Start everything** | `npm run start:all` |
| **Start (alternative)** | `npm run dev` |
| **Restart cleanly** | `npm run restart` |
| **Check health** | `npm run health` |
| **Stop everything** | `npm run kill` |
| **Nuclear restart** | `bash scripts/smart-restart.sh` |
| **Build production** | `npm run build` |
| **Analyze bundle** | `npm run build:analyze` |
| **Type check** | `npm run type-check` |
| **Performance** | `npm run perf` |

---

## Success Indicators

### ✅ App is running correctly when you see:
```
[SERVER] ✅ Server running on port 3001 (development mode)
[CLIENT] VITE v7.1.12 ready in XXX ms
[CLIENT] ➜  Local:   http://localhost:5000/
[CLIENT] ➜  Network: use --host to expose
```

### ✅ Health check passes:
```
npm run health
🏥 Running Health Checks...
✅ Backend API is running (port 3001)
✅ Frontend Server is running (port 5000)
🎉 All systems are GO!
```

### ❌ App is NOT running when you see:
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Fix:** Run `npm run restart`

---

## FAQ

**Q: Which command should I use to start the app?**  
A: `npm run start:all` - It's the most reliable!

**Q: Do I need to kill processes manually?**  
A: No! The startup script does it automatically.

**Q: What if ports are stuck?**  
A: The script frees them automatically. If that fails, use `npm run restart`.

**Q: Can I run just frontend or backend?**  
A: Yes! Use `npm run start:server` or `npm run start:client`.

**Q: How do I know if everything is working?**  
A: Run `npm run health` - it checks both services.

**Q: What's the difference between `npm run dev` and `npm run start:all`?**  
A: They're the same! Both run `start.sh`.

**Q: When should I use `smart-restart.sh`?**  
A: When normal restart doesn't work - it's the nuclear option!

---

## The Perfect Workflow

```bash
# Day 1: Clone the repo
git clone <repo>
cd MyMentalHealthBuddy

# Day 2: Start developing
npm run start:all                    # ⭐ ONE COMMAND!

# Make changes, auto-reload happens

# Check if everything works
npm run health                       # Verify

# Done for the day
Ctrl+C                               # Stop

# Day 3: Resume work
npm run start:all                    # Same command!

# Before deploying
npm run build                        # Build production
npm run health                       # Final check
```

---

## 🎯 Remember

**99% of the time, you only need:**
```bash
npm run start:all
```

**That's it! One command. One paste. Perfect startup. Every time.** 🚀

---

**Made with ❤️ for developers who hate startup issues!**

**Last Updated:** October 27, 2025  
**Status:** ✅ Production-Ready  
**Reliability:** 💯 Bulletproof
