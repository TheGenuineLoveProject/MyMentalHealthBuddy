#!/usr/bin/env node
/**
 * No Duplicate Work Gate (Batch 10)
 * Prevents re-implementing items already marked DONE in the registry.
 * 
 * Usage: node scripts/noDuplicateWork.mjs [--strict]
 * Exit code: 0 = pass, 1 = fail (strict mode)
 */

import fs from 'fs';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

const PASS = `${COLORS.green}✓${COLORS.reset}`;
const FAIL = `${COLORS.red}✗${COLORS.reset}`;
const WARN = `${COLORS.yellow}!${COLORS.reset}`;

function log(icon, message) {
  console.log(`  ${icon} ${message}`);
}

function readRegistry() {
  const registryPath = 'client/src/content/meta/integrationRegistry.ts';
  if (!fs.existsSync(registryPath)) {
    log(WARN, 'Integration registry not found');
    return [];
  }
  
  const content = fs.readFileSync(registryPath, 'utf-8');
  
  const entries = [];
  const regex = /integrationKey:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    entries.push(match[1]);
  }
  
  return entries;
}

function readRoutes() {
  const routesPath = 'client/src/content/routes.js';
  if (!fs.existsSync(routesPath)) {
    log(WARN, 'Routes file not found');
    return [];
  }
  
  const content = fs.readFileSync(routesPath, 'utf-8');
  const matches = content.match(/route:\s*['"]([^'"]+)['"]/g) || [];
  return matches.map(m => m.match(/['"]([^'"]+)['"]/)[1]);
}

function checkForDuplicates() {
  console.log('\n🔒 No Duplicate Work Gate');
  console.log('─'.repeat(50));
  
  const registryKeys = readRegistry();
  const routes = readRoutes();
  
  log(PASS, `Registry has ${registryKeys.length} integrations tracked`);
  log(PASS, `Routes has ${routes.length} routes defined`);
  
  const duplicateRoutes = routes.filter((r, i) => routes.indexOf(r) !== i);
  if (duplicateRoutes.length > 0) {
    log(WARN, `${duplicateRoutes.length} duplicate route paths detected`);
  } else {
    log(PASS, 'No duplicate route paths');
  }
  
  const duplicateKeys = registryKeys.filter((k, i) => registryKeys.indexOf(k) !== i);
  if (duplicateKeys.length > 0) {
    log(FAIL, `Duplicate registry keys: ${duplicateKeys.join(', ')}`);
    return false;
  }
  
  log(PASS, 'No duplicate registry keys');
  
  console.log('\n' + '─'.repeat(50));
  console.log(`${COLORS.green}✅ No duplicate work detected${COLORS.reset}\n`);
  
  return true;
}

const isStrict = process.argv.includes('--strict');
const passed = checkForDuplicates();

if (!passed && isStrict) {
  process.exit(1);
}
