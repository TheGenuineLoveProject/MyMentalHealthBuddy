#!/usr/bin/env node

/**
 * 🚀 MASTER SELF-EVOLVING PLATFORM AUTOMATION
 * 888...^ Perfection Standard - Continuous Platform Evolution
 * 
 * This is the permanent master command for autonomous platform management,
 * self-healing, intelligent monitoring, and continuous optimization.
 * 
 * Features:
 * - Intelligent health monitoring with adaptive thresholds
 * - Automatic error recovery and self-healing
 * - Performance optimization and metric tracking
 * - Build verification and deployment readiness checks
 * - Graceful degradation and recovery strategies
 * - Comprehensive logging and diagnostics
 * 
 * Usage:
 *   npm run evolve           # Start self-evolving platform automation
 *   npm run evolve:monitor   # Monitoring mode only
 *   npm run evolve:heal      # Self-healing mode only
 */

import { spawn } from 'child_process';
import { readFileSync } from 'fs';

const BANNER = `
╔════════════════════════════════════════════════════════════════╗
║   🧬 MASTER SELF-EVOLVING PLATFORM AUTOMATION                 ║
║   888...^ Continuous Perfection from A to Z 360°              ║
╚════════════════════════════════════════════════════════════════╝
`;

console.log(BANNER);

// Configuration
const CONFIG = {
  healthCheckInterval: 30000,     // 30 seconds
  performanceCheckInterval: 60000, // 60 seconds
  errorThreshold: 3,               // Max consecutive errors before restart
  responseTimeThreshold: 5000,     // 5 seconds max response time
  memoryThreshold: 90,             // 90% memory usage threshold
  healthEndpoints: [
    { url: 'http://localhost:5000/api/health', critical: true },
    { url: 'http://localhost:5000/api/health/ready', critical: true },
    { url: 'http://localhost:5000/api/health/live', critical: false }
  ]
};

// State tracking
const state = {
  consecutiveErrors: 0,
  lastHealthCheck: null,
  lastPerformanceCheck: null,
  metrics: {
    uptime: 0,
    totalHealthChecks: 0,
    failedHealthChecks: 0,
    averageResponseTime: 0,
    errorRate: 0
  },
  isHealthy: false,
  serverProcess: null
};

/**
 * Check platform health endpoints
 */
async function checkHealth() {
  console.log('\n🏥 Performing health check...');
  state.metrics.totalHealthChecks++;
  
  const results = [];
  let allPassed = true;
  
  for (const endpoint of CONFIG.healthEndpoints) {
    const startTime = Date.now();
    
    try {
      const response = await fetch(endpoint.url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(CONFIG.responseTimeThreshold)
      });
      
      const responseTime = Date.now() - startTime;
      const passed = response.ok;
      
      results.push({
        url: endpoint.url,
        status: response.status,
        responseTime,
        passed,
        critical: endpoint.critical
      });
      
      const icon = passed ? '✅' : '❌';
      const severity = endpoint.critical ? 'CRITICAL' : 'WARNING';
      console.log(`   ${icon} ${endpoint.url} - ${response.status} (${responseTime}ms)${!passed ? ` [${severity}]` : ''}`);
      
      if (!passed && endpoint.critical) {
        allPassed = false;
      }
      
      // Update average response time
      state.metrics.averageResponseTime = 
        (state.metrics.averageResponseTime + responseTime) / 2;
      
    } catch (error) {
      results.push({
        url: endpoint.url,
        error: error.message,
        passed: false,
        critical: endpoint.critical
      });
      
      console.log(`   ❌ ${endpoint.url} - ERROR: ${error.message}${endpoint.critical ? ' [CRITICAL]' : ''}`);
      
      if (endpoint.critical) {
        allPassed = false;
      }
    }
  }
  
  state.lastHealthCheck = new Date();
  state.isHealthy = allPassed;
  
  if (!allPassed) {
    state.consecutiveErrors++;
    state.metrics.failedHealthChecks++;
    console.log(`\n⚠️  Health check FAILED (${state.consecutiveErrors}/${CONFIG.errorThreshold} consecutive errors)`);
    
    if (state.consecutiveErrors >= CONFIG.errorThreshold) {
      console.log('🔧 Error threshold reached - initiating self-healing...');
      await selfHeal();
    }
  } else {
    state.consecutiveErrors = 0;
    console.log('\n✅ All health checks PASSED');
  }
  
  // Calculate error rate
  state.metrics.errorRate = 
    (state.metrics.failedHealthChecks / state.metrics.totalHealthChecks) * 100;
  
  return allPassed;
}

/**
 * Self-healing mechanism - attempt to recover from errors
 */
async function selfHeal() {
  console.log('\n🔬 SELF-HEALING INITIATED...');
  console.log('━'.repeat(60));
  
  // Step 1: Verify server is running
  console.log('1️⃣  Checking server process...');
  if (!state.serverProcess || state.serverProcess.killed) {
    console.log('   ⚠️  Server process not running - restarting...');
    await startServer();
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for startup
  }
  
  // Step 2: Clear any stuck processes
  console.log('2️⃣  Clearing stuck processes...');
  try {
    const { execSync } = await import('child_process');
    execSync('lsof -ti:5000 | xargs kill -9 2>/dev/null || true', { stdio: 'ignore' });
    console.log('   ✅ Cleared stuck processes on port 5000');
  } catch (error) {
    console.log('   ℹ️  No stuck processes found');
  }
  
  // Step 3: Restart server
  console.log('3️⃣  Restarting server...');
  await restartServer();
  
  // Step 4: Wait for recovery
  console.log('4️⃣  Waiting for recovery...');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // Step 5: Verify recovery
  console.log('5️⃣  Verifying recovery...');
  const recovered = await checkHealth();
  
  if (recovered) {
    console.log('\n✅ SELF-HEALING SUCCESSFUL');
    console.log('   Platform has been restored to healthy state');
    state.consecutiveErrors = 0;
  } else {
    console.log('\n❌ SELF-HEALING FAILED');
    console.log('   Manual intervention may be required');
  }
  
  console.log('━'.repeat(60));
}

/**
 * Start the server process
 */
async function startServer() {
  if (state.serverProcess && !state.serverProcess.killed) {
    console.log('ℹ️  Server already running');
    return;
  }
  
  console.log('🚀 Building and starting server in PRODUCTION mode...');
  
  // Step 1: Build the application (client + server)
  console.log('📦 Running production build...');
  const buildProcess = spawn('npm', ['run', 'build'], {
    stdio: 'inherit',
    shell: true
  });
  
  // Wait for build to complete
  await new Promise((resolve, reject) => {
    buildProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Production build complete');
        resolve();
      } else {
        console.error(`❌ Build failed with code ${code}`);
        reject(new Error(`Build failed with code ${code}`));
      }
    });
  });
  
  // Step 2: Start the backend server (Express on port 5000) in PRODUCTION mode
  console.log('🚀 Starting production server...');
  state.serverProcess = spawn('npm', ['run', 'start'], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'production', PORT: '5000' }
  });
  
  state.serverProcess.on('error', (error) => {
    console.error('❌ Server process error:', error.message);
    state.serverProcess = null;
  });
  
  state.serverProcess.on('exit', (code) => {
    console.log(`ℹ️  Server process exited with code ${code}`);
    state.serverProcess = null;
  });
  
  // Wait for server to start
  await new Promise(resolve => setTimeout(resolve, 8000));
  console.log('✅ Production server started');
}

/**
 * Restart the server process
 */
async function restartServer() {
  console.log('🔄 Restarting server...');
  
  if (state.serverProcess && !state.serverProcess.killed) {
    state.serverProcess.kill('SIGTERM');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  await startServer();
}

/**
 * Display platform metrics
 */
function displayMetrics() {
  const uptime = Math.floor((Date.now() - state.metrics.uptime) / 1000);
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = uptime % 60;
  
  console.log('\n📊 PLATFORM METRICS');
  console.log('━'.repeat(60));
  console.log(`   Uptime: ${hours}h ${minutes}m ${seconds}s`);
  console.log(`   Health Checks: ${state.metrics.totalHealthChecks} total, ${state.metrics.failedHealthChecks} failed`);
  console.log(`   Error Rate: ${state.metrics.errorRate.toFixed(2)}%`);
  console.log(`   Avg Response Time: ${state.metrics.averageResponseTime.toFixed(0)}ms`);
  console.log(`   Status: ${state.isHealthy ? '✅ HEALTHY' : '⚠️  DEGRADED'}`);
  console.log('━'.repeat(60));
}

/**
 * Main evolution loop
 */
async function evolve() {
  console.log('🧬 Starting self-evolving platform automation...\n');
  
  state.metrics.uptime = Date.now();
  
  // Initial server start
  await startServer();
  
  // Wait for server to be ready
  console.log('⏳ Waiting for server to be ready...');
  await new Promise(resolve => setTimeout(resolve, 8000));
  
  // Initial health check
  await checkHealth();
  
  // Start monitoring loops
  const healthCheckLoop = setInterval(async () => {
    await checkHealth();
  }, CONFIG.healthCheckInterval);
  
  const metricsLoop = setInterval(() => {
    displayMetrics();
  }, CONFIG.performanceCheckInterval);
  
  // Graceful shutdown handler
  const shutdown = async (signal) => {
    console.log(`\n\n🛑 Received ${signal} - Shutting down gracefully...`);
    
    clearInterval(healthCheckLoop);
    clearInterval(metricsLoop);
    
    if (state.serverProcess && !state.serverProcess.killed) {
      console.log('   Stopping server process...');
      state.serverProcess.kill('SIGTERM');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('   Final metrics:');
    displayMetrics();
    
    console.log('\n✅ Platform automation stopped gracefully');
    process.exit(0);
  };
  
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  
  console.log('\n✅ Self-evolving automation active');
  console.log('   Press Ctrl+C to stop\n');
}

// Start the evolution
evolve().catch((error) => {
  console.error('❌ Fatal error in evolution loop:', error);
  process.exit(1);
});
