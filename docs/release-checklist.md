# Release Checklist (P149)

> The Genuine Love Project - Pre-Release Verification
> Last Updated: January 26, 2026

---

## Before Every Release

### 1. Code Quality
- [ ] `npm run build` passes
- [ ] `npm run typecheck` passes
- [ ] No TypeScript errors in editor
- [ ] No console.log statements in production code

### 2. Testing
- [ ] `npm run smoke` - all critical routes pass
- [ ] `npm run a11y:check` - no critical accessibility errors
- [ ] `npm run test:routes` - route snapshot matches
- [ ] `npm run test:contracts` - API contracts valid

### 3. Security
- [ ] `npm run validate:secrets` - all required secrets present
- [ ] `npm run audit:deps` - no critical vulnerabilities
- [ ] No hardcoded secrets in code
- [ ] CORS origins are production-only

### 4. Documentation
- [ ] `replit.md` updated with changes
- [ ] Integration registry updated
- [ ] Process matrix updated (if applicable)
- [ ] Changelog entry added

### 5. Database
- [ ] Schema changes pushed (`npm run db:push`)
- [ ] No destructive migrations
- [ ] Backup taken (if major change)

### 6. User Experience
- [ ] Crisis page (`/crisis`) accessible without login
- [ ] All disclaimers present
- [ ] No clinical claims in copy
- [ ] Mobile responsive

---

## Release Types

### Patch Release (Bug Fix)
Required checks:
- [ ] Code Quality (1)
- [ ] Testing (2)
- [ ] Security (3)

### Minor Release (New Feature)
Required checks:
- [ ] All sections (1-6)
- [ ] Feature documentation
- [ ] Feature flag (if applicable)

### Major Release (Breaking Change)
Required checks:
- [ ] All sections (1-6)
- [ ] Migration guide
- [ ] User communication plan
- [ ] Rollback plan

---

## Quick Commands

```bash
# Full pre-release check
npm run verify && npm run smoke && npm run a11y:check

# Security check
npm run validate:secrets && npm run audit:deps

# Documentation check
npm run nodupes && npm run doctor
```

---

## Post-Release

- [ ] Monitor health endpoints
- [ ] Check error rates
- [ ] Verify user flows
- [ ] Update status page (if applicable)

---

_This checklist is mandatory for all production releases._
