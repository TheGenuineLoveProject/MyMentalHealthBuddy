#!/usr/bin/env node
// Audits lucide-react icon usage across client/src and prints icons used
// EXCLUSIVELY by admin pages (path contains /admin/ or basename starts with
// Admin/ContentAdmin). The output is the canonical source for the
// ADMIN_ONLY_LUCIDE_ICONS set in vite.config.js.
//
// Run after adding/removing icons in admin pages:
//   node scripts/audit-lucide-usage.mjs
//
// If the printed list differs from the set in vite.config.js, update it.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'client/src');

function isAdminOnly(p) {
  const base = path.basename(p);
  return p.includes(`${path.sep}admin${path.sep}`) || /^Admin/.test(base) || /^ContentAdmin/.test(base);
}

// PascalCase → kebab-case lucide file name.
//  - Insert `-` before each uppercase letter (except first)
//  - Insert `-` before each digit that follows a letter (Link2 → link-2)
//  - Strip trailing `-icon` (PinIcon → pin, lucide aliases XxxIcon → Xxx)
function toLucideKebab(name) {
  let s = name
    .replace(/([a-zA-Z])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
    .toLowerCase();
  if (s.endsWith('-icon')) s = s.slice(0, -'-icon'.length);
  return s;
}

const usage = new Map(); // icon (PascalCase) → Set<file>

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(jsx?|tsx?)$/.test(entry.name)) {
      const src = fs.readFileSync(p, 'utf8');
      const re = /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g;
      let m;
      while ((m = re.exec(src))) {
        for (const raw of m[1].split(',')) {
          const name = raw.trim().split(/\s+as\s+/)[0].trim();
          if (!name) continue;
          if (!usage.has(name)) usage.set(name, new Set());
          usage.get(name).add(p);
        }
      }
    }
  }
}

walk(SRC);

const adminOnly = [];
for (const [icon, files] of usage) {
  const arr = [...files];
  if (arr.every(isAdminOnly)) adminOnly.push(icon);
}

adminOnly.sort();
const kebabSet = [...new Set(adminOnly.map(toLucideKebab))].sort();

console.log(`Total distinct lucide icons: ${usage.size}`);
console.log(`Admin-only icons: ${adminOnly.length}`);
console.log(`Kebab file names (for ADMIN_ONLY_LUCIDE_ICONS Set):`);
console.log(JSON.stringify(kebabSet, null, 2));
