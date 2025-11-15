#!/usr/bin/env node

import { existsSync, statSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

const BUILD_REQUIREMENTS = {
  clientDist: 'apps/client/dist',
  serverDist: 'apps/server/dist',
  requiredClientFiles: [
    'index.html',
    'assets'
  ],
  requiredServerFiles: [
    'server/src/index.js'
  ],
  maxBundleSize: 250 * 1024,
  maxChunkSize: 800 * 1024
};

console.log('🔍 Build Verification Started\n');

const results = {
  passed: [],
  failed: [],
  warnings: []
};

function checkDirectory(path, name) {
  const fullPath = join(PROJECT_ROOT, path);
  if (existsSync(fullPath)) {
    results.passed.push(`${name} directory exists`);
    return true;
  } else {
    results.failed.push(`${name} directory missing: ${path}`);
    return false;
  }
}

function checkFile(basePath, file, name) {
  const fullPath = join(PROJECT_ROOT, basePath, file);
  if (existsSync(fullPath)) {
    results.passed.push(`${name} exists`);
    return true;
  } else {
    results.failed.push(`${name} missing: ${file}`);
    return false;
  }
}

function analyzeBundleSize(basePath) {
  const assetsPath = join(PROJECT_ROOT, basePath, 'assets');
  
  if (!existsSync(assetsPath)) {
    results.warnings.push('Assets directory not found for size analysis');
    return;
  }
  
  const files = readdirSync(assetsPath);
  let totalSize = 0;
  let largeChunks = [];
  
  files.forEach(file => {
    const filePath = join(assetsPath, file);
    const stats = statSync(filePath);
    totalSize += stats.size;
    
    if (stats.size > BUILD_REQUIREMENTS.maxChunkSize) {
      largeChunks.push({ file, size: stats.size });
    }
  });
  
  const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
  results.passed.push(`Total bundle size: ${totalMB} MB`);
  
  if (largeChunks.length > 0) {
    largeChunks.forEach(chunk => {
      const sizeMB = (chunk.size / (1024 * 1024)).toFixed(2);
      results.warnings.push(`Large chunk detected: ${chunk.file} (${sizeMB} MB)`);
    });
  }
}

console.log('1️⃣  Checking client build...');
if (checkDirectory(BUILD_REQUIREMENTS.clientDist, 'Client dist')) {
  BUILD_REQUIREMENTS.requiredClientFiles.forEach(file => {
    checkFile(BUILD_REQUIREMENTS.clientDist, file, `Client ${file}`);
  });
  analyzeBundleSize(BUILD_REQUIREMENTS.clientDist);
}

console.log('\n2️⃣  Checking server build...');
if (checkDirectory(BUILD_REQUIREMENTS.serverDist, 'Server dist')) {
  BUILD_REQUIREMENTS.requiredServerFiles.forEach(file => {
    checkFile(BUILD_REQUIREMENTS.serverDist, file, `Server ${file}`);
  });
}

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 Build Verification Summary:\n');

console.log(`✅ Passed: ${results.passed.length}`);
results.passed.forEach(msg => console.log(`   ✓ ${msg}`));

if (results.warnings.length > 0) {
  console.log(`\n⚠️  Warnings: ${results.warnings.length}`);
  results.warnings.forEach(msg => console.log(`   ! ${msg}`));
}

if (results.failed.length > 0) {
  console.log(`\n❌ Failed: ${results.failed.length}`);
  results.failed.forEach(msg => console.log(`   ✗ ${msg}`));
  console.log('\n❌ BUILD VERIFICATION FAILED');
  process.exit(1);
} else if (results.warnings.length > 0) {
  console.log('\n⚠️  Build verification passed with warnings');
  console.log('   Consider optimizing large chunks for better performance');
  process.exit(0);
} else {
  console.log('\n✅ BUILD VERIFICATION PASSED');
  process.exit(0);
}
