import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { randomBytes } from 'node:crypto';

// This runner loads only the copied bcrypt package and its native loader.
// The parent pins the copied files and checks preservation before/after this run.
const EXPECTED_NODE = 'v24.13.0';
let phase = 'ARGUMENTS';
let reportDir;
let candidateDir;
let requireFromCandidate;
let originalNativeExtension;
let selectedBinding;
const loadedNativeFiles = new Set();

function fail(code) {
  const error = new Error(code);
  error.code = code;
  throw error;
}
function assert(value, code) { if (!value) fail(code); }
function relativeInside(base, absolute, code) {
  assert(typeof absolute === 'string' && path.isAbsolute(absolute), code);
  const relative = path.relative(base, absolute);
  assert(relative && relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative), code);
  assert(!/[\u0000-\u001f\u007f]/.test(relative), code);
  return relative.split(path.sep).join('/');
}
function canonicalDirectory(directory, code) {
  assert(typeof directory === 'string' && path.isAbsolute(directory), code);
  assert(path.resolve(directory) === directory, code);
  assert(fs.lstatSync(directory).isDirectory(), code);
  assert(fs.realpathSync(directory) === directory, code);
  return directory;
}
function canonicalFile(base, file, code) {
  const relative = relativeInside(base, file, code);
  const stat = fs.lstatSync(file);
  assert(stat.isFile() && stat.size > 0, code);
  assert(fs.realpathSync(file) === file, code);
  return relative;
}
function checkRequireCache() {
  return Object.keys(requireFromCandidate.cache).sort().map(file => {
    const relative = canonicalFile(candidateDir, file, 'REQUIRE_CACHE_OUTSIDE_CANDIDATE');
    assert(file !== path.join(candidateDir, 'server.mjs'), 'SERVER_MODULE_IMPORTED');
    return relative;
  });
}
function privateEvidence(value) {
  assert(reportDir, 'REPORT_DIRECTORY_UNQUALIFIED');
  canonicalDirectory(reportDir, 'REPORT_DIRECTORY_CHANGED');
  fs.writeFileSync(path.join(reportDir, 'native-smoke-evidence.json'), `${JSON.stringify(value, null, 2)}\n`, {
    encoding: 'utf8', flag: 'wx', mode: 0o600,
  });
}

try {
  process.umask(0o077);
  assert(process.argv.length === 4, 'EXPECTED_TWO_ARGUMENTS');
  const requestedCandidate = process.argv[2];
  const requestedReport = process.argv[3];
  assert(/^\/home\/runner\/workspace\/\.mmhb-release-evidence\/r17-[A-Za-z0-9]+$/.test(requestedReport), 'REPORT_DIRECTORY_FORMAT');
  canonicalDirectory(requestedReport, 'REPORT_DIRECTORY_NOT_CANONICAL');
  assert((fs.statSync(requestedReport).mode & 0o077) === 0, 'REPORT_DIRECTORY_NOT_PRIVATE');
  reportDir = requestedReport;
  assert(requestedCandidate === path.join(reportDir, 'candidate'), 'CANDIDATE_DIRECTORY_FORMAT');
  candidateDir = canonicalDirectory(requestedCandidate, 'CANDIDATE_DIRECTORY_NOT_CANONICAL');

  phase = 'RUNTIME';
  assert(process.version === EXPECTED_NODE && process.platform === 'linux' && process.arch === 'x64', 'RUNTIME_MISMATCH');
  assert(process.env.NODE_ENV === 'production', 'PRODUCTION_ENVIRONMENT_REQUIRED');
  const override = /^(NODE_OPTIONS|NODE_PATH|BCRYPT_PREBUILD|PREBUILDS_ONLY|npm_config_arch|npm_config_platform|LIBC|ARM_VERSION|ELECTRON_RUN_AS_NODE)$/i;
  assert(!Object.keys(process.env).some(key => override.test(key) && process.env[key] !== ''), 'NATIVE_RESOLUTION_ENVIRONMENT_OVERRIDE');

  phase = 'PACKAGE_RESOLUTION';
  const serverFile = path.join(candidateDir, 'server.mjs');
  canonicalFile(candidateDir, serverFile, 'SERVER_ANCHOR_NOT_CANONICAL');
  requireFromCandidate = createRequire(serverFile); // Resolution anchor only; server is never imported.
  originalNativeExtension = requireFromCandidate.extensions['.node'];
  assert(typeof originalNativeExtension === 'function', 'NATIVE_EXTENSION_UNAVAILABLE');
  requireFromCandidate.extensions['.node'] = (module, filename) => {
    const relative = canonicalFile(path.join(candidateDir, 'node_modules/bcrypt'), filename, 'NATIVE_LOAD_OUTSIDE_BCRYPT');
    assert(selectedBinding && filename === selectedBinding, 'UNEXPECTED_NATIVE_BINDING');
    originalNativeExtension(module, filename);
    loadedNativeFiles.add(`node_modules/bcrypt/${relative}`);
  };

  const bcryptDirectory = canonicalDirectory(path.join(candidateDir, 'node_modules/bcrypt'), 'BCRYPT_DIRECTORY_NOT_CANONICAL');
  const loaderDirectory = canonicalDirectory(path.join(candidateDir, 'node_modules/node-gyp-build'), 'LOADER_DIRECTORY_NOT_CANONICAL');
  const bcryptEntry = requireFromCandidate.resolve('bcrypt');
  const bcryptRelative = canonicalFile(bcryptDirectory, bcryptEntry, 'BCRYPT_ENTRY_OUTSIDE_PACKAGE');
  const requireFromBcrypt = createRequire(bcryptEntry);
  const loaderEntry = requireFromBcrypt.resolve('node-gyp-build');
  const loaderRelative = canonicalFile(loaderDirectory, loaderEntry, 'LOADER_ENTRY_OUTSIDE_PACKAGE');
  const bcryptMetadataFile = path.join(bcryptDirectory, 'package.json');
  const loaderMetadataFile = path.join(loaderDirectory, 'package.json');
  canonicalFile(bcryptDirectory, bcryptMetadataFile, 'BCRYPT_METADATA_NOT_CANONICAL');
  canonicalFile(loaderDirectory, loaderMetadataFile, 'LOADER_METADATA_NOT_CANONICAL');
  const bcryptMetadata = JSON.parse(fs.readFileSync(bcryptMetadataFile, 'utf8'));
  const loaderMetadata = JSON.parse(fs.readFileSync(loaderMetadataFile, 'utf8'));
  assert(bcryptMetadata.name === 'bcrypt' && bcryptMetadata.version === '6.0.0', 'BCRYPT_VERSION_MISMATCH');
  assert(loaderMetadata.name === 'node-gyp-build' && loaderMetadata.version === '4.8.4', 'LOADER_VERSION_MISMATCH');

  phase = 'NATIVE_RESOLUTION';
  const loader = requireFromBcrypt(loaderEntry);
  assert(typeof loader === 'function' && typeof loader.resolve === 'function', 'LOADER_RESOLVE_UNAVAILABLE');
  // node-gyp-build can fall back to prebuilds beside process.execPath. Refuse
  // that location before importing bcrypt or loading any native binding.
  selectedBinding = loader.resolve(bcryptDirectory);
  assert(typeof selectedBinding === 'string' && path.extname(selectedBinding) === '.node', 'NATIVE_BINDING_EXTENSION');
  const bindingRelative = canonicalFile(bcryptDirectory, selectedBinding, 'NATIVE_BINDING_OUTSIDE_PACKAGE');
  checkRequireCache();

  phase = 'BCRYPT_IMPORT';
  const bcrypt = requireFromCandidate(bcryptEntry);
  assert(loadedNativeFiles.size === 1 && loadedNativeFiles.has(`node_modules/bcrypt/${bindingRelative}`), 'SELECTED_NATIVE_BINDING_NOT_LOADED');
  assert(['hashSync', 'compareSync', 'getRounds'].every(key => typeof bcrypt[key] === 'function'), 'BCRYPT_API_INCOMPLETE');

  phase = 'SYNTHETIC_HASH_COMPARISON';
  const sample = randomBytes(24).toString('hex');
  const hash = bcrypt.hashSync(sample, 4);
  assert(typeof hash === 'string' && /^\$2[aby]\$04\$[./A-Za-z0-9]{53}$/.test(hash), 'BCRYPT_HASH_FORMAT');
  assert(bcrypt.compareSync(sample, hash) === true, 'CORRECT_PASSWORD_REJECTED');
  assert(bcrypt.compareSync(`${sample}-incorrect`, hash) === false, 'INCORRECT_PASSWORD_ACCEPTED');
  assert(bcrypt.getRounds(hash) === 4, 'BCRYPT_ROUNDS_MISMATCH');

  phase = 'POST_LOAD_BOUNDARIES';
  canonicalFile(bcryptDirectory, selectedBinding, 'NATIVE_BINDING_CHANGED');
  assert(requireFromCandidate.cache[selectedBinding], 'SELECTED_NATIVE_BINDING_NOT_CACHED');
  const loadedModuleFiles = checkRequireCache();
  const evidence = {
    project: 'MyMentalHealthBuddy', status: 'NATIVE_CANDIDATE_SMOKE_PASS',
    runtime: { node: process.version, platform: process.platform, arch: process.arch, modulesABI: process.versions.modules, napi: process.versions.napi },
    packages: { bcrypt: '6.0.0', nodeGypBuild: '4.8.4' },
    paths: { bcryptEntry: `node_modules/bcrypt/${bcryptRelative}`, loaderEntry: `node_modules/node-gyp-build/${loaderRelative}`, binding: `node_modules/bcrypt/${bindingRelative}` },
    checks: { bindingContained: 'PASS', selectedBindingLoaded: 'PASS', syntheticHash: 'PASS', correctPassword: 'PASS', incorrectPassword: 'PASS', rounds: 'PASS', requireCacheContained: 'PASS' },
    loadedNativeFiles: [...loadedNativeFiles].sort(), loadedModuleCount: loadedModuleFiles.length, loadedModuleFiles,
    scope: { serverImported: false, applicationStarted: false, networkRequests: 0, databaseConnections: 0, syntheticOnly: true },
    limitations: ['Copied bcrypt package smoke test on this Node/platform/architecture only', 'Not application authentication, database, browser, or deployed-runtime qualification', 'Containment checks are not an operating-system filesystem/network sandbox'],
  };
  phase = 'EVIDENCE_WRITE';
  privateEvidence(evidence);
  console.log('STATUS=NATIVE_CANDIDATE_SMOKE_PASS');
} catch (error) {
  const code = typeof error?.code === 'string' && /^[A-Z0-9_]{1,80}$/.test(error.code) ? error.code : 'UNEXPECTED_NATIVE_RUNNER_FAILURE';
  const evidence = { project: 'MyMentalHealthBuddy', status: 'NATIVE_CANDIDATE_SMOKE_FAILED', failure: { phase, code } };
  let evidenceSaved = false;
  try { privateEvidence(evidence); evidenceSaved = true; } catch {}
  console.log(`STATUS=NATIVE_CANDIDATE_SMOKE_FAILED PHASE=${phase} CODE=${code} EVIDENCE_SAVED=${evidenceSaved ? 1 : 0}`);
  process.exitCode = 1;
} finally {
  if (requireFromCandidate && originalNativeExtension) requireFromCandidate.extensions['.node'] = originalNativeExtension;
}
