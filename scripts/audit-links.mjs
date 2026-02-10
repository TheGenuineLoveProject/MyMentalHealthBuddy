#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CLIENT_SRC = path.join(ROOT, 'client', 'src');

const registeredRoutes = new Set();
const issues = [];

function extractRoutes() {
  const appPath = path.join(CLIENT_SRC, 'App.jsx');
  if (!fs.existsSync(appPath)) {
    console.error('App.jsx not found');
    process.exit(1);
  }
  const content = fs.readFileSync(appPath, 'utf8');
  const routePattern = /path="([^"]+)"/g;
  let m;
  while ((m = routePattern.exec(content)) !== null) {
    registeredRoutes.add(m[1]);
  }
  registeredRoutes.add('/');
  registeredRoutes.add('/r/:slug');
  registeredRoutes.add('/rss.xml');
}

function matchesRoute(href) {
  const clean = href.split('?')[0].split('#')[0];
  if (registeredRoutes.has(clean)) return true;
  for (const r of registeredRoutes) {
    if (r.includes(':')) {
      const pattern = '^' + r.replace(/:[^/]+/g, '[^/]+') + '$';
      if (new RegExp(pattern).test(clean)) return true;
    }
  }
  if (clean.startsWith('/api/') || clean.startsWith('/r/') || clean.startsWith('/rss')) return true;
  return false;
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relPath = path.relative(ROOT, filePath);
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    const patterns = [
      { regex: /to=["']([^"']+)["']/g, type: 'Link to' },
      { regex: /href=["']([^"']+)["']/g, type: 'href' },
      { regex: /navigate\(["']([^"']+)["']/g, type: 'navigate()' },
      { regex: /setLocation\(["']([^"']+)["']/g, type: 'setLocation()' },
      { regex: /window\.location\.href\s*=\s*["']([^"']+)["']/g, type: 'window.location' },
      { regex: /push\(["']([^"']+)["']/g, type: 'push()' },
    ];

    for (const { regex, type } of patterns) {
      let m;
      while ((m = regex.exec(line)) !== null) {
        const href = m[1];

        if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) continue;
        if (href.startsWith('javascript:')) continue;
        if (href === '' || href === '#') {
          issues.push({
            file: relPath,
            line: lineNum,
            href,
            type,
            severity: 'high',
            problem: href === '' ? 'Empty href' : 'Placeholder # href',
            suggestion: 'Replace with actual route or remove'
          });
          continue;
        }
        if (!href.startsWith('/')) continue;

        if (!matchesRoute(href)) {
          issues.push({
            file: relPath,
            line: lineNum,
            href,
            type,
            severity: 'medium',
            problem: 'Route not found in router',
            suggestion: findClosestRoute(href)
          });
        }
      }
    }
  }
}

function findClosestRoute(href) {
  const clean = href.split('?')[0].split('#')[0];
  const parts = clean.split('/').filter(Boolean);
  let best = null;
  let bestScore = 0;
  for (const route of registeredRoutes) {
    const rParts = route.split('/').filter(p => p && !p.startsWith(':'));
    let score = 0;
    for (const p of parts) {
      if (rParts.includes(p)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      best = route;
    }
  }
  return best ? `Maybe: ${best}` : 'Add route or redirect';
}

function walkDir(dir, extensions) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
      walkDir(fullPath, extensions);
    } else if (extensions.some(ext => entry.name.endsWith(ext))) {
      scanFile(fullPath);
    }
  }
}

console.log('── Link & Route Integrity Audit ──\n');
extractRoutes();
console.log(`  Registered routes: ${registeredRoutes.size}`);

walkDir(CLIENT_SRC, ['.jsx', '.tsx', '.js', '.ts']);

issues.sort((a, b) => {
  const sev = { high: 0, medium: 1, low: 2 };
  return (sev[a.severity] || 2) - (sev[b.severity] || 2);
});

const top30 = issues.slice(0, 30);

let report = `# Link & Route Integrity Audit Report\n\n`;
report += `Generated: ${new Date().toISOString()}\n\n`;
report += `## Summary\n\n`;
report += `- Registered routes: ${registeredRoutes.size}\n`;
report += `- Issues found: ${issues.length}\n`;
report += `- High severity: ${issues.filter(i => i.severity === 'high').length}\n`;
report += `- Medium severity: ${issues.filter(i => i.severity === 'medium').length}\n\n`;
report += `## Top ${top30.length} Fixes (Ranked by Impact)\n\n`;
report += `| # | Severity | File | Line | Type | Href | Problem | Suggestion |\n`;
report += `|---|----------|------|------|------|------|---------|------------|\n`;

for (let i = 0; i < top30.length; i++) {
  const iss = top30[i];
  report += `| ${i + 1} | ${iss.severity} | ${iss.file} | ${iss.line} | ${iss.type} | \`${iss.href}\` | ${iss.problem} | ${iss.suggestion} |\n`;
}

if (issues.length > 30) {
  report += `\n*${issues.length - 30} additional issues not shown.*\n`;
}

report += `\n## All Registered Routes\n\n`;
const sortedRoutes = [...registeredRoutes].sort();
for (const r of sortedRoutes) {
  report += `- \`${r}\`\n`;
}

const docsDir = path.join(ROOT, 'docs');
if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
fs.writeFileSync(path.join(docsDir, 'LINK_AUDIT_REPORT.md'), report);

if (issues.length === 0) {
  console.log('  ✓ All links point to known routes');
} else {
  console.log(`  ⚠ ${issues.length} link issues found`);
  for (const iss of top30.slice(0, 10)) {
    console.log(`    ${iss.severity === 'high' ? '✗' : '⚠'} ${iss.file}:${iss.line} — ${iss.problem}: ${iss.href}`);
  }
  if (top30.length > 10) console.log(`    ... and ${issues.length - 10} more`);
}

console.log(`\n  Report written to docs/LINK_AUDIT_REPORT.md`);
console.log(`\n══════════════════════════════════════`);
const passed = issues.filter(i => i.severity === 'high').length === 0;
console.log(passed ? 'LINKS_AUDIT: PASS' : `LINKS_AUDIT: WARN (${issues.length} issues, ${issues.filter(i => i.severity === 'high').length} high)`);
console.log('══════════════════════════════════════\n');
process.exit(0);
