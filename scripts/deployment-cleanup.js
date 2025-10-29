#!/usr/bin/env node

/**
 * Deployment Bundle Cleanup Script
 * Removes unnecessary files after build to reduce deployment size
 * Run automatically with `postbuild` script
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('\n🧹 Starting deployment bundle cleanup...\n');

const cleanupTasks = [
  {
    name: 'Remove source maps from dist',
    patterns: [
      'apps/client/dist/**/*.map',
      'apps/server/dist/**/*.map',
      'dist/**/*.map'
    ]
  },
  {
    name: 'Remove TypeScript definition maps',
    patterns: [
      'apps/client/dist/**/*.d.ts.map',
      'apps/server/dist/**/*.d.ts.map'
    ]
  },
  {
    name: 'Remove build artifacts',
    patterns: [
      'apps/client/.vite',
      'apps/server/.vite',
      'build-report.json',
      'stats.html'
    ]
  }
];

async function removeFile(filePath) {
  try {
    const stats = await fs.stat(filePath);
    
    if (stats.isDirectory()) {
      await fs.rm(filePath, { recursive: true, force: true });
      return { removed: true, type: 'directory', size: 0 };
    } else {
      const size = stats.size;
      await fs.unlink(filePath);
      return { removed: true, type: 'file', size };
    }
  } catch (error) {
    return { removed: false, error: error.message };
  }
}

async function cleanup() {
  let totalRemoved = 0;
  let totalSize = 0;

  for (const task of cleanupTasks) {
    console.log(`📋 ${task.name}...`);
    
    for (const pattern of task.patterns) {
      // Check if pattern contains wildcards
      if (pattern.includes('*')) {
        // Use glob to find matching files
        try {
          const matches = await glob(pattern, {
            cwd: rootDir,
            absolute: false,
            nodir: false,
            dot: false
          });
          
          if (matches.length === 0) {
            continue;
          }

          for (const match of matches) {
            const fullPath = join(rootDir, match);
            const result = await removeFile(fullPath);
            
            if (result.removed) {
              console.log(`   ✅ Removed ${result.type}: ${match}`);
              totalRemoved++;
              totalSize += result.size;
            } else if (result.error) {
              console.log(`   ⚠️  Error removing ${match}: ${result.error}`);
            }
          }
        } catch (error) {
          console.log(`   ⚠️  Error processing pattern ${pattern}: ${error.message}`);
        }
      } else {
        // Direct path without wildcards
        const fullPath = join(rootDir, pattern);
        
        try {
          await fs.access(fullPath);
          const result = await removeFile(fullPath);
          
          if (result.removed) {
            console.log(`   ✅ Removed ${result.type}: ${pattern}`);
            totalRemoved++;
            totalSize += result.size;
          }
        } catch {
          // File doesn't exist, skip silently
        }
      }
    }
  }

  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  
  console.log('\n📊 Cleanup Summary:');
  console.log(`   • Files/directories removed: ${totalRemoved}`);
  console.log(`   • Space saved: ${totalSizeMB} MB`);
  console.log('   • Source maps, build artifacts removed');
  console.log('\n✅ Deployment bundle optimized for minimal size!');
  console.log('\n💡 Tip: Use `npm run deploy:clean` to run this cleanup manually\n');
}

// Run cleanup
cleanup().catch(error => {
  console.error('\n❌ Cleanup failed:', error);
  process.exit(1);
});
