/**
 * Integration Registry - Single Source of Truth
 * Tracks all platform integrations to prevent duplicate work
 * 
 * Categories: security|observability|content|growth|performance|accessibility|infra|payments|auth|data|devex
 * Status: planned|in_progress|done
 */

export interface IntegrationEntry {
  integrationKey: string;
  category: 'security' | 'observability' | 'content' | 'growth' | 'performance' | 'accessibility' | 'infra' | 'payments' | 'auth' | 'data' | 'devex';
  status: 'planned' | 'in_progress' | 'done';
  canonicalFiles: string[];
  routeKeysTouched: string[];
  notes: string;
  lastUpdated: string;
}

export const INTEGRATION_REGISTRY: IntegrationEntry[] = [
  // ============================================================================
  // AUTH (DONE)
  // ============================================================================
  {
    integrationKey: 'auth_replit_oauth',
    category: 'auth',
    status: 'done',
    canonicalFiles: ['server/auth/authMiddleware.js', 'server/routes/replitAuth.mjs', 'client/src/context/AuthContext.jsx'],
    routeKeysTouched: ['login', 'login_callback', 'logout'],
    notes: 'Replit OIDC authentication with session management',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'auth_jwt',
    category: 'auth',
    status: 'done',
    canonicalFiles: ['server/auth/jwt.mjs'],
    routeKeysTouched: [],
    notes: 'JWT token utilities for API auth',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'auth_admin_guard',
    category: 'auth',
    status: 'done',
    canonicalFiles: ['client/src/components/AdminGuard.jsx', 'server/middleware/adminAuth.mjs'],
    routeKeysTouched: ['admin', 'admin_health', 'admin_social'],
    notes: 'Admin role-based access control',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'auth_route_guard',
    category: 'auth',
    status: 'done',
    canonicalFiles: ['client/src/components/RouteGuard.jsx'],
    routeKeysTouched: ['dashboard', 'settings', 'profile'],
    notes: 'Protected route wrapper for authenticated pages',
    lastUpdated: '2026-01-26'
  },
  
  // ============================================================================
  // PAYMENTS (DONE)
  // ============================================================================
  {
    integrationKey: 'payments_stripe',
    category: 'payments',
    status: 'done',
    canonicalFiles: ['server/routes/stripe.mjs', 'server/billing/entitlements.mjs'],
    routeKeysTouched: ['upgrade', 'premium', 'billing'],
    notes: 'Stripe checkout, webhooks, subscription management',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'payments_entitlements',
    category: 'payments',
    status: 'done',
    canonicalFiles: ['server/billing/applyPendingEntitlements.mjs', 'server/billing/entitlements.mjs'],
    routeKeysTouched: [],
    notes: 'Feature gating based on subscription tier',
    lastUpdated: '2026-01-26'
  },
  
  // ============================================================================
  // SECURITY (DONE)
  // ============================================================================
  {
    integrationKey: 'security_helmet',
    category: 'security',
    status: 'done',
    canonicalFiles: ['server/index.mjs', 'server/dev.mjs'],
    routeKeysTouched: [],
    notes: 'Helmet security headers middleware',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'security_cors',
    category: 'security',
    status: 'done',
    canonicalFiles: ['server/index.mjs', 'server/dev.mjs'],
    routeKeysTouched: [],
    notes: 'CORS configuration for API endpoints',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'security_rate_limit',
    category: 'security',
    status: 'done',
    canonicalFiles: ['server/middleware/rateLimit.mjs', 'server/middleware/loginRateLimit.mjs'],
    routeKeysTouched: [],
    notes: 'Rate limiting for API and login endpoints',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'security_cookies',
    category: 'security',
    status: 'done',
    canonicalFiles: ['server/security/cookies.mjs'],
    routeKeysTouched: [],
    notes: 'Secure cookie configuration',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'security_audit_log',
    category: 'security',
    status: 'done',
    canonicalFiles: ['server/security/audit.mjs', 'server/middleware/audit.mjs'],
    routeKeysTouched: [],
    notes: 'Admin action audit logging',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'security_input_validation',
    category: 'security',
    status: 'done',
    canonicalFiles: ['shared/schema.ts', 'server/lib/validation.mjs'],
    routeKeysTouched: [],
    notes: 'Zod schema validation for all inputs',
    lastUpdated: '2026-01-26'
  },
  
  // ============================================================================
  // OBSERVABILITY (DONE)
  // ============================================================================
  {
    integrationKey: 'observability_structured_logging',
    category: 'observability',
    status: 'done',
    canonicalFiles: ['server/middleware/requestLogger.mjs', 'server/lib/logger.mjs'],
    routeKeysTouched: [],
    notes: 'Structured JSON logging with requestId',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'observability_health_endpoint',
    category: 'observability',
    status: 'done',
    canonicalFiles: ['server/routes/health.mjs'],
    routeKeysTouched: ['health'],
    notes: 'Health check, readiness, and version endpoints',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'observability_error_boundary',
    category: 'observability',
    status: 'done',
    canonicalFiles: ['client/src/components/ErrorBoundary.jsx'],
    routeKeysTouched: [],
    notes: 'React error boundary with fallback UI',
    lastUpdated: '2026-01-26'
  },
  
  // ============================================================================
  // CONTENT (DONE)
  // ============================================================================
  {
    integrationKey: 'content_route_registry',
    category: 'content',
    status: 'done',
    canonicalFiles: ['client/src/content/routes.js', 'client/src/content/meta/routeMetaRegistry.ts'],
    routeKeysTouched: [],
    notes: 'Single source of truth for all routes',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'content_microcopy',
    category: 'content',
    status: 'done',
    canonicalFiles: ['client/src/content/microcopy.js', 'client/src/content/microcopy/wellnessMicrocopy.ts'],
    routeKeysTouched: [],
    notes: 'Trauma-informed microcopy system',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'content_reading_levels',
    category: 'content',
    status: 'done',
    canonicalFiles: ['client/src/content/readingLevels.js', 'client/src/context/ReadingLevelContext.jsx'],
    routeKeysTouched: [],
    notes: '3-level content (Beginner/Intermediate/Advanced)',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'content_seo',
    category: 'content',
    status: 'done',
    canonicalFiles: ['client/src/components/SEO.tsx', 'public/sitemap.xml', 'public/robots.txt'],
    routeKeysTouched: [],
    notes: 'SEO meta tags, sitemap, robots.txt',
    lastUpdated: '2026-01-26'
  },
  
  // ============================================================================
  // PERFORMANCE (DONE)
  // ============================================================================
  {
    integrationKey: 'performance_code_splitting',
    category: 'performance',
    status: 'done',
    canonicalFiles: ['client/src/App.jsx'],
    routeKeysTouched: [],
    notes: 'Route-level code splitting with React.lazy',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'performance_skeleton_loading',
    category: 'performance',
    status: 'done',
    canonicalFiles: ['client/src/components/ui/skeleton.tsx'],
    routeKeysTouched: [],
    notes: 'Skeleton loading states',
    lastUpdated: '2026-01-26'
  },
  
  // ============================================================================
  // ACCESSIBILITY (DONE)
  // ============================================================================
  {
    integrationKey: 'accessibility_skip_links',
    category: 'accessibility',
    status: 'done',
    canonicalFiles: ['client/src/components/SkipToContent.jsx'],
    routeKeysTouched: [],
    notes: 'Skip to main content link',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'accessibility_focus_rings',
    category: 'accessibility',
    status: 'done',
    canonicalFiles: ['client/src/styles/tokens.css'],
    routeKeysTouched: [],
    notes: 'Visible focus indicators',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'accessibility_reduced_motion',
    category: 'accessibility',
    status: 'done',
    canonicalFiles: ['client/src/styles/tokens.css'],
    routeKeysTouched: [],
    notes: 'prefers-reduced-motion support',
    lastUpdated: '2026-01-26'
  },
  
  // ============================================================================
  // INFRASTRUCTURE (DONE)
  // ============================================================================
  {
    integrationKey: 'infra_postgres',
    category: 'infra',
    status: 'done',
    canonicalFiles: ['server/db/index.mjs', 'shared/schema.ts', 'drizzle.config.ts'],
    routeKeysTouched: [],
    notes: 'Neon PostgreSQL with Drizzle ORM',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'infra_design_tokens',
    category: 'infra',
    status: 'done',
    canonicalFiles: ['client/src/styles/tokens.css', 'shared/brand.mjs'],
    routeKeysTouched: [],
    notes: 'CSS custom properties design system',
    lastUpdated: '2026-01-26'
  },
  
  // ============================================================================
  // DATA (DONE)
  // ============================================================================
  {
    integrationKey: 'data_openai',
    category: 'data',
    status: 'done',
    canonicalFiles: ['server/routes/openai.mjs', 'server/ai/openai.mjs'],
    routeKeysTouched: ['ai_chat'],
    notes: 'OpenAI integration for AI chat',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'data_perplexity',
    category: 'data',
    status: 'done',
    canonicalFiles: ['server/routes/perplexity.mjs'],
    routeKeysTouched: [],
    notes: 'Perplexity AI for factual queries',
    lastUpdated: '2026-01-26'
  },
  
  // ============================================================================
  // GROWTH (DONE)
  // ============================================================================
  {
    integrationKey: 'growth_email_resend',
    category: 'growth',
    status: 'done',
    canonicalFiles: ['server/routes/email.mjs'],
    routeKeysTouched: [],
    notes: 'Resend transactional email integration',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'growth_analytics',
    category: 'growth',
    status: 'done',
    canonicalFiles: ['client/src/lib/analytics.ts'],
    routeKeysTouched: [],
    notes: 'Google Analytics integration',
    lastUpdated: '2026-01-26'
  },
  
  // ============================================================================
  // DEVEX (DONE)
  // ============================================================================
  {
    integrationKey: 'devex_duplicate_scanner',
    category: 'devex',
    status: 'done',
    canonicalFiles: ['scripts/scan-duplicates.mjs', 'scripts/deepScan.mjs'],
    routeKeysTouched: [],
    notes: 'Duplicate detection and collision scanning',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'devex_route_validation',
    category: 'devex',
    status: 'done',
    canonicalFiles: ['scripts/validateRoutes.mjs'],
    routeKeysTouched: [],
    notes: 'Route collision validation script',
    lastUpdated: '2026-01-26'
  },
  
  // ============================================================================
  // BATCH 10 ADDITIONS (P151-P200)
  // ============================================================================
  {
    integrationKey: 'devex_smoke_test',
    category: 'devex',
    status: 'done',
    canonicalFiles: ['scripts/smokeTest.mjs'],
    routeKeysTouched: [],
    notes: 'P163 - Critical route smoke tests',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'devex_route_snapshot',
    category: 'devex',
    status: 'done',
    canonicalFiles: ['scripts/routeSnapshotTest.mjs', 'docs/ci/route-snapshot.json'],
    routeKeysTouched: [],
    notes: 'P161 - Route registry snapshot tests',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'devex_contract_tests',
    category: 'devex',
    status: 'done',
    canonicalFiles: ['scripts/endpointContractTest.mjs'],
    routeKeysTouched: [],
    notes: 'P162 - API endpoint contract tests',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'accessibility_smoke_checks',
    category: 'accessibility',
    status: 'done',
    canonicalFiles: ['scripts/a11yCheck.mjs'],
    routeKeysTouched: [],
    notes: 'P165 - Accessibility smoke check script',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'devex_verify_command',
    category: 'devex',
    status: 'done',
    canonicalFiles: ['package.json'],
    routeKeysTouched: [],
    notes: 'P166 - npm run verify consolidated command',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'devex_no_duplicate_work',
    category: 'devex',
    status: 'done',
    canonicalFiles: ['scripts/noDuplicateWork.mjs'],
    routeKeysTouched: [],
    notes: 'Batch 10 - Anti-duplicate gate script',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'security_secrets_validator',
    category: 'security',
    status: 'done',
    canonicalFiles: ['scripts/secretsValidator.mjs'],
    routeKeysTouched: [],
    notes: 'P194 - Environment secrets validation',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'security_pii_redaction',
    category: 'security',
    status: 'done',
    canonicalFiles: ['scripts/piiRedaction.mjs'],
    routeKeysTouched: [],
    notes: 'P193 - PII redaction utility for logs',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'security_dependency_audit',
    category: 'security',
    status: 'done',
    canonicalFiles: ['scripts/dependencyAudit.mjs'],
    routeKeysTouched: [],
    notes: 'P198 - Dependency security audit',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'performance_calm_mode',
    category: 'performance',
    status: 'done',
    canonicalFiles: ['client/src/components/ui/CalmModeToggle.jsx'],
    routeKeysTouched: [],
    notes: 'P180 - Calm mode UI toggle (reduced motion)',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'performance_empty_states',
    category: 'performance',
    status: 'done',
    canonicalFiles: ['client/src/components/ui/EmptyState.jsx'],
    routeKeysTouched: [],
    notes: 'P175 - Standardized empty states',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'content_microcopy_rotation',
    category: 'content',
    status: 'done',
    canonicalFiles: ['client/src/content/microcopy/rotationSeed.ts'],
    routeKeysTouched: [],
    notes: 'Batch 10 - Microcopy rotation seed utility',
    lastUpdated: '2026-01-26'
  },
  
  // ============================================================================
  // BATCH 9 ADDITIONS (P101-P150 gap fills)
  // ============================================================================
  {
    integrationKey: 'devex_batch_runner_doc',
    category: 'devex',
    status: 'done',
    canonicalFiles: ['docs/batch-runner.md'],
    routeKeysTouched: [],
    notes: 'P150 - Batch Runner guide',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'devex_release_checklist',
    category: 'devex',
    status: 'done',
    canonicalFiles: ['docs/release-checklist.md'],
    routeKeysTouched: [],
    notes: 'P149 - Release checklist enforcement',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'devex_docs_index',
    category: 'devex',
    status: 'done',
    canonicalFiles: ['docs/index.md'],
    routeKeysTouched: [],
    notes: 'P148 - Documentation index auto-generated',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'devex_bundle_size_check',
    category: 'devex',
    status: 'done',
    canonicalFiles: ['scripts/bundleSizeCheck.mjs'],
    routeKeysTouched: [],
    notes: 'P144 - Bundle-size warning in CI',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'content_routekey_link_checker',
    category: 'content',
    status: 'done',
    canonicalFiles: ['scripts/routeKeyLinkChecker.mjs'],
    routeKeysTouched: [],
    notes: 'P135 - Broken internal routeKey links checker',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'auth_session_list',
    category: 'auth',
    status: 'done',
    canonicalFiles: ['client/src/pages/account/Sessions.jsx', 'server/routes/accountActions.mjs'],
    routeKeysTouched: ['account_sessions'],
    notes: 'P113 - Session list page with revoke',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'auth_delete_account',
    category: 'auth',
    status: 'done',
    canonicalFiles: ['client/src/pages/account/DeleteAccount.jsx', 'server/routes/accountActions.mjs'],
    routeKeysTouched: ['account_delete'],
    notes: 'P119 - Delete my account request flow',
    lastUpdated: '2026-01-26'
  },
  {
    integrationKey: 'admin_billing_viewer',
    category: 'admin',
    status: 'done',
    canonicalFiles: ['client/src/pages/admin/BillingViewer.jsx', 'server/routes/adminBilling.mjs'],
    routeKeysTouched: ['admin_billing'],
    notes: 'P128 - Admin billing viewer (read-only)',
    lastUpdated: '2026-01-26'
  }
];

export function getIntegrationsByCategory(category: IntegrationEntry['category']) {
  return INTEGRATION_REGISTRY.filter(i => i.category === category);
}

export function getIntegrationsByStatus(status: IntegrationEntry['status']) {
  return INTEGRATION_REGISTRY.filter(i => i.status === status);
}

export function getIntegration(key: string) {
  return INTEGRATION_REGISTRY.find(i => i.integrationKey === key);
}

export function getIntegrationStats() {
  const done = INTEGRATION_REGISTRY.filter(i => i.status === 'done').length;
  const inProgress = INTEGRATION_REGISTRY.filter(i => i.status === 'in_progress').length;
  const planned = INTEGRATION_REGISTRY.filter(i => i.status === 'planned').length;
  return { done, inProgress, planned, total: INTEGRATION_REGISTRY.length };
}
