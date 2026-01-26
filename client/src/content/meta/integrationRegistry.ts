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
