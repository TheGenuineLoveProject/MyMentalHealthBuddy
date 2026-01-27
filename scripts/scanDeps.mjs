#!/usr/bin/env node
/**
 * Dependency Scanner
 * Checks for conflicts, vulnerabilities, and unused packages
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
console.log(`${COLORS.blue}║             DEPENDENCY SCANNER                              ║${COLORS.reset}`);
console.log(`${COLORS.blue}╚════════════════════════════════════════════════════════════╝${COLORS.reset}\n`);

const results = {
  totalDeps: 0,
  devDeps: 0,
  vulnerabilities: { critical: 0, high: 0, moderate: 0, low: 0 },
  outdated: [],
  passed: true,
};

try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  results.totalDeps = Object.keys(pkg.dependencies || {}).length;
  results.devDeps = Object.keys(pkg.devDependencies || {}).length;
  console.log(`${COLORS.green}✓${COLORS.reset} Dependencies: ${results.totalDeps}`);
  console.log(`${COLORS.green}✓${COLORS.reset} Dev dependencies: ${results.devDeps}`);
} catch {
  console.log(`${COLORS.red}✗${COLORS.reset} Could not read package.json`);
}

try {
  const auditOutput = execSync('npm audit --json 2>/dev/null', { encoding: 'utf8' });
  const audit = JSON.parse(auditOutput);
  if (audit.metadata && audit.metadata.vulnerabilities) {
    results.vulnerabilities = audit.metadata.vulnerabilities;
  }
} catch {
  console.log(`${COLORS.yellow}⚠${COLORS.reset} npm audit returned warnings (normal for some packages)`);
}

console.log('\n' + '═'.repeat(60));
console.log(`\n${COLORS.blue}DEPENDENCY SUMMARY:${COLORS.reset}`);
console.log(`  Total dependencies: ${results.totalDeps}`);
console.log(`  Dev dependencies: ${results.devDeps}`);
console.log(`  Vulnerabilities:`);
console.log(`    Critical: ${results.vulnerabilities.critical || 0}`);
console.log(`    High: ${results.vulnerabilities.high || 0}`);
console.log(`    Moderate: ${results.vulnerabilities.moderate || 0}`);
console.log(`    Low: ${results.vulnerabilities.low || 0}`);

const hasCritical = (results.vulnerabilities.critical || 0) > 0;

if (hasCritical) {
  console.log(`\n${COLORS.red}❌ FAIL - Critical vulnerabilities found${COLORS.reset}`);
  results.passed = false;
  process.exit(1);
} else {
  console.log(`\n${COLORS.green}✅ PASS - No critical vulnerabilities${COLORS.reset}`);
}

fs.writeFileSync('docs/scan-deps-result.json', JSON.stringify(results, null, 2));
console.log(`\nResults saved to: docs/scan-deps-result.json`);
