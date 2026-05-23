# Phase 45 — /readyz Contract Inspection

## Purpose
Inspect why /readyz returns SPA HTML instead of a small readiness JSON payload.

## Rules
- No source code modified
- No refactor
- No auth/database/routes/UI/deployment/.replit/infrastructure changes

## Production Checks
### Headers
HTTP/2 200 
accept-ranges: bytes
access-control-allow-credentials: true
cache-control: public, max-age=0
content-length: 10652
content-security-policy: script-src 'self' 'unsafe-inline' https://js.stripe.com;style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;connect-src 'self' https://api.stripe.com https://api.openai.com https://r.stripe.com;img-src 'self' data: blob: https:;font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net;frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://m.stripe.network;default-src 'self';base-uri 'self';form-action 'self';frame-ancestors 'self';object-src 'none';script-src-attr 'none';upgrade-insecure-requests
content-type: text/html; charset=UTF-8
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-origin
date: Sat, 23 May 2026 01:34:25 GMT
etag: W/"299c-19e5244b4d8"
last-modified: Sat, 23 May 2026 00:38:15 GMT
origin-agent-cluster: ?1
referrer-policy: no-referrer
strict-transport-security: max-age=63072000; includeSubDomains
strict-transport-security: max-age=31536000; includeSubDomains
vary: Origin
x-content-type-options: nosniff
x-dns-prefetch-control: off
x-download-options: noopen
x-frame-options: SAMEORIGIN
x-permitted-cross-domain-policies: none
x-request-id: 3aecd428-c2d7-4cfc-83af-c31fd18ff008
x-xss-protection: 0
via: 1.1 google
alt-svc: h3=":443"; ma=2592000,h3-29=":443"; ma=2592000


### Body size
10652 /tmp/readyz.body

### Body preview
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MyMentalHealthBuddy by The Genuine Love Project — Live in Genuine Love</title>
    <meta name="description" content="Free emotional wellness companion. Gentle check-ins, breathing exercises, and a warm AI companion. Private. No judgment. Always free." />
    <meta name="author" content="MyMentalHealthBuddy by The Genuine Love Project" />
    <meta name="keywords" content="mental wellness, self-love, healing, emotional growth, AI therapy, mood tracking, journaling, mindfulness, trauma recovery, self-care, MyMentalHealthBuddy" />
    <meta name="application-name" content="MyMentalHealthBuddy" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="MyMentalHealthBuddy" />
    <meta name="mobile-web-app-capable" content="yes" />
    
    <meta property="og:title" content="MyMentalHealthBuddy by The Genuine Love Project — Live in Genuine Love" />
    <meta property="og:description" content="A safe space to track your mood, journal your thoughts, and connect with compassionate AI support." />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://mymentalhealthbuddy.com/brand/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="MyMentalHealthBuddy by The Genuine Love Project - Mental Wellness Platform" />
    <meta property="og:url" content="https://mymentalhealthbuddy.com" />
    <meta property="og:site_name" content="MyMentalHealthBuddy by The Genuine Love Project" />
    <meta property="og:locale" content="en_US" />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="MyMentalHealthBuddy by The Genuine Love Project" />
    <meta name="twitter:description" content="A safe, private space for healing, reflection, and genuine love." />
    <meta name="twitter:image" content="https://mymentalhealthbuddy.com/brand/og-image.png" />
    <meta name="twitter:image:alt" content="MyMentalHealthBuddy by The Genuine Love Project - Mental Wellness Platform" />
    <meta name="twitter:creator" content="@genuineloveproj" />
    <meta name="twitter:site" content="@genuineloveproj" />
    
    <meta name="robots" content="index, follow" />
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
    
    <link rel="canonical" href="https://mymentalhealthbuddy.com/" />
    

## Route Search
server/routes/observability.mjs:47:  // which lives at /api/health). Operators alert on this rolling up to red
server/routes/health.mjs:11:// Bounds the latency of /api/health/ready so a hung DB cannot block the
server/routes/health.mjs:276:        const warmPaths = ["/api/health", "/api/health/ready", "/api/health/live"];
server/routes/health.mjs:480:        const warmTargets = ["/api/health", "/api/health/ready", "/api/wellness-tools/all", "/api/wisdom", "/api/gratitude", "/api/reflection", "/api/prompts/daily"];
server/routes/health.mjs:661:        const warmPaths = ["/api/health", "/api/health/ready", "/api/wellness-tools/all", "/api/wisdom", "/api/gratitude"];
server/middleware/rateLimit.mjs:65:    if (req.path === "/api/health") return next();
server/tests/app.mjs:7:  app.get("/api/health", (req, res) => {
server/observability/tracing.mjs:126:                url === "/api/health" ||
server/app.mjs:85:app.get("/healthz", (_req, res) => {
server/app.mjs:89:app.head("/healthz", (_req, res) => {
server/app.mjs:167:app.use("/api/health", healthRoutes);
server/app.mjs:233:// /api/session-boundary and /api/health mounts.
server/app.mjs:290:// /healthz and /api/health/* — these guards return 404 + JSON pointing to
server/app.mjs:294:// /health and /live remain 404 canonical-guards (point clients at /api/health/*).
server/app.mjs:296:// the canonical /api/health/ready and /api/health/metrics continue to serve
server/app.mjs:299:  "/health": "/api/health",
server/app.mjs:300:  "/live": "/api/health/live",
client/src/pages/admin/CommandCenter.jsx:70:    { id: 'health', label: 'System Health', endpoint: '/api/health' },
client/src/pages/admin/CommandCenter.jsx:270:    queryKey: ['/api/health'],
client/src/pages/admin/SecurityDashboard.jsx:41:    queryKey: ['/api/health'],
client/src/pages/admin/EngagementDashboard.jsx:21:    queryKey: ['/api/health'],
client/src/pages/admin/ContentStudioAdmin.jsx:34:    queryKey: ['/api/health'],
client/src/pages/admin/AdminUsers.jsx:23:    queryKey: ['/api/health'],
client/src/pages/admin/SystemAlerts.jsx:28:    queryKey: ['/api/health'],
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:49:          await fetch('/api/health', { credentials: 'include' });
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:60:          await fetch('/api/health', { credentials: 'include' });
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:70:        try { await fetch('/api/health', { credentials: 'include', cache: 'no-store' }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:74:        try { await fetch('/api/health', { credentials: 'include', headers: { 'Cache-Control': 'no-cache' } }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:85:        try { await fetch('/api/health', { credentials: 'include' }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:95:        try { await fetch('/api/health', { credentials: 'include' }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:99:        try { await fetch('/api/health', { credentials: 'include' }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:103:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'repair-git' }) }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:107:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'validate-env' }) }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:111:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'prune-logs' }) }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:115:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'health-deep-scan' }) }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:119:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'rebuild-cache' }) }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:123:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'optimize-queries' }) }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:127:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'check-routes' }) }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:131:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-sessions' }) }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:135:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'warm-all' }) }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:139:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'audit-middleware' }) }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:143:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'check-disk' }) }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:147:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-stripe' }) }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:151:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-resend' }) }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:155:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'check-openai' }) }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:159:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'vacuum-db' }) }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:163:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'table-health' }) }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:167:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'index-health' }) }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:171:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'dependency-audit' }) }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:175:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'security-headers-audit' }) }); } catch {}
client/src/pages/admin/_adminTools/AIRepairCenter.jsx:179:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'optimize-all' }) }); } catch {}
client/src/pages/admin/_adminTools/DailyOpsRunbook.jsx:101:    try { await fetch('/api/health/git-status', { credentials: 'include' }); } catch {}
client/src/pages/admin/_adminTools/DailyOpsRunbook.jsx:107:    try { await fetch('/api/health/platform-integrity', { credentials: 'include' }); } catch {}
client/src/pages/admin/_adminTools/DailyOpsRunbook.jsx:115:        fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-stripe' }) }).catch(() => {}),
client/src/pages/admin/_adminTools/DailyOpsRunbook.jsx:116:        fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-resend' }) }).catch(() => {}),
client/src/pages/admin/_adminTools/DailyOpsRunbook.jsx:117:        fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'check-openai' }) }).catch(() => {}),
client/src/pages/admin/_adminTools/DailyOpsRunbook.jsx:141:    try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'warm-all' }) }).catch(() => {}); } catch {}
client/src/pages/admin/_adminTools/DailyOpsRunbook.jsx:147:    try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'rebuild-cache' }) }).catch(() => {}); } catch {}
client/src/pages/admin/_adminTools/DailyOpsRunbook.jsx:153:    try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'optimize-all' }) }).catch(() => {}); } catch {}
client/src/pages/admin/_adminTools/DailyOpsRunbook.jsx:274:                  <button onClick={() => fetch('/api/health/git-status', { credentials: 'include' }).catch(() => {})} className="text-[10px] px-2 py-1 rounded bg-violet-500 text-white hover:bg-violet-600 transition-colors" data-testid="button-runbook-git">Scan</button>
client/src/pages/admin/_adminTools/DailyOpsRunbook.jsx:277:                  <button onClick={() => fetch('/api/health/platform-integrity', { credentials: 'include' }).catch(() => {})} className="text-[10px] px-2 py-1 rounded bg-teal-500 text-white hover:bg-teal-600 transition-colors" data-testid="button-runbook-deep-scan">Scan</button>
client/src/pages/admin/_adminTools/DailyOpsRunbook.jsx:280:                  <button onClick={() => Promise.all(['verify-stripe', 'verify-resend', 'check-openai'].map(cmd => fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: cmd }) }).catch(() => {})))} className="text-[10px] px-2 py-1 rounded bg-cyan-500 text-white hover:bg-cyan-600 transition-colors" data-testid="button-runbook-service-verify">Verify</button>
client/src/pages/admin/_adminTools/DailyOpsRunbook.jsx:283:                  <button onClick={() => fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'warm-all' }) }).catch(() => {})} className="text-[10px] px-2 py-1 rounded bg-orange-500 text-white hover:bg-orange-600 transition-colors" data-testid="button-runbook-warm">Warm</button>
client/src/pages/admin/_adminTools/DailyOpsRunbook.jsx:286:                  <button onClick={() => fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'rebuild-cache' }) }).catch(() => {})} className="text-[10px] px-2 py-1 rounded bg-indigo-500 text-white hover:bg-indigo-600 transition-colors" data-testid="button-runbook-cache">Rebuild</button>
client/src/pages/admin/_adminTools/DailyOpsRunbook.jsx:289:                  <button onClick={() => fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'optimize-all' }) }).catch(() => {})} className="text-[10px] px-2 py-1 rounded bg-gradient-to-r from-emerald-500 to-blue-500 text-white hover:from-emerald-600 hover:to-blue-600 transition-colors" data-testid="button-runbook-optimize-all">Optimize</button>
client/src/pages/admin/_adminTools/PlatformCoverageReport.jsx:302:      const resp = await fetch('/api/health/repair', {
client/src/pages/admin/_adminTools/GitIntegrityScanner.jsx:17:      const resp = await fetch('/api/health/git-status', { credentials: 'include' });
client/src/pages/admin/_adminTools/GitIntegrityScanner.jsx:26:      const resp = await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'repair-git' }) });
client/src/pages/admin/_adminTools/PlatformIntegrityDeepScan.jsx:16:      const resp = await fetch('/api/health/platform-integrity', { credentials: 'include' });
client/src/pages/admin/_adminTools/PlatformIntegrityDeepScan.jsx:24:      const resp = await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'validate-env' }) });
client/src/pages/admin/AdminTools.jsx.phase1.bak:243:  "load-balancer-health": { suggestion: "Load balancer health check may be failing. Canva KB: Ensure /api/health endpoint responds within 5 seconds with 200 status. Check timeout and retry settings.", action: "Verify health endpoint", knowledgeBase: "Canva", autoFixable: true, fixCommand: "warm-all" },
client/src/pages/admin/AdminTools.jsx.phase1.bak:434:      { id: "health-api", label: "Health Monitor", endpoint: "/api/health", icon: Activity, desc: "System health" },
client/src/pages/admin/AdminTools.jsx.phase1.bak:436:      { id: "integrations", label: "Integration Health", endpoint: "/api/health", icon: Puzzle, desc: "Service integrations" },
client/src/pages/admin/AdminTools.jsx.phase1.bak:438:      { id: "api-core", label: "Core API", endpoint: "/api/health", icon: Terminal, desc: "Base API health endpoint" },
client/src/pages/admin/AdminTools.jsx.phase1.bak:469:  { id: "health-api", label: "System Health", endpoint: "/api/health", icon: Activity, desc: "Server & DB status" },
client/src/pages/admin/AdminTools.jsx.phase1.bak:891:          await fetch('/api/health', { credentials: 'include' });
client/src/pages/admin/AdminTools.jsx.phase1.bak:902:          await fetch('/api/health', { credentials: 'include' });
client/src/pages/admin/AdminTools.jsx.phase1.bak:912:        try { await fetch('/api/health', { credentials: 'include', cache: 'no-store' }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:916:        try { await fetch('/api/health', { credentials: 'include', headers: { 'Cache-Control': 'no-cache' } }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:927:        try { await fetch('/api/health', { credentials: 'include' }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:937:        try { await fetch('/api/health', { credentials: 'include' }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:941:        try { await fetch('/api/health', { credentials: 'include' }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:945:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'repair-git' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:949:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'validate-env' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:953:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'prune-logs' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:957:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'health-deep-scan' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:961:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'rebuild-cache' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:965:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'optimize-queries' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:969:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'check-routes' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:973:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-sessions' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:977:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'warm-all' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:981:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'audit-middleware' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:985:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'check-disk' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:989:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-stripe' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:993:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-resend' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:997:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'check-openai' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:1001:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'vacuum-db' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:1005:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'table-health' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:1009:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'index-health' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:1013:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'dependency-audit' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:1017:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'security-headers-audit' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:1021:        try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'optimize-all' }) }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:1525:      const resp = await fetch('/api/health/repair', {
client/src/pages/admin/AdminTools.jsx.phase1.bak:1569:      const resp = await fetch('/api/health/git-status', { credentials: 'include' });
client/src/pages/admin/AdminTools.jsx.phase1.bak:1578:      const resp = await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'repair-git' }) });
client/src/pages/admin/AdminTools.jsx.phase1.bak:1684:      const resp = await fetch('/api/health/platform-integrity', { credentials: 'include' });
client/src/pages/admin/AdminTools.jsx.phase1.bak:1692:      const resp = await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'validate-env' }) });
client/src/pages/admin/AdminTools.jsx.phase1.bak:1918:    try { await fetch('/api/health/git-status', { credentials: 'include' }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:1924:    try { await fetch('/api/health/platform-integrity', { credentials: 'include' }); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:1932:        fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-stripe' }) }).catch(() => {}),
client/src/pages/admin/AdminTools.jsx.phase1.bak:1933:        fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'verify-resend' }) }).catch(() => {}),
client/src/pages/admin/AdminTools.jsx.phase1.bak:1934:        fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'check-openai' }) }).catch(() => {}),
client/src/pages/admin/AdminTools.jsx.phase1.bak:1958:    try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'warm-all' }) }).catch(() => {}); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:1964:    try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'rebuild-cache' }) }).catch(() => {}); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:1970:    try { await fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'optimize-all' }) }).catch(() => {}); } catch {}
client/src/pages/admin/AdminTools.jsx.phase1.bak:2091:                  <button onClick={() => fetch('/api/health/git-status', { credentials: 'include' }).catch(() => {})} className="text-[10px] px-2 py-1 rounded bg-violet-500 text-white hover:bg-violet-600 transition-colors" data-testid="button-runbook-git">Scan</button>
client/src/pages/admin/AdminTools.jsx.phase1.bak:2094:                  <button onClick={() => fetch('/api/health/platform-integrity', { credentials: 'include' }).catch(() => {})} className="text-[10px] px-2 py-1 rounded bg-teal-500 text-white hover:bg-teal-600 transition-colors" data-testid="button-runbook-deep-scan">Scan</button>
client/src/pages/admin/AdminTools.jsx.phase1.bak:2097:                  <button onClick={() => Promise.all(['verify-stripe', 'verify-resend', 'check-openai'].map(cmd => fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: cmd }) }).catch(() => {})))} className="text-[10px] px-2 py-1 rounded bg-cyan-500 text-white hover:bg-cyan-600 transition-colors" data-testid="button-runbook-service-verify">Verify</button>
client/src/pages/admin/AdminTools.jsx.phase1.bak:2100:                  <button onClick={() => fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'warm-all' }) }).catch(() => {})} className="text-[10px] px-2 py-1 rounded bg-orange-500 text-white hover:bg-orange-600 transition-colors" data-testid="button-runbook-warm">Warm</button>
client/src/pages/admin/AdminTools.jsx.phase1.bak:2103:                  <button onClick={() => fetch('/api/health/repair', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ command: 'rebuild-cache' }) }).catch(() => {})} className="text-[10px] px-2 py-1 rounded bg-indigo-500 text-white hover:bg-indigo-600 transition-colors" data-testid="button-runbook-cache">Rebuild</button>

## Git State
?? docs/reports/PHASE_45_READYZ_CONTRACT_INSPECTION.md
c63120900 Confirm production monitoring endpoints are operational and crisis page is live
5ac0617bf docs(monitoring): phase 44 production canary baseline
4e94f83ac Update application data and logs to reflect recent activity
e46d969b6 docs(security): phase 41 remediation plan
8a808388d Create a security remediation plan for moderate vulnerabilities
7a40b9c93 Update security audit report to reflect dependency vulnerability findings
65628dc60 Published your App
30a832f7d Update security audit to address vulnerabilities in dependencies
