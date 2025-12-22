#!/usr/bin/env node

import http from 'http';

// Always check port 5000 where the Express server runs
// Vite is middleware on this port, not standalone
const PORT = 5000;
const TIMEOUT = 5000;

const HEALTH_ENDPOINTS = [
  { path: '/api/health', name: 'Health Check', required: true },
  { path: '/api/health/ready', name: 'Readiness Check', required: true },
  { path: '/api/health/live', name: 'Liveness Check', required: false }
];

console.log('🏥 Health Verification Started\n');
console.log(`Checking endpoints on http://localhost:${PORT}\n`);

async function checkEndpoint(endpoint) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const req = http.get(`http://localhost:${PORT}${endpoint.path}`, (res) => {
      const duration = Date.now() - startTime;
      let data = '';
      
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const success = res.statusCode === 200;
        resolve({
          name: endpoint.name,
          path: endpoint.path,
          status: res.statusCode,
          duration,
          success,
          required: endpoint.required,
          data: data ? JSON.parse(data) : null
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        name: endpoint.name,
        path: endpoint.path,
        status: 0,
        duration: Date.now() - startTime,
        success: false,
        required: endpoint.required,
        error: error.message
      });
    });
    
    req.setTimeout(TIMEOUT, () => {
      req.destroy();
      resolve({
        name: endpoint.name,
        path: endpoint.path,
        status: 0,
        duration: TIMEOUT,
        success: false,
        required: endpoint.required,
        error: 'Timeout'
      });
    });
  });
}

async function runHealthChecks() {
  const results = [];
  
  for (const endpoint of HEALTH_ENDPOINTS) {
    const result = await checkEndpoint(endpoint);
    results.push(result);
    
    const icon = result.success ? '✅' : (result.required ? '❌' : '⚠️');
    console.log(`${icon} ${result.name} (${result.path})`);
    console.log(`   Status: ${result.status || 'ERROR'}`);
    console.log(`   Duration: ${result.duration}ms`);
    
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    } else if (result.data?.status) {
      console.log(`   Response: ${JSON.stringify(result.data.status)}`);
    }
    console.log('');
  }
  
  const requiredFailed = results.filter(r => r.required && !r.success);
  const optionalFailed = results.filter(r => !r.required && !r.success);
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Health Verification Summary:');
  console.log(`   Total Checks: ${results.length}`);
  console.log(`   Passed: ${results.filter(r => r.success).length}`);
  console.log(`   Failed (Required): ${requiredFailed.length}`);
  console.log(`   Failed (Optional): ${optionalFailed.length}`);
  
  if (requiredFailed.length > 0) {
    console.log('\n❌ HEALTH CHECK FAILED - Required endpoints not responding');
    console.log('   Failed endpoints:', requiredFailed.map(r => r.path).join(', '));
    process.exit(1);
  } else if (optionalFailed.length > 0) {
    console.log('\n⚠️  Health check passed with warnings');
    console.log('   Optional endpoints failed:', optionalFailed.map(r => r.path).join(', '));
    process.exit(0);
  } else {
    console.log('\n✅ ALL HEALTH CHECKS PASSED');
    process.exit(0);
  }
}

runHealthChecks().catch((error) => {
  console.error('\n❌ Health verification failed:', error.message);
  process.exit(1);
});
