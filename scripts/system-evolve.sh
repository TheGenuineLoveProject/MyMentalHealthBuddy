#!/usr/bin/env bash
set -e

echo "=== SYSTEM EVOLUTION SCAN START ==="

echo
echo "[1] Regenerating route manifest..."
npm run routes:manifest

echo
echo "[2] Running pretest..."
npm run pretest

echo
echo "[3] Running verify..."
npm run verify

echo
echo "[4] Running lightweight evolution analysis..."
node <<'NODE'
const fs = require('fs');

const manifestPath = 'docs/ROUTE_MANIFEST.json';

if (!fs.existsSync(manifestPath)) {
  console.error('Missing docs/ROUTE_MANIFEST.json');
  process.exit(1);
}

const routes = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const counts = routes.reduce((acc, r) => {
  acc[r.method] = (acc[r.method] || 0) + 1;
  return acc;
}, {});

const total = routes.length;
const getCount = counts.GET || 0;
const postCount = counts.POST || 0;
const putCount = counts.PUT || 0;
const patchCount = counts.PATCH || 0;
const deleteCount = counts.DELETE || 0;

console.log('Total routes:', total);
console.log('Method counts:', counts);

if (postCount < Math.max(10, Math.floor(getCount * 0.15))) {
  console.log('WARN: POST route volume is relatively low compared with GET routes.');
}

if ((deleteCount + patchCount) === 0) {
  console.log('WARN: No DELETE/PATCH routes detected. Check whether mutation coverage is intentional.');
}

const duplicateKeys = new Map();
for (const r of routes) {
  const key = `${r.method} ${r.path}`;
  if (!duplicateKeys.has(key)) duplicateKeys.set(key, []);
  duplicateKeys.get(key).push(r.file);
}

const trueDups = [...duplicateKeys.entries()].filter(([, files]) => files.length > 1);

if (trueDups.length) {
  console.log('WARN: Potential duplicate method+path entries found in manifest:');
  for (const [key, files] of trueDups.slice(0, 20)) {
    console.log(` - ${key}`);
    for (const f of files) console.log(`   -> ${f}`);
  }
} else {
  console.log('OK: No duplicate method+path pairs in manifest.');
}

console.log('=== EVOLUTION ANALYSIS COMPLETE ===');
NODE

echo
echo "=== SYSTEM EVOLUTION SCAN COMPLETE ==="
