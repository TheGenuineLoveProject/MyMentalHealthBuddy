# 🎯 ONE-PASTE COMMANDS FOR MYMENTALHEALTHBUDDY

## ⚡ THE ULTIMATE COMMAND (USE THIS!)

```bash
npm run start:all
```

**That's it! Just copy, paste, and press Enter!** 🚀

This single command:
- ✅ Kills all stale processes automatically
- ✅ Frees up ports 3001 and 5000
- ✅ Starts backend (Express on port 3001)
- ✅ Starts frontend (Vite on port 5000)
- ✅ Shows color-coded logs (SERVER in cyan, CLIENT in magenta)
- ✅ Auto-restarts on code changes (Hot Module Replacement)

---

## Alternative One-Paste Commands

### Start Development (Same as above)
```bash
npm run dev
```

### Restart Everything Fresh
```bash
npm run restart
```
Kills processes, frees ports, and starts fresh.

### Nuclear Restart (Maximum Cleanup)
```bash
bash scripts/smart-restart.sh
```
When normal restart doesn't work.

### Check Health
```bash
npm run health
```
Validates both backend and frontend are running.

### Stop Everything
```bash
npm run kill
```
Immediately stops all Node.js processes.

---

## Production Commands

### Build for Production
```bash
npm run build
```
Creates optimized 56KB brotli bundles.

### Analyze Bundle Size
```bash
npm run build:analyze
```
Generates interactive bundle visualizer.

### Start Production Server
```bash
npm start
```
Runs production build.

---

## Quick Reference

| What You Want | Command |
|---------------|---------|
| Start app | `npm run start:all` |
| Restart cleanly | `npm run restart` |
| Check if running | `npm run health` |
| Stop app | `npm run kill` |
| Build for prod | `npm run build` |
| See bundle size | `npm run build:analyze` |

---

## Success Looks Like

```
[SERVER] ✅ Server running on port 3001 (development mode)
[CLIENT] VITE v7.1.12 ready in XXX ms
[CLIENT] ➜  Local:   http://localhost:5000/
```

Now visit http://localhost:5000 in your browser! 🎉

---

## Troubleshooting

**Problem:** Port already in use  
**Solution:** Run `npm run restart`

**Problem:** App won't start  
**Solution:** Run `bash scripts/smart-restart.sh`

**Problem:** Want to verify it's working  
**Solution:** Run `npm run health`

---

**Remember: 99% of the time, you only need `npm run start:all`!** ✨
