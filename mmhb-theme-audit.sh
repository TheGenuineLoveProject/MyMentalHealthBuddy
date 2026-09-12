#!/usr/bin/env bash
set -eu
cd /home/runner/workspace
env -u NODE_OPTIONS -u NODE_PATH -u NODE_V8_COVERAGE \
NODE_DISABLE_COMPILE_CACHE=1 node --input-type=module <<'MMHB_THEME_SOURCE_AUDIT'
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Read application styling source without importing application code or dependencies.
const ROOT = '/home/runner/workspace';
const MAX_FILE = 2 * 1024 * 1024;
const MAX_READ = 48 * 1024 * 1024;
const MAX_OUTPUT = 24 * 1024 * 1024;
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const ensure = (ok, message) => { if (!ok) throw Error(message); };
const notices = [];
let readBytes = 0;
const readHashes = new Map();

function checked(relative) {
  ensure(!path.isAbsolute(relative) && relative.split('/').every(p => p && p !== '.' && p !== '..'), 'INVALID_SOURCE_PATH');
  let current = ROOT;
  for (const part of relative.split('/')) {
    current = path.join(current, part);
    const st = fs.lstatSync(current);
    ensure(!st.isSymbolicLink(), 'SYMLINK_SOURCE:' + relative);
  }
  return current;
}

function read(relative) {
  const full = checked(relative);
  const fd = fs.openSync(full, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
  try {
    const st = fs.fstatSync(fd);
    ensure(st.isFile() && st.size <= MAX_FILE, 'SOURCE_SIZE_OR_TYPE:' + relative);
    const data = fs.readFileSync(fd);
    ensure(data.length <= MAX_FILE, 'SOURCE_GREW:' + relative);
    readBytes += data.length;
    ensure(readBytes <= MAX_READ, 'SOURCE_BUDGET_EXCEEDED');
    readHashes.set(relative, sha(data));
    return data;
  } finally { fs.closeSync(fd); }
}

const ignored = new Set(['node_modules', 'dist', 'build', 'coverage', '__tests__', '__snapshots__', 'uploads', 'upload', 'fixtures', 'test-results']);
function walk(relative, depth = 0) {
  ensure(depth <= 20, 'SOURCE_DEPTH_EXCEEDED');
  const result = [];
  for (const entry of fs.readdirSync(checked(relative), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith('.') || ignored.has(entry.name)) continue;
    const file = relative + '/' + entry.name;
    if (entry.isSymbolicLink()) { notices.push({ file, reason: 'SYMLINK_SKIPPED' }); continue; }
    if (entry.isDirectory()) result.push(...walk(file, depth + 1));
    else if (entry.isFile() && /\.(?:css|scss|sass|less|jsx?|tsx?|mjs|html)$/.test(entry.name)
      && !/\.(?:test|spec|stories)\.[^/]+$/.test(entry.name)
      && !entry.name.endsWith('.d.ts')) result.push(file);
    ensure(result.length <= 6000, 'SOURCE_FILE_BUDGET_EXCEEDED');
  }
  return result;
}

// Only these UI owners and stylesheets receive full source copies.
// Other client modules contribute file hashes and literal visual tokens only.
function copySource(file) {
  return /\.(?:css|scss|sass|less)$/.test(file)
    || /^client\/(?:index\.html|src\/(?:main|App)\.(?:jsx?|tsx?))$/.test(file)
    || /^client\/src\/routes\/.+\.(?:jsx?|tsx?)$/.test(file)
    || /^client\/src\/components\/(?:TglpNavbar|GratitudePrompt|AccessibilityToolbar|AICompanion)\.(?:jsx|tsx)$/.test(file)
    || /^client\/src\/components\/(?:navigation\/SEOContentDiscoveryRail|wellness\/WellnessPageShell)\.(?:jsx|tsx)$/.test(file)
    || /^client\/src\/(?:lib|context|contexts|providers|hooks)\/(?:brand|mode|theme|ThemeContext|ThemeProvider|AccessibilityContext|useTheme)\.(?:jsx?|tsx?|mjs)$/.test(file)
    || /^(?:tailwind\.config\.(?:js|ts|mjs)|shared\/brand\.(?:js|ts|mjs))$/.test(file);
}

function sensitiveSource(source) {
  return /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:sk-(?:proj-)?[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{30,}|AKIA[A-Z0-9]{16})\b/.test(source)
    || /\b(?:api[_-]?key|secret|password|access[_-]?token|refresh[_-]?token|authorization)\b["']?\s*[:=]\s*["'][^"'\r\n]{8,}["']/i.test(source)
    || /(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^\s"']+/i.test(source);
}

function extract(source) {
  const color = /#[\da-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|oklch|oklab)\([^\n;{}]{1,180}\)|var\(--[\w-]+\)/g;
  const utility = /\b(?:(?:dark|hover|focus|focus-visible|active|disabled):)*(?:bg|text|border|from|via|to|ring|outline|fill|stroke|shadow|decoration)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|sage|gold|blush)-(?:50|[1-9]00|950)(?:\/\d{1,3})?\b/g;
  const fonts = /\bfont-(?:display|sans|serif|mono|sacred|healing)\b|\b(?:Inter|Poppins|Geist Sans|Playfair Display|Cormorant Garamond|Georgia|system-ui)\b/g;
  const visuals = [];
  const routes = [];
  const imports = [];
  const modeHooks = [];
  for (const [index, line] of source.split('\n').entries()) {
    const values = [...new Set([...line.matchAll(color), ...line.matchAll(utility), ...line.matchAll(fonts)].map(m => m[0]))];
    if (values.length) visuals.push({ line: index + 1, tokens: values });
    for (const m of line.matchAll(/\bpath\s*(?:=\s*\{?\s*|:\s*)["'](\/[^"'\s?#]*)["']/g)) routes.push({ line: index + 1, path: m[1] });
    for (const m of line.matchAll(/(?:\bfrom\s*|\bimport\s*(?:\(\s*)?|@import\s*|\brequire\s*\(\s*)["']([^"'\n]+)["']/g)) {
      if (!/^(?:https?:|data:)/.test(m[1]) && !m[1].includes('?')) imports.push({ line: index + 1, specifier: m[1] });
    }
    if (/data-(?:mode|theme)|prefers-(?:reduced-motion|contrast|color-scheme)|forced-colors|high-contrast|low-stim/.test(line)) {
      modeHooks.push({ line: index + 1, hooks: [...new Set(line.match(/data-(?:mode|theme)|prefers-(?:reduced-motion|contrast|color-scheme)|forced-colors|high-contrast|low-stim/g))] });
    }
  }
  return { visuals, routes, imports, modeHooks };
}

function optionalFile(relative) {
  try { return fs.lstatSync(path.join(ROOT, relative)).isFile(); }
  catch (error) { if (error.code === 'ENOENT') return false; throw error; }
}

try {
  ensure(fs.realpathSync('.') === ROOT, 'WRONG_WORKSPACE');
  ensure(Number(process.versions.node.split('.')[0]) >= 22, 'NODE_22_OR_NEWER_REQUIRED');
  const app = ['client/src/App.jsx', 'client/src/App.tsx'].find(optionalFile);
  ensure(app && optionalFile('client/src/index.css'), 'MMHB_FRONTEND_NOT_FOUND');
  const appSource = read(app).toString('utf8');
  ensure(/MyMentalHealthBuddy|TglpNavbar|SEOContentDiscoveryRail/.test(appSource), 'UNEXPECTED_APPLICATION');
  const files = walk('client/src');
  for (const file of ['client/index.html', 'tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.mjs', 'shared/brand.mjs', 'shared/brand.js', 'shared/brand.ts']) {
    if (optionalFile(file)) files.push(file);
  }
  const sources = [];
  const inventory = [];
  for (const file of [...new Set(files)].sort()) {
    const raw = read(file);
    const source = raw.toString('utf8');
    ensure(!source.includes('\u0000') && Buffer.from(source).equals(raw), 'NON_UTF8_SOURCE:' + file);
    const entry = { file, bytes: raw.length, sha256: sha(raw) };
    // A candidate credential is withheld entirely rather than copying a redacted
    // file which might later be mistaken for an exact patch baseline.
    if (sensitiveSource(source)) {
      inventory.push({ ...entry, withheld: 'POSSIBLE_EMBEDDED_CREDENTIAL' });
      notices.push({ file, reason: 'POSSIBLE_EMBEDDED_CREDENTIAL' });
      continue;
    }
    inventory.push({ ...entry, ...extract(source) });
    if (copySource(file)) sources.push({ ...entry, content: source });
  }
  const previousReports = [];
  const dirs = fs.readdirSync(ROOT, { withFileTypes: true }).filter(e => e.isDirectory() && /^mmhb-(?:gratitude-save|botanical-palette)-[A-Za-z0-9]+$/.test(e.name));
  for (const directory of dirs.sort((a, b) => a.name.localeCompare(b.name))) {
    const file = directory.name + '/report.json';
    if (!optionalFile(file)) continue;
    try {
      const r = JSON.parse(read(file).toString('utf8'));
      const safeStatus = v => typeof v === 'string' && /^[A-Z0-9_:-]{1,120}$/.test(v) ? v : null;
      previousReports.push({ file, status: safeStatus(r.status), qualification: safeStatus(r.uiQualification?.status), cases: Array.isArray(r.uiQualification?.results) ? r.uiQualification.results.length : null });
    } catch { notices.push({ file, reason: 'PREVIOUS_REPORT_NOT_READABLE' }); }
  }
  const preview = optionalFile('client/dist/index.html')
    ? { file: 'client/dist/index.html', sha256: sha(read('client/dist/index.html')) }
    : null;
  // Detect edits during collection so the report does not claim a coherent
  // baseline while files are actively changing.
  for (const [file, hash] of readHashes) {
    const full = checked(file);
    const st = fs.lstatSync(full);
    ensure(st.isFile() && st.size <= MAX_FILE, 'SOURCE_CHANGED_DURING_AUDIT:' + file);
    ensure(sha(fs.readFileSync(full)) === hash, 'SOURCE_CHANGED_DURING_AUDIT:' + file);
  }
  const report = {
    schema: 'MMHB_THEME_SOURCE_AUDIT_V1',
    createdAt: new Date().toISOString(),
    project: 'MyMentalHealthBuddy',
    status: notices.length ? 'SOURCE_AUDIT_READY_WITH_NOTICES' : 'SOURCE_AUDIT_READY',
    scope: 'STATIC_SOURCE_INSPECTION_NOT_RENDERED_PAGE_QUALIFICATION',
    palette: { background: '#faf8f2', surface: '#fffdf8', action: '#3f6249', text: '#293329', softSurface: '#eaf0e6', decorativeGreen: '#78977b', peach: '#f2d8cb', darkAction: '#bcd3be' },
    fonts: { bodyAndControls: 'Inter', headings: 'Playfair Display', preserveAccessibilityFontOverrides: true },
    summary: { sourceFilesInspected: inventory.length, fullSourceCopies: sources.length, stylesheetsCopied: sources.filter(s => /\.(?:css|scss|sass|less)$/.test(s.file)).length, routeCandidates: [...new Set(inventory.flatMap(i => (i.routes || []).map(r => r.path)))].length, notices: notices.length },
    effects: { applicationSourceWrites: 0, dependencyInstalls: 0, buildRuns: 0, apiRequests: 0, deploymentRuns: 0 },
    preview, previousReports, notices, inventory, sources,
  };
  const data = JSON.stringify(report, null, 2) + '\n';
  ensure(Buffer.byteLength(data) <= MAX_OUTPUT, 'REPORT_BUDGET_EXCEEDED');
  const name = 'mmhb-theme-audit-' + crypto.randomUUID() + '.json';
  fs.writeFileSync(path.join(ROOT, name), data, { flag: 'wx', mode: 0o600 });
  console.log('STATUS=' + report.status);
  console.log('SOURCE_FILES_INSPECTED=' + inventory.length);
  console.log('FULL_SOURCE_COPIES=' + sources.length);
  console.log('STYLESHEETS_COPIED=' + report.summary.stylesheetsCopied);
  console.log('ROUTE_CANDIDATES=' + report.summary.routeCandidates);
  console.log('NOTICES=' + notices.length);
  console.log('APPLICATION_SOURCE_WRITES=0 BUILDS=0 API_REQUESTS=0');
  console.log('REPORT=' + path.join(ROOT, name));
  console.log('REPORT_SHA256=' + sha(data));
  console.log('NEXT_ACTION=UPLOAD_REPORT_JSON_TO_CHATGPT');
} catch (error) {
  console.error('STATUS=SOURCE_AUDIT_STOPPED');
  console.error('REASON=' + String(error.code || error.message).replace(/[^A-Za-z0-9_./:-]/g, '_').slice(0, 240));
  process.exitCode = 1;
}
MMHB_THEME_SOURCE_AUDIT
