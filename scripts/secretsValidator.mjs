#!/usr/bin/env node
/**
 * Secrets Validator (P194)
 * Validates required environment variables on startup
 * 
 * Usage: npm run validate:secrets
 */

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
};

const PASS = `${COLORS.green}✓${COLORS.reset}`;
const FAIL = `${COLORS.red}✗${COLORS.reset}`;
const WARN = `${COLORS.yellow}!${COLORS.reset}`;

const REQUIRED_SECRETS = [
  { key: 'DATABASE_URL', critical: true, description: 'PostgreSQL connection string' },
];

const RECOMMENDED_SECRETS = [
  { key: 'OPENAI_API_KEY', description: 'OpenAI API for AI chat' },
  { key: 'STRIPE_SECRET_KEY', description: 'Stripe payments' },
  { key: 'STRIPE_WEBHOOK_SECRET', description: 'Stripe webhooks' },
  { key: 'RESEND_API_KEY', description: 'Resend email service' },
  { key: 'ADMIN_TOKEN', description: 'Admin authentication' },
];

const FORBIDDEN_PATTERNS = [
  /sk-[a-zA-Z0-9]{20,}/,
  /sk_live_[a-zA-Z0-9]+/,
  /sk_test_[a-zA-Z0-9]+/,
  /password\s*=\s*["'][^"']+["']/i,
];

function checkSecrets() {
  console.log('\n🔐 Secrets Validator');
  console.log('─'.repeat(50));
  
  let criticalMissing = 0;
  let recommendedMissing = 0;
  
  console.log('\n📋 Required secrets:');
  for (const secret of REQUIRED_SECRETS) {
    const value = process.env[secret.key];
    if (value) {
      console.log(`  ${PASS} ${secret.key} - ${secret.description}`);
    } else {
      console.log(`  ${FAIL} ${secret.key} - ${secret.description} (MISSING)`);
      if (secret.critical) criticalMissing++;
    }
  }
  
  console.log('\n📋 Recommended secrets:');
  for (const secret of RECOMMENDED_SECRETS) {
    const value = process.env[secret.key];
    if (value) {
      console.log(`  ${PASS} ${secret.key}`);
    } else {
      console.log(`  ${WARN} ${secret.key} - ${secret.description} (not set)`);
      recommendedMissing++;
    }
  }
  
  console.log('\n' + '─'.repeat(50));
  
  if (criticalMissing > 0) {
    console.log(`${COLORS.red}❌ ${criticalMissing} critical secret(s) missing!${COLORS.reset}`);
    console.log('Application cannot start without required secrets.\n');
    return false;
  }
  
  if (recommendedMissing > 0) {
    console.log(`${COLORS.yellow}⚠️  ${recommendedMissing} recommended secret(s) not set${COLORS.reset}`);
    console.log('Some features may not work without these secrets.\n');
  } else {
    console.log(`${COLORS.green}✅ All secrets configured!${COLORS.reset}\n`);
  }
  
  return true;
}

const passed = checkSecrets();
process.exit(passed ? 0 : 1);
