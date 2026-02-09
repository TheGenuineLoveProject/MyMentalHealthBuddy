# Selective Visibility (Soft Launch) — Completion Report

> STATUS: **PASS**
> Date: 2026-02-09

---

## What Was Added

### Phase 1 — Soft Launch Mode Flag
- Environment variable: `SOFT_LAUNCH_MODE=true`
- Exposed via `GET /api/health` as `softLaunch: true/false`
- Gentle banner component: `client/src/components/SoftLaunchBanner.jsx`
  - Dismissible per session (sessionStorage)
  - Non-intrusive, top-of-page placement
  - Links to feedback widget

### Phase 2 — Passive Signals (Aggregate Only)
- Server route: `server/routes/soft-launch-metrics.mjs`
- Endpoint: `GET /api/admin/soft-launch-metrics` (admin-only, JWT-protected)
- Tracks:
  - `public_page_views_total` (aggregate counter)
  - `views_by_route` (aggregate per-route counts)
  - Funnel steps: `landing_cta_click`, `auth_start`, `auth_success`, `first_tool_use`, `checkout_start`, `checkout_success`
- `POST /api/admin/soft-launch-metrics/funnel` for client-side funnel events
- Page view recording integrated in `server/dev.mjs` catch-all route

### Phase 3 — Feedback Loop
- Feedback widget: `client/src/components/FeedbackWidget.jsx`
  - Categories: bug, idea, confusion, praise
  - Optional email field (explicitly optional)
  - Floating button, accessible (ARIA, keyboard, 44px touch targets)
- Server route: `server/routes/feedback.mjs`
  - `POST /api/feedback` (public, anonymous)
  - `GET /api/feedback` (admin-only, JWT-protected)
- Database table: `soft_launch_feedback` (id, category, message, contact_email, created_at)
- Admin viewer: `client/src/pages/admin/FeedbackAggregator.jsx`
  - Filter by category, CSV export

### Phase 4 — Smoke Tests
- Script: `scripts/soft-launch-smoke.mjs`
- Tests 11 routes: /, /pricing, /blog, /newsletter, /crisis, /about, /faq, /contact, /privacy, /terms, /api/health
- Outputs PASS/FAIL with route details
- No headless browser required

### Phase 5 — Gentle Recovery
- 404 page: Calm, trauma-informed language with links to home, blog, crisis
- Error boundary: Gentle messaging ("This isn't your fault"), refresh + home buttons, crisis link
- No panic language, no stack traces shown to users

---

## How to Enable/Disable

### Toggle Soft Launch Mode
```bash
# Enable (shows banner)
SOFT_LAUNCH_MODE=true

# Disable (hides banner)
SOFT_LAUNCH_MODE=false
```

### View Admin Metrics
```bash
curl -H "Authorization: Bearer <admin_token>" http://localhost:5000/api/admin/soft-launch-metrics
```

### Review Feedback
```bash
curl -H "Authorization: Bearer <admin_token>" http://localhost:5000/api/feedback
```
Or visit `/admin/feedback` in the browser (admin login required).

---

## Privacy Guarantees

- No IP addresses stored
- No fingerprinting
- No third-party tracking pixels
- No cookies required for metrics
- Aggregate counts only — no user-level tracking
- Contact email in feedback is explicitly optional
- Feedback visible only to admin

---

## Explicit Confirmation

- No auto-email introduced
- No auto-posting introduced
- No background schedulers
- No surveillance
- All additions are additive and reversible

---

*STATUS: PASS*
*Next recommended step: Narrative Amplification*
