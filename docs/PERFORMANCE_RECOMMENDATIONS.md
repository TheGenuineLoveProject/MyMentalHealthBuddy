# Performance & Build Optimization Recommendations

**Generated:** 2026-02-06
**Phase:** 9 — Performance & Build Optimization
**Status:** RECOMMENDATIONS ONLY — No changes applied

---

## Current Build Analysis

### Build Summary
- **Build time:** ~27 seconds
- **Total CSS assets:** 6 files (438.41 kB, 69.63 kB gzip)
- **Total JS chunks:** 200+ files
- **Warning:** 1 chunk exceeds 1,000 kB limit

### Top 10 Largest Chunks

| Chunk | Raw Size | Gzip Size | Category |
|-------|----------|-----------|----------|
| index-CHKNBi7D.js | 1,106.28 kB | 202.22 kB | App entry / shared code |
| Card-DbZbIg84.js | 801.13 kB | 152.95 kB | UI component library |
| AdvancedToolsPage-Bpgff_q1.js | 370.80 kB | 57.51 kB | Page bundle |
| vendor-react-CW_wlL6m.js | 314.10 kB | 96.41 kB | React core |
| MoodTrendsChartJS-C6gED3Sm.js | 187.76 kB | 65.12 kB | Chart.js |
| WisdomToolsPage-Cx8-Qeeo.js | 134.99 kB | 26.48 kB | Page bundle |
| WellnessDashboard-DLm0GsDp.js | 121.44 kB | 22.03 kB | Page bundle |
| CanvaLanding-CLgZDLKJ.js | 121.34 kB | 14.76 kB | Page bundle |
| Dashboard-D8UujWZk.js | 118.10 kB | 19.44 kB | Page bundle |
| SocialStudioAdmin-DKX6G1ON.js | 98.53 kB | 15.22 kB | Admin page |

### Current Optimization State
- React and TanStack Query already extracted as vendor chunks
- Individual pages already code-split via dynamic imports
- CSS already split per page
- esbuild minification active
- Source maps disabled for production

---

## Recommended Improvements

### Priority 1: Split the index.js Mega-Chunk (1,106 kB)

**Problem:** The main entry chunk contains shared components, routing logic, providers, and utility code that exceeds 1 MB.

**Proposed `manualChunks` configuration:**
```javascript
manualChunks: {
  'vendor-react': ['react', 'react-dom'],
  'vendor-query': ['@tanstack/react-query'],
  'vendor-lucide': ['lucide-react'],
  'vendor-chart': ['chart.js', 'react-chartjs-2'],
  'vendor-gsap': ['gsap'],
  'vendor-aos': ['aos'],
}
```

**Expected impact:** Reduce index.js from ~1,106 kB to ~400-500 kB by extracting third-party libraries into separate cacheable chunks.

### Priority 2: Split the Card Component Bundle (801 kB)

**Problem:** The Card chunk bundles too many UI components together (likely shadcn UI primitives + custom cards).

**Proposed approach:**
- Identify which components are bundled in Card-*.js
- Split into `ui-primitives` and `ui-cards` chunks
- Consider lazy-loading complex card variants

### Priority 3: Lazy-Load Admin Pages

**Problem:** Admin pages (Admin-DLDrR8zz.js at 94 kB, SocialStudioAdmin at 98 kB, ContentAdminDashboard at 44 kB) load even when non-admin users visit the site.

**Proposed approach:**
```javascript
const AdminPage = React.lazy(() => import('./pages/Admin'));
const SocialStudioAdmin = React.lazy(() => import('./pages/SocialStudioAdmin'));
```

**Expected impact:** Remove ~237 kB from the initial load for non-admin users.

### Priority 4: Chart.js Lazy Loading

**Problem:** MoodTrendsChartJS at 187 kB loads Chart.js, which is only needed on specific pages.

**Proposed approach:**
- Ensure Chart.js is only imported in the chart component
- Verify dynamic import wraps the Chart.js import

**Expected impact:** Defer 187 kB until user actually views a chart.

### Priority 5: CSS Optimization

**Problem:** Main CSS at 386 kB (58 kB gzip) is large.

**Proposed approach:**
- Audit Tailwind CSS purging configuration
- Verify `content` paths in Tailwind config cover all used files
- Consider splitting critical CSS from non-critical

### Priority 6: Raise Chunk Size Warning Limit

**Current:** `chunkSizeWarningLimit: 1000` (1,000 kB)

**After optimizations:** Can be lowered to `500` to catch future regressions.

---

## Implementation Order (When Approved)

| Step | Change | Risk | Reversible |
|------|--------|------|------------|
| 1 | Add vendor chunks for lucide, chart.js, gsap, aos | LOW | Yes (revert manualChunks) |
| 2 | Lazy-load admin pages | LOW | Yes (remove React.lazy wrapper) |
| 3 | Verify Chart.js dynamic import | LOW | Yes |
| 4 | Audit Tailwind purge config | LOW | Yes |
| 5 | Analyze Card chunk composition | MEDIUM | Yes |
| 6 | Lower chunkSizeWarningLimit to 500 | LOW | Yes |

---

## Performance Metrics to Track

| Metric | Current | Target |
|--------|---------|--------|
| Largest JS chunk | 1,106 kB | < 500 kB |
| Total JS (initial) | ~1,800 kB | < 1,200 kB |
| Total CSS (initial) | 386 kB | < 300 kB |
| Build time | ~27s | < 30s (maintain) |
| Lighthouse Performance | (measure baseline) | > 80 |
| First Contentful Paint | (measure baseline) | < 2s |
| Time to Interactive | (measure baseline) | < 4s |

---

## Phase 9 Status: COMPLETE
No code modified. Recommendations documented for approval.
