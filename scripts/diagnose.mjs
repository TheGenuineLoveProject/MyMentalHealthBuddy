#!/usr/bin/env node
/**
 * 🔎 DIAGNOSTIC SYSTEM - MyMentalHealthBuddy
 * Scans repository health: environment variables, imports, content, configuration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🔎 MyMentalHealthBuddy - System Diagnostics');
console.log('============================================\n');

const findings = [];
let healthScore = 100;

// 1. Check critical environment variables
console.log('📋 Checking Environment Variables...');
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'OPENAI_API_KEY',
  'STRIPE_SECRET_KEY',
  'VITE_STRIPE_PUBLIC_KEY'
];

const optionalEnvVars = [
  'NODE_ENV',
  'PORT',
  'STRIPE_WEBHOOK_SECRET',
  'S3_ENDPOINT',
  'EMAIL_API_KEY'
];

requiredEnvVars.forEach(key => {
  if (!process.env[key]) {
    findings.push({ type: 'missing_env', key, severity: 'high' });
    healthScore -= 15;
    console.log(`  ❌ Missing required: ${key}`);
  } else {
    console.log(`  ✅ Found: ${key}`);
  }
});

optionalEnvVars.forEach(key => {
  if (!process.env[key]) {
    console.log(`  ℹ️  Optional not set: ${key}`);
  } else {
    console.log(`  ✅ Found optional: ${key}`);
  }
});

// 2. Check critical files exist
console.log('\n📁 Checking Critical Files...');
const criticalFiles = [
  'apps/client/src/App.tsx',
  'apps/server/src/index.ts',
  'shared/schema.ts',
  'apps/server/src/storage.ts',
  'apps/server/src/routes.ts',
  'package.json',
  'vite.config.ts'
];

criticalFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    findings.push({ type: 'missing_file', path: file, severity: 'high' });
    healthScore -= 10;
    console.log(`  ❌ Missing: ${file}`);
  }
});

// 3. Check package.json scripts
console.log('\n📦 Checking Package Scripts...');
const pkgPath = path.join(rootDir, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  const recommendedScripts = [
    'dev:server',
    'dev:client',
    'build',
    'build:optimize',
    'build:production',
    'production-ready'
  ];
  
  recommendedScripts.forEach(script => {
    if (pkg.scripts && pkg.scripts[script]) {
      console.log(`  ✅ ${script}`);
    } else {
      findings.push({ type: 'missing_script', script, severity: 'low' });
      healthScore -= 2;
      console.log(`  ⚠️  Missing script: ${script}`);
    }
  });
}

// 4. Check build artifacts
console.log('\n🏗️  Checking Build Status...');
const buildDirs = [
  'apps/client/dist',
  'apps/server/dist'
];

buildDirs.forEach(dir => {
  const dirPath = path.join(rootDir, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`  ✅ Built: ${dir}`);
  } else {
    console.log(`  ℹ️  Not built yet: ${dir}`);
  }
});

// 5. Check PWA files
console.log('\n🌐 Checking PWA Infrastructure...');
const pwaFiles = [
  'apps/client/public/manifest.json',
  'apps/client/public/sw.js',
  'apps/client/public/robots.txt',
  'apps/client/public/sitemap.xml'
];

pwaFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    findings.push({ type: 'missing_pwa_file', path: file, severity: 'medium' });
    healthScore -= 3;
    console.log(`  ⚠️  Missing: ${file}`);
  }
});

// 6. Check documentation
console.log('\n📚 Checking Documentation...');
const docFiles = [
  'replit.md',
  '360_DEGREE_ENHANCEMENTS.md',
  'DEPLOYMENT.md',
  'PRODUCTION_CHECKLIST.md'
];

docFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ℹ️  Optional doc: ${file}`);
  }
});

// Calculate final health score
healthScore = Math.max(0, Math.min(100, healthScore));

// Output results
console.log('\n' + '='.repeat(50));
console.log(`\n🏥 HEALTH SCORE: ${healthScore}/100`);

if (healthScore >= 90) {
  console.log('Status: 🟢 EXCELLENT - Production Ready');
} else if (healthScore >= 75) {
  console.log('Status: 🟡 GOOD - Minor improvements recommended');
} else if (healthScore >= 50) {
  console.log('Status: 🟠 FAIR - Action required');
} else {
  console.log('Status: 🔴 CRITICAL - Immediate attention needed');
}

console.log(`\nFindings: ${findings.length} issue(s) detected`);

if (findings.length > 0) {
  console.log('\n📊 Detailed Findings:\n');
  console.log(JSON.stringify(findings, null, 2));
}

console.log('\n✅ Diagnostic scan complete!\n');

// Exit with appropriate code
process.exit(healthScore >= 75 ? 0 : 1);
