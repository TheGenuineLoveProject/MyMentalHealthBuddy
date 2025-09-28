#!/usr/bin/env node

/**
 * Production build script for deployment
 * Transpiles TypeScript without strict type checking
 */

import { execSync } from 'child_process';
import { existsSync, rmSync, mkdirSync, cpSync, writeFileSync } from 'fs';

console.log('🔨 Starting production build...');

try {
  // Clean previous build
  if (existsSync('dist')) {
    console.log('📦 Cleaning previous build...');
    rmSync('dist', { recursive: true, force: true });
  }
  mkdirSync('dist', { recursive: true });

  // Use esbuild to transpile TypeScript to JavaScript
  console.log('🔧 Transpiling TypeScript server with esbuild...');
  execSync('npx esbuild server/index.ts --bundle --platform=node --outfile=dist/index.js --format=esm --packages=external', { stdio: 'inherit' });
  
  // Copy shared files
  console.log('📂 Copying shared files...');
  cpSync('shared', 'dist/shared', { recursive: true });
  
  // Build Vite client - fail hard on error
  console.log('🎨 Building Vite client...');
  
  // Create temporary index.html with correct paths for build
  const tempIndexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MyMentalHealthBuddy</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/client/src/main.tsx"></script>
  </body>
</html>`;
  writeFileSync('index.html', tempIndexHtml);
  
  try {
    execSync('npx vite build --outDir dist/public', { stdio: 'inherit' });
  } catch (e) {
    console.error('❌ Client build failed:', e.message);
    throw new Error('Vite client build is required for deployment');
  } finally {
    // Clean up temporary index.html
    if (existsSync('index.html')) {
      rmSync('index.html');
    }
  }

  // Copy necessary files (exclude .env for security)
  console.log('📋 Copying configuration files...');
  ['package.json', 'tsconfig.json'].forEach(file => {
    if (existsSync(file)) {
      cpSync(file, `dist/${file}`);
    }
  });

  console.log('✅ Production build completed successfully!');
  console.log('📂 Build output in ./dist directory');
  console.log('📄 Start with: NODE_ENV=production node dist/index.js');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}