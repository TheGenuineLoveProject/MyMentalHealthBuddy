#!/usr/bin/env node

/**
 * Build script for deployment
 * This script builds both the TypeScript server and Vite client
 */

import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs';

console.log('🔨 Starting build process...');

try {
  // Clean previous build
  if (existsSync('dist')) {
    console.log('📦 Cleaning previous build...');
    rmSync('dist', { recursive: true, force: true });
  }

  // Build TypeScript server
  console.log('🔧 Building TypeScript server...');
  execSync('npx tsc', { stdio: 'inherit' });

  // Build Vite client
  console.log('🎨 Building Vite client...');
  execSync('npx vite build', { stdio: 'inherit' });

  console.log('✅ Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}