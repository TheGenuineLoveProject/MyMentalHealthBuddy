# Security Posture

**Generated:** 2026-02-06
**Baseline Commit:** c82c2d124efec42154e2f0ff4550778bb2c577de

---

## CI/CD Pipeline

### GitHub Actions Workflows

| Workflow | Trigger | Jobs | Status |
|----------|---------|------|--------|
| CI | push/PR to main | verify-routes, lint, typecheck, test, build | ACTIVE |
| AI Employees | Scheduled (hourly/daily/weekly/monthly) | health checks | ACTIVE |
| Nav Audit | push/PR to main | nav:audit | ACTIVE |
| Visual Doctor | push/PR to main | visual:doctor | ACTIVE |

### CI Pipeline Stages

1. **verify-routes** - Validates route manifests match registered routes
2. **lint** - ESLint code quality checks + content tier validation
3. **typecheck** - TypeScript type checking (non-blocking)
4. **test** - Vitest test suite
5. **build** - Production build (depends on all above passing)

### Dependency Management

| Tool | Status | Notes |
|------|--------|-------|
| npm ci | Used in CI | Deterministic installs (verified in ci.yml) |
| Dependabot | NOT configured | RECOMMENDATION (not yet implemented) |
| npm audit | Available via scripts | Manual (not automated) |

**Recommendation (not yet implemented):** Add `.github/dependabot.yml` for automated dependency updates.

---

## Application Security

### Transport Security

| Control | Implementation | Status |
|---------|---------------|--------|
| HTTPS | Replit proxy handles TLS | ACTIVE |
| HSTS | Helmet middleware | ACTIVE |
| Content Security Policy | Helmet CSP | ACTIVE |
| X-Frame-Options | Helmet | ACTIVE |
| X-Content-Type-Options | Helmet (nosniff) | ACTIVE |
| X-XSS-Protection | Helmet | ACTIVE |

### Authentication & Authorization

| Control | Implementation | Status |
|---------|---------------|--------|
| User Auth | Replit Auth (OIDC) | ACTIVE |
| GitHub OAuth | github-auth.mjs | ACTIVE |
| Session Management | Express Session | ACTIVE |
| Admin Guard | AdminGuard component | ACTIVE |
| Age Consent | AgeConsentGate component | ACTIVE |
| Route Guards | RouteGuard component | ACTIVE |
| CSRF Protection | Cookie-based sessions | ACTIVE |

### Input Validation

| Control | Implementation | Status |
|---------|---------------|--------|
| Request Body Validation | Zod schemas | ACTIVE |
| SQL Injection Prevention | Drizzle ORM (parameterized) | ACTIVE |
| XSS Prevention | React DOM escaping + CSP | ACTIVE |
| Rate Limiting | Express rate limiter | ACTIVE |
| Request Size Limits | Express JSON limit (1MB) | ACTIVE |

### Data Protection

| Control | Implementation | Status |
|---------|---------------|--------|
| Secrets Management | Replit Secrets | ACTIVE |
| No Secrets in Code | .gitignore + .env | ACTIVE |
| Database Encryption | Neon PostgreSQL (at rest) | ACTIVE |
| PII Handling | piiRedaction.mjs script | AVAILABLE |

### Crisis Safety

| Control | Implementation | Status |
|---------|---------------|--------|
| Public Crisis Page | /crisis (no auth required) | ACTIVE |
| Safety Disclaimers | SafetyFooter on all pages | ACTIVE |
| Educational Disclaimers | Platform-wide | ACTIVE |
| AI Safety Guardrails | Trauma-informed prompts | ACTIVE |

---

## Recommended Additions

### 1. Dependabot Configuration (Recommended)

Create `.github/dependabot.yml`:
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    groups:
      production:
        dependency-type: "production"
      development:
        dependency-type: "development"
```

### 2. Security Scanning (Recommendations - Not Yet Implemented)

- CodeQL analysis for JavaScript/TypeScript
- Secret scanning (GitHub built-in)
- OWASP dependency check

---

## Evidence References

| Claim | Verified By |
|-------|-------------|
| CI pipeline exists | .github/workflows/ci.yml (file exists, read) |
| Helmet active | server/index.mjs imports and uses helmet() |
| CORS active | server/index.mjs imports and uses cors() |
| Rate limiting | server/middleware/ contains rate limiter |
| Zod validation | Shared schemas use drizzle-zod |
| Replit Secrets | Secrets confirmed via environment tools |
| Age consent gate | client/src/components/AgeConsentGate.jsx exists |
| Crisis page public | /crisis returns HTTP 200 without auth (curl verified) |

---

## Phase 5 Status: COMPLETE
No code was modified. Security posture documented.
