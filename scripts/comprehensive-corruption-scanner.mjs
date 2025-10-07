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

console.log(`🔍 Scanning ${allFiles.length} TypeScript files for corruption...\n`);

// Comprehensive corruption patterns
const corruptionPatterns = [
  { name: 'Opening bracket with semicolon', regex: /\[;/g, fix: '[' },
  { name: 'Opening brace with semicolon', regex: /\{;/g, fix: '{' },
  { name: 'Opening paren with semicolon', regex: /\(;\s*\n/g, fix: '(\n' },
  { name: 'Comma semicolon', regex: /,;/g, fix: ',' },
  { name: 'Colon semicolon', regex: /:;/g, fix: ':' },
  { name: 'Equals semicolon at line end', regex: /=;\s*\n/g, fix: '=\n' },
  { name: 'Corrupted .js imports', regex: /\.j"s"/g, fix: '.js"' },
  { name: 'Corrupted .ts imports', regex: /\.t"s"/g, fix: '.ts"' },
  { name: 'String delimiter corruption "word"e"', regex: /"([a-zA-Z0-9-_]+)"([a-z])"/g, fix: '"$1-$2"' },
  { name: 'Identifier split before dot', regex: /([a-zA-Z_]);\s*\./g, fix: '$1.' },
  { name: 'Semicolon before closing brace in object', regex: /;(\s*\n\s*})/g, fix: '$1' },
  { name: 'Semicolon before closing bracket', regex: /;(\s*\n\s*])/g, fix: '$1' },
];

let totalIssues = 0;
const fileIssues = new Map();

// First pass: Scan all files
allFiles.forEach(file => {
  const content = readFileSync(file, 'utf-8');
  let issues = [];
  
  corruptionPatterns.forEach(pattern => {
    const matches = content.match(pattern.regex);
    if (matches && matches.length > 0) {
      issues.push({ pattern: pattern.name, count: matches.length });
      totalIssues += matches.length;
    }
  });
  
  if (issues.length > 0) {
    fileIssues.set(file, issues);
  }
});

if (totalIssues === 0) {
  console.log('✅ No corruption detected! All files are clean.\n');
  process.exit(0);
}

console.log(`⚠️  Found ${totalIssues} corruption instances across ${fileIssues.size} files\n`);
console.log('Top corrupted files:');

// Show top 10 most corrupted files
const sortedFiles = Array.from(fileIssues.entries())
  .sort((a, b) => {
    const sumA = a[1].reduce((acc, i) => acc + i.count, 0);
    const sumB = b[1].reduce((acc, i) => acc + i.count, 0);
    return sumB - sumA;
  })
  .slice(0, 10);

sortedFiles.forEach(([file, issues]) => {
  const total = issues.reduce((acc, i) => acc + i.count, 0);
  console.log(`  ${file}: ${total} issues`);
  issues.forEach(issue => {
    console.log(`    - ${issue.pattern}: ${issue.count}`);
  });
});

console.log('\n🔧 Applying fixes...\n');

let totalFixed = 0;
const fixes = [];

allFiles.forEach(file => {
  let content = readFileSync(file, 'utf-8');
  const original = content;
  let fileFixCount = 0;
  
  corruptionPatterns.forEach(pattern => {
    if (pattern.regex.test(content)) {
      content = content.replace(pattern.regex, pattern.fix);
      fileFixCount++;
    }
  });
  
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
  console.log('ℹ️  No files needed fixing');
}

console.log(`\n🎉 Repair complete! Fixed ${totalIssues} corruption instances.\n`);
