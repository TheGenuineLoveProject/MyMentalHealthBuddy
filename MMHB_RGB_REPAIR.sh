#!/usr/bin/env bash
set -eu
cd /home/runner/workspace
env -u NODE_OPTIONS -u NODE_PATH -u NODE_V8_COVERAGE \
NODE_DISABLE_COMPILE_CACHE=1 node --input-type=module <<'MMHB_RGB_REPAIR'
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = '/home/runner/workspace';
const OLD = '4cd664160fa56ca74c6f4ce8f956b52d547df66b7d28330f50e19c5778080f83';
const NEW = '1683170369367eaba4e36b9d25ea5eca6fe9549152c2c4b6cb2e2686eb20ae61';
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const check = (ok, message) => { if (!ok) throw Error(message); };
const values = {
  sage: '143 191 159', 'sage-deep': '47 93 93',
  blossom: '244 199 195', 'deep-teal': '47 93 93',
  teal: '47 93 93', ink: '58 58 58', gold: '212 175 55'
};
function checked(relative) {
  check(!path.isAbsolute(relative) && relative.split('/').every(
    part => part && part !== '.' && part !== '..'
  ), 'INVALID_PATH');
  let full = ROOT;
  for (const part of relative.split('/')) {
    full = path.join(full, part);
    check(!fs.lstatSync(full).isSymbolicLink(), 'SYMLINK_PATH:' + relative);
  }
  return full;
}
function read(relative) {
  const full = checked(relative);
  const stat = fs.statSync(full);
  check(stat.isFile() && stat.size <= 2 * 1024 * 1024,
    'UNEXPECTED_FILE:' + relative);
  return fs.readFileSync(full);
}

try {
  check(fs.realpathSync('.') === ROOT, 'WRONG_WORKSPACE');
  const target = checked('client/src/index.css');
  const before = read('client/src/index.css');
  const currentHash = sha(before);
  if (currentHash === NEW) {
    console.log('STATUS=ALREADY_APPLIED');
    console.log('APPLICATION_FILES_CHANGED_THIS_RUN=0');
  } else {
    check(currentHash === OLD, 'SOURCE_CHANGED_NO_PATCH_APPLIED');

    // Space-separated RGB with a slash needs a different migration.
    // Inspect live UI sources without executing them or printing their contents.
    const modern = /rgba?\(\s*var\(\s*--glp-(?:sage|sage-deep|blossom|deep-teal|teal|ink|gold)-rgb\s*\)\s*\//i;
    const skip = new Set(['node_modules', 'dist', 'build', 'coverage']);
    let bytes = 0, files = 0;
    function inspect(relative, depth = 0) {
      check(depth <= 20, 'SCAN_DEPTH_EXCEEDED');
      for (const entry of fs.readdirSync(checked(relative), { withFileTypes: true })) {
        if (entry.name.startsWith('.') || skip.has(entry.name)) continue;
        const name = relative + '/' + entry.name;
        check(!entry.isSymbolicLink(), 'SYMLINK_REQUIRES_REVIEW:' + name);
        if (entry.isDirectory()) inspect(name, depth + 1);
        else if (/\.(?:css|scss|sass|less|jsx?|tsx?|mjs|html)$/.test(name)) {
          const data = read(name);
          bytes += data.length;
          check(++files <= 6000 && bytes <= 48 * 1024 * 1024, 'SCAN_LIMIT');
          check(!modern.test(data.toString('utf8')), 'MODERN_RGB_USE_REQUIRES_REVIEW:' + name);
        }
      }
    }
    inspect('client/src');

    let after = before.toString('utf8');
    for (const [name, value] of Object.entries(values)) {
      const oldLine = '--glp-' + name + '-rgb: ' + value + ';';
      check(after.split(oldLine).length === 2, 'AMBIGUOUS_DECLARATION:' + name);
      after = after.replace(oldLine,
        '--glp-' + name + '-rgb: ' + value.replaceAll(' ', ', ') + ';');
    }
    check(sha(after) === NEW, 'PATCH_CHECKSUM_MISMATCH');

    const backup = fs.mkdtempSync(path.join(ROOT, 'mmhb-rgb-backup-'));
    fs.chmodSync(backup, 0o700);
    fs.writeFileSync(path.join(backup, 'index.css.original'), before,
      { flag: 'wx', mode: 0o600 });
    const temporary = path.join(path.dirname(target), '.mmhb-rgb-' + crypto.randomUUID());
    fs.writeFileSync(temporary, after,
      { flag: 'wx', mode: fs.statSync(target).mode & 0o777 });
    try {
      check(sha(read('client/src/index.css')) === OLD, 'SOURCE_CHANGED_DURING_PATCH');
      fs.renameSync(temporary, target);
    } finally {
      if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
    }
    check(sha(read('client/src/index.css')) === NEW, 'POST_WRITE_CHECK_FAILED');
    console.log('STATUS=RGB_REPAIR_APPLIED');
    console.log('APPLICATION_FILES_CHANGED=1');
    console.log('RGB_DECLARATIONS_CORRECTED=7');
    console.log('BACKUP=' + path.join(backup, 'index.css.original'));
  }

  console.log('BUILD_RUNS=0 DEPLOYMENT_RUNS=0');
  console.log('BEGIN_NEXT_STYLE_BASELINES');
  for (const file of [
    'client/src/main.jsx', 'client/src/styles/brand-tokens.css',
    'client/src/styles/brand.css', 'client/src/styles/sacred.css',
    'client/src/styles/accessibility.css', 'client/src/styles/lumi-visual-system.css',
    'client/index.html', 'tailwind.config.js'
  ]) {
    try { console.log(file + ' SHA256=' + sha(read(file))); }
    catch (error) { if (error.code === 'ENOENT') console.log(file + ' MISSING'); else throw error; }
  }
  console.log('END_NEXT_STYLE_BASELINES');
} catch (error) {
  console.error('STATUS=STOPPED_REVIEW_REQUIRED');
  console.error('REASON=' + String(error.code || error.message));
  process.exitCode = 1;
}
MMHB_RGB_REPAIR
