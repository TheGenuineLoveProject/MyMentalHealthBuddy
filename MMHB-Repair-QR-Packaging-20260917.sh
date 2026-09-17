node --input-type=module <<'MMHB_QR_PACKAGE'
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
const root = fs.realpathSync('.');
const target = 'scripts/build-server.mjs';
const baseline = '043944ef15f418f9baee11328aeb7c8bd30ee691138d01a99ee04507f4d07208';
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const say = value => console.log(JSON.stringify(value));
let backup = null, sourceChanged = false, buildRuns = 0, probeFolder;
function packageRuntime(root, destination) {
  const lock = JSON.parse(fs.readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
  const modules = path.join(root, 'node_modules') + path.sep;
  const found = new Map();
  const stable = object => JSON.stringify(Object.entries(object || {}).sort());
  function visit(name, from, optional = false) {
    if (!/^(?:@[a-z0-9_.-]+\/)?[a-z0-9_.-]+$/i.test(name)) throw Error('INVALID_PACKAGE_NAME');
    const search = createRequire(path.join(from, 'package.json')).resolve.paths(name) || [];
    let folder;
    for (const base of search) {
      const candidate = path.join(base, name);
      if (candidate.startsWith(modules) && fs.existsSync(path.join(candidate, 'package.json'))) {
        folder = candidate; break;
      }
    }
    if (!folder) { if (optional) return; throw Error('MISSING_INSTALLED_DEPENDENCY: ' + name); }
    if (fs.realpathSync(folder) !== folder) throw Error('LINKED_PACKAGE_REVIEW_REQUIRED: ' + name);
    const relative = path.relative(root, folder).split(path.sep).join('/');
    if (found.has(relative)) return;
    const pkg = JSON.parse(fs.readFileSync(path.join(folder, 'package.json'), 'utf8'));
    const pinned = lock.packages?.[relative];
    if (!pinned || pinned.link || pkg.name !== name || pkg.version !== pinned.version)
      throw Error('LOCK_MISMATCH: ' + relative);
    for (const field of ['dependencies','optionalDependencies','peerDependencies'])
      if (stable(pkg[field]) !== stable(pinned[field])) throw Error('DEPENDENCY_METADATA_MISMATCH: ' + relative);
    found.set(relative, folder);
    if (found.size > 100) throw Error('DEPENDENCY_SET_REVIEW_REQUIRED');
    for (const dep of Object.keys(pkg.dependencies || {}))
      visit(dep, folder, Object.hasOwn(pkg.optionalDependencies || {}, dep));
    for (const dep of Object.keys(pkg.optionalDependencies || {})) visit(dep, folder, true);
    for (const dep of Object.keys(pkg.peerDependencies || {}))
      visit(dep, folder, pkg.peerDependenciesMeta?.[dep]?.optional === true);
  }
  for (const name of ['bcrypt','node-gyp-build','speakeasy','base32.js','qrcode']) visit(name, root);
  const entries = [...found].sort((a,b) => a[0].split('/').length - b[0].split('/').length || a[0].localeCompare(b[0]));
  if (destination) for (const [relative, folder] of entries) {
    const output = path.join(destination, relative);
    fs.mkdirSync(path.dirname(output), {recursive:true});
    fs.cpSync(folder, output, {recursive:true, dereference:true, filter:source => {
      if (path.relative(folder, source).split(path.sep).includes('node_modules')) return false;
      const actual = fs.realpathSync(source);
      if (actual !== folder && !actual.startsWith(folder + path.sep)) throw Error('PACKAGE_SYMLINK_ESCAPES: ' + relative);
      return true;
    }});
  }
  return entries.map(([relative]) => relative);
}
const probeCode = `
const assert = require('node:assert/strict');
const path = require('node:path');
const {createRequire} = require('node:module');
const load = createRequire(path.join(process.cwd(), 'server.mjs'));
const bcrypt = load('bcrypt'), otp = load('speakeasy'), qr = load('qrcode');
const hashed = bcrypt.hashSync('MMHB public test', 4);
assert.equal(bcrypt.compareSync('MMHB public test', hashed), true);
assert.equal(bcrypt.compareSync('incorrect', hashed), false);
const options = {secret:'12345678901234567890', encoding:'ascii', time:59, digits:8, window:0};
assert.equal(otp.totp(options), '94287082');
assert.equal(otp.totp.verify({...options, token:'94287082'}), true);
assert.equal(otp.totp.verify({...options, token:'94287081'}), false);
const uri = 'otpauth://totp/MMHB:fixture?secret=GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ&issuer=MMHB';
(async () => {
  const data = await qr.toDataURL(uri);
  assert.ok(data.startsWith('data:image/png;base64,'));
  const bytes = Buffer.from(data.split(',')[1], 'base64');
  assert.equal(bytes.subarray(0,8).toString('hex'), '89504e470d0a1a0a');
  const qrLoad = createRequire(load.resolve('qrcode'));
  const png = qrLoad('pngjs').PNG.sync.read(bytes);
  assert.ok(png.width > 20 && png.width === png.height && png.data.length === png.width * png.height * 4);
  assert.ok((await qr.toString(uri, {type:'svg'})).includes('<svg'));
  for (const file of Object.keys(require.cache)) assert.ok(file.startsWith(process.cwd() + path.sep));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
`;
function probe(folder) {
  for (let parent = path.dirname(folder); ; parent = path.dirname(parent)) {
    if (fs.existsSync(path.join(parent,'node_modules'))) throw Error('PROBE_PARENT_HAS_NODE_MODULES');
    if (parent === path.dirname(parent)) break;
  }
  const result = spawnSync(process.execPath, ['--no-global-search-paths','--input-type=commonjs','-e',probeCode], {
    cwd:folder, env:{NODE_ENV:'production'}, encoding:'utf8', timeout:15000
  });
  if (result.error || result.status !== 0) throw Error('ISOLATED_MFA_QR_CHECK_FAILED');
}
try {
  const packageBytes = fs.readFileSync('package.json'), lockBytes = fs.readFileSync('package-lock.json');
  const pkg = JSON.parse(packageBytes);
  if (pkg.name !== 'mymentalhealthbuddy') throw Error('WRONG_PROJECT');
  if (!pkg.dependencies?.qrcode || !pkg.dependencies?.speakeasy) throw Error('PRODUCTION_DEPENDENCY_REVIEW_REQUIRED');
  if (JSON.parse(lockBytes).packages?.['node_modules/qrcode']?.version !== '1.5.4')
    throw Error('QRCODE_VERSION_REVIEW_REQUIRED');
  for (const file of [target,'package.json','package-lock.json','client/dist/index.html'])
    if (!fs.lstatSync(file).isFile() || fs.realpathSync(file) !== path.join(root,file)) throw Error('UNEXPECTED_FILE: ' + file);
  if (fs.existsSync('dist') && (!fs.lstatSync('dist').isDirectory() || fs.lstatSync('dist').isSymbolicLink()))
    throw Error('UNEXPECTED_DIST_PATH');
  const source = fs.readFileSync(target, 'utf8');
  if (sha(source) !== baseline) throw Error('BUILD_SCRIPT_CHANGED_SEND_CURRENT_FILE');
  const start = source.indexOf('// Stage the pinned native-dep tree');
  if (start < 0) throw Error('COPY_SECTION_NOT_FOUND');
  const prefix = source.slice(0,start)
    .replace('WITHOUT a node_modules tree. esbuild inlines every dependency into a single\n// file (dist/server.mjs) that boots with zero runtime install.',
      'with a small packaged node_modules tree. esbuild bundles the application;\n// runtime dependencies are copied below without a runtime install.')
    .replace('pinned tree under dist/node_modules (see NATIVE_DEPS below).', 'pinned tree under dist/node_modules (see packageRuntime below).')
    .replace(/\/\/ Native deps copied verbatim[\s\S]*?const NATIVE_DEPS = [^\n]+\n/, '');
  const candidate = 'import * as fs from "node:fs";\nimport { createRequire } from "node:module";\n' + prefix
    + '// Copy installed runtime dependencies, preserving nested versions.\n'
    + packageRuntime.toString() + '\n'
    + 'const packaged = packageRuntime(ROOT);\n'
    + 'rmSync(path.join(ROOT,"dist","node_modules"), {recursive:true,force:true});\n'
    + 'packageRuntime(ROOT, path.join(ROOT,"dist"));\n'
    + 'console.log("[build-server] runtime packages copied:", packaged.length);\n';
  probeFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'mmhb-qr-probe-'));
  fs.chmodSync(probeFolder, 0o700);
  const packages = packageRuntime(root, probeFolder);
  probe(probeFolder);
  if (!fs.readFileSync('package.json').equals(packageBytes) || !fs.readFileSync('package-lock.json').equals(lockBytes))
    throw Error('PACKAGE_FILES_CHANGED_DURING_CHECK');
  backup = fs.mkdtempSync(path.join(root, 'mmhb-qr-build-backup-'));
  fs.writeFileSync(path.join(backup, 'build-server.mjs'), source, {flag:'wx', mode:0o600});
  if (fs.readFileSync(target, 'utf8') !== source) throw Error('SOURCE_CHANGED_DURING_CHECK');
  fs.writeFileSync(target, candidate); sourceChanged = true;
  say({status:'QR_PACKAGING_PATCHED', backup, packages:packages.length});
  buildRuns++;
  const result = spawnSync(process.execPath, [target], {cwd:root, stdio:'inherit', timeout:120000});
  if (result.error || result.status !== 0) throw Error('SERVER_BUILD_FAILED');
  fs.rmSync(path.join(probeFolder,'node_modules'), {recursive:true,force:true});
  fs.cpSync(path.join(root,'dist','node_modules'), path.join(probeFolder,'node_modules'), {recursive:true,dereference:true});
  probe(probeFolder);
  if (!fs.readFileSync('package.json').equals(packageBytes) || !fs.readFileSync('package-lock.json').equals(lockBytes))
    throw Error('PACKAGE_FILES_CHANGED_DURING_CHECK');
  say({status:'MFA_QR_PACKAGE_CHECK_PASSED', sourceChanged, buildRuns, backup,
    packages:packages.length, buildScriptSha256:sha(fs.readFileSync(target)),
    packageFilesUnchanged:true, deploymentRuns:0, applicationStarted:false,
    releaseStatus:'RUNTIME_AND_RELEASE_CHECKS_PENDING'});
} catch (error) {
  say({status:'STOP', reason:error.message, sourceChanged, buildRuns, backup, deploymentRuns:0});
  process.exitCode = 1;
} finally {
  if (probeFolder) fs.rmSync(probeFolder, {recursive:true,force:true});
}
MMHB_QR_PACKAGE
