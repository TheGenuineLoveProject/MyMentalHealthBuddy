#!/usr/bin/env node
/**
 * Smoke Test Script (P163)
 * Verifies critical routes are accessible
 * 
 * Usage: npm run smoke
 */

import http from 'http';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
};

const PASS = `${COLORS.green}✓${COLORS.reset}`;
const FAIL = `${COLORS.red}✗${COLORS.reset}`;

const CRITICAL_ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/crisis', name: 'Crisis (PUBLIC ACCESS)' },
  { path: '/login', name: 'Login' },
  { path: '/api/health', name: 'Health API' },
  { path: '/pricing', name: 'Pricing' },
];

const PORT = process.env.PORT || 5000;
const HOST = 'localhost';

async function checkRoute(route) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: HOST,
      port: PORT,
      path: route.path,
      method: 'GET',
      timeout: 5000,
    }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        console.log(`  ${PASS} ${route.name} (${route.path}) - ${res.statusCode}`);
        resolve(true);
      } else {
        console.log(`  ${FAIL} ${route.name} (${route.path}) - ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', (err) => {
      console.log(`  ${FAIL} ${route.name} (${route.path}) - ${err.code || err.message}`);
      resolve(false);
    });
    
    req.on('timeout', () => {
      req.destroy();
      console.log(`  ${FAIL} ${route.name} (${route.path}) - TIMEOUT`);
      resolve(false);
    });
    
    req.end();
  });
}

async function main() {
  console.log('\n🔥 Smoke Test');
  console.log('─'.repeat(50));
  console.log(`Testing ${CRITICAL_ROUTES.length} critical routes on port ${PORT}\n`);
  
  let passed = 0;
  let failed = 0;
  
  for (const route of CRITICAL_ROUTES) {
    const result = await checkRoute(route);
    if (result) passed++;
    else failed++;
  }
  
  console.log('\n' + '─'.repeat(50));
  console.log(`Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log(`${COLORS.green}✅ All smoke tests passed!${COLORS.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${COLORS.red}❌ ${failed} smoke test(s) failed${COLORS.reset}\n`);
    console.log('Note: Server must be running for smoke tests to pass.');
    process.exit(1);
  }
}

main().catch(console.error);
