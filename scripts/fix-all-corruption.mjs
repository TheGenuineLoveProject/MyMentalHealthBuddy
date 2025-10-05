#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

const targetFiles = [
  'server/config.ts',
  'server/docs/api.ts',
  'server/lib/openai-mock.ts',
  'server/middleware/errorHandler.ts',
  'server/middleware/monitoring.ts',
  'server/openai.ts',
  'server/routes.ts',
  'server/routes/ai-orchestrator.ts',
  'server/routes/auth.ts',
  'server/routes/billing.ts',
  'server/routes/healing.ts',
  'server/routes/mental-health.ts',
  'server/routes/mood.ts',
  'server/services/cache.ts'
];

let totalFixes = 0;
let filesFixed = 0;

console.log('🔧 Comprehensive Corruption Fix - Phase 2\n');

for (const file of targetFiles) {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Skip: ${file} (not found)`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  let fixes = 0;

  // 1. Fix corrupted function calls: (; -> (
  const beforeParen = content;
  content = content.replace(/\(;/g, '(');
  if (content !== beforeParen) fixes++;

  // 2. Fix erroneous semicolons after commas: ,; -> ,
  const beforeComma = content;
  content = content.replace(/,;/g, ',');
  if (content !== beforeComma) fixes++;

  // 3. Fix erroneous semicolons after closing braces at end of line: }; -> }
  const beforeBrace = content;
  content = content.replace(/};$/gm, '}');
  if (content !== beforeBrace) fixes++;

  // 4. Fix corrupted Math.random() multiplication:  ; -> *
  const beforeMath = content;
  content = content.replace(/Math\.random\(\)\s*;/g, 'Math.random() *');
  if (content !== beforeMath) fixes++;

  // 5. Fix other multiplication operators:  ;NUMBER) ->  *NUMBER)
  const beforeMult = content;
  content = content.replace(/\s+;(\d+)\)/g, ' * $1)');
  if (content !== beforeMult) fixes++;

  // 6. Fix period-semicolon:  .; -> .
  const beforePeriod = content;
  content = content.replace(/\.\s*;/g, '.');
  if (content !== beforePeriod) fixes++;

  // 7. Fix double-semicolon: ;; -> ;
  const beforeDouble = content;
  content = content.replace(/;;/g, ';');
  if (content !== beforeDouble) fixes++;

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    filesFixed++;
    totalFixes += fixes;
    console.log(`✅ Fixed: ${file} (${fixes} pattern types)`);
  } else {
    console.log(`✓  Clean: ${file}`);
  }
}

console.log(`\n🎉 Complete! Fixed ${filesFixed}/${targetFiles.length} files (${totalFixes} pattern types total)`);
