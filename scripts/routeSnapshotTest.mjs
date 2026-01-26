#!/usr/bin/env node
/**
 * Route Registry Snapshot Test (P161)
 * Verifies route registry integrity and creates snapshots
 * 
 * Usage: npm run test:routes
 */

import fs from 'fs';
import crypto from 'crypto';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
};

const PASS = `${COLORS.green}✓${COLORS.reset}`;
const FAIL = `${COLORS.red}✗${COLORS.reset}`;
const WARN = `${COLORS.yellow}!${COLORS.reset}`;

const SNAPSHOT_PATH = 'docs/ci/route-snapshot.json';

function extractRoutes() {
  const routesPath = 'client/src/content/routes.js';
  if (!fs.existsSync(routesPath)) {
    console.log(`${FAIL} routes.js not found`);
    return null;
  }
  
  const content = fs.readFileSync(routesPath, 'utf-8');
  const matches = content.match(/route:\s*['"]([^'"]+)['"]/g) || [];
  const routes = matches.map(m => m.match(/['"]([^'"]+)['"]/)[1]).sort();
  
  return {
    routes,
    count: routes.length,
    hash: crypto.createHash('md5').update(routes.join(',')).digest('hex').slice(0, 8),
    timestamp: new Date().toISOString(),
  };
}

function loadSnapshot() {
  if (!fs.existsSync(SNAPSHOT_PATH)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(SNAPSHOT_PATH, 'utf-8'));
  } catch {
    return null;
  }
}

function saveSnapshot(snapshot) {
  fs.mkdirSync('docs/ci', { recursive: true });
  fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(snapshot, null, 2));
}

async function main() {
  console.log('\n📸 Route Registry Snapshot Test');
  console.log('─'.repeat(50));
  
  const current = extractRoutes();
  if (!current) {
    process.exit(1);
  }
  
  console.log(`  ${PASS} Extracted ${current.count} routes`);
  console.log(`  ${PASS} Current hash: ${current.hash}`);
  
  const previous = loadSnapshot();
  
  if (!previous) {
    console.log(`  ${WARN} No previous snapshot found, creating new one`);
    saveSnapshot(current);
    console.log(`  ${PASS} Snapshot saved to ${SNAPSHOT_PATH}`);
  } else {
    console.log(`  Previous hash: ${previous.hash} (${previous.count} routes)`);
    
    if (previous.hash === current.hash) {
      console.log(`  ${PASS} Route registry unchanged`);
    } else {
      const added = current.routes.filter(r => !previous.routes.includes(r));
      const removed = previous.routes.filter(r => !current.routes.includes(r));
      
      console.log(`  ${WARN} Route registry changed:`);
      if (added.length > 0) {
        console.log(`    + Added: ${added.slice(0, 5).join(', ')}${added.length > 5 ? ` (+${added.length - 5} more)` : ''}`);
      }
      if (removed.length > 0) {
        console.log(`    - Removed: ${removed.slice(0, 5).join(', ')}${removed.length > 5 ? ` (+${removed.length - 5} more)` : ''}`);
      }
      
      saveSnapshot(current);
      console.log(`  ${PASS} Snapshot updated`);
    }
  }
  
  const duplicates = current.routes.filter((r, i) => current.routes.indexOf(r) !== i);
  if (duplicates.length > 0) {
    console.log(`  ${FAIL} Duplicate routes detected: ${duplicates.join(', ')}`);
    process.exit(1);
  }
  
  const hasCrisis = current.routes.includes('/crisis') || current.routes.includes('/crisis-resources');
  if (!hasCrisis) {
    console.log(`  ${FAIL} CRITICAL: /crisis route missing!`);
    process.exit(1);
  }
  console.log(`  ${PASS} /crisis route verified`);
  
  console.log('\n' + '─'.repeat(50));
  console.log(`${COLORS.green}✅ Route snapshot test passed!${COLORS.reset}\n`);
}

main().catch(console.error);
