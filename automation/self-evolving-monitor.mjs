#!/usr/bin/env node
/**
 * Self-Evolving Platform Monitor - 888...^ Perfection
 * Intelligent automation with adaptive health monitoring, performance optimization,
 * and self-healing capabilities for continuous platform excellence
 */

import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const CONFIG = {
  port: 5000,
  healthCheckInterval: 30000, // 30 seconds
  performanceCheckInterval: 60000, // 1 minute
  restartDelay: 5000,
  maxConsecutiveFailures: 3,
  healthEndpoint: '/api/health',
  readinessEndpoint: '/api/health/ready',
  performanceEndpoint: '/api/performance',
  logRetentionDays: 7
};

class PlatformMonitor {
  constructor() {
    this.serverProcess = null;
    this.isRestarting = false;
    this.consecutiveFailures = 0;
    this.metrics = {
      uptime: 0,
      restarts: 0,
      lastHealthCheck: null,
      performanceScore: 100
    };
    this.startTime = Date.now();
  }

  log(message, type = 'INFO', data = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      type,
      message,
      ...data
    };
    console.log(`[${timestamp}] [${type}] ${message}`);
    if (Object.keys(data).length > 0) {
      console.log(JSON.stringify(data, null, 2));
    }
  }

  async checkHealth() {
    return new Promise((resolve) => {
      const req = http.get(`http://localhost:${CONFIG.port}${CONFIG.healthEndpoint}`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const health = JSON.parse(data);
              resolve({ healthy: true, data: health });
            } catch {
              resolve({ healthy: true, data: null });
            }
          } else {
            resolve({ healthy: false, statusCode: res.statusCode });
          }
        });
      });

      req.on('error', (error) => {
        resolve({ healthy: false, error: error.message });
      });

      req.setTimeout(5000, () => {
        req.destroy();
        resolve({ healthy: false, error: 'Timeout' });
      });
    });
  }

  async checkReadiness() {
    return new Promise((resolve) => {
      const req = http.get(`http://localhost:${CONFIG.port}${CONFIG.readinessEndpoint}`, (res) => {
        resolve({ ready: res.statusCode === 200, statusCode: res.statusCode });
      });

      req.on('error', () => resolve({ ready: false }));
      req.setTimeout(3000, () => {
        req.destroy();
        resolve({ ready: false });
      });
    });
  }

  async startServer() {
    this.log('Starting MyMentalHealthBuddy server...', 'START');
    
    this.serverProcess = spawn('npm', ['--prefix', 'apps/server', 'run', 'dev'], {
      cwd: process.cwd(),
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        SERVER_PORT: CONFIG.port.toString(),
        PORT: CONFIG.port.toString(),
        NODE_ENV: process.env.NODE_ENV || 'development'
      }
    });

    this.serverProcess.on('exit', (code) => {
      this.log('Server process exited', 'EXIT', { exitCode: code });
      if (!this.isRestarting) {
        this.log('Unexpected exit detected - initiating automatic restart', 'WARN');
        setTimeout(() => this.restartServer(), CONFIG.restartDelay);
      }
    });

    this.serverProcess.on('error', (error) => {
      this.log('Server process error', 'ERROR', { error: error.message });
    });
  }

  async restartServer() {
    if (this.isRestarting) {
      this.log('Restart already in progress, skipping', 'WARN');
      return;
    }

    this.isRestarting = true;
    this.metrics.restarts++;
    this.log('Initiating server restart...', 'RESTART', { 
      restartCount: this.metrics.restarts,
      reason: 'Health check failure or unexpected exit'
    });

    if (this.serverProcess) {
      this.serverProcess.kill('SIGTERM');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    await this.startServer();
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for startup
    
    // Verify restart was successful
    const health = await this.checkHealth();
    if (health.healthy) {
      this.consecutiveFailures = 0;
      this.log('Server restart successful', 'SUCCESS');
    } else {
      this.log('Server restart failed verification', 'ERROR');
    }
    
    this.isRestarting = false;
  }

  async performHealthCheck() {
    const health = await this.checkHealth();
    this.metrics.lastHealthCheck = new Date().toISOString();
    
    if (!health.healthy) {
      this.consecutiveFailures++;
      this.log('Health check FAILED', 'ERROR', {
        consecutiveFailures: this.consecutiveFailures,
        maxAllowed: CONFIG.maxConsecutiveFailures,
        details: health
      });

      if (this.consecutiveFailures >= CONFIG.maxConsecutiveFailures) {
        this.log('Max consecutive failures reached - triggering restart', 'CRITICAL');
        await this.restartServer();
      }
    } else {
      if (this.consecutiveFailures > 0) {
        this.log('Health check RECOVERED', 'SUCCESS', {
          previousFailures: this.consecutiveFailures
        });
      }
      this.consecutiveFailures = 0;
      
      // Calculate performance score based on health data
      if (health.data?.checks) {
        const checks = health.data.checks;
        const passedChecks = Object.values(checks).filter(c => c.status === 'pass').length;
        const totalChecks = Object.keys(checks).length;
        this.metrics.performanceScore = Math.round((passedChecks / totalChecks) * 100);
      }
      
      this.log('Health check PASSED', 'HEALTH', {
        performanceScore: this.metrics.performanceScore,
        uptime: this.getUptime()
      });
    }
  }

  getUptime() {
    const uptimeMs = Date.now() - this.startTime;
    const hours = Math.floor(uptimeMs / 3600000);
    const minutes = Math.floor((uptimeMs % 3600000) / 60000);
    const seconds = Math.floor((uptimeMs % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  async performanceMonitor() {
    const readiness = await this.checkReadiness();
    this.log('Performance check', 'PERF', {
      ready: readiness.ready,
      uptime: this.getUptime(),
      restarts: this.metrics.restarts,
      performanceScore: this.metrics.performanceScore
    });
  }

  start() {
    this.log('🚀 Self-Evolving Platform Monitor initialized', 'INIT', {
      port: CONFIG.port,
      healthCheckInterval: `${CONFIG.healthCheckInterval/1000}s`,
      performanceCheckInterval: `${CONFIG.performanceCheckInterval/1000}s`,
      maxConsecutiveFailures: CONFIG.maxConsecutiveFailures
    });

    // Start server
    this.startServer();

    // Wait for initial startup, then begin monitoring
    setTimeout(() => {
      this.log('Activating continuous health monitoring...', 'MONITOR');
      
      // Health monitoring loop
      setInterval(() => this.performHealthCheck(), CONFIG.healthCheckInterval);
      
      // Performance monitoring loop
      setInterval(() => this.performanceMonitor(), CONFIG.performanceCheckInterval);
      
      // Initial checks
      this.performHealthCheck();
      this.performanceMonitor();
    }, 15000);
  }

  async shutdown() {
    this.log('Shutting down self-evolving platform monitor...', 'SHUTDOWN', {
      totalUptime: this.getUptime(),
      totalRestarts: this.metrics.restarts,
      finalPerformanceScore: this.metrics.performanceScore
    });
    
    if (this.serverProcess) {
      this.serverProcess.kill('SIGTERM');
    }
    
    process.exit(0);
  }
}

// Initialize and start monitor
const monitor = new PlatformMonitor();
monitor.start();

// Graceful shutdown handlers
process.on('SIGINT', () => monitor.shutdown());
process.on('SIGTERM', () => monitor.shutdown());
