import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
const EXPECTED_ROOT = '/home/runner/workspace';
const EXPECTED_HEAD = 'ba56d50f2f86bc9e47f829e9596f0d0b31699ab0';
const EXPECTED_NODE = 'v24.13.0';
const ESBUILD_REL = 'node_modules/esbuild/bin/esbuild';
const PINS = {
  "vite.config.js": "4b0866ecaacafc2f497010f37c40de9377766f554ca06989efd3ff027a4fff5e",
  "client/postcss.config.js": "c14012cb0c28be42b5f7f84ff408983939df2597d4037c5409ee47814fc17b10",
  "client/tsconfig.json": "572f19c483057a7ac7bace550896eea0a6c81e58c2025d348d0ac9ff5e945a9e",
  "tailwind.config.js": "87a9665c33337dd4d0a4192702895926f2d8256838637838ec960398c0a0acc2",
  "node_modules/vite/package.json": "a2b943431b51bfcc2e9386eecf8b4b3f6e4bf443e56d17b1f4c8495a61b4050c",
  "node_modules/rollup-plugin-visualizer/package.json": "90bd00f65f82ef3d9793f59c1874a27438923bef0d270e37f9e25d9c507e8c36",
  "node_modules/postcss/package.json": "e0f23518d0e8fc0570ac68438eff7ecc7554774de3194af6f54f502e33f0c25b",
  "node_modules/tailwindcss/package.json": "3dc86b46c511947ca00838aa3f1776243abe923ac347c092e60a0cbc7ae68559",
  "node_modules/@tailwindcss/postcss/package.json": "2f8268cf1c0b9947d4f5fc6de60d45d2ee0bac3523c485c15722d2f8de7a65b4",
  "package.json": "0f7ef43511c004e3d268a2e2840d46a264453892937f5a2eb6a680b01481c1e0",
  "scripts/security/verify-auth-session-contracts.mjs": "71d2009a0c2b13001dc0e0606b72973527f6646ea091540dd3f4bd3311f4905f",
  "server/routes/auth.mjs": "fd4d9d7cfc75e23fc60dde5df5139ffb1fc826a338acf3c9cc7c2faba4ce362c",
  "server/services/refreshTokens.service.mjs": "5a9756caa3c772ac8c70f4a7860372dd42895e7df47c4e0956e42fa041528e8e",
  "server/routes/account.mjs": "e766374c5bc57032a5ad8573ed1c9bb37ef66dceb703957bf2bba289a5acd331",
  "server/app.mjs": "fb7316818f033e5748f7710a8c7c6f01991f03da6aa649a56189fbab71329818",
  "server/security/csrf.mjs": "648e21f3eb89933aeaaad1e967c59640cc52d2f8634002d3abbc6dafe358bce1",
  "server/replit_integrations/auth/replitAuth.mjs": "6235fd16449ca0974cc9d5103c1c3ae42e5ace1b7bbcdb6d3351aa7fbae7f9f2",
  "client/src/context/AuthContext.jsx": "ab68888ba5ebdc783ef77260c33546a1d4638b3950205e71c4210862f927c61d",
  "client/src/api/fetchWithAuth.js": "6c1ac4bca06cee87b46194521b3162cd82f31e364ee7862172b49abb168c6ef9",
  "client/src/lib/queryClient.js": "791ad03c4678a60a2582386a70d8798d5ced77089bf300207f053ea17b5f1388",
  "server/utils/cookies.mjs": "67d22050139f06abef51675f960607db950319de3ad590b80b8adf7991ef80b3",
  ".replit": "fdd7294d6332ab7814be58d8021b3ffee7e5f2157c035752454c541d3de34b63",
  "server/replit_integrations/auth/index.mjs": "96c6aacd6ee1239771cd50479b2090f2c90a141f948f7e48af279a9afd41d47a",
  "server/auth/mfa.service.mjs": "257135ac9d20fe3b96276011be6ea5d47770dd568af70653f11227ecc3aaf364",
  "server/db/sessionStore.mjs": "23f26b54c3b75135348f0c9fcb9193893f0e09fc8f471195c3d62969eaf8c6fb",
  "node_modules/typescript/package.json": "9332e97c30d3e53ed54910b89207ed657fb444066484df6e5b6965bf130865e9",
  "node_modules/typescript/lib/typescript.js": "569177652966bd528c319171c7dd22860dbf72bde116cbc4f644f1d02bb12e39",
  "package-lock.json": "648b869facffba16150769018ee062210691bd4ff10819ca379f501bfdb8d287",
  "scripts/build-server.mjs": "95fd8ce7393f7b99c32d2fad346bb580f736301aa891085e384b911e04d1394c",
  "tsconfig.json": "ca65a65cc06d0224dde35f5a8a635fc8f9527770d8c96211ce36b3ebb29548ed",
  "server/db/schema.canonical.sql": "e92e18c4d6bbfdf6faef7760e1116aa786b7b9dddc266db37c2f03998913e712",
  "node_modules/esbuild/package.json": "9d0bc453f4e791553c4cc2298ba023b409241fd9801e494741666eb0f6051490",
  "node_modules/esbuild/bin/esbuild": "e1698a3d5c6c0798fee4fd3b5cc816651f460c63d390a7a26ea4beb0b1884100",
  "node_modules/bcrypt/package.json": "33510b2b8859265a413ab101cdf961b1c9b076d93496f52d8ac7eacc007859a4",
  "node_modules/node-gyp-build/package.json": "9e8def3fbf123e28aa1ca4b6aa557fba4e66eecf6e86d170b61ec1c7ed51305d",
  "node_modules/@vitejs/plugin-react/package.json": "c5420bbbe5ea17fec4b09d44114f9eedd774efbfcc6f9a1d6228103b590af705",
  "dist/server.mjs": "74800300f01552beab4749dc0d6566488bb04a89e488075615198fb559d1b7a2",
  "dist/schema.canonical.sql": "9018cdef35b7585d18918c10f56cc0802afaf369cc7f05bc7efa9624979ddb7b",
  "client/dist/index.html": "957f6d802cda8b8fc0b5b4f0a7ce429a26d6a27638399e787e0de5f368bea393",
  "dist/client/dist/index.html": "7ff9516e7145f55e26c3ee8caccb1abe6dea74bf646cd5ad6738a66009d0d226",
  "bundle-report.html": "40b6a2dd45c614a8e2bec05de9692fac05cac65f5684169cf5eb7b89b1cc27f9"
};
const ROOT = fs.realpathSync('.');
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const gate = (ok, code, detail = {}) => {
  if (!ok) throw Object.assign(new Error(code), { gate: code, detail });
};
const inside = (root, full) => full.startsWith(root + path.sep);
const privatePath = value => /(?:^|\/)(?:\.env(?:\.|$)|\.npmrc$|\.git(?:\/|$))|\.(?:pem|key|p12|pfx)$/i.test(value);
const publicPath = value => typeof value === 'string' && value.length <= 300 &&
  /^[A-Za-z0-9_@.+/-]+$/.test(value) && !privatePath(value) &&
  !path.isAbsolute(value) && !value.split('/').some(x => x === '..' || x === '.');
const label = value => publicPath(value) ? value : 'REDACTED_PATH_' + hash(String(value)).slice(0, 12);
// No npm commands, project scripts, application imports or inherited child secrets.
const MIN_ENV = { PATH: '/usr/local/bin:/usr/bin:/bin', LANG: 'C', LC_ALL: 'C',
  NODE_ENV: 'production', GIT_OPTIONAL_LOCKS: '0' };
// Replit's git may live in a Nix store, outside the compiler's minimal PATH.
const GIT_BIN = (process.env.PATH || '').split(path.delimiter).filter(path.isAbsolute)
  .map(dir => path.join(dir, 'git')).find(file => {
    try { fs.accessSync(file, fs.constants.X_OK); return fs.statSync(file).isFile(); }
    catch { return false; }
  });
const git = (...args) => execFileSync(GIT_BIN || '/usr/bin/git', ['-c', 'core.fsmonitor=false',
  '-c', 'core.untrackedCache=false', ...args], {
  cwd: ROOT, env: MIN_ENV, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'],
  timeout: 30000, maxBuffer: 64 * 1024 * 1024
});

function identity(full, allowLink = false, readPolicy = null) {
  gate(inside(ROOT, full), 'INPUT_OUTSIDE_WORKSPACE');
  const rel = path.relative(ROOT, full);
  if (readPolicy) gate(readPolicy(rel), 'METAFILE_PRIVATE_OR_UNSUPPORTED_INPUT', { file: label(rel) });
  let cursor = ROOT;
  for (const part of rel.split(path.sep)) {
    cursor = path.join(cursor, part);
    try {
      const st = fs.lstatSync(cursor);
      gate(!st.isSymbolicLink() || allowLink, 'INPUT_SYMLINK', { file: label(rel) });
    } catch (error) {
      if (error.code === 'ENOENT') return { state: 'ABSENT' };
      throw error;
    }
  }
  const resolved = fs.realpathSync(full);
  gate(inside(ROOT, resolved), 'RESOLVED_INPUT_OUTSIDE_WORKSPACE', { file: label(rel) });
  // Enforce the resolved read boundary before any file-content hashing.
  if (readPolicy) gate(readPolicy(path.relative(ROOT, resolved)),
    'METAFILE_PRIVATE_OR_UNSUPPORTED_RESOLUTION', { file: label(rel) });
  const st = fs.statSync(full);
  gate(st.isFile() && st.size <= 256 * 1024 * 1024, 'INPUT_FILE_LIMIT', { file: label(rel) });
  const fd = fs.openSync(full, 'r'), buffer = Buffer.alloc(1024 * 1024);
  const digest = crypto.createHash('sha256');
  try {
    let count;
    while ((count = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0) digest.update(buffer.subarray(0, count));
  } finally { fs.closeSync(fd); }
  const after = fs.statSync(full);
  gate(after.ino === st.ino && after.size === st.size && after.mtimeMs === st.mtimeMs && after.mode === st.mode,
    'INPUT_CHANGED_DURING_HASH', { file: label(rel) });
  return { state: 'FILE', sha256: digest.digest('hex'), bytes: st.size, mode: st.mode,
    resolved: path.relative(ROOT, resolved) };
}
function rawIdentity(rel) {
  const full = path.resolve(ROOT, rel);
  gate(inside(ROOT, full), 'WORKTREE_PATH_OUTSIDE_ROOT');
  try {
    const st = fs.lstatSync(full);
    if (st.isSymbolicLink()) return { state: 'SYMLINK', mode: st.mode, sha256: hash(fs.readlinkSync(full)) };
  } catch (error) { if (error.code === 'ENOENT') return { state: 'ABSENT' }; throw error; }
  return identity(full, true);
}
function snapshot() {
  // git status/diff can invoke clean filters. Hash file bytes and index instead.
  const names = [...new Set(git('ls-files', '--cached', '--others', '--exclude-standard', '-z')
    .split('\0').filter(Boolean))].sort();
  gate(names.length <= 30000, 'WORKTREE_FILE_COUNT_LIMIT');
  let total = 0;
  const records = names.map(file => {
    const record = rawIdentity(file);
    total += record.bytes || 0;
    gate(total <= 4 * 1024 ** 3, 'WORKTREE_SIZE_LIMIT');
    return [file, record];
  });
  const index = path.relative(ROOT, path.resolve(ROOT, git('rev-parse', '--git-path', 'index').trim()));
  return { head: git('rev-parse', 'HEAD').trim(), branch: git('branch', '--show-current').trim(),
    index: rawIdentity(index), stagedEntriesSha256: hash(git('ls-files', '--stage', '-z')),
    trackedFlagsSha256: hash(git('ls-files', '-v', '-z')),
    worktree: hash(JSON.stringify(records)), files: names.length, records };
}
function snapshotDifference(before, after) {
  const components = ['head', 'branch', 'index', 'stagedEntriesSha256', 'trackedFlagsSha256', 'worktree', 'files']
    .filter(key => JSON.stringify(before[key]) !== JSON.stringify(after[key]));
  const b = new Map(before.records), a = new Map(after.records), changes = [];
  for (const file of [...new Set([...b.keys(), ...a.keys()])].sort()) {
    const old = b.get(file), next = a.get(file);
    if (JSON.stringify(old) !== JSON.stringify(next)) changes.push({ file: label(file),
      fields: [...new Set([...Object.keys(old || {}), ...Object.keys(next || {})])]
        .filter(key => JSON.stringify(old?.[key]) !== JSON.stringify(next?.[key])) });
  }
  return { components, changedFileCount: changes.length, changes: changes.slice(0, 40),
    rawIndexOnly: components.length === 1 && components[0] === 'index',
    scope: 'CURRENT_R12_OBSERVATIONS_ONLY_NOT_HISTORICAL_RUNS' };
}
function checkPins() {
  const result = {};
  for (const [rel, expected] of Object.entries(PINS)) {
    const observed = identity(path.join(ROOT, rel), rel.startsWith('node_modules/'));
    gate(observed.sha256 === expected, 'R10A_BASELINE_DRIFT', { file: label(rel) });
    result[rel] = observed;
  }
  return result;
}
function readJSON(full, max = 32 * 1024 * 1024) {
  const st = fs.lstatSync(full);
  gate(st.isFile() && st.size <= max, 'JSON_FILE_LIMIT');
  return JSON.parse(fs.readFileSync(full, 'utf8'));
}
function outputIdentity(full) {
  const st = fs.lstatSync(full);
  gate(st.isFile() && st.size <= 64 * 1024 * 1024, 'OUTPUT_FILE_LIMIT');
  return { sha256: hash(fs.readFileSync(full)), bytes: st.size };
}
// Filenames stay data for filesystem APIs. Display policy remains separate.
const sourcePath = rel => typeof rel === 'string' && rel.length <= 1024 &&
  !path.isAbsolute(rel) && !/[\x00-\x1f\x7f]/.test(rel) && !privatePath(rel) &&
  !rel.split('/').some(x => !x || x === '.' || x === '..');
const TOOL_NAMES = ['vite', '@vitejs/plugin-react', 'rollup-plugin-visualizer',
  'postcss', '@tailwindcss/postcss', 'tailwindcss', 'autoprefixer', 'esbuild'];
const SOURCE_ROOTS = ['client', 'shared', 'attached_assets'];
function treeManifest(base, output = false) {
  const rows = [];
  let bytes = 0;
  if (!fs.existsSync(base)) return { state: 'ABSENT', rows };
  const boundary = output ? base : ROOT;
  function walk(dir) {
    const st = fs.lstatSync(dir);
    gate(st.isDirectory() && !st.isSymbolicLink() && fs.realpathSync(dir) === dir, 'TREE_DIRECTORY_SYMLINK');
    for (const entry of fs.readdirSync(dir).sort()) {
      const full = path.join(dir, entry), rel = path.relative(boundary, full);
      if (!output && ['client/dist', 'client/node_modules'].includes(path.relative(ROOT, full))) continue;
      gate(sourcePath(rel), 'PRIVATE_OR_UNSUPPORTED_TREE_PATH', { file: label(rel) });
      const item = fs.lstatSync(full);
      gate(!item.isSymbolicLink(), 'TREE_SYMLINK', { file: label(rel) });
      if (item.isDirectory()) walk(full);
      else {
        gate(item.isFile(), 'TREE_FILE_TYPE', { file: label(rel) });
        const id = output ? outputIdentity(full) : identity(full, false, sourcePath);
        bytes += id.bytes;
        gate(rows.length < 30000 && bytes <= 2 * 1024 ** 3, 'TREE_SIZE_LIMIT');
        rows.push({ file: rel, ...id });
      }
    }
  }
  walk(base);
  return { state: 'DIRECTORY', bytes, rows };
}
function sourceTrees() {
  return Object.fromEntries(SOURCE_ROOTS.map(name => [name, treeManifest(path.join(ROOT, name))]));
}
function toolTrees() {
  return Object.fromEntries(TOOL_NAMES.map(name => [name, treeManifest(path.join(ROOT, 'node_modules', name))]));
}
function compareTrees(before, after, gateName) {
  const changed = Object.keys(before).filter(name => JSON.stringify(before[name]) !== JSON.stringify(after[name]));
  gate(changed.length === 0, gateName, { trees: changed.map(label) });
}
function toolMetadata() {
  const lock = readJSON(path.join(ROOT, 'package-lock.json'));
  return TOOL_NAMES.map(name => {
    const rel = 'node_modules/' + name + '/package.json';
    const current = readJSON(path.join(ROOT, rel));
    gate(/^[0-9][A-Za-z0-9.+-]{0,60}$/.test(current.version), 'TOOL_VERSION_FORMAT', { name });
    const locked = lock.packages?.['node_modules/' + name]?.version;
    return { name, installed: current.version,
      locked: typeof locked === 'string' && /^[0-9][A-Za-z0-9.+-]{0,60}$/.test(locked) ? locked : null,
      alignment: current.version === locked ? 'VERSION_MATCH_ONLY' : 'PENDING',
      packageIdentity: identity(path.join(ROOT, rel), true, sourcePath) };
  });
}
function publicEnvReferences(trees) {
  const names = new Set();
  let dynamicSyntaxFiles = 0;
  for (const tree of Object.values(trees)) for (const row of tree.rows) {
    if (!/\.(?:[cm]?[jt]sx?|html|css)$/.test(row.file) || row.bytes > 2 * 1024 ** 2) continue;
    const src = fs.readFileSync(path.join(ROOT, row.file), 'utf8');
    for (const match of src.matchAll(/import\.meta\.env\.(VITE_[A-Z0-9_]{1,100})/g)) names.add(match[1]);
    if (/import\.meta\.env\s*\[/.test(src)) dynamicSyntaxFiles++;
  }
  return { referencedNames: [...names].sort().slice(0,100), dynamicSyntaxFiles,
    valuesReadOrForwarded: 0, qualification: 'LEXICAL_NAMES_ONLY_REQUIRED_VALUES_UNPROVEN' };
}
function graphManifest(graph) {
  gate(graph && Array.isArray(graph.modules) && graph.modules.length <= 30000 &&
    Array.isArray(graph.watchFiles) && graph.watchFiles.length <= 30000, 'INVALID_FRONTEND_GRAPH');
  const records = new Map(), virtual = new Set(), unresolved = new Set();
  function observe(id) {
    gate(typeof id === 'string' && id.length <= 8192, 'FRONTEND_GRAPH_ID_LIMIT');
    if (id.startsWith('\0') || id.startsWith('vite:') || id.startsWith('/@')) { virtual.add(hash(id)); return; }
    if (!path.isAbsolute(id)) { unresolved.add(hash(id)); return; }
    // Vite query suffixes describe transforms; literal # path components stay intact.
    const physical = id.split('?')[0], rel = path.relative(ROOT, physical);
    if (physical === ROOT) return;
    gate(inside(ROOT, physical) && sourcePath(rel), 'GRAPH_INPUT_BOUNDARY', { file: label(rel) });
    const stat = fs.statSync(physical);
    // Watch lists may contain directories; source/tool tree snapshots cover their selected roots.
    if (stat.isDirectory()) {
      gate(fs.realpathSync(physical) === physical, 'GRAPH_WATCH_DIRECTORY_SYMLINK', { file: label(rel) });
      return;
    }
    if (!records.has(rel)) records.set(rel, identity(physical, rel.startsWith('node_modules/'), sourcePath));
    gate(records.get(rel).state === 'FILE', 'GRAPH_INPUT_MISSING', { file: label(rel) });
  }
  for (const module of graph.modules) if (!module.isExternal) observe(module.id);
  for (const file of graph.watchFiles) observe(file);
  return { records: Object.fromEntries([...records].sort(([a],[b]) => a.localeCompare(b))),
    virtualCount: virtual.size, unresolvedCount: unresolved.size,
    scope: 'POST_BUILD_PHYSICAL_INPUT_OBSERVATIONS_NOT_ALL_TRANSITIVE_PREBUILD_IDENTITIES' };
}
function verifyGraph(observed) {
  for (const [rel, before] of Object.entries(observed.records)) {
    gate(JSON.stringify(identity(path.join(ROOT, rel), rel.startsWith('node_modules/'), sourcePath)) === JSON.stringify(before),
      'POST_BUILD_GRAPH_INPUT_DRIFT', { file: label(rel) });
  }
}
function validateOutputs(base, emitted, tree) {
  gate(Array.isArray(emitted) && emitted.length <= 30000, 'INVALID_EMITTED_LIST');
  const names = new Set(tree.rows.map(x => x.file));
  gate(names.has('index.html') && tree.rows.find(x => x.file === 'index.html').bytes > 0, 'FRONTEND_INDEX_MISSING');
  gate(emitted.some(x => x.type === 'chunk' && x.isEntry && /\.[cm]?js$/.test(x.fileName)
    && tree.rows.some(row => row.file === x.fileName && row.bytes > 0)), 'FRONTEND_ENTRY_MISSING');
  gate(tree.rows.some(x => x.file.endsWith('.css') && x.bytes > 0), 'FRONTEND_CSS_MISSING');
  let localReferences = 0, externalReferences = 0;
  const rootURL = new URL('https://mmhb.invalid/');
  function urlReference(ref, from = 'index.html') {
    gate(typeof ref === 'string' && ref.length <= 8192, 'OUTPUT_REFERENCE_FORMAT');
    const url = new URL(ref, new URL(from, rootURL));
    if (url.origin !== rootURL.origin) { externalReferences++; return; }
    const decoded = decodeURIComponent(url.pathname).replace(/^\//, '');
    gate(sourcePath(decoded) && names.has(decoded), 'OUTPUT_LOCAL_REFERENCE_MISSING', { file: label(decoded) });
    localReferences++;
  }
  for (const entry of emitted) {
    gate(sourcePath(entry.fileName) && names.has(entry.fileName), 'EMITTED_OUTPUT_MISSING', { file: label(entry.fileName) });
    // Bundler imports, unlike HTML URLs, are output-root file names.
    for (const kind of ['imports', 'dynamicImports', 'referencedFiles', 'css', 'assets']) {
      gate(entry[kind] === undefined || Array.isArray(entry[kind]), 'OUTPUT_REFERENCE_LIST');
      for (const ref of entry[kind] || []) {
        if (names.has(ref)) localReferences++;
        else if (/^(?:https?:|data:|\/\/)/.test(ref)) externalReferences++;
        else gate(false, 'OUTPUT_LOCAL_REFERENCE_MISSING', { file: label(ref) });
      }
    }
  }
  const html = fs.readFileSync(path.join(base, 'index.html'), 'utf8');
  for (const match of html.matchAll(/<(script|link)\b[^>]*>/gi)) {
    const tag = match[0], attrs = new Map([...tag.matchAll(/([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)]
      .map(m => [m[1].toLowerCase(), m[2] ?? m[3]]));
    if (match[1].toLowerCase() === 'script' && attrs.has('src')) urlReference(attrs.get('src'));
    if (match[1].toLowerCase() === 'link' && /^(stylesheet|modulepreload)$/i.test(attrs.get('rel') || '') && attrs.has('href')) urlReference(attrs.get('href'));
  }
  return { localReferences, externalReferences, htmlParser: 'BOUNDED_QUOTED_ATTRIBUTE_SCAN_NOT_BROWSER_VALIDATION' };
}

const RUNNER_B64 = 'aW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnOwppbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnOwppbXBvcnQgeyBjcmVhdGVSZXF1aXJlIH0gZnJvbSAnbm9kZTptb2R1bGUnOwppbXBvcnQgeyBwYXRoVG9GaWxlVVJMIH0gZnJvbSAnbm9kZTp1cmwnOwoKLy8gVGhpcyBjaGlsZCBleGVjdXRlcyB0aGUgcmV2aWV3ZWQgYnVpbGQgY29uZmlndXJhdGlvbiBhbmQgYnVpbGQgdG9vbHMgb25seS4KLy8gVGhlIHBhcmVudCB2YWxpZGF0ZXMgc291cmNlL3Rvb2wgaWRlbnRpdGllcywgb3ducyB0aGUgdGltZW91dCBhbmQgdmVyaWZpZXMKLy8gY2FuZGlkYXRlIG91dHB1dHMuIE5vIGFwcGxpY2F0aW9uIHNlcnZlciwgcGFja2FnZSBtYW5hZ2VyIG9yIGluc3RhbGxlciBydW5zLgpjb25zdCBST09UID0gJy9ob21lL3J1bm5lci93b3Jrc3BhY2UnOwpjb25zdCByZXBvcnREaXIgPSBwcm9jZXNzLmFyZ3ZbMl07CmNvbnN0IExJTUlUID0geyBlbnRyaWVzOiAxMDAwMDAsIHN0cmluZzogMzI3NjgsIGV2aWRlbmNlOiA2NCAqIDEwMjQgKiAxMDI0LCBhc3NldDogNjQgKiAxMDI0ICogMTAyNCB9OwpsZXQgcGhhc2UgPSAnVkFMSURBVEVfQ0hJTERfQ09OVEVYVCc7CmxldCByZWFkeSA9IGZhbHNlOwpsZXQgcmVzb2x2ZWRFdmlkZW5jZTsKbGV0IGdyYXBoID0geyBtb2R1bGVzOiBbXSwgd2F0Y2hGaWxlczogW10sIGNhcHR1cmVkQXQ6IFtdLCBtb2R1bGVJZHNTdXBwb3J0ZWQ6IGZhbHNlLCB3YXRjaEZpbGVzU3VwcG9ydGVkOiBmYWxzZSB9OwpsZXQgZW1pdHRlZCA9IFtdOwoKZnVuY3Rpb24gZmFpbChjb2RlKSB7IGNvbnN0IGUgPSBuZXcgRXJyb3IoY29kZSk7IGUuY29kZSA9IGNvZGU7IHRocm93IGU7IH0KZnVuY3Rpb24gZW5zdXJlKHZhbHVlLCBjb2RlKSB7IGlmICghdmFsdWUpIGZhaWwoY29kZSk7IH0KZnVuY3Rpb24gYm91bmRlZFN0cmluZyh2YWx1ZSkgewogIGVuc3VyZSh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICYmIHZhbHVlLmxlbmd0aCA8PSBMSU1JVC5zdHJpbmcsICdVTlNVUFBPUlRFRF9FVklERU5DRV9TVFJJTkcnKTsKICByZXR1cm4gdmFsdWU7Cn0KZnVuY3Rpb24gc3RyaW5ncyh2YWx1ZXMpIHsKICBlbnN1cmUodmFsdWVzICYmIHR5cGVvZiB2YWx1ZXNbU3ltYm9sLml0ZXJhdG9yXSA9PT0gJ2Z1bmN0aW9uJywgJ1VOU1VQUE9SVEVEX0VWSURFTkNFX0xJU1QnKTsKICBjb25zdCByZXN1bHQgPSBbXTsKICBmb3IgKGNvbnN0IHZhbHVlIG9mIHZhbHVlcykgewogICAgZW5zdXJlKHJlc3VsdC5sZW5ndGggPCBMSU1JVC5lbnRyaWVzLCAnRVZJREVOQ0VfRU5UUllfTElNSVQnKTsKICAgIHJlc3VsdC5wdXNoKGJvdW5kZWRTdHJpbmcodmFsdWUpKTsKICB9CiAgcmV0dXJuIFsuLi5uZXcgU2V0KHJlc3VsdCldLnNvcnQoKTsKfQpmdW5jdGlvbiB3cml0ZUV2aWRlbmNlKG5hbWUsIHZhbHVlKSB7CiAgY29uc3QgZW5jb2RlZCA9IEpTT04uc3RyaW5naWZ5KHZhbHVlLCBudWxsLCAyKSArICdcbic7CiAgZW5zdXJlKEJ1ZmZlci5ieXRlTGVuZ3RoKGVuY29kZWQpIDw9IExJTUlULmV2aWRlbmNlLCAnRVZJREVOQ0VfU0laRV9MSU1JVCcpOwogIGNvbnN0IGZ1bGwgPSBwYXRoLmpvaW4ocmVwb3J0RGlyLCBuYW1lKTsKICBmcy53cml0ZUZpbGVTeW5jKGZ1bGwsIGVuY29kZWQsIHsgZW5jb2Rpbmc6ICd1dGY4JywgbW9kZTogMG82MDAsIGZsYWc6ICd3eCcgfSk7Cn0KZnVuY3Rpb24gYXNzZXROYW1lKHZhbHVlKSB7CiAgYm91bmRlZFN0cmluZyh2YWx1ZSk7CiAgZW5zdXJlKHZhbHVlICYmICFwYXRoLmlzQWJzb2x1dGUodmFsdWUpICYmICF2YWx1ZS5pbmNsdWRlcygnXFwnKSAmJiAhL1tceDAwLVx4MWZceDdmXS8udGVzdCh2YWx1ZSkKICAgICYmICF2YWx1ZS5zcGxpdCgnLycpLnNvbWUocCA9PiBwID09PSAnJyB8fCBwID09PSAnLicgfHwgcCA9PT0gJy4uJyksICdVTlNVUFBPUlRFRF9PVVRQVVRfUEFUSCcpOwogIHJldHVybiB2YWx1ZTsKfQpmdW5jdGlvbiBvdXRwdXRGaWxlKHJlbGF0aXZlKSB7CiAgY29uc3QgbmFtZSA9IGFzc2V0TmFtZShyZWxhdGl2ZSk7CiAgY29uc3QgZnVsbCA9IHBhdGguam9pbihyZXBvcnREaXIsICdmcm9udGVuZCcsIG5hbWUpOwogIGNvbnN0IHJvb3QgPSBwYXRoLmpvaW4ocmVwb3J0RGlyLCAnZnJvbnRlbmQnKTsKICBsZXQgY3Vyc29yID0gcm9vdDsKICBlbnN1cmUoZnMubHN0YXRTeW5jKGN1cnNvcikuaXNEaXJlY3RvcnkoKSwgJ09VVFBVVF9ESVJFQ1RPUllfSU5WQUxJRCcpOwogIGZvciAoY29uc3QgY29tcG9uZW50IG9mIG5hbWUuc3BsaXQoJy8nKSkgewogICAgY3Vyc29yID0gcGF0aC5qb2luKGN1cnNvciwgY29tcG9uZW50KTsKICAgIGVuc3VyZSghZnMubHN0YXRTeW5jKGN1cnNvcikuaXNTeW1ib2xpY0xpbmsoKSwgJ09VVFBVVF9TWU1MSU5LX1JFSkVDVEVEJyk7CiAgfQogIGNvbnN0IHN0YXQgPSBmcy5zdGF0U3luYyhmdWxsKTsKICBlbnN1cmUoc3RhdC5pc0ZpbGUoKSAmJiBzdGF0LnNpemUgPD0gTElNSVQuYXNzZXQsICdPVVRQVVRfRklMRV9JTlZBTElEJyk7CiAgcmV0dXJuIHsgZnVsbCwgYnl0ZXM6IHN0YXQuc2l6ZSB9Owp9CmZ1bmN0aW9uIGNvbGxlY3RHcmFwaChjb250ZXh0LCBhdCkgewogIGNvbnN0IGhhc0lkcyA9IHR5cGVvZiBjb250ZXh0LmdldE1vZHVsZUlkcyA9PT0gJ2Z1bmN0aW9uJzsKICBjb25zdCBoYXNXYXRjaCA9IHR5cGVvZiBjb250ZXh0LmdldFdhdGNoRmlsZXMgPT09ICdmdW5jdGlvbic7CiAgaWYgKGhhc0lkcykgewogICAgZ3JhcGgubW9kdWxlSWRzU3VwcG9ydGVkID0gdHJ1ZTsKICAgIGdyYXBoLm1vZHVsZXMgPSBzdHJpbmdzKGNvbnRleHQuZ2V0TW9kdWxlSWRzKCkpLm1hcChpZCA9PiB7CiAgICAgIGNvbnN0IGluZm8gPSB0eXBlb2YgY29udGV4dC5nZXRNb2R1bGVJbmZvID09PSAnZnVuY3Rpb24nID8gY29udGV4dC5nZXRNb2R1bGVJbmZvKGlkKSA6IG51bGw7CiAgICAgIHJldHVybiB7CiAgICAgICAgaWQsCiAgICAgICAgaW1wb3J0ZWRJZHM6IHN0cmluZ3MoaW5mbz8uaW1wb3J0ZWRJZHMgfHwgW10pLAogICAgICAgIGR5bmFtaWNhbGx5SW1wb3J0ZWRJZHM6IHN0cmluZ3MoaW5mbz8uZHluYW1pY2FsbHlJbXBvcnRlZElkcyB8fCBbXSksCiAgICAgICAgaXNFbnRyeTogaW5mbz8uaXNFbnRyeSA9PT0gdHJ1ZSwKICAgICAgICBpc0V4dGVybmFsOiBpbmZvPy5pc0V4dGVybmFsID09PSB0cnVlLAogICAgICB9OwogICAgfSk7CiAgfQogIGlmIChoYXNXYXRjaCkgewogICAgZ3JhcGgud2F0Y2hGaWxlc1N1cHBvcnRlZCA9IHRydWU7CiAgICBncmFwaC53YXRjaEZpbGVzID0gc3RyaW5ncyhjb250ZXh0LmdldFdhdGNoRmlsZXMoKSk7CiAgfQogIGdyYXBoLmNhcHR1cmVkQXQucHVzaChhdCk7Cn0KZnVuY3Rpb24gY29sbGVjdEVtaXR0ZWQoYnVuZGxlKSB7CiAgZW5zdXJlKGJ1bmRsZSAmJiB0eXBlb2YgYnVuZGxlID09PSAnb2JqZWN0JyAmJiBPYmplY3Qua2V5cyhidW5kbGUpLmxlbmd0aCA8PSBMSU1JVC5lbnRyaWVzLCAnT1VUUFVUX0VOVFJZX0xJTUlUJyk7CiAgcmV0dXJuIE9iamVjdC52YWx1ZXMoYnVuZGxlKS5tYXAoaXRlbSA9PiB7CiAgICBjb25zdCBmaWxlTmFtZSA9IGFzc2V0TmFtZShpdGVtLmZpbGVOYW1lKTsKICAgIGVuc3VyZShpdGVtLnR5cGUgPT09ICdhc3NldCcgfHwgaXRlbS50eXBlID09PSAnY2h1bmsnLCAnVU5TVVBQT1JURURfT1VUUFVUX1RZUEUnKTsKICAgIGlmIChpdGVtLnR5cGUgPT09ICdhc3NldCcpIHsKICAgICAgcmV0dXJuIHsgZmlsZU5hbWUsIHR5cGU6ICdhc3NldCcsIGJ5dGVzOiBCdWZmZXIuYnl0ZUxlbmd0aChpdGVtLnNvdXJjZSksCiAgICAgICAgbmFtZXM6IHN0cmluZ3MoaXRlbS5uYW1lcyB8fCAoaXRlbS5uYW1lID8gW2l0ZW0ubmFtZV0gOiBbXSkpLAogICAgICAgIG9yaWdpbmFsRmlsZU5hbWVzOiBzdHJpbmdzKGl0ZW0ub3JpZ2luYWxGaWxlTmFtZXMgfHwgW10pIH07CiAgICB9CiAgICByZXR1cm4gewogICAgICBmaWxlTmFtZSwgdHlwZTogJ2NodW5rJywgYnl0ZXM6IEJ1ZmZlci5ieXRlTGVuZ3RoKGl0ZW0uY29kZSksIGlzRW50cnk6IGl0ZW0uaXNFbnRyeSA9PT0gdHJ1ZSwKICAgICAgaXNEeW5hbWljRW50cnk6IGl0ZW0uaXNEeW5hbWljRW50cnkgPT09IHRydWUsIGZhY2FkZU1vZHVsZUlkOiBpdGVtLmZhY2FkZU1vZHVsZUlkID09PSBudWxsID8gbnVsbCA6IGJvdW5kZWRTdHJpbmcoaXRlbS5mYWNhZGVNb2R1bGVJZCB8fCAnJyksCiAgICAgIGltcG9ydHM6IHN0cmluZ3MoaXRlbS5pbXBvcnRzIHx8IFtdKSwgZHluYW1pY0ltcG9ydHM6IHN0cmluZ3MoaXRlbS5keW5hbWljSW1wb3J0cyB8fCBbXSksCiAgICAgIHJlZmVyZW5jZWRGaWxlczogc3RyaW5ncyhpdGVtLnJlZmVyZW5jZWRGaWxlcyB8fCBbXSksIGltcGxpY2l0bHlMb2FkZWRCZWZvcmU6IHN0cmluZ3MoaXRlbS5pbXBsaWNpdGx5TG9hZGVkQmVmb3JlIHx8IFtdKSwKICAgICAgY3NzOiBzdHJpbmdzKGl0ZW0udml0ZU1ldGFkYXRhPy5pbXBvcnRlZENzcyB8fCBbXSksIGFzc2V0czogc3RyaW5ncyhpdGVtLnZpdGVNZXRhZGF0YT8uaW1wb3J0ZWRBc3NldHMgfHwgW10pLAogICAgICBtb2R1bGVJZHM6IHN0cmluZ3MoT2JqZWN0LmtleXMoaXRlbS5tb2R1bGVzIHx8IHt9KSksCiAgICB9OwogIH0pLnNvcnQoKGEsIGIpID0+IGEuZmlsZU5hbWUubG9jYWxlQ29tcGFyZShiLmZpbGVOYW1lKSk7Cn0KCnRyeSB7CiAgZW5zdXJlKHByb2Nlc3MuY3dkKCkgPT09IFJPT1QgJiYgZnMucmVhbHBhdGhTeW5jKFJPT1QpID09PSBST09ULCAnV1JPTkdfV09SS1NQQUNFJyk7CiAgZW5zdXJlKHR5cGVvZiByZXBvcnREaXIgPT09ICdzdHJpbmcnICYmIHBhdGguaXNBYnNvbHV0ZShyZXBvcnREaXIpLCAnUkVQT1JUX1BBVEhfUkVRVUlSRUQnKTsKICBlbnN1cmUoZnMucmVhbHBhdGhTeW5jKHJlcG9ydERpcikgPT09IHJlcG9ydERpciAmJiBmcy5sc3RhdFN5bmMocmVwb3J0RGlyKS5pc0RpcmVjdG9yeSgpLCAnUkVQT1JUX0RJUkVDVE9SWV9JTlZBTElEJyk7CiAgZW5zdXJlKHBhdGguZGlybmFtZShyZXBvcnREaXIpID09PSAnL3RtcCcgJiYgcGF0aC5iYXNlbmFtZShyZXBvcnREaXIpLnN0YXJ0c1dpdGgoJ21taGItJyksICdSRVBPUlRfRElSRUNUT1JZX1NDT1BFJyk7CiAgZW5zdXJlKChmcy5zdGF0U3luYyhyZXBvcnREaXIpLm1vZGUgJiAwbzA3NykgPT09IDAsICdSRVBPUlRfRElSRUNUT1JZX05PVF9QUklWQVRFJyk7CiAgZW5zdXJlKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicsICdQUk9EVUNUSU9OX0VOVl9SRVFVSVJFRCcpOwogIHByb2Nlc3MudW1hc2soMG8wNzcpOwogIHJlYWR5ID0gdHJ1ZTsKICBjb25zdCByZXF1aXJlRnJvbVJvb3QgPSBjcmVhdGVSZXF1aXJlKHBhdGguam9pbihST09ULCAncGFja2FnZS5qc29uJykpOwogIGNvbnN0IGltcG9ydERlcGVuZGVuY3kgPSBzcGVjaWZpZXIgPT4gaW1wb3J0KHBhdGhUb0ZpbGVVUkwocmVxdWlyZUZyb21Sb290LnJlc29sdmUoc3BlY2lmaWVyKSkuaHJlZik7CgogIHBoYXNlID0gJ0lNUE9SVF9SRVZJRVdFRF9CVUlMRF9UT09MUyc7CiAgY29uc3Qgdml0ZSA9IGF3YWl0IGltcG9ydERlcGVuZGVuY3koJ3ZpdGUnKTsKICBjb25zdCB7IHZpc3VhbGl6ZXIgfSA9IGF3YWl0IGltcG9ydERlcGVuZGVuY3koJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcicpOwogIGNvbnN0IHRhaWx3aW5kUG9zdGNzc01vZHVsZSA9IGF3YWl0IGltcG9ydERlcGVuZGVuY3koJ0B0YWlsd2luZGNzcy9wb3N0Y3NzJyk7CiAgY29uc3QgYXV0b3ByZWZpeGVyTW9kdWxlID0gYXdhaXQgaW1wb3J0RGVwZW5kZW5jeSgnYXV0b3ByZWZpeGVyJyk7CiAgZW5zdXJlKHR5cGVvZiB2aXRlLmJ1aWxkID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiB2aXN1YWxpemVyID09PSAnZnVuY3Rpb24nLCAnQlVJTERfQVBJX1VOQVZBSUxBQkxFJyk7CiAgY29uc3QgdGFpbHdpbmRQb3N0Y3NzID0gdGFpbHdpbmRQb3N0Y3NzTW9kdWxlLmRlZmF1bHQ7CiAgY29uc3QgYXV0b3ByZWZpeGVyID0gYXV0b3ByZWZpeGVyTW9kdWxlLmRlZmF1bHQ7CiAgZW5zdXJlKHR5cGVvZiB0YWlsd2luZFBvc3Rjc3MgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGF1dG9wcmVmaXhlciA9PT0gJ2Z1bmN0aW9uJywgJ1BPU1RDU1NfRkFDVE9SWV9VTkFWQUlMQUJMRScpOwoKICBwaGFzZSA9ICdJTVBPUlRfUElOTkVEX1JPT1RfQ09ORklHJzsKICBjb25zdCB7IGRlZmF1bHQ6IGNvbmZpZyB9ID0gYXdhaXQgaW1wb3J0KHBhdGhUb0ZpbGVVUkwocGF0aC5qb2luKFJPT1QsICd2aXRlLmNvbmZpZy5qcycpKS5ocmVmKTsKICBlbnN1cmUoY29uZmlnICYmIHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KGNvbmZpZyksICdST09UX0NPTkZJR19OT1RfT0JKRUNUJyk7CiAgZW5zdXJlKEFycmF5LmlzQXJyYXkoY29uZmlnLnBsdWdpbnMpICYmIGNvbmZpZy5wbHVnaW5zLmxlbmd0aCA9PT0gMgogICAgJiYgY29uZmlnLnBsdWdpbnNbMV0/Lm5hbWUgPT09ICd2aXN1YWxpemVyJywgJ1JPT1RfQ09ORklHX1BMVUdJTl9TSEFQRV9DSEFOR0VEJyk7CiAgZW5zdXJlKHBhdGgucmVzb2x2ZShjb25maWcucm9vdCkgPT09IHBhdGguam9pbihST09ULCAnY2xpZW50JyksICdST09UX0NPTkZJR19DTElFTlRfUk9PVF9DSEFOR0VEJyk7CiAgZW5zdXJlKGNvbmZpZy5idWlsZCAmJiBjb25maWcuYnVpbGQucm9sbHVwT3B0aW9ucz8uaW5wdXQgPT09IHBhdGguam9pbihST09ULCAnY2xpZW50L2luZGV4Lmh0bWwnKSwgJ1JPT1RfQ09ORklHX0VOVFJZX0NIQU5HRUQnKTsKICBlbnN1cmUoY29uZmlnLmRlZmluZT8uWydwcm9jZXNzLmVudi5OT0RFX0VOViddID09PSAnInByb2R1Y3Rpb24iJywgJ1JPT1RfQ09ORklHX1BST0RVQ1RJT05fREVGSU5FX0NIQU5HRUQnKTsKICBjb25zdCBwb3N0Y3NzUGx1Z2lucyA9IFt0YWlsd2luZFBvc3Rjc3Moe30pLCBhdXRvcHJlZml4ZXIoe30pXTsKICBlbnN1cmUocG9zdGNzc1BsdWdpbnNbMF0/LnBvc3Rjc3NQbHVnaW4gPT09ICdAdGFpbHdpbmRjc3MvcG9zdGNzcycKICAgICYmIHBvc3Rjc3NQbHVnaW5zWzFdPy5wb3N0Y3NzUGx1Z2luID09PSAnYXV0b3ByZWZpeGVyJywgJ1BPU1RDU1NfUExVR0lOX1NIQVBFX0NIQU5HRUQnKTsKCiAgY29uc3QgZnJvbnRlbmREaXIgPSBwYXRoLmpvaW4ocmVwb3J0RGlyLCAnZnJvbnRlbmQnKTsKICBjb25zdCBjYWNoZURpciA9IHBhdGguam9pbihyZXBvcnREaXIsICdjYWNoZScpOwogIGVuc3VyZSghZnMuZXhpc3RzU3luYyhmcm9udGVuZERpcikgJiYgIWZzLmV4aXN0c1N5bmMoY2FjaGVEaXIpLCAnQ0FORElEQVRFX0RJUkVDVE9SWV9BTFJFQURZX0VYSVNUUycpOwogIGNvbnN0IGV2aWRlbmNlUGx1Z2luID0gewogICAgbmFtZTogJ21taGItcjEyLXByaXZhdGUtYnVpbGQtZXZpZGVuY2UnLAogICAgZW5mb3JjZTogJ3Bvc3QnLAogICAgY29uZmlnUmVzb2x2ZWQocmVzb2x2ZWQpIHsKICAgICAgcGhhc2UgPSAnVkVSSUZZX1JFU09MVkVEX0JVSUxEX0NPTkZJRyc7CiAgICAgIGVuc3VyZShyZXNvbHZlZC5jb21tYW5kID09PSAnYnVpbGQnICYmIHJlc29sdmVkLm1vZGUgPT09ICdwcm9kdWN0aW9uJyAmJiByZXNvbHZlZC5pc1Byb2R1Y3Rpb24gPT09IHRydWUsICdSRVNPTFZFRF9CVUlMRF9NT0RFX0NIQU5HRUQnKTsKICAgICAgZW5zdXJlKHBhdGgucmVzb2x2ZShyZXNvbHZlZC5yb290KSA9PT0gcGF0aC5qb2luKFJPT1QsICdjbGllbnQnKSwgJ1JFU09MVkVEX1JPT1RfQ0hBTkdFRCcpOwogICAgICBlbnN1cmUocGF0aC5yZXNvbHZlKHJlc29sdmVkLmJ1aWxkLm91dERpcikgPT09IGZyb250ZW5kRGlyICYmIHJlc29sdmVkLmJ1aWxkLmVtcHR5T3V0RGlyID09PSBmYWxzZSwgJ1JFU09MVkVEX09VVFBVVF9DSEFOR0VEJyk7CiAgICAgIGVuc3VyZShwYXRoLnJlc29sdmUocmVzb2x2ZWQuY2FjaGVEaXIpID09PSBjYWNoZURpciwgJ1JFU09MVkVEX0NBQ0hFX0NIQU5HRUQnKTsKICAgICAgZW5zdXJlKHJlc29sdmVkLmVudkRpciA9PT0gZmFsc2UgJiYgcmVzb2x2ZWQuaW5saW5lQ29uZmlnPy5lbnZGaWxlID09PSBmYWxzZQogICAgICAgICYmIHJlc29sdmVkLmNvbmZpZ0ZpbGUgPT09IHVuZGVmaW5lZCwgJ1JFU09MVkVEX0VOVl9PUl9DT05GSUdfTE9BRElOR19DSEFOR0VEJyk7CiAgICAgIGVuc3VyZShyZXNvbHZlZC5idWlsZC53cml0ZSA9PT0gdHJ1ZSAmJiByZXNvbHZlZC5idWlsZC5zc3IgPT09IGZhbHNlICYmICFyZXNvbHZlZC5idWlsZC5saWIKICAgICAgICAmJiAhcmVzb2x2ZWQuYnVpbGQud2F0Y2gsICdSRVNPTFZFRF9CVUlMRF9LSU5EX0NIQU5HRUQnKTsKICAgICAgZW5zdXJlKEFycmF5LmlzQXJyYXkocmVzb2x2ZWQuY3NzPy5wb3N0Y3NzPy5wbHVnaW5zKQogICAgICAgICYmIHJlc29sdmVkLmNzcy5wb3N0Y3NzLnBsdWdpbnMubGVuZ3RoID09PSAyCiAgICAgICAgJiYgcmVzb2x2ZWQuY3NzLnBvc3Rjc3MucGx1Z2luc1swXT8ucG9zdGNzc1BsdWdpbiA9PT0gJ0B0YWlsd2luZGNzcy9wb3N0Y3NzJwogICAgICAgICYmIHJlc29sdmVkLmNzcy5wb3N0Y3NzLnBsdWdpbnNbMV0/LnBvc3Rjc3NQbHVnaW4gPT09ICdhdXRvcHJlZml4ZXInLCAnUkVTT0xWRURfUE9TVENTU19DSEFOR0VEJyk7CiAgICAgIHJlc29sdmVkRXZpZGVuY2UgPSB7CiAgICAgICAgY29tbWFuZDogcmVzb2x2ZWQuY29tbWFuZCwgbW9kZTogcmVzb2x2ZWQubW9kZSwgaXNQcm9kdWN0aW9uOiByZXNvbHZlZC5pc1Byb2R1Y3Rpb24sCiAgICAgICAgcm9vdDogcmVzb2x2ZWQucm9vdCwgcHVibGljRGlyOiByZXNvbHZlZC5wdWJsaWNEaXIsIGNhY2hlRGlyOiByZXNvbHZlZC5jYWNoZURpciwKICAgICAgICBjb25maWdGaWxlOiByZXNvbHZlZC5jb25maWdGaWxlID8/IG51bGwsIGVudkRpcjogcmVzb2x2ZWQuZW52RGlyLCBlbnZGaWxlOiByZXNvbHZlZC5pbmxpbmVDb25maWcuZW52RmlsZSwKICAgICAgICBiYXNlOiByZXNvbHZlZC5iYXNlLCBvdXREaXI6IHJlc29sdmVkLmJ1aWxkLm91dERpciwgZW1wdHlPdXREaXI6IHJlc29sdmVkLmJ1aWxkLmVtcHR5T3V0RGlyLAogICAgICAgIHdyaXRlOiByZXNvbHZlZC5idWlsZC53cml0ZSwgc3NyOiByZXNvbHZlZC5idWlsZC5zc3IsIHNvdXJjZW1hcDogcmVzb2x2ZWQuYnVpbGQuc291cmNlbWFwLAogICAgICAgIHRhcmdldDogcmVzb2x2ZWQuYnVpbGQudGFyZ2V0LCBtaW5pZnk6IHJlc29sdmVkLmJ1aWxkLm1pbmlmeSwKICAgICAgICBjc3NQb3N0Y3NzOiBbJ0B0YWlsd2luZGNzcy9wb3N0Y3NzJywgJ2F1dG9wcmVmaXhlciddLAogICAgICAgIHZpc3VhbGl6ZXJGaWxlOiBwYXRoLmpvaW4ocmVwb3J0RGlyLCAnYnVuZGxlLXJlcG9ydC5odG1sJyksCiAgICAgICAgcGx1Z2luTmFtZXM6IHN0cmluZ3MocmVzb2x2ZWQucGx1Z2lucy5tYXAocGx1Z2luID0+IHBsdWdpbi5uYW1lKSksCiAgICAgIH07CiAgICAgIHBoYXNlID0gJ1ZJVEVfQlVJTEQnOwogICAgfSwKICAgIGdlbmVyYXRlQnVuZGxlKF9vcHRpb25zLCBidW5kbGUpIHsKICAgICAgY29sbGVjdEdyYXBoKHRoaXMsICdnZW5lcmF0ZUJ1bmRsZScpOwogICAgICBlbWl0dGVkID0gY29sbGVjdEVtaXR0ZWQoYnVuZGxlKTsKICAgIH0sCiAgICB3cml0ZUJ1bmRsZShfb3B0aW9ucywgYnVuZGxlKSB7CiAgICAgIGNvbGxlY3RHcmFwaCh0aGlzLCAnd3JpdGVCdW5kbGUnKTsKICAgICAgZW1pdHRlZCA9IGNvbGxlY3RFbWl0dGVkKGJ1bmRsZSk7CiAgICB9LAogIH07CiAgcGhhc2UgPSAnVklURV9CVUlMRCc7CiAgYXdhaXQgdml0ZS5idWlsZCh7CiAgICAuLi5jb25maWcsCiAgICBjb25maWdGaWxlOiBmYWxzZSwKICAgIGVudkZpbGU6IGZhbHNlLAogICAgZW52RGlyOiBmYWxzZSwKICAgIG1vZGU6ICdwcm9kdWN0aW9uJywKICAgIGNhY2hlRGlyLAogICAgY2xlYXJTY3JlZW46IGZhbHNlLAogICAgcGx1Z2luczogW2NvbmZpZy5wbHVnaW5zWzBdLCB2aXN1YWxpemVyKHsgZmlsZW5hbWU6IHBhdGguam9pbihyZXBvcnREaXIsICdidW5kbGUtcmVwb3J0Lmh0bWwnKSwKICAgICAgdGVtcGxhdGU6ICd0cmVlbWFwJywgZ3ppcFNpemU6IHRydWUsIGJyb3RsaVNpemU6IHRydWUsIG9wZW46IGZhbHNlIH0pLCBldmlkZW5jZVBsdWdpbl0sCiAgICBjc3M6IHsgLi4uY29uZmlnLmNzcywgcG9zdGNzczogeyBwbHVnaW5zOiBwb3N0Y3NzUGx1Z2lucyB9IH0sCiAgICBidWlsZDogeyAuLi5jb25maWcuYnVpbGQsIG91dERpcjogZnJvbnRlbmREaXIsIGVtcHR5T3V0RGlyOiBmYWxzZSB9LAogIH0pOwoKICBwaGFzZSA9ICdWRVJJRllfRlJPTlRFTkRfT1VUUFVUUyc7CiAgZW5zdXJlKHJlc29sdmVkRXZpZGVuY2UgJiYgZ3JhcGguY2FwdHVyZWRBdC5pbmNsdWRlcygnd3JpdGVCdW5kbGUnKSwgJ0JVSUxEX0VWSURFTkNFX0hPT0tfTk9UX1JFQUNIRUQnKTsKICBlbnN1cmUoZ3JhcGgubW9kdWxlSWRzU3VwcG9ydGVkICYmIGdyYXBoLm1vZHVsZXMubGVuZ3RoID4gMCwgJ01PRFVMRV9HUkFQSF9VTkFWQUlMQUJMRScpOwogIGVuc3VyZShlbWl0dGVkLnNvbWUoaXRlbSA9PiBpdGVtLmZpbGVOYW1lID09PSAnaW5kZXguaHRtbCcpLCAnSFRNTF9FTlRSWV9OT1RfRU1JVFRFRCcpOwogIGVuc3VyZShlbWl0dGVkLnNvbWUoaXRlbSA9PiBpdGVtLnR5cGUgPT09ICdjaHVuaycgJiYgL1wuKD86bT9qcykkLy50ZXN0KGl0ZW0uZmlsZU5hbWUpKSwgJ0pBVkFTQ1JJUFRfTk9UX0VNSVRURUQnKTsKICBjb25zdCBjc3NGaWxlcyA9IGVtaXR0ZWQuZmlsdGVyKGl0ZW0gPT4gaXRlbS50eXBlID09PSAnYXNzZXQnICYmIGl0ZW0uZmlsZU5hbWUuZW5kc1dpdGgoJy5jc3MnKSk7CiAgZW5zdXJlKGNzc0ZpbGVzLmxlbmd0aCA+IDAsICdDU1NfTk9UX0VNSVRURUQnKTsKICBjb25zdCBpbmRleCA9IG91dHB1dEZpbGUoJ2luZGV4Lmh0bWwnKTsKICBlbnN1cmUoaW5kZXguYnl0ZXMgPiAwLCAnSFRNTF9FTlRSWV9FTVBUWScpOwogIGNvbnN0IGNzc0RpYWdub3N0aWNzID0gY3NzRmlsZXMubWFwKGl0ZW0gPT4gewogICAgY29uc3QgZmlsZSA9IG91dHB1dEZpbGUoaXRlbS5maWxlTmFtZSk7CiAgICBjb25zdCBjc3MgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZS5mdWxsLCAndXRmOCcpOwogICAgcmV0dXJuIHsKICAgICAgZmlsZU5hbWU6IGl0ZW0uZmlsZU5hbWUsIGJ5dGVzOiBmaWxlLmJ5dGVzLAogICAgICAvLyBEaWFnbm9zdGljcywgbm90IGEgQ1NTIHBhcnNlciBvciByZW5kZXJlZCBVSSBjb3JyZWN0bmVzcyBhc3NlcnRpb24uCiAgICAgIGRpcmVjdGl2ZVJlc2lkdWVDYW5kaWRhdGVzOiAoY3NzLm1hdGNoKC9AKHRhaWx3aW5kfGFwcGx5fHNvdXJjZXxjb25maWd8cGx1Z2lufHV0aWxpdHl8dGhlbWUpXGIvZykgfHwgW10pLmxlbmd0aCwKICAgICAgaGFzUm9vdE9ySHRtbFNlbGVjdG9yOiAvKD86OnJvb3R8KD86XnxbfSxdKVxzKmh0bWwpKD86XHN8Wyx7Oi4jW10pLy50ZXN0KGNzcyksCiAgICAgIGhhc0NsYXNzU2VsZWN0b3JDYW5kaWRhdGU6IC9cLltBLVphLXpfLV1bQS1aYS16MC05Xy1dKltccyw6LnsjW10vLnRlc3QoY3NzKSwKICAgICAgaGFzRmxleERlY2xhcmF0aW9uOiAvZGlzcGxheVxzKjpccyooPzppbmxpbmUtKT9mbGV4XGIvLnRlc3QoY3NzKSwKICAgICAgaGFzR3JpZERlY2xhcmF0aW9uOiAvZGlzcGxheVxzKjpccyooPzppbmxpbmUtKT9ncmlkXGIvLnRlc3QoY3NzKSwKICAgIH07CiAgfSk7CiAgZW5zdXJlKGNzc0RpYWdub3N0aWNzLnNvbWUoaXRlbSA9PiBpdGVtLmJ5dGVzID4gMCksICdDU1NfT1VUUFVUX0VNUFRZJyk7CiAgcGhhc2UgPSAnU0FWRV9CVUlMRF9FVklERU5DRSc7CiAgd3JpdGVFdmlkZW5jZSgnZnJvbnRlbmQtZ3JhcGguanNvbicsIGdyYXBoKTsKICB3cml0ZUV2aWRlbmNlKCdmcm9udGVuZC1idWlsZC1ldmlkZW5jZS5qc29uJywgewogICAgcHJvamVjdDogJ015TWVudGFsSGVhbHRoQnVkZHknLCBzdGF0dXM6ICdGUk9OVEVORF9DT01QSUxFRF9DQU5ESURBVEVfTk9UX1JFTEVBU0UnLAogICAgY29tcGlsZXJJbnZvY2F0aW9uczogMSwgcmVzb2x2ZWRDb25maWc6IHJlc29sdmVkRXZpZGVuY2UsIGVtaXR0ZWQsCiAgICBncmFwaEZpbGU6ICdmcm9udGVuZC1ncmFwaC5qc29uJywgbW9kdWxlQ291bnQ6IGdyYXBoLm1vZHVsZXMubGVuZ3RoLAogICAgd2F0Y2hGaWxlQ291bnQ6IGdyYXBoLndhdGNoRmlsZXMubGVuZ3RoLCB3YXRjaEZpbGVzU3VwcG9ydGVkOiBncmFwaC53YXRjaEZpbGVzU3VwcG9ydGVkLAogICAgY3NzRGlhZ25vc3RpY3MsCiAgICBsaW1pdGF0aW9uczogWwogICAgICAnT25lIGN1cnJlbnQtbWFjaGluZSBidWlsZDsgbm90IHJlcGVhdGFiaWxpdHkgb3IgY2xlYW4tbG9ja2ZpbGUtaW5zdGFsbCBwcm9vZicsCiAgICAgICdNb2R1bGUgYW5kIHdhdGNoIGdyYXBoIGRvZXMgbm90IHByb3ZlIGV2ZXJ5IGJ1aWxkLXRvb2wgb3IgZHluYW1pYyBmaWxlc3lzdGVtIHJlYWQnLAogICAgICAnUHJvZHVjdGlvbiBlbnZpcm9ubWVudCBmaWxlcyBkaXNhYmxlZDsgZGVwbG95bWVudCBlbnZpcm9ubWVudCBwYXJpdHkgcmVtYWlucyB1bnF1YWxpZmllZCcsCiAgICAgICdDU1MgZGlhZ25vc3RpY3MgYXJlIGxleGljYWwgb2JzZXJ2YXRpb25zOyBicm93c2VyIGxheW91dCBhbmQgYWNjZXNzaWJpbGl0eSByZW1haW4gdW5xdWFsaWZpZWQnLAogICAgICAnTm8gYXBwbGljYXRpb24gc3RhcnR1cCwgc2VydmVyIGludGVncmF0aW9uLCBicm93c2VyLCBuYXRpdmUgQUJJLCBkYXRhYmFzZSBvciBkZXBsb3ltZW50IHF1YWxpZmljYXRpb24nLAogICAgICAnT3V0cHV0IGFuZCBjYWNoZSByZWRpcmVjdGVkOyBubyBvcGVyYXRpbmctc3lzdGVtIGZpbGVzeXN0ZW0gb3IgbmV0d29yayBpc29sYXRpb24gY2xhaW0nLAogICAgXSwKICB9KTsKICBjb25zb2xlLmxvZygnRlJPTlRFTkRfUlVOTkVSX1NUQVRVUz1DT01QSUxFRF9DQU5ESURBVEVfTk9UX1JFTEVBU0UnKTsKfSBjYXRjaCAoZXJyb3IpIHsKICBjb25zdCBjb2RlID0gdHlwZW9mIGVycm9yPy5jb2RlID09PSAnc3RyaW5nJyAmJiAvXltBLVowLTlfXXsxLDEwMH0kLy50ZXN0KGVycm9yLmNvZGUpCiAgICA/IGVycm9yLmNvZGUgOiAnRlJPTlRFTkRfQlVJTERfRFJJVkVSX0ZBSUxVUkUnOwogIGlmIChyZWFkeSkgewogICAgdHJ5IHsKICAgICAgd3JpdGVFdmlkZW5jZSgnZnJvbnRlbmQtcnVubmVyLWVycm9yLmpzb24nLCB7CiAgICAgICAgcHJvamVjdDogJ015TWVudGFsSGVhbHRoQnVkZHknLCBzdGF0dXM6ICdGUk9OVEVORF9SVU5ORVJfRkFJTEVEJywgcGhhc2UsIGNvZGUsCiAgICAgICAgaWQ6IHR5cGVvZiBlcnJvcj8uaWQgPT09ICdzdHJpbmcnID8gZXJyb3IuaWQuc2xpY2UoMCw4MTkyKSA6IHVuZGVmaW5lZCwKICAgICAgICBsb2M6IGVycm9yPy5sb2MgPyB7IGxpbmU6IGVycm9yLmxvYy5saW5lLCBjb2x1bW46IGVycm9yLmxvYy5jb2x1bW4gfSA6IHVuZGVmaW5lZCwKICAgICAgICAvLyBQcml2YXRlIHJlcG9ydCBvbmx5LiBUaGUgcGFyZW50IG11c3Qgbm90IGVjaG8gdGhpcyBmaWxlIHdpdGhvdXQgcmVkYWN0aW9uLgogICAgICAgIHByaXZhdGVNZXNzYWdlOiBTdHJpbmcoZXJyb3I/Lm1lc3NhZ2UgfHwgZXJyb3IpLnNsaWNlKDAsIDMyNzY4KSwKICAgICAgICBwcml2YXRlU3RhY2s6IFN0cmluZyhlcnJvcj8uc3RhY2sgfHwgJycpLnNsaWNlKDAsIDY1NTM2KSwKICAgICAgfSk7CiAgICB9IGNhdGNoIHsgLyogRml4ZWQgY29uc29sZSByZXN1bHQgc3RpbGwgaWRlbnRpZmllcyBmYWlsdXJlIGlmIGV2aWRlbmNlIHdyaXRlIGZhaWxzLiAqLyB9CiAgfQogIGNvbnNvbGUubG9nKGBGUk9OVEVORF9SVU5ORVJfU1RBVFVTPUZBSUxFRCBQSEFTRT0ke3BoYXNlfSBDT0RFPSR7Y29kZX1gKTsKICBwcm9jZXNzLmV4aXRDb2RlID0gMTsKfQo=';
let reportDir, before, baseline, sourcesBefore, toolsBefore, observedGraph, failure;
let phase = 'WORKSPACE_PREFLIGHT', attempts = 0, started = 0, timeoutSignal = false;
let result = { project: 'MyMentalHealthBuddy', status: 'NOT_STARTED',
  serverCandidate: 'R11D_REPORTED_PASS_NOT_REBUILT_OR_COPIED', dependencyAlignment: 'PENDING',
  runtime: 'UNPROVEN', deployedArtifact: 'UNPROVEN' };
function failureInfo(error, at, fallback = 'UNEXPECTED_DRIVER_FAILURE') {
  const detail = { ...(error.detail || {}) };
  const raw = typeof error.syscall === 'string' ? error.syscall.split(' ')[0] : '';
  const operation = raw === 'spawnSync' ? 'spawn' : raw;
  if (['lstat','stat','open','read','write','realpath','scandir','mkdir','spawn','readlink','access'].includes(operation)) detail.syscall = operation;
  if (typeof error.path === 'string') {
    const full = path.resolve(ROOT, error.path);
    detail.file = reportDir && inside(reportDir, full) ? 'REPORT/' + label(path.relative(reportDir, full)) :
      inside(ROOT, full) ? label(path.relative(ROOT, full)) : label(error.path);
  }
  return { gate: error.gate || fallback, phase: at, detail,
    errorCode: typeof error.code === 'string' && /^[A-Z0-9_]+$/.test(error.code) ? error.code : undefined };
}
function save(name, value) {
  fs.writeFileSync(path.join(reportDir, name), JSON.stringify(value, null, 2), { flag:'wx', mode:0o600 });
}
function childDiagnostics() {
  const file = path.join(reportDir, 'frontend-runner-error.json');
  if (!fs.existsSync(file)) return { rawLog: 'PRIVATE_NOT_PRINTED' };
  const raw = readJSON(file);
  const id = typeof raw.id === 'string' ? raw.id : undefined;
  const relativeId = id && path.isAbsolute(id) && inside(ROOT, id) ? path.relative(ROOT,id) : id;
  const missing = typeof raw.privateMessage === 'string' ?
    raw.privateMessage.match(/(?:Could not resolve|Failed to resolve import) ["']([A-Za-z0-9_@./-]{1,200})["']/) : null;
  return { code: typeof raw.code === 'string' && /^[A-Z0-9_]{1,100}$/.test(raw.code) ? raw.code : 'BUILD_ERROR',
    phase: typeof raw.phase === 'string' && /^[A-Z0-9_]{1,100}$/.test(raw.phase) ? raw.phase : 'BUILD',
    file: relativeId ? label(relativeId) : undefined,
    unresolvedModule: missing ? label(missing[1]) : undefined,
    line: Number.isSafeInteger(raw.loc?.line) ? raw.loc.line : undefined,
    rawLog: 'PRIVATE_NOT_PRINTED' };
}
console.log('COMMAND_ID=MMHB-FRONTEND-CANDIDATE-R12');
console.log('UTC=' + new Date().toISOString());
console.log('ISSUE_ID=FRONTEND-CANDIDATE-001');
try {
  gate(ROOT === EXPECTED_ROOT, 'WORKSPACE_PATH');
  gate(process.version === EXPECTED_NODE && process.platform === 'linux' && process.arch === 'x64', 'MACHINE_DRIFT');
  gate(fs.realpathSync(git('rev-parse','--show-toplevel').trim()) === ROOT, 'GIT_ROOT');
  reportDir = fs.mkdtempSync('/tmp/mmhb-frontend-candidate-r12-'); fs.chmodSync(reportDir,0o700);
  console.log('REPORT_DIRECTORY=' + reportDir);
  phase = 'INITIAL_SNAPSHOT'; before = snapshot(); save('worktree-before.json',before);
  gate(before.head === EXPECTED_HEAD && before.branch === 'integration', 'GIT_BASELINE_DRIFT');
  phase = 'PINNED_BASELINE'; baseline = checkPins(); save('pinned-before.json',baseline);
  result.tools = toolMetadata();
  const react = result.tools.find(x => x.name === '@vitejs/plugin-react');
  gate(react.installed === '6.1.1' && react.locked === '6.1.0', 'REACT_METADATA_DRIFT');
  phase = 'SOURCE_AND_TOOL_SNAPSHOTS';
  sourcesBefore = sourceTrees(); toolsBefore = toolTrees();
  save('source-trees-before.json',sourcesBefore); save('tool-trees-before.json',toolsBefore);
  result.publicConfiguration = publicEnvReferences(sourcesBefore);
  console.log('GATE=SOURCE_CONFIG_AND_TOOL_BASELINE RESULT=PASS');
  phase = 'FRONTEND_COMPILATION';
  const runnerPath = path.join(reportDir,'frontend-runner.mjs');
  fs.writeFileSync(runnerPath, Buffer.from(RUNNER_B64,'base64'), {flag:'wx',mode:0o600});
  const log = path.join(reportDir,'frontend-build.log'), fd = fs.openSync(log,'wx',0o600);
  let execution;
  try {
    attempts++;
    execution = spawnSync(process.execPath,[runnerPath,reportDir], {
      cwd:ROOT,env:{...MIN_ENV,TMPDIR:reportDir,XDG_CACHE_HOME:path.join(reportDir,'cache'),
        NODE_OPTIONS:'--max-old-space-size=4096',NODE_DISABLE_COMPILE_CACHE:'1'},
      stdio:['ignore',fd,fd],timeout:300000,killSignal:'SIGTERM'});
  } finally { fs.closeSync(fd); }
  if (execution.pid > 0) started++;
  timeoutSignal = execution.error?.code === 'ETIMEDOUT';
  gate(execution.status === 0 && !execution.error && !execution.signal,'FRONTEND_COMPILATION_FAILED', {
    exitCode:execution.status, signal:execution.signal || null, timedOut:timeoutSignal,
    launchError:execution.error ? failureInfo(execution.error,phase) : undefined, diagnostics:childDiagnostics() });
  phase = 'FRONTEND_EVIDENCE';
  const evidence = readJSON(path.join(reportDir,'frontend-build-evidence.json'));
  gate(evidence.status === 'FRONTEND_COMPILED_CANDIDATE_NOT_RELEASE' && evidence.graphFile === 'frontend-graph.json', 'FRONTEND_EVIDENCE_STATUS');
  observedGraph = graphManifest(readJSON(path.join(reportDir,'frontend-graph.json'))); save('observed-graph-inputs.json',observedGraph);
  const outputBase = path.join(reportDir,'frontend'), tree = treeManifest(outputBase,true);
  const references = validateOutputs(outputBase,evidence.emitted,tree);
  save('output-manifest.json',tree);
  result = { ...result,status:'FRONTEND_CANDIDATE_ONLY_NOT_RELEASE', outputFiles:tree.rows.length,
    outputBytes:tree.bytes,outputManifestSha256:hash(JSON.stringify(tree)),
    index:tree.rows.find(x => x.file === 'index.html'),references,
    observedPhysicalInputs:Object.keys(observedGraph.records).length,virtualInputs:observedGraph.virtualCount,
    unresolvedInputs:observedGraph.unresolvedCount,
    cssDiagnostics:evidence.cssDiagnostics, configuration:evidence.resolvedConfig,
    limitations:['Installed dependencies used; React plugin lock alignment is pending',
      'One frontend build; no repeatability or clean-install reproduction claim',
      'Complete selected source/tool trees checked before and after; other graph inputs observed after build only',
      'Build tools/plugins execute; the frontend application is not started',
      'Private outputs/cache and minimal environment are not an OS filesystem/network sandbox',
      'Public VITE configuration, CSS visual fidelity, browser flows, service worker and runtime are unqualified',
      'The R11D server candidate is not copied; this is not an assembled release'] };
  console.log('GATE=FRONTEND_BUILD_AND_LOCAL_ASSET_REFERENCES RESULT=PASS');
} catch(error) { failure = failureInfo(error,phase); }
finally {
  const failures = [];
  function attempt(name, fn) { try { fn(); } catch(error) { failures.push(failureInfo(error,name,'PRESERVATION_CHECK_FAILED')); } }
  if (before) {
    if (baseline) attempt('FINAL_PIN_PRESERVATION',()=>{
      const after = Object.fromEntries(Object.keys(baseline).map(rel => [rel,identity(path.join(ROOT,rel),rel.startsWith('node_modules/'))]));
      save('pinned-after.json',after);
      const changed = Object.keys(baseline).filter(rel => JSON.stringify(baseline[rel]) !== JSON.stringify(after[rel]));
      gate(!changed.length,'PINNED_FILE_NOT_PRESERVED',{files:changed.map(label)});
    });
    if (sourcesBefore) attempt('FINAL_SOURCE_PRESERVATION',()=>{const after=sourceTrees();save('source-trees-after.json',after);compareTrees(sourcesBefore,after,'FRONTEND_SOURCE_NOT_PRESERVED');});
    if (toolsBefore) attempt('FINAL_TOOL_PRESERVATION',()=>{const after=toolTrees();save('tool-trees-after.json',after);compareTrees(toolsBefore,after,'BUILD_TOOL_NOT_PRESERVED');});
    if (observedGraph) attempt('FINAL_GRAPH_OBSERVATION',()=>verifyGraph(observedGraph));
    attempt('FINAL_WORKTREE_SNAPSHOT',()=>{
      const after=snapshot();save('worktree-after.json',after);
      result.currentPreservation=snapshotDifference(before,after);save('worktree-comparison.json',result.currentPreservation);
      gate(!result.currentPreservation.components.length,'GIT_OR_WORKTREE_NOT_PRESERVED',result.currentPreservation);
    });
    if(failures.length) {failure={...failures[0],previousFailure:failure};result.preservationFailures=failures;result.preservation='FAILED';}
    else if(baseline && sourcesBefore && toolsBefore) {
      result.preservation='OBSERVED_SOURCES_TOOLS_AND_GIT_STATE_PRESERVED';
      console.log('GATE=OBSERVED_SOURCES_TOOLS_AND_GIT_STATE_PRESERVED RESULT=PASS');
    } else {
      result.preservation='PARTIAL_BASELINES_PRESERVED_FULL_SCOPE_UNOBSERVED';
      result.preservationScope={git:true,pins:!!baseline,sourceTrees:!!sourcesBefore,toolTrees:!!toolsBefore};
      console.log('GATE=PARTIAL_BASELINE_PRESERVATION RESULT=PASS FULL_SCOPE=UNOBSERVED');
    }
  }
  if(failure){result.status='FRONTEND_CANDIDATE_FAILED';result.failure=failure;}
  result.buildAttempts=attempts;result.buildProcessesStarted=started;result.buildTimeoutSignal=timeoutSignal;
  result.evidenceWrite=reportDir?'SAVED':'REPORT_NOT_CREATED';
  if(reportDir) try{save('frontend-candidate-evidence.json',result);}catch(error){
    failure={...failureInfo(error,'FINAL_EVIDENCE_WRITE','EVIDENCE_WRITE_FAILED'),previousFailure:failure};
    result.status='FRONTEND_CANDIDATE_FAILED';result.failure=failure;result.evidenceWrite='FAILED';
  }
  if(failure)console.log('FAILED_GATE='+failure.gate);
  console.log(JSON.stringify(result,null,2));
  console.log('SOURCE_EDIT=0 PACKAGE_EDIT=0 PACKAGE_INSTALL=0 APPLICATION_STARTED=0');
  console.log('DATABASE_CODE_EXECUTED=0 CREDENTIAL_CHANGE=0 STAGE=0 COMMIT=0 PUSH=0 DEPLOY=0');
  console.log('BUILD_PROCESSES_STARTED='+started+' NETWORK_ISOLATION=NOT_ENFORCED');
  console.log('FULL_NPM_TEST=NOT_RUN DEPENDENCY_ALIGNMENT=PENDING RUNTIME=UNPROVEN DEPLOYED_ARTIFACT_PROVEN=NO');
  if(reportDir)console.log('REPORT_DIRECTORY='+reportDir);
  console.log('STATUS='+result.status);
  console.log('NEXT_ACTION=STOP_AND_RETURN_COMPLETE_OUTPUT');
  process.exitCode=failure?1:0;
}
