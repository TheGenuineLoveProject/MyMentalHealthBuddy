#!/usr/bin/env node
/**
 * Performance Check Script
 * Analyzes bundle size and provides Lighthouse-style recommendations
 */

import { readdir, stat, readFile } from 'fs/promises';
import { join, extname } from 'path';

const COLORS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  error: (msg) => console.log(`${COLORS.red}✗ ${msg}${COLORS.reset}`),
  success: (msg) => console.log(`${COLORS.green}✓ ${msg}${COLORS.reset}`),
  warn: (msg) => console.log(`${COLORS.yellow}⚠ ${msg}${COLORS.reset}`),
  info: (msg) => console.log(`${COLORS.blue}ℹ ${msg}${COLORS.reset}`)
};

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

async function getDirectorySize(dir) {
  let totalSize = 0;
  const files = [];
  
  async function walk(currentDir) {
    try {
      const entries = await readdir(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else {
          const stats = await stat(fullPath);
          totalSize += stats.size;
          files.push({ path: fullPath, size: stats.size });
        }
      }
    } catch {}
  }
  
  await walk(dir);
  return { totalSize, files };
}

async function analyzeBundleSize() {
  console.log('\n📦 Bundle Size Analysis...');
  
  try {
    const distPath = 'client/dist';
    const { totalSize, files } = await getDirectorySize(distPath);
    
    console.log(`Total bundle size: ${formatBytes(totalSize)}`);
    
    const jsFiles = files.filter(f => extname(f.path) === '.js').sort((a, b) => b.size - a.size);
    const cssFiles = files.filter(f => extname(f.path) === '.css');
    
    console.log(`\nLargest JS files:`);
    jsFiles.slice(0, 5).forEach(f => {
      const status = f.size > 500 * 1024 ? '⚠️' : '✓';
      console.log(`  ${status} ${f.path.replace('client/dist/', '')} - ${formatBytes(f.size)}`);
    });
    
    if (cssFiles.length > 0) {
      console.log(`\nCSS files:`);
      cssFiles.forEach(f => {
        console.log(`  ✓ ${f.path.replace('client/dist/', '')} - ${formatBytes(f.size)}`);
      });
    }
    
    if (totalSize > 2 * 1024 * 1024) {
      log.warn('Bundle size exceeds 2MB - consider code splitting');
    } else if (totalSize > 1 * 1024 * 1024) {
      log.warn('Bundle size exceeds 1MB - monitor for growth');
    } else {
      log.success('Bundle size is acceptable');
    }
    
    return totalSize;
  } catch (err) {
    log.info('No dist folder found - run build first');
    return 0;
  }
}

async function analyzeSourceCode() {
  console.log('\n📝 Source Code Analysis...');
  
  const srcPath = 'client/src';
  const { totalSize, files } = await getDirectorySize(srcPath);
  
  console.log(`Total source size: ${formatBytes(totalSize)}`);
  console.log(`Total files: ${files.length}`);
  
  const largeFiles = files.filter(f => f.size > 20 * 1024).sort((a, b) => b.size - a.size);
  if (largeFiles.length > 0) {
    console.log(`\nLarge source files (>20KB):`);
    largeFiles.slice(0, 10).forEach(f => {
      log.warn(`${f.path.replace('client/src/', '')} - ${formatBytes(f.size)}`);
    });
  }
  
  return { totalSize, fileCount: files.length };
}

async function checkPerformanceBestPractices() {
  console.log('\n🏆 Performance Best Practices Checklist...');
  
  const checks = [
    { name: 'Lazy loading routes', pattern: /lazy\s*\(/, file: 'client/src/App.jsx' },
    { name: 'Error boundary', pattern: /ErrorBoundary/, file: 'client/src/App.jsx' },
    { name: 'Compression middleware', pattern: /compression/, file: 'server/dev.mjs' },
    { name: 'Cache headers', pattern: /cache|Cache/, file: 'server/dev.mjs' },
    { name: 'Rate limiting', pattern: /rate.*limit/i, file: 'server/middleware/rateLimit.mjs' }
  ];
  
  let passed = 0;
  
  for (const check of checks) {
    try {
      const content = await readFile(check.file, 'utf-8');
      if (check.pattern.test(content)) {
        log.success(check.name);
        passed++;
      } else {
        log.warn(`${check.name} - not found`);
      }
    } catch {
      log.warn(`${check.name} - file not found`);
    }
  }
  
  return { passed, total: checks.length };
}

async function generateRecommendations(bundleSize, sourceStats, practices) {
  console.log('\n💡 Recommendations...');
  
  if (bundleSize > 1.5 * 1024 * 1024) {
    console.log('  • Consider implementing route-based code splitting');
    console.log('  • Review and tree-shake unused dependencies');
    console.log('  • Use dynamic imports for heavy components');
  }
  
  if (sourceStats.fileCount > 100) {
    console.log('  • Consider consolidating similar components');
    console.log('  • Review folder structure for optimization');
  }
  
  if (practices.passed < practices.total) {
    console.log('  • Implement missing performance best practices');
  }
  
  console.log('  • Enable gzip/brotli compression in production');
  console.log('  • Use CDN for static assets');
  console.log('  • Implement service worker for caching');
}

async function main() {
  console.log('🚀 The Genuine Love Project - Performance Analysis');
  console.log('===================================================');
  
  const bundleSize = await analyzeBundleSize();
  const sourceStats = await analyzeSourceCode();
  const practices = await checkPerformanceBestPractices();
  
  await generateRecommendations(bundleSize, sourceStats, practices);
  
  console.log('\n📊 Performance Summary');
  console.log('======================');
  console.log(`Bundle Size: ${formatBytes(bundleSize)}`);
  console.log(`Source Files: ${sourceStats.fileCount}`);
  console.log(`Best Practices: ${practices.passed}/${practices.total}`);
  
  const score = Math.round(
    (practices.passed / practices.total) * 50 +
    (bundleSize < 1024 * 1024 ? 30 : bundleSize < 2 * 1024 * 1024 ? 15 : 0) +
    (sourceStats.fileCount < 100 ? 20 : 10)
  );
  
  console.log(`\nPerformance Score: ${score}/100`);
  
  if (score >= 80) log.success('Excellent performance!');
  else if (score >= 60) log.info('Good performance, room for improvement');
  else log.warn('Performance needs attention');
}

main().catch(console.error);
