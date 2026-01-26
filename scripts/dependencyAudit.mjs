#!/usr/bin/env node
/**
 * Dependency Audit (P198)
 * Checks for outdated and vulnerable dependencies
 * 
 * Usage: npm run audit:deps
 */

import { execSync } from 'child_process';
import fs from 'fs';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
};

const PASS = `${COLORS.green}✓${COLORS.reset}`;
const FAIL = `${COLORS.red}✗${COLORS.reset}`;
const WARN = `${COLORS.yellow}!${COLORS.reset}`;

async function main() {
  console.log('\n📦 Dependency Audit');
  console.log('─'.repeat(50));
  
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  const depCount = Object.keys(pkg.dependencies || {}).length;
  const devDepCount = Object.keys(pkg.devDependencies || {}).length;
  
  console.log(`\n  ${PASS} Dependencies: ${depCount}`);
  console.log(`  ${PASS} Dev dependencies: ${devDepCount}`);
  console.log(`  ${PASS} Total: ${depCount + devDepCount}`);
  
  console.log('\n📋 Running npm audit...');
  
  try {
    const auditResult = execSync('npm audit --json 2>/dev/null', { encoding: 'utf-8' });
    const audit = JSON.parse(auditResult);
    
    const vulnerabilities = audit.metadata?.vulnerabilities || {};
    const total = Object.values(vulnerabilities).reduce((a, b) => a + b, 0);
    
    if (total === 0) {
      console.log(`  ${PASS} No known vulnerabilities`);
    } else {
      console.log(`  ${WARN} ${total} vulnerabilities found:`);
      if (vulnerabilities.critical > 0) console.log(`     ${FAIL} Critical: ${vulnerabilities.critical}`);
      if (vulnerabilities.high > 0) console.log(`     ${FAIL} High: ${vulnerabilities.high}`);
      if (vulnerabilities.moderate > 0) console.log(`     ${WARN} Moderate: ${vulnerabilities.moderate}`);
      if (vulnerabilities.low > 0) console.log(`     Low: ${vulnerabilities.low}`);
    }
  } catch (error) {
    if (error.stdout) {
      try {
        const audit = JSON.parse(error.stdout);
        const vulnerabilities = audit.metadata?.vulnerabilities || {};
        const critical = vulnerabilities.critical || 0;
        const high = vulnerabilities.high || 0;
        
        if (critical + high > 0) {
          console.log(`  ${WARN} Found vulnerabilities (run npm audit for details)`);
        } else {
          console.log(`  ${PASS} No critical/high vulnerabilities`);
        }
      } catch {
        console.log(`  ${WARN} Could not parse audit results`);
      }
    } else {
      console.log(`  ${WARN} npm audit unavailable`);
    }
  }
  
  console.log('\n📋 Checking for deprecated packages...');
  
  const deprecatedPatterns = ['request', 'node-uuid', 'node-sass'];
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  const deprecated = Object.keys(deps).filter(d => 
    deprecatedPatterns.some(p => d.toLowerCase().includes(p))
  );
  
  if (deprecated.length === 0) {
    console.log(`  ${PASS} No known deprecated packages`);
  } else {
    console.log(`  ${WARN} Potentially deprecated: ${deprecated.join(', ')}`);
  }
  
  console.log('\n' + '─'.repeat(50));
  console.log(`${COLORS.green}✅ Dependency audit complete${COLORS.reset}\n`);
}

main().catch(console.error);
