# Release Notes

## v1.10.0 (January 2026)

### A→Z 360 Platform Complete

**New Features:**
- Top-50 Platform Process Tracker in Admin Health Dashboard
- Privacy-safe analytics with event taxonomy
- Error microcopy library with 9 categories
- Content tier compliance automation

**Improvements:**
- All "reading level" references updated to Beginner/Intermediate/Advanced
- Enhanced CI/CD with content-check step
- Comprehensive documentation suite

**Technical:**
- Added `client/src/lib/track.ts` for analytics
- Added `client/src/content/analytics/eventSchema.ts`
- Added `client/src/content/microcopy/errorMicrocopy.ts`
- Integrated Top50ProcessTracker into HealthDashboard

---

## v1.9.0 (January 2026)

### A→Z Automation Scripts

**New:**
- `scripts/scan.mjs` - Platform health scanner
- `scripts/report.mjs` - Status report generator
- `scripts/guardrails.mjs` - Safety validation
- `scripts/verify.mjs` - Full verification suite
- `scripts/release.mjs` - Release notes automation
- `scripts/content-check.mjs` - Tier compliance checker

**Docs:**
- Added `docs/TOP_50_PROCESSES.md`
- Added `docs/ops/DISASTER_RECOVERY.md`
- Added `docs/security/THREAT_MODEL.md`
- Added `docs/ai/SAFETY_POLICY.md`

---

## v1.8.0 (January 2026)

### Social Studio & Content Management

**Features:**
- Admin Social Studio with multi-platform support
- Content calendar and scheduling
- Social analytics dashboard
- Template library

---

## v1.7.0 (January 2026)

### Stripe Integration

**Features:**
- Checkout flow
- Customer portal
- Webhook handlers
- Plan gating middleware

---

## v1.6.0 (January 2026)

### Authentication & RBAC

**Features:**
- Replit Auth integration
- Session management
- Admin role protection
- Audit logging

---

## Release Process

1. Update version in `package.json`
2. Run `npm run release` to generate notes
3. Run `npm run verify` to validate
4. Create git tag
5. Deploy via Replit

## Versioning

We follow semantic versioning:
- **Major:** Breaking changes
- **Minor:** New features
- **Patch:** Bug fixes
