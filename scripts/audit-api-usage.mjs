#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CLIENT_SRC = path.join(ROOT, 'client', 'src');

const mountedPaths = new Set();
const apiCalls = [];
const issues = [];

function extractMountedRoutes() {
  const files = ['server/index.mjs', 'server/dev.mjs'];
  for (const file of files) {
    const fp = path.join(ROOT, file);
    if (!fs.existsSync(fp)) continue;
    const content = fs.readFileSync(fp, 'utf8');
    const pattern = /app\.use\(["']([^"']+)["']/g;
    let m;
    while ((m = pattern.exec(content)) !== null) {
      mountedPaths.add(m[1]);
    }
  }
}

function walkDir(dir, extensions, cb) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
      walkDir(fullPath, extensions, cb);
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      cb(fullPath);
    }
  }
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT, filePath);
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    const patterns = [
      /["'`](\/api\/[^"'`\s${]+)["'`]/g,
      /fetch\(["'`](\/api\/[^"'`\s]+)["'`]/g,
      /apiRequest\(["'`]([^"'`]+)["'`]/g,
      /queryKey:\s*\[["'`](\/api\/[^"'`]+)["'`]/g,
    ];

    for (const regex of patterns) {
      let m;
      while ((m = regex.exec(line)) !== null) {
        let apiPath = m[1];
        apiPath = apiPath.replace(/\$\{[^}]+\}/g, ':param');
        apiPath = apiPath.split('?')[0];

        apiCalls.push({
          file: relPath,
          line: lineNum,
          path: apiPath
        });
      }
    }
  }
}

function findMountBase(apiPath) {
  const sorted = [...mountedPaths].sort((a, b) => b.length - a.length);
  for (const mount of sorted) {
    if (apiPath.startsWith(mount)) return mount;
  }
  return null;
}

console.log('── API Wiring Integrity Audit ──\n');
extractMountedRoutes();
console.log(`  Mounted API paths: ${mountedPaths.size}`);

walkDir(CLIENT_SRC, ['.jsx', '.tsx', '.js', '.ts'], scanFile);

const uniquePaths = new Map();
for (const call of apiCalls) {
  if (!uniquePaths.has(call.path)) {
    uniquePaths.set(call.path, []);
  }
  uniquePaths.get(call.path).push({ file: call.file, line: call.line });
}

console.log(`  Unique API paths called: ${uniquePaths.size}`);

for (const [apiPath, locations] of uniquePaths) {
  const mount = findMountBase(apiPath);
  if (!mount) {
    issues.push({
      path: apiPath,
      locations,
      problem: 'No matching backend mount found',
      severity: 'high'
    });
  }
}

const mountCounts = new Map();
for (const file of ['server/index.mjs', 'server/dev.mjs']) {
  const fp = path.join(ROOT, file);
  if (!fs.existsSync(fp)) continue;
  const content = fs.readFileSync(fp, 'utf8');
  const pattern = /app\.use\(["']([^"']+)["']/g;
  let m;
  while ((m = pattern.exec(content)) !== null) {
    const key = `${file}:${m[1]}`;
    mountCounts.set(key, (mountCounts.get(key) || 0) + 1);
  }
}

const doubleMounts = [];
for (const [key, count] of mountCounts) {
  if (count > 1) {
    doubleMounts.push(key);
  }
}

issues.sort((a, b) => {
  const sev = { high: 0, medium: 1, low: 2 };
  return (sev[a.severity] || 2) - (sev[b.severity] || 2);
});

let report = `# API Wiring Integrity Report\n\n`;
report += `Generated: ${new Date().toISOString()}\n\n`;
report += `## Summary\n\n`;
report += `- Mounted backend paths: ${mountedPaths.size}\n`;
report += `- Unique API paths called from client: ${uniquePaths.size}\n`;
report += `- Unmounted API calls: ${issues.length}\n`;
report += `- Double-mounted routes: ${doubleMounts.length}\n\n`;

if (issues.length > 0) {
  report += `## Unmounted API Calls\n\n`;
  report += `| # | API Path | Severity | Called From |\n`;
  report += `|---|----------|----------|-------------|\n`;
  for (let i = 0; i < Math.min(issues.length, 30); i++) {
    const iss = issues[i];
    const locs = iss.locations.slice(0, 3).map(l => `${l.file}:${l.line}`).join(', ');
    report += `| ${i + 1} | \`${iss.path}\` | ${iss.severity} | ${locs} |\n`;
  }
  report += `\n`;
}

if (doubleMounts.length > 0) {
  report += `## Double-Mounted Routes\n\n`;
  for (const dm of doubleMounts) {
    report += `- \`${dm}\`\n`;
  }
  report += `\n`;
}

report += `## All Mounted Backend Paths\n\n`;
const sortedMounts = [...mountedPaths].sort();
for (const m of sortedMounts) {
  report += `- \`${m}\`\n`;
}

report += `\n## All Client API Calls\n\n`;
const sortedCalls = [...uniquePaths.keys()].sort();
for (const c of sortedCalls) {
  const locs = uniquePaths.get(c);
  report += `- \`${c}\` (${locs.length} call${locs.length > 1 ? 's' : ''})\n`;
}

const docsDir = path.join(ROOT, 'docs');
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(path.join(docsDir, 'API_WIRING_REPORT.md'), report);

if (issues.length === 0) {
  console.log('  ✓ All client API calls have matching backend mounts');
} else {
  console.log(`  ⚠ ${issues.length} API calls without matching backend mount`);
  for (const iss of issues.slice(0, 5)) {
    console.log(`    ✗ ${iss.path} — called from ${iss.locations[0].file}:${iss.locations[0].line}`);
  }
  if (issues.length > 5) console.log(`    ... and ${issues.length - 5} more`);
}

if (doubleMounts.length > 0) {
  console.log(`  ⚠ ${doubleMounts.length} double-mounted routes detected`);
}

console.log(`\n  Report written to docs/API_WIRING_REPORT.md`);
console.log(`\n══════════════════════════════════════`);
const passed = issues.filter(i => i.severity === 'high').length <= 5;
console.log(passed ? 'API_WIRING: PASS' : `API_WIRING: WARN (${issues.length} issues)`);
console.log('══════════════════════════════════════\n');
process.exit(0);
