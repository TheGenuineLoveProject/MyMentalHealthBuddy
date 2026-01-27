#!/usr/bin/env node
/**
 * Platform Health Check
 * Comprehensive platform health validation
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
console.log(`${COLORS.blue}║            PLATFORM HEALTH CHECK                           ║${COLORS.reset}`);
console.log(`${COLORS.blue}╚════════════════════════════════════════════════════════════╝${COLORS.reset}\n`);

const checks = [];
let passed = 0;
let failed = 0;

function check(name, fn) {
  try {
    const result = fn();
    if (result.success) {
      console.log(`${COLORS.green}✓${COLORS.reset} ${name}: ${result.message || 'OK'}`);
      checks.push({ name, status: 'pass', message: result.message });
      passed++;
    } else {
      console.log(`${COLORS.red}✗${COLORS.reset} ${name}: ${result.message || 'FAILED'}`);
      checks.push({ name, status: 'fail', message: result.message });
      failed++;
    }
  } catch (e) {
    console.log(`${COLORS.red}✗${COLORS.reset} ${name}: ${e.message}`);
    checks.push({ name, status: 'error', message: e.message });
    failed++;
  }
}

check('Package.json exists', () => ({
  success: fs.existsSync('package.json'),
  message: fs.existsSync('package.json') ? 'Found' : 'Missing',
}));

check('Server entry exists', () => ({
  success: fs.existsSync('server/index.mjs') || fs.existsSync('server/dev.mjs'),
  message: 'Server files found',
}));

check('Client entry exists', () => ({
  success: fs.existsSync('client/src/App.jsx') || fs.existsSync('client/src/App.tsx'),
  message: 'Client app found',
}));

check('Database schema exists', () => ({
  success: fs.existsSync('shared/schema.mjs') || fs.existsSync('shared/schema.ts'),
  message: 'Schema found',
}));

check('Build directory exists', () => {
  const exists = fs.existsSync('client/dist') || fs.existsSync('dist');
  return { success: exists, message: exists ? 'Build output found' : 'Run npm run build' };
});

check('Node modules installed', () => ({
  success: fs.existsSync('node_modules'),
  message: 'Dependencies installed',
}));

check('Environment configured', () => {
  const hasDb = process.env.DATABASE_URL || process.env.PGHOST;
  return { success: !!hasDb, message: hasDb ? 'Database configured' : 'DATABASE_URL not set' };
});

check('Components directory', () => {
  try {
    const count = execSync('find client/src/components -name "*.jsx" -o -name "*.tsx" 2>/dev/null | wc -l', { encoding: 'utf8' }).trim();
    return { success: parseInt(count) > 0, message: `${count} components` };
  } catch {
    return { success: false, message: 'Could not count components' };
  }
});

check('Pages directory', () => {
  try {
    const count = execSync('find client/src/pages -name "*.jsx" -o -name "*.tsx" 2>/dev/null | wc -l', { encoding: 'utf8' }).trim();
    return { success: parseInt(count) > 0, message: `${count} pages` };
  } catch {
    return { success: false, message: 'Could not count pages' };
  }
});

check('API routes directory', () => {
  try {
    const count = execSync('ls server/routes/*.mjs 2>/dev/null | wc -l', { encoding: 'utf8' }).trim();
    return { success: parseInt(count) > 0, message: `${count} route files` };
  } catch {
    return { success: false, message: 'Could not count routes' };
  }
});

console.log('\n' + '═'.repeat(60));
console.log(`\n${COLORS.blue}HEALTH CHECK SUMMARY:${COLORS.reset}`);
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);
console.log(`  Total: ${passed + failed}`);

const results = {
  timestamp: new Date().toISOString(),
  passed,
  failed,
  checks,
  overallStatus: failed === 0 ? 'HEALTHY' : 'DEGRADED',
};

if (failed === 0) {
  console.log(`\n${COLORS.green}✅ PASS - Platform is healthy${COLORS.reset}`);
} else {
  console.log(`\n${COLORS.yellow}⚠ WARNING - Some checks failed (${failed}/${passed + failed})${COLORS.reset}`);
}

fs.writeFileSync('docs/health-check-result.json', JSON.stringify(results, null, 2));
console.log(`\nResults saved to: docs/health-check-result.json`);
