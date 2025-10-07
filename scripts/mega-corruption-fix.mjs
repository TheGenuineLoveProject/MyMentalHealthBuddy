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

console.log(`🔍 Processing ${allFiles.length} TypeScript files with mega-fixer...\n`);

let totalFixed = 0;
const fixes = [];

allFiles.forEach(file => {
  let content = readFileSync(file, 'utf-8');
  const original = content;
  
  // Fix ALL corruption patterns in order
  
  // 1. Import corruption patterns
  content = content.replace(/\.j\.js"s"/g, '.js"');
  content = content.replace(/\.t\.ts"s"/g, '.ts"');
  content = content.replace(/\.j"s"/g, '.js"');
  content = content.replace(/\.t"s"/g, '.ts"');
  
  // 2. Opening punctuation with semicolon
  content = content.replace(/\[;/g, '[');
  content = content.replace(/\{;/g, '{');
  content = content.replace(/\(;\s*\n/g, '(\n');
  
  // 3. Operator semicolons
  content = content.replace(/,;/g, ',');
  content = content.replace(/:;/g, ':');
  content = content.replace(/=;\s*\n/g, '=\n');
  content = content.replace(/\|\|;/g, '||');
  content = content.replace(/&&;/g, '&&');
  
  // 4. Number prefix corruption (;0.95 should be * 0.95)
  content = content.replace(/ ;(\d+\.?\d*)/g, ' * $1');
  
  // 5. Identifier splits (letter; followed by dot)
  content = content.replace(/([a-zA-Z_]);\s*\./g, '$1.');
  
  // 6. Semicolons before closing brackets/braces (in multi-line contexts)
  content = content.replace(/;(\s*\n\s*})/g, '$1');
  content = content.replace(/;(\s*\n\s*])/g, '$1');
  content = content.replace(/;(\s*\n\s*\))/g, '$1');
  
  //  7. Promise chain corruption (.then;  should be .then)
  content = content.replace(/\.(then|catch|finally);/g, '.$1');
  
  // 8. Arrow function corruption (=> ;  should be =>)
  content = content.replace(/=>\s*;/g, '=>');
  
  // 9. Template literal corruption
  content = content.replace(/\$\{/g, '${');
  
  // 10. String corruption patterns
  content = content.replace(/"([a-zA-Z0-9-_]+)"([a-z])"/g, '"$1-$2"');
  
  if (content !== original) {
    writeFileSync(file, content, 'utf-8');
    totalFixed++;
    fixes.push(file);
  }
});

console.log(`\n✅ Mega-fix complete! Fixed ${totalFixed} files.\n`);

if (fixes.length > 0) {
  console.log('Modified files:');
  fixes.forEach(file => console.log(`  - ${file}`));
}
