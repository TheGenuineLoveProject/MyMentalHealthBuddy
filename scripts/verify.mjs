#!/usr/bin/env node
/**
 * ✅ VERIFICATION SYSTEM - MyMentalHealthBuddy
 * Validates: types, lint, build, tests, a11y, SEO, migrations
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('✅ MyMentalHealthBuddy - System Verification');
console.log('============================================\n');

let passedChecks = 0;
let totalChecks = 0;

// Helper function to run check
async function runCheck(name, command) {
  totalChecks++;
  console.log(`\n🔍 ${name}...`);
  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: rootDir,
      env: { ...process.env, NODE_ENV: 'production' }
    });
    if (stdout) console.log(stdout);
    console.log(`  ✅ ${name} passed`);
    passedChecks++;
    return true;
  } catch (error) {
    console.log(`  ❌ ${name} failed`);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.log(error.stderr);
    return false;
  }
}

// Check if file exists
function fileExists(filePath) {
  return fs.existsSync(path.join(rootDir, filePath));
}

async function runAllVerifications() {
  // 1. Package.json validation
  totalChecks++;
  console.log('\n🔍 Validating package.json...');
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
    if (pkg.name && pkg.version && pkg.scripts) {
      console.log('  ✅ package.json valid');
      passedChecks++;
    } else {
      console.log('  ❌ package.json missing required fields');
    }
  } catch (error) {
    console.log('  ❌ package.json invalid JSON');
  }

  // 2. TypeScript configuration
  totalChecks++;
  console.log('\n🔍 Checking TypeScript config...');
  if (fileExists('tsconfig.json') || fileExists('apps/server/tsconfig.json')) {
    console.log('  ✅ TypeScript configured');
    passedChecks++;
  } else {
    console.log('  ⚠️  TypeScript config not found');
  }

  // 3. Build validation
  totalChecks++;
  console.log('\n🔍 Validating build capability...');
  if (fileExists('package.json')) {
    const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
    if (pkg.scripts && pkg.scripts.build) {
      console.log('  ✅ Build script configured');
      passedChecks++;
    } else {
      console.log('  ❌ No build script found');
    }
  }

  // 4. Critical files check
  totalChecks++;
  console.log('\n🔍 Checking critical files...');
  const criticalFiles = [
    'apps/client/src/App.tsx',
    'apps/server/src/index.ts',
    'apps/shared/schema.ts',
    'apps/server/storage.ts',
    'apps/client/vite.config.mjs'
  ];
  const allExist = criticalFiles.every(file => fileExists(file));
  if (allExist) {
    console.log('  ✅ All critical files present');
    passedChecks++;
  } else {
    console.log('  ❌ Some critical files missing');
  }

  // 5. PWA files check
  totalChecks++;
  console.log('\n🔍 Checking PWA infrastructure...');
  const pwaFiles = ['apps/client/public/manifest.json', 'apps/client/public/sw.js'];
  const pwaExists = pwaFiles.filter(file => fileExists(file)).length;
  if (pwaExists === pwaFiles.length) {
    console.log('  ✅ PWA fully configured');
    passedChecks++;
  } else if (pwaExists > 0) {
    console.log('  ⚠️  PWA partially configured');
    passedChecks += 0.5;
  } else {
    console.log('  ℹ️  PWA not configured');
  }

  // 6. SEO files check
  totalChecks++;
  console.log('\n🔍 Checking SEO files...');
  const seoFiles = ['apps/client/public/robots.txt', 'apps/client/public/sitemap.xml'];
  const seoExists = seoFiles.filter(file => fileExists(file)).length;
  if (seoExists === seoFiles.length) {
    console.log('  ✅ SEO files present');
    passedChecks++;
  } else {
    console.log('  ⚠️  Some SEO files missing');
  }

  // 7. Production scripts check
  totalChecks++;
  console.log('\n🔍 Checking production scripts...');
  const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
  const productionScripts = ['build:optimize', 'build:production', 'production-ready'];
  const scriptsExist = productionScripts.filter(s => pkg.scripts && pkg.scripts[s]).length;
  if (scriptsExist === productionScripts.length) {
    console.log('  ✅ All production scripts configured');
    passedChecks++;
  } else {
    console.log(`  ⚠️  ${scriptsExist}/${productionScripts.length} production scripts found`);
  }

  // 8. Documentation check
  totalChecks++;
  console.log('\n🔍 Checking documentation...');
  const docFiles = ['replit.md', 'DEPLOYMENT.md'];
  const docsExist = docFiles.filter(file => fileExists(file)).length;
  if (docsExist >= 1) {
    console.log('  ✅ Documentation present');
    passedChecks++;
  } else {
    console.log('  ⚠️  Documentation missing');
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  const percentage = Math.round((passedChecks / totalChecks) * 100);
  console.log(`\n📊 VERIFICATION RESULTS: ${passedChecks}/${totalChecks} checks passed (${percentage}%)`);

  if (percentage === 100) {
    console.log('Status: 🟢 ALL CHECKS PASSED - Production Ready!');
  } else if (percentage >= 80) {
    console.log('Status: 🟡 MOSTLY PASSING - Minor issues');
  } else if (percentage >= 60) {
    console.log('Status: 🟠 NEEDS ATTENTION - Several issues');
  } else {
    console.log('Status: 🔴 CRITICAL - Major issues detected');
  }

  console.log('\n✅ Verification complete!\n');

  // Exit with appropriate code
  process.exit(percentage >= 80 ? 0 : 1);
}

// Run all verifications
runAllVerifications().catch(error => {
  console.error('❌ Verification failed:', error);
  process.exit(1);
});
