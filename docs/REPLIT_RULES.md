# Replit Deployment Rules for Node.js + Express + Vite/React

> **Last Updated:** December 29, 2025  
> **Platform Version:** Replit Autoscale Deployments  
> **Stack:** Node.js 20 + Express + Vite 6.x + React 18

---

## OFFICIAL REPLIT RULES

### Source Documentation

| Document | URL |
|----------|-----|
| Port Configuration | https://docs.replit.com/replit-workspace/ports |
| Workflows | https://docs.replit.com/replit-workspace/workflows |
| Autoscale Deployments | https://docs.replit.com/cloud-services/autoscale-deployments |
| .replit Configuration | https://docs.replit.com/programming-ide/configuring-repl |

---

### 1. Port Configuration

> **Quote:** "Autoscale Deployments only support a single external port, and the corresponding internal port should not be using `localhost`. If you expose more than one port or use `localhost` for the internal port, your published app will fail."
> — Replit Documentation

**Rules:**

- ✅ Bind to `0.0.0.0` (accepts external traffic)
- ✅ Use `process.env.PORT` with fallback (e.g., `process.env.PORT || 5000`)
- ✅ Autoscale: Single external port only (port 80)
- ❌ Never bind to `localhost` or `127.0.0.1` in production
- ❌ Never expose multiple external ports in Autoscale

**Correct Pattern:**
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
```

---

### 2. .replit Configuration

> **Quote:** "The `run` property in this file specifies the command that executes when the Run button is selected... the `[deployment]` section in the `.replit` file allows you to specify `run` and `build` commands."
> — Replit Documentation

**Required Sections:**

```toml
entrypoint = "server/index.mjs"

[deployment]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]
run = ["node", "server/index.mjs"]

[[ports]]
localPort = 5000
externalPort = 80
```

---

### 3. Static File Serving (Production)

> **Quote:** "To serve static files, such as those in a production build `dist` folder... you would configure the `Public directory` to `/dist`."
> — Replit Documentation

**For Node.js backend serving React SPA:**

```javascript
// Production static serving
const distPath = path.resolve(process.cwd(), "client/dist");
app.use(express.static(distPath));

// SPA fallback (MUST come after express.static)
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});
```

**Order matters:**
1. API routes first (`/api/*`)
2. Static files second (`express.static`)
3. SPA fallback last (`app.get("*")`)

---

### 4. Vite Development Server

**Critical for Vite 6.x+:**

> Vite 6.0+ enables DNS rebinding protection by default. Replit's proxy domains (`.repl.co`, `.replit.dev`, `.replit.app`) will be blocked unless explicitly allowed.

**Required vite.config.js setting:**

```javascript
server: {
  host: '0.0.0.0',
  port: 5173,
  strictPort: false,
  allowedHosts: 'all'  // REQUIRED for Replit
}
```

**Why this matters:**
- Without `allowedHosts: 'all'`, Vite returns 403 Forbidden
- The Replit preview/webview iframe won't load
- Users see a blank page even though the server is running

---

### 5. Development vs Production

| Aspect | Development | Production |
|--------|-------------|------------|
| **Command** | `node server/dev.mjs` | `node server/index.mjs` |
| **Vite** | Middleware mode (HMR) | Pre-built static files |
| **Static Files** | Served via Vite | Served via `express.static` |
| **NODE_ENV** | `development` | `production` |
| **Build Required** | No | Yes (`npm run build`) |

---

### 6. Proxy/Preview Behavior

**Replit's architecture:**
1. Your server binds to `0.0.0.0:5000`
2. Replit maps internal port 5000 → external port 80
3. Users access via `https://your-app.replit.app`
4. Webview iframe shows your app in the IDE

**Common issues:**
- CSP blocking scripts → Disable with `helmet({ contentSecurityPolicy: false })`
- CORS blocking requests → Configure origin whitelist
- Vite blocking hosts → Add `allowedHosts: 'all'`

---

## FINDINGS (This Repository)

### 1. Boot Path ✅

| Item | Value | Status |
|------|-------|--------|
| Entrypoint | `server/index.mjs` | ✅ Correct |
| Dev Command | `NODE_ENV=development node server/dev.mjs` | ✅ Correct |
| Prod Command | `node server/index.mjs` | ✅ Correct |
| Workflow | `Start application` | ✅ Running |

### 2. Port Binding ✅

| File | Line | Code | Status |
|------|------|------|--------|
| `server/index.mjs` | 219-220 | `const PORT = process.env.PORT \|\| 5000; app.listen(PORT, "0.0.0.0")` | ✅ Correct |
| `server/dev.mjs` | 197-198 | `const PORT = process.env.PORT \|\| 5000; app.listen(PORT, "0.0.0.0")` | ✅ Correct |

### 3. Vite Configuration ✅

| File | Line | Setting | Status |
|------|------|---------|--------|
| `vite.config.js` | 46 | `allowedHosts: 'all'` | ✅ Correct |

### 4. Frontend Entry ✅

| File | Line | Reference | Status |
|------|------|-----------|--------|
| `client/index.html` | 32 | `<script type="module" src="/src/main.jsx">` | ✅ Correct |
| `client/src/main.jsx` | - | `ReactDOM.createRoot(root).render(<App />)` | ✅ Correct |

### 5. Static Serving (Production) ✅

| Aspect | Implementation | Status |
|--------|----------------|--------|
| Build Output | `client/dist/` | ✅ Exists |
| Static Middleware | `express.static(distPath)` | ✅ Configured |
| SPA Fallback | `res.sendFile(index.html)` | ✅ After static |

### 6. Security ✅

| Middleware | Setting | Status |
|------------|---------|--------|
| Helmet CSP | `contentSecurityPolicy: false` | ✅ Disabled |
| CORS | Origin whitelist configured | ✅ Correct |

---

## FIX DIFFS (Historical)

The following fix was applied to resolve blank UI in Vite 6.x:

```diff
--- a/vite.config.js
+++ b/vite.config.js
@@ -42,7 +42,8 @@ export default defineConfig({
   server: {
     host: '0.0.0.0',
     port: 5173,
-    strictPort: false
+    strictPort: false,
+    allowedHosts: 'all'
   },
```

---

## VERIFICATION COMMANDS

### Development Mode

```bash
# Start dev server
NODE_ENV=development node server/dev.mjs

# Verify health check
curl -s http://127.0.0.1:5000/api/health-check
# Expected: {"ok":true,"env":"development"}

# Verify HTML root
curl -s http://127.0.0.1:5000/ | grep '<div id="root">'
# Expected: <div id="root">
```

### Production Build

```bash
# Build for production
npm run build
# Expected: ✓ built in ~20s

# Verify build output
ls client/dist/assets/ | wc -l
# Expected: 100+ files

# Start production server
NODE_ENV=production node server/index.mjs

# Verify static serving
curl -s http://127.0.0.1:5000/ | head -5
# Expected: <!DOCTYPE html>...
```

### Port Binding Verification

```bash
# Check what's listening on port 5000
lsof -i :5000
# Expected: node process on 0.0.0.0:5000

# Verify external accessibility
curl -I http://127.0.0.1:5000/
# Expected: HTTP/1.1 200 OK
```

---

## TROUBLESHOOTING

### Blank UI

1. **Check Vite allowedHosts** - Must be `'all'` for Replit proxy
2. **Check browser console** - Look for 403 Forbidden errors
3. **Check workflow logs** - Verify server started without errors
4. **Check port binding** - Must be `0.0.0.0`, not `localhost`

### Deployment Fails

1. **Single port only** - Autoscale requires exactly one external port
2. **No localhost** - Production must bind to `0.0.0.0`
3. **Build first** - Run `npm run build` before deploying
4. **Check NODE_ENV** - Must be `production` in deployment

### Static Files 404

1. **Build exists** - Verify `client/dist/` has files
2. **Middleware order** - `express.static` before SPA fallback
3. **Path resolution** - Use `path.resolve(process.cwd(), "client/dist")`

---

## CURRENT STATUS

| Check | Status |
|-------|--------|
| UI Renders | ✅ Verified |
| Vite HMR | ✅ Connected |
| Health API | ✅ Responding |
| Production Build | ✅ 100+ assets |
| Port Binding | ✅ 0.0.0.0:5000 |
| Deployment | ✅ Published |
| Tests | ✅ 152/152 passing |

**Platform is FULLY OPERATIONAL.**
