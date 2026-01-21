# The Genuine Love Project — Ops Playbook (v1.0)

**Purpose:** Lightweight operational guidelines for platform stability, releases, and governance.

---

## 1) Release Checklist

Before publishing any changes to production:

### Pre-Release Validation
1. **Auth Tests:** `npm run test:auth` — All 19+ tests must pass
2. **Visual Audit:** `npm run audit` — Zero violations in NAV_LINK_AUDIT.md and VISUAL_DOCTOR_REPORT.md
3. **Build Check:** `npm run build` — Must complete without errors
4. **Preview Click Test:** Manually verify:
   - Home page loads with decorative orbs visible
   - Login/Register forms functional
   - Dashboard accessible after login
   - Mode toggle (Default/Low-Stim/Reading) works in header
   - 404 page displays premium styling with quick links

### Deploy Steps
1. Verify all tests green
2. Check deployment config in `.replit` (autoscale target, port 5000)
3. Click "Publish" in Replit
4. Validate production URL responds with 200

---

## 2) AI Employees Cadence

Structured maintenance schedule for continuous improvement:

### Weekly UX Sweep
- Visual consistency check (tokens only, no raw hex)
- Nav link audit (`npm run nav:audit`)
- Mode system verification (all 3 modes functional)
- Accessibility spot-check (keyboard navigation, focus rings)

### Monthly Content Refresh
- Review crisis resources for accuracy
- Update affirmations and daily wisdom content
- Check external links for validity
- Review journal prompts for trauma-informed language

### Quarterly Security Review
- Dependency audit (`npm audit`)
- Rate limiting verification (login: 10/15min production)
- Auth flow testing (registration, login, logout, forgot password)
- Admin access controls validation
- Session management review

---

## 3) Guardrails (Non-Negotiable)

### Content Guardrails
- **No medical claims:** Never imply the platform replaces professional care
- **No diagnostic language:** Use supportive, non-clinical terminology
- **No crisis handling:** Always direct to professional resources
- **Trauma-informed tone:** Gentle, supportive, non-judgmental

### Security Guardrails
- **No user data leaks:** Error messages must be generic
- **Consistent auth errors:** 401 for any credential failure (no enumeration)
- **Rate limiting:** Active on login and registration endpoints
- **HTTPS only:** No mixed content in production

### Error Response Standards
| Scenario | Status | Response |
|----------|--------|----------|
| Missing required fields | 400 | Generic validation error |
| Invalid credentials | 401 | "Invalid credentials" |
| Rate limited | 401 | "Invalid credentials" (uniform) |
| Unauthenticated access | 401 | "Authentication required" |
| Non-admin on admin route | 403 | "Access denied" |

---

## 4) Visual Mode System

### Mode Toggle Locations
- **Header:** Top-right segmented control (via `ModeToggle` component)
- **Settings Page:** Display section with descriptions

### Persistence
- **Storage Key:** `glp-mode`
- **HTML Attribute:** `document.documentElement.dataset.mode`
- **Applied:** Before first paint (inline script in `client/index.html`)

### Mode Definitions
| Mode | Description | Visual Changes |
|------|-------------|----------------|
| Default | Standard brand palette | Full gradients, shadows, animations |
| Low-Stim | Reduced visual intensity | Lower saturation, minimal shadows, reduced motion |
| Reading | Maximum legibility | High contrast, flat surfaces, minimal decoration |

---

## 5) Emergency Procedures

### Platform Down
1. Check Replit deployment status
2. Verify database connection (`DATABASE_URL`)
3. Review server logs for errors
4. Restart workflow if needed

### Security Incident
1. Immediately rotate affected secrets
2. Review audit logs for unauthorized access
3. Document incident timeline
4. Contact Replit support if needed

### Data Issue
1. Use Replit checkpoint rollback
2. Review recent commits for breaking changes
3. Restore from known-good state

---

## 6) Key Commands Reference

```bash
# Testing
npm run test:auth          # Auth flow tests
npm run audit              # Nav + visual audit

# Building
npm run build              # Production build
npm run dev                # Development server

# Database
npm run db:push            # Sync schema to database
npm run db:studio          # Open Drizzle Studio
```

---

**Maintainers:** The Genuine Love Project Team
**Last Updated:** 2026-01-21
