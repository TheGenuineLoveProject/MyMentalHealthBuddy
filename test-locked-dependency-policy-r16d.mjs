import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { validateLock, inspectInstalled } from './locked-dependency-policy-r16d.mjs';

// These fixtures create and inspect synthetic files only. No npm, package import,
// child process, registry download, or real project application is invoked.
const HERE = path.dirname(fileURLToPath(import.meta.url));
const results = [];
const temporaryRoots = [];
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const integrity = `sha512-${crypto.createHash('sha512').update('synthetic archive identity; no archive downloaded').digest('base64')}`;
const clone = value => structuredClone(value);
const packagePaths = {
  react: 'node_modules/@vitejs/plugin-react',
  resend: 'node_modules/resend',
  pg: 'node_modules/pg',
  nanoid: 'node_modules/nanoid',
  optional: 'node_modules/@esbuild/darwin-arm64',
};
function packageEntry(name, version, extra = {}) {
  const archiveName = name.split('/').at(-1);
  return { version, resolved: `https://registry.npmjs.org/${name}/-/${archiveName}-${version}.tgz`, integrity, ...extra };
}
function validContract() {
  const manifest = {
    name: 'mymentalhealthbuddy', version: '1.0.0',
    dependencies: { resend: '^6.22.1', pg: '^8.23.0', nanoid: '^5.1.5' },
    devDependencies: { '@vitejs/plugin-react': '^6.1.0' },
    optionalDependencies: { '@esbuild/darwin-arm64': '0.28.2' },
  };
  const lock = {
    name: manifest.name, version: manifest.version, lockfileVersion: 3, requires: true,
    packages: {
      '': clone(manifest),
      [packagePaths.react]: packageEntry('@vitejs/plugin-react', '6.1.0', { dev: true }),
      [packagePaths.resend]: packageEntry('resend', '6.22.1'),
      [packagePaths.pg]: packageEntry('pg', '8.23.0'),
      [packagePaths.nanoid]: packageEntry('nanoid', '5.1.5', { bin: { nanoid: 'bin/nanoid.cjs' } }),
      [packagePaths.optional]: packageEntry('@esbuild/darwin-arm64', '0.28.2', { optional: true, dev: true, os: ['darwin'], cpu: ['arm64'] }),
    },
  };
  return { manifest, lock };
}
function writeJSON(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}
function installedFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'mmhb-r16-policy-fixture-'));
  temporaryRoots.push(root);
  const stage = path.join(root, 'stage');
  fs.mkdirSync(stage, { recursive: true });
  const { manifest, lock } = validContract();
  writeJSON(path.join(stage, 'package.json'), manifest);
  writeJSON(path.join(stage, 'package-lock.json'), lock);
  const names = {
    [packagePaths.react]: '@vitejs/plugin-react',
    [packagePaths.resend]: 'resend',
    [packagePaths.pg]: 'pg',
    [packagePaths.nanoid]: 'nanoid',
  };
  const hidden = { name: manifest.name, version: manifest.version, lockfileVersion: 3, requires: true, packages: {} };
  for (const [relative, name] of Object.entries(names)) {
    const entry = lock.packages[relative];
    writeJSON(path.join(stage, relative, 'package.json'), { name, version: entry.version, ...(entry.bin ? { bin: entry.bin } : {}) });
    fs.writeFileSync(path.join(stage, relative, 'index.js'), 'throw new Error("fixture package must never be executed");\n');
    hidden.packages[relative] = clone(entry);
  }
  const nativeBytes = Buffer.from([0, 255, 69, 76, 70, 1, 2, 3]);
  fs.writeFileSync(path.join(stage, packagePaths.pg, 'fixture.node'), nativeBytes);
  fs.mkdirSync(path.join(stage, packagePaths.nanoid, 'bin'), { recursive: true });
  fs.writeFileSync(path.join(stage, packagePaths.nanoid, 'bin/nanoid.cjs'), '#!/usr/bin/env node\nthrow new Error("fixture bin must never run");\n');
  fs.mkdirSync(path.join(stage, 'node_modules/.bin'), { recursive: true });
  fs.symlinkSync('../nanoid/bin/nanoid.cjs', path.join(stage, 'node_modules/.bin/nanoid'));
  writeJSON(path.join(stage, 'node_modules/.package-lock.json'), hidden);
  return { root, stage, manifest, lock, hidden, nativeSha256: sha256(nativeBytes) };
}
function safeRejection(error) {
  assert.ok(error instanceof Error, 'rejection must be an Error');
  assert.match(error.code || '', /^[A-Z][A-Z0-9_]{2,100}$/, 'rejection must have a fixed structured code');
  if (error.file !== undefined) {
    assert.equal(typeof error.file, 'string');
    assert.ok(!error.file.includes('TOP_SECRET'), 'error.file must not expose credential fixture');
    assert.ok(!/[\u0000-\u001f\u007f]/.test(error.file), 'error.file must not contain control characters');
  }
  return true;
}
async function rejected(fn) {
  let error;
  try { await fn(); } catch (caught) { error = caught; }
  assert.ok(error, 'expected rejection');
  safeRejection(error);
}
async function test(name, fn) {
  try { await fn(); results.push({ name, status: 'PASS' }); }
  catch (error) { results.push({ name, status: 'FAIL', diagnostic: String(error.message).slice(0, 700) }); }
}
async function rejectLock(name, mutate) {
  await test(name, async () => {
    const { manifest, lock } = validContract();
    mutate(manifest, lock);
    await rejected(() => validateLock(manifest, lock));
  });
}
async function rejectTree(name, mutate) {
  await test(name, async () => {
    const fixture = installedFixture();
    mutate(fixture);
    await rejected(() => inspectInstalled(fixture.stage, fixture.lock));
  });
}
const WASM = 'node_modules/@tailwindcss/oxide-wasm32-wasi';
const BUNDLE_NAMES = ['@emnapi/core','@emnapi/runtime','@emnapi/wasi-threads','@napi-rs/wasm-runtime','@tybys/wasm-util','tslib'];
function addBundle(lock) {
  lock.packages[WASM] = packageEntry('@tailwindcss/oxide-wasm32-wasi', '4.3.3', {
    optional: true, cpu: ['wasm32'], bundleDependencies: BUNDLE_NAMES,
    dependencies: Object.fromEntries(BUNDLE_NAMES.map(name => [name, '^1.0.0'])),
  });
  for (const name of BUNDLE_NAMES) lock.packages[WASM + '/node_modules/' + name] = {version:'1.0.0', inBundle:true, optional:true};
  return lock.packages[WASM + '/node_modules/@emnapi/core'];
}
try {
  await test('six bundled members omit independent archive fields and require absent parent', () => {
    const f = installedFixture(); addBundle(f.lock);
    const bytes = JSON.stringify(f.lock);
    const policy = validateLock(f.manifest, f.lock);
    assert.equal(policy.platformExcludedBundledMembers.length, 6);
    for (const [file, entry] of Object.entries(f.lock.packages)) if (file.startsWith(WASM)) f.hidden.packages[file] = clone(entry);
    writeJSON(path.join(f.stage, 'node_modules/.package-lock.json'), f.hidden);
    const result = inspectInstalled(f.stage, f.lock);
    assert.equal(result.platformExcludedBundledMembers.length, 6);
    assert.equal(result.absentOptional.filter(x => x.platformExcluded).length, 7);
    assert.equal(result.hiddenLock.absentOptionalEntries.filter(x => x.startsWith(WASM)).length, 7);
    assert.equal(JSON.stringify(f.lock), bytes);
  });
  await test('bundle exclusion follows parent even when child optional flag is omitted', () => {
    const f = installedFixture(); const child = addBundle(f.lock); delete child.optional;
    const r = inspectInstalled(f.stage, f.lock);
    assert.equal(r.absentOptional.find(x => x.file.endsWith('/@emnapi/core')).optional, false);
  });
  await test('reachable hoisted and nested bundle dependencies remain contained', () => {
    const f = installedFixture(); const core = addBundle(f.lock);
    core.dependencies = {hoisted:'^1.0.0', nested:'^1.0.0'};
    f.lock.packages[WASM + '/node_modules/hoisted'] = {version:'1.0.0', inBundle:true};
    f.lock.packages[WASM + '/node_modules/@emnapi/core/node_modules/nested'] = {version:'1.0.0', inBundle:true};
    assert.equal(inspectInstalled(f.stage, f.lock).platformExcludedBundledMembers.length, 8);
  });
  for (const [name, mutate] of [
    ['unbundled child', (l,c) => {delete c.inBundle;}],
    ['independent child URL', (l,c) => {c.resolved='https://registry.npmjs.org/@emnapi/core/-/core-1.0.0.tgz';}],
    ['independent child checksum', (l,c) => {c.integrity=integrity;}],
    ['null child checksum', (l,c) => {c.integrity=null;}],
    ['aliased child identity', (l,c) => {c.name='another';}],
    ['malformed child version', (l,c) => {c.version='latest';}],
    ['invalid child optional flag', (l,c) => {c.optional='true';}],
    ['linked child', (l,c) => {c.link=true;}],
    ['nested shrinkwrap child', (l,c) => {c.hasShrinkwrap=true;}],
    ['nested bundle declaration', (l,c) => {c.bundleDependencies=['extra'];}],
    ['local child dependency', (l,c) => {c.dependencies={extra:'file:/private/TOP_SECRET'};}],
    ['unreachable bundled child', l => {l.packages[WASM+'/node_modules/unrelated']={version:'1.0.0',inBundle:true};}],
    ['missing physical bundle ancestor', (l,c) => {c.dependencies={nested:'^1.0.0'};l.packages[WASM+'/node_modules/absent/node_modules/nested']={version:'1.0.0',inBundle:true};}],
    ['required parent', l => {delete l.packages[WASM].optional;}],
    ['nonexcluded parent CPU', l => {l.packages[WASM].cpu=['x64'];}],
    ['missing parent checksum', l => {delete l.packages[WASM].integrity;}],
    ['aliased parent identity', l => {l.packages[WASM].name='another';}],
    ['bundle flag outside parent', l => {l.packages[packagePaths.pg].inBundle=true;delete l.packages[packagePaths.pg].integrity;}],
  ]) await rejectLock('reject bundled exemption: '+name, (_m,l) => {const c=addBundle(l);mutate(l,c);});
  await rejectTree('reject present excluded parent with bundled child contents', f => {
    addBundle(f.lock);
    writeJSON(path.join(f.stage, WASM, 'node_modules/@emnapi/core/package.json'), {name:'@emnapi/core',version:'1.0.0'});
  });
  await rejectTree('reject hidden bundle marker disagreement', f => {
    addBundle(f.lock);
    f.hidden.packages[WASM+'/node_modules/@emnapi/core']={...f.lock.packages[WASM+'/node_modules/@emnapi/core'],inBundle:false};
    writeJSON(path.join(f.stage, 'node_modules/.package-lock.json'), f.hidden);
  });
  await test('valid cross-platform v3 lock with selected pinned versions', async () => {
    const { manifest, lock } = validContract();
    const result = await validateLock(manifest, lock);
    assert.equal(result.status, 'LOCK_POLICY_PASS');
    assert.equal(result.packageCount, Object.keys(lock.packages).length - 1);
    const selected = JSON.stringify(result.selectedLocked);
    assert.ok(selected.includes('6.1.0') && selected.includes('6.22.1'));
  });
  await test('accept registry semver alternatives with insiders peer tag', async () => {
    const { manifest, lock } = validContract();
    lock.packages[packagePaths.react].peerDependencies = { tailwindcss: '>=3.0.0 || insiders || >=4.0.0-alpha.20' };
    assert.equal((await validateLock(manifest, lock)).status, 'LOCK_POLICY_PASS');
  });
  await rejectLock('reject general package bundled dependency declaration', (_m, l) => { l.packages[packagePaths.pg].bundledDependencies = ['some-dependency']; });
  await rejectLock('reject root bundled dependency declaration', (m, l) => { m.bundleDependencies = l.packages[''].bundleDependencies = ['pg']; });
  await rejectLock('reject WASI bundle exception with wrong CPU metadata', (_m, l) => {
    l.packages['node_modules/@tailwindcss/oxide-wasm32-wasi'] = packageEntry('@tailwindcss/oxide-wasm32-wasi', '4.3.3', {
      optional: true, cpu: ['x64'], bundleDependencies: ['@emnapi/core'],
    });
  });
  await rejectLock('reject lockfile v2', (_m, l) => { l.lockfileVersion = 2; });
  await rejectLock('reject another project root name', (m, l) => { m.name = l.name = l.packages[''].name = 'another-platform'; });
  await rejectLock('reject root dependency-map disagreement', (_m, l) => { l.packages[''].dependencies.resend = '^6.24.0'; });
  await rejectLock('reject root version disagreement', (_m, l) => { l.version = '9.9.9'; });
  await rejectLock('reject React plugin target drift', (_m, l) => { l.packages[packagePaths.react].version = '6.1.1'; });
  await rejectLock('reject Resend target drift', (_m, l) => { l.packages[packagePaths.resend].version = '6.24.0'; });
  await rejectLock('reject package traversal path', (_m, l) => { l.packages['node_modules/../TOP_SECRET'] = packageEntry('unsafe', '1.0.0'); });
  await rejectLock('reject credential-bearing archive URL', (_m, l) => { l.packages[packagePaths.pg].resolved = 'https://user:TOP_SECRET@registry.npmjs.org/pg/-/pg-8.23.0.tgz'; });
  await rejectLock('reject custom registry archive URL', (_m, l) => { l.packages[packagePaths.pg].resolved = 'https://untrusted.example/pg.tgz'; });
  await rejectLock('reject archive query', (_m, l) => { l.packages[packagePaths.pg].resolved += '?token=TOP_SECRET'; });
  await rejectLock('reject archive fragment', (_m, l) => { l.packages[packagePaths.pg].resolved += '#TOP_SECRET'; });
  await rejectLock('reject HTTP archive transport', (_m, l) => { l.packages[packagePaths.pg].resolved = l.packages[packagePaths.pg].resolved.replace('https:', 'http:'); });
  await rejectLock('reject noncanonical or short SHA-512 integrity', (_m, l) => { l.packages[packagePaths.pg].integrity = 'sha512-Zm9v'; });
  await rejectLock('reject missing archive integrity', (_m, l) => { delete l.packages[packagePaths.pg].integrity; });
  await rejectLock('reject local dependency spec', (m, l) => { m.dependencies.pg = l.packages[''].dependencies.pg = 'file:../other-platform'; });
  await rejectLock('reject git dependency spec', (m, l) => { m.dependencies.pg = l.packages[''].dependencies.pg = 'git+https://example.invalid/pg.git'; });
  await rejectLock('reject direct archive dependency spec', (m, l) => { m.dependencies.pg = l.packages[''].dependencies.pg = 'https://registry.npmjs.org/pg/-/pg-8.23.0.tgz'; });
  await rejectLock('reject nested package local dependency spec', (_m, l) => { l.packages[packagePaths.pg].dependencies = { unsafe: 'file:/tmp/TOP_SECRET' }; });
  await rejectLock('reject root workspaces', (m, l) => { m.workspaces = l.packages[''].workspaces = ['packages/*']; });
  await rejectLock('reject lock link entry', (_m, l) => { l.packages[packagePaths.pg].link = true; });
  await rejectLock('reject lock bundle entry', (_m, l) => { l.packages[packagePaths.pg].inBundle = true; });
  await rejectLock('reject package shrinkwrap flag', (_m, l) => { l.packages[packagePaths.pg].hasShrinkwrap = true; });
  await rejectLock('reject unsafe nested override', (m) => { m.overrides = { pg: { nested: 'git+https://example.invalid/unsafe.git' } }; });

  await test('inspect valid private install and report optional platform omission', async () => {
    const fixture = installedFixture();
    const before = fs.readFileSync(path.join(fixture.stage, 'node_modules/.package-lock.json'));
    const result = await inspectInstalled(fixture.stage, fixture.lock);
    assert.equal(result.status, 'PRIVATE_LOCKED_DEPENDENCIES_INSPECTED');
    assert.ok(JSON.stringify(result.selected).includes('6.1.0'));
    assert.ok(JSON.stringify(result.selected).includes('6.22.1'));
    assert.ok(JSON.stringify(result.absentOptional).includes(packagePaths.optional));
    assert.ok(result.files >= 10 && result.bytes > 0);
    assert.match(result.manifestSha256, /^[a-f0-9]{64}$/);
    assert.ok(JSON.stringify(result.fileManifest).includes(fixture.nativeSha256), 'native bytes must be hashed without loading');
    assert.ok(JSON.stringify(result.fileManifest).includes('nanoid'), 'contained bin link must be represented');
    assert.deepEqual(fs.readFileSync(path.join(fixture.stage, 'node_modules/.package-lock.json')), before, 'inspection must preserve generated hidden lock');
  });
  await test('reject absent devOptional-only package when development dependencies included', async () => {
    const fixture = installedFixture();
    delete fixture.lock.packages[packagePaths.optional].optional;
    fixture.lock.packages[packagePaths.optional].devOptional = true;
    assert.throws(() => inspectInstalled(fixture.stage, fixture.lock), error => {
      safeRejection(error);
      assert.equal(error.code, 'REQUIRED_LOCKED_PACKAGE_MISSING');
      return true;
    });
  });
  await test('accept regular es5-ext prototype path containing hash character', async () => {
    const fixture = installedFixture();
    const relative = 'node_modules/es5-ext';
    fixture.lock.packages[relative] = packageEntry('es5-ext', '0.10.64');
    fixture.hidden.packages[relative] = clone(fixture.lock.packages[relative]);
    writeJSON(path.join(fixture.stage, relative, 'package.json'), { name: 'es5-ext', version: '0.10.64' });
    const asset = path.join(fixture.stage, relative, 'array/#/e-index-of.js');
    fs.mkdirSync(path.dirname(asset), { recursive: true });
    fs.writeFileSync(asset, 'module.exports = null;\n');
    writeJSON(path.join(fixture.stage, 'node_modules/.package-lock.json'), fixture.hidden);
    const result = await inspectInstalled(fixture.stage, fixture.lock);
    assert.equal(result.status, 'PRIVATE_LOCKED_DEPENDENCIES_INSPECTED');
    assert.ok(result.fileManifest.some(row => row.file.endsWith('/array/#/e-index-of.js')));
  });
  await test('report optional archive retained in hidden lock but absent on platform', async () => {
    const fixture = installedFixture();
    fixture.hidden.packages[packagePaths.optional] = clone(fixture.lock.packages[packagePaths.optional]);
    writeJSON(path.join(fixture.stage, 'node_modules/.package-lock.json'), fixture.hidden);
    const result = await inspectInstalled(fixture.stage, fixture.lock);
    assert.equal(result.status, 'PRIVATE_LOCKED_DEPENDENCIES_INSPECTED');
    assert.ok(JSON.stringify(result.hiddenLock.absentOptionalEntries).includes(packagePaths.optional));
  });
  await test('accept npm alias with explicit locked actual package identity', async () => {
    const fixture = installedFixture();
    fixture.manifest.dependencies.alias = 'npm:actual@1.0.0';
    fixture.lock.packages[''].dependencies.alias = 'npm:actual@1.0.0';
    const relative = 'node_modules/alias';
    fixture.lock.packages[relative] = packageEntry('actual', '1.0.0', { name: 'actual' });
    fixture.hidden.packages[relative] = clone(fixture.lock.packages[relative]);
    writeJSON(path.join(fixture.stage, 'package.json'), fixture.manifest);
    writeJSON(path.join(fixture.stage, 'package-lock.json'), fixture.lock);
    writeJSON(path.join(fixture.stage, relative, 'package.json'), { name: 'actual', version: '1.0.0' });
    writeJSON(path.join(fixture.stage, 'node_modules/.package-lock.json'), fixture.hidden);
    const policy = await validateLock(fixture.manifest, fixture.lock);
    assert.equal(policy.status, 'LOCK_POLICY_PASS');
    const result = await inspectInstalled(fixture.stage, fixture.lock);
    assert.equal(result.status, 'PRIVATE_LOCKED_DEPENDENCIES_INSPECTED');
    assert.ok(result.installed.some(row => row.file === relative && row.name === 'actual' && row.version === '1.0.0'));
  });
  await rejectTree('reject selected package with wrong name and matching version', f => { writeJSON(path.join(f.stage, packagePaths.resend, 'package.json'), { name: 'other-package', version: '6.22.1' }); });
  await test('permit exact optional WASI bundle declaration only with directory absent', async () => {
    assert.equal(process.platform, 'linux', 'fixture expectation requires current qualification platform');
    assert.equal(process.arch, 'x64', 'fixture expectation requires current qualification architecture');
    const fixture = installedFixture();
    const relative = 'node_modules/@tailwindcss/oxide-wasm32-wasi';
    fixture.lock.packages[relative] = packageEntry('@tailwindcss/oxide-wasm32-wasi', '4.3.3', {
      optional: true, cpu: ['wasm32'], bundleDependencies: ['@emnapi/core'],
    });
    fixture.hidden.packages[relative] = clone(fixture.lock.packages[relative]);
    writeJSON(path.join(fixture.stage, 'node_modules/.package-lock.json'), fixture.hidden);
    const policy = await validateLock(fixture.manifest, fixture.lock);
    assert.equal(policy.platformExcludedBundleDeclarations.length, 1);
    assert.equal(policy.platformExcludedBundleDeclarations[0].file, relative);
    const result = await inspectInstalled(fixture.stage, fixture.lock);
    assert.equal(result.status, 'PRIVATE_LOCKED_DEPENDENCIES_INSPECTED');
    assert.ok(result.absentOptional.some(row => row.file === relative && row.platformExcluded === true));
  });
  await test('reject platform-excluded WASI package even if directory is empty', async () => {
    const fixture = installedFixture();
    const relative = 'node_modules/@tailwindcss/oxide-wasm32-wasi';
    fixture.lock.packages[relative] = packageEntry('@tailwindcss/oxide-wasm32-wasi', '4.3.3', {
      optional: true, cpu: ['wasm32'], bundleDependencies: ['@emnapi/core'],
    });
    fs.mkdirSync(path.join(fixture.stage, relative), { recursive: true });
    assert.throws(() => inspectInstalled(fixture.stage, fixture.lock), error => {
      safeRejection(error);
      assert.equal(error.code, 'PLATFORM_EXCLUDED_PACKAGE_PRESENT');
      return true;
    });
  });
  await rejectTree('reject installed version mismatch', f => { writeJSON(path.join(f.stage, packagePaths.resend, 'package.json'), { name: 'resend', version: '6.24.0' }); });
  await rejectTree('reject missing required package', f => { fs.rmSync(path.join(f.stage, packagePaths.pg), { recursive: true }); delete f.hidden.packages[packagePaths.pg]; writeJSON(path.join(f.stage, 'node_modules/.package-lock.json'), f.hidden); });
  await rejectTree('reject missing selected build dependency', f => { fs.rmSync(path.join(f.stage, packagePaths.react), { recursive: true }); delete f.hidden.packages[packagePaths.react]; writeJSON(path.join(f.stage, 'node_modules/.package-lock.json'), f.hidden); });
  await rejectTree('reject malformed installed metadata', f => { fs.writeFileSync(path.join(f.stage, packagePaths.pg, 'package.json'), '{bad JSON'); });
  await rejectTree('reject missing hidden installation lock', f => { fs.unlinkSync(path.join(f.stage, 'node_modules/.package-lock.json')); });
  await rejectTree('reject hidden installed version mismatch', f => { f.hidden.packages[packagePaths.pg].version = '8.99.0'; writeJSON(path.join(f.stage, 'node_modules/.package-lock.json'), f.hidden); });
  await rejectTree('reject hidden unknown package', f => { f.hidden.packages['node_modules/unknown'] = packageEntry('unknown', '1.0.0'); writeJSON(path.join(f.stage, 'node_modules/.package-lock.json'), f.hidden); });
  await rejectTree('reject hidden missing installed entry', f => { delete f.hidden.packages[packagePaths.pg]; writeJSON(path.join(f.stage, 'node_modules/.package-lock.json'), f.hidden); });
  await rejectTree('reject unlisted physical package', f => { writeJSON(path.join(f.stage, 'node_modules/unlisted/package.json'), { name: 'unlisted', version: '1.0.0' }); });
  await rejectTree('reject symlink escaping stage', f => { fs.writeFileSync(path.join(f.root, 'outside.cjs'), 'outside'); fs.unlinkSync(path.join(f.stage, 'node_modules/.bin/nanoid')); fs.symlinkSync(path.join(f.root, 'outside.cjs'), path.join(f.stage, 'node_modules/.bin/nanoid')); });
  await rejectTree('reject directory symlink', f => { fs.symlinkSync('../pg', path.join(f.stage, 'node_modules/.bin/linked-directory')); });
  await rejectTree('reject dangling bin symlink', f => { fs.symlinkSync('../missing/cli.cjs', path.join(f.stage, 'node_modules/.bin/missing')); });
  await rejectTree('reject symlinked installed package.json', f => { const metadata = path.join(f.stage, packagePaths.pg, 'package.json'); fs.renameSync(metadata, metadata + '.saved'); fs.symlinkSync('package.json.saved', metadata); });
} finally {
  for (const root of temporaryRoots) fs.rmSync(root, { recursive: true, force: true });
}
const report = {
  scope: 'SYNTHETIC_LOCK_AND_PRIVATE_FILESYSTEM_FIXTURES_NO_NPM_NETWORK_OR_PACKAGE_EXECUTION',
  total: results.length,
  passed: results.filter(r => r.status === 'PASS').length,
  failed: results.filter(r => r.status === 'FAIL').length,
  results,
};
fs.writeFileSync(path.join(HERE, 'r16d-locked-dependency-policy-fixture-results.json'), JSON.stringify(report, null, 2) + '\n');
const text = results.map(r => `${r.status} ${r.name}${r.diagnostic ? `: ${r.diagnostic}` : ''}`).join('\n') + `\nTOTAL=${report.total} PASS=${report.passed} FAIL=${report.failed}\n`;
fs.writeFileSync(path.join(HERE, 'r16d-locked-dependency-policy-fixture-results.txt'), text);
process.stdout.write(text);
if (report.failed) process.exitCode = 1;
