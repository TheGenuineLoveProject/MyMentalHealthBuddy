#!/usr/bin/env node
/**
 * scripts/scan.mjs — Read-only platform scan
 * Outputs issues found in the codebase without making changes
 * Human-triggered only
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ISSUE_TYPES = {
  ERROR: '❌ ERROR',
  WARNING: '⚠️  WARNING',
  INFO: 'ℹ️  INFO'
};

const issues = [];

function addIssue(type, category, message, file = null) {
  issues.push({ type, category, message, file });
}

function runCommand(cmd, silent = true) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: silent ? 'pipe' : 'inherit' });
  } catch (e) {
    return e.stdout || '';
  }
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('  A→Z 360 PLATFORM SCAN — Read-Only Analysis');
console.log('═══════════════════════════════════════════════════════════════\n');

// 1. Check package.json scripts
console.log('📦 Checking package.json...');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (!pkg.scripts?.build) addIssue(ISSUE_TYPES.ERROR, 'Build', 'Missing build script');
  if (!pkg.scripts?.dev) addIssue(ISSUE_TYPES.ERROR, 'Dev', 'Missing dev script');
  if (!pkg.scripts?.['db:push']) addIssue(ISSUE_TYPES.WARNING, 'Database', 'Missing db:push script');
  console.log('  ✓ package.json parsed\n');
} catch (e) {
  addIssue(ISSUE_TYPES.ERROR, 'Config', 'Cannot read package.json');
}

// 2. Check .env.example
console.log('🔐 Checking environment config...');
if (!fs.existsSync('.env.example')) {
  addIssue(ISSUE_TYPES.ERROR, 'Env', 'Missing .env.example file');
} else {
  const envExample = fs.readFileSync('.env.example', 'utf8');
  if (!envExample.includes('DATABASE_URL')) addIssue(ISSUE_TYPES.WARNING, 'Env', 'DATABASE_URL not documented');
  if (!envExample.includes('SESSION_SECRET')) addIssue(ISSUE_TYPES.WARNING, 'Env', 'SESSION_SECRET not documented');
  console.log('  ✓ .env.example exists\n');
}

// 3. Check for "reading level" legacy references
console.log('📚 Checking tiering compliance...');
const readingLevelMatches = runCommand('grep -rn "reading level\\|reading_level" client/src server --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" --include="*.mjs" 2>/dev/null || true');
if (readingLevelMatches.trim()) {
  const lines = readingLevelMatches.trim().split('\n').filter(l => l);
  lines.forEach(line => {
    const [file] = line.split(':');
    addIssue(ISSUE_TYPES.WARNING, 'Tiering', 'Legacy "reading level" reference found', file);
  });
}
console.log('  ✓ Tiering check complete\n');

// 4. Check server port binding
console.log('🌐 Checking server configuration...');
const portBindings = runCommand('grep -rn "0\\.0\\.0\\.0\\|process\\.env\\.PORT" server --include="*.js" --include="*.mjs" 2>/dev/null || true');
if (!portBindings.includes('0.0.0.0')) {
  addIssue(ISSUE_TYPES.WARNING, 'Server', 'Server may not bind to 0.0.0.0');
}
console.log('  ✓ Server config checked\n');

// 5. Check for TODO/FIXME comments
console.log('📝 Checking for TODOs...');
const todoMatches = runCommand('grep -rn "TODO\\|FIXME\\|XXX\\|HACK" client/src server --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" --include="*.mjs" 2>/dev/null || true');
const todoCount = todoMatches.trim().split('\n').filter(l => l.trim()).length;
if (todoCount > 0) {
  addIssue(ISSUE_TYPES.INFO, 'Maintenance', `${todoCount} TODO/FIXME comments found`);
}
console.log('  ✓ TODO scan complete\n');

// 6. Check core files exist
console.log('📁 Checking core files...');
const requiredFiles = [
  'server/index.mjs',
  'client/src/App.jsx',
  'shared/schema.mjs',
  'drizzle.config.ts'
];
requiredFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    addIssue(ISSUE_TYPES.ERROR, 'Structure', `Missing core file: ${file}`);
  }
});
console.log('  ✓ Core files checked\n');

// 7. Check documentation
console.log('📖 Checking documentation...');
const docFiles = ['README.md', 'DISCLAIMER.md', 'PRIVACY.md', 'SECURITY.md'];
docFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    addIssue(ISSUE_TYPES.WARNING, 'Docs', `Missing documentation: ${file}`);
  }
});
console.log('  ✓ Documentation checked\n');

// Output results
console.log('═══════════════════════════════════════════════════════════════');
console.log('  SCAN RESULTS');
console.log('═══════════════════════════════════════════════════════════════\n');

if (issues.length === 0) {
  console.log('✅ No issues found! Platform is clean.\n');
} else {
  const errors = issues.filter(i => i.type === ISSUE_TYPES.ERROR);
  const warnings = issues.filter(i => i.type === ISSUE_TYPES.WARNING);
  const infos = issues.filter(i => i.type === ISSUE_TYPES.INFO);

  console.log(`Found ${issues.length} issues:\n`);
  
  if (errors.length > 0) {
    console.log('ERRORS:');
    errors.forEach(i => console.log(`  ${i.type} [${i.category}] ${i.message}${i.file ? ` (${i.file})` : ''}`));
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('WARNINGS:');
    warnings.forEach(i => console.log(`  ${i.type} [${i.category}] ${i.message}${i.file ? ` (${i.file})` : ''}`));
    console.log('');
  }
  
  if (infos.length > 0) {
    console.log('INFO:');
    infos.forEach(i => console.log(`  ${i.type} [${i.category}] ${i.message}${i.file ? ` (${i.file})` : ''}`));
    console.log('');
  }
}

console.log('═══════════════════════════════════════════════════════════════');
console.log(`  Scan completed at ${new Date().toISOString()}`);
console.log('═══════════════════════════════════════════════════════════════\n');

process.exit(issues.filter(i => i.type === ISSUE_TYPES.ERROR).length > 0 ? 1 : 0);
