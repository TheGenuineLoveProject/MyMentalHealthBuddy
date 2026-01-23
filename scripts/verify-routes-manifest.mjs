#!/usr/bin/env node
/**
 * ============================================================================
 * VERIFY-ROUTES-MANIFEST.MJS - CI Drift Detection for Route Manifest & Config
 * ============================================================================
 * 
 * Verifies that:
 *   1. reports/routes.generated.json matches reports/routes.generated.sha256
 *   2. reports/routes.config.snapshot.json matches reports/routes.config.sha256
 *   3. Stored snapshot matches freshly computed snapshot from routes.js
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
import { buildSnapshotWithHash } from './routes-snapshot.mjs';

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

function verifyFileIntegrity(jsonPath, hashPath, label) {
  const result = {
    label,
    ok: false,
    error: null,
    storedHash: null,
    computedHash: null
  };

  if (!fs.existsSync(jsonPath)) {
    result.error = `Missing: ${path.relative(ROOT, jsonPath)}`;
    return result;
  }

  if (!fs.existsSync(hashPath)) {
    result.error = `Missing: ${path.relative(ROOT, hashPath)}`;
    return result;
  }

  const content = fs.readFileSync(jsonPath, 'utf8');
  const storedHash = fs.readFileSync(hashPath, 'utf8').trim();
  const computedHash = crypto.createHash('sha256').update(content).digest('hex');

  result.storedHash = storedHash;
  result.computedHash = computedHash;

  if (computedHash === storedHash) {
    result.ok = true;
  } else {
    result.error = 'Hash mismatch (file modified without regenerating hash)';
  }

  return result;
}

async function verifySnapshotFreshness() {
  const result = {
    label: 'Snapshot Freshness',
    ok: false,
    error: null,
    storedHash: null,
    freshHash: null,
    diffSummary: null
  };

  if (!fs.existsSync(CONFIG_PATH)) {
    result.error = 'Snapshot file missing';
    return result;
  }

  // Load stored snapshot
  const storedContent = fs.readFileSync(CONFIG_PATH, 'utf8');
  const storedSnapshot = JSON.parse(storedContent);

  // Build fresh snapshot from routes.js
  const freshSnapshot = await buildSnapshotWithHash();

  // Compare hashes
  result.storedHash = storedSnapshot.snapshotHash;
  result.freshHash = freshSnapshot.snapshotHash;

  if (result.storedHash === result.freshHash) {
    result.ok = true;
    return result;
  }

  result.error = 'Snapshot is stale (routes.js has changed)';

  // Compute diff summary
  result.diffSummary = computeDiff(storedSnapshot, freshSnapshot);

  return result;
}

function computeDiff(stored, fresh) {
  const storedRoutes = new Map();
  for (const entry of stored.routesIndex || []) {
    storedRoutes.set(entry.route, entry);
  }

  const freshRoutes = new Map();
  for (const entry of fresh.routesIndex || []) {
    freshRoutes.set(entry.route, entry);
  }

  const addedRoutes = [];
  const removedRoutes = [];
  const changedTitles = [];
  const changedHashes = [];

  // Added (in fresh but not stored)
  for (const [route] of freshRoutes) {
    if (!storedRoutes.has(route)) {
      addedRoutes.push(route);
    }
  }

  // Removed (in stored but not fresh)
  for (const [route] of storedRoutes) {
    if (!freshRoutes.has(route)) {
      removedRoutes.push(route);
    }
  }

  // Changed (same route, different content)
  for (const [route, freshEntry] of freshRoutes) {
    const storedEntry = storedRoutes.get(route);
    if (!storedEntry) continue;

    if (storedEntry.title !== freshEntry.title) {
      changedTitles.push({
        route,
        oldTitle: storedEntry.title || '(null)',
        newTitle: freshEntry.title || '(null)'
      });
    } else if (storedEntry.routeHash !== freshEntry.routeHash) {
      changedHashes.push(route);
    }
  }

  return { addedRoutes, removedRoutes, changedTitles, changedHashes };
}

function printResult(result) {
  if (result.ok) {
    console.log(`✅ ${result.label}: OK`);
    if (result.computedHash) {
      console.log(`   Hash: ${result.computedHash.slice(0, 16)}...`);
    } else if (result.storedHash) {
      console.log(`   Hash: ${result.storedHash.slice(0, 16)}...`);
    }
  } else {
    console.error(`❌ ${result.label}: FAILED`);
    if (result.error) {
      console.error(`   ${result.error}`);
    }
    if (result.storedHash && result.freshHash) {
      console.error(`   Stored: ${result.storedHash.slice(0, 16)}...`);
      console.error(`   Fresh:  ${result.freshHash.slice(0, 16)}...`);
    } else if (result.storedHash && result.computedHash) {
      console.error(`   Stored: ${result.storedHash.slice(0, 16)}...`);
      console.error(`   Computed: ${result.computedHash.slice(0, 16)}...`);
    }
  }
}

function printList(items, prefix, maxItems = 10) {
  const show = items.slice(0, maxItems);
  for (const item of show) {
    console.log(`      ${prefix} ${item}`);
  }
  if (items.length > maxItems) {
    console.log(`      …and ${items.length - maxItems} more`);
  }
}

function printDiffSummary(diff) {
  if (!diff) return;

  const { addedRoutes, removedRoutes, changedTitles, changedHashes } = diff;

  const hasChanges = addedRoutes.length > 0 || removedRoutes.length > 0 ||
                     changedTitles.length > 0 || changedHashes.length > 0;

  if (!hasChanges) {
    console.log('\n   No route-level changes detected (possible formatting diff).\n');
    return;
  }

  console.log('\n   ╔═══════════════════════════════════════════════════════════╗');
  console.log('   ║  ROUTE DRIFT SUMMARY                                      ║');
  console.log('   ╚═══════════════════════════════════════════════════════════╝\n');

  if (addedRoutes.length > 0) {
    console.log(`   + Added: ${addedRoutes.length}`);
    printList(addedRoutes, '+');
    console.log('');
  }

  if (removedRoutes.length > 0) {
    console.log(`   - Removed: ${removedRoutes.length}`);
    printList(removedRoutes, '-');
    console.log('');
  }

  if (changedTitles.length > 0) {
    console.log(`   ~ Title changed: ${changedTitles.length}`);
    const titleItems = changedTitles.map(c => {
      const oldShort = c.oldTitle.length > 25 ? c.oldTitle.slice(0, 25) + '...' : c.oldTitle;
      const newShort = c.newTitle.length > 25 ? c.newTitle.slice(0, 25) + '...' : c.newTitle;
      return `${c.route}: "${oldShort}" → "${newShort}"`;
    });
    printList(titleItems, '~');
    console.log('');
  }

  if (changedHashes.length > 0) {
    console.log(`   ~ Other changes (hash): ${changedHashes.length}`);
    printList(changedHashes, '~');
    console.log('');
  }
}

async function runVerification() {
  console.log('🔍 Verifying route manifest integrity...\n');

  // 1. Verify manifest file integrity
  const manifestResult = verifyFileIntegrity(MANIFEST_PATH, MANIFEST_HASH_PATH, 'Route Manifest');
  printResult(manifestResult);
  console.log('');

  // 2. Verify config file integrity
  const configResult = verifyFileIntegrity(CONFIG_PATH, CONFIG_HASH_PATH, 'Config Snapshot');
  printResult(configResult);
  console.log('');

  // 3. Verify snapshot freshness (stored vs routes.js)
  const freshnessResult = await verifySnapshotFreshness();
  printResult(freshnessResult);

  if (freshnessResult.diffSummary) {
    printDiffSummary(freshnessResult.diffSummary);
  }

  const allOk = manifestResult.ok && configResult.ok && freshnessResult.ok;

  if (allOk) {
    console.log('\n✅ All verifications passed. No drift detected.\n');
  }

  return { allOk, manifestResult, configResult, freshnessResult };
}

// ============================================================================
// FIX MODE
// ============================================================================

async function runFix() {
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

  const { allOk } = await runVerification();

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

async function main() {
  if (fixMode) {
    await runFix();
  } else {
    const { allOk } = await runVerification();

    if (!allOk) {
      console.error('❌ ROUTE MANIFEST DRIFT DETECTED');
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

main().catch(err => {
  console.error(`\n❌ Fatal error: ${err.message}`);
  process.exit(1);
});
