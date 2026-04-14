# Prompt-OS v8.0 Quality Gates

## Gate Definitions

### BUILD_GATE
- Build must complete with zero errors
- All modules must transform successfully
- No unresolved imports

### ROUTE_GATE
- All registered routes must serve 200
- Auth-protected routes must return 401 without credentials
- No duplicate route definitions

### SCHEMA_GATE
- Database schema must match Drizzle definitions
- No orphaned foreign key references
- All required fields must have defaults or be nullable

### SAFETY_GATE
- No healing content contains business logic
- No monetization pressure in therapeutic flows
- Crisis routing must be accessible from all wellness content
- No emotional vulnerability targeting

### DOMAIN_SEPARATION_GATE
- Business logic must not appear in healing flows
- Healing systems use only approved content, safety logic, and design tokens
- Business systems consume only privacy-safe aggregate analytics

### DESIGN_CONSISTENCY_GATE
- All UI uses design token system
- Brand colors match canonical palette
- Typography follows type scale
- Accessibility meets WCAG AA

### OBSERVABILITY_GATE
- Health endpoint responds within 200ms
- Telemetry tracks 5xx and 4xx separately
- System metrics are collected every 60 seconds
- Error rate is calculated from 5xx only

### ROLLBACK_GATE
- Every change must have documented rollback steps
- Database changes must be reversible
- Feature flags must support instant disable

### DUPLICATION_GATE
- One canonical source of truth per concern
- No duplicate route handlers
- No duplicate brand asset sources
- No duplicate schema definitions

## Gate Enforcement Protocol
1. Run all applicable gates before deployment
2. If any gate fails: BLOCK → EXPLAIN → FIX → RETEST
3. Do not proceed past a failed gate
4. Log gate results to observability plane
