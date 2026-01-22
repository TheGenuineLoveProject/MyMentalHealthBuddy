#!/usr/bin/env node

/**
 * Route/link scan (best-effort).
 * Why: dead links wreck trust and funnel drop-off.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const EXCLUDE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.cache', '.vite']);
const LINK_RE = /(?:href|to)\s*=\s*["'`](\/[^"'`]*)["'`]/g;
const ROUTE_RE = /(?:path|route)\s*=\s*["'`](\/[^"'`]*)["'`]/gi;

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (EXCLUDE_DIRS.has(ent.name)) continue;
      walk(path.join(dir, ent.name), out);
    } else if (ent.isFile()) {
      const p = path.join(dir, ent.name);
      if (/\.(js|jsx|ts|tsx|md|mdx|html|vue|svelte)$/.test(p)) out.push(p);
    }
  }
  return out;
}

function guessRouteSet() {
  const routes = new Set(['/']);
  
  const candidates = [
    path.join(ROOT, 'pages'),
    path.join(ROOT, 'src', 'pages'),
    path.join(ROOT, 'client', 'src', 'pages'),
    path.join(ROOT, 'app'),
    path.join(ROOT, 'src', 'app'),
  ];

  for (const base of candidates) {
    if (!fs.existsSync(base)) continue;
    const files = [];
    const walkRoutes = (d) => {
      for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, ent.name);
        if (ent.isDirectory()) walkRoutes(p);
        else if (ent.isFile() && /\.(js|jsx|ts|tsx|mdx)$/.test(ent.name)) files.push(p);
      }
    };
    walkRoutes(base);

    for (const f of files) {
      const rel = path.relative(base, f).replace(/\\/g, '/');
      if (rel.startsWith('_')) continue;
      if (rel.includes('[') && rel.includes(']')) continue;
      const cleaned = rel
        .replace(/\.(js|jsx|ts|tsx|mdx)$/, '')
        .replace(/\/(page|index)$/, '')
        .replace(/^index$/, '');
      const route = '/' + cleaned;
      routes.add(route.replace(/\/+$/, '') || '/');
    }
  }
  return routes;
}

console.log('== LINK SCAN: TheGenuineLoveProject ==\n');

const allFiles = walk(ROOT);
const links = new Map();
const routesFromCode = new Set();

for (const f of allFiles) {
  const txt = fs.readFileSync(f, 'utf8');
  const relPath = path.relative(ROOT, f);
  
  ROUTE_RE.lastIndex = 0;
  let m;
  while ((m = ROUTE_RE.exec(txt))) {
    const route = m[1].split('#')[0].split('?')[0];
    routesFromCode.add(route.replace(/:\w+/g, ':param'));
  }
  
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(txt))) {
    const href = m[1].split('#')[0].split('?')[0];
    if (!href || href === '/') continue;
    if (!links.has(href)) links.set(href, []);
    links.get(href).push(relPath);
  }
}

const routes = guessRouteSet();
for (const r of routesFromCode) routes.add(r);

const staticRoutes = [
  '/', '/login', '/register', '/dashboard', '/chat', '/journal',
  '/mood', '/profile', '/settings', '/crisis', '/faq', '/about',
  '/terms', '/privacy', '/disclaimer', '/ethics', '/legal', '/safety',
  '/resources', '/glossary', '/onboarding', '/pricing', '/subscribe',
  '/admin', '/health', '/blog', '/community', '/tools', '/design-system'
];
staticRoutes.forEach(r => routes.add(r));

const suspicious = [];

for (const [href, files] of links.entries()) {
  if (href.startsWith('/api')) continue;
  if (href.startsWith('/auth')) continue;
  if (href.startsWith('/@')) continue;
  
  const normalized = href.replace(/:\w+/g, ':param').replace(/\/+$/, '') || '/';
  
  const isKnown = [...routes].some(route => {
    const normRoute = route.replace(/:\w+/g, ':param').replace(/\/+$/, '') || '/';
    return normalized === normRoute || 
           normalized.startsWith(normRoute + '/') ||
           normRoute.includes(':param');
  });
  
  if (!isKnown) {
    suspicious.push({ href, files: [...new Set(files)] });
  }
}

console.log(`Files scanned: ${allFiles.length}`);
console.log(`Routes detected: ${routes.size}`);
console.log(`Unique links found: ${links.size}\n`);

if (suspicious.length) {
  console.log('== Potentially Broken Links ==');
  for (const { href, files } of suspicious) {
    console.log(`\n  ${href}`);
    files.slice(0, 3).forEach(f => console.log(`    - ${f}`));
    if (files.length > 3) {
      console.log(`    ... and ${files.length - 3} more`);
    }
  }
  console.log(`\n⚠ Found ${suspicious.length} potentially broken link(s)`);
  console.log('Review these links manually - some may be dynamic routes.\n');
} else {
  console.log('✓ No broken links detected');
}

console.log('\n== Link Scan Complete ==');
