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

console.log(`🔍 Processing ${allFiles.length} TypeScript files...\n`);

let totalFixed = 0;
const fixes = [];

allFiles.forEach(file => {
  let content = readFileSync(file, 'utf-8');
  const original = content;
  
  // Fix complex import corruption patterns
  content = content.replace(/\.j\.js"s"/g, '.js"');
  content = content.replace(/\.t\.ts"s"/g, '.ts"');
  content = content.replace(/\.j"s"/g, '.js"');
  content = content.replace(/\.t"s"/g, '.ts"');
  
  // Fix ||; corruption
  content = content.replace(/\|\|;/g, '||');
  
  // Fix &&; corruption  
  content = content.replace(/&&;/g, '&&');
  
  // Fix template literal corruption
  content = content.replace(/\$\{/g, '${');
  
  if (content !== original) {
    writeFileSync(file, content, 'utf-8');
    totalFixed++;
    fixes.push(file);
  }
});

if (fixes.length > 0) {
  console.log(`✅ Fixed ${totalFixed} files:\n`);
  fixes.forEach(file => console.log(`  - ${file}`));
} else {
  console.log('✅ No corruption found!');
}

console.log(`\n🎉 Advanced repair complete!\n`);
