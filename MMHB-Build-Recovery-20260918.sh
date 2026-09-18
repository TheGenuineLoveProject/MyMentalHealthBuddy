#!/usr/bin/env bash
# MMHB only. Build and inspect generated files; do not start or publish the app.
set -euo pipefail
env -u NODE_OPTIONS -u NODE_PATH node --input-type=module <<'MMHB_RECOVERY_BUILD'
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fs.realpathSync('.');
const expected = {
  'server/routes/account.mjs': '1ff6658175622c23e282ddfa211a6b9ac6e2a4786585ec2f515765710042185d',
  'server/utils/email.mjs': '9a787e04026ec9225fca35420546d744fc78874958739eab76a0c9754fef7113',
  'scripts/build-server.mjs': '9e046524ba1e77b5202c0bbe895b8a6a430e38b5188b1a2f2613525a183c4816',
};
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fail = code => { throw Object.assign(new Error(code), { safeCode: code }); };
const read = relative => {
  const full = path.join(root, relative);
  const stat = fs.lstatSync(full);
  if (!stat.isFile() || fs.realpathSync(full) !== full || stat.size > 33554432)
    fail('REGULAR_FILE_REQUIRED:' + relative);
  return fs.readFileSync(full);
};
let buildRuns = 0;
let logDirectory = null;
const scope = {
  applicationStarted: false, databaseChecksRun: false, emailsSent: 0,
  deploymentRuns: 0, productionVerified: false,
};

try {
  if (JSON.parse(read('package.json')).name !== 'mymentalhealthbuddy') fail('WRONG_PROJECT');
  for (const [file, digest] of Object.entries(expected))
    if (sha(read(file)) !== digest) fail('SOURCE_REVIEW_REQUIRED:' + file);

  // The reviewed builder replaces these generated paths. Refuse redirected paths.
  for (const relative of ['dist', 'dist/client', 'dist/client/dist', 'dist/node_modules', 'client/dist']) {
    const full = path.join(root, relative);
    try {
      if (!fs.lstatSync(full).isDirectory() || fs.realpathSync(full) !== full)
        fail('GENERATED_DIRECTORY_REVIEW_REQUIRED:' + relative);
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  const monitored = [
    ...Object.keys(expected), 'server/app.mjs', 'package.json', 'package-lock.json',
    'server/db/schema.canonical.sql', 'client/dist/index.html', '.replit', '.replitignore',
  ];
  const before = Object.fromEntries(monitored.map(file => [file, sha(read(file))]));
  logDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'mmhb-recovery-build-'));
  fs.chmodSync(logDirectory, 0o700);
  buildRuns = 1;
  const built = spawnSync(process.execPath, ['scripts/build-server.mjs'], {
    cwd: root, encoding: 'utf8', timeout: 120000, maxBuffer: 4194304,
  });
  fs.writeFileSync(path.join(logDirectory, 'build.log'),
    (built.stdout || '') + (built.stderr || ''), { flag: 'wx', mode: 0o600 });
  if (built.error || built.status !== 0) fail('SERVER_BUILD_FAILED');
  for (const file of monitored)
    if (sha(read(file)) !== before[file]) fail('MONITORED_SOURCE_CHANGED:' + file);

  const bundle = read('dist/server.mjs');
  const syntax = spawnSync(process.execPath, ['--check', '--input-type=module'], {
    input: bundle, timeout: 30000, maxBuffer: 1048576,
  });
  if (syntax.error || syntax.status !== 0) fail('BUNDLE_SYNTAX_FAILED');
  const text = bundle.toString('utf8');
  for (const message of [
    'Password reset email accepted by provider', 'Password reset email not accepted by provider',
    'EMAIL_NOT_CONFIGURED', 'EMAIL_PROVIDER_REJECTED', 'EMAIL_ACCEPTANCE_UNCONFIRMED',
  ]) if (!text.includes(message)) fail('RECOVERY_RESULT_TEXT_MISSING');
  if (sha(read('dist/client/dist/index.html')) !== before['client/dist/index.html'])
    fail('PACKAGED_CLIENT_INDEX_MISMATCH');
  if (sha(read('dist/schema.canonical.sql')) !== before['server/db/schema.canonical.sql'])
    fail('PACKAGED_SCHEMA_MISMATCH');

  const resolve = createRequire(pathToFileURL(path.join(root, 'dist/server.mjs')));
  const inside = path.join(root, 'dist/node_modules') + path.sep;
  const runtimeEntries = [];
  for (const name of ['bcrypt', 'node-gyp-build', 'speakeasy', 'base32.js', 'qrcode']) {
    const entry = fs.realpathSync(resolve.resolve(name));
    if (!entry.startsWith(inside) || !fs.statSync(entry).isFile()) fail('RUNTIME_ENTRY_OUTSIDE_DIST:' + name);
    runtimeEntries.push(name);
  }
  const count = built.stdout?.match(/runtime packages copied:\s*(\d+)/)?.[1];
  if (!count) fail('RUNTIME_PACKAGE_REPORT_MISSING');
  const report = {
    status: 'RECOVERY_BUILD_STATIC_CHECKS_PASSED', buildRuns,
    sourceHashes: before, bundleSha256: sha(bundle), bundleBytes: bundle.length,
    runtimePackagesCopied: Number(count), runtimeEntriesInsideDist: runtimeEntries,
    monitoredSourceFilesUnchanged: true, recoveryResultTextPresent: true,
    packagedClientIndexMatches: true, packagedSchemaMatches: true,
    verificationScope: 'static artifact checks; no application or email execution',
    logDirectory, ...scope,
  };
  fs.writeFileSync(path.join(logDirectory, 'result.json'), JSON.stringify(report, null, 2), { flag: 'wx', mode: 0o600 });
  console.log(JSON.stringify(report));
} catch (error) {
  console.log(JSON.stringify({status: 'STOP', reason: error.safeCode || 'BUILD_INSPECTION_FAILED',
    buildRuns, logDirectory, ...scope}));
  process.exitCode = 1;
}
MMHB_RECOVERY_BUILD
