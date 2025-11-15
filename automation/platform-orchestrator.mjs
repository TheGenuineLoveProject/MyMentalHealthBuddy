#!/usr/bin/env node

import { spawn } from 'child_process';
import { createInterface } from 'readline';

const VERSION = '1.0.0';
const BANNER = `
╔════════════════════════════════════════════════════════════════╗
║  MyMentalHealthBuddy - Platform Orchestrator                  ║
║  Version ${VERSION} - 888...^ Self-Evolving Automation         ║
╚════════════════════════════════════════════════════════════════╝
`;

const MODES = {
  START: {
    name: 'Start Platform',
    description: 'Start development server with auto-configuration',
    command: 'npm',
    args: ['run', 'dev:auto']
  },
  MONITOR: {
    name: 'Monitor Health',
    description: 'Start with continuous health monitoring',
    command: 'npm',
    args: ['run', 'dev:monitored']
  },
  EVOLVE: {
    name: 'Self-Evolving Mode',
    description: 'Start with intelligent self-evolving capabilities',
    command: 'npm',
    args: ['run', 'dev:evolve']
  },
  VERIFY: {
    name: 'Verify Platform',
    description: 'Run all verification checks',
    command: 'npm',
    args: ['run', 'verify:all']
  },
  BUILD: {
    name: 'Production Build',
    description: 'Build platform for production deployment',
    command: 'npm',
    args: ['run', 'build']
  },
  DEPLOY: {
    name: 'Pre-Deploy Check',
    description: 'Run pre-deployment verification',
    command: 'npm',
    args: ['run', 'verify:predeploy']
  }
};

console.log(BANNER);
console.log('\n🎯 Platform Orchestration Modes:\n');
Object.entries(MODES).forEach(([key, mode], index) => {
  console.log(`  ${index + 1}. ${mode.name}`);
  console.log(`     ${mode.description}\n`);
});

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Select mode (1-6) or press ENTER for Self-Evolving Mode:');

rl.on('line', (input) => {
  const choice = input.trim() || '3';
  const modeIndex = parseInt(choice) - 1;
  const modeKeys = Object.keys(MODES);
  
  if (modeIndex < 0 || modeIndex >= modeKeys.length) {
    console.log('❌ Invalid selection. Defaulting to Self-Evolving Mode...\n');
    executeMode(MODES.EVOLVE);
  } else {
    const selectedMode = MODES[modeKeys[modeIndex]];
    console.log(`\n✅ Starting: ${selectedMode.name}\n`);
    executeMode(selectedMode);
  }
  
  rl.close();
});

function executeMode(mode) {
  const child = spawn(mode.command, mode.args, {
    stdio: 'inherit',
    shell: true
  });
  
  child.on('error', (error) => {
    console.error(`\n❌ Error executing ${mode.name}:`, error.message);
    process.exit(1);
  });
  
  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`\n❌ ${mode.name} exited with code ${code}`);
      process.exit(code);
    }
  });
  
  process.on('SIGINT', () => {
    console.log('\n\n👋 Orchestrator shutting down gracefully...');
    child.kill('SIGTERM');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.log('\n\n👋 Orchestrator received SIGTERM...');
    child.kill('SIGTERM');
    process.exit(0);
  });
}

setTimeout(() => {
  if (rl.terminal) {
    console.log('\n⏱️  No selection made. Starting Self-Evolving Mode...\n');
    executeMode(MODES.EVOLVE);
    rl.close();
  }
}, 10000);
