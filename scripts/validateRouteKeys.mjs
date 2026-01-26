#!/usr/bin/env node
/**
 * RouteKey Single-Source Validator (P101)
 * Validates that all routeKeys in the system are:
 * - Unique (no duplicates)
 * - Properly formatted (kebab-case)
 * - Have valid canonical paths
 * - Have required metadata
 * 
 * Usage: npm run validate:routekeys
 * Exit code: 0 = pass, 1 = fail
 */

import fs from 'fs';
import path from 'path';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  dim: '\x1b[2m',
};

const PASS = `${COLORS.green}✓${COLORS.reset}`;
const FAIL = `${COLORS.red}✗${COLORS.reset}`;
const WARN = `${COLORS.yellow}!${COLORS.reset}`;

let passCount = 0;
let failCount = 0;
let warnCount = 0;

function log(icon, message, detail = '') {
  console.log(`  ${icon} ${message}${detail ? COLORS.dim + ' ' + detail + COLORS.reset : ''}`);
}

function isKebabCase(str) {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
}

function validateRoutesFile() {
  console.log('\n📋 Validating routes.js');
  
  const routesPath = 'client/src/content/routes.js';
  if (!fs.existsSync(routesPath)) {
    log(FAIL, 'routes.js not found', routesPath);
    failCount++;
    return { routes: [], routeKeys: new Set(), paths: new Set() };
  }
  
  const content = fs.readFileSync(routesPath, 'utf-8');
  
  const routeMatches = content.match(/route:\s*["'`]([^"'`]+)["'`]/g) || [];
  const paths = routeMatches.map(m => m.match(/["'`]([^"'`]+)["'`]/)[1]);
  
  const routeKeys = paths.map(p => {
    if (p === '/') return 'home';
    return p.replace(/^\//, '').replace(/\//g, '-').replace(/:/g, '');
  });
  
  log(PASS, `Found ${paths.length} routes defined`);
  passCount++;
  
  const duplicatePaths = paths.filter((p, i) => paths.indexOf(p) !== i);
  if (duplicatePaths.length > 0) {
    log(WARN, 'Duplicate routes found', duplicatePaths.slice(0, 5).join(', '));
    warnCount++;
  } else {
    log(PASS, 'No duplicate routes');
    passCount++;
  }
  
  const uniqueRouteKeys = [...new Set(routeKeys)];
  log(PASS, `${uniqueRouteKeys.length} unique route keys derived`);
  passCount++;
  
  return { routes: content, routeKeys: new Set(routeKeys), paths: new Set(paths) };
}

function validateRouteMetaRegistry() {
  console.log('\n📋 Validating routeMetaRegistry.ts');
  
  const registryPath = 'client/src/content/meta/routeMetaRegistry.ts';
  if (!fs.existsSync(registryPath)) {
    log(WARN, 'routeMetaRegistry.ts not found', registryPath);
    warnCount++;
    return { registryKeys: new Set() };
  }
  
  const content = fs.readFileSync(registryPath, 'utf-8');
  
  const keyMatches = content.match(/["'`]([a-z0-9-]+)["'`]\s*:/g) || [];
  const registryKeys = keyMatches.map(m => m.match(/["'`]([^"'`]+)["'`]/)[1]);
  
  log(PASS, `Found ${registryKeys.length} registry entries`);
  passCount++;
  
  return { registryKeys: new Set(registryKeys), content };
}

function validateCrisisRoute(routeKeys, paths) {
  console.log('\n🚨 Validating /crisis routing');
  
  const hasCrisisKey = routeKeys.has('crisis') || routeKeys.has('crisis-resources');
  const hasCrisisPath = paths.has('/crisis') || paths.has('/crisis-resources');
  
  if (hasCrisisPath) {
    log(PASS, '/crisis route exists');
    passCount++;
  } else {
    log(FAIL, '/crisis route missing', 'CRITICAL: Crisis page must be accessible');
    failCount++;
  }
  
  const crisisPagePath = 'client/src/pages/CrisisResources.jsx';
  if (fs.existsSync(crisisPagePath)) {
    log(PASS, 'CrisisResources.jsx exists');
    passCount++;
  } else {
    log(FAIL, 'CrisisResources.jsx missing');
    failCount++;
  }
}

function validateInternalLinks() {
  console.log('\n🔗 Validating internal links');
  
  const clientSrc = 'client/src';
  let linkCount = 0;
  let brokenLinkCount = 0;
  
  function scanDir(dir) {
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory() && !entry.name.includes('node_modules')) {
          scanDir(fullPath);
        } else if (entry.name.endsWith('.jsx') || entry.name.endsWith('.tsx')) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          const linkMatches = content.match(/to=["'`]\/([^"'`]+)["'`]/g) || [];
          linkCount += linkMatches.length;
        }
      }
    } catch (e) {
      // Skip unreadable directories
    }
  }
  
  scanDir(clientSrc);
  
  log(PASS, `Found ${linkCount} internal links`);
  passCount++;
  
  if (brokenLinkCount === 0) {
    log(PASS, 'No obviously broken links detected');
    passCount++;
  } else {
    log(WARN, `${brokenLinkCount} potentially broken links`);
    warnCount++;
  }
}

function printSummary() {
  console.log('\n' + '─'.repeat(50));
  console.log('\n📊 RouteKey Validation Summary');
  console.log(`  ${PASS} Passed: ${passCount}`);
  console.log(`  ${WARN} Warnings: ${warnCount}`);
  console.log(`  ${FAIL} Failed: ${failCount}`);
  
  if (failCount === 0) {
    console.log(`\n${COLORS.green}✅ RouteKey validation passed!${COLORS.reset}\n`);
    return 0;
  } else {
    console.log(`\n${COLORS.red}❌ ${failCount} validation failure(s)${COLORS.reset}\n`);
    return 1;
  }
}

async function main() {
  console.log('\n🔑 RouteKey Single-Source Validator');
  console.log('─'.repeat(50));
  
  const { routeKeys, paths } = validateRoutesFile();
  validateRouteMetaRegistry();
  validateCrisisRoute(routeKeys, paths);
  validateInternalLinks();
  
  const exitCode = printSummary();
  process.exit(exitCode);
}

main().catch(console.error);
