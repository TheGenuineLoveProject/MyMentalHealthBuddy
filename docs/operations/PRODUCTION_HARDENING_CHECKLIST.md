# MMHB Production Hardening Checklist

**Status:** Active — verification planning surface
**Last updated:** 2026-05-22 (Phase 32)
**Owner:** Engineering on-call + Architecture / Governance owner
**Mode:** verification planning only — no source modifications in this phase
**Companion docs:**
- `docs/operations/LAUNCH_APPROVAL_MATRIX.md` (Phase 30)
- `docs/operations/PRODUCTION_PROBE_CHECKLIST.md` (Phase 29)
- `docs/operations/T_MINUS_1H_LAUNCH_SIGNOFF.md` (Phase 31)
- `docs/runbooks/LAUNCH_OPERATIONS_RUNBOOK.md` (Phase 27)
- `docs/reports/PHASE_28_POST_LAUNCH_TODO_LEDGER.md` (Phase 28)

This document is the **production hardening verification plan**. Every check is a single, read-only, Replit-native command. Nothing here mutates production. Findings are routed to the Phase 28 TODO ledger for scheduling; no source modifications are made by this phase.

> **Discipline:** smallest-safe-fix-first. Each hardening item is verified, then triaged. If a fix is required, the smallest engine wins (CSS fix > React patch > new component > new page > new service) per the Governance Kernel.

Throughout this document, `${PROD}` = `https://mymentalhealthbuddy.com`.

---

## 1. Lighthouse readiness checklist

Lighthouse is run from Chrome DevTools or `npx lighthouse` against `${PROD}`. Targets below are public-beta minimums; stretch targets in parentheses.

| Category | Minimum | Stretch | Run command |
|---|---|---|---|
| Performance | ≥ 85 | ≥ 95 | `npx lighthouse ${PROD} --only-categories=performance --form-factor=desktop --quiet --output=json --output-path=/tmp/lh-perf.json` |
| Accessibility | ≥ 95 | 100 | `npx lighthouse ${PROD} --only-categories=accessibility --form-factor=desktop --quiet --output=json --output-path=/tmp/lh-a11y.json` |
| Best Practices | ≥ 95 | 100 | `npx lighthouse ${PROD} --only-categories=best-practices --form-factor=desktop --quiet --output=json --output-path=/tmp/lh-bp.json` |
| SEO | ≥ 95 | 100 | `npx lighthouse ${PROD} --only-categories=seo --form-factor=desktop --quiet --output=json --output-path=/tmp/lh-seo.json` |
| PWA | informational | — | `npx lighthouse ${PROD} --only-categories=pwa --quiet --output=json --output-path=/tmp/lh-pwa.json` |

### Routes to score

| Route | Expected score band |
|---|---|
| `/` (homepage) | Perf ≥ 85, A11y ≥ 95, SEO ≥ 95 |
| `/crisis` | Perf ≥ 90 (text-heavy), A11y = 100 (BHCE surface), SEO ≥ 95 |
| `/login` | Perf ≥ 85, A11y ≥ 95 |
| `/journal` (auth-gated, dev only) | Perf ≥ 85, A11y ≥ 95 |
| `/dashboard` (auth-gated, dev only) | Perf ≥ 80 (data-rich), A11y ≥ 95 |

### Lighthouse opportunities → triage

Any `opportunities` array entry with `details.overallSavingsMs > 200ms` is logged as a TODO candidate in the Phase 28 ledger. Items below the threshold are noted but not scheduled.

**Pass criteria:** all 4 categories ≥ minimum on `/` and `/crisis`. Other routes are informational at v1.0.0.

---

## 2. Accessibility verification matrix

Sources: WCAG AA (user preference declared in `replit.md`), MMHB v7.4 kernel (calm, consent-based language), Lighthouse a11y category.

| # | Check | How to verify | Pass criterion |
|---|---|---|---|
| 1 | Color contrast | Lighthouse + manual spot-check on brand accents (`#A8C9A0`, `#FFD93D`, `#FF9A8B`, `#74C0FC`, `#C8B6FF`, `#A8D5BA`, `#FFB88C`, `#E8913A` against cream/white) | text ≥ 4.5:1, large text ≥ 3:1 |
| 2 | All images have alt text | `curl -s ${PROD}/ \| grep -oE "<img[^>]*>" \| grep -vc "alt="` | 0 |
| 3 | Form labels present | manual: login, journal entry forms | every input has `<label>` or `aria-label` |
| 4 | Skip-to-content link | `curl -s ${PROD}/ \| grep -ci "skip.to.main\|skip.to.content"` | ≥ 1 |
| 5 | Semantic landmarks | `curl -s ${PROD}/ \| grep -oE "<(main\|nav\|header\|footer\|aside)" \| sort -u` | ≥ 4 distinct landmarks |
| 6 | Heading hierarchy | manual: no h1→h3 skips on `/`, `/crisis` | sequential |
| 7 | Keyboard navigation | manual: Tab through `/crisis` end-to-end | every interactive element reachable, no traps |
| 8 | Focus indicators visible | manual: Tab through `/` | visible outline on every focused element |
| 9 | `prefers-reduced-motion` honored | manual: enable in OS, verify particles `display:none`, animations off | per universal contracts in `replit.md` |
| 10 | ARIA live regions for toast/error | grep source (post-launch audit) | live regions present for dynamic feedback |
| 11 | Lang attribute | `curl -s ${PROD}/ \| grep -E "<html[^>]*lang="` | `lang="en"` present |
| 12 | Trauma-informed language audit | manual review of `/crisis`, `/journal` copy | no clinical / diagnostic / coercive phrasing |

**Pass criteria:** rows 1, 2, 3, 11, 12 are launch-blocking. Rows 4–10 are S2 if failing.

---

## 3. Core Web Vitals targets

Measured per route via Lighthouse (lab) + CrUX (field) post-launch.

| Metric | Definition | Good | Needs Improvement | Poor |
|---|---|---|---|---|
| **LCP** | Largest Contentful Paint | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| **INP** | Interaction to Next Paint | ≤ 200ms | ≤ 500ms | > 500ms |
| **CLS** | Cumulative Layout Shift | ≤ 0.10 | ≤ 0.25 | > 0.25 |
| **FCP** | First Contentful Paint | ≤ 1.8s | ≤ 3.0s | > 3.0s |
| **TTFB** | Time to First Byte | ≤ 0.8s | ≤ 1.8s | > 1.8s |

**Per-route targets (lab, desktop):**

| Route | LCP | INP | CLS | TTFB |
|---|---|---|---|---|
| `/` | ≤ 2.5s | ≤ 200ms | ≤ 0.10 | ≤ 0.5s |
| `/crisis` | ≤ 1.5s (text-only) | ≤ 200ms | ≤ 0.05 | ≤ 0.5s |
| `/dashboard` | ≤ 3.0s | ≤ 300ms | ≤ 0.10 | ≤ 0.8s |

**Baseline (Phase 23):** TTFB ~185 ms across probed routes. LCP/INP/CLS not yet field-measured.

**Pass criteria:** `/` and `/crisis` LCP, INP, CLS all in "Good" band at T-1h Lighthouse run.

---

## 4. Image optimization audit

Phase 26 baseline: 35 MB total dist, 14.8 MB avatar PNGs identified as top opportunity (TODO-26.1).

### 4.1 Inventory commands

```bash
# Total image footprint
find client/dist -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" -o -name "*.avif" -o -name "*.svg" \) -exec du -ch {} + | tail -1

# Top 20 largest images
find client/dist -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) -exec du -k {} + | sort -rn | head -20

# Count by format
for ext in png jpg jpeg webp avif svg; do
  count=$(find client/dist -type f -name "*.${ext}" | wc -l)
  echo "${ext}: ${count}"
done

# Images without modern format equivalent
find client/dist -type f -name "*.png" | while read f; do
  base="${f%.png}"
  [ ! -f "${base}.webp" ] && [ ! -f "${base}.avif" ] && echo "${f}"
done | wc -l
```

### 4.2 Audit checklist

| # | Check | Pass | TODO if failing |
|---|---|---|---|
| 1 | Avatar PNGs ≤ 200 KB each | per-file `du -k` | TODO-26.1 (already open) |
| 2 | Hero/banner JPEGs ≤ 300 KB each | per-file | new TODO |
| 3 | All PNGs > 100 KB have WebP/AVIF | command above | TODO-26.1 / 26.2 (already open) |
| 4 | All SVGs minified | `svgo --dry-run` (if installed) | new TODO if many savings |
| 5 | No duplicate byte-identical pairs | `find ... -exec md5sum {} + \| sort \| uniq -d -w 32` | TODO-26.3 (already open) |
| 6 | `loading="lazy"` on below-fold `<img>` | grep public HTML | new TODO if missing |
| 7 | `width`/`height` attributes set (CLS prevention) | grep public HTML | new TODO if missing |

**Pass criteria:** rows 1, 5, 7 launch-blocking. Rows 2, 3, 4, 6 are S1/S2 post-launch.

---

## 5. Bundle-size audit

Phase 24 baseline: 8 vendor chunks, 99 KB gz initial path, 0 source maps.

### 5.1 Verification commands

```bash
# Total dist size
du -sh client/dist

# JS bundle inventory
ls -lhS client/dist/assets/*.js | head -15

# CSS bundle inventory
ls -lhS client/dist/assets/*.css

# Gzipped sizes for top 5 JS
for f in $(ls -S client/dist/assets/*.js | head -5); do
  gz=$(gzip -c "$f" | wc -c)
  raw=$(wc -c < "$f")
  printf "%-60s raw=%8d  gz=%8d\n" "$(basename $f)" "$raw" "$gz"
done

# Initial path (index + vendor-react)
ls -lh client/dist/assets/index-*.js client/dist/assets/vendor-react-*.js 2>/dev/null

# Source map count (must be 0)
find client/dist -name "*.map" | wc -l

# Vendor chunk count (must be 8 per Phase 24 contract)
ls client/dist/assets/vendor-*.js 2>/dev/null | wc -l
```

### 5.2 Audit checklist

| # | Budget | Source | Pass | TODO if failing |
|---|---|---|---|---|
| 1 | Initial path ≤ 150 KB gz | Phase 24 | yes | TODO-24.1/24.3 conditional split |
| 2 | Largest JS chunk ≤ 350 KB raw | Phase 24 | yes | TODO-24.1 if WellnessDashboard crosses |
| 3 | Main CSS ≤ 100 KB gz | Phase 25 (60 KB current) | yes | new TODO if regresses |
| 4 | 0 source maps in dist | Phase 24 | yes | regression-blocking |
| 5 | 8 named vendor chunks | Phase 24 | yes | regression-blocking |
| 6 | dist ≤ 50 MB | Phase 26 | yes (35 MB current) | TODO-26.1/26.2 mid-term |
| 7 | No JS chunk > 500 KB raw (hard ceiling) | Phase 24 | yes | new S0 TODO if hit |

**Pass criteria:** rows 1–7 all PASS at T-1h. Row 7 hit = automatic NO-GO.

---

## 6. Route-by-route SEO checklist

Per-route inspection. Every public route must have title, description, canonical, OG tags.

```bash
# Title
curl -s ${PROD}/<route> | grep -oE "<title>[^<]+</title>"

# Description
curl -s ${PROD}/<route> | grep -oE '<meta name="description"[^>]*>'

# Canonical
curl -s ${PROD}/<route> | grep -oE '<link rel="canonical"[^>]*>'

# OG title + image + description
curl -s ${PROD}/<route> | grep -oE '<meta property="og:[^"]+"[^>]*>'

# Twitter card
curl -s ${PROD}/<route> | grep -oE '<meta name="twitter:[^"]+"[^>]*>'
```

### 6.1 Per-route matrix

| Route | Title | Desc | Canonical | OG | Twitter | Schema |
|---|---|---|---|---|---|---|
| `/` | ☐ | ☐ | ☐ | ☐ | ☐ | Organization |
| `/crisis` | ☐ | ☐ | ☐ | ☐ | ☐ | (none — leave clean) |
| `/login` | ☐ | ☐ | ☐ | ☐ | ☐ | — |
| `/about` (if public) | ☐ | ☐ | ☐ | ☐ | ☐ | AboutPage |
| `/blog` (if public) | ☐ | ☐ | ☐ | ☐ | ☐ | Blog |
| `/blog/<slug>` | ☐ | ☐ | ☐ | ☐ | ☐ | Article |
| `/terms` | ☐ | ☐ | ☐ | — | — | — |
| `/privacy` | ☐ | ☐ | ☐ | — | — | — |

**Pass criteria:** `/` + `/crisis` must have title, description, canonical, OG title, OG image, OG description. Twitter card and schema are S1 if missing.

---

## 7. Structured data validation

```bash
# Extract any JSON-LD blocks from homepage
curl -s ${PROD}/ | grep -oE '<script type="application/ld\+json">[^<]+</script>' | sed 's/<[^>]*>//g'
```

### 7.1 Schema audit

| Type | Where | Required at v1.0.0 |
|---|---|---|
| `Organization` | `/` | YES |
| `WebSite` (with sitelinks search) | `/` | optional |
| `Article` | `/blog/<slug>` | if blog public |
| `BreadcrumbList` | nested routes | optional |
| `FAQPage` | FAQ routes | only if no medical claims |

**Validation:**

1. Run Google's Rich Results Test: paste `${PROD}/` into https://search.google.com/test/rich-results
2. PASS criteria: no errors, warnings acceptable
3. Per MMHB v7.4 kernel: **no `MedicalEntity`, `MedicalCondition`, `MedicalTherapy`, or any medical schema**. Educational-only language must not be reinforced with medical structured data.

---

## 8. robots / sitemap verification

```bash
# robots.txt accessible
curl -s -o /dev/null -w "%{http_code}\n" ${PROD}/robots.txt
# expected: 200

# robots.txt content audit
curl -s ${PROD}/robots.txt

# sitemap.xml accessible
curl -s -o /dev/null -w "%{http_code}\n" ${PROD}/sitemap.xml
# expected: 200

# sitemap.xml URL count
curl -s ${PROD}/sitemap.xml | grep -c "<loc>"

# sitemap-referenced URLs all 200
curl -s ${PROD}/sitemap.xml | grep -oE "<loc>[^<]+</loc>" | sed 's/<[^>]*>//g' | while read url; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  echo "$code $url"
done | sort | uniq -c | head
```

### 8.1 Audit checklist

| # | Check | Pass |
|---|---|---|
| 1 | `/robots.txt` returns 200 | yes |
| 2 | robots.txt references the sitemap | `Sitemap: https://mymentalhealthbuddy.com/sitemap.xml` line present |
| 3 | robots.txt does **not** Disallow `/` | grep `^Disallow: /$` returns nothing |
| 4 | `/sitemap.xml` returns 200 | yes |
| 5 | sitemap.xml lists `/crisis` | grep returns ≥ 1 |
| 6 | All sitemap-referenced URLs return 200 | command above |
| 7 | sitemap.xml `<lastmod>` is recent | within last 30 days at launch |

**Pass criteria:** rows 1, 3, 4, 5, 6 launch-blocking. Rows 2 + 7 are S2.

---

## 9. Dependency hygiene verification

Phase 22 baseline + Phase 28 ledger (TODO-22.1 Express 4→5, TODO-22.2 OTel cluster).

```bash
# Audit for high/critical vulns
npm audit --omit=dev --audit-level=high 2>&1 | tail -20

# Outdated check (informational)
npm outdated 2>&1 | head -30

# Duplicate / phantom check
npm ls --depth=0 2>&1 | grep -E "(UNMET|invalid|extraneous)" | head

# Lockfile integrity
npm install --package-lock-only --dry-run 2>&1 | tail -5
```

### 9.1 Audit checklist

| # | Check | Pass | If failing |
|---|---|---|---|
| 1 | 0 High or Critical CVEs in production deps | `npm audit --omit=dev` | open S0 TODO, do not launch with High/Critical |
| 2 | No extraneous/invalid top-level packages | `npm ls --depth=0` | new TODO |
| 3 | Lockfile clean | `npm install --dry-run` | regenerate before launch |
| 4 | Deferred Express 4→5 still flagged | TODO-22.1 | already ledgered |
| 5 | Deferred OTel cluster still flagged | TODO-22.2 | already ledgered |

**Pass criteria:** row 1 is a hard NO-GO for launch. Rows 2–3 are S1 if regressed.

---

## 10. Unused asset / dead-code detection

```bash
# Source-side: assets referenced in source
grep -rohE "[a-zA-Z0-9_-]+\.(png|jpg|jpeg|webp|avif|svg)" client/src 2>/dev/null | sort -u > /tmp/refs.txt

# Source-side: assets present on disk
find client/src/assets attached_assets -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" -o -name "*.avif" -o -name "*.svg" \) 2>/dev/null | xargs -n1 basename | sort -u > /tmp/disk.txt

# Difference (candidates for removal — manual verification required)
comm -23 /tmp/disk.txt /tmp/refs.txt | head -50

# Duplicate dist assets by content hash
find client/dist -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.webp" \) -exec md5sum {} + | sort | uniq -d -w 32 | head -20

# Unused exports (informational — requires ts-prune or similar; not installed by default)
# npx ts-prune --error 2>&1 | head -30
```

### 10.1 Audit checklist

| # | Check | Pass |
|---|---|---|
| 1 | Source assets vs. on-disk delta inspected | manual review required — never auto-delete |
| 2 | dist duplicate byte-identical pairs catalogued | TODO-26.3 (already open) |
| 3 | Unreferenced source assets ≤ 20 files | candidates added to new S3 TODO |
| 4 | No `console.log` in production bundle | `grep -c "console\.log" client/dist/assets/*.js` ≤ 5 |
| 5 | No `debugger;` in production bundle | `grep -c "debugger" client/dist/assets/*.js` = 0 |

**Pass criteria:** rows 4, 5 are launch-blocking. Rows 1–3 are post-launch hygiene.

Per `replit.md` user preference: **Non-destructive (never delete without permission)**. This audit produces a list, not deletions.

---

## 11. CSP verification

```bash
# Extract CSP from production
curl -sI ${PROD}/ | grep -i "content-security-policy"

# If reporting endpoint configured, check
curl -sI ${PROD}/ | grep -i "content-security-policy-report-only"

# Other security headers
curl -sI ${PROD}/ | grep -iE "x-content-type-options|x-frame-options|referrer-policy|permissions-policy|cross-origin-(opener|embedder|resource)-policy"
```

### 11.1 CSP audit checklist

| # | Header | Minimum expected | Current state |
|---|---|---|---|
| 1 | `Content-Security-Policy` | present, restrictive | informational at v1.0.0 — TODO if absent |
| 2 | `X-Content-Type-Options` | `nosniff` | should be set by Replit edge |
| 3 | `X-Frame-Options` | `SAMEORIGIN` or `DENY` | should be set |
| 4 | `Referrer-Policy` | `strict-origin-when-cross-origin` | should be set |
| 5 | `Permissions-Policy` | restrictive (camera/mic/geolocation off unless needed) | TODO if absent |
| 6 | `Strict-Transport-Security` | `max-age >= 31536000; includeSubDomains; preload` | Phase 18 verified present (TODO-18.4 duplicate to dedupe) |
| 7 | No `unsafe-inline` in `script-src` (if CSP set) | yes | hardening goal |
| 8 | No `unsafe-eval` (if CSP set) | yes | hardening goal |

**Pass criteria at v1.0.0:** row 6 (HSTS) is launch-blocking (already verified by Phase 18). Rows 1–5, 7, 8 are S1/S2 post-launch hardening TODOs if missing.

---

## 12. Cache-control verification

```bash
# Hashed static assets — should be immutable, long max-age
curl -sI ${PROD}/assets/index-XXXXXX.js | grep -i cache-control
# expected: public, max-age=31536000, immutable

# HTML — should be short or no-cache (so deploys propagate)
curl -sI ${PROD}/ | grep -i cache-control
# expected: no-cache or short max-age (e.g., max-age=60)

# /crisis — must always serve fresh
curl -sI ${PROD}/crisis | grep -i cache-control
# expected: no-cache or short max-age

# /healthz, /readyz — must not be cached
curl -sI ${PROD}/healthz | grep -i cache-control
curl -sI ${PROD}/readyz | grep -i cache-control
# expected: no-cache or no-store
```

### 12.1 Cache audit checklist

| # | Surface | Expected | Hard? |
|---|---|---|---|
| 1 | Hashed JS/CSS | `public, max-age=31536000, immutable` | S1 if absent — performance impact |
| 2 | HTML entry | `no-cache` or short max-age (≤ 5 min) | launch-blocking if HTML is long-cached |
| 3 | `/crisis` | fresh on every request | BHCE-adjacent — launch-blocking |
| 4 | `/healthz`, `/readyz` | not cached | launch-blocking |
| 5 | favicon, og-image | long max-age OK | S3 |
| 6 | `/api/*` | per-endpoint, default `no-store` | per-endpoint review |

**Pass criteria:** rows 2, 3, 4 launch-blocking. Row 1 = perf TODO if regressed.

---

## 13. Final production monitoring checklist

Establishes the post-launch monitoring posture. Every signal below must be live before T-0.

| # | Signal | Source | Verification |
|---|---|---|---|
| 1 | Liveness `/healthz` | app | `curl ${PROD}/healthz` = 200 |
| 2 | Readiness `/readyz` | app | `curl ${PROD}/readyz` = 200 |
| 3 | Deployment logs streaming | Replit | `fetch_deployment_logs` returns recent entries |
| 4 | Error log alerting | on-call | first ERROR pattern triggers page within 5 min |
| 5 | Latency tracking | OTel exporter | first trace within 60s of launch |
| 6 | Metrics endpoint | (TODO-23.1 Prometheus) | post-TODO-23.1 — informational at v1.0.0 |
| 7 | Status page | comms channel | launch channel doubles as status surface |
| 8 | Crisis-routing canary | manual | hourly `${PROD}/crisis` probe through T+72h |
| 9 | TTFB sampling | curl loop | 5-sample p50 ≤ 500 ms every 15 min through T+24h |
| 10 | Apex + www reachability | curl | both 200 every 5 min through T+24h |
| 11 | Bundle integrity | `${PROD}/` | hashed assets reachable, no 404 storm |
| 12 | Auth surface | `${PROD}/login` | renders unauthenticated, 200 |

**Pass criteria:** rows 1–5, 8–12 must all be live + verified before T-0. Rows 6 (metrics endpoint) and 7 (status page) are at-launch sufficient via the ledger items.

### 13.1 Pulse rotation (T+0 → T+72h)

| Window | Cadence | Owner | Surface |
|---|---|---|---|
| T+0 → T+1h | every 5 min | primary on-call | §13 rows 1, 2, 3, 8, 10 |
| T+1h → T+24h | every 15 min | primary on-call | §13 rows 1, 2, 8, 9, 10 |
| T+24h → T+72h | every 1h | rotation | §13 rows 1, 2, 8 |
| T+72h+ | every 6h | rotation | §13 row 8 (BHCE canary) + standard alerting |

---

## 14. Post-launch incident escalation map

Source: Probe Checklist §5 severity matrix + Runbook §3 on-call.

```
SYMPTOM DETECTED
       │
       ▼
┌─────────────────────────────────────────────┐
│  Is /crisis affected? (200? content?)        │
└─────────────────────────────────────────────┘
   │YES                                  │NO
   ▼                                     ▼
 P0 (BHCE)                  ┌──────────────────────────┐
 Auto-escalate              │ Severity classify (P0–P3) │
 page Architecture          └──────────────────────────┘
 + Engineering on-call         │
 Halt all merges               ▼
 Consider rollback        ┌─────────────┐
 within 5 min             │ P0 outage?  │
                          └─────────────┘
                            │YES        │NO
                            ▼           ▼
                          Page on-call  Triage queue
                          Halt merges   Open INC ticket
                          Rollback < 5m Pulse updates
                          per §SLO      per severity SLO
```

### 14.1 Escalation contacts (filled by runbook)

| Role | Name | Channel | SLO ack |
|---|---|---|---|
| Primary on-call | (per Runbook §3.1) | (launch channel) | 5 min |
| Secondary on-call | (per Runbook §3.1) | (launch channel) | 15 min |
| Architecture / BHCE | (per Runbook §3.1) | (launch channel + emergency) | 5 min for BHCE |
| Comms | (per Runbook §3.1) | (status surface) | 15 min |

### 14.2 Post-incident artifacts

| Severity | Artifact required | Deadline |
|---|---|---|
| P0 | `docs/reports/POST_MORTEM_INC_<#>.md` | 48 h |
| P0 BHCE | `docs/reports/POST_INCIDENT_BHCE_<TS>.md` | 24 h |
| P1 | `docs/reports/POST_MORTEM_INC_<#>.md` | 7 d |
| P2 | INC ticket comment | 14 d |
| P3 | Phase 28 TODO ledger entry | next sprint |

---

## 15. Replit-native verification commands — index

All commands in this document use only Replit-native or vanilla CLI tools. No Docker, no virtualenvs, no manual SQL, no infrastructure changes.

| Tool | Used in | Replit-native? |
|---|---|---|
| `curl` | §1, 2, 6, 7, 8, 11, 12, 13 | yes |
| `grep`, `sed`, `sort`, `uniq` | §2, 4, 5, 7, 8, 10 | yes |
| `find`, `du`, `wc` | §4, 5, 10 | yes |
| `md5sum` | §10 | yes |
| `npm audit`, `npm ls`, `npm outdated` | §9 | yes |
| `npx lighthouse` | §1 | yes (installs on demand) |
| `gzip -c` | §5 | yes |
| Workflows panel | §13 row 3 | Replit-native |
| Deployment history panel | rollback | Replit-native |
| Secrets panel | gate G4 / matrix row 14 | Replit-native |
| `fetch_deployment_logs` | §13 row 3 | Replit-native agent tool |

No tool in this checklist requires shell access beyond the standard Replit Shell tab.

---

## 16. Findings → triage routing

This phase **produces no source modifications**. Every finding from sections §1–§13 is routed to one of:

1. **Already open** in Phase 28 ledger → cross-reference TODO ID; no new entry needed
2. **New S0/S1** → add to Phase 28 ledger; surface in next Plan-mode cycle
3. **New S2/S3** → add to Phase 28 ledger as backlog
4. **Hard launch blocker** → escalate to Architecture/Governance signer; matrix row goes NO-GO

Triage routing format (for any new finding):

```
TODO-<n>.<m>  [S0|S1|S2|S3]  <one-line summary>
Source:       Phase 32 §<section number>
Evidence:     <command output snippet or screenshot reference>
Sprint:       <1 | 2 | 3 | conditional>
Owner:        <engineering | architecture>
```

---

## 17. Sign-off

This checklist is consultative — there is no signature surface. Execution is performed at T-1h (per Phase 31 packet) and post-launch monitoring (per §13.1 rotation). Findings flow back to:

- Phase 28 TODO ledger (`docs/reports/PHASE_28_POST_LAUNCH_TODO_LEDGER.md`) for scheduling
- Phase 30 matrix (`docs/operations/LAUNCH_APPROVAL_MATRIX.md`) for any launch-blocking implications
- Phase 31 packet (`docs/operations/T_MINUS_1H_LAUNCH_SIGNOFF.md`) for live fill-in

---

## 18. References

- Launch Approval Matrix: `docs/operations/LAUNCH_APPROVAL_MATRIX.md` (Phase 30)
- T-1h Sign-Off Packet: `docs/operations/T_MINUS_1H_LAUNCH_SIGNOFF.md` (Phase 31)
- Production Probe Checklist: `docs/operations/PRODUCTION_PROBE_CHECKLIST.md` (Phase 29)
- Post-Launch TODO Ledger: `docs/reports/PHASE_28_POST_LAUNCH_TODO_LEDGER.md` (Phase 28)
- Launch Operations Runbook: `docs/runbooks/LAUNCH_OPERATIONS_RUNBOOK.md` (Phase 27)
- Governance Kernel: `docs/governance/MMHB_v7.4_ARCHIVAL_KERNEL.md`

---

*Production hardening checklist complete. Verification planning only — no source modifications by this phase. Every finding is routed to the Phase 28 ledger for the next planning cycle.*
