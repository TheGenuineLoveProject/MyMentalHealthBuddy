#!/usr/bin/env node
/**
 * Route Scanner
 * Maps all frontend and backend routes
 */

import { execSync } from 'child_process';
import fs from 'fs';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

console.log(`${COLORS.blue}╔════════════════════════════════════════════════════════════╗${COLORS.reset}`);
console.log(`${COLORS.blue}║              ROUTE SCANNER                                  ║${COLORS.reset}`);
console.log(`${COLORS.blue}╚════════════════════════════════════════════════════════════╝${COLORS.reset}\n`);

const results = {
  frontendRoutes: 0,
  backendRoutes: 0,
  backendFiles: 0,
  apiEndpoints: [],
  uiRoutes: [],
};

try {
  const uiRouteCount = execSync('grep -c "path=" client/src/App.jsx 2>/dev/null || echo "0"', { encoding: 'utf8' }).trim();
  results.frontendRoutes = parseInt(uiRouteCount) || 0;
  console.log(`${COLORS.green}✓${COLORS.reset} Frontend routes found: ${results.frontendRoutes}`);
} catch {
  console.log(`${COLORS.yellow}⚠${COLORS.reset} Could not scan frontend routes`);
}

try {
  const routeFiles = execSync('ls server/routes/*.mjs 2>/dev/null | wc -l', { encoding: 'utf8' }).trim();
  results.backendFiles = parseInt(routeFiles) || 0;
  console.log(`${COLORS.green}✓${COLORS.reset} Backend route files: ${results.backendFiles}`);
} catch {
  console.log(`${COLORS.yellow}⚠${COLORS.reset} Could not scan backend route files`);
}

try {
  const apiEndpoints = execSync(
    'grep -rh "router\\.\\(get\\|post\\|put\\|patch\\|delete\\)\\|app\\.\\(get\\|post\\|put\\|patch\\|delete\\)" server/routes/ 2>/dev/null | wc -l',
    { encoding: 'utf8' }
  ).trim();
  results.backendRoutes = parseInt(apiEndpoints) || 0;
  console.log(`${COLORS.green}✓${COLORS.reset} API endpoints: ${results.backendRoutes}`);
} catch {
  console.log(`${COLORS.yellow}⚠${COLORS.reset} Could not count API endpoints`);
}

try {
  const pageFiles = execSync('find client/src/pages -name "*.jsx" -o -name "*.tsx" 2>/dev/null | wc -l', { encoding: 'utf8' }).trim();
  const pageCount = parseInt(pageFiles) || 0;
  console.log(`${COLORS.green}✓${COLORS.reset} Page files: ${pageCount}`);
} catch {}

console.log('\n' + '═'.repeat(60));
console.log(`\n${COLORS.blue}ROUTE SUMMARY:${COLORS.reset}`);
console.log(`  Frontend routes registered: ${results.frontendRoutes}`);
console.log(`  Backend route files: ${results.backendFiles}`);
console.log(`  Total API endpoints: ${results.backendRoutes}`);

const coverage = results.frontendRoutes > 0 && results.backendRoutes > 0;

if (coverage) {
  console.log(`\n${COLORS.green}✅ PASS - Routes are configured${COLORS.reset}`);
} else {
  console.log(`\n${COLORS.red}❌ FAIL - Missing route configuration${COLORS.reset}`);
  process.exit(1);
}

fs.writeFileSync('docs/scan-routes-result.json', JSON.stringify(results, null, 2));
console.log(`\nResults saved to: docs/scan-routes-result.json`);
