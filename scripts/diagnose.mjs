#!/usr/bin/env node
/**
 * Platform Diagnostic Tool
 * Performs read-only health checks and identifies issues
 */

console.log("🔎 MyMentalHealthBuddy Platform Diagnostics\n");

const findings = [];
const recommendations = [];

// Check for critical files
import { existsSync } from 'fs';

const criticalPaths = [
  'apps/server/src/routes.ts',
  'apps/client/src/App.tsx',
  'apps/shared/schema.ts',
  'package.json'
];

criticalPaths.forEach(path => {
  if (!existsSync(path)) {
    findings.push({
      type: 'missing_file',
      path,
      severity: 'high',
      detail: `Critical file not found: ${path}`
    });
  }
});

// Check for search API
if (existsSync('apps/server/src/routes.ts')) {
  const { readFileSync } = await import('fs');
  const routesContent = readFileSync('apps/server/src/routes.ts', 'utf8');
  if (!routesContent.includes('/api/search')) {
    findings.push({
      type: 'missing_api',
      path: '/api/search',
      severity: 'critical',
      detail: 'Search API endpoints not implemented'
    });
    recommendations.push('Implement /api/search endpoint with full-text search');
  }
}

// Calculate health score
const healthScore = Math.max(0, 100 - (findings.length * 5));

const report = {
  timestamp: new Date().toISOString(),
  health_score: healthScore,
  status: healthScore >= 90 ? 'excellent' : healthScore >= 75 ? 'good' : healthScore >= 50 ? 'fair' : 'poor',
  findings,
  recommendations: [
    ...recommendations,
    'Review PLATFORM_DEFICITS_360_A-Z.md for complete analysis',
    'Run `npm run verify` to confirm build integrity',
    'Ensure all API integrations are configured'
  ]
};

console.log(JSON.stringify(report, null, 2));
console.log(`\n📊 Health Score: ${healthScore}/100 (${report.status.toUpperCase()})`);

process.exit(findings.filter(f => f.severity === 'critical').length > 0 ? 1 : 0);
