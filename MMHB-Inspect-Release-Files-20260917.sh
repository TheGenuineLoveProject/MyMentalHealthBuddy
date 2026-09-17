#!/usr/bin/env bash
env -u NODE_OPTIONS -u NODE_PATH node --no-global-search-paths --input-type=module <<'MMHB_RELEASE_FILES'
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const root = fs.realpathSync('.');
const say = value => console.log(JSON.stringify(value));
const read = name => {
  const full = path.join(root, name);
  const stat = fs.lstatSync(full);
  if (!stat.isFile() || fs.realpathSync(full) !== full || stat.size > 33554432)
    throw Object.assign(new Error(), { code: 'FILE_NEEDS_REVIEW' });
  return fs.readFileSync(full);
};
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
try {
  const pkg = JSON.parse(read('package.json'));
  if (pkg.name !== 'mymentalhealthbuddy')
    throw Object.assign(new Error(), { code: 'WRONG_PROJECT' });
  const expected = {
    'scripts/build-server.mjs': '9e046524ba1e77b5202c0bbe895b8a6a430e38b5188b1a2f2613525a183c4816',
    '.replit': 'fdd7294d6332ab7814be58d8021b3ffee7e5f2157c035752454c541d3de34b63',
    '.replitignore': '6d29d03fe1eaa92c7c0868c19c1afa487c7872252334b691a81b7a41ff246429'
  };
  for (const [file, known] of Object.entries(expected)) {
    try {
      const hash = sha(read(file));
      say({ check: 'CONFIG_FILE', file, sha256: hash, matchesReviewedCopy: hash === known });
    } catch (error) {
      say({ check: 'CONFIG_FILE', file, matchesReviewedCopy: false, code: error.code || 'READ_FAILED' });
    }
  }
  for (const file of ['dist/server.mjs', 'dist/client/dist/index.html']) {
    const bytes = read(file);
    say({ check: 'ARTIFACT', file, bytes: bytes.length, sha256: sha(bytes) });
  }
  const resolve = createRequire(path.join(root, 'dist/server.mjs')).resolve;
  const packagedRoot = path.join(root, 'dist/node_modules') + path.sep;
  for (const name of ['bcrypt', 'node-gyp-build', 'speakeasy', 'base32.js', 'qrcode']) {
    try {
      const entry = fs.realpathSync(resolve(name));
      say({ check: 'RUNTIME_ENTRY', name, resolvesInsideDist: entry.startsWith(packagedRoot) });
    } catch (error) {
      say({ check: 'RUNTIME_ENTRY', name, resolvesInsideDist: false, code: error.code || 'RESOLVE_FAILED' });
    }
  }
  say({ status: 'WORKSPACE_RELEASE_FILES_REPORTED', sourceFilesChanged: 0,
    applicationStarted: false, deploymentRuns: 0, publishedRevisionVerified: false });
} catch (error) {
  say({ status: 'STOP', code: error.code || 'INSPECTION_FAILED', sourceFilesChanged: 0,
    applicationStarted: false, deploymentRuns: 0 });
  process.exitCode = 1;
}
MMHB_RELEASE_FILES
