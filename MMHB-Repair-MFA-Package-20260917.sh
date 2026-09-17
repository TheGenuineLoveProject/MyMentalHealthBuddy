node --input-type=module <<'MMHB_MFA_PACKAGE'
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
const root = fs.realpathSync('.');
const target = 'scripts/build-server.mjs';
const baseline = '95fd8ce7393f7b99c32d2fad346bb580f736301aa891085e384b911e04d1394c';
const oldLine = 'const NATIVE_DEPS = ["bcrypt", "node-gyp-build"];';
const newLine = '// Include MFA runtime requires as well as native dependencies.\nconst NATIVE_DEPS = ["bcrypt", "node-gyp-build", "speakeasy", "base32.js"];';
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const say = value => console.log(JSON.stringify(value));
let backup = null, sourceChanged = false, buildRuns = 0;
const read = file => {
  const full = path.join(root, file);
  if (!fs.lstatSync(full).isFile() || fs.realpathSync(full) !== full)
    throw Error('UNEXPECTED_FILE: ' + file);
  return fs.readFileSync(full);
};
const probeCode = `
const assert = require('node:assert/strict');
const path = require('node:path');
const { createRequire } = require('node:module');
const folder = process.argv[1];
const load = createRequire(path.join(folder, 'server.mjs'));
for (const name of ['speakeasy', 'base32.js'])
  assert.ok(load.resolve(name).startsWith(path.join(folder, 'node_modules') + path.sep));
const otp = load('speakeasy');
const options = {secret:'12345678901234567890', encoding:'ascii', time:59, digits:8, window:0};
assert.equal(otp.totp(options), '94287082');
assert.equal(otp.totp.verify({...options, token:'94287082'}), true);
assert.equal(otp.totp.verify({...options, token:'94287081'}), false);
assert.equal(otp.totp({...options, encoding:'base32', secret:'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ'}), '94287082');
`;
function probe(modules) {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'mmhb-mfa-probe-'));
  try {
    for (const name of ['speakeasy', 'base32.js'])
      fs.cpSync(path.join(modules, name), path.join(folder, 'node_modules', name), {recursive:true, dereference:true});
    const result = spawnSync(process.execPath, ['--input-type=commonjs', '-e', probeCode, folder], {
      cwd:folder, env:{NODE_ENV:'production'}, encoding:'utf8', timeout:10000
    });
    if (result.error || result.status !== 0) throw Error('ISOLATED_MFA_PACKAGE_CHECK_FAILED');
  } finally { fs.rmSync(folder, {recursive:true, force:true}); }
}
try {
  const packageBytes = read('package.json'), lockBytes = read('package-lock.json');
  const pkg = JSON.parse(packageBytes), lock = JSON.parse(lockBytes);
  if (pkg.name !== 'mymentalhealthbuddy') throw Error('WRONG_PROJECT');
  if (!pkg.dependencies?.speakeasy) throw Error('PRODUCTION_DEPENDENCY_REVIEW_REQUIRED');
  const source = read(target).toString('utf8');
  const original = source.includes(newLine) ? source.replace(newLine, oldLine) : source;
  if (sha(original) !== baseline) throw Error('BUILD_SCRIPT_CHANGED_SEND_CURRENT_FILE');
  const candidate = original.replace(oldLine, newLine);
  for (const [name, version] of [['speakeasy','2.0.0'], ['base32.js','0.0.1']]) {
    const dep = JSON.parse(read('node_modules/' + name + '/package.json'));
    if (dep.version !== version || lock.packages?.['node_modules/' + name]?.version !== version)
      throw Error('DEPENDENCY_VERSION_REVIEW_REQUIRED: ' + name);
    const expected = name === 'speakeasy' ? {'base32.js':'0.0.1'} : {};
    if (JSON.stringify(dep.dependencies || {}) !== JSON.stringify(expected))
      throw Error('DEPENDENCY_TREE_REVIEW_REQUIRED: ' + name);
  }
  read('client/dist/index.html');
  if (fs.existsSync('dist') && (!fs.lstatSync('dist').isDirectory() || fs.lstatSync('dist').isSymbolicLink()))
    throw Error('UNEXPECTED_DIST_PATH');
  probe(path.join(root, 'node_modules'));
  if (source !== candidate) {
    backup = fs.mkdtempSync(path.join(root, 'mmhb-mfa-build-backup-'));
    fs.writeFileSync(path.join(backup, 'build-server.mjs'), source, {flag:'wx', mode:0o600});
    if (read(target).toString('utf8') !== source) throw Error('SOURCE_CHANGED_DURING_CHECK');
    fs.writeFileSync(path.join(root, target), candidate);
    sourceChanged = true;
  }
  say({status:sourceChanged ? 'BUILD_PACKAGING_PATCHED' : 'PATCH_ALREADY_PRESENT', backup});
  buildRuns++;
  const build = spawnSync(process.execPath, [target], {cwd:root, stdio:'inherit', timeout:120000});
  if (build.error || build.status !== 0) throw Error('SERVER_BUILD_FAILED');
  probe(path.join(root, 'dist', 'node_modules'));
  if (!read('package.json').equals(packageBytes) || !read('package-lock.json').equals(lockBytes))
    throw Error('PACKAGE_FILES_CHANGED_DURING_CHECK');
  say({status:'MFA_PACKAGE_CHECK_PASSED', sourceChanged, buildRuns, backup,
    packageFilesUnchanged:true, deploymentRuns:0, releaseStatus:'RUNTIME_AND_RELEASE_CHECKS_PENDING'});
} catch (error) {
  say({status:'STOP', reason:error.message, sourceChanged, buildRuns, backup, deploymentRuns:0});
  process.exitCode = 1;
}
MMHB_MFA_PACKAGE
