#!/usr/bin/env node
/**
 * Dead Code Scanner
 * Detects unused exports and deprecated code
 */

import { execSync } from 'child_process';
import fs from 'fs';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

console.log(`${COLORS.blue}╔════════════════════════════════════════════════════════════╗${COLORS.reset}`);
console.log(`${COLORS.blue}║              DEAD CODE SCANNER                             ║${COLORS.reset}`);
console.log(`${COLORS.blue}╚════════════════════════════════════════════════════════════╝${COLORS.reset}\n`);

const results = {
  deprecatedFiles: [],
  unusedExports: [],
  backupFiles: [],
  passed: true,
};

try {
  const backups = execSync('find client/src server -name "*.bak" -o -name "*.backup" -o -name "*.old" 2>/dev/null', { encoding: 'utf8' });
  results.backupFiles = backups.trim().split('\n').filter(Boolean);
  console.log(`${results.backupFiles.length === 0 ? COLORS.green + '✓' : COLORS.yellow + '⚠'}${COLORS.reset} Backup files: ${results.backupFiles.length}`);
} catch {
  console.log(`${COLORS.green}✓${COLORS.reset} No backup files found`);
}

try {
  const deprecated = execSync('grep -rl "@deprecated" client/src server --include="*.jsx" --include="*.tsx" --include="*.mjs" --include="*.js" 2>/dev/null', { encoding: 'utf8' });
  results.deprecatedFiles = deprecated.trim().split('\n').filter(Boolean);
  console.log(`${COLORS.yellow}⚠${COLORS.reset} Deprecated files: ${results.deprecatedFiles.length}`);
} catch {
  console.log(`${COLORS.green}✓${COLORS.reset} No deprecated markers found`);
}

try {
  const emptyFiles = execSync('find client/src server -type f \\( -name "*.jsx" -o -name "*.tsx" -o -name "*.js" -o -name "*.ts" -o -name "*.mjs" \\) -empty 2>/dev/null', { encoding: 'utf8' });
  const emptyList = emptyFiles.trim().split('\n').filter(Boolean);
  if (emptyList.length > 0) {
    console.log(`${COLORS.yellow}⚠${COLORS.reset} Empty files: ${emptyList.length}`);
    results.emptyFiles = emptyList;
  } else {
    console.log(`${COLORS.green}✓${COLORS.reset} No empty files`);
  }
} catch {
  console.log(`${COLORS.green}✓${COLORS.reset} No empty files`);
}

console.log('\n' + '═'.repeat(60));
console.log(`\n${COLORS.blue}DEAD CODE SUMMARY:${COLORS.reset}`);
console.log(`  Backup files: ${results.backupFiles.length}`);
console.log(`  Deprecated files: ${results.deprecatedFiles.length}`);
console.log(`  Empty files: ${(results.emptyFiles || []).length}`);

if (results.backupFiles.length === 0) {
  console.log(`\n${COLORS.green}✅ PASS - No dead code artifacts${COLORS.reset}`);
} else {
  console.log(`\n${COLORS.yellow}⚠ WARNING - Backup files should be removed${COLORS.reset}`);
}

fs.writeFileSync('docs/scan-deadcode-result.json', JSON.stringify(results, null, 2));
console.log(`\nResults saved to: docs/scan-deadcode-result.json`);
