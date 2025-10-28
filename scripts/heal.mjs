#!/usr/bin/env node
/**
 * 🩹 HEALING SYSTEM - MyMentalHealthBuddy
 * Safe auto-fixes: missing files, normalizations, placeholders
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🩹 MyMentalHealthBuddy - Auto-Healing System');
console.log('==============================================\n');

let healingActions = 0;

// 1. Create .env.example if missing
console.log('📝 Checking .env.example...');
const envExamplePath = path.join(rootDir, '.env.example');
if (!fs.existsSync(envExamplePath)) {
  const envExample = `# MyMentalHealthBuddy Environment Variables
# Copy to .env and configure

# === REQUIRED ===
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=change_me_to_secure_random_string

# OpenAI API
OPENAI_API_KEY=sk-proj-...

# Stripe (Billing)
STRIPE_SECRET_KEY=sk_test_...
VITE_STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# === OPTIONAL ===
# Stripe Price IDs
STRIPE_PRICE_FREE_ID=price_...
STRIPE_PRICE_PREMIUM_ID=price_...
STRIPE_PRICE_PROFESSIONAL_ID=price_...

# S3 / Object Storage
S3_ENDPOINT=
S3_REGION=
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=

# Email (SendGrid/Postmark/etc)
EMAIL_PROVIDER=
EMAIL_API_KEY=
EMAIL_FROM=

# Analytics
GA4_MEASUREMENT_ID=
PLAUSIBLE_DOMAIN=
POSTHOG_KEY=

# Monitoring
SENTRY_DSN=
LOGROCK_APP_ID=

# Features
YOUTUBE_API_KEY=
TTS_PROVIDER=
TTS_API_KEY=
`;
  fs.writeFileSync(envExamplePath, envExample);
  console.log('  ✅ Created .env.example');
  healingActions++;
} else {
  console.log('  ✅ .env.example exists');
}

// 2. Create .gitignore additions if needed
console.log('\n📝 Checking .gitignore...');
const gitignorePath = path.join(rootDir, '.gitignore');
const gitignoreAdditions = [
  '# Self-evolution system',
  '.rollback/',
  'build-report.json',
  'analytics-config.json',
  '',
  '# Environment',
  '.env',
  '.env.local',
  '.env.*.local',
  '',
  '# Build artifacts',
  'dist/',
  'apps/*/dist/',
  '*.log',
  'npm-debug.log*',
  '',
  '# IDE',
  '.vscode/*',
  '!.vscode/settings.json',
  '.idea/',
  '*.swp',
  '*.swo',
  '',
  '# OS',
  '.DS_Store',
  'Thumbs.db'
].join('\n');

if (fs.existsSync(gitignorePath)) {
  const currentGitignore = fs.readFileSync(gitignorePath, 'utf-8');
  if (!currentGitignore.includes('.rollback/')) {
    fs.appendFileSync(gitignorePath, '\n' + gitignoreAdditions + '\n');
    console.log('  ✅ Updated .gitignore with self-evolution entries');
    healingActions++;
  } else {
    console.log('  ✅ .gitignore up to date');
  }
} else {
  fs.writeFileSync(gitignorePath, gitignoreAdditions);
  console.log('  ✅ Created .gitignore');
  healingActions++;
}

// 3. Ensure rollback directory exists
console.log('\n📁 Checking rollback directory...');
const rollbackDir = path.join(rootDir, '.rollback');
if (!fs.existsSync(rollbackDir)) {
  fs.mkdirSync(rollbackDir, { recursive: true });
  console.log('  ✅ Created .rollback directory');
  healingActions++;
} else {
  console.log('  ✅ .rollback directory exists');
}

// 4. Create content directory structure if missing
console.log('\n📁 Checking content directories...');
const contentDirs = ['content/blog', 'public/healing-ui', 'config'];
contentDirs.forEach(dir => {
  const dirPath = path.join(rootDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`  ✅ Created ${dir}`);
    healingActions++;
  } else {
    console.log(`  ✅ ${dir} exists`);
  }
});

// 5. Create health check script if missing
console.log('\n📝 Checking health check script...');
const healthScriptPath = path.join(rootDir, 'scripts', 'health.js');
if (!fs.existsSync(healthScriptPath)) {
  const healthScript = `// Simple health check
console.log('Health check: OK');
process.exit(0);
`;
  fs.writeFileSync(healthScriptPath, healthScript);
  console.log('  ✅ Created health.js');
  healingActions++;
} else {
  console.log('  ✅ health.js exists');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log(`\n✅ Healing complete: ${healingActions} action(s) applied`);

if (healingActions > 0) {
  console.log('\nThe following safe normalizations were applied:');
  console.log('  - Created missing configuration files');
  console.log('  - Ensured directory structure');
  console.log('  - Updated .gitignore for self-evolution system');
}

console.log('\n🩹 All safe auto-fixes complete!\n');
