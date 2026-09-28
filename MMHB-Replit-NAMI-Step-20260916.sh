bash <<'MMHB_SETUP'
set -euo pipefail
node --input-type=module <<'MMHB_PROJECT'
import fs from 'node:fs';
if (JSON.parse(fs.readFileSync('package.json', 'utf8')).name !== 'mymentalhealthbuddy') {
  console.log('STOP: open the MyMentalHealthBuddy project root.');
  process.exit(1);
}
MMHB_PROJECT
if [ ! -e mmhb-nami-repair.mjs ] && [ ! -L mmhb-nami-repair.mjs ]; then
  ( set -o noclobber
    cat > mmhb-nami-repair.mjs <<'MMHB_SCRIPT'
#!/usr/bin/env node
// MMHB-NAMI-20260915. No dependencies, network calls, builds, or deployments.
// Run from the existing MMHB project root. Default mode only reads source metadata.
// Reference checked 2026-09-15: https://www.nami.org/nami-helpline/
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const target = 'client/src/pages/CrisisResources.jsx';
const beforeBlock = `  {
    name: "National Alliance on Mental Illness (NAMI)",
    description: "Support, education, and advocacy for mental health",
    phone: "1-800-950-NAMI (6264)",
    text: "Text NAMI to 741741",
    website: "https://www.nami.org",
    available: "Mon-Fri, 10am-10pm ET",
    priority: false,
  },`;
const afterBlock = `  {
    name: "National Alliance on Mental Illness (NAMI)",
    description: "Non-crisis emotional support, mental health information, and resources",
    phone: "1-800-950-NAMI (6264)",
    text: "Text NAMI to 62640",
    website: "https://www.nami.org/nami-helpline/",
    available: "Mon-Fri, 10am-10pm ET, excluding federal holidays",
    priority: false,
  },`;
const root = fs.realpathSync(process.cwd());
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const output = value => console.log(JSON.stringify(value, null, 2));
const fail = reason => { throw Error(reason); };
let lock;
let lockPath;
let tempPath;
function regular(relative) {
  const full = path.resolve(root, relative);
  if (!full.startsWith(root + path.sep)) fail('PATH_OUTSIDE_PROJECT');
  let part = root;
  for (const name of path.relative(root, full).split(path.sep)) {
    part = path.join(part, name);
    if (fs.lstatSync(part).isSymbolicLink()) fail('SYMLINK_REFUSED');
  }
  const st = fs.statSync(full);
  if (!st.isFile() || st.size > 4 * 1024 * 1024) fail('UNEXPECTED_FILE_TYPE_OR_SIZE');
  return full;
}
function read(relative) { return fs.readFileSync(regular(relative)); }
function git(args) {
  const r = spawnSync('git', args, {cwd:root, encoding:'utf8', timeout:5000,
    env:{...process.env,GIT_OPTIONAL_LOCKS:'0'}, maxBuffer:256*1024});
  return r.status === 0 ? r.stdout.trim() : null;
}
function acquire() {
  lockPath = path.join(root, '.mmhb-nami-repair.lock');
  lock = fs.openSync(lockPath, 'wx', 0o600);
}
function replace(bytes, expectedHash, mode) {
  const full = regular(target);
  tempPath = full + '.mmhb-' + crypto.randomUUID() + '.tmp';
  const fd = fs.openSync(tempPath, 'wx', mode);
  try { fs.writeFileSync(fd, bytes); fs.fchmodSync(fd, mode); fs.fsyncSync(fd); }
  finally { fs.closeSync(fd); }
  if (sha(read(target)) !== expectedHash) fail('SOURCE_CHANGED_DURING_REPAIR');
  fs.renameSync(tempPath, full);
  tempPath = null;
  if (sha(read(target)) !== sha(bytes)) fail('WRITE_VERIFICATION_FAILED');
}
try {
  const args = process.argv.slice(2);
  const mode = args[0] || '--inspect';
  if (!['--inspect','--apply','--rollback'].includes(mode) ||
      (mode === '--rollback' ? args.length !== 2 : args.length > 1)) fail('USAGE: --inspect | --apply | --rollback BACKUP_FOLDER');
  const pkg = JSON.parse(read('package.json').toString('utf8'));
  if (pkg.name !== 'mymentalhealthbuddy') fail('WRONG_PROJECT');
  if (mode === '--rollback') {
    const backup = path.resolve(root, args[1]);
    if (path.dirname(backup) !== root || !path.basename(backup).startsWith('mmhb-nami-backup-')) fail('INVALID_BACKUP_FOLDER');
    const prefix = path.relative(root, backup);
    const receipt = JSON.parse(read(prefix + '/receipt.json').toString('utf8'));
    const original = read(prefix + '/before.jsx');
    if (receipt.issue !== 'MMHB-NAMI-20260915' || receipt.root !== root || receipt.target !== target || sha(original) !== receipt.beforeSha256) fail('BACKUP_INTEGRITY_FAILED');
    if (!Number.isInteger(receipt.fileMode) || receipt.fileMode < 0 || receipt.fileMode > 0o777) fail('INVALID_BACKUP_MODE');
    acquire();
    if (sha(read(target)) !== receipt.afterSha256) fail('ROLLBACK_REFUSED_SOURCE_CHANGED');
    replace(original, receipt.afterSha256, receipt.fileMode);
    output({status:'ROLLED_BACK',target,sha256:receipt.beforeSha256,applicationFilesChanged:1});
  } else {
    const bytes = read(target);
    const text = bytes.toString('utf8');
    if (!Buffer.from(text).equals(bytes)) fail('INVALID_UTF8');
    const normalized = text.replaceAll('\r\n','\n');
    if (!normalized.includes('export default function CrisisResources()') || !normalized.includes('CRISIS_HOTLINES.map')) fail('UNRECOGNIZED_COMPONENT');
    if (normalized.split('name: "National Alliance on Mental Illness (NAMI)"').length !== 2) fail('AMBIGUOUS_NAMI_RECORD');
    const oldCount = normalized.split(beforeBlock).length - 1;
    const newCount = normalized.split(afterBlock).length - 1;
    const eligibility = oldCount === 1 && newCount === 0 ? 'EXACT_OLD_BLOCK_MATCH' : newCount === 1 && oldCount === 0 ? 'ALREADY_CORRECT' : 'SOURCE_DIFF_REVIEW_REQUIRED';
    const base = {issue:'MMHB-NAMI-20260915',node:process.version,project:pkg.name,target,sourceSha256:sha(bytes),eligibility};
    if (mode === '--inspect') {
      const hashes = {};
      for (const f of ['package.json','package-lock.json','.replit','server/app.mjs','client/src/App.jsx','client/src/index.css','tailwind.config.js']) {
        try { hashes[f] = sha(read(f)); } catch(e) { hashes[f] = 'UNAVAILABLE:' + (e.code || e.message); }
      }
      const changes = git(['status','--porcelain','--untracked-files=no']);
      output({...base,status:'INSPECTED',head:git(['rev-parse','HEAD']),branch:git(['branch','--show-current']),
        trackedChangeCount:changes === null ? null : changes ? changes.split('\n').length : 0,
        hashes,applicationFilesChanged:0,buildRuns:0,deploymentRuns:0,releaseStatus:'UNVERIFIED'});
    } else if (eligibility === 'ALREADY_CORRECT') {
      output({...base,status:'ALREADY_CORRECT',applicationFilesChanged:0,deploymentRuns:0});
    } else {
      if (eligibility !== 'EXACT_OLD_BLOCK_MATCH') fail('SOURCE_DIFF_REVIEW_REQUIRED');
      const eol = text.includes('\r\n') ? '\r\n' : '\n';
      const oldText = beforeBlock.replaceAll('\n', eol);
      const newText = afterBlock.replaceAll('\n', eol);
      if (text.split(oldText).length !== 2) fail('MIXED_LINE_ENDINGS_REVIEW_REQUIRED');
      const updated = Buffer.from(text.replace(oldText, newText));
      const fileMode = fs.statSync(regular(target)).mode & 0o777;
      acquire();
      if (sha(read(target)) !== sha(bytes)) fail('SOURCE_CHANGED_DURING_REPAIR');
      const backup = fs.mkdtempSync(path.join(root, 'mmhb-nami-backup-'));
      fs.chmodSync(backup, 0o700);
      fs.writeFileSync(path.join(backup,'before.jsx'), bytes, {flag:'wx',mode:0o600});
      const receipt = {issue:base.issue,root,target,fileMode,beforeSha256:sha(bytes),afterSha256:sha(updated),createdAt:new Date().toISOString()};
      fs.writeFileSync(path.join(backup,'receipt.json'), JSON.stringify(receipt,null,2)+'\n', {flag:'wx',mode:0o600});
      if (sha(fs.readFileSync(path.join(backup,'before.jsx'))) !== sha(bytes)) fail('BACKUP_VERIFICATION_FAILED');
      replace(updated, sha(bytes), fileMode);
      output({...base,status:'SOURCE_UPDATED',afterSha256:sha(updated),backupFolder:path.basename(backup),applicationFilesChanged:1,
        packageChanges:0,buildRuns:0,deploymentRuns:0,releaseStatus:'AWAITING_CURRENT_PROJECT_BUILD_AND_DEPLOYMENT_VERIFICATION'});
    }
  }
} catch(e) {
  output({issue:'MMHB-NAMI-20260915',status:'STOP',reason:e.code || e.message,releaseStatus:'UNVERIFIED'});
  process.exitCode = 1;
} finally {
  if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
  if (lock !== undefined) { fs.closeSync(lock); fs.unlinkSync(lockPath); }
}
MMHB_SCRIPT
  )
fi
node --input-type=module <<'MMHB_VERIFY'
import fs from 'node:fs';
import crypto from 'node:crypto';
const file = 'mmhb-nami-repair.mjs';
const info = fs.lstatSync(file);
if (!info.isFile() || info.size > 65536) throw Error('STOP: unexpected repair file.');
const hash = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
if (hash !== '8e328937a86178d80e8f5032e7a2a9f1bee2287e911c15be97253817cde55239')
  throw Error('STOP: repair file differs; existing file preserved.');
MMHB_VERIFY
node ./mmhb-nami-repair.mjs --apply
node --input-type=module <<'MMHB_REPORT'
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
function git(args) {
  const r = spawnSync('git', args, {encoding:'utf8', timeout:5000,
    env:{...process.env, GIT_OPTIONAL_LOCKS:'0'}, maxBuffer:262144});
  return r.status === 0 ? r.stdout.trim() : null;
}
console.log(JSON.stringify({
  status: 'AWAITING_BUILD_AND_DEPLOYMENT',
  buildScript: pkg.scripts?.build ?? null,
  head: git(['rev-parse','HEAD']),
  branch: git(['branch','--show-current']),
  trackedChanges: git(['status','--porcelain','--untracked-files=no'])
}, null, 2));
MMHB_REPORT
MMHB_SETUP
