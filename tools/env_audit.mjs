#!/usr/bin/env node

/**
 * Env audit: discovers env var usage patterns and validates .env/.env.example coverage.
 * Why: prevents "works on my machine" auth/login failures.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const EXCLUDE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', '.cache', '.vite']);
const PATTERNS = [
  /process\.env\.([A-Z0-9_]+)/g,
  /import\.meta\.env\.([A-Z0-9_]+)/g,
];

const KNOWN_REQUIRED = new Set(['DATABASE_URL', 'SESSION_SECRET']);
const KNOWN_OPTIONAL = new Set([
  'NODE_ENV', 'PORT', 'REPL_ID', 'REPL_OWNER', 'REPLIT_DB_URL', 'REPLIT_DOMAINS',
  'VITE_API_URL', 'VITE_PUBLIC_URL', 'BASE_URL', 'DEV', 'PROD', 'SSR', 'MODE'
]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (EXCLUDE_DIRS.has(ent.name)) continue;
      walk(path.join(dir, ent.name), out);
    } else if (ent.isFile()) {
      const p = path.join(dir, ent.name);
      if (/\.(js|jsx|ts|tsx|mjs|cjs|py|go|java|rb|php|md|mdx)$/.test(p)) out.push(p);
    }
  }
  return out;
}

function parseDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return new Set();
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  const keys = new Set();
  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const idx = t.indexOf('=');
    if (idx > 0) keys.add(t.slice(0, idx).trim());
  }
  return keys;
}

console.log('== ENV AUDIT ==\n');

const files = walk(ROOT);
const used = new Set();

for (const f of files) {
  const txt = fs.readFileSync(f, 'utf8');
  for (const re of PATTERNS) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(txt))) used.add(m[1]);
  }
}

console.log(`Scanned ${files.length} files`);
console.log(`Found ${used.size} unique env var references\n`);

const envExample = parseDotEnv(path.join(ROOT, '.env.example'));
const envLocal = parseDotEnv(path.join(ROOT, '.env'));

const missingInExample = [...used].filter(k => !envExample.has(k) && !KNOWN_OPTIONAL.has(k)).sort();
const missingLocally = [...used].filter(k => !envLocal.has(k) && !KNOWN_OPTIONAL.has(k) && !process.env[k]).sort();

console.log('== Required Environment Variables ==');
let requiredMissing = 0;
for (const k of KNOWN_REQUIRED) {
  if (process.env[k]) {
    console.log(`✓ ${k} - SET`);
  } else {
    console.log(`✗ ${k} - MISSING`);
    requiredMissing++;
  }
}

console.log('\n== Discovered Environment Variables ==');
const discovered = [...used].filter(k => !KNOWN_REQUIRED.has(k) && !KNOWN_OPTIONAL.has(k)).sort();
for (const k of discovered) {
  if (process.env[k]) {
    console.log(`✓ ${k} - SET`);
  } else {
    console.log(`- ${k} - not set`);
  }
}

if (missingInExample.length) {
  console.log('\n== Missing in .env.example ==');
  for (const k of missingInExample) console.log(`  - ${k}`);
}

if (missingLocally.length) {
  console.log('\n== Note: Not in .env (may be in Replit Secrets) ==');
  for (const k of missingLocally) console.log(`  - ${k}`);
}

console.log('\n== File Checks ==');
if (fs.existsSync(path.join(ROOT, '.env.example'))) {
  console.log('✓ .env.example exists');
} else {
  console.log('- .env.example not found');
}

if (fs.existsSync(path.join(ROOT, 'ENV_CHECKLIST.md'))) {
  console.log('✓ ENV_CHECKLIST.md exists');
} else {
  console.log('- ENV_CHECKLIST.md not found');
}

console.log('\n== Summary ==');
if (requiredMissing > 0) {
  console.log(`⚠ WARNING: ${requiredMissing} required environment variable(s) missing`);
} else {
  console.log('✓ PASS: All required environment variables are set');
}

console.log('\n== Env Audit Complete ==');
