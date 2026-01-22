#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CLIENT_SRC = path.join(ROOT, 'client', 'src');

const INTERNAL_LINK_PATTERN = /(?:href|to)=["'`](\/?[a-zA-Z0-9\-_/]+)["'`]/g;
const ROUTE_PATTERN = /(?:path|route)=["'`](\/?[a-zA-Z0-9\-_/:]+)["'`]/gi;

const knownRoutes = new Set();
const foundLinks = new Map();
const brokenLinks = [];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(ROOT, filePath);
  
  let match;
  while ((match = ROUTE_PATTERN.exec(content)) !== null) {
    const route = match[1].replace(/:\w+/g, ':param');
    knownRoutes.add(route);
  }
  
  INTERNAL_LINK_PATTERN.lastIndex = 0;
  while ((match = INTERNAL_LINK_PATTERN.exec(content)) !== null) {
    const link = match[1];
    if (link.startsWith('http') || link.startsWith('#') || link.startsWith('mailto:') || link.startsWith('tel:')) {
      continue;
    }
    if (!foundLinks.has(link)) {
      foundLinks.set(link, []);
    }
    foundLinks.get(link).push(relativePath);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', 'dist', 'build'].includes(entry.name)) {
        walkDir(fullPath);
      }
    } else if (entry.isFile()) {
      if (/\.(jsx?|tsx?|vue|svelte)$/.test(entry.name)) {
        scanFile(fullPath);
      }
    }
  }
}

function normalizeRoute(route) {
  return route.replace(/:\w+/g, ':param').replace(/\/$/, '') || '/';
}

function checkLinks() {
  console.log('== Link Scan: TheGenuineLoveProject ==\n');
  
  walkDir(CLIENT_SRC);
  walkDir(path.join(ROOT, 'server'));
  
  console.log(`Routes detected: ${knownRoutes.size}`);
  console.log(`Links found: ${foundLinks.size}\n`);
  
  const staticRoutes = [
    '/', '/login', '/register', '/dashboard', '/chat', '/journal',
    '/mood', '/profile', '/settings', '/crisis', '/faq', '/about',
    '/terms', '/privacy', '/disclaimer', '/ethics', '/legal', '/safety',
    '/resources', '/glossary', '/onboarding', '/pricing', '/subscribe'
  ];
  
  staticRoutes.forEach(r => knownRoutes.add(r));
  
  for (const [link, files] of foundLinks) {
    const normalizedLink = normalizeRoute(link);
    
    const isKnown = [...knownRoutes].some(route => {
      const normalizedRoute = normalizeRoute(route);
      return normalizedLink === normalizedRoute || 
             normalizedLink.startsWith(normalizedRoute + '/') ||
             normalizedRoute.includes(':param');
    });
    
    if (!isKnown && !link.startsWith('/api') && !link.startsWith('/auth')) {
      brokenLinks.push({ link, files });
    }
  }
  
  if (brokenLinks.length > 0) {
    console.log('== Potentially Broken Links ==');
    for (const { link, files } of brokenLinks) {
      console.log(`\n  ${link}`);
      files.slice(0, 3).forEach(f => console.log(`    - ${f}`));
      if (files.length > 3) {
        console.log(`    ... and ${files.length - 3} more`);
      }
    }
    console.log(`\n✗ Found ${brokenLinks.length} potentially broken link(s)`);
  } else {
    console.log('✓ No broken links detected');
  }
  
  console.log('\n== Link Scan Complete ==');
}

checkLinks();
