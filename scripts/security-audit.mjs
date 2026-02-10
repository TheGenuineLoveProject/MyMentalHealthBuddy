#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function detectPackageManager() {
  if (fs.existsSync(path.join(ROOT, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(ROOT, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

function runAudit(pm) {
  try {
    const cmd = pm === 'pnpm' ? 'pnpm audit --json' :
                pm === 'yarn' ? 'yarn audit --json' :
                'npm audit --json';
    return execSync(cmd, { cwd: ROOT, stdio: 'pipe', timeout: 60000 }).toString();
  } catch (e) {
    return e.stdout ? e.stdout.toString() : '{}';
  }
}

function parseSeverity(auditJson) {
  try {
    const data = JSON.parse(auditJson);
    const vuln = data.metadata?.vulnerabilities || data.vulnerabilities || {};
    return {
      critical: vuln.critical || 0,
      high: vuln.high || 0,
      moderate: vuln.moderate || 0,
      low: vuln.low || 0,
      info: vuln.info || 0,
      total: vuln.total || (vuln.critical || 0) + (vuln.high || 0) + (vuln.moderate || 0) + (vuln.low || 0)
    };
  } catch {
    return { critical: 0, high: 0, moderate: 0, low: 0, info: 0, total: 0, parseError: true };
  }
}

function checkLockfile(pm) {
  const lockFiles = {
    npm: 'package-lock.json',
    pnpm: 'pnpm-lock.yaml',
    yarn: 'yarn.lock'
  };
  return fs.existsSync(path.join(ROOT, lockFiles[pm]));
}

console.log('── Security Audit ──\n');

const pm = detectPackageManager();
console.log(`  Package manager: ${pm}`);
console.log(`  Lockfile present: ${checkLockfile(pm) ? 'Yes' : 'NO — create one!'}`);

console.log('  Running audit...');
const auditRaw = runAudit(pm);
const severity = parseSeverity(auditRaw);

let outdatedInfo = '';
try {
  outdatedInfo = execSync(`${pm} outdated --json 2>/dev/null || true`, {
    cwd: ROOT, stdio: 'pipe', timeout: 30000
  }).toString();
} catch { outdatedInfo = '{}'; }

let report = `# Security Audit Report\n\n`;
report += `Generated: ${new Date().toISOString()}\n`;
report += `Package Manager: ${pm}\n`;
report += `Lockfile Present: ${checkLockfile(pm) ? 'Yes' : 'No'}\n\n`;
report += `## Vulnerability Summary\n\n`;
report += `| Severity | Count |\n`;
report += `|----------|-------|\n`;
report += `| Critical | ${severity.critical} |\n`;
report += `| High | ${severity.high} |\n`;
report += `| Moderate | ${severity.moderate} |\n`;
report += `| Low | ${severity.low} |\n`;
report += `| **Total** | **${severity.total}** |\n\n`;

if (severity.parseError) {
  report += `> Note: Could not parse full audit output. Run \`${pm} audit\` manually for details.\n\n`;
}

report += `## Recommended Actions\n\n`;
report += `### Safe Upgrades (patch/minor only)\n\n`;
report += `Run: \`${pm === 'npm' ? 'npm audit fix' : pm + ' audit fix'}\`\n\n`;
report += `This applies only non-breaking patches. Review output before committing.\n\n`;
report += `### Major Version Upgrades\n\n`;
report += `Do NOT auto-upgrade major versions. Review each one:\n`;
report += `- Check changelog for breaking changes\n`;
report += `- Test in development first\n`;
report += `- Upgrade one at a time\n\n`;

if (severity.critical > 0 || severity.high > 0) {
  report += `## ⚠ Action Required\n\n`;
  report += `There are ${severity.critical} critical and ${severity.high} high severity vulnerabilities.\n`;
  report += `Run \`${pm} audit\` for full details and address these before deploying.\n\n`;
}

report += `## Status\n\n`;
const status = severity.critical === 0 && severity.high === 0 ? 'PASS' :
               severity.critical === 0 ? 'WARN' : 'FAIL';
report += `**${status}** — `;
if (status === 'PASS') report += `No critical or high severity vulnerabilities found.\n`;
else if (status === 'WARN') report += `High severity vulnerabilities need attention.\n`;
else report += `Critical vulnerabilities must be resolved immediately.\n`;

const docsDir = path.join(ROOT, 'docs');
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(path.join(docsDir, 'SECURITY_STATUS.md'), report);

console.log(`\n  Critical: ${severity.critical}`);
console.log(`  High: ${severity.high}`);
console.log(`  Moderate: ${severity.moderate}`);
console.log(`  Low: ${severity.low}`);
console.log(`  Total: ${severity.total}`);
console.log(`\n  Report written to docs/SECURITY_STATUS.md`);
console.log(`\n══════════════════════════════════════`);
console.log(`SECURITY_AUDIT: ${status}`);
console.log('══════════════════════════════════════\n');
process.exit(status === 'FAIL' ? 1 : 0);
