#!/usr/bin/env node
/**
 * Endpoint Contract Sanity Tests (P162)
 * Verifies API endpoints return expected status codes and JSON shapes
 * 
 * Usage: npm run test:contracts
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

const PORT = process.env.PORT || 5000;

const CONTRACTS = [
  { 
    path: '/api/health', 
    method: 'GET',
    expectedStatus: 200,
    expectedShape: ['status']
  },
  {
    path: '/api/version',
    method: 'GET', 
    expectedStatus: 200,
    expectedShape: ['version'],
    optional: true
  },
];

async function testEndpoint(contract) {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: contract.path,
      method: contract.method,
      timeout: 5000,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const result = {
          path: contract.path,
          passed: true,
          statusMatch: res.statusCode === contract.expectedStatus,
          actualStatus: res.statusCode,
          expectedStatus: contract.expectedStatus,
        };
        
        if (result.statusMatch && contract.expectedShape) {
          try {
            const json = JSON.parse(data);
            const missingKeys = contract.expectedShape.filter(k => !(k in json));
            result.shapeMatch = missingKeys.length === 0;
            result.missingKeys = missingKeys;
          } catch {
            result.shapeMatch = false;
            result.parseError = true;
          }
        }
        
        result.passed = result.statusMatch && (result.shapeMatch !== false);
        resolve(result);
      });
    });
    
    req.on('error', (err) => {
      resolve({
        path: contract.path,
        passed: contract.optional === true,
        error: err.code || err.message,
        optional: contract.optional,
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        path: contract.path,
        passed: false,
        error: 'TIMEOUT',
      });
    });
    
    req.end();
  });
}

async function main() {
  console.log('\n📋 Endpoint Contract Tests');
  console.log('─'.repeat(50));
  console.log(`Testing ${CONTRACTS.length} API contracts on port ${PORT}\n`);
  
  let passed = 0;
  let failed = 0;
  
  for (const contract of CONTRACTS) {
    const result = await testEndpoint(contract);
    
    if (result.passed) {
      console.log(`  ${PASS} ${contract.method} ${contract.path}`);
      if (result.actualStatus) {
        console.log(`     Status: ${result.actualStatus}, Shape: OK`);
      }
      passed++;
    } else if (result.optional && result.error) {
      console.log(`  ${COLORS.yellow}○${COLORS.reset} ${contract.method} ${contract.path} (optional, skipped)`);
    } else {
      console.log(`  ${FAIL} ${contract.method} ${contract.path}`);
      if (result.error) {
        console.log(`     Error: ${result.error}`);
      } else {
        console.log(`     Expected: ${result.expectedStatus}, Got: ${result.actualStatus}`);
        if (result.missingKeys?.length > 0) {
          console.log(`     Missing keys: ${result.missingKeys.join(', ')}`);
        }
      }
      failed++;
    }
  }
  
  console.log('\n' + '─'.repeat(50));
  console.log(`Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log(`${COLORS.green}✅ All contract tests passed!${COLORS.reset}\n`);
  } else {
    console.log(`${COLORS.yellow}Note: Server must be running for contract tests${COLORS.reset}\n`);
  }
}

main().catch(console.error);
