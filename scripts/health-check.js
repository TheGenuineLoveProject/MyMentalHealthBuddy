#!/usr/bin/env node

/**
 * Health Check Script for MyMentalHealthBuddy
 * Validates both backend and frontend are running correctly
 */

import http from 'http';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

async function checkEndpoint(host, port, path, name) {
  return new Promise((resolve) => {
    const options = {
      hostname: host,
      port: port,
      path: path,
      method: 'GET',
      timeout: 5000
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 200) {
        console.log(`${COLORS.green}✅ ${name} is running (port ${port})${COLORS.reset}`);
        resolve(true);
      } else {
        console.log(`${COLORS.yellow}⚠️  ${name} responded with status ${res.statusCode}${COLORS.reset}`);
        resolve(false);
      }
    });

    req.on('error', (err) => {
      console.log(`${COLORS.red}❌ ${name} is not responding (port ${port}): ${err.message}${COLORS.reset}`);
      resolve(false);
    });

    req.on('timeout', () => {
      console.log(`${COLORS.red}❌ ${name} health check timed out (port ${port})${COLORS.reset}`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function runHealthChecks() {
  console.log(`${COLORS.blue}🏥 Running Health Checks...${COLORS.reset}\n`);
  
  const backendHealthy = await checkEndpoint('localhost', 3001, '/health', 'Backend API');
  const frontendHealthy = await checkEndpoint('localhost', 5000, '/', 'Frontend Server');
  
  console.log('');
  
  if (backendHealthy && frontendHealthy) {
    console.log(`${COLORS.green}🎉 All systems are GO! Your application is running perfectly.${COLORS.reset}`);
    console.log(`${COLORS.blue}📍 Frontend: http://localhost:5000${COLORS.reset}`);
    console.log(`${COLORS.blue}📍 Backend:  http://localhost:3001${COLORS.reset}`);
    process.exit(0);
  } else {
    console.log(`${COLORS.red}⚠️  Some services are not responding. Please check the logs.${COLORS.reset}`);
    process.exit(1);
  }
}

runHealthChecks();
