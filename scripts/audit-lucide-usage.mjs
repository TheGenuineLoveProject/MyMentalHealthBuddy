#!/usr/bin/env node
// Audits lucide-react icon usage across client/src.
// Two outputs:
//   1. ADMIN-ONLY icons — icons used exclusively by admin pages (informational
//      only; barrel re-exports prevent splitting them into a separate chunk).
//   2. DEAD IMPORTS — icons imported but never referenced anywhere else in
//      the same source file. These are safe to remove (zero behavior change,
//      shrinks the lucide chunk by ~2.2KB per dead icon).
//
// Run: node scripts/audit-lucide-usage.mjs
// Run with --fix to automatically remove dead imports.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'client/src');
const FIX = process.argv.includes('--fix');

function isAdminOnly(p) {
  const base = path.basename(p);
  return p.includes(`${path.sep}admin${path.sep}`) || /^Admin/.test(base) || /^ContentAdmin/.test(base);
}

const usage = new Map(); // icon → Set<file>
const deadImports = []; // {file, dead: [names]}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p);
    else if (/\.(jsx?|tsx?)$/.test(entry.name)) processFile(p);
  }
}

function processFile(p) {
  const src = fs.readFileSync(p, 'utf8');
  const re = /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]\s*;?/g;
  const imports = []; // {match, names: [{raw, local}]}
  let m;
  while ((m = re.exec(src))) {
    const names = m[1].split(',').map(raw => {
      const trimmed = raw.trim();
      if (!trimmed) return null;
      const parts = trimmed.split(/\s+as\s+/);
      return { raw: trimmed, original: parts[0].trim(), local: (parts[1] || parts[0]).trim() };
    }).filter(Boolean);
    imports.push({ matchStart: m.index, matchEnd: m.index + m[0].length, fullMatch: m[0], names });
    for (const n of names) {
      if (!usage.has(n.original)) usage.set(n.original, new Set());
      usage.get(n.original).add(p);
    }
  }

  if (!imports.length) return;

  // Strip imports from src to leave only "body" code, then check references.
  let body = src;
  for (let i = imports.length - 1; i >= 0; i--) {
    const im = imports[i];
    body = body.slice(0, im.matchStart) + body.slice(im.matchEnd);
  }

  const dead = [];
  for (const im of imports) {
    for (const n of im.names) {
      // Check if local name appears in body as identifier (word boundary).
      const ref = new RegExp(`\\b${n.local}\\b`);
      if (!ref.test(body)) dead.push(n);
    }
  }
  if (dead.length) deadImports.push({ file: p, imports, dead });
}

walk(SRC);

// --- Report admin-only ---
const adminOnly = [...usage.entries()].filter(([, files]) => [...files].every(isAdminOnly)).map(([n]) => n).sort();

console.log('=== Lucide icon audit ===');
console.log(`Total distinct icons imported: ${usage.size}`);
console.log(`Admin-only icons (informational): ${adminOnly.length}`);
console.log();

console.log(`=== DEAD IMPORTS ===`);
console.log(`Files with dead imports: ${deadImports.length}`);
const totalDead = deadImports.reduce((a, x) => a + x.dead.length, 0);
console.log(`Total dead imports: ${totalDead} (~${(totalDead * 2.2).toFixed(0)} KB raw)`);
console.log();
for (const { file, dead } of deadImports) {
  console.log(`  ${path.relative(ROOT, file)}`);
  console.log(`    dead: ${dead.map(d => d.raw).join(', ')}`);
}

// --- Optional fix mode ---
if (!FIX) {
  console.log();
  console.log('Run with --fix to remove dead imports automatically.');
  process.exit(0);
}

console.log('\n=== APPLYING FIXES ===');
let filesFixed = 0;
let importsRemoved = 0;
for (const { file, imports, dead } of deadImports) {
  let src = fs.readFileSync(file, 'utf8');
  const deadSet = new Set(dead.map(d => d.raw));
  // Process imports in reverse so positions stay valid.
  for (let i = imports.length - 1; i >= 0; i--) {
    const im = imports[i];
    const surviving = im.names.filter(n => !deadSet.has(n.raw));
    if (surviving.length === im.names.length) continue;
    let replacement;
    if (surviving.length === 0) {
      replacement = ''; // strip whole import
    } else {
      replacement = `import { ${surviving.map(n => n.raw).join(', ')} } from 'lucide-react';`;
    }
    src = src.slice(0, im.matchStart) + replacement + src.slice(im.matchEnd);
    importsRemoved += im.names.length - surviving.length;
  }
  // Clean up any blank lines that resulted from full-import removal.
  src = src.replace(/^\s*\n/gm, (match, offset) => offset === 0 ? '' : match);
  fs.writeFileSync(file, src);
  filesFixed++;
  console.log(`  fixed: ${path.relative(ROOT, file)}`);
}
console.log(`\n${importsRemoved} dead imports removed across ${filesFixed} files.`);
