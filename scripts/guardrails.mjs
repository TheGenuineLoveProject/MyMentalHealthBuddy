#!/usr/bin/env node
/**
 * scripts/guardrails.mjs — Environment and security guardrails check
 * Validates env vars, port config, and ensures no secrets are committed
 * Human-triggered only
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PASS = '✅ PASS';
const FAIL = '❌ FAIL';
const WARN = '⚠️  WARN';

let hasErrors = false;
let hasWarnings = false;

function check(name, condition, errorMsg = null) {
  if (condition) {
    console.log(`  ${PASS} ${name}`);
    return true;
  } else {
    console.log(`  ${FAIL} ${name}${errorMsg ? `: ${errorMsg}` : ''}`);
    hasErrors = true;
    return false;
  }
}

function warn(name, condition, warnMsg = null) {
  if (condition) {
    console.log(`  ${PASS} ${name}`);
    return true;
  } else {
    console.log(`  ${WARN} ${name}${warnMsg ? `: ${warnMsg}` : ''}`);
    hasWarnings = true;
    return false;
  }
}

function runCommand(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: 'pipe' });
  } catch (e) {
    return '';
  }
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('  A→Z 360 GUARDRAILS CHECK');
console.log('═══════════════════════════════════════════════════════════════\n');

// 1. Environment Configuration
console.log('🔐 ENVIRONMENT CONFIGURATION');
console.log('─────────────────────────────────────────────────────────────────');

check('.env.example exists', fs.existsSync('.env.example'));

if (fs.existsSync('.env.example')) {
  const envExample = fs.readFileSync('.env.example', 'utf8');
  check('DATABASE_URL documented', envExample.includes('DATABASE_URL'));
  check('SESSION_SECRET documented', envExample.includes('SESSION_SECRET'));
  check('PORT documented', envExample.includes('PORT'));
  warn('STRIPE_SECRET_KEY documented', envExample.includes('STRIPE'));
  warn('OPENAI_API_KEY documented', envExample.includes('OPENAI') || envExample.includes('AI_'));
}
console.log('');

// 2. Port Configuration
console.log('🌐 PORT CONFIGURATION');
console.log('─────────────────────────────────────────────────────────────────');

if (fs.existsSync('server/index.mjs')) {
  const serverCode = fs.readFileSync('server/index.mjs', 'utf8');
  check('Server binds to 0.0.0.0', serverCode.includes('0.0.0.0'));
  check('Server uses process.env.PORT', serverCode.includes('process.env.PORT') || serverCode.includes('PORT'));
  warn('Single port pattern', !serverCode.includes(':3000') && !serverCode.includes(':8080'));
}
console.log('');

// 3. Secrets Safety
console.log('🔒 SECRETS SAFETY');
console.log('─────────────────────────────────────────────────────────────────');

// Check .gitignore
check('.gitignore exists', fs.existsSync('.gitignore'));

if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  check('.env in .gitignore', gitignore.includes('.env'));
  warn('node_modules in .gitignore', gitignore.includes('node_modules'));
}

// Check for hardcoded secrets
const secretPatterns = [
  'sk_live_',
  'sk_test_',
  'whsec_',
  'AKIA',
  'password\\s*=\\s*["\'][^"\']+["\']'
];

let secretsFound = false;
secretPatterns.forEach(pattern => {
  const result = runCommand(`grep -rn "${pattern}" server client shared --include="*.js" --include="*.mjs" --include="*.ts" --include="*.tsx" --include="*.jsx" 2>/dev/null || true`);
  if (result.trim()) {
    secretsFound = true;
    console.log(`  ${FAIL} Potential hardcoded secret found: ${pattern}`);
  }
});

if (!secretsFound) {
  console.log(`  ${PASS} No hardcoded secrets detected`);
}
console.log('');

// 4. Security Headers
console.log('🛡️  SECURITY HEADERS');
console.log('─────────────────────────────────────────────────────────────────');

if (fs.existsSync('server/index.mjs')) {
  const serverCode = fs.readFileSync('server/index.mjs', 'utf8');
  check('Helmet middleware', serverCode.includes('helmet'));
  check('CORS middleware', serverCode.includes('cors'));
  warn('Rate limiting', serverCode.includes('rateLimit') || serverCode.includes('rate-limit'));
}
console.log('');

// 5. Input Validation
console.log('✅ INPUT VALIDATION');
console.log('─────────────────────────────────────────────────────────────────');

const zodUsage = runCommand('grep -rn "z\\.object\\|z\\.string\\|z\\.number\\|zod" server --include="*.mjs" --include="*.ts" 2>/dev/null | wc -l');
const zodCount = parseInt(zodUsage.trim()) || 0;
check('Zod validation in use', zodCount > 5, `Found ${zodCount} Zod references`);
console.log('');

// 6. Error Handling
console.log('🚨 ERROR HANDLING');
console.log('─────────────────────────────────────────────────────────────────');

check('Error handler middleware', fs.existsSync('server/middleware/errorHandler.mjs'));
check('Request ID middleware', fs.existsSync('server/middleware/requestId.mjs'));

if (fs.existsSync('server/middleware/errorHandler.mjs')) {
  const errorHandler = fs.readFileSync('server/middleware/errorHandler.mjs', 'utf8');
  warn('Stack traces hidden in prod', errorHandler.includes('production') || errorHandler.includes('NODE_ENV'));
}
console.log('');

// Summary
console.log('═══════════════════════════════════════════════════════════════');
console.log('  GUARDRAILS SUMMARY');
console.log('═══════════════════════════════════════════════════════════════\n');

if (!hasErrors && !hasWarnings) {
  console.log('🎉 All guardrails passed! Platform is secure.\n');
  process.exit(0);
} else if (!hasErrors) {
  console.log('⚠️  Passed with warnings. Review recommendations above.\n');
  process.exit(0);
} else {
  console.log('❌ Guardrails failed. Fix errors above before deploying.\n');
  process.exit(1);
}
