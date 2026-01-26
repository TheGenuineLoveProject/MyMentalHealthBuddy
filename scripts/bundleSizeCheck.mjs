#!/usr/bin/env node
/**
 * Bundle Size Check (P144)
 * Warns if bundle sizes exceed thresholds
 */

import fs from 'fs';
import path from 'path';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

// Size thresholds (in KB) - adjusted for GLP's large page count
const THRESHOLDS = {
  warn: {
    singleChunk: 800,    // Any single chunk > 800KB
    totalBundle: 6000,   // Total bundle > 6MB
    mainBundle: 1000,    // Main bundle > 1MB
  },
  fail: {
    singleChunk: 1500,   // Any single chunk > 1.5MB
    totalBundle: 10000,  // Total bundle > 10MB
    mainBundle: 2000,    // Main bundle > 2MB
  }
};

console.log('\n📦 Bundle Size Check');
console.log('─'.repeat(50));

const distDir = path.join(process.cwd(), 'client/dist/assets');

if (!fs.existsSync(distDir)) {
  console.log(`  ${COLORS.yellow}!${COLORS.reset} No dist folder found. Run 'npm run build' first.`);
  process.exit(0);
}

const files = fs.readdirSync(distDir);
const jsFiles = files.filter(f => f.endsWith('.js'));

let totalSize = 0;
let mainBundleSize = 0;
let largestChunk = { name: '', size: 0 };
const warnings = [];
const errors = [];

jsFiles.forEach(file => {
  const filePath = path.join(distDir, file);
  const stats = fs.statSync(filePath);
  const sizeKB = Math.round(stats.size / 1024);
  totalSize += sizeKB;
  
  if (file.includes('index-') || file.includes('main-')) {
    mainBundleSize = sizeKB;
  }
  
  if (sizeKB > largestChunk.size) {
    largestChunk = { name: file, size: sizeKB };
  }
  
  // Check single chunk threshold
  if (sizeKB > THRESHOLDS.fail.singleChunk) {
    errors.push(`${file}: ${sizeKB}KB exceeds ${THRESHOLDS.fail.singleChunk}KB limit`);
  } else if (sizeKB > THRESHOLDS.warn.singleChunk) {
    warnings.push(`${file}: ${sizeKB}KB exceeds ${THRESHOLDS.warn.singleChunk}KB recommendation`);
  }
});

// Check total bundle
if (totalSize > THRESHOLDS.fail.totalBundle) {
  errors.push(`Total bundle: ${totalSize}KB exceeds ${THRESHOLDS.fail.totalBundle}KB limit`);
} else if (totalSize > THRESHOLDS.warn.totalBundle) {
  warnings.push(`Total bundle: ${totalSize}KB exceeds ${THRESHOLDS.warn.totalBundle}KB recommendation`);
}

// Check main bundle
if (mainBundleSize > THRESHOLDS.fail.mainBundle) {
  errors.push(`Main bundle: ${mainBundleSize}KB exceeds ${THRESHOLDS.fail.mainBundle}KB limit`);
} else if (mainBundleSize > THRESHOLDS.warn.mainBundle) {
  warnings.push(`Main bundle: ${mainBundleSize}KB exceeds ${THRESHOLDS.warn.mainBundle}KB recommendation`);
}

// Report
console.log(`  ${COLORS.blue}ℹ${COLORS.reset} Total JS chunks: ${jsFiles.length}`);
console.log(`  ${COLORS.blue}ℹ${COLORS.reset} Total bundle size: ${totalSize}KB (${(totalSize / 1024).toFixed(2)}MB)`);
console.log(`  ${COLORS.blue}ℹ${COLORS.reset} Main bundle size: ${mainBundleSize}KB`);
console.log(`  ${COLORS.blue}ℹ${COLORS.reset} Largest chunk: ${largestChunk.name} (${largestChunk.size}KB)`);
console.log('─'.repeat(50));

if (errors.length > 0) {
  console.log(`\n${COLORS.red}Errors:${COLORS.reset}`);
  errors.forEach(e => console.log(`  ${COLORS.red}✗${COLORS.reset} ${e}`));
}

if (warnings.length > 0) {
  console.log(`\n${COLORS.yellow}Warnings:${COLORS.reset}`);
  warnings.forEach(w => console.log(`  ${COLORS.yellow}!${COLORS.reset} ${w}`));
}

if (errors.length === 0 && warnings.length === 0) {
  console.log(`${COLORS.green}✅ Bundle sizes within acceptable limits${COLORS.reset}\n`);
  process.exit(0);
} else if (errors.length > 0) {
  console.log(`\n${COLORS.red}Bundle size check failed${COLORS.reset}\n`);
  process.exit(1);
} else {
  console.log(`\n${COLORS.yellow}Bundle size check passed with warnings${COLORS.reset}\n`);
  process.exit(0);
}
