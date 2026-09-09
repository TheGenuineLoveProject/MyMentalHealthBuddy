import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
const EXPECTED_ROOT = '/home/runner/workspace';
const EXPECTED_HEAD = 'ba56d50f2f86bc9e47f829e9596f0d0b31699ab0';
const EXPECTED_NODE = 'v24.13.0';
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
// Git inspection uses a minimal environment. npm has its own isolated child contract.
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
    scope: 'CURRENT_R16D_OBSERVATIONS_ONLY_NOT_HISTORICAL_RUNS' };
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


const safePath = rel => typeof rel === 'string' && rel.length <= 1024 &&
  !path.isAbsolute(rel) && !/[\x00-\x1f\x7f\\]/.test(rel) && !privatePath(rel) &&
  !rel.split('/').some(x => !x || x === '.' || x === '..');
function directory(base) {
  const st = fs.lstatSync(base);
  gate(st.isDirectory() && !st.isSymbolicLink() && fs.realpathSync(base) === base, 'ARTIFACT_DIRECTORY_BOUNDARY');
}
function artifactIdentity(base, rel) {
  gate(safePath(rel), 'ARTIFACT_PATH_BOUNDARY', {file:label(rel)});
  directory(base);
  let full = base;
  for (const part of rel.split('/')) {
    full = path.join(full,part);
    const st = fs.lstatSync(full);
    gate(!st.isSymbolicLink(), 'ARTIFACT_SYMLINK', {file:label(rel)});
  }
  const before = fs.statSync(full);
  gate(before.isFile() && before.size <= 64*1024*1024, 'ARTIFACT_FILE_LIMIT', {file:label(rel)});
  const fd = fs.openSync(full,'r'), buffer = Buffer.alloc(1024*1024), digest = crypto.createHash('sha256');
  try {let n;while((n=fs.readSync(fd,buffer,0,buffer.length,null))>0)digest.update(buffer.subarray(0,n));}
  finally {fs.closeSync(fd);}
  const after = fs.statSync(full);
  gate(['dev','ino','size','mode','mtimeMs','ctimeMs'].every(k=>before[k]===after[k]), 'ARTIFACT_CHANGED_DURING_READ', {file:label(rel)});
  return {file:rel,sha256:digest.digest('hex'),bytes:before.size,mode:before.mode};
}
function artifactTree(base) {
  directory(base);const rows=[];let bytes=0;
  function walk(dir) {
    directory(dir);
    for(const name of fs.readdirSync(dir).sort()) {
      const full=path.join(dir,name),rel=path.relative(base,full);
      gate(safePath(rel),'ARTIFACT_PATH_BOUNDARY',{file:label(rel)});
      const st=fs.lstatSync(full);
      gate(!st.isSymbolicLink(),'ARTIFACT_SYMLINK',{file:label(rel)});
      if(st.isDirectory())walk(full);
      else {const row=artifactIdentity(base,rel);bytes+=row.bytes;rows.push(row);
        gate(rows.length<=5000&&bytes<=512*1024*1024,'ARTIFACT_TREE_LIMIT');}
    }
  }
  walk(base);return {rows,bytes};
}
const retainedFiles = new Map();
function retainedJSON(base,rel) {
  const id=artifactIdentity(base,rel);
  gate(id.bytes<=32*1024*1024,'REPORT_JSON_LIMIT');
  const raw=fs.readFileSync(path.join(base,rel));
  gate(hash(raw)===id.sha256,'REPORT_CHANGED_DURING_READ');
  retainedFiles.set(base+'\0'+rel,{base,rel,id});
  return JSON.parse(raw.toString('utf8'));
}
function checkedRows(rows) {
  gate(Array.isArray(rows)&&rows.length<=5000,'MANIFEST_ROWS_LIMIT');
  const names=new Set();
  for(const row of rows) {
    gate(row&&safePath(row.file)&&!names.has(row.file)&&/^[a-f0-9]{64}$/.test(row.sha256)
      &&Number.isSafeInteger(row.bytes)&&row.bytes>=0&&row.bytes<=64*1024*1024,'MANIFEST_ROW_INVALID');
    names.add(row.file);
  }
  return names;
}
function matchTree(actual,expected,code) {
  const names=checkedRows(expected),map=new Map(actual.rows.map(row=>[row.file,row]));
  gate(map.size===names.size&&actual.rows.length===expected.length,code,{reason:'FILE_SET'});
  for(const row of expected) {
    const item=map.get(row.file);
    gate(item&&item.sha256===row.sha256&&item.bytes===row.bytes
      &&(row.mode===undefined||item.mode===row.mode),code,{file:label(row.file)});
  }
}
function sameTree(a,b,code){gate(JSON.stringify(a)===JSON.stringify(b),code);}

const ASSET_PINS = {
  "ai/business/prompts/b01_offer_design.md": "ec5d4e3eb2a13bda0bc593ec7eeb0872c35cfef9f24ed514b7ba632b43de8043",
  "ai/business/prompts/b02_funnel_map.md": "f9499b81f35d0a53c3442296f84fd6a70be7ca288a5a905a05f6340da05af1bf",
  "ai/business/prompts/b03_content_factory.md": "d27b0be5cbf7509c13cb299e24d8cdc395bb2ead7bb4d4297baf3865152e8252",
  "ai/business/prompts/b04_email_sequences.md": "4723859fce5ae1d02fac1b27daa4b6fe47b57a8c3b1498e952419e43ab455907",
  "ai/business/prompts/b05_seo_briefs.md": "38cf749f52577272b841e0e4eb86bf53e9d8d27a71b4c4100dfc1db65746419f",
  "ai/business/prompts/b06_competitive_scan.md": "d79db57c633b5e11141b1e5d13af0e13d478d4dab3307e82fdb5be7adc2ea709",
  "ai/business/prompts/b07_pricing_packaging.md": "f9e1be975bcbb611cb03d133650619d9356e9515452ee79ea04b0d0c49f51e57",
  "ai/business/prompts/b08_retention_loyalty.md": "ebafa326a0a5d552f9fc7316321b93119bc88df7e15b5aa87edff1f6a7feff7b",
  "ai/business/prompts/b09_partnerships.md": "7b409622fdf473b8e2e01f5145503fe35578ba7ba0e7d1e05ca94d256a22433d",
  "ai/business/prompts/b10_ops_sops.md": "d03b38de531eb442d925c71a1f33b1ab82667887a4b9ab4d722ff4b6c2ffab8e",
  "ai/business/registry.json": "d90a0981f3b9dab33c80da4923aa6abe4e6503762740193a78a8134081c5663b",
  "ai/business/system.md": "3c98b23bfb28ae5d1aa41b6693aea2e3d2db184c51d4b428badac5d415c04baf",
  "ai/healing/prompts/h01_intake.md": "897ee547b4cb3e416dfa342fd4e0b0873f484b490f044f3e6b0c5953451dadec",
  "ai/healing/prompts/h02_journal_reflect.md": "f5f4872d9447030b1b26d054894b3650e9bdb2c6c30ff83e0e41fa37a1778902",
  "ai/healing/prompts/h03_cbt_reframe.md": "44062bd3e621d7abf7d32b77c01d2f70287a699bb1a913686b5d4c35e01b338d",
  "ai/healing/prompts/h04_act_values.md": "b5ad3efc7403874112502dde7f01b5eb8e9aaf21de93e499036ceafb77ba7f5b",
  "ai/healing/prompts/h05_breathing_grounding.md": "0488004edba218e43fa5ecf6aea53df3d98a08838633bf579033f01b36ea4e56",
  "ai/healing/prompts/h06_sleep_reset.md": "578769ff00486a72436d68789c403a8f2e31405bb9cc8242249992981104edd2",
  "ai/healing/prompts/h07_conflict_script.md": "2aaaa5d222baeb746d452514af1ca17e0417fd013cb45dd1d90891e9f73e63f4",
  "ai/healing/prompts/h08_safety_check.md": "bbafc7827f4ebad1fe975c5c36039a2e1d3a3289fb3a4ead18bd05fa9e57603d",
  "ai/healing/registry.json": "be846525e46ce27d2f79f7f3baaeca990f8de91433cff89368da71bcc07178ce",
  "ai/healing/system.md": "185686a9a02290ada767a6ca970e336b74479ab109374faf6f852ee6b29f209f"
};
