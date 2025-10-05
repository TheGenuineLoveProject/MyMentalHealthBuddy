#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const targetDirs = ['server', 'shared'];
const allFiles = [];

function findTsFiles(dir) {
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    if (stat.isDirectory() && item !== 'node_modules' && item !== 'dist') {
      findTsFiles(fullPath);
    } else if (item.endsWith('.ts')) {
      allFiles.push(fullPath);
    }
  }
}

targetDirs.forEach(findTsFiles);

console.log(`🔍 Processing ${allFiles.length} TypeScript files\n`);

let totalFixed = 0;
const fixes = [];

allFiles.forEach(file => {
  let content = readFileSync(file, 'utf-8');
  const original = content;
  let fileFixCount = 0;

  // Fix 1: Remove semicolons after opening parens: (; → (
  if (content.match(/\(;\s*\n/)) {
    content = content.replace(/\(;\s*\n/g, '(\n');
    fileFixCount++;
  }

  // Fix 2: Remove semicolons after opening braces: {; → {
  if (content.match(/\{;/g)) {
    content = content.replace(/\{;/g, '{');
    fileFixCount++;
  }

  // Fix 3: Remove semicolons before closing braces at line end: }; at end of object
  if (content.match(/;(\s*\n\s*[}\]])/g)) {
    content = content.replace(/;(\s*\n\s*[}\]])/g, '$1');
    fileFixCount++;
  }

  // Fix 4: Fix assignment with semicolon: =; → =
  if (content.match(/=;\s*\n/)) {
    content = content.replace(/=;\s*\n/g, '=\n');
    fileFixCount++;
  }

  // Fix 5: Fix comma-semicolon: ,; → ,
  if (content.match(/,;/g)) {
    content = content.replace(/,;/g, ',');
    fileFixCount++;
  }

  // Fix 6: Fix property colon with semicolon: :; → :
  if (content.match(/:;/g)) {
    content = content.replace(/:;/g, ':');
    fileFixCount++;
  }

  // Fix 7: Fix .j"s" corrupted imports
  if (content.match(/\.j"s"/g)) {
    content = content.replace(/\.j"s"/g, '.js"');
    fileFixCount++;
  }

  // Fix 8: Fix any letter followed by semicolon before dot: a; . → a.
  if (content.match(/([a-zA-Z_]);\s*\./g)) {
    content = content.replace(/([a-zA-Z_]);\s*\./g, '$1.');
    fileFixCount++;
  }

  // Fix 9: Fix semicolons in object literals (before commas): value,; → value,
  if (content.match(/,;/g)) {
    content = content.replace(/,;/g, ',');
    fileFixCount++;
  }

  // Fix 10: Remove trailing semicolon after closing interface brace
  if (content.match(/}\s*;(\s*\n\s*(export|interface|type|const|let|var|function|class))/g)) {
    content = content.replace(/}\s*;(\s*\n\s*(export|interface|type|const|let|var|function|class))/g, '}$1');
    fileFixCount++;
  }

  if (content !== original) {
    writeFileSync(file, content, 'utf-8');
    totalFixed++;
    fixes.push(`  ✅ ${file} (${fileFixCount} patterns)`);
  }
});

if (fixes.length > 0) {
  console.log('Fixed files:\n' + fixes.join('\n'));
  console.log(`\n🎉 Total: ${totalFixed} files repaired`);
} else {
  console.log('✓ No additional corruption found!');
}

console.log('\n📊 Running TypeScript check...');
