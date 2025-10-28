#!/usr/bin/env node

/**
 * Production Readiness Check Script
 * 
 * Validates that all production requirements are met before deployment.
 * Run this script before publishing to ensure smooth deployment.
 * 
 * Usage: node scripts/production-check.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.magenta}${'='.repeat(50)}${colors.reset}\n${colors.magenta}${msg}${colors.reset}\n${colors.magenta}${'='.repeat(50)}${colors.reset}\n`),
};

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
let warnings = 0;

function check(name, condition, errorMsg, isWarning = false) {
  totalChecks++;
  if (condition) {
    log.success(name);
    passedChecks++;
    return true;
  } else {
    if (isWarning) {
      log.warning(`${name}: ${errorMsg}`);
      warnings++;
    } else {
      log.error(`${name}: ${errorMsg}`);
      failedChecks++;
    }
    return false;
  }
}

async function checkProductionReadiness() {
  log.section('🚀 Production Readiness Check');
  
  // 1. Check package.json scripts
  log.section('📦 Package Scripts');
  
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  let packageJson;
  
  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    check(
      'package.json exists',
      true,
      ''
    );
  } catch (error) {
    check(
      'package.json exists',
      false,
      'Cannot read package.json'
    );
    process.exit(1);
  }
  
  check(
    'Build script exists',
    packageJson.scripts && packageJson.scripts.build,
    'Missing "build" script in package.json'
  );
  
  check(
    'Start script exists',
    packageJson.scripts && packageJson.scripts.start,
    'Missing "start" script in package.json'
  );
  
  check(
    'Production start command is correct',
    packageJson.scripts?.start?.includes('NODE_ENV=production'),
    'Start script should set NODE_ENV=production'
  );
  
  // 2. Check build directories
  log.section('🏗️  Build Configuration');
  
  const clientDistPath = path.join(__dirname, '..', 'apps', 'client', 'dist');
  const serverDistPath = path.join(__dirname, '..', 'dist');
  
  check(
    'Client build directory will be created',
    fs.existsSync(path.join(__dirname, '..', 'apps', 'client')),
    'Client app directory not found'
  );
  
  check(
    'Server build directory will be created',
    fs.existsSync(path.join(__dirname, '..', 'apps', 'server')),
    'Server app directory not found'
  );
  
  // 3. Check .replit configuration
  log.section('⚙️  Replit Configuration');
  
  const replitPath = path.join(__dirname, '..', '.replit');
  let replitContent = '';
  
  try {
    replitContent = fs.readFileSync(replitPath, 'utf8');
    check('`.replit` file exists', true, '');
  } catch (error) {
    check('`.replit` file exists', false, 'Cannot read .replit file');
  }
  
  check(
    'Deployment section configured',
    replitContent.includes('[deployment]'),
    'Missing [deployment] section in .replit file'
  );
  
  const portMatches = replitContent.match(/\[\[ports\]\]/g);
  const portCount = portMatches ? portMatches.length : 0;
  
  check(
    'Single port configuration (Autoscale requirement)',
    portCount === 1,
    `Found ${portCount} [[ports]] sections. Autoscale requires exactly 1. Edit .replit manually.`,
    false  // Make this a hard failure, not a warning
  );
  
  if (portCount > 1) {
    log.warning('   → Remove extra [[ports]] sections from .replit file');
    log.warning('   → Keep only: [[ports]]\\n   localPort = 5000\\n   externalPort = 80');
  }
  
  // 4. Check critical files
  log.section('📄 Critical Files');
  
  const criticalFiles = [
    'apps/server/src/index.ts',
    'apps/client/src/App.tsx',
    'apps/shared/db-schema.ts',
    'DEPLOYMENT.md',
    'ENVIRONMENT_VARIABLES.md',
  ];
  
  for (const file of criticalFiles) {
    check(
      `${file}`,
      fs.existsSync(path.join(__dirname, '..', file)),
      `Missing critical file: ${file}`
    );
  }
  
  // 5. Check environment variable documentation
  log.section('🔐 Environment Variables');
  
  log.info('Required environment variables (must be set in Replit Secrets):');
  console.log('   1. DATABASE_URL (auto-provided by Replit PostgreSQL)');
  console.log('   2. SESSION_SECRET (generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))")');
  console.log('   3. OPENAI_API_KEY (for AI chat features)');
  console.log('   4. STRIPE_SECRET_KEY (for billing)');
  console.log('   5. VITE_STRIPE_PUBLIC_KEY (for billing)');
  console.log('');
  log.info('Optional environment variables:');
  console.log('   - STRIPE_WEBHOOK_SECRET (recommended for production)');
  console.log('   - CANVA_CLIENT_ID, CANVA_CLIENT_SECRET, CANVA_REDIRECT_URI');
  console.log('');
  log.info('See ENVIRONMENT_VARIABLES.md for complete documentation');
  
  // 6. Check dependencies
  log.section('📚 Dependencies');
  
  check(
    'node_modules exists',
    fs.existsSync(path.join(__dirname, '..', 'node_modules')),
    'Run npm install before deployment',
    true
  );
  
  const criticalDeps = [
    'express',
    'react',
    'stripe',
    'openai',
    'drizzle-orm',
    'pg',
  ];
  
  for (const dep of criticalDeps) {
    check(
      `${dep} installed`,
      packageJson.dependencies && packageJson.dependencies[dep],
      `Missing dependency: ${dep}`
    );
  }
  
  // 7. Security check
  log.section('🔒 Security');
  
  check(
    'Helmet security middleware',
    fs.readFileSync(path.join(__dirname, '..', 'apps', 'server', 'src', 'index.ts'), 'utf8').includes('helmet'),
    'Helmet security middleware not configured'
  );
  
  check(
    'CORS configured',
    fs.readFileSync(path.join(__dirname, '..', 'apps', 'server', 'src', 'index.ts'), 'utf8').includes('cors'),
    'CORS middleware not configured'
  );
  
  log.warning('Authentication vulnerability: x-user-id header is client-controlled');
  log.warning('   → This is a KNOWN SECURITY ISSUE documented in replit.md');
  log.warning('   → Implement proper session authentication before production');
  
  // 8. Performance check
  log.section('⚡ Performance');
  
  const viteConfigPath = path.join(__dirname, '..', 'apps', 'client', 'vite.config.mjs');
  let viteConfig = '';
  
  try {
    viteConfig = fs.readFileSync(viteConfigPath, 'utf8');
  } catch (error) {
    log.warning('Cannot read vite.config.mjs');
  }
  
  check(
    'Compression enabled',
    viteConfig.includes('vite-plugin-compression'),
    'Vite compression plugin not configured',
    true
  );
  
  check(
    'Code splitting configured',
    viteConfig.includes('manualChunks'),
    'Manual code splitting not configured',
    true
  );
  
  check(
    'Tree shaking enabled',
    viteConfig.includes('treeshake'),
    'Tree shaking not configured',
    true
  );
  
  // Final summary
  log.section('📊 Summary');
  
  console.log(`Total Checks: ${totalChecks}`);
  console.log(`${colors.green}✅ Passed: ${passedChecks}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failedChecks}${colors.reset}`);
  console.log(`${colors.yellow}⚠️  Warnings: ${warnings}${colors.reset}`);
  console.log('');
  
  if (failedChecks === 0) {
    log.success('🎉 Production readiness check PASSED!');
    log.info('Next steps:');
    console.log('   1. Set required environment variables in Replit Secrets');
    console.log('   2. Fix [[ports]] configuration in .replit if needed');
    console.log('   3. Run: npm run build (to test build)');
    console.log('   4. Run: npm run db:push (to sync database)');
    console.log('   5. Click "Publish" in Replit');
    console.log('');
    return 0;
  } else {
    log.error('Production readiness check FAILED');
    log.error(`Please fix ${failedChecks} critical issue(s) before deployment`);
    console.log('');
    log.info('See DEPLOYMENT.md for detailed deployment instructions');
    return 1;
  }
}

// Run the check
checkProductionReadiness().then(exitCode => {
  process.exit(exitCode);
}).catch(error => {
  console.error('Production check script failed:', error);
  process.exit(1);
});
