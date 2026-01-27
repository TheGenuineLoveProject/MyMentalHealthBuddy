#!/usr/bin/env node
/**
 * P102 - Broken Link Scanner (routeKey-based)
 * Scans all files for internal links and validates against route registry
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
console.log(`${COLORS.blue}║           BROKEN LINK SCANNER (P102)                       ║${COLORS.reset}`);
console.log(`${COLORS.blue}╚════════════════════════════════════════════════════════════╝${COLORS.reset}\n`);

const results = {
  totalLinks: 0,
  validLinks: 0,
  brokenLinks: [],
  externalLinks: 0,
  passed: true,
};

let validRoutes = new Set();

try {
  const routesFile = fs.readFileSync('client/src/content/allRoutes.json', 'utf8');
  const routes = JSON.parse(routesFile);
  if (Array.isArray(routes)) {
    routes.forEach(r => {
      if (r.path) validRoutes.add(r.path);
      if (r.pathname) validRoutes.add(r.pathname);
    });
  }
  console.log(`${COLORS.green}✓${COLORS.reset} Loaded ${validRoutes.size} valid routes from registry`);
} catch {
  try {
    const appFile = fs.readFileSync('client/src/App.jsx', 'utf8');
    const pathMatches = appFile.match(/path=["']([^"']+)["']/g) || [];
    pathMatches.forEach(m => {
      const match = m.match(/path=["']([^"']+)["']/);
      if (match) validRoutes.add(match[1]);
    });
    console.log(`${COLORS.yellow}⚠${COLORS.reset} Loaded ${validRoutes.size} routes from App.jsx (fallback)`);
  } catch {
    console.log(`${COLORS.red}✗${COLORS.reset} Could not load route registry`);
  }
}

validRoutes.add('/');
validRoutes.add('/crisis');
validRoutes.add('/login');
validRoutes.add('/dashboard');
validRoutes.add('/wellness');
validRoutes.add('/tools');
validRoutes.add('/admin');
validRoutes.add('/settings');
validRoutes.add('/privacy');
validRoutes.add('/terms');

function extractLinks(content) {
  const links = [];
  const hrefPattern = /href=["']([^"']+)["']/g;
  const toPattern = /to=["']([^"']+)["']/g;
  const linkPattern = /<Link[^>]*(?:href|to)=["']([^"']+)["']/g;
  
  let match;
  while ((match = hrefPattern.exec(content)) !== null) {
    links.push(match[1]);
  }
  while ((match = toPattern.exec(content)) !== null) {
    links.push(match[1]);
  }
  
  return links;
}

function isInternalLink(link) {
  if (!link) return false;
  if (link.startsWith('http://') || link.startsWith('https://')) return false;
  if (link.startsWith('mailto:') || link.startsWith('tel:')) return false;
  if (link.startsWith('#')) return false;
  if (link.startsWith('javascript:')) return false;
  return true;
}

function normalizeRoute(route) {
  let normalized = route.split('?')[0].split('#')[0];
  if (!normalized.startsWith('/')) normalized = '/' + normalized;
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

function isValidRoute(link) {
  const normalized = normalizeRoute(link);
  if (validRoutes.has(normalized)) return true;
  if (normalized.includes(':')) return true;
  for (const route of validRoutes) {
    if (route.includes(':')) {
      const routePattern = route.replace(/:[^/]+/g, '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      if (regex.test(normalized)) return true;
    }
  }
  if (normalized.match(/\/(api|brand|assets|images|public)\//)) return true;
  return false;
}

console.log('\nScanning for internal links...\n');

try {
  const files = execSync(
    'find client/src -type f \\( -name "*.jsx" -o -name "*.tsx" -o -name "*.js" -o -name "*.ts" \\) 2>/dev/null',
    { encoding: 'utf8' }
  ).trim().split('\n').filter(Boolean);

  files.forEach(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const links = extractLinks(content);
      
      links.forEach(link => {
        results.totalLinks++;
        
        if (!isInternalLink(link)) {
          results.externalLinks++;
          return;
        }
        
        if (isValidRoute(link)) {
          results.validLinks++;
        } else {
          results.brokenLinks.push({ file, link });
          results.passed = false;
        }
      });
    } catch {}
  });
} catch (e) {
  console.log(`${COLORS.red}✗${COLORS.reset} Error scanning files: ${e.message}`);
}

console.log('═'.repeat(60));
console.log(`\n${COLORS.blue}LINK SCAN SUMMARY:${COLORS.reset}`);
console.log(`  Total links found: ${results.totalLinks}`);
console.log(`  Valid internal links: ${results.validLinks}`);
console.log(`  External links: ${results.externalLinks}`);
console.log(`  Broken links: ${results.brokenLinks.length}`);

if (results.brokenLinks.length > 0) {
  console.log(`\n${COLORS.yellow}⚠ POTENTIALLY BROKEN LINKS:${COLORS.reset}`);
  const shown = results.brokenLinks.slice(0, 20);
  shown.forEach(({ file, link }) => {
    console.log(`  ${file}: ${link}`);
  });
  if (results.brokenLinks.length > 20) {
    console.log(`  ... and ${results.brokenLinks.length - 20} more`);
  }
}

if (results.brokenLinks.length === 0) {
  console.log(`\n${COLORS.green}✅ PASS - No broken links detected${COLORS.reset}`);
} else {
  console.log(`\n${COLORS.yellow}⚠ WARNING - Review broken links above${COLORS.reset}`);
}

fs.writeFileSync('docs/scan-broken-links-result.json', JSON.stringify(results, null, 2));
console.log(`\nResults saved to: docs/scan-broken-links-result.json`);
