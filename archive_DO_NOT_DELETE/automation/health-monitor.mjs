#!/usr/bin/env node
/**
 * Health Monitor - 360° Platform Automation
 * Monitors server health and automatically restarts on failures
 */

import http from 'http';
import { spawn } from 'child_process';

const PORT = 5000;
const CHECK_INTERVAL = 30000; // 30 seconds
const RESTART_DELAY = 5000; // 5 seconds

let serverProcess = null;
let isRestarting = false;

function log(message, type = 'INFO') {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${type}] ${message}`);
}

function checkHealth() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${PORT}/api/health`, (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });

    req.on('error', () => {
      resolve(false);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function startServer() {
  log('Starting server...', 'START');
  
  serverProcess = spawn('npm', ['--prefix', 'apps/server', 'run', 'dev'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      SERVER_PORT: PORT.toString(),
      PORT: PORT.toString()
    }
  });

  serverProcess.on('exit', (code) => {
    log(`Server exited with code ${code}`, 'EXIT');
    if (!isRestarting) {
      log('Unexpected exit - scheduling restart...', 'WARN');
      setTimeout(restartServer, RESTART_DELAY);
    }
  });
}

async function restartServer() {
  if (isRestarting) {
    return;
  }

  isRestarting = true;
  log('Restarting server...', 'RESTART');

  if (serverProcess) {
    serverProcess.kill('SIGTERM');
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  startServer();
  await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for startup
  isRestarting = false;
}

async function monitorLoop() {
  const isHealthy = await checkHealth();
  
  if (!isHealthy) {
    log('Health check failed - server unhealthy', 'ERROR');
    await restartServer();
  } else {
    log('Health check passed ✓', 'HEALTH');
  }
}

// Start server
startServer();

// Wait for initial startup
setTimeout(() => {
  log('Starting health monitoring...', 'INIT');
  setInterval(monitorLoop, CHECK_INTERVAL);
}, 15000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('Shutting down health monitor...', 'SHUTDOWN');
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Shutting down health monitor...', 'SHUTDOWN');
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
  process.exit(0);
});
