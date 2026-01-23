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
 * On drift, writes reports/routes.diff.json for machine-readable PR comments.
 * On clean, deletes reports/routes.diff.json if it exists.
 * 
 * Usage:
 *   node scripts/verify-routes-manifest.mjs           (verify only)
 *   node scripts/verify-routes-manifest.mjs --fix     (auto-repair locally)
 * 
 * CI Integration:
 *   npm run gen:pages:all
 *   npm run verify:routes
 * 
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { routeToGeneratedFile } from '../client/src/content/routeFileMap.js';
import { buildSnapshotWithHash } from './routes-snapshot.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// File paths
const MANIFEST_PATH = path.join(ROOT, 'reports', 'routes.generated.json');
const MANIFEST_HASH_PATH = path.join(ROOT, 'reports', 'routes.generated.sha256');
const CONFIG_PATH = path.join(ROOT, 'reports', 'routes.config.snapshot.json');
const CONFIG_HASH_PATH = path.join(ROOT, 'reports', 'routes.config.sha256');
const DIFF_PATH = path.join(ROOT, 'reports', 'routes.diff.json');
const DIFF_MD_PATH = path.join(ROOT, 'reports', 'routes.diff.md');
const PER_ROUTE_HASHES_PATH = path.join(ROOT, 'reports', 'routes.perRouteHashes.json');
const GENERATED_PAGES_DIR = path.join(ROOT, 'client', 'src', 'pages', 'generated');

// Parse arguments
const args = process.argv.slice(2);
const fixMode = args.includes('--fix');
const formatArg = args.find(arg => arg.startsWith('--format='));
const outputFormat = formatArg ? formatArg.split('=')[1] : 'console';
const isCI = process.env.CI === 'true' || process.env.CI === '1' || !!process.env.CI;

// Validate format
if (!['console', 'markdown', 'annotations', 'json'].includes(outputFormat)) {
  console.error(`❌ Invalid format: ${outputFormat}`);
  console.error('   Valid formats: console, markdown, annotations, json');
  process.exit(1);
}

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
    diffSummary: null,
    diffData: null
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

  // Compute diff (returns both summary for console and data for JSON)
  const { summary, data } = computeDiff(storedSnapshot, freshSnapshot);
  result.diffSummary = summary;
  result.diffData = data;

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

  // Arrays for console summary (simple)
  const addedRoutesSummary = [];
  const removedRoutesSummary = [];
  const changedTitlesSummary = [];
  const changedCategoriesSummary = [];
  const changedHashesSummary = [];

  // Arrays for JSON data (rich)
  const addedRoutesData = [];
  const removedRoutesData = [];
  const titleChangedData = [];
  const categoryChangedData = [];
  const hashChangedData = [];

  // Added (in fresh but not stored)
  for (const [route, freshEntry] of freshRoutes) {
    if (!storedRoutes.has(route)) {
      addedRoutesSummary.push(route);
      addedRoutesData.push({
        route,
        category: freshEntry.category || null
      });
    }
  }

  // Removed (in stored but not fresh)
  for (const [route, storedEntry] of storedRoutes) {
    if (!freshRoutes.has(route)) {
      removedRoutesSummary.push(route);
      removedRoutesData.push({
        route,
        category: storedEntry.category || null
      });
    }
  }

  // Changed (same route, different content)
  for (const [route, freshEntry] of freshRoutes) {
    const storedEntry = storedRoutes.get(route);
    if (!storedEntry) continue;

    // Track title changes
    if (storedEntry.title !== freshEntry.title) {
      changedTitlesSummary.push({
        route,
        oldTitle: storedEntry.title || '(null)',
        newTitle: freshEntry.title || '(null)'
      });
      titleChangedData.push({
        route,
        fromTitle: storedEntry.title || null,
        toTitle: freshEntry.title || null,
        category: freshEntry.category || null
      });
    }

    // Track category changes (separate from title)
    if (storedEntry.category !== freshEntry.category) {
      changedCategoriesSummary.push({
        route,
        fromCategory: storedEntry.category || '(null)',
        toCategory: freshEntry.category || '(null)'
      });
      categoryChangedData.push({
        route,
        fromCategory: storedEntry.category || null,
        toCategory: freshEntry.category || null,
        title: freshEntry.title || null
      });
    }

    // Track other hash changes (not title or category)
    if (storedEntry.routeHash !== freshEntry.routeHash &&
        storedEntry.title === freshEntry.title &&
        storedEntry.category === freshEntry.category) {
      changedHashesSummary.push(route);
      hashChangedData.push({
        route,
        category: freshEntry.category || null,
        title: freshEntry.title || null,
        fromRouteHash: storedEntry.routeHash,
        toRouteHash: freshEntry.routeHash
      });
    }
  }

  // Sort all arrays by route for deterministic output
  const sortByRoute = (a, b) => (a.route || a).localeCompare(b.route || b);
  addedRoutesData.sort(sortByRoute);
  removedRoutesData.sort(sortByRoute);
  titleChangedData.sort(sortByRoute);
  categoryChangedData.sort(sortByRoute);
  hashChangedData.sort(sortByRoute);
  addedRoutesSummary.sort();
  removedRoutesSummary.sort();

  return {
    summary: {
      addedRoutes: addedRoutesSummary,
      removedRoutes: removedRoutesSummary,
      changedTitles: changedTitlesSummary,
      changedCategories: changedCategoriesSummary,
      changedHashes: changedHashesSummary
    },
    data: {
      added: addedRoutesData,
      removed: removedRoutesData,
      titleChanged: titleChangedData,
      categoryChanged: categoryChangedData,
      hashChanged: hashChangedData
    }
  };
}

// ============================================================================
// DIFF JSON FILE MANAGEMENT
// ============================================================================

function writeDiffJson(diffData) {
  const diffJson = {
    generatedAt: new Date().toISOString(),
    status: 'drift',
    mode: 'verify',
    recommendedCommand: 'npm run gen:pages:all && npm run verify:routes',
    summary: {
      added: diffData.added.length,
      removed: diffData.removed.length,
      titleChanged: diffData.titleChanged.length,
      categoryChanged: diffData.categoryChanged.length,
      hashChanged: diffData.hashChanged.length
    },
    added: diffData.added,
    removed: diffData.removed,
    titleChanged: diffData.titleChanged,
    categoryChanged: diffData.categoryChanged,
    hashChanged: diffData.hashChanged,
    limits: { printedMax: 10 }
  };

  fs.writeFileSync(DIFF_PATH, JSON.stringify(diffJson, null, 2) + '\n');
  console.log(`\n📝 Wrote ${path.relative(ROOT, DIFF_PATH)}`);
}

function deleteDiffJson() {
  if (fs.existsSync(DIFF_PATH)) {
    fs.unlinkSync(DIFF_PATH);
  }
  if (fs.existsSync(DIFF_MD_PATH)) {
    fs.unlinkSync(DIFF_MD_PATH);
  }
}

// ============================================================================
// DEEP LINK HELPERS
// ============================================================================

function routeToFilePath(route) {
  const fileName = routeToGeneratedFile(route);
  const filePath = path.join(GENERATED_PAGES_DIR, fileName);
  if (fs.existsSync(filePath)) {
    return path.relative(ROOT, filePath);
  }
  return null;
}

function getDeepLink(route) {
  const filePath = routeToFilePath(route);
  if (filePath) {
    return { type: 'file', path: filePath };
  }
  return { type: 'route', path: route };
}

// ============================================================================
// FORMATTER: MARKDOWN
// ============================================================================

function formatMarkdown(diffData, results) {
  const lines = [];
  lines.push('# Route Drift Report');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  
  if (!results.allOk) {
    lines.push('## Summary');
    lines.push('');
    lines.push('| Change Type | Count |');
    lines.push('|-------------|-------|');
    lines.push(`| Added | ${diffData.added.length} |`);
    lines.push(`| Removed | ${diffData.removed.length} |`);
    lines.push(`| Title Changed | ${diffData.titleChanged.length} |`);
    lines.push(`| Category Changed | ${diffData.categoryChanged.length} |`);
    lines.push(`| Hash Changed | ${diffData.hashChanged.length} |`);
    lines.push('');
    
    if (diffData.added.length > 0) {
      lines.push('## Added Routes');
      lines.push('');
      for (const item of diffData.added.slice(0, 10)) {
        const link = getDeepLink(item.route);
        if (link.type === 'file') {
          lines.push(`- [\`${item.route}\`](${link.path}) (${item.category || 'uncategorized'})`);
        } else {
          lines.push(`- \`${item.route}\` (${item.category || 'uncategorized'})`);
        }
      }
      if (diffData.added.length > 10) {
        lines.push(`- ... and ${diffData.added.length - 10} more`);
      }
      lines.push('');
    }
    
    if (diffData.removed.length > 0) {
      lines.push('## Removed Routes');
      lines.push('');
      for (const item of diffData.removed.slice(0, 10)) {
        lines.push(`- \`${item.route}\` (was: ${item.category || 'uncategorized'})`);
      }
      if (diffData.removed.length > 10) {
        lines.push(`- ... and ${diffData.removed.length - 10} more`);
      }
      lines.push('');
    }
    
    if (diffData.titleChanged.length > 0) {
      lines.push('## Title Changes');
      lines.push('');
      for (const item of diffData.titleChanged.slice(0, 10)) {
        const link = getDeepLink(item.route);
        if (link.type === 'file') {
          lines.push(`- [\`${item.route}\`](${link.path}): "${item.fromTitle}" → "${item.toTitle}"`);
        } else {
          lines.push(`- \`${item.route}\`: "${item.fromTitle}" → "${item.toTitle}"`);
        }
      }
      if (diffData.titleChanged.length > 10) {
        lines.push(`- ... and ${diffData.titleChanged.length - 10} more`);
      }
      lines.push('');
    }
    
    if (diffData.categoryChanged.length > 0) {
      lines.push('## Category Changes');
      lines.push('');
      for (const item of diffData.categoryChanged.slice(0, 10)) {
        const link = getDeepLink(item.route);
        if (link.type === 'file') {
          lines.push(`- [\`${item.route}\`](${link.path}): "${item.fromCategory}" → "${item.toCategory}"`);
        } else {
          lines.push(`- \`${item.route}\`: "${item.fromCategory}" → "${item.toCategory}"`);
        }
      }
      if (diffData.categoryChanged.length > 10) {
        lines.push(`- ... and ${diffData.categoryChanged.length - 10} more`);
      }
      lines.push('');
    }
    
    if (diffData.hashChanged.length > 0) {
      lines.push('## Other Content Changes');
      lines.push('');
      for (const item of diffData.hashChanged.slice(0, 10)) {
        const link = getDeepLink(item.route);
        if (link.type === 'file') {
          lines.push(`- [\`${item.route}\`](${link.path}) (${item.category || 'uncategorized'})`);
        } else {
          lines.push(`- \`${item.route}\` (${item.category || 'uncategorized'})`);
        }
      }
      if (diffData.hashChanged.length > 10) {
        lines.push(`- ... and ${diffData.hashChanged.length - 10} more`);
      }
      lines.push('');
    }
    
    lines.push('## Resolution');
    lines.push('');
    lines.push('```bash');
    lines.push('npm run gen:pages:all && npm run verify:routes');
    lines.push('```');
  } else {
    lines.push('No drift detected.');
  }
  
  return lines.join('\n');
}

// ============================================================================
// FORMATTER: GITHUB ANNOTATIONS
// ============================================================================

function formatAnnotations(diffData, results) {
  const lines = [];
  
  if (!results.allOk) {
    const total = diffData.added.length + diffData.removed.length + 
                  diffData.titleChanged.length + diffData.categoryChanged.length + 
                  diffData.hashChanged.length;
    
    lines.push(`::error file=reports/routes.config.snapshot.json,title=Route Drift Detected::Found ${total} route changes. Run: npm run gen:pages:all && npm run verify:routes`);
    
    for (const item of diffData.added.slice(0, 5)) {
      const filePath = routeToFilePath(item.route);
      if (filePath) {
        lines.push(`::warning file=${filePath},title=New Route::Route ${item.route} added`);
      }
    }
    
    for (const item of diffData.removed.slice(0, 5)) {
      lines.push(`::error file=reports/routes.config.snapshot.json,title=Route Removed::Route ${item.route} was removed`);
    }
    
    for (const item of diffData.titleChanged.slice(0, 5)) {
      const filePath = routeToFilePath(item.route);
      if (filePath) {
        lines.push(`::warning file=${filePath},title=Title Changed::${item.route}: "${item.fromTitle}" → "${item.toTitle}"`);
      }
    }
  }
  
  return lines.join('\n');
}

// ============================================================================
// FORMATTER: JSON (COMPACT)
// ============================================================================

function formatJson(diffData, results) {
  return JSON.stringify({
    ok: results.allOk,
    timestamp: new Date().toISOString(),
    summary: {
      added: diffData.added.length,
      removed: diffData.removed.length,
      titleChanged: diffData.titleChanged.length,
      categoryChanged: diffData.categoryChanged.length,
      hashChanged: diffData.hashChanged.length,
      total: diffData.added.length + diffData.removed.length + 
             diffData.titleChanged.length + diffData.categoryChanged.length + 
             diffData.hashChanged.length
    },
    topChanges: [
      ...diffData.added.slice(0, 3).map(i => ({ type: 'added', route: i.route, file: routeToFilePath(i.route) })),
      ...diffData.removed.slice(0, 3).map(i => ({ type: 'removed', route: i.route })),
      ...diffData.titleChanged.slice(0, 3).map(i => ({ type: 'titleChanged', route: i.route, file: routeToFilePath(i.route) }))
    ],
    recommendation: results.allOk ? null : 'npm run gen:pages:all && npm run verify:routes'
  });
}

// ============================================================================
// CONSOLE OUTPUT
// ============================================================================

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

  const { addedRoutes, removedRoutes, changedTitles, changedCategories, changedHashes } = diff;

  const hasChanges = addedRoutes.length > 0 || removedRoutes.length > 0 ||
                     changedTitles.length > 0 || changedCategories.length > 0 ||
                     changedHashes.length > 0;

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

  if (changedCategories.length > 0) {
    console.log(`   ~ Category changed: ${changedCategories.length}`);
    const categoryItems = changedCategories.map(c => 
      `${c.route}: "${c.fromCategory}" → "${c.toCategory}"`
    );
    printList(categoryItems, '~');
    console.log('');
  }

  if (changedHashes.length > 0) {
    console.log(`   ~ Other changes (hash): ${changedHashes.length}`);
    printList(changedHashes, '~');
    console.log('');
  }
}

// ============================================================================
// VERIFICATION RUNNER
// ============================================================================

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

  // Build empty diffData if no changes
  const diffData = freshnessResult.diffData || {
    added: [],
    removed: [],
    titleChanged: [],
    categoryChanged: [],
    hashChanged: []
  };

  // Manage diff JSON file
  if (allOk) {
    deleteDiffJson();
    if (outputFormat === 'console') {
      console.log('\n✅ All verifications passed. No drift detected.\n');
    }
  } else if (freshnessResult.diffData) {
    writeDiffJson(freshnessResult.diffData);
    
    if (outputFormat === 'markdown') {
      const markdown = formatMarkdown(freshnessResult.diffData, { allOk });
      fs.writeFileSync(DIFF_MD_PATH, markdown + '\n');
      console.log(`📝 Wrote ${path.relative(ROOT, DIFF_MD_PATH)}`);
    }
  }

  return { allOk, manifestResult, configResult, freshnessResult, diffData };
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
    const { allOk, diffData } = await runVerification();

    // Output in requested format
    if (outputFormat === 'json') {
      console.log(formatJson(diffData, { allOk }));
    } else if (outputFormat === 'annotations') {
      if (!allOk) {
        console.log(formatAnnotations(diffData, { allOk }));
      }
    } else if (outputFormat === 'markdown') {
      if (allOk) {
        console.log('No drift detected.');
      }
    }

    if (!allOk && outputFormat === 'console') {
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

    process.exit(allOk ? 0 : 1);
  }
}

main().catch(err => {
  console.error(`\n❌ Fatal error: ${err.message}`);
  process.exit(1);
});
