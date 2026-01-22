#!/usr/bin/env node

/**
 * Route map: discovers routes from pages directories and App.jsx route definitions.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const EXCLUDE = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.cache', '.vite']);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (EXCLUDE.has(ent.name)) continue;
      walk(path.join(dir, ent.name), out);
    } else if (ent.isFile()) {
      if (/\.(js|jsx|ts|tsx|mdx)$/.test(ent.name)) out.push(path.join(dir, ent.name));
    }
  }
  return out;
}

function inferRoutesFromPages(base) {
  const routes = new Set();
  for (const f of walk(base)) {
    const rel = path.relative(base, f).replace(/\\/g, '/');
    if (rel.startsWith('_')) continue;
    if (rel.includes('[') && rel.includes(']')) continue;
    let r = rel.replace(/\.(js|jsx|ts|tsx|mdx)$/, '');
    r = r.replace(/\/(page|index)$/, '');
    r = r === 'index' ? '' : r;
    routes.add('/' + r);
  }
  return routes;
}

function inferRoutesFromAppJsx() {
  const routes = new Set();
  const appPaths = [
    path.join(ROOT, 'client', 'src', 'App.jsx'),
    path.join(ROOT, 'client', 'src', 'App.tsx'),
    path.join(ROOT, 'src', 'App.jsx'),
    path.join(ROOT, 'src', 'App.tsx'),
  ];
  
  for (const appPath of appPaths) {
    if (!fs.existsSync(appPath)) continue;
    const content = fs.readFileSync(appPath, 'utf8');
    const routePattern = /path=["'`](\/[^"'`]*)["'`]/g;
    let m;
    while ((m = routePattern.exec(content))) {
      routes.add(m[1]);
    }
  }
  return routes;
}

console.log('== ROUTE MAP: TheGenuineLoveProject ==\n');

const bases = [
  path.join(ROOT, 'pages'),
  path.join(ROOT, 'src', 'pages'),
  path.join(ROOT, 'client', 'src', 'pages'),
  path.join(ROOT, 'app'),
  path.join(ROOT, 'src', 'app'),
].filter(fs.existsSync);

const all = new Set(['/']);

for (const b of bases) {
  for (const r of inferRoutesFromPages(b)) {
    all.add(r.replace(/\/+$/, '') || '/');
  }
}

for (const r of inferRoutesFromAppJsx()) {
  all.add(r.replace(/\/+$/, '') || '/');
}

const sorted = [...all].sort();
console.log(`Detected ${sorted.length} routes:\n`);

const categories = {
  auth: [],
  admin: [],
  legal: [],
  tools: [],
  api: [],
  other: []
};

for (const r of sorted) {
  if (r.includes('login') || r.includes('register') || r.includes('auth') || r.includes('callback')) {
    categories.auth.push(r);
  } else if (r.includes('admin')) {
    categories.admin.push(r);
  } else if (r.includes('legal') || r.includes('terms') || r.includes('privacy') || r.includes('disclaimer') || r.includes('ethics')) {
    categories.legal.push(r);
  } else if (r.includes('tools') || r.includes('design')) {
    categories.tools.push(r);
  } else if (r.startsWith('/api')) {
    categories.api.push(r);
  } else {
    categories.other.push(r);
  }
}

console.log('== Auth Routes ==');
categories.auth.forEach(r => console.log(`  ${r}`));

console.log('\n== Admin Routes ==');
categories.admin.forEach(r => console.log(`  ${r}`));

console.log('\n== Legal Routes ==');
categories.legal.forEach(r => console.log(`  ${r}`));

console.log('\n== Tool Routes ==');
categories.tools.forEach(r => console.log(`  ${r}`));

console.log('\n== Other Routes ==');
categories.other.slice(0, 20).forEach(r => console.log(`  ${r}`));
if (categories.other.length > 20) {
  console.log(`  ... and ${categories.other.length - 20} more`);
}

console.log('\n== Route Map Complete ==');
