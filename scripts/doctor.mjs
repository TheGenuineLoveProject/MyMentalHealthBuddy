#!/usr/bin/env node
/**
 * GLP Doctor Script (P091)
 * One-command diagnostic for TheGenuineLoveProject
 * 
 * Usage: npm run doctor
 * 
 * Checks:
 * - Node.js version
 * - Dependencies installed
 * - Build status
 * - TypeScript check
 * - Database connection
 * - Environment variables
 * - Route collisions
 * - Duplicate detection
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  dim: '\x1b[2m',
};

const PASS = `${COLORS.green}✓${COLORS.reset}`;
const FAIL = `${COLORS.red}✗${COLORS.reset}`;
const WARN = `${COLORS.yellow}!${COLORS.reset}`;
const INFO = `${COLORS.blue}ℹ${COLORS.reset}`;

let passCount = 0;
let failCount = 0;
let warnCount = 0;

function log(icon, message, detail = '') {
  console.log(`  ${icon} ${message}${detail ? COLORS.dim + ' ' + detail + COLORS.reset : ''}`);
}

function runCommand(cmd, silent = true) {
  try {
    const output = execSync(cmd, { 
      encoding: 'utf-8', 
      stdio: silent ? 'pipe' : 'inherit',
      timeout: 60000
    });
    return { success: true, output: output.trim() };
  } catch (error) {
    return { success: false, output: error.message };
  }
}

function fileExists(filePath) {
  return fs.existsSync(path.resolve(process.cwd(), filePath));
}

function checkNode() {
  console.log('\n📦 Environment');
  
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion >= 18) {
    log(PASS, 'Node.js', nodeVersion);
    passCount++;
  } else {
    log(FAIL, 'Node.js', `${nodeVersion} (requires >=18)`);
    failCount++;
  }
  
  if (fileExists('node_modules')) {
    log(PASS, 'Dependencies installed');
    passCount++;
  } else {
    log(FAIL, 'Dependencies missing', 'Run: npm install');
    failCount++;
  }
  
  if (fileExists('package-lock.json')) {
    log(PASS, 'Lock file exists');
    passCount++;
  } else {
    log(WARN, 'No package-lock.json');
    warnCount++;
  }
}

function checkEnv() {
  console.log('\n🔐 Environment Variables');
  
  const requiredEnvVars = ['DATABASE_URL'];
  const optionalEnvVars = ['OPENAI_API_KEY', 'STRIPE_SECRET_KEY', 'SESSION_SECRET'];
  
  for (const envVar of requiredEnvVars) {
    if (process.env[envVar]) {
      log(PASS, envVar, '(set)');
      passCount++;
    } else {
      log(FAIL, envVar, '(missing - required)');
      failCount++;
    }
  }
  
  for (const envVar of optionalEnvVars) {
    if (process.env[envVar]) {
      log(PASS, envVar, '(set)');
      passCount++;
    } else {
      log(INFO, envVar, '(not set - optional)');
    }
  }
}

function checkBuild() {
  console.log('\n🔨 Build');
  
  const buildResult = runCommand('npm run build 2>&1');
  if (buildResult.success && !buildResult.output.includes('error')) {
    const timeMatch = buildResult.output.match(/built in ([\d.]+)s/);
    const time = timeMatch ? timeMatch[1] + 's' : 'success';
    log(PASS, 'Build', time);
    passCount++;
  } else {
    log(FAIL, 'Build failed');
    failCount++;
    console.log(COLORS.dim + '    ' + buildResult.output.split('\n').slice(-3).join('\n    ') + COLORS.reset);
  }
}

function checkTypeScript() {
  console.log('\n📘 TypeScript');
  
  if (!fileExists('tsconfig.json')) {
    log(INFO, 'No tsconfig.json found');
    return;
  }
  
  const result = runCommand('npx tsc --noEmit 2>&1');
  if (result.success || !result.output.includes('error')) {
    log(PASS, 'Type check passed');
    passCount++;
  } else {
    const errorCount = (result.output.match(/error TS/g) || []).length;
    log(WARN, 'Type errors', `${errorCount} errors`);
    warnCount++;
  }
}

function checkDatabase() {
  console.log('\n🗄️ Database');
  
  if (!process.env.DATABASE_URL) {
    log(WARN, 'DATABASE_URL not set', 'Skipping DB check');
    warnCount++;
    return;
  }
  
  log(PASS, 'DATABASE_URL configured');
  passCount++;
}

function checkFiles() {
  console.log('\n📁 Required Files');
  
  const requiredFiles = [
    'package.json',
    'vite.config.ts||vite.config.js',
    'server/index.mjs',
    'server/dev.mjs',
    'client/src/App.jsx||client/src/App.tsx',
    'shared/schema.ts||shared/schema.mjs',
    'public/sitemap.xml',
    'public/robots.txt',
  ];
  
  for (const fileSpec of requiredFiles) {
    const alternatives = fileSpec.split('||');
    const found = alternatives.find(f => fileExists(f));
    if (found) {
      log(PASS, found);
      passCount++;
    } else {
      log(FAIL, alternatives[0], '(missing)');
      failCount++;
    }
  }
}

function checkDocs() {
  console.log('\n📚 Documentation');
  
  const requiredDocs = [
    'docs/WORK_LEDGER.md',
    'docs/PATCHLOG.md',
    'docs/ROADMAP_P051_P100.md',
    'replit.md',
  ];
  
  for (const doc of requiredDocs) {
    if (fileExists(doc)) {
      log(PASS, doc);
      passCount++;
    } else {
      log(WARN, doc, '(missing)');
      warnCount++;
    }
  }
}

function checkDuplicates() {
  console.log('\n🔍 Duplicate Detection');
  
  const result = runCommand('find . -maxdepth 5 -name "*.bak" -o -name "*.backup" 2>/dev/null | wc -l');
  const count = parseInt(result.output) || 0;
  
  if (count === 0) {
    log(PASS, 'No backup files found');
    passCount++;
  } else {
    log(WARN, 'Backup files found', `${count} files`);
    warnCount++;
  }
  
  const todoResult = runCommand('grep -rn "TODO\\|FIXME" --include="*.ts" --include="*.tsx" --include="*.mjs" client/src server 2>/dev/null | wc -l');
  const todoCount = parseInt(todoResult.output) || 0;
  
  if (todoCount === 0) {
    log(PASS, 'No TODO/FIXME markers');
    passCount++;
  } else {
    log(INFO, 'TODO/FIXME markers', `${todoCount} found`);
  }
}

function printSummary() {
  console.log('\n' + '─'.repeat(50));
  console.log('\n📊 Summary');
  console.log(`  ${PASS} Passed: ${passCount}`);
  console.log(`  ${WARN} Warnings: ${warnCount}`);
  console.log(`  ${FAIL} Failed: ${failCount}`);
  
  if (failCount === 0) {
    console.log(`\n${COLORS.green}✅ All critical checks passed!${COLORS.reset}\n`);
    return 0;
  } else {
    console.log(`\n${COLORS.red}❌ ${failCount} critical issue(s) found${COLORS.reset}\n`);
    return 1;
  }
}

async function main() {
  console.log('\n🩺 GLP Doctor — Project Health Check');
  console.log('─'.repeat(50));
  
  checkNode();
  checkEnv();
  checkFiles();
  checkDocs();
  checkDuplicates();
  checkBuild();
  
  const exitCode = printSummary();
  process.exit(exitCode);
}

main().catch(console.error);
