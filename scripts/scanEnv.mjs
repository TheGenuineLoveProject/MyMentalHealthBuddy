#!/usr/bin/env node
/**
 * Environment Variable Scanner
 * Audits env vars and ensures no hardcoded secrets
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
console.log(`${COLORS.blue}║           ENVIRONMENT VARIABLE SCANNER                     ║${COLORS.reset}`);
console.log(`${COLORS.blue}╚════════════════════════════════════════════════════════════╝${COLORS.reset}\n`);

const results = {
  envVarsUsed: [],
  hardcodedSecrets: [],
  missingEnvExample: false,
  passed: true,
};

const knownEnvVars = [
  'DATABASE_URL',
  'OPENAI_API_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'RESEND_API_KEY',
  'PERPLEXITY_API_KEY',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET',
  'ADMIN_TOKEN',
  'SESSION_SECRET',
  'NODE_ENV',
  'PORT',
  'REPLIT_DOMAINS',
  'REPL_ID',
];

try {
  const envUsage = execSync(
    'grep -rh "process\\.env\\." server/ client/src/ --include="*.mjs" --include="*.js" --include="*.jsx" --include="*.tsx" --include="*.ts" 2>/dev/null | grep -oE "process\\.env\\.[A-Z_]+" | sort -u',
    { encoding: 'utf8' }
  );
  results.envVarsUsed = envUsage.trim().split('\n').filter(Boolean).map(e => e.replace('process.env.', ''));
  console.log(`${COLORS.green}✓${COLORS.reset} Environment variables detected: ${results.envVarsUsed.length}`);
} catch {
  console.log(`${COLORS.yellow}⚠${COLORS.reset} Could not scan env var usage`);
}

const secretPatterns = [
  'sk_live_',
  'sk_test_',
  'pk_live_',
  'Bearer [A-Za-z0-9-_]+',
  'api[_-]?key.*=.*["\'][A-Za-z0-9]{20,}',
];

try {
  secretPatterns.forEach(pattern => {
    try {
      const matches = execSync(
        `grep -rn "${pattern}" server/ client/src/ --include="*.mjs" --include="*.js" --include="*.jsx" --include="*.tsx" 2>/dev/null | grep -v "process.env" | head -5`,
        { encoding: 'utf8' }
      );
      if (matches.trim()) {
        results.hardcodedSecrets.push({ pattern, matches: matches.trim().split('\n') });
        results.passed = false;
      }
    } catch {}
  });
} catch {}

if (!fs.existsSync('.env.example')) {
  results.missingEnvExample = true;
  console.log(`${COLORS.yellow}⚠${COLORS.reset} Missing .env.example file`);
} else {
  console.log(`${COLORS.green}✓${COLORS.reset} .env.example exists`);
}

console.log('\n' + '═'.repeat(60));
console.log(`\n${COLORS.blue}ENV VAR SUMMARY:${COLORS.reset}`);
console.log(`  Variables detected: ${results.envVarsUsed.length}`);
console.log(`  Hardcoded secrets: ${results.hardcodedSecrets.length}`);
console.log(`  .env.example: ${results.missingEnvExample ? 'MISSING' : 'EXISTS'}`);

if (results.hardcodedSecrets.length > 0) {
  console.log(`\n${COLORS.red}❌ HARDCODED SECRETS FOUND:${COLORS.reset}`);
  results.hardcodedSecrets.forEach(s => {
    console.log(`  Pattern: ${s.pattern}`);
    s.matches.forEach(m => console.log(`    ${m}`));
  });
}

if (results.passed && !results.missingEnvExample) {
  console.log(`\n${COLORS.green}✅ PASS - No hardcoded secrets detected${COLORS.reset}`);
} else if (results.hardcodedSecrets.length > 0) {
  console.log(`\n${COLORS.red}❌ FAIL - Hardcoded secrets must be removed${COLORS.reset}`);
  process.exit(1);
} else {
  console.log(`\n${COLORS.yellow}⚠ WARNING - .env.example should be created${COLORS.reset}`);
}

fs.writeFileSync('docs/scan-env-result.json', JSON.stringify(results, null, 2));
console.log(`\nResults saved to: docs/scan-env-result.json`);
