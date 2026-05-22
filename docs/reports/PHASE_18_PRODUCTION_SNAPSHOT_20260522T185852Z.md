# MMHB Phase 18 — Final Production Snapshot

**Generated:** 2026-05-22T18:58:52Z
**Domain:** mymentalhealthbuddy.com
**Governance:** MMHB v7.4 Archival Kernel
**HEAD:** `37ef02c64` (37ef02c6410cccd71654963f63bd60192705d495)

---

## 1. Domain Routes — Pass/Fail

| URL | Status |
|---|---|
| `https://mymentalhealthbuddy.com/` | 200 |
| `https://www.mymentalhealthbuddy.com/` | 200 |
| `https://mymentalhealthbuddy.com/crisis` | 200 |
| `https://mymentalhealthbuddy.com/about` | 200 |

## 2. Health Endpoints

| Endpoint | Status |
|---|---|
| `/api/health` | 200 |
| `/ready` | 200 |
| `/metrics` | 200 |
| `/healthz` | 200 |

## 3. SEO / PWA Public Files

| File | Status |
|---|---|
| `/robots.txt` | 200 |
| `/sitemap.xml` | 200 (**41 URLs**) |
| `/manifest.json` | 200 |
| `/favicon.ico` | 200 |

## 4. Security Headers (apex /)

```
content-security-policy: script-src 'self' 'unsafe-inline' https://js.stripe.com;style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;connect-src 'self' https://api.stripe.com https://api.openai.com https://r.stripe.com;img-src 'self' data: blob: https:;font-src 'self' data: https://fonts.gstatic.com https://cdn.jsdelivr.net;frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://m.stripe.network;default-src 'self';base-uri 'self';form-action 'self';frame-ancestors 'self';object-src 'none';script-src-attr 'none';upgrade-insecure-requests
cross-origin-opener-policy: same-origin
cross-origin-resource-policy: same-origin
origin-agent-cluster: ?1
referrer-policy: no-referrer
strict-transport-security: max-age=63072000; includeSubDomains
strict-transport-security: max-age=31536000; includeSubDomains
x-content-type-options: nosniff
x-frame-options: SAMEORIGIN
x-request-id: cf947927-4807-4224-abbc-cdb86c46775c
```

## 5. TLS Certificates

**Apex:**
```
notBefore=May 22 02:57:23 2026 GMT
notAfter=Aug 20 02:57:22 2026 GMT
```

**WWW:**
```
notBefore=May 22 02:10:59 2026 GMT
notAfter=Aug 20 02:10:58 2026 GMT
```

## 6. Git Sync

- **HEAD:** `37ef02c64`
- **origin/main vs HEAD (behind ahead):** `0	0`
- **Working tree:** clean

```

```

**Recent commits:**

```
37ef02c64 docs: add final production launch snapshot
6444b002f Update project dependencies for improved performance and stability
71dbd7f0c Published your App
81d8db345 Published your App
071e9efeb Published your App
```

## 7. Build Gate

- **Command:** `npm run build`
- **Exit code:** 0
- **Duration:** 43s
- **client/dist size:** 36M
- **index.html size:** 8379 bytes

```
  - vite:asset (5%)
  - visualizer (4%)
See https://rolldown.rs/options/checks#plugintimings for more details.

✓ built in 41.97s
```

---

## 8. Deferred TODOs

### TODO-18.1: www → apex 301 redirect (LOW PRIORITY)

- **Current state:** Both `mymentalhealthbuddy.com` and `www.mymentalhealthbuddy.com` return HTTP 200 independently with full app + security headers.
- **Desired state:** `www.mymentalhealthbuddy.com` returns HTTP 301 → `https://mymentalhealthbuddy.com/$REQUEST_URI` so the apex is the sole canonical hostname.
- **Why deferred:** Non-blocking. The `<link rel="canonical">` tag in `client/index.html` already points to the apex, so search engines consolidate signals correctly. Duplicate-content risk is mitigated.
- **Recommended fix (smallest engine):** Replit Deployments → Settings → Domains → edit `www.mymentalhealthbuddy.com` → enable "Redirect to primary domain" toggle. Zero code change. Edge-level redirect.
- **Fallback fix:** Add a host-check middleware in `server/app.mjs` before route handlers that 301-redirects `www.*` to apex. Build-gated; additive; host-scoped.
- **Verification command after fix:**
  ```bash
  curl -sS -o /dev/null -w "www HTTP %{http_code} -> %{redirect_url}\n" https://www.mymentalhealthbuddy.com/
  # Expected: HTTP 301 -> https://mymentalhealthbuddy.com/
  ```

### TODO-18.2: 7 npm vulnerabilities classified (DO NOT auto-fix)

- **Status:** Classified in Phase 11; all fixes are `isSemVerMajor: true`.
- **Composition:** 3 HIGH (OTel cluster) + 4 MODERATE (drizzle-kit/esbuild cluster).
- **Action:** Manual major-version upgrade plan required. **Do NOT run `npm audit fix --force`** (would silently introduce breaking changes to instrumentation + DB tooling).

### TODO-18.3: SPA-fallback text files (COSMETIC)

- `/llms.txt`, `/humans.txt`, `/security.txt`, `/.well-known/security.txt`, `/ads.txt` return HTTP 200 but serve `index.html` (8379 bytes) via SPA fallback rather than real text files.
- **Impact:** None on SEO/PWA scoring. Cosmetic only.
- **Fix scope:** Add real static files to `client/public/`. Out of Phase 18 scope.

### TODO-18.4: Duplicate HSTS header (COSMETIC)

- Two `strict-transport-security` headers present (`max-age=63072000` and `max-age=31536000`). Browsers honor the first; no functional impact.
- **Fix scope:** Locate the duplicate emission in middleware stack. Out of Phase 18 scope.

---

## Phase 18 Summary

| Gate | Result |
|---|---|
| Domain routes | PASS |
| Health endpoints | PASS |
| SEO/PWA files | PASS |
| Security headers | PASS |
| TLS certificates | PASS (both apex + www) |
| Git sync (origin/main = HEAD) | PASS |
| Build (`npm run build`) | PASS (exit 0) |

**Production snapshot status: GREEN**

---

*Report generated by Phase 18 verification. No source code modified. No refactor. No `npm audit fix --force`. Read-only verification only.*
