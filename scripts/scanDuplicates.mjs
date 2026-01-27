#!/usr/bin/env node
/**
 * Duplicate & Drift Detection Scanner
 * Detects duplicate files, components, routes, and configurations
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

console.log(`${COLORS.blue}╔════════════════════════════════════════════════════════════╗${COLORS.reset}`);
console.log(`${COLORS.blue}║        DUPLICATE & DRIFT DETECTION SCANNER                 ║${COLORS.reset}`);
console.log(`${COLORS.blue}╚════════════════════════════════════════════════════════════╝${COLORS.reset}\n`);

const results = {
  duplicateFiles: [],
  duplicateComponents: [],
  shadowConfigs: [],
  portConflicts: [],
  passed: true,
};

function findDuplicatesByName(dir, extensions) {
  try {
    const files = execSync(
      `find ${dir} -type f \\( ${extensions.map(e => `-name "*.${e}"`).join(' -o ')} \\) 2>/dev/null`,
      { encoding: 'utf8' }
    ).trim().split('\n').filter(Boolean);

    const byName = {};
    files.forEach(f => {
      const name = path.basename(f);
      if (!byName[name]) byName[name] = [];
      byName[name].push(f);
    });

    return Object.entries(byName)
      .filter(([_, paths]) => paths.length > 1)
      .map(([name, paths]) => ({ name, paths, canonical: paths[0] }));
  } catch {
    return [];
  }
}

function findShadowConfigs() {
  const configPatterns = [
    'tsconfig*.json',
    'vite.config.*',
    '.eslintrc*',
    'tailwind.config.*',
  ];

  const shadows = [];
  configPatterns.forEach(pattern => {
    try {
      const files = execSync(`find . -name "${pattern}" -not -path "./node_modules/*" 2>/dev/null`, { encoding: 'utf8' })
        .trim().split('\n').filter(Boolean);
      if (files.length > 1) {
        shadows.push({ pattern, files });
      }
    } catch {}
  });
  return shadows;
}

function checkPortConflicts() {
  try {
    const serverFiles = execSync('grep -r "listen.*[0-9]\\{4\\}" server/ --include="*.mjs" --include="*.js" 2>/dev/null', { encoding: 'utf8' });
    const ports = serverFiles.match(/\d{4}/g) || [];
    const uniquePorts = [...new Set(ports)];
    if (uniquePorts.length > 1) {
      return { conflict: true, ports: uniquePorts };
    }
    return { conflict: false, ports: uniquePorts };
  } catch {
    return { conflict: false, ports: [] };
  }
}

console.log('Scanning for duplicate component files...');
results.duplicateComponents = findDuplicatesByName('client/src/components', ['jsx', 'tsx']);

console.log('Scanning for duplicate page files...');
const dupPages = findDuplicatesByName('client/src/pages', ['jsx', 'tsx']);
results.duplicateFiles = [...results.duplicateComponents, ...dupPages];

console.log('Checking for shadow configurations...');
results.shadowConfigs = findShadowConfigs();

console.log('Checking for port conflicts...');
const portCheck = checkPortConflicts();
if (portCheck.conflict) {
  results.portConflicts = portCheck.ports;
  results.passed = false;
}

console.log('\n' + '═'.repeat(60) + '\n');

if (results.duplicateComponents.length > 0) {
  console.log(`${COLORS.yellow}⚠ DUPLICATE COMPONENTS FOUND (${results.duplicateComponents.length}):${COLORS.reset}`);
  results.duplicateComponents.forEach(dup => {
    console.log(`  ${dup.name}:`);
    dup.paths.forEach((p, i) => {
      console.log(`    ${i === 0 ? '✓ (canonical)' : '○ (duplicate)'} ${p}`);
    });
  });
  console.log('');
}

if (results.shadowConfigs.length > 0) {
  console.log(`${COLORS.yellow}⚠ SHADOW CONFIGURATIONS FOUND:${COLORS.reset}`);
  results.shadowConfigs.forEach(cfg => {
    console.log(`  ${cfg.pattern}: ${cfg.files.join(', ')}`);
  });
  console.log('');
}

if (results.portConflicts.length > 0) {
  console.log(`${COLORS.red}❌ PORT CONFLICTS DETECTED:${COLORS.reset}`);
  console.log(`  Multiple ports configured: ${results.portConflicts.join(', ')}`);
  console.log('');
}

const summary = {
  duplicateComponents: results.duplicateComponents.length,
  duplicatePages: dupPages.length,
  shadowConfigs: results.shadowConfigs.length,
  portConflicts: results.portConflicts.length,
};

console.log('═'.repeat(60));
console.log(`\n${COLORS.blue}SUMMARY:${COLORS.reset}`);
console.log(`  Duplicate components: ${summary.duplicateComponents}`);
console.log(`  Duplicate pages: ${summary.duplicatePages}`);
console.log(`  Shadow configs: ${summary.shadowConfigs}`);
console.log(`  Port conflicts: ${summary.portConflicts}`);

if (results.passed && results.duplicateComponents.length === 0) {
  console.log(`\n${COLORS.green}✅ PASS - No critical duplicates or conflicts found${COLORS.reset}`);
} else if (results.portConflicts.length > 0) {
  console.log(`\n${COLORS.red}❌ FAIL - Port conflicts must be resolved${COLORS.reset}`);
  process.exit(1);
} else {
  console.log(`\n${COLORS.yellow}⚠ WARNING - Duplicates found but not blocking${COLORS.reset}`);
}

fs.writeFileSync('docs/scan-duplicates-result.json', JSON.stringify(results, null, 2));
console.log(`\nResults saved to: docs/scan-duplicates-result.json`);
