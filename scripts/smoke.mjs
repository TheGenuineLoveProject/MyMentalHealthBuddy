#!/usr/bin/env node
/**
 * Smoke Test Script
 * Verifies critical endpoints are responding correctly
 */

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

const BASE_URL = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:5000';

const ENDPOINTS = [
  { path: '/', method: 'GET', expectedStatus: 200, name: 'Root', acceptHtml: true },
  { path: '/healthz', method: 'GET', expectedStatus: 200, name: 'Health Check' },
  { path: '/api/health-check', method: 'GET', expectedStatus: 200, name: 'API Health' },
  { path: '/api/insights/daily', method: 'GET', expectedStatus: [200, 401], name: 'Daily Insights' },
  { path: '/api/states', method: 'GET', expectedStatus: [200, 401], name: 'States API' },
  { path: '/api/health', method: 'GET', expectedStatus: [200, 401], name: 'Health API' }
];

async function testEndpoint(endpoint) {
  const url = `${BASE_URL}${endpoint.path}`;
  const start = Date.now();
  
  try {
    const response = await fetch(url, {
      method: endpoint.method,
      headers: { 'Accept': endpoint.acceptHtml ? 'text/html' : 'application/json' }
    });
    
    const duration = Date.now() - start;
    const expectedStatuses = Array.isArray(endpoint.expectedStatus) 
      ? endpoint.expectedStatus 
      : [endpoint.expectedStatus];
    
    if (expectedStatuses.includes(response.status)) {
      log.success(`${endpoint.name} (${endpoint.path}) - ${response.status} [${duration}ms]`);
      return { passed: true, duration };
    } else {
      log.error(`${endpoint.name} (${endpoint.path}) - Expected ${expectedStatuses.join('/')}, got ${response.status}`);
      return { passed: false, duration };
    }
  } catch (err) {
    log.error(`${endpoint.name} (${endpoint.path}) - Failed: ${err.message}`);
    return { passed: false, duration: 0 };
  }
}

async function testMirrorAPI() {
  console.log('\n🪞 Mirror API Test...');
  const url = `${BASE_URL}/api/mirror`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: 'I want to feel calmer and trust myself again.', 
        enableAI: false 
      })
    });
    
    if (response.ok || response.status === 401) {
      log.success(`Mirror POST - ${response.status}`);
      return true;
    } else {
      log.error(`Mirror POST - Unexpected status: ${response.status}`);
      return false;
    }
  } catch (err) {
    log.error(`Mirror POST - Failed: ${err.message}`);
    return false;
  }
}

async function testResponseTime() {
  console.log('\n⏱️  Response Time Test...');
  const url = `${BASE_URL}/`;
  const times = [];
  
  for (let i = 0; i < 5; i++) {
    const start = Date.now();
    try {
      await fetch(url);
      times.push(Date.now() - start);
    } catch {}
  }
  
  if (times.length > 0) {
    const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
    const max = Math.max(...times);
    const min = Math.min(...times);
    
    log.info(`Average: ${avg}ms, Min: ${min}ms, Max: ${max}ms`);
    
    if (avg > 500) {
      log.warn('Response time is slow (>500ms average)');
      return false;
    }
    log.success('Response times are acceptable');
    return true;
  }
  
  log.error('Could not measure response times');
  return false;
}

async function main() {
  console.log('🔥 The Genuine Love Project - Smoke Tests');
  console.log('==========================================');
  console.log(`Testing: ${BASE_URL}\n`);
  
  let passed = 0;
  let failed = 0;
  
  console.log('📡 Endpoint Tests...');
  for (const endpoint of ENDPOINTS) {
    const result = await testEndpoint(endpoint);
    if (result.passed) passed++;
    else failed++;
  }
  
  const mirrorOk = await testMirrorAPI();
  if (mirrorOk) passed++;
  else failed++;
  
  const responseTimeOk = await testResponseTime();
  
  console.log('\n📊 Smoke Test Summary');
  console.log('=====================');
  console.log(`Passed: ${passed}/${ENDPOINTS.length + 1}`);
  console.log(`Failed: ${failed}/${ENDPOINTS.length + 1}`);
  console.log(`Response Time: ${responseTimeOk ? 'OK' : 'SLOW'}`);
  
  const exitCode = failed > 0 ? 1 : 0;
  console.log(`\n${exitCode === 0 ? '✅ All smoke tests passed!' : '❌ Some tests failed'}`);
  process.exit(exitCode);
}

main().catch(console.error);
