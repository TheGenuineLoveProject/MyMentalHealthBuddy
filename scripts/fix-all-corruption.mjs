#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Find all corrupted files dynamically
const findCorruptedFiles = () => {
  const output = execSync(
    'find server scripts -type f \\( -name "*.ts" -o -name "*.js" -o -name "*.mjs" \\) -exec grep -l \'"[a-z]*"[a-z]"\' {} \\; 2>/dev/null',
    { encoding: 'utf-8' }
  );
  return output.trim().split('\n').filter(Boolean);
};

const corruptedFiles = findCorruptedFiles();

let totalFixed = 0;
let totalFiles = 0;

console.log('🔧 PECAS v1100^ - Complete Corruption Repair\n');
console.log(`📋 Found ${corruptedFiles.length} corrupted files...\n`);

corruptedFiles.forEach((filePath) => {
  try {
    let content = readFileSync(filePath, 'utf-8');
    const originalContent = content;
    let fileFixed = 0;

    // Fix pattern: "words" -> "words"
    content = content.replace(/"([a-z]+)"([a-z])"/g, (match, p1, p2) => {
      fileFixed++;
      return `"${p1}${p2}"`;
    });

    if (content !== originalContent) {
      writeFileSync(filePath, content, 'utf-8');
      totalFixed += fileFixed;
      totalFiles++;
      console.log(`✅ ${filePath} - Fixed ${fileFixed} issues`);
    }
  } catch (err) {
    console.error(`❌ ${filePath} - Error: ${err.message}`);
  }
});

console.log(`\n🎉 COMPLETE REPAIR FINISHED!`);
console.log(`📊 Total files processed: ${corruptedFiles.length}`);
console.log(`✅ Files repaired: ${totalFiles}`);
console.log(`🔧 Total fixes applied: ${totalFixed}`);
