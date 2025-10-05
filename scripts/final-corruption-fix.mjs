#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const targetDirs = ['server', 'shared'];
const allFiles = [];

// Recursively find all .ts files
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

console.log(`🔍 Found ${allFiles.length} TypeScript files\n`);

let totalFixed = 0;
const fixes = [];

allFiles.forEach(file => {
  let content = readFileSync(file, 'utf-8');
  const original = content;
  let fileFixCount = 0;

  // Fix 1: z; .enum → z.enum (identifier split before dot)
  if (content.match(/z;\s*\./)) {
    content = content.replace(/z;\s*\./g, 'z.');
    fileFixCount++;
  }

  // Fix 2: .j"s" → .js (corrupted imports)
  if (content.match(/\.j"s"/)) {
    content = content.replace(/\.j"s"/g, '.js"');
    fileFixCount++;
  }

  // Fix 3: :; → : (property assignment corruption)
  if (content.match(/:;/)) {
    content = content.replace(/:;/g, ':');
    fileFixCount++;
  }

  // Fix 4: Other identifier splits (e.g., any letter; followed by dot)
  if (content.match(/([a-zA-Z]);\s*\./)) {
    content = content.replace(/([a-zA-Z]);\s*\./g, '$1.');
    fileFixCount++;
  }

  if (content !== original) {
    writeFileSync(file, content, 'utf-8');
    totalFixed++;
    fixes.push(`  ✅ ${file} (${fileFixCount} patterns fixed)`);
  }
});

if (fixes.length > 0) {
  console.log('Fixed files:\n' + fixes.join('\n'));
  console.log(`\n🎉 Total: ${totalFixed} files repaired`);
} else {
  console.log('✓ No corruption found - all files clean!');
}
