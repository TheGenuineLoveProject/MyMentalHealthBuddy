#!/usr/bin/env node
/**
 * Project Audit Script
 * Finds duplicates, dead imports, broken routes, and code quality issues
 */

import { readdir, readFile, stat } from 'fs/promises';
import { join, extname, basename } from 'path';

const COLORS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  error: (msg) => console.log(`${COLORS.red}✗ ${msg}${COLORS.reset}`),
  success: (msg) => console.log(`${COLORS.green}✓ ${msg}${COLORS.reset}`),
  warn: (msg) => console.log(`${COLORS.yellow}⚠ ${msg}${COLORS.reset}`),
  info: (msg) => console.log(`${COLORS.blue}ℹ ${msg}${COLORS.reset}`)
};

async function getAllFiles(dir, extensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs']) {
  const files = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'dist') continue;
      if (entry.isDirectory()) {
        files.push(...await getAllFiles(fullPath, extensions));
      } else if (extensions.includes(extname(entry.name))) {
        files.push(fullPath);
      }
    }
  } catch {}
  return files;
}

async function findDuplicateComponents() {
  console.log('\n📦 Checking for duplicate components...');
  const clientFiles = await getAllFiles('client/src');
  const componentNames = new Map();
  
  for (const file of clientFiles) {
    const name = basename(file).replace(/\.(jsx?|tsx?)$/, '');
    if (!componentNames.has(name)) {
      componentNames.set(name, []);
    }
    componentNames.get(name).push(file);
  }
  
  let duplicates = 0;
  for (const [name, paths] of componentNames) {
    if (paths.length > 1) {
      log.warn(`Duplicate: "${name}" found in ${paths.length} locations`);
      paths.forEach(p => console.log(`   - ${p}`));
      duplicates++;
    }
  }
  
  if (duplicates === 0) log.success('No duplicate component names found');
  return duplicates;
}

async function findUnusedImports() {
  console.log('\n🔍 Checking for potential dead imports...');
  const files = await getAllFiles('client/src');
  let issues = 0;
  
  for (const file of files) {
    try {
      const content = await readFile(file, 'utf-8');
      const importMatches = content.matchAll(/import\s+(?:{[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/g);
      
      for (const match of importMatches) {
        const importPath = match[1];
        if (importPath.startsWith('.') && !importPath.includes('@')) {
          const importedNames = match[0].match(/import\s+(?:{([^}]+)}|(\w+))/);
          if (importedNames) {
            const names = (importedNames[1] || importedNames[2] || '').split(',').map(n => n.trim().split(' as ')[0].trim());
            for (const name of names) {
              if (name && name !== '*') {
                const usageCount = (content.match(new RegExp(`\\b${name}\\b`, 'g')) || []).length;
                if (usageCount === 1) {
                  log.warn(`Potentially unused: "${name}" in ${file}`);
                  issues++;
                }
              }
            }
          }
        }
      }
    } catch {}
  }
  
  if (issues === 0) log.success('No obvious unused imports detected');
  return issues;
}

async function checkRouteConsistency() {
  console.log('\n🛤️  Checking route consistency...');
  let issues = 0;
  
  try {
    const appContent = await readFile('client/src/App.jsx', 'utf-8');
    const routeMatches = [...appContent.matchAll(/path=["']([^"']+)["']/g)];
    const definedRoutes = routeMatches.map(m => m[1]);
    
    log.info(`Found ${definedRoutes.length} defined routes`);
    
    const duplicateRoutes = definedRoutes.filter((route, i) => definedRoutes.indexOf(route) !== i);
    if (duplicateRoutes.length > 0) {
      duplicateRoutes.forEach(r => log.error(`Duplicate route: ${r}`));
      issues += duplicateRoutes.length;
    }
    
    const serverFiles = await getAllFiles('server');
    const apiRoutes = new Set();
    for (const file of serverFiles) {
      try {
        const content = await readFile(file, 'utf-8');
        const apiMatches = [...content.matchAll(/\.(get|post|put|patch|delete)\s*\(\s*["']([^"']+)["']/gi)];
        apiMatches.forEach(m => apiRoutes.add(m[2]));
      } catch {}
    }
    
    log.info(`Found ${apiRoutes.size} API endpoints`);
  } catch (err) {
    log.error(`Could not read App.jsx: ${err.message}`);
    issues++;
  }
  
  if (issues === 0) log.success('Route configuration looks consistent');
  return issues;
}

async function checkFileSizes() {
  console.log('\n📏 Checking for large files...');
  const files = await getAllFiles('client/src');
  let largeFiles = 0;
  
  for (const file of files) {
    try {
      const content = await readFile(file, 'utf-8');
      const lines = content.split('\n').length;
      if (lines > 500) {
        log.warn(`Large file: ${file} (${lines} lines)`);
        largeFiles++;
      }
    } catch {}
  }
  
  if (largeFiles === 0) log.success('No excessively large files found');
  return largeFiles;
}

async function main() {
  console.log('🔬 The Genuine Love Project - Code Audit');
  console.log('=========================================');
  
  const duplicates = await findDuplicateComponents();
  const deadImports = await findUnusedImports();
  const routeIssues = await checkRouteConsistency();
  const largeFiles = await checkFileSizes();
  
  const total = duplicates + deadImports + routeIssues + largeFiles;
  
  console.log('\n📊 Audit Summary');
  console.log('================');
  console.log(`Duplicate components: ${duplicates}`);
  console.log(`Potential dead imports: ${deadImports}`);
  console.log(`Route issues: ${routeIssues}`);
  console.log(`Large files: ${largeFiles}`);
  console.log(`Total issues: ${total}`);
  
  process.exit(total > 10 ? 1 : 0);
}

main().catch(console.error);
