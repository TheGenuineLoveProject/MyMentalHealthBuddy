#!/usr/bin/env node
/**
 * ============================================================================
 * VERIFY-ROUTES-MANIFEST.MJS - CI Drift Detection for Route Manifest
 * ============================================================================
 * 
 * Verifies that reports/routes.generated.json matches its stored sha256 hash.
 * 
 * Usage:
 *   node scripts/verify-routes-manifest.mjs
 * 
 * CI Integration:
 *   npm run gen:pages:all
 *   npm run verify:routes
 * 
 * If this script fails, it means the route manifest has drifted from the
 * committed version. Run `npm run gen:pages:all` and commit the updated
 * reports/* files.
 * 
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const MANIFEST_PATH = path.join(ROOT, 'reports', 'routes.generated.json');
const HASH_PATH = path.join(ROOT, 'reports', 'routes.generated.sha256');

console.log('🔍 Verifying route manifest integrity...\n');

// Check if files exist
if (!fs.existsSync(MANIFEST_PATH)) {
  console.error('❌ MANIFEST NOT FOUND');
  console.error(`   Missing: ${path.relative(ROOT, MANIFEST_PATH)}`);
  console.error('\n   Run: npm run gen:pages:all');
  console.error('   Then commit the generated reports/* files.\n');
  process.exit(1);
}

if (!fs.existsSync(HASH_PATH)) {
  console.error('❌ HASH FILE NOT FOUND');
  console.error(`   Missing: ${path.relative(ROOT, HASH_PATH)}`);
  console.error('\n   Run: npm run gen:pages:all');
  console.error('   Then commit the generated reports/* files.\n');
  process.exit(1);
}

// Read files
const manifestContent = fs.readFileSync(MANIFEST_PATH, 'utf8');
const storedHash = fs.readFileSync(HASH_PATH, 'utf8').trim();

// Compute hash
const computedHash = crypto.createHash('sha256').update(manifestContent).digest('hex');

// Compare
if (computedHash === storedHash) {
  console.log('✅ Route manifest integrity verified');
  console.log(`   Manifest: ${path.relative(ROOT, MANIFEST_PATH)}`);
  console.log(`   Hash: ${storedHash.slice(0, 16)}...`);
  console.log('\n   No drift detected. Manifest matches committed hash.\n');
  process.exit(0);
} else {
  console.error('❌ ROUTE MANIFEST DRIFT DETECTED');
  console.error('');
  console.error('   The route manifest has changed but the hash was not updated.');
  console.error('');
  console.error('   Expected hash: ' + storedHash.slice(0, 16) + '...');
  console.error('   Computed hash: ' + computedHash.slice(0, 16) + '...');
  console.error('');
  console.error('   ┌─────────────────────────────────────────────────────────────┐');
  console.error('   │  To fix this, run:                                          │');
  console.error('   │                                                             │');
  console.error('   │    npm run gen:pages:all                                    │');
  console.error('   │                                                             │');
  console.error('   │  Then commit the updated reports/* files:                   │');
  console.error('   │                                                             │');
  console.error('   │    git add reports/routes.generated.json                    │');
  console.error('   │    git add reports/routes.generated.sha256                  │');
  console.error('   │    git commit -m "Update route manifest"                    │');
  console.error('   └─────────────────────────────────────────────────────────────┘');
  console.error('');
  process.exit(1);
}
