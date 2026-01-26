#!/usr/bin/env node
/**
 * scripts/verify.mjs — Full verification suite
 * Runs typecheck, build, and test with summary output
 * Human-triggered only
 */

import { execSync, spawnSync } from 'child_process';

const PASS = '✅';
const FAIL = '❌';
const SKIP = '⏭️';

const results = {
  typecheck: { status: 'pending', time: 0, output: '' },
  build: { status: 'pending', time: 0, output: '' },
  test: { status: 'pending', time: 0, output: '' }
};

function runStep(name, command) {
  console.log(`\n🔄 Running ${name}...`);
  console.log('─────────────────────────────────────────────────────────────────');
  
  const start = Date.now();
  
  try {
    const result = spawnSync('npm', ['run', '-s', command], {
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 300000 // 5 minute timeout
    });
    
    const time = Date.now() - start;
    const output = (result.stdout || '') + (result.stderr || '');
    
    if (result.status === 0) {
      results[name] = { status: 'pass', time, output };
      console.log(`${PASS} ${name} passed (${(time/1000).toFixed(1)}s)`);
    } else {
      results[name] = { status: 'fail', time, output };
      console.log(`${FAIL} ${name} failed (${(time/1000).toFixed(1)}s)`);
      console.log('\nOutput (last 20 lines):');
      console.log(output.split('\n').slice(-20).join('\n'));
    }
  } catch (e) {
    results[name] = { status: 'error', time: 0, output: e.message };
    console.log(`${FAIL} ${name} error: ${e.message}`);
  }
}

console.log('═══════════════════════════════════════════════════════════════');
console.log('  A→Z 360 VERIFICATION SUITE');
console.log('═══════════════════════════════════════════════════════════════');
console.log(`  Started: ${new Date().toISOString()}`);

// Run verification steps
runStep('typecheck', 'typecheck');
runStep('build', 'build');
runStep('test', 'test');

// Summary
console.log('\n═══════════════════════════════════════════════════════════════');
console.log('  VERIFICATION SUMMARY');
console.log('═══════════════════════════════════════════════════════════════\n');

const statusIcon = (status) => {
  switch (status) {
    case 'pass': return PASS;
    case 'fail': return FAIL;
    case 'skip': return SKIP;
    default: return '❓';
  }
};

Object.entries(results).forEach(([name, data]) => {
  const icon = statusIcon(data.status);
  const time = data.time ? ` (${(data.time/1000).toFixed(1)}s)` : '';
  console.log(`  ${icon} ${name.toUpperCase()}${time}`);
});

console.log('');

const passed = Object.values(results).filter(r => r.status === 'pass').length;
const total = Object.keys(results).length;

console.log('═══════════════════════════════════════════════════════════════');
console.log(`  RESULT: ${passed}/${total} checks passed`);
console.log('═══════════════════════════════════════════════════════════════\n');

if (passed === total) {
  console.log('🎉 All verifications passed! Ready for deployment.\n');
  process.exit(0);
} else {
  console.log('⚠️  Some verifications failed. Review output above.\n');
  process.exit(1);
}
