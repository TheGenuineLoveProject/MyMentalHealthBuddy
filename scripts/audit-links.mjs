#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const KNOWN_ROUTES = [
  '/', '/blog', '/newsletter', '/pricing', '/crisis', '/about',
  '/tools', '/journal', '/reflection', '/contact', '/faq',
  '/login', '/register', '/dashboard', '/pro',
];

let passed = true;
let issues = [];

function scanLinks(content, filepath) {
  const linkPattern = /(?:\[([^\]]*)\]\(([^)]+)\)|href=["']([^"']+)["'])/g;
  let match;
  while ((match = linkPattern.exec(content)) !== null) {
    const href = match[2] || match[3];
    if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) continue;
    const route = href.split('?')[0].split('#')[0];
    const isKnown = KNOWN_ROUTES.some(r => route === r || route.startsWith(r + '/'));
    if (!isKnown) {
      issues.push({ filepath, route, full: href });
    }
  }
}

function scanDir(dir, ext) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f => f.endsWith(ext));
  for (const file of files) {
    const filepath = path.join(dir, file);
    const content = fs.readFileSync(filepath, 'utf8');
    scanLinks(content, path.relative(ROOT, filepath));
  }
}

function scanJson(filepath) {
  if (!fs.existsSync(filepath)) return;
  const content = fs.readFileSync(filepath, 'utf8');
  scanLinks(content, path.relative(ROOT, filepath));
}

console.log('── Link Integrity Audit ──\n');

scanDir(path.join(ROOT, 'content/blog/posts'), '.md');
scanDir(path.join(ROOT, 'content/newsletter'), '.md');
scanDir(path.join(ROOT, 'content/publishing/templates'), '.md');
scanJson(path.join(ROOT, 'content/publishing/newsletter/drafts.json'));
scanJson(path.join(ROOT, 'content/newsletter/drafts.json'));

if (issues.length === 0) {
  console.log('  ✓ All internal links point to known routes');
} else {
  for (const issue of issues) {
    console.log(`  ⚠ ${issue.filepath}: link "${issue.route}" not in known routes`);
  }
  if (issues.length > 5) {
    passed = false;
  }
}

console.log(`\n══════════════════════════════════════`);
console.log(passed ? 'LINKS_AUDIT: PASS' : `LINKS_AUDIT: FAIL (${issues.length} unknown routes)`);
console.log('══════════════════════════════════════\n');
process.exit(passed ? 0 : 1);
