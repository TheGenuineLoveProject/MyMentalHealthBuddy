/**
 * Top-50 Platform Processes Map
 * Tracks implementation status of all platform processes
 */

export type ProcessStatus = 'done' | 'in_progress' | 'not_started';

export interface PlatformProcess {
  id: number;
  name: string;
  category: string;
  status: ProcessStatus;
  description: string;
  docsPath?: string;
}

export const PROCESS_CATEGORIES = {
  A: 'Reliability & Quality',
  B: 'Security & Privacy',
  C: 'UX & Accessibility',
  D: 'Data & Insights',
  E: 'Growth & Monetization'
} as const;

export const top50Processes: PlatformProcess[] = [
  // A. Reliability & Quality (1-10)
  { id: 1, name: 'Single Source of Truth routing', category: 'A', status: 'done', description: 'routeKey -> canonicalPath system' },
  { id: 2, name: 'Build guardrails', category: 'A', status: 'done', description: 'typecheck + lint + test + production build' },
  { id: 3, name: 'Error boundary UI', category: 'A', status: 'done', description: 'Friendly fallback for errors' },
  { id: 4, name: 'Runtime logging', category: 'A', status: 'done', description: 'Structured, scrubbed logging' },
  { id: 5, name: 'Health checks', category: 'A', status: 'done', description: 'API + DB + external keys' },
  { id: 6, name: 'Feature flags', category: 'A', status: 'done', description: 'Env-based safe toggles' },
  { id: 7, name: 'Rate limiting', category: 'A', status: 'done', description: 'Request validation + limits' },
  { id: 8, name: 'Dependency hygiene', category: 'A', status: 'done', description: 'Audit + lockfile' },
  { id: 9, name: 'Backups / snapshots', category: 'A', status: 'done', description: 'Human-triggered via Replit' },
  { id: 10, name: 'Release notes automation', category: 'A', status: 'done', description: 'scripts/release.mjs' },

  // B. Security & Privacy (11-20)
  { id: 11, name: 'Security headers + CSP', category: 'B', status: 'done', description: 'Helmet middleware' },
  { id: 12, name: 'Secure cookies / sessions', category: 'B', status: 'done', description: 'httpOnly, secure flags' },
  { id: 13, name: 'CSRF strategy', category: 'B', status: 'done', description: 'Token validation' },
  { id: 14, name: 'Input validation (Zod)', category: 'B', status: 'done', description: 'All API routes validated' },
  { id: 15, name: 'Secrets sanity check', category: 'B', status: 'done', description: 'No hardcoded keys' },
  { id: 16, name: 'PII minimization', category: 'B', status: 'done', description: 'Retention plan documented' },
  { id: 17, name: 'Admin access control', category: 'B', status: 'done', description: 'RBAC middleware' },
  { id: 18, name: 'Audit log', category: 'B', status: 'done', description: 'Admin actions logged' },
  { id: 19, name: 'Abuse prevention', category: 'B', status: 'done', description: 'Rate limit + ban logic' },
  { id: 20, name: 'Legal disclaimers', category: 'B', status: 'done', description: 'Scope guardrails' },

  // C. UX & Accessibility (21-30)
  { id: 21, name: 'Consistent page shell', category: 'C', status: 'done', description: 'Layout + spacing rhythm' },
  { id: 22, name: 'Universal components', category: 'C', status: 'done', description: 'Button/Card/Section library' },
  { id: 23, name: 'Wellness microcopy library', category: 'C', status: 'done', description: 'Non-repetitive copy system' },
  { id: 24, name: 'Content tier toggle', category: 'C', status: 'done', description: 'Beginner/Intermediate/Advanced' },
  { id: 25, name: 'Empty/loading/error states', category: 'C', status: 'done', description: 'All components covered' },
  { id: 26, name: 'Mobile-first spacing', category: 'C', status: 'done', description: '44px+ tap targets' },
  { id: 27, name: 'Keyboard navigation', category: 'C', status: 'done', description: 'Focus rings visible' },
  { id: 28, name: 'Contrast compliance', category: 'C', status: 'done', description: 'WCAG AA verified' },
  { id: 29, name: 'Progressive disclosure', category: 'C', status: 'done', description: 'Reduce overwhelm' },
  { id: 30, name: 'Next step recommender', category: 'C', status: 'in_progress', description: 'Personalized guidance' },

  // D. Data & Insights (31-40)
  { id: 31, name: 'Event taxonomy', category: 'D', status: 'done', description: 'view/start/complete/save' },
  { id: 32, name: 'Privacy-safe analytics', category: 'D', status: 'done', description: 'No journaling text logged' },
  { id: 33, name: 'Admin dashboard', category: 'D', status: 'done', description: 'Usage + completion metrics' },
  { id: 34, name: 'Cohort tracking', category: 'D', status: 'in_progress', description: 'Anonymous IDs' },
  { id: 35, name: 'A/B testing hooks', category: 'D', status: 'in_progress', description: 'Simple flags' },
  { id: 36, name: 'Feedback collection', category: 'D', status: 'done', description: '1-click + optional comment' },
  { id: 37, name: 'Content performance', category: 'D', status: 'done', description: 'SEO/blog metrics' },
  { id: 38, name: 'Uptime/perf metrics', category: 'D', status: 'done', description: 'TTFB/LCP basics' },
  { id: 39, name: 'Error rate metrics', category: 'D', status: 'done', description: 'Client + server tracking' },
  { id: 40, name: 'Data export', category: 'D', status: 'done', description: 'User data download' },

  // E. Growth & Monetization (41-50)
  { id: 41, name: 'SEO foundations', category: 'E', status: 'done', description: 'Sitemap, robots, meta' },
  { id: 42, name: 'Internal linking', category: 'E', status: 'done', description: 'routeKey-based' },
  { id: 43, name: 'Blog engine', category: 'E', status: 'done', description: 'Repurpose pipeline' },
  { id: 44, name: 'Social studio', category: 'E', status: 'done', description: 'Templates -> drafts -> export' },
  { id: 45, name: 'Email capture', category: 'E', status: 'in_progress', description: 'Lead magnet flow' },
  { id: 46, name: 'Pricing/tiers pattern', category: 'E', status: 'done', description: 'Subscription structure' },
  { id: 47, name: 'Stripe readiness', category: 'E', status: 'done', description: 'Webhook guardrails' },
  { id: 48, name: 'Referral flows', category: 'E', status: 'in_progress', description: 'Gentle share mechanics' },
  { id: 49, name: 'Trust pages', category: 'E', status: 'done', description: 'About/Safety/Privacy/Terms/Crisis' },
  { id: 50, name: 'Support workflow', category: 'E', status: 'done', description: 'Contact + FAQ' }
];

export function getProcessStats() {
  const done = top50Processes.filter(p => p.status === 'done').length;
  const inProgress = top50Processes.filter(p => p.status === 'in_progress').length;
  const notStarted = top50Processes.filter(p => p.status === 'not_started').length;
  
  return {
    done,
    inProgress,
    notStarted,
    total: top50Processes.length,
    percentComplete: Math.round((done / top50Processes.length) * 100)
  };
}

export function getProcessesByCategory(category: keyof typeof PROCESS_CATEGORIES) {
  return top50Processes.filter(p => p.category === category);
}

export function getProcessesByStatus(status: ProcessStatus) {
  return top50Processes.filter(p => p.status === status);
}
