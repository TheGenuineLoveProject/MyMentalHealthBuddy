#!/usr/bin/env node

/**
 * Start script for production deployment
 * This script starts the production server
 */

import { spawn } from 'child_process';

console.log('🚀 Starting production server...');

// Set production environment
process.env.NODE_ENV = 'production';

// Start the server
const server = spawn('node', ['dist/index.js'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production'
  }
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`❌ Server exited with code ${code}`);
    process.exit(code);
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Gracefully shutting down...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Gracefully shutting down...');
  server.kill('SIGTERM');
});