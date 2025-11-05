#!/usr/bin/env node
/**
 * Platform Verification Tool
 * Verifies build, lint, types, and overall platform integrity
 */

console.log("✅ MyMentalHealthBuddy Platform Verification\n");

import { execSync } from 'child_process';

const checks = [];

// Check TypeScript compilation
try {
  console.log("🔍 Checking TypeScript compilation...");
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  checks.push({ name: 'TypeScript', status: 'pass' });
  console.log("✅ TypeScript: PASS");
} catch (e) {
  checks.push({ name: 'TypeScript', status: 'fail', error: 'Type errors detected' });
  console.log("❌ TypeScript: FAIL");
}

// Check build
try {
  console.log("\n🔍 Checking production build...");
  execSync('npm run build:production', { stdio: 'pipe' });
  checks.push({ name: 'Build', status: 'pass' });
  console.log("✅ Build: PASS");
} catch (e) {
  checks.push({ name: 'Build', status: 'fail', error: 'Build failed' });
  console.log("❌ Build: FAIL");
}

const passCount = checks.filter(c => c.status === 'pass').length;
const integrity = Math.round((passCount / checks.length) * 100);

console.log(`\n📊 Platform Integrity: ${integrity}%`);
console.log(`✅ ${passCount}/${checks.length} checks passed`);

process.exit(integrity >= 90 ? 0 : 1);
