# ROUTE GOVERNANCE POLICY

NEVER EXTRACT:
- root routes
- auth routes
- healing routes
- crisis routes
- pricing/billing routes
- protected routes
- dashboard/account routes
- dynamic backend-coupled routes

SAFE EXTRACTION REQUIREMENTS:
- contiguous only
- preserve order
- preserve metadata
- preserve SEO
- preserve navGroups
- preserve accessibility
- verify HTTP 200
- verify duplicate paths
- verify build green
- verify route parity

MANDATORY VERIFICATION:
- npm run build
- npm run verify:all
- duplicate path scan
- route parity check
- HTTP route checks

STOP CONDITIONS:
- build regression
- route ordering drift
- metadata mismatch
- duplicate paths
- SEO breakage
- protected-route drift
