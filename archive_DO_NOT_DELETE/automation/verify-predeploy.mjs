#!/usr/bin/env node

import { spawn } from 'child_process';

const BANNER = `
╔════════════════════════════════════════════════════════════════╗
║  Pre-Deployment Verification - 888...^ Perfection Standard    ║
╚════════════════════════════════════════════════════════════════╝
`;

console.log(BANNER);

const VERIFICATION_STEPS = [
  {
    name: 'Production Build',
    command: 'npm',
    args: ['run', 'build'],
    critical: true,
    description: 'Compile TypeScript and build production bundles'
  },
  {
    name: 'Build Output Validation',
    command: 'npm',
    args: ['run', 'verify:build'],
    critical: true,
    description: 'Validate build artifacts and bundle sizes'
  }
];

let currentStep = 0;
const results = [];

async function runStep(step) {
  return new Promise((resolve) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📋 Step ${currentStep + 1}/${VERIFICATION_STEPS.length}: ${step.name}`);
    if (step.description) {
      console.log(`   ${step.description}`);
    }
    console.log(`${'='.repeat(60)}\n`);
    
    const startTime = Date.now();
    const child = spawn(step.command, step.args, {
      stdio: 'inherit',
      shell: true
    });
    
    child.on('error', (error) => {
      const duration = Date.now() - startTime;
      results.push({
        step: step.name,
        success: false,
        critical: step.critical,
        error: error.message,
        duration
      });
      resolve(false);
    });
    
    child.on('exit', (code) => {
      const duration = Date.now() - startTime;
      const success = code === 0;
      
      results.push({
        step: step.name,
        success,
        critical: step.critical,
        code,
        duration
      });
      
      if (success) {
        console.log(`\n✅ ${step.name} completed in ${(duration / 1000).toFixed(2)}s`);
      } else {
        console.log(`\n${step.critical ? '❌' : '⚠️'} ${step.name} ${step.critical ? 'failed' : 'had warnings'} (code ${code})`);
      }
      
      resolve(success);
    });
  });
}

async function runAllSteps() {
  for (const step of VERIFICATION_STEPS) {
    const success = await runStep(step);
    currentStep++;
    
    if (!success && step.critical) {
      console.log('\n❌ CRITICAL FAILURE - Stopping verification\n');
      printSummary();
      process.exit(1);
    }
  }
  
  printSummary();
  
  const criticalFailed = results.filter(r => r.critical && !r.success);
  const warningCount = results.filter(r => !r.success && !r.critical).length;
  
  if (criticalFailed.length > 0) {
    console.log('\n❌ PRE-DEPLOYMENT VERIFICATION FAILED');
    console.log('   Platform is NOT ready for deployment\n');
    process.exit(1);
  } else if (warningCount > 0) {
    console.log('\n⚠️  Pre-deployment verification passed with warnings');
    console.log('   Review warnings before deploying\n');
    process.exit(0);
  } else {
    console.log('\n✅ PRE-DEPLOYMENT VERIFICATION PASSED');
    console.log('   Platform is ready for production deployment!\n');
    process.exit(0);
  }
}

function printSummary() {
  console.log('\n' + '━'.repeat(60));
  console.log('📊 Verification Summary:\n');
  
  results.forEach((result, index) => {
    const icon = result.success ? '✅' : (result.critical ? '❌' : '⚠️');
    const status = result.success ? 'PASSED' : (result.critical ? 'FAILED' : 'WARNING');
    const duration = (result.duration / 1000).toFixed(2);
    
    console.log(`${icon} ${index + 1}. ${result.step}`);
    console.log(`   Status: ${status}`);
    console.log(`   Duration: ${duration}s`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    console.log('');
  });
  
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  console.log(`Total verification time: ${(totalDuration / 1000).toFixed(2)}s`);
}

runAllSteps().catch((error) => {
  console.error('\n❌ Verification process failed:', error.message);
  process.exit(1);
});
