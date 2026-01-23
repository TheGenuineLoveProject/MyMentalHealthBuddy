#!/usr/bin/env node
/**
 * ============================================================================
 * VERIFY-ROUTES-MANIFEST.MJS - CI Drift Detection for Route Manifest & Config
 * ============================================================================
 * 
 * Verifies that both:
 *   - reports/routes.generated.json matches reports/routes.generated.sha256
 *   - reports/routes.config.snapshot.json matches reports/routes.config.sha256
 * 
 * Usage:
 *   node scripts/verify-routes-manifest.mjs           (verify only)
 *   node scripts/verify-routes-manifest.mjs --fix     (auto-repair locally)
 * 
 * CI Integration:
 *   npm run gen:pages:all
 *   npm run verify:routes
 * 
 * If this script fails, it means the route manifest or config snapshot has
 * drifted from the committed version. Run `npm run gen:pages:all` and commit
 * the updated reports/* files.
 * 
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// File paths
const MANIFEST_PATH = path.join(ROOT, 'reports', 'routes.generated.json');
const MANIFEST_HASH_PATH = path.join(ROOT, 'reports', 'routes.generated.sha256');
const CONFIG_PATH = path.join(ROOT, 'reports', 'routes.config.snapshot.json');
const CONFIG_HASH_PATH = path.join(ROOT, 'reports', 'routes.config.sha256');

// Parse arguments
const args = process.argv.slice(2);
const fixMode = args.includes('--fix');
const isCI = process.env.CI === 'true' || process.env.CI === '1' || !!process.env.CI;

// ============================================================================
// CI SAFETY CHECK
// ============================================================================

if (fixMode && isCI) {
  console.error('❌ ERROR: Do not use --fix in CI.');
  console.error('');
  console.error('   The --fix flag is intended for local development only.');
  console.error('   In CI, verify that routes are pre-generated and committed.');
  console.error('');
  process.exit(1);
}

// ============================================================================
// VERIFICATION FUNCTIONS
// ============================================================================

function verifyFile(jsonPath, hashPath, label) {
  const result = {
    label,
    ok: false,
    error: null,
    expectedHash: null,
    computedHash: null
  };

  // Check if files exist
  if (!fs.existsSync(jsonPath)) {
    result.error = `Missing: ${path.relative(ROOT, jsonPath)}`;
    return result;
  }

  if (!fs.existsSync(hashPath)) {
    result.error = `Missing: ${path.relative(ROOT, hashPath)}`;
    return result;
  }

  // Read files
  const content = fs.readFileSync(jsonPath, 'utf8');
  const storedHash = fs.readFileSync(hashPath, 'utf8').trim();

  // Compute hash
  const computedHash = crypto.createHash('sha256').update(content).digest('hex');

  result.expectedHash = storedHash;
  result.computedHash = computedHash;

  if (computedHash === storedHash) {
    result.ok = true;
  } else {
    result.error = 'Hash mismatch';
  }

  return result;
}

function printResult(result) {
  if (result.ok) {
    console.log(`✅ ${result.label}: OK`);
    console.log(`   Hash: ${result.computedHash.slice(0, 16)}...`);
  } else {
    console.error(`❌ ${result.label}: FAILED`);
    if (result.error === 'Hash mismatch') {
      console.error(`   Expected: ${result.expectedHash.slice(0, 16)}...`);
      console.error(`   Computed: ${result.computedHash.slice(0, 16)}...`);
    } else {
      console.error(`   ${result.error}`);
    }
  }
}

function runVerification() {
  console.log('🔍 Verifying route manifest integrity...\n');

  const manifestResult = verifyFile(MANIFEST_PATH, MANIFEST_HASH_PATH, 'Route Manifest');
  const configResult = verifyFile(CONFIG_PATH, CONFIG_HASH_PATH, 'Config Snapshot');

  printResult(manifestResult);
  console.log('');
  printResult(configResult);

  const allOk = manifestResult.ok && configResult.ok;

  if (allOk) {
    console.log('\n✅ All verifications passed. No drift detected.\n');
  }

  return { allOk, manifestResult, configResult };
}

// ============================================================================
// FIX MODE
// ============================================================================

function runFix() {
  console.log('🔧 Running auto-fix (regenerating routes)...\n');

  try {
    execSync('node scripts/generate-pages.mjs --mode=all', {
      cwd: ROOT,
      stdio: 'inherit'
    });
  } catch (err) {
    console.error('\n❌ Generator failed. Cannot auto-fix.');
    process.exit(1);
  }

  console.log('\n🔍 Re-verifying after regeneration...\n');

  const { allOk } = runVerification();

  if (allOk) {
    console.log('✅ Fixed. Commit reports/* changes.\n');
    console.log('   git add reports/');
    console.log('   git commit -m "Regenerate route manifest"\n');
    process.exit(0);
  } else {
    console.error('\n❌ Still failing after regeneration. Manual investigation required.\n');
    process.exit(1);
  }
}

// ============================================================================
// MAIN
// ============================================================================

function main() {
  if (fixMode) {
    runFix();
  } else {
    const { allOk } = runVerification();

    if (!allOk) {
      console.error('\n❌ ROUTE MANIFEST DRIFT DETECTED');
      console.error('');
      console.error('   ┌─────────────────────────────────────────────────────────────┐');
      console.error('   │  To fix this, run:                                          │');
      console.error('   │                                                             │');
      console.error('   │    npm run verify:routes:fix                                │');
      console.error('   │                                                             │');
      console.error('   │  Or manually:                                               │');
      console.error('   │                                                             │');
      console.error('   │    npm run gen:pages:all                                    │');
      console.error('   │                                                             │');
      console.error('   │  Then commit the updated reports/* files.                   │');
      console.error('   └─────────────────────────────────────────────────────────────┘');
      console.error('');
      process.exit(1);
    }

    process.exit(0);
  }
}

main();
