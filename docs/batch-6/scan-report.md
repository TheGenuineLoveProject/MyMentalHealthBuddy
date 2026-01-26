# Batch 6 Scan Report

> Generated: January 2026
> Purpose: Pre-cleanup scan and integration registry

---

## Summary

| Metric | Count |
|--------|-------|
| Existing Integrations | 30 |
| Categories Covered | 10 |
| Endpoint Collisions | 68 |
| Hardcoded Blocks | 302 |
| Duplicate Components | 3 |

---

## Detected Existing Integrations (DONE)

### Auth (4 integrations)
| Key | Status | Files |
|-----|--------|-------|
| auth_replit_oauth | ✅ DONE | server/auth/, client/src/context/AuthContext.jsx |
| auth_jwt | ✅ DONE | server/auth/jwt.mjs |
| auth_admin_guard | ✅ DONE | client/src/components/AdminGuard.jsx |
| auth_route_guard | ✅ DONE | client/src/components/RouteGuard.jsx |

### Payments (2 integrations)
| Key | Status | Files |
|-----|--------|-------|
| payments_stripe | ✅ DONE | server/routes/stripe.mjs, server/billing/ |
| payments_entitlements | ✅ DONE | server/billing/entitlements.mjs |

### Security (6 integrations)
| Key | Status | Files |
|-----|--------|-------|
| security_helmet | ✅ DONE | server/index.mjs |
| security_cors | ✅ DONE | server/index.mjs |
| security_rate_limit | ✅ DONE | server/middleware/rateLimit.mjs |
| security_cookies | ✅ DONE | server/security/cookies.mjs |
| security_audit_log | ✅ DONE | server/security/audit.mjs |
| security_input_validation | ✅ DONE | shared/schema.ts |

### Observability (3 integrations)
| Key | Status | Files |
|-----|--------|-------|
| observability_structured_logging | ✅ DONE | server/lib/logger.mjs |
| observability_health_endpoint | ✅ DONE | server/routes/health.mjs |
| observability_error_boundary | ✅ DONE | client/src/components/ErrorBoundary.jsx |

### Content (4 integrations)
| Key | Status | Files |
|-----|--------|-------|
| content_route_registry | ✅ DONE | client/src/content/routes.js |
| content_microcopy | ✅ DONE | client/src/content/microcopy.js |
| content_reading_levels | ✅ DONE | client/src/content/readingLevels.js |
| content_seo | ✅ DONE | client/src/components/SEO.tsx |

### Performance (2 integrations)
| Key | Status | Files |
|-----|--------|-------|
| performance_code_splitting | ✅ DONE | client/src/App.jsx |
| performance_skeleton_loading | ✅ DONE | client/src/components/ui/skeleton.tsx |

### Accessibility (3 integrations)
| Key | Status | Files |
|-----|--------|-------|
| accessibility_skip_links | ✅ DONE | client/src/components/SkipToContent.jsx |
| accessibility_focus_rings | ✅ DONE | client/src/styles/tokens.css |
| accessibility_reduced_motion | ✅ DONE | client/src/styles/tokens.css |

### Infrastructure (2 integrations)
| Key | Status | Files |
|-----|--------|-------|
| infra_postgres | ✅ DONE | server/db/, shared/schema.ts |
| infra_design_tokens | ✅ DONE | client/src/styles/tokens.css |

### Data (2 integrations)
| Key | Status | Files |
|-----|--------|-------|
| data_openai | ✅ DONE | server/routes/openai.mjs |
| data_perplexity | ✅ DONE | server/routes/perplexity.mjs |

### Growth (2 integrations)
| Key | Status | Files |
|-----|--------|-------|
| growth_email_resend | ✅ DONE | server/routes/email.mjs |
| growth_analytics | ✅ DONE | client/src/lib/analytics.ts |

### DevEx (2 integrations)
| Key | Status | Files |
|-----|--------|-------|
| devex_duplicate_scanner | ✅ DONE | scripts/scan-duplicates.mjs |
| devex_route_validation | ✅ DONE | scripts/validateRoutes.mjs |

---

## Collisions Found (68)

### High Priority (Health Endpoints)
| Endpoint | Collision Count | Files |
|----------|-----------------|-------|
| GET /health | 6 | server/dev.mjs, server/index.mjs, server/routes/admin.mjs, + 3 more |
| GET /healthz | 2 | server/dev.mjs, server/index.mjs |
| GET /api/health-check | 2 | server/dev.mjs, server/index.mjs |

### Medium Priority
Most collisions are between dev.mjs and index.mjs (expected for dev/prod split).

---

## Candidate Integrations for Batch 6

These are already implemented - no new work needed.

---

## Cleanup Tasks

### Phase 2A: Endpoint Collisions
- Consolidate /health endpoints to single canonical handler
- Create server/routes/health.mjs as canonical source
- Add collision validation script

### Phase 2B: Hardcoded Blocks (302)
- Top patterns: disclaimers, hero blocks, CTA sections
- Create reusable block components

### Phase 2C: Duplicate Components (3)
- SEO.tsx exists in 2 locations
- Consolidate with re-exports

---

_Report generated: January 2026_
