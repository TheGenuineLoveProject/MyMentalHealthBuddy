#!/usr/bin/env node
/**
 * scripts/verify.mjs — Full verification suite (Completion Lock)
 * Runs: publishing audit, health check, build, and tests
 * Human-triggered only — no automation
 * 
 * Outputs: VERIFIED: PASS or VERIFIED: FAIL
 */

import { spawnSync } from 'child_process';

const results = [];

function runCmd(label, cmd, args, { timeout = 120000 } = {}) {
  console.log(`\n── ${label} ──`);
  const start = Date.now();

  try {
    const result = spawnSync(cmd, args, {
      encoding: 'utf8',
      stdio: 'pipe',
      timeout,
    });

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    const output = (result.stdout || '') + (result.stderr || '');

    if (result.status === 0) {
      const lastLines = output.trim().split('\n').slice(-5).join('\n');
      console.log(lastLines);
      console.log(`  ✓ ${label} passed (${elapsed}s)`);
      results.push({ label, passed: true });
    } else {
      const lastLines = output.trim().split('\n').slice(-15).join('\n');
      console.log(lastLines);
      console.log(`  ✗ ${label} failed (${elapsed}s)`);
      results.push({ label, passed: false, reason: `Exit code ${result.status}` });
    }
  } catch (e) {
    console.log(`  ✗ ${label} error: ${e.message}`);
    results.push({ label, passed: false, reason: e.message.split('\n')[0] });
  }
}

function checkHealth() {
  console.log('\n── Health Endpoint ──');
  try {
    const result = spawnSync('curl', ['-sf', 'http://localhost:5000/api/health'], {
      encoding: 'utf8',
      timeout: 10000,
    });

    if (result.status !== 0) {
      console.log('  ✗ /api/health: unreachable');
      results.push({ label: 'Health Endpoint', passed: false, reason: 'Endpoint unreachable' });
      return;
    }

    const health = JSON.parse(result.stdout);
    if (health.status === 'healthy') {
      console.log(`  ✓ /api/health: healthy (db=${health.database?.connected ? 'connected' : 'disconnected'})`);
      results.push({ label: 'Health Endpoint', passed: true });
    } else {
      console.log(`  ✗ /api/health: status="${health.status}" (expected "healthy")`);
      results.push({ label: 'Health Endpoint', passed: false, reason: `status="${health.status}"` });
    }
  } catch (e) {
    console.log(`  ✗ /api/health: ${e.message}`);
    results.push({ label: 'Health Endpoint', passed: false, reason: 'Invalid response' });
  }
}

console.log('╔══════════════════════════════════════╗');
console.log('║       COMPLETION LOCK — VERIFY       ║');
console.log('╚══════════════════════════════════════╝');
console.log(`  Started: ${new Date().toISOString()}`);

runCmd('Publishing Audit', 'node', ['scripts/audit-publishing.mjs'], { timeout: 15000 });
runCmd('Publishing Registry Validate', 'node', ['scripts/validate-publishing.mjs'], { timeout: 15000 });
runCmd('Tone Audit', 'node', ['scripts/audit-tone.mjs'], { timeout: 15000 });
runCmd('Signals Audit', 'node', ['scripts/audit-signals.mjs'], { timeout: 15000 });
runCmd('Editorial Calendar (dry run)', 'node', ['scripts/generate-editorial-calendar.mjs', '--dry-run'], { timeout: 15000 });

checkHealth();

runCmd('Build', 'npx', ['vite', 'build'], { timeout: 120000 });

console.log('\n══════════════════════════════════════');
console.log('  VERIFICATION SUMMARY');
console.log('══════════════════════════════════════\n');

for (const r of results) {
  const icon = r.passed ? '✓' : '✗';
  console.log(`  ${icon} ${r.label}${r.reason ? ` — ${r.reason}` : ''}`);
}

console.log('');

const failures = results.filter((r) => !r.passed);
console.log('══════════════════════════════════════');
if (failures.length === 0) {
  console.log(`VERIFIED: PASS`);
  console.log(`All ${results.length} checks passed.`);
  console.log('══════════════════════════════════════');
  process.exit(0);
} else {
  console.log(`VERIFIED: FAIL`);
  console.log(`${failures.length} of ${results.length} checks failed.`);
  console.log('══════════════════════════════════════');
  process.exit(1);
}
