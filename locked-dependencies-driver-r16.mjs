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
    scope: 'CURRENT_R16_OBSERVATIONS_ONLY_NOT_HISTORICAL_RUNS' };
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
const POLICY_B64 = 'aW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnOwppbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnOwppbXBvcnQgY3J5cHRvIGZyb20gJ25vZGU6Y3J5cHRvJzsKCmNvbnN0IE1BUFMgPSBbJ2RlcGVuZGVuY2llcycsICdkZXZEZXBlbmRlbmNpZXMnLCAnb3B0aW9uYWxEZXBlbmRlbmNpZXMnLCAncGVlckRlcGVuZGVuY2llcyddOwpjb25zdCBTRUxFQ1RFRCA9IHsgJ0B2aXRlanMvcGx1Z2luLXJlYWN0JzogJzYuMS4wJywgcmVzZW5kOiAnNi4yMi4xJyB9Owpjb25zdCBNQVhfUEFDS0FHRVMgPSAyMDAwMDsKY29uc3QgTUFYX0ZJTEVTID0gMjAwMDAwOwpjb25zdCBNQVhfQllURVMgPSA0ICogMTAyNCAqIDEwMjQgKiAxMDI0Owpjb25zdCBNQVhfSlNPTiA9IDMyICogMTAyNCAqIDEwMjQ7CmNvbnN0IGV4YWN0VmVyc2lvbiA9IC9eKDB8WzEtOV1cZCopXC4oMHxbMS05XVxkKilcLigwfFsxLTldXGQqKSg/Oi1bMC05QS1aYS16XVswLTlBLVphLXouLV0qKT8oPzpcK1swLTlBLVphLXpdWzAtOUEtWmEtei4tXSopPyQvOwpjb25zdCBwYXJ0ID0gL14oPyFcLnsxLDJ9JClbYS16QS1aMC05X11bYS16QS1aMC05Ll8tXSokLzsKY29uc3QgcGFja2FnZU5hbWUgPSAvXig/OkBbYS16QS1aMC05X11bYS16QS1aMC05Ll8tXSpcLyk/W2EtekEtWjAtOV9dW2EtekEtWjAtOS5fLV0qJC87CmNvbnN0IGhhc2ggPSBkYXRhID0+IGNyeXB0by5jcmVhdGVIYXNoKCdzaGEyNTYnKS51cGRhdGUoZGF0YSkuZGlnZXN0KCdoZXgnKTsKY29uc3Qgb3duID0gKHZhbHVlLCBrZXkpID0+IE9iamVjdC5oYXNPd24odmFsdWUsIGtleSk7CmNvbnN0IG9iamVjdCA9IHZhbHVlID0+IHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpCiAgJiYgKE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWx1ZSkgPT09IE9iamVjdC5wcm90b3R5cGUgfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKHZhbHVlKSA9PT0gbnVsbCk7CmNvbnN0IGluc2lkZSA9IChyb290LCBmaWxlKSA9PiBmaWxlID09PSByb290IHx8IGZpbGUuc3RhcnRzV2l0aChyb290ICsgcGF0aC5zZXApOwpjb25zdCBzb3J0ZWQgPSB2YWx1ZXMgPT4gWy4uLnZhbHVlc10uc29ydCgpOwoKZnVuY3Rpb24gc3RvcChjb2RlLCBmaWxlKSB7CiAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoY29kZSk7CiAgZXJyb3IuY29kZSA9IGNvZGU7CiAgaWYgKHR5cGVvZiBmaWxlID09PSAnc3RyaW5nJyAmJiBmaWxlLmxlbmd0aCA8PSAyMDQ4ICYmICEvW1x4MDAtXHgxZlx4N2ZcXF0vLnRlc3QoZmlsZSkKICAgICYmICFwYXRoLmlzQWJzb2x1dGUoZmlsZSkgJiYgIWZpbGUuc3BsaXQoJy8nKS5zb21lKHYgPT4gdiA9PT0gJy4uJyB8fCB2ID09PSAnLicpKSBlcnJvci5maWxlID0gZmlsZTsKICB0aHJvdyBlcnJvcjsKfQoKZnVuY3Rpb24gbG9naWNhbFBhY2thZ2VQYXRoKGZpbGUpIHsKICBpZiAodHlwZW9mIGZpbGUgIT09ICdzdHJpbmcnIHx8IGZpbGUubGVuZ3RoID4gMjA0OCB8fCAvW1x4MDAtXHgyMFx4N2ZcXF0vLnRlc3QoZmlsZSkpIHJldHVybiBmYWxzZTsKICBjb25zdCBwYXJ0cyA9IGZpbGUuc3BsaXQoJy8nKTsKICBsZXQgY3Vyc29yID0gMDsKICB3aGlsZSAoY3Vyc29yIDwgcGFydHMubGVuZ3RoKSB7CiAgICBpZiAocGFydHNbY3Vyc29yKytdICE9PSAnbm9kZV9tb2R1bGVzJykgcmV0dXJuIGZhbHNlOwogICAgY29uc3QgbmFtZSA9IHBhcnRzW2N1cnNvcisrXTsKICAgIGlmIChuYW1lPy5zdGFydHNXaXRoKCdAJykpIHsKICAgICAgaWYgKCFwYXJ0LnRlc3QobmFtZS5zbGljZSgxKSkgfHwgIXBhcnQudGVzdChwYXJ0c1tjdXJzb3IrK10gfHwgJycpKSByZXR1cm4gZmFsc2U7CiAgICB9IGVsc2UgaWYgKCFwYXJ0LnRlc3QobmFtZSB8fCAnJykpIHJldHVybiBmYWxzZTsKICB9CiAgcmV0dXJuIGN1cnNvciA9PT0gcGFydHMubGVuZ3RoOwp9CgpmdW5jdGlvbiByZWdpc3RyeVNwZWNpZmllcih2YWx1ZSkgewogIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnIHx8IHZhbHVlLmxlbmd0aCA8IDEgfHwgdmFsdWUubGVuZ3RoID4gNTEyIHx8IHZhbHVlICE9PSB2YWx1ZS50cmltKCkpIHJldHVybiBmYWxzZTsKICBpZiAodmFsdWUuc3RhcnRzV2l0aCgnbnBtOicpKSB7CiAgICBjb25zdCBhbGlhcyA9IHZhbHVlLnNsaWNlKDQpOwogICAgY29uc3QgYXQgPSBhbGlhcy5sYXN0SW5kZXhPZignQCcpOwogICAgaWYgKGF0IDw9IDAgfHwgIXBhY2thZ2VOYW1lLnRlc3QoYWxpYXMuc2xpY2UoMCwgYXQpKSkgcmV0dXJuIGZhbHNlOwogICAgcmV0dXJuIHJlZ2lzdHJ5U3BlY2lmaWVyKGFsaWFzLnNsaWNlKGF0ICsgMSkpICYmICFhbGlhcy5zbGljZShhdCArIDEpLnN0YXJ0c1dpdGgoJ25wbTonKTsKICB9CiAgaWYgKC9bXHgwMC1ceDFmXHg3ZjpAL1xcJF0vLnRlc3QodmFsdWUpKSByZXR1cm4gZmFsc2U7CiAgLy8gbnBtIHRhZ3MgYW5kIG9yZGluYXJ5IHNlbXZlciByYW5nZXMgc3RheSB3aXRoaW4gdGhlIGZpeGVkIHB1YmxpYyByZWdpc3RyeS4KICBpZiAoL15bQS1aYS16XVtBLVphLXowLTkuXy1dKiQvLnRlc3QodmFsdWUpKSByZXR1cm4gdHJ1ZTsKICBpZiAoIS9eWzAtOXZWeFgqPD49fl58IC4rQS1aYS16LV0rJC8udGVzdCh2YWx1ZSkpIHJldHVybiBmYWxzZTsKICBjb25zdCBub3JtYWxpemVkID0gdmFsdWUucmVwbGFjZSgvKFt+Xjw+PV0rKVxzKyg/PVt2VlxkKnhYXSkvZywgJyQxJyk7CiAgcmV0dXJuIG5vcm1hbGl6ZWQuc3BsaXQoL1xzKlx8XHxccyovKS5ldmVyeShhbHQgPT4gL15bQS1aYS16XVtBLVphLXowLTkuXy1dKiQvLnRlc3QoYWx0KQogICAgfHwgKGFsdC5sZW5ndGggPiAwICYmIGFsdC5zcGxpdCgvXHMrLykuZXZlcnkodG9rZW4gPT4gdG9rZW4gPT09ICctJwogICAgICB8fCAvXig/Olt+Xl18Wzw+XT0/fD0pP3Y/KD86XGQrfFt4WCpdKSg/OlwuKD86XGQrfFt4WCpdKSl7MCwyfSg/Oi1bMC05QS1aYS16XVswLTlBLVphLXouLV0qKT8oPzpcK1swLTlBLVphLXpdWzAtOUEtWmEtei4tXSopPyQvLnRlc3QodG9rZW4pKSkpOwp9CgpmdW5jdGlvbiBkZXBlbmRlbmN5TWFwKHZhbHVlLCBmaWxlKSB7CiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiB7fTsKICBpZiAoIW9iamVjdCh2YWx1ZSkgfHwgT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCA+IE1BWF9QQUNLQUdFUykgc3RvcCgnREVQRU5ERU5DWV9NQVBfSU5WQUxJRCcsIGZpbGUpOwogIGZvciAoY29uc3QgW25hbWUsIHNwZWNdIG9mIE9iamVjdC5lbnRyaWVzKHZhbHVlKSkgewogICAgaWYgKCFwYWNrYWdlTmFtZS50ZXN0KG5hbWUpIHx8ICFyZWdpc3RyeVNwZWNpZmllcihzcGVjKSkgc3RvcCgnREVQRU5ERU5DWV9TT1VSQ0VfVU5TVVBQT1JURUQnLCBmaWxlKTsKICB9CiAgcmV0dXJuIHZhbHVlOwp9CgpmdW5jdGlvbiBjYW5vbmljYWxNYXAodmFsdWUpIHsKICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5lbnRyaWVzKHZhbHVlKS5zb3J0KChbYV0sIFtiXSkgPT4gYSA8IGIgPyAtMSA6IGEgPiBiID8gMSA6IDApKSk7Cn0KCmZ1bmN0aW9uIGZvcmJpZGRlbkZlYXR1cmVzKHJlY29yZCwgZmlsZSwgcGxhdGZvcm1FeGNsdWRlZEJ1bmRsZSA9IGZhbHNlKSB7CiAgaWYgKG93bihyZWNvcmQsICd3b3Jrc3BhY2VzJykpIHN0b3AoJ1dPUktTUEFDRVNfVU5TVVBQT1JURUQnLCBmaWxlKTsKICBmb3IgKGNvbnN0IG5hbWUgb2YgWydsaW5rJywgJ2luQnVuZGxlJywgJ2hhc1Nocmlua3dyYXAnXSkgewogICAgaWYgKHJlY29yZFtuYW1lXSAhPT0gdW5kZWZpbmVkICYmIHJlY29yZFtuYW1lXSAhPT0gZmFsc2UpIHN0b3AoJ0xPQ0tfU09VUkNFX0ZFQVRVUkVfVU5TVVBQT1JURUQnLCBmaWxlKTsKICB9CiAgZm9yIChjb25zdCBuYW1lIG9mIFsnYnVuZGxlRGVwZW5kZW5jaWVzJywgJ2J1bmRsZWREZXBlbmRlbmNpZXMnXSkgewogICAgaWYgKCFwbGF0Zm9ybUV4Y2x1ZGVkQnVuZGxlICYmIHJlY29yZFtuYW1lXSAhPT0gdW5kZWZpbmVkICYmIHJlY29yZFtuYW1lXSAhPT0gZmFsc2UKICAgICAgJiYgIShBcnJheS5pc0FycmF5KHJlY29yZFtuYW1lXSkgJiYgcmVjb3JkW25hbWVdLmxlbmd0aCA9PT0gMCkpIHN0b3AoJ0JVTkRMRURfREVQRU5ERU5DSUVTX1VOU1VQUE9SVEVEJywgZmlsZSk7CiAgfQp9CgpmdW5jdGlvbiBleGNsdWRlZEJ1bmRsZURlY2xhcmF0aW9uKGVudHJ5LCBmaWxlKSB7CiAgY29uc3QgZGVjbGFyZWQgPSBbJ2J1bmRsZURlcGVuZGVuY2llcycsICdidW5kbGVkRGVwZW5kZW5jaWVzJ10uZmlsdGVyKGtleSA9PiBlbnRyeVtrZXldICE9PSB1bmRlZmluZWQgJiYgZW50cnlba2V5XSAhPT0gZmFsc2UKICAgICYmICEoQXJyYXkuaXNBcnJheShlbnRyeVtrZXldKSAmJiBlbnRyeVtrZXldLmxlbmd0aCA9PT0gMCkpOwogIGlmICghZGVjbGFyZWQubGVuZ3RoKSByZXR1cm4gbnVsbDsKICBpZiAoZmlsZSAhPT0gJ25vZGVfbW9kdWxlcy9AdGFpbHdpbmRjc3Mvb3hpZGUtd2FzbTMyLXdhc2knIHx8IGVudHJ5Lm9wdGlvbmFsICE9PSB0cnVlCiAgICB8fCBKU09OLnN0cmluZ2lmeShlbnRyeS5jcHUpICE9PSAnWyJ3YXNtMzIiXScgfHwgcHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ2xpbnV4JyB8fCBwcm9jZXNzLmFyY2ggIT09ICd4NjQnKSByZXR1cm4gbnVsbDsKICBjb25zdCBuYW1lcyA9IG5ldyBTZXQoKTsKICBmb3IgKGNvbnN0IGtleSBvZiBkZWNsYXJlZCkgewogICAgaWYgKCFBcnJheS5pc0FycmF5KGVudHJ5W2tleV0pIHx8IGVudHJ5W2tleV0ubGVuZ3RoID4gMTAwIHx8ICFlbnRyeVtrZXldLmV2ZXJ5KG5hbWUgPT4gdHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnICYmIHBhY2thZ2VOYW1lLnRlc3QobmFtZSkpKSByZXR1cm4gbnVsbDsKICAgIGZvciAoY29uc3QgbmFtZSBvZiBlbnRyeVtrZXldKSBuYW1lcy5hZGQobmFtZSk7CiAgfQogIHJldHVybiB7IGZpbGUsIHZlcnNpb246IGVudHJ5LnZlcnNpb24sIHJlYXNvbjogJ0VYQUNUX09QVElPTkFMX1dBU00zMl9QQUNLQUdFX0VYQ0xVREVEX09OX0xJTlVYX1g2NCcsCiAgICBidW5kbGVkRGVwZW5kZW5jeUNvdW50OiBuYW1lcy5zaXplLCByZXF1aXJlZFN0YXRlOiAnRElSRUNUT1JZX0FCU0VOVCcgfTsKfQoKZnVuY3Rpb24gb3ZlcnJpZGVzUG9saWN5KG92ZXJyaWRlcywgcm9vdERlcHMsIGRlcHRoID0gMCkgewogIGlmIChvdmVycmlkZXMgPT09IHVuZGVmaW5lZCkgcmV0dXJuOwogIGlmICghb2JqZWN0KG92ZXJyaWRlcykgfHwgZGVwdGggPiAxMiB8fCBPYmplY3Qua2V5cyhvdmVycmlkZXMpLmxlbmd0aCA+IE1BWF9QQUNLQUdFUykgc3RvcCgnT1ZFUlJJREVTX0lOVkFMSUQnKTsKICBmb3IgKGNvbnN0IFtuYW1lLCB2YWx1ZV0gb2YgT2JqZWN0LmVudHJpZXMob3ZlcnJpZGVzKSkgewogICAgbGV0IHZhbGlkS2V5ID0gbmFtZSA9PT0gJy4nOwogICAgaWYgKCF2YWxpZEtleSkgewogICAgICBjb25zdCBhdCA9IG5hbWUubGFzdEluZGV4T2YoJ0AnKTsKICAgICAgdmFsaWRLZXkgPSBwYWNrYWdlTmFtZS50ZXN0KG5hbWUpCiAgICAgICAgfHwgKGF0ID4gMCAmJiBwYWNrYWdlTmFtZS50ZXN0KG5hbWUuc2xpY2UoMCwgYXQpKSAmJiByZWdpc3RyeVNwZWNpZmllcihuYW1lLnNsaWNlKGF0ICsgMSkpKTsKICAgIH0KICAgIGlmICghdmFsaWRLZXkpIHN0b3AoJ09WRVJSSURFX1NFTEVDVE9SX1VOU1VQUE9SVEVEJyk7CiAgICBpZiAob2JqZWN0KHZhbHVlKSkgb3ZlcnJpZGVzUG9saWN5KHZhbHVlLCByb290RGVwcywgZGVwdGggKyAxKTsKICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdmFsdWUuc3RhcnRzV2l0aCgnJCcpKSB7CiAgICAgIGlmICghcGFja2FnZU5hbWUudGVzdCh2YWx1ZS5zbGljZSgxKSkgfHwgIW93bihyb290RGVwcywgdmFsdWUuc2xpY2UoMSkpKSBzdG9wKCdPVkVSUklERV9SRUZFUkVOQ0VfVU5TVVBQT1JURUQnKTsKICAgIH0gZWxzZSBpZiAoIXJlZ2lzdHJ5U3BlY2lmaWVyKHZhbHVlKSkgc3RvcCgnT1ZFUlJJREVfU09VUkNFX1VOU1VQUE9SVEVEJyk7CiAgfQp9CgpmdW5jdGlvbiBhcmNoaXZlUG9saWN5KGVudHJ5LCBmaWxlKSB7CiAgaWYgKHR5cGVvZiBlbnRyeS5yZXNvbHZlZCAhPT0gJ3N0cmluZycgfHwgZW50cnkucmVzb2x2ZWQubGVuZ3RoID4gMjA0OCkgc3RvcCgnQVJDSElWRV9VUkxfSU5WQUxJRCcsIGZpbGUpOwogIGxldCB1cmw7CiAgdHJ5IHsgdXJsID0gbmV3IFVSTChlbnRyeS5yZXNvbHZlZCk7IH0gY2F0Y2ggeyBzdG9wKCdBUkNISVZFX1VSTF9JTlZBTElEJywgZmlsZSk7IH0KICBpZiAodXJsLmhyZWYgIT09IGVudHJ5LnJlc29sdmVkIHx8IHVybC5wcm90b2NvbCAhPT0gJ2h0dHBzOicgfHwgdXJsLmhvc3RuYW1lICE9PSAncmVnaXN0cnkubnBtanMub3JnJwogICAgfHwgdXJsLnVzZXJuYW1lIHx8IHVybC5wYXNzd29yZCB8fCB1cmwucG9ydCB8fCB1cmwuc2VhcmNoIHx8IHVybC5oYXNoCiAgICB8fCAhL15cLyg/OkBbQS1aYS16MC05Xy4tXStcLyk/W0EtWmEtejAtOV8uLV0rXC8tXC9bQS1aYS16MC05Xy4rLV0rXC50Z3okLy50ZXN0KHVybC5wYXRobmFtZSkpIHsKICAgIHN0b3AoJ0FSQ0hJVkVfVVJMX05PVF9BTExPV0VEJywgZmlsZSk7CiAgfQogIGlmICh0eXBlb2YgZW50cnkuaW50ZWdyaXR5ICE9PSAnc3RyaW5nJyB8fCAhL15zaGE1MTItW0EtWmEtejAtOSsvXXs4Nn09PSQvLnRlc3QoZW50cnkuaW50ZWdyaXR5KSkgc3RvcCgnQVJDSElWRV9JTlRFR1JJVFlfSU5WQUxJRCcsIGZpbGUpOwogIGNvbnN0IGRlY29kZWQgPSBCdWZmZXIuZnJvbShlbnRyeS5pbnRlZ3JpdHkuc2xpY2UoNyksICdiYXNlNjQnKTsKICBpZiAoZGVjb2RlZC5sZW5ndGggIT09IDY0IHx8IGRlY29kZWQudG9TdHJpbmcoJ2Jhc2U2NCcpICE9PSBlbnRyeS5pbnRlZ3JpdHkuc2xpY2UoNykpIHN0b3AoJ0FSQ0hJVkVfSU5URUdSSVRZX0lOVkFMSUQnLCBmaWxlKTsKfQoKZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlTG9jayhtYW5pZmVzdCwgbG9jaykgewogIGlmICghb2JqZWN0KG1hbmlmZXN0KSB8fCBtYW5pZmVzdC5uYW1lICE9PSAnbXltZW50YWxoZWFsdGhidWRkeScgfHwgIWV4YWN0VmVyc2lvbi50ZXN0KG1hbmlmZXN0LnZlcnNpb24gfHwgJycpKSBzdG9wKCdNQU5JRkVTVF9JREVOVElUWV9JTlZBTElEJyk7CiAgaWYgKCFvYmplY3QobG9jaykgfHwgbG9jay5sb2NrZmlsZVZlcnNpb24gIT09IDMgfHwgbG9jay5uYW1lICE9PSBtYW5pZmVzdC5uYW1lIHx8IGxvY2sudmVyc2lvbiAhPT0gbWFuaWZlc3QudmVyc2lvbgogICAgfHwgIW9iamVjdChsb2NrLnBhY2thZ2VzKSB8fCAhb2JqZWN0KGxvY2sucGFja2FnZXNbJyddKSkgc3RvcCgnTE9DS19JREVOVElUWV9JTlZBTElEJyk7CiAgY29uc3Qgcm9vdCA9IGxvY2sucGFja2FnZXNbJyddOwogIGlmIChyb290Lm5hbWUgIT09IG1hbmlmZXN0Lm5hbWUgfHwgcm9vdC52ZXJzaW9uICE9PSBtYW5pZmVzdC52ZXJzaW9uKSBzdG9wKCdMT0NLX1JPT1RfSURFTlRJVFlfTUlTTUFUQ0gnKTsKICBmb3JiaWRkZW5GZWF0dXJlcyhtYW5pZmVzdCwgJ3BhY2thZ2UuanNvbicpOwogIGZvcmJpZGRlbkZlYXR1cmVzKHJvb3QsICdwYWNrYWdlLWxvY2suanNvbicpOwogIGlmIChtYW5pZmVzdC5wYWNrYWdlTWFuYWdlciAhPT0gdW5kZWZpbmVkICYmICEvXm5wbUBcZCtcLlxkK1wuXGQrKD86Wy0rXVswLTlBLVphLXouLV0rKT8kLy50ZXN0KG1hbmlmZXN0LnBhY2thZ2VNYW5hZ2VyKSkgc3RvcCgnUEFDS0FHRV9NQU5BR0VSX1VOU1VQUE9SVEVEJyk7CiAgaWYgKG9iamVjdChtYW5pZmVzdC5kZXZFbmdpbmVzKSAmJiBtYW5pZmVzdC5kZXZFbmdpbmVzLnBhY2thZ2VNYW5hZ2VyICE9PSB1bmRlZmluZWQpIHsKICAgIGNvbnN0IG1hbmFnZXJzID0gQXJyYXkuaXNBcnJheShtYW5pZmVzdC5kZXZFbmdpbmVzLnBhY2thZ2VNYW5hZ2VyKSA/IG1hbmlmZXN0LmRldkVuZ2luZXMucGFja2FnZU1hbmFnZXIgOiBbbWFuaWZlc3QuZGV2RW5naW5lcy5wYWNrYWdlTWFuYWdlcl07CiAgICBpZiAoIW1hbmFnZXJzLmV2ZXJ5KHYgPT4gb2JqZWN0KHYpICYmIHYubmFtZSA9PT0gJ25wbScpKSBzdG9wKCdQQUNLQUdFX01BTkFHRVJfVU5TVVBQT1JURUQnKTsKICB9CiAgY29uc3Qgcm9vdERlcHMgPSB7fTsKICBmb3IgKGNvbnN0IGZpZWxkIG9mIE1BUFMpIHsKICAgIGNvbnN0IGEgPSBkZXBlbmRlbmN5TWFwKG1hbmlmZXN0W2ZpZWxkXSwgJ3BhY2thZ2UuanNvbicpOwogICAgY29uc3QgYiA9IGRlcGVuZGVuY3lNYXAocm9vdFtmaWVsZF0sICdwYWNrYWdlLWxvY2suanNvbicpOwogICAgaWYgKGNhbm9uaWNhbE1hcChhKSAhPT0gY2Fub25pY2FsTWFwKGIpKSBzdG9wKCdST09UX0RFUEVOREVOQ1lfTUFQX01JU01BVENIJyk7CiAgICBPYmplY3QuYXNzaWduKHJvb3REZXBzLCBhKTsKICB9CiAgb3ZlcnJpZGVzUG9saWN5KG1hbmlmZXN0Lm92ZXJyaWRlcywgcm9vdERlcHMpOwogIGNvbnN0IHBhdGhzID0gc29ydGVkKE9iamVjdC5rZXlzKGxvY2sucGFja2FnZXMpLmZpbHRlcihCb29sZWFuKSk7CiAgaWYgKHBhdGhzLmxlbmd0aCA9PT0gMCB8fCBwYXRocy5sZW5ndGggPiBNQVhfUEFDS0FHRVMpIHN0b3AoJ0xPQ0tfUEFDS0FHRV9DT1VOVF9MSU1JVCcpOwogIGxldCBvcHRpb25hbENvdW50ID0gMDsKICBjb25zdCBwbGF0Zm9ybUV4Y2x1ZGVkQnVuZGxlRGVjbGFyYXRpb25zID0gW107CiAgZm9yIChjb25zdCBmaWxlIG9mIHBhdGhzKSB7CiAgICBjb25zdCBlbnRyeSA9IGxvY2sucGFja2FnZXNbZmlsZV07CiAgICBpZiAoIWxvZ2ljYWxQYWNrYWdlUGF0aChmaWxlKSkgc3RvcCgnTE9DS19QQUNLQUdFX1BBVEhfSU5WQUxJRCcpOwogICAgaWYgKCFvYmplY3QoZW50cnkpIHx8ICFleGFjdFZlcnNpb24udGVzdChlbnRyeS52ZXJzaW9uIHx8ICcnKSkgc3RvcCgnTE9DS19QQUNLQUdFX1ZFUlNJT05fSU5WQUxJRCcsIGZpbGUpOwogICAgaWYgKGVudHJ5Lm5hbWUgIT09IHVuZGVmaW5lZCAmJiAhcGFja2FnZU5hbWUudGVzdChlbnRyeS5uYW1lKSkgc3RvcCgnTE9DS19QQUNLQUdFX05BTUVfSU5WQUxJRCcsIGZpbGUpOwogICAgY29uc3QgZXhjbHVkZWQgPSBleGNsdWRlZEJ1bmRsZURlY2xhcmF0aW9uKGVudHJ5LCBmaWxlKTsKICAgIGZvcmJpZGRlbkZlYXR1cmVzKGVudHJ5LCBmaWxlLCAhIWV4Y2x1ZGVkKTsKICAgIGlmIChleGNsdWRlZCkgcGxhdGZvcm1FeGNsdWRlZEJ1bmRsZURlY2xhcmF0aW9ucy5wdXNoKGV4Y2x1ZGVkKTsKICAgIGZvciAoY29uc3QgZmllbGQgb2YgTUFQUykgZGVwZW5kZW5jeU1hcChlbnRyeVtmaWVsZF0sIGZpbGUpOwogICAgZm9yIChjb25zdCBmaWVsZCBvZiBbJ29wdGlvbmFsJywgJ2Rldk9wdGlvbmFsJywgJ2RldicsICdwZWVyJ10pIHsKICAgICAgaWYgKGVudHJ5W2ZpZWxkXSAhPT0gdW5kZWZpbmVkICYmIHR5cGVvZiBlbnRyeVtmaWVsZF0gIT09ICdib29sZWFuJykgc3RvcCgnTE9DS19QQUNLQUdFX0ZMQUdfSU5WQUxJRCcsIGZpbGUpOwogICAgfQogICAgYXJjaGl2ZVBvbGljeShlbnRyeSwgZmlsZSk7CiAgICBpZiAoZW50cnkub3B0aW9uYWwgPT09IHRydWUpIG9wdGlvbmFsQ291bnQrKzsKICB9CiAgY29uc3Qgc2VsZWN0ZWRMb2NrZWQgPSBPYmplY3QuZW50cmllcyhTRUxFQ1RFRCkubWFwKChbbmFtZSwgdmVyc2lvbl0pID0+IHsKICAgIGNvbnN0IGZpbGUgPSBgbm9kZV9tb2R1bGVzLyR7bmFtZX1gOwogICAgaWYgKGxvY2sucGFja2FnZXNbZmlsZV0/LnZlcnNpb24gIT09IHZlcnNpb24pIHN0b3AoJ1NFTEVDVEVEX0xPQ0tfVkVSU0lPTl9NSVNNQVRDSCcsIGZpbGUpOwogICAgcmV0dXJuIHsgbmFtZSwgdmVyc2lvbiwgZmlsZSB9OwogIH0pOwogIHJldHVybiB7IHN0YXR1czogJ0xPQ0tfUE9MSUNZX1BBU1MnLCBwYWNrYWdlQ291bnQ6IHBhdGhzLmxlbmd0aCwgb3B0aW9uYWxDb3VudCwgc2VsZWN0ZWRMb2NrZWQsIGxvY2tQYXRoczogcGF0aHMsCiAgICBwbGF0Zm9ybUV4Y2x1ZGVkQnVuZGxlRGVjbGFyYXRpb25zIH07Cn0KCmZ1bmN0aW9uIHN0YXRNYXliZShmaWxlKSB7CiAgdHJ5IHsgcmV0dXJuIGZzLmxzdGF0U3luYyhmaWxlKTsgfSBjYXRjaCAoZXJyb3IpIHsgaWYgKGVycm9yLmNvZGUgPT09ICdFTk9FTlQnKSByZXR1cm4gbnVsbDsgdGhyb3cgZXJyb3I7IH0KfQoKZnVuY3Rpb24gZmlsZVJlY29yZChhYnNvbHV0ZSwgcmVsYXRpdmUsIGpzb24gPSBmYWxzZSkgewogIGNvbnN0IGJlZm9yZSA9IGZzLmxzdGF0U3luYyhhYnNvbHV0ZSk7CiAgaWYgKCFiZWZvcmUuaXNGaWxlKCkgfHwgYmVmb3JlLmlzU3ltYm9saWNMaW5rKCkpIHN0b3AoJ0lOU1RBTExFRF9GSUxFX05PVF9SRUdVTEFSJywgcmVsYXRpdmUpOwogIGlmIChiZWZvcmUuc2l6ZSA+IE1BWF9CWVRFUyB8fCAoanNvbiAmJiBiZWZvcmUuc2l6ZSA+IE1BWF9KU09OKSkgc3RvcCgnSU5TVEFMTEVEX0ZJTEVfU0laRV9MSU1JVCcsIHJlbGF0aXZlKTsKICBsZXQgZmQ7CiAgdHJ5IHsKICAgIGZkID0gZnMub3BlblN5bmMoYWJzb2x1dGUsIGZzLmNvbnN0YW50cy5PX1JET05MWSB8IGZzLmNvbnN0YW50cy5PX05PRk9MTE9XKTsKICAgIGNvbnN0IG9wZW5lZCA9IGZzLmZzdGF0U3luYyhmZCk7CiAgICBpZiAoIW9wZW5lZC5pc0ZpbGUoKSB8fCBvcGVuZWQuZGV2ICE9PSBiZWZvcmUuZGV2IHx8IG9wZW5lZC5pbm8gIT09IGJlZm9yZS5pbm8pIHN0b3AoJ0lOU1RBTExFRF9GSUxFX0NIQU5HRUQnLCByZWxhdGl2ZSk7CiAgICBjb25zdCBkaWdlc3QgPSBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMjU2Jyk7CiAgICBjb25zdCBjaHVuayA9IEJ1ZmZlci5hbGxvY1Vuc2FmZSgxMDI0ICogMTAyNCk7CiAgICBjb25zdCBidWZmZXJzID0gW107CiAgICBsZXQgYnl0ZXMgPSAwOwogICAgd2hpbGUgKHRydWUpIHsKICAgICAgY29uc3QgcmVhZCA9IGZzLnJlYWRTeW5jKGZkLCBjaHVuaywgMCwgY2h1bmsubGVuZ3RoLCBudWxsKTsKICAgICAgaWYgKCFyZWFkKSBicmVhazsKICAgICAgYnl0ZXMgKz0gcmVhZDsKICAgICAgaWYgKGJ5dGVzID4gTUFYX0JZVEVTIHx8IChqc29uICYmIGJ5dGVzID4gTUFYX0pTT04pKSBzdG9wKCdJTlNUQUxMRURfRklMRV9TSVpFX0xJTUlUJywgcmVsYXRpdmUpOwogICAgICBkaWdlc3QudXBkYXRlKGNodW5rLnN1YmFycmF5KDAsIHJlYWQpKTsKICAgICAgaWYgKGpzb24pIGJ1ZmZlcnMucHVzaChCdWZmZXIuZnJvbShjaHVuay5zdWJhcnJheSgwLCByZWFkKSkpOwogICAgfQogICAgY29uc3QgYWZ0ZXIgPSBmcy5mc3RhdFN5bmMoZmQpOwogICAgY29uc3QgcGF0aEFmdGVyID0gZnMubHN0YXRTeW5jKGFic29sdXRlKTsKICAgIGlmIChhZnRlci5kZXYgIT09IGJlZm9yZS5kZXYgfHwgYWZ0ZXIuaW5vICE9PSBiZWZvcmUuaW5vIHx8IGFmdGVyLnNpemUgIT09IGJ5dGVzIHx8IGJlZm9yZS5zaXplICE9PSBieXRlcwogICAgICB8fCBhZnRlci5tdGltZU1zICE9PSBiZWZvcmUubXRpbWVNcyB8fCBhZnRlci5jdGltZU1zICE9PSBiZWZvcmUuY3RpbWVNcyB8fCBhZnRlci5tb2RlICE9PSBiZWZvcmUubW9kZQogICAgICB8fCBwYXRoQWZ0ZXIuZGV2ICE9PSBiZWZvcmUuZGV2IHx8IHBhdGhBZnRlci5pbm8gIT09IGJlZm9yZS5pbm8gfHwgIXBhdGhBZnRlci5pc0ZpbGUoKSB8fCBwYXRoQWZ0ZXIuaXNTeW1ib2xpY0xpbmsoKSkgc3RvcCgnSU5TVEFMTEVEX0ZJTEVfQ0hBTkdFRCcsIHJlbGF0aXZlKTsKICAgIGNvbnN0IHJlY29yZCA9IHsgZmlsZTogcmVsYXRpdmUsIHR5cGU6ICdmaWxlJywgc2hhMjU2OiBkaWdlc3QuZGlnZXN0KCdoZXgnKSwgYnl0ZXMsIG1vZGU6IGFmdGVyLm1vZGUgfTsKICAgIHJldHVybiBqc29uID8geyByZWNvcmQsIHRleHQ6IEJ1ZmZlci5jb25jYXQoYnVmZmVycykudG9TdHJpbmcoJ3V0ZjgnKSB9IDogcmVjb3JkOwogIH0gZmluYWxseSB7IGlmIChmZCAhPT0gdW5kZWZpbmVkKSBmcy5jbG9zZVN5bmMoZmQpOyB9Cn0KCmZ1bmN0aW9uIHJlYWRKU09OKGFic29sdXRlLCByZWxhdGl2ZSkgewogIGNvbnN0IHJlc3VsdCA9IGZpbGVSZWNvcmQoYWJzb2x1dGUsIHJlbGF0aXZlLCB0cnVlKTsKICB0cnkgeyByZXN1bHQudmFsdWUgPSBKU09OLnBhcnNlKHJlc3VsdC50ZXh0KTsgfSBjYXRjaCB7IHN0b3AoJ0lOU1RBTExFRF9KU09OX0lOVkFMSUQnLCByZWxhdGl2ZSk7IH0KICBpZiAoIW9iamVjdChyZXN1bHQudmFsdWUpKSBzdG9wKCdJTlNUQUxMRURfSlNPTl9JTlZBTElEJywgcmVsYXRpdmUpOwogIGRlbGV0ZSByZXN1bHQudGV4dDsKICByZXR1cm4gcmVzdWx0Owp9CgpmdW5jdGlvbiBhc3NlcnROb0xpbmtBbmNlc3RvcnMocm9vdCwgdGFyZ2V0LCByZWxhdGl2ZSkgewogIGlmICghaW5zaWRlKHJvb3QsIHRhcmdldCkpIHN0b3AoJ0lOU1RBTExFRF9QQVRIX0VTQ0FQRVNfU1RBR0UnLCByZWxhdGl2ZSk7CiAgY29uc3QgcGFydHMgPSBwYXRoLnJlbGF0aXZlKHJvb3QsIHRhcmdldCkuc3BsaXQocGF0aC5zZXApLmZpbHRlcihCb29sZWFuKTsKICBsZXQgY3Vyc29yID0gcm9vdDsKICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgcGFydHMubGVuZ3RoOyBpbmRleCsrKSB7CiAgICBjdXJzb3IgPSBwYXRoLmpvaW4oY3Vyc29yLCBwYXJ0c1tpbmRleF0pOwogICAgY29uc3Qgc3RhdCA9IHN0YXRNYXliZShjdXJzb3IpOwogICAgaWYgKCFzdGF0KSByZXR1cm4gZmFsc2U7CiAgICBpZiAoc3RhdC5pc1N5bWJvbGljTGluaygpKSBzdG9wKCdJTlNUQUxMRURfUEFUSF9TWU1MSU5LJywgcmVsYXRpdmUpOwogICAgaWYgKGluZGV4IDwgcGFydHMubGVuZ3RoIC0gMSAmJiAhc3RhdC5pc0RpcmVjdG9yeSgpKSBzdG9wKCdJTlNUQUxMRURfQU5DRVNUT1JfTk9UX0RJUkVDVE9SWScsIHJlbGF0aXZlKTsKICB9CiAgcmV0dXJuIHRydWU7Cn0KCmZ1bmN0aW9uIGludmVudG9yeShzdGFnZSwgbW9kdWxlcykgewogIGNvbnN0IG1hbmlmZXN0ID0gW107CiAgY29uc3QgbG9naWNhbERpcmVjdG9yaWVzID0gbmV3IFNldCgpOwogIGxldCBieXRlcyA9IDA7CiAgbGV0IGVudHJpZXMgPSAwOwogIGZ1bmN0aW9uIGFkZChyZWNvcmQpIHsKICAgIG1hbmlmZXN0LnB1c2gocmVjb3JkKTsKICAgIGJ5dGVzICs9IHJlY29yZC5ieXRlczsKICAgIGlmIChtYW5pZmVzdC5sZW5ndGggPiBNQVhfRklMRVMgfHwgYnl0ZXMgPiBNQVhfQllURVMpIHN0b3AoJ0lOU1RBTExFRF9UUkVFX0xJTUlUJyk7CiAgfQogIGZ1bmN0aW9uIHdhbGsoZGlyZWN0b3J5LCBkZXB0aCA9IDApIHsKICAgIGlmIChkZXB0aCA+IDEwMCkgc3RvcCgnSU5TVEFMTEVEX1RSRUVfREVQVEhfTElNSVQnKTsKICAgIGZvciAoY29uc3QgbmFtZSBvZiBzb3J0ZWQoZnMucmVhZGRpclN5bmMoZGlyZWN0b3J5KSkpIHsKICAgICAgaWYgKCsrZW50cmllcyA+IE1BWF9GSUxFUyAqIDIpIHN0b3AoJ0lOU1RBTExFRF9UUkVFX0VOVFJZX0xJTUlUJyk7CiAgICAgIGlmIChuYW1lLmxlbmd0aCA+IDUxMiB8fCAvW1x4MDAtXHgxZlx4N2ZcXF0vLnRlc3QobmFtZSkgfHwgbmFtZSA9PT0gJy4nIHx8IG5hbWUgPT09ICcuLicpIHN0b3AoJ0lOU1RBTExFRF9UUkVFX05BTUVfSU5WQUxJRCcpOwogICAgICBjb25zdCBhYnNvbHV0ZSA9IHBhdGguam9pbihkaXJlY3RvcnksIG5hbWUpOwogICAgICBjb25zdCByZWxhdGl2ZSA9IHBhdGgucmVsYXRpdmUoc3RhZ2UsIGFic29sdXRlKS5zcGxpdChwYXRoLnNlcCkuam9pbignLycpOwogICAgICBpZiAocmVsYXRpdmUubGVuZ3RoID4gNDA5Nikgc3RvcCgnSU5TVEFMTEVEX1RSRUVfUEFUSF9MSU1JVCcpOwogICAgICBjb25zdCBzdGF0ID0gZnMubHN0YXRTeW5jKGFic29sdXRlKTsKICAgICAgaWYgKHN0YXQuaXNTeW1ib2xpY0xpbmsoKSkgewogICAgICAgIGlmIChwYXRoLmJhc2VuYW1lKGRpcmVjdG9yeSkgIT09ICcuYmluJyB8fCAhcGFydC50ZXN0KG5hbWUpKSBzdG9wKCdJTlNUQUxMRURfU1lNTElOS19OT1RfQklOJywgcmVsYXRpdmUpOwogICAgICAgIGNvbnN0IGxpbmsgPSBmcy5yZWFkbGlua1N5bmMoYWJzb2x1dGUpOwogICAgICAgIGlmICghbGluayB8fCBsaW5rLmxlbmd0aCA+IDIwNDggfHwgcGF0aC5pc0Fic29sdXRlKGxpbmspIHx8IC9bXHgwMC1ceDFmXHg3ZlxcXS8udGVzdChsaW5rKSkgc3RvcCgnSU5TVEFMTEVEX0JJTl9MSU5LX0lOVkFMSUQnLCByZWxhdGl2ZSk7CiAgICAgICAgY29uc3QgdGFyZ2V0QWJzb2x1dGUgPSBwYXRoLnJlc29sdmUoZGlyZWN0b3J5LCBsaW5rKTsKICAgICAgICBpZiAoIWluc2lkZShtb2R1bGVzLCB0YXJnZXRBYnNvbHV0ZSkpIHN0b3AoJ0lOU1RBTExFRF9CSU5fTElOS19FU0NBUEVTJywgcmVsYXRpdmUpOwogICAgICAgIGlmICghYXNzZXJ0Tm9MaW5rQW5jZXN0b3JzKG1vZHVsZXMsIHRhcmdldEFic29sdXRlLCByZWxhdGl2ZSkpIHN0b3AoJ0lOU1RBTExFRF9CSU5fVEFSR0VUX01JU1NJTkcnLCByZWxhdGl2ZSk7CiAgICAgICAgY29uc3QgdGFyZ2V0ID0gcGF0aC5yZWxhdGl2ZShzdGFnZSwgdGFyZ2V0QWJzb2x1dGUpLnNwbGl0KHBhdGguc2VwKS5qb2luKCcvJyk7CiAgICAgICAgY29uc3QgdGFyZ2V0UmVjb3JkID0gZmlsZVJlY29yZCh0YXJnZXRBYnNvbHV0ZSwgdGFyZ2V0KTsKICAgICAgICBpZiAoZnMucmVhZGxpbmtTeW5jKGFic29sdXRlKSAhPT0gbGluayB8fCAhZnMubHN0YXRTeW5jKGFic29sdXRlKS5pc1N5bWJvbGljTGluaygpKSBzdG9wKCdJTlNUQUxMRURfQklOX0xJTktfQ0hBTkdFRCcsIHJlbGF0aXZlKTsKICAgICAgICBhZGQoeyBmaWxlOiByZWxhdGl2ZSwgdHlwZTogJ3N5bWxpbmsnLCBsaW5rLCBsaW5rU2hhMjU2OiBoYXNoKGxpbmspLCBieXRlczogQnVmZmVyLmJ5dGVMZW5ndGgobGluayksIG1vZGU6IHN0YXQubW9kZSwKICAgICAgICAgIHRhcmdldCwgdGFyZ2V0U2hhMjU2OiB0YXJnZXRSZWNvcmQuc2hhMjU2LCB0YXJnZXRCeXRlczogdGFyZ2V0UmVjb3JkLmJ5dGVzIH0pOwogICAgICB9IGVsc2UgaWYgKHN0YXQuaXNEaXJlY3RvcnkoKSkgewogICAgICAgIGlmIChsb2dpY2FsUGFja2FnZVBhdGgocmVsYXRpdmUpKSBsb2dpY2FsRGlyZWN0b3JpZXMuYWRkKHJlbGF0aXZlKTsKICAgICAgICB3YWxrKGFic29sdXRlLCBkZXB0aCArIDEpOwogICAgICB9IGVsc2UgaWYgKHN0YXQuaXNGaWxlKCkpIGFkZChmaWxlUmVjb3JkKGFic29sdXRlLCByZWxhdGl2ZSkpOwogICAgICBlbHNlIHN0b3AoJ0lOU1RBTExFRF9TUEVDSUFMX0ZJTEUnLCByZWxhdGl2ZSk7CiAgICB9CiAgfQogIHdhbGsobW9kdWxlcyk7CiAgbWFuaWZlc3Quc29ydCgoYSwgYikgPT4gYS5maWxlIDwgYi5maWxlID8gLTEgOiBhLmZpbGUgPiBiLmZpbGUgPyAxIDogMCk7CiAgcmV0dXJuIHsgbWFuaWZlc3QsIGxvZ2ljYWxEaXJlY3RvcmllcywgYnl0ZXMgfTsKfQoKZXhwb3J0IGZ1bmN0aW9uIGluc3BlY3RJbnN0YWxsZWQoc3RhZ2UsIGxvY2spIHsKICBpZiAodHlwZW9mIHN0YWdlICE9PSAnc3RyaW5nJyB8fCAhcGF0aC5pc0Fic29sdXRlKHN0YWdlKSkgc3RvcCgnU1RBR0VfUEFUSF9JTlZBTElEJyk7CiAgc3RhZ2UgPSBwYXRoLnJlc29sdmUoc3RhZ2UpOwogIGlmIChmcy5yZWFscGF0aFN5bmMoc3RhZ2UpICE9PSBzdGFnZSB8fCAhZnMubHN0YXRTeW5jKHN0YWdlKS5pc0RpcmVjdG9yeSgpKSBzdG9wKCdTVEFHRV9QQVRIX05PVF9DQU5PTklDQUwnKTsKICBjb25zdCByb290ID0gbG9jaz8ucGFja2FnZXM/LlsnJ107CiAgY29uc3QgcG9saWN5ID0gdmFsaWRhdGVMb2NrKHJvb3QsIGxvY2spOwogIGNvbnN0IG1vZHVsZXMgPSBwYXRoLmpvaW4oc3RhZ2UsICdub2RlX21vZHVsZXMnKTsKICBpZiAoIWFzc2VydE5vTGlua0FuY2VzdG9ycyhzdGFnZSwgbW9kdWxlcywgJ25vZGVfbW9kdWxlcycpIHx8ICFmcy5sc3RhdFN5bmMobW9kdWxlcykuaXNEaXJlY3RvcnkoKSkgc3RvcCgnTk9ERV9NT0RVTEVTX01JU1NJTkcnKTsKICBjb25zdCBvYnNlcnZlZCA9IG5ldyBNYXAoKTsKICBjb25zdCBpbnN0YWxsZWQgPSBbXTsKICBjb25zdCBhYnNlbnRPcHRpb25hbCA9IFtdOwogIGNvbnN0IGV4Y2x1ZGVkUGFja2FnZXMgPSBuZXcgU2V0KHBvbGljeS5wbGF0Zm9ybUV4Y2x1ZGVkQnVuZGxlRGVjbGFyYXRpb25zLm1hcChlbnRyeSA9PiBlbnRyeS5maWxlKSk7CiAgZm9yIChjb25zdCBmaWxlIG9mIHBvbGljeS5sb2NrUGF0aHMpIHsKICAgIGNvbnN0IGVudHJ5ID0gbG9jay5wYWNrYWdlc1tmaWxlXTsKICAgIGNvbnN0IHJlbGF0aXZlID0gYCR7ZmlsZX0vcGFja2FnZS5qc29uYDsKICAgIGNvbnN0IGFic29sdXRlID0gcGF0aC5qb2luKHN0YWdlLCByZWxhdGl2ZSk7CiAgICBpZiAoZXhjbHVkZWRQYWNrYWdlcy5oYXMoZmlsZSkpIHsKICAgICAgaWYgKGFzc2VydE5vTGlua0FuY2VzdG9ycyhtb2R1bGVzLCBwYXRoLmpvaW4oc3RhZ2UsIGZpbGUpLCBmaWxlKSkgc3RvcCgnUExBVEZPUk1fRVhDTFVERURfUEFDS0FHRV9QUkVTRU5UJywgZmlsZSk7CiAgICAgIGFic2VudE9wdGlvbmFsLnB1c2goeyBmaWxlLCB2ZXJzaW9uOiBlbnRyeS52ZXJzaW9uLCBvcHRpb25hbDogdHJ1ZSwgZGV2T3B0aW9uYWw6IGVudHJ5LmRldk9wdGlvbmFsID09PSB0cnVlLAogICAgICAgIHN0YXRlOiAnUExBVEZPUk1fRVhDTFVERURfT1BUSU9OQUxfRElSRUNUT1JZX0FCU0VOVCcsIHBsYXRmb3JtRXhjbHVkZWQ6IHRydWUgfSk7CiAgICAgIGNvbnRpbnVlOwogICAgfQogICAgaWYgKCFhc3NlcnROb0xpbmtBbmNlc3RvcnMobW9kdWxlcywgYWJzb2x1dGUsIHJlbGF0aXZlKSkgewogICAgICBpZiAoZW50cnkub3B0aW9uYWwgPT09IHRydWUpIHsKICAgICAgICBhYnNlbnRPcHRpb25hbC5wdXNoKHsgZmlsZSwgdmVyc2lvbjogZW50cnkudmVyc2lvbiwgb3B0aW9uYWw6IGVudHJ5Lm9wdGlvbmFsID09PSB0cnVlLCBkZXZPcHRpb25hbDogZW50cnkuZGV2T3B0aW9uYWwgPT09IHRydWUsCiAgICAgICAgICBzdGF0ZTogJ0FCU0VOVF9PUFRJT05BTF9OT1RfRlVOQ1RJT05BTExZX1FVQUxJRklFRCcgfSk7CiAgICAgICAgY29udGludWU7CiAgICAgIH0KICAgICAgc3RvcCgnUkVRVUlSRURfTE9DS0VEX1BBQ0tBR0VfTUlTU0lORycsIGZpbGUpOwogICAgfQogICAgY29uc3QgZGF0YSA9IHJlYWRKU09OKGFic29sdXRlLCByZWxhdGl2ZSk7CiAgICBpZiAoZGF0YS52YWx1ZS52ZXJzaW9uICE9PSBlbnRyeS52ZXJzaW9uKSBzdG9wKCdJTlNUQUxMRURfVkVSU0lPTl9NSVNNQVRDSCcsIGZpbGUpOwogICAgY29uc3QgZXhwZWN0ZWROYW1lID0gZW50cnkubmFtZSA/PyBmaWxlLnNsaWNlKGZpbGUubGFzdEluZGV4T2YoJ25vZGVfbW9kdWxlcy8nKSArICdub2RlX21vZHVsZXMvJy5sZW5ndGgpOwogICAgaWYgKCFwYWNrYWdlTmFtZS50ZXN0KGRhdGEudmFsdWUubmFtZSB8fCAnJykgfHwgZGF0YS52YWx1ZS5uYW1lICE9PSBleHBlY3RlZE5hbWUpIHN0b3AoJ0lOU1RBTExFRF9QQUNLQUdFX05BTUVfTUlTTUFUQ0gnLCBmaWxlKTsKICAgIG9ic2VydmVkLnNldChyZWxhdGl2ZSwgZGF0YS5yZWNvcmQpOwogICAgaW5zdGFsbGVkLnB1c2goeyBmaWxlLCBuYW1lOiBkYXRhLnZhbHVlLm5hbWUsIHZlcnNpb246IGRhdGEudmFsdWUudmVyc2lvbiwgcGFja2FnZUpzb25TaGEyNTY6IGRhdGEucmVjb3JkLnNoYTI1NiB9KTsKICB9CiAgY29uc3QgaGlkZGVuUmVsYXRpdmUgPSAnbm9kZV9tb2R1bGVzLy5wYWNrYWdlLWxvY2suanNvbic7CiAgY29uc3QgaGlkZGVuID0gcmVhZEpTT04ocGF0aC5qb2luKHN0YWdlLCBoaWRkZW5SZWxhdGl2ZSksIGhpZGRlblJlbGF0aXZlKTsKICBvYnNlcnZlZC5zZXQoaGlkZGVuUmVsYXRpdmUsIGhpZGRlbi5yZWNvcmQpOwogIGlmIChoaWRkZW4udmFsdWUubG9ja2ZpbGVWZXJzaW9uICE9PSAzIHx8ICFvYmplY3QoaGlkZGVuLnZhbHVlLnBhY2thZ2VzKSkgc3RvcCgnSElEREVOX0xPQ0tfSU5WQUxJRCcpOwogIGNvbnN0IGluc3RhbGxlZFBhdGhzID0gbmV3IFNldChpbnN0YWxsZWQubWFwKHJlY29yZCA9PiByZWNvcmQuZmlsZSkpOwogIGNvbnN0IGFic2VudFBhdGhzID0gbmV3IFNldChhYnNlbnRPcHRpb25hbC5tYXAocmVjb3JkID0+IHJlY29yZC5maWxlKSk7CiAgY29uc3QgaGlkZGVuQWJzZW50T3B0aW9uYWwgPSBbXTsKICBsZXQgaGlkZGVuRW50cmllcyA9IDA7CiAgZm9yIChjb25zdCBbZmlsZSwgZW50cnldIG9mIE9iamVjdC5lbnRyaWVzKGhpZGRlbi52YWx1ZS5wYWNrYWdlcykpIHsKICAgIGlmICghZmlsZSkgc3RvcCgnSElEREVOX0xPQ0tfVU5FWFBFQ1RFRF9ST09UJyk7CiAgICBpZiAoKytoaWRkZW5FbnRyaWVzID4gTUFYX1BBQ0tBR0VTIHx8ICFsb2dpY2FsUGFja2FnZVBhdGgoZmlsZSkgfHwgIW93bihsb2NrLnBhY2thZ2VzLCBmaWxlKSB8fCAhb2JqZWN0KGVudHJ5KSkgc3RvcCgnSElEREVOX0xPQ0tfVU5FWFBFQ1RFRF9QQUNLQUdFJyk7CiAgICBpZiAoZW50cnkudmVyc2lvbiAhPT0gbG9jay5wYWNrYWdlc1tmaWxlXS52ZXJzaW9uIHx8IGVudHJ5LmxpbmsgPT09IHRydWUpIHN0b3AoJ0hJRERFTl9MT0NLX1ZFUlNJT05fT1JfTElOS19NSVNNQVRDSCcsIGZpbGUpOwogICAgaWYgKGVudHJ5LnJlc29sdmVkICE9PSB1bmRlZmluZWQgJiYgZW50cnkucmVzb2x2ZWQgIT09IGxvY2sucGFja2FnZXNbZmlsZV0ucmVzb2x2ZWQpIHN0b3AoJ0hJRERFTl9MT0NLX0FSQ0hJVkVfTUlTTUFUQ0gnLCBmaWxlKTsKICAgIGlmIChlbnRyeS5pbnRlZ3JpdHkgIT09IHVuZGVmaW5lZCAmJiBlbnRyeS5pbnRlZ3JpdHkgIT09IGxvY2sucGFja2FnZXNbZmlsZV0uaW50ZWdyaXR5KSBzdG9wKCdISURERU5fTE9DS19JTlRFR1JJVFlfTUlTTUFUQ0gnLCBmaWxlKTsKICAgIGlmICghaW5zdGFsbGVkUGF0aHMuaGFzKGZpbGUpKSB7CiAgICAgIGlmICghYWJzZW50UGF0aHMuaGFzKGZpbGUpKSBzdG9wKCdISURERU5fTE9DS19QQUNLQUdFX01JU1NJTkcnLCBmaWxlKTsKICAgICAgaGlkZGVuQWJzZW50T3B0aW9uYWwucHVzaChmaWxlKTsKICAgIH0KICB9CiAgZm9yIChjb25zdCBmaWxlIG9mIGluc3RhbGxlZFBhdGhzKSBpZiAoIW93bihoaWRkZW4udmFsdWUucGFja2FnZXMsIGZpbGUpKSBzdG9wKCdISURERU5fTE9DS19NSVNTSU5HX0lOU1RBTExFRF9QQUNLQUdFJywgZmlsZSk7CiAgY29uc3QgdHJlZSA9IGludmVudG9yeShzdGFnZSwgbW9kdWxlcyk7CiAgY29uc3QgYnlGaWxlID0gbmV3IE1hcCh0cmVlLm1hbmlmZXN0Lm1hcChyZWNvcmQgPT4gW3JlY29yZC5maWxlLCByZWNvcmRdKSk7CiAgZm9yIChjb25zdCBbZmlsZSwgYmVmb3JlXSBvZiBvYnNlcnZlZCkgewogICAgY29uc3QgYWZ0ZXIgPSBieUZpbGUuZ2V0KGZpbGUpOwogICAgaWYgKCFhZnRlciB8fCBhZnRlci50eXBlICE9PSAnZmlsZScgfHwgYWZ0ZXIuc2hhMjU2ICE9PSBiZWZvcmUuc2hhMjU2IHx8IGFmdGVyLmJ5dGVzICE9PSBiZWZvcmUuYnl0ZXMgfHwgYWZ0ZXIubW9kZSAhPT0gYmVmb3JlLm1vZGUpIHN0b3AoJ0lOU1RBTExFRF9NRVRBREFUQV9DSEFOR0VEJywgZmlsZSk7CiAgfQogIGZvciAoY29uc3QgZmlsZSBvZiB0cmVlLmxvZ2ljYWxEaXJlY3RvcmllcykgewogICAgaWYgKCFvd24obG9jay5wYWNrYWdlcywgZmlsZSkpIHN0b3AoJ0lOU1RBTExFRF9VTkVYUEVDVEVEX1BBQ0tBR0VfRElSRUNUT1JZJywgZmlsZSk7CiAgICBpZiAoIWluc3RhbGxlZFBhdGhzLmhhcyhmaWxlKSkgc3RvcCgnSU5TVEFMTEVEX1BBQ0tBR0VfRElSRUNUT1JZX1dJVEhPVVRfTUVUQURBVEEnLCBmaWxlKTsKICB9CiAgY29uc3Qgc2VsZWN0ZWQgPSBwb2xpY3kuc2VsZWN0ZWRMb2NrZWQubWFwKGV4cGVjdGVkID0+IHsKICAgIGNvbnN0IGFjdHVhbCA9IGluc3RhbGxlZC5maW5kKHJlY29yZCA9PiByZWNvcmQuZmlsZSA9PT0gZXhwZWN0ZWQuZmlsZSk7CiAgICBpZiAoIWFjdHVhbCkgc3RvcCgnU0VMRUNURURfSU5TVEFMTEVEX1BBQ0tBR0VfTUlTU0lORycsIGV4cGVjdGVkLmZpbGUpOwogICAgcmV0dXJuIHsgLi4uYWN0dWFsLCBleHBlY3RlZFZlcnNpb246IGV4cGVjdGVkLnZlcnNpb24sIHZlcnNpb25NYXRjaDogYWN0dWFsLnZlcnNpb24gPT09IGV4cGVjdGVkLnZlcnNpb24gfTsKICB9KTsKICByZXR1cm4gewogICAgc3RhdHVzOiAnUFJJVkFURV9MT0NLRURfREVQRU5ERU5DSUVTX0lOU1BFQ1RFRCcsCiAgICBwYWNrYWdlU3VtbWFyeTogeyBsb2NrZWQ6IHBvbGljeS5wYWNrYWdlQ291bnQsIGluc3RhbGxlZDogaW5zdGFsbGVkLmxlbmd0aCwgYWJzZW50T3B0aW9uYWw6IGFic2VudE9wdGlvbmFsLmxlbmd0aCB9LAogICAgc2VsZWN0ZWQsIGluc3RhbGxlZCwgYWJzZW50T3B0aW9uYWwsCiAgICBwbGF0Zm9ybUV4Y2x1ZGVkQnVuZGxlRGVjbGFyYXRpb25zOiBwb2xpY3kucGxhdGZvcm1FeGNsdWRlZEJ1bmRsZURlY2xhcmF0aW9ucywKICAgIGhpZGRlbkxvY2s6IHsgc3RhdHVzOiBoaWRkZW5BYnNlbnRPcHRpb25hbC5sZW5ndGggPyAnTUFUQ0hFRF9XSVRIX0FCU0VOVF9PUFRJT05BTF9FTlRSSUVTX1JFUE9SVEVEJyA6ICdNQVRDSEVEX1RPX0lOU1RBTExFRF9UUkVFJywKICAgICAgZW50cmllczogaGlkZGVuRW50cmllcywgYWJzZW50T3B0aW9uYWxFbnRyaWVzOiBoaWRkZW5BYnNlbnRPcHRpb25hbCwgc2hhMjU2OiBoaWRkZW4ucmVjb3JkLnNoYTI1NiwKICAgICAgc2NvcGU6ICdQQVRIX1ZFUlNJT05fQU5EX0FWQUlMQUJMRV9BUkNISVZFX01FVEFEQVRBX05PVF9GSUxFU1lTVEVNX0NPTlRFTlRfSU5URUdSSVRZJyB9LAogICAgZmlsZU1hbmlmZXN0OiB0cmVlLm1hbmlmZXN0LCBmaWxlczogdHJlZS5tYW5pZmVzdC5sZW5ndGgsIGJ5dGVzOiB0cmVlLmJ5dGVzLAogICAgbWFuaWZlc3RTaGEyNTY6IGhhc2goSlNPTi5zdHJpbmdpZnkodHJlZS5tYW5pZmVzdCkpLAogICAgc2NvcGU6ICdMT0NLRURfVkVSU0lPTl9NRVRBREFUQV9BTkRfT0JTRVJWRURfSU5TVEFMTEVEX0ZJTEVfQllURVNfTk9UX1BBQ0tBR0VfRVhFQ1VUSU9OX09SX1JFUFJPRFVDSUJMRV9CVUlMRCcsCiAgICBsaW1pdHM6IHsgbWF4RmlsZXM6IE1BWF9GSUxFUywgbWF4Qnl0ZXM6IE1BWF9CWVRFUywgbWF4UGFja2FnZXM6IE1BWF9QQUNLQUdFUyB9CiAgfTsKfQo=';
const POLICY_SHA = '0d32a375e7f43b58a809f5f902e971d6030512729927b4f4f19668610c0f7404';
const RUNNER_B64 = 'aW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnOwppbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnOwppbXBvcnQgY3J5cHRvIGZyb20gJ25vZGU6Y3J5cHRvJzsKaW1wb3J0IHsgc3Bhd24gfSBmcm9tICdub2RlOmNoaWxkX3Byb2Nlc3MnOwoKLy8gVGhpcyBoZWxwZXIgaW5zcGVjdHMgYW5kIGludm9rZXMgdGhlIGFscmVhZHkgaW5zdGFsbGVkIG5wbSBDTEkuIEl0IG5ldmVyCi8vIGV4ZWN1dGVzIGEgUEFUSCBzaGVsbCB3cmFwcGVyIG9yIGFuIGFwcGxpY2F0aW9uL3BhY2thZ2UgbGlmZWN5Y2xlIHNjcmlwdC4KY29uc3QgQ0xJX0xJTUlUID0gMjU2ICogMTAyNDsKY29uc3QgQ09ORklHX0xJTUlUID0gNjQgKiAxMDI0Owpjb25zdCBQQUNLQUdFX0xJTUlUID0gMTAyNCAqIDEwMjQ7CmNvbnN0IExPR19MSU1JVCA9IDE2ICogMTAyNCAqIDEwMjQ7CmNvbnN0IFJVTl9USU1FT1VUID0gMTUgKiA2MCAqIDEwMDA7CmNvbnN0IE5QTV9DT0RFUyA9IG5ldyBTZXQoWwogICdFVVNBR0UnLCAnRVJFU09MVkUnLCAnRVRBUkdFVCcsICdFSU5URUdSSVRZJywgJ0VMT0NLVkVSSUZZJywgJ0VCQURFTkdJTkUnLAogICdFQkFEUExBVEZPUk0nLCAnRTQwMScsICdFNDAzJywgJ0U0MDQnLCAnRTQyOScsICdFNTAwJywgJ0U1MDInLCAnRTUwMycsCiAgJ0VUSU1FRE9VVCcsICdFU09DS0VUVElNRURPVVQnLCAnRU5PVEZPVU5EJywgJ0VBSV9BR0FJTicsICdFQ09OTlJFU0VUJywKICAnRUNPTk5SRUZVU0VEJywgJ0VOT0VOVCcsICdFQUNDRVMnLCAnRVBFUk0nLCAnRU5PU1BDJywgJ0VOT1RFTVBUWScsCiAgJ0VSUl9JTlZBTElEX0FSR19UWVBFJywgJ0VSUl9JTlZBTElEX1VSTCcsICdVTkFCTEVfVE9fVkVSSUZZX0xFQUZfU0lHTkFUVVJFJywKICAnU0VMRl9TSUdORURfQ0VSVF9JTl9DSEFJTicsICdDRVJUX0hBU19FWFBJUkVEJywgJ1VOQUJMRV9UT19HRVRfSVNTVUVSX0NFUlRfTE9DQUxMWScsCl0pOwpjb25zdCBkaWdlc3QgPSB2YWx1ZSA9PiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMjU2JykudXBkYXRlKHZhbHVlKS5kaWdlc3QoJ2hleCcpOwoKZnVuY3Rpb24gZmFpbChjb2RlLCBkZXRhaWwgPSB7fSkgewogIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKGNvZGUpOwogIGVycm9yLmNvZGUgPSBjb2RlOwogIGVycm9yLmRldGFpbCA9IGRldGFpbDsKICB0aHJvdyBlcnJvcjsKfQoKZnVuY3Rpb24gcmVhZE9ic2VydmVkKGZpbGUsIG1heEJ5dGVzLCB7IGV4ZWN1dGFibGUgPSBmYWxzZSB9ID0ge30pIHsKICBsZXQgcmVzb2x2ZWQsIGluaXRpYWwsIGZkOwogIHRyeSB7CiAgICByZXNvbHZlZCA9IGZzLnJlYWxwYXRoU3luYyhmaWxlKTsKICAgIGluaXRpYWwgPSBmcy5zdGF0U3luYyhyZXNvbHZlZCk7CiAgfSBjYXRjaCAoZXJyb3IpIHsKICAgIGZhaWwoJ05QTV9UT09MX0ZJTEVfVU5BVkFJTEFCTEUnLCB7IG9wZXJhdGlvbjogJ2lkZW50aXR5JywgY29kZTogZXJyb3IuY29kZSB8fCAnVU5LTk9XTicgfSk7CiAgfQogIGlmICghaW5pdGlhbC5pc0ZpbGUoKSB8fCBpbml0aWFsLnNpemUgPiBtYXhCeXRlcykgZmFpbCgnTlBNX1RPT0xfRklMRV9UWVBFX09SX1NJWkUnKTsKICBpZiAoZXhlY3V0YWJsZSAmJiAoaW5pdGlhbC5tb2RlICYgMG8xMTEpID09PSAwKSBmYWlsKCdOUE1fVE9PTF9OT1RfRVhFQ1VUQUJMRScpOwogIGNvbnN0IHVuY2hhbmdlZCA9IChhLCBiKSA9PiBbJ2RldicsICdpbm8nLCAnc2l6ZScsICdtb2RlJywgJ210aW1lTXMnLCAnY3RpbWVNcyddLmV2ZXJ5KGtleSA9PiBhW2tleV0gPT09IGJba2V5XSk7CiAgdHJ5IHsKICAgIGZkID0gZnMub3BlblN5bmMocmVzb2x2ZWQsIGZzLmNvbnN0YW50cy5PX1JET05MWSB8IGZzLmNvbnN0YW50cy5PX05PRk9MTE9XKTsKICAgIGlmICghdW5jaGFuZ2VkKGluaXRpYWwsIGZzLmZzdGF0U3luYyhmZCkpKSBmYWlsKCdOUE1fVE9PTF9DSEFOR0VEX0RVUklOR19SRUFEJyk7CiAgICBjb25zdCBieXRlcyA9IEJ1ZmZlci5hbGxvYyhpbml0aWFsLnNpemUpOwogICAgbGV0IG9mZnNldCA9IDA7CiAgICB3aGlsZSAob2Zmc2V0IDwgYnl0ZXMubGVuZ3RoKSB7CiAgICAgIGNvbnN0IGNvdW50ID0gZnMucmVhZFN5bmMoZmQsIGJ5dGVzLCBvZmZzZXQsIGJ5dGVzLmxlbmd0aCAtIG9mZnNldCwgb2Zmc2V0KTsKICAgICAgaWYgKGNvdW50ID09PSAwKSBmYWlsKCdOUE1fVE9PTF9DSEFOR0VEX0RVUklOR19SRUFEJyk7CiAgICAgIG9mZnNldCArPSBjb3VudDsKICAgIH0KICAgIGlmICghdW5jaGFuZ2VkKGluaXRpYWwsIGZzLmZzdGF0U3luYyhmZCkpIHx8ICF1bmNoYW5nZWQoaW5pdGlhbCwgZnMuc3RhdFN5bmMocmVzb2x2ZWQpKSB8fCBmcy5yZWFscGF0aFN5bmMoZmlsZSkgIT09IHJlc29sdmVkKSB7CiAgICAgIGZhaWwoJ05QTV9UT09MX0NIQU5HRURfRFVSSU5HX1JFQUQnKTsKICAgIH0KICAgIHJldHVybiB7IGlkZW50aXR5OiB7IHBhdGg6IGZpbGUsIHJlc29sdmVkLCBzdGF0ZTogJ0ZJTEUnLCBzaGEyNTY6IGRpZ2VzdChieXRlcyksIGJ5dGVzOiBieXRlcy5sZW5ndGgsIG1vZGU6IGluaXRpYWwubW9kZSB9LCBieXRlcyB9OwogIH0gZmluYWxseSB7IGlmIChmZCAhPT0gdW5kZWZpbmVkKSBmcy5jbG9zZVN5bmMoZmQpOyB9Cn0KCmZ1bmN0aW9uIHJlZ3VsYXJJZGVudGl0eShmaWxlLCBtYXhCeXRlcywgb3B0aW9ucykgewogIHJldHVybiByZWFkT2JzZXJ2ZWQoZmlsZSwgbWF4Qnl0ZXMsIG9wdGlvbnMpLmlkZW50aXR5Owp9CgpmdW5jdGlvbiByZWFkQm91bmRlZChmaWxlLCBtYXhCeXRlcykgewogIHJldHVybiByZWFkT2JzZXJ2ZWQoZmlsZSwgbWF4Qnl0ZXMpOwp9CgpmdW5jdGlvbiBidWlsdGluQ29uZmlnKG5wbVJvb3QpIHsKICBjb25zdCBmaWxlID0gcGF0aC5qb2luKG5wbVJvb3QsICducG1yYycpOwogIHRyeSB7IGZzLmxzdGF0U3luYyhmaWxlKTsgfQogIGNhdGNoIChlcnJvcikgewogICAgaWYgKGVycm9yLmNvZGUgPT09ICdFTk9FTlQnKSByZXR1cm4geyBwYXRoOiBmaWxlLCBzdGF0ZTogJ0FCU0VOVCcsIGtleXM6IFtdIH07CiAgICBmYWlsKCdOUE1fQlVJTFRJTl9DT05GSUdfVU5BVkFJTEFCTEUnLCB7IGNvZGU6IGVycm9yLmNvZGUgfHwgJ1VOS05PV04nIH0pOwogIH0KICAvLyBUaGVzZSBkaXN0cmlidXRpb24gcGF0aCBzZXR0aW5ncyBhcmUgaW5lcnQgZm9yIHRoaXMgaW52b2NhdGlvbjogLS1wcmVmaXgKICAvLyBhbmQgLS1nbG9iYWxjb25maWcgb3ZlcnJpZGUgdGhlIGZpcnN0IHR3bzsgbm9kZV9neXAgaXMgbmV2ZXIgdXNlZCB3aXRoCiAgLy8gbGlmZWN5Y2xlIHNjcmlwdHMgZGlzYWJsZWQuIE5vIHRyYW5zcG9ydC9hdXRoL3JlZ2lzdHJ5IHNldHRpbmcgaXMgYWNjZXB0ZWQuCiAgY29uc3QgYWxsb3dlZCA9IG5ldyBTZXQoWydwcmVmaXgnLCAnZ2xvYmFsY29uZmlnJywgJ25vZGVfZ3lwJ10pOwogIGNvbnN0IHsgaWRlbnRpdHksIGJ5dGVzIH0gPSByZWFkQm91bmRlZChmaWxlLCBDT05GSUdfTElNSVQpOwogIGlmIChpZGVudGl0eS5yZXNvbHZlZCAhPT0gZmlsZSkgZmFpbCgnTlBNX0JVSUxUSU5fQ09ORklHX1NZTUxJTksnKTsKICBjb25zdCB0ZXh0ID0gYnl0ZXMudG9TdHJpbmcoJ3V0ZjgnKTsKICBpZiAoIUJ1ZmZlci5mcm9tKHRleHQpLmVxdWFscyhieXRlcykgfHwgL1tcMFx4MDEtXHgwOFx4MGJceDBjXHgwZS1ceDFmXHg3Zl0vLnRlc3QodGV4dCkpIHsKICAgIGZhaWwoJ05QTV9CVUlMVElOX0NPTkZJR19FTkNPRElORycpOwogIH0KICBjb25zdCBzZWVuID0gbmV3IFNldCgpOwogIGZvciAoY29uc3QgbGluZSBvZiB0ZXh0LnNwbGl0KC9ccj9cbi8pKSB7CiAgICBjb25zdCB0cmltbWVkID0gbGluZS50cmltKCk7CiAgICBpZiAoIXRyaW1tZWQgfHwgdHJpbW1lZC5zdGFydHNXaXRoKCcjJykgfHwgdHJpbW1lZC5zdGFydHNXaXRoKCc7JykpIGNvbnRpbnVlOwogICAgY29uc3QgbWF0Y2ggPSAvXihbYS16X10rKVxzKj1ccyooLispJC8uZXhlYyh0cmltbWVkKTsKICAgIGlmICghbWF0Y2ggfHwgIWFsbG93ZWQuaGFzKG1hdGNoWzFdKSB8fCBzZWVuLmhhcyhtYXRjaFsxXSkpIHsKICAgICAgZmFpbCgnTlBNX0JVSUxUSU5fQ09ORklHX1VOUkVWSUVXRUQnLCB7IGFsbG93ZWRLZXlzOiBbLi4uYWxsb3dlZF0gfSk7CiAgICB9CiAgICAvLyBucG1yYyB2YWx1ZXMgYXJlIG5ldmVyIHByaW50ZWQuIFJlamVjdCBJTkkgc3RydWN0dXJhbCBlc2NhcGVzLCBtdWx0aWxpbmUKICAgIC8vIGNvbnRpbnVhdGlvbiBhbmQgdmFyaWFibGUgZXhwYW5zaW9uIGV2ZW4gaW4gdGhlIHBlcm1pdHRlZCBwYXRoIHNldHRpbmdzLgogICAgaWYgKC9bXFtcXSRgXFxdLy50ZXN0KG1hdGNoWzJdKSB8fCBtYXRjaFsyXS5sZW5ndGggPiA0MDk2KSB7CiAgICAgIGZhaWwoJ05QTV9CVUlMVElOX0NPTkZJR19VTlJFVklFV0VEX1ZBTFVFJywgeyBrZXk6IG1hdGNoWzFdIH0pOwogICAgfQogICAgc2Vlbi5hZGQobWF0Y2hbMV0pOwogIH0KICByZXR1cm4geyAuLi5pZGVudGl0eSwga2V5czogWy4uLnNlZW5dLnNvcnQoKSB9Owp9CgpmdW5jdGlvbiBjbGlGcm9tKGZpbGUsIG9ic2VydmVkLCBkZXB0aCA9IDApIHsKICBpZiAoZGVwdGggPiAzKSBmYWlsKCdOUE1fV1JBUFBFUl9ERVBUSCcpOwogIGNvbnN0IHsgaWRlbnRpdHksIGJ5dGVzIH0gPSByZWFkQm91bmRlZChmaWxlLCBDTElfTElNSVQpOwogIG9ic2VydmVkLnB1c2goaWRlbnRpdHkpOwogIGNvbnN0IHJlc29sdmVkID0gaWRlbnRpdHkucmVzb2x2ZWQ7CiAgaWYgKHJlc29sdmVkLmVuZHNXaXRoKCcvYmluL25wbS1jbGkuanMnKSkgcmV0dXJuIHJlc29sdmVkOwogIGNvbnN0IHRleHQgPSBieXRlcy50b1N0cmluZygndXRmOCcpOwogIGlmICghQnVmZmVyLmZyb20odGV4dCkuZXF1YWxzKGJ5dGVzKSB8fCAhL14jIVteXG5dKig/OlwvfFxzKSg/OmJhc2h8c2gpKD86XHN8JCkvLnRlc3QodGV4dC5zcGxpdCgnXG4nKVswXSkpIHsKICAgIGZhaWwoJ05QTV9FWEVDVVRBQkxFX0xBWU9VVF9VTlNVUFBPUlRFRCcpOwogIH0KICAvLyBOaXggd3JhcFByb2dyYW0gY29tbW9ubHkgcmVkaXJlY3RzIGEgYmluYXJ5IHRvIGEgbGl0ZXJhbCAtd3JhcHBlZCB0YXJnZXQuCiAgLy8gRXh0cmFjdCBvbmx5IGEgbGl0ZXJhbCBhYnNvbHV0ZSB0YXJnZXQgZnJvbSB0aGUgZXhlYyBjb21tYW5kOyBuZXZlciBldmFsLAogIC8vIHNvdXJjZSwgb3IgZXhlY3V0ZSB0aGUgc2hlbGwgdGV4dCwgZXhwb3J0cywgY29tbWFuZCBzdWJzdGl0dXRpb25zIG9yIGZsYWdzLgogIGNvbnN0IHRhcmdldHMgPSBbXTsKICBmb3IgKGNvbnN0IGxpbmUgb2YgdGV4dC5zcGxpdCgnXG4nKSkgewogICAgY29uc3QgbWF0Y2ggPSAvXlxzKmV4ZWNccysoPzotYVxzK1siJ10/XCQwWyInXT9ccyspPyhbIiddKShcL25peFwvc3RvcmVcL1tBLVphLXowLTkrLl8vLV0rKVwxXHMrWyInXT9cJEBbIiddP1xzKiQvLmV4ZWMobGluZSk7CiAgICBpZiAobWF0Y2gpIHRhcmdldHMucHVzaChtYXRjaFsyXSk7CiAgfQogIGlmICh0YXJnZXRzLmxlbmd0aCAhPT0gMSB8fCAhLyg/OlwvYmluXC9ucG0tY2xpXC5qc3xcL1wuPyg/Om5wbXxucG0tY2xpKSg/Oi13cmFwcGVkKSspJC8udGVzdCh0YXJnZXRzWzBdKSkgewogICAgZmFpbCgnTlBNX1dSQVBQRVJfTEFZT1VUX1VOU1VQUE9SVEVEJyk7CiAgfQogIHJldHVybiBjbGlGcm9tKHRhcmdldHNbMF0sIG9ic2VydmVkLCBkZXB0aCArIDEpOwp9CgpleHBvcnQgZnVuY3Rpb24gZGlzY292ZXJOcG0oc2VhcmNoUGF0aCwgbm9kZVBhdGgpIHsKICBpZiAodHlwZW9mIHNlYXJjaFBhdGggIT09ICdzdHJpbmcnIHx8IHNlYXJjaFBhdGgubGVuZ3RoID4gNjU1MzYgfHwgdHlwZW9mIG5vZGVQYXRoICE9PSAnc3RyaW5nJykgewogICAgZmFpbCgnTlBNX0RJU0NPVkVSWV9BUkdVTUVOVCcpOwogIH0KICBjb25zdCBub2RlID0gcmVndWxhcklkZW50aXR5KG5vZGVQYXRoLCAyNTYgKiAxMDI0ICogMTAyNCwgeyBleGVjdXRhYmxlOiB0cnVlIH0pOwogIGlmIChub2RlLnJlc29sdmVkICE9PSBmcy5yZWFscGF0aFN5bmMocHJvY2Vzcy5leGVjUGF0aCkpIGZhaWwoJ05QTV9OT0RFX0VYRUNVVEFCTEVfTUlTTUFUQ0gnKTsKICBsZXQgZXhlY3V0YWJsZTsKICBmb3IgKGNvbnN0IGRpcmVjdG9yeSBvZiBzZWFyY2hQYXRoLnNwbGl0KHBhdGguZGVsaW1pdGVyKSkgewogICAgLy8gQW4gZW1wdHkgb3IgcmVsYXRpdmUgUEFUSCBzZWdtZW50IGNvdWxkIHNlbGVjdCBhIHByb2plY3QgZmlsZS4KICAgIGlmICghcGF0aC5pc0Fic29sdXRlKGRpcmVjdG9yeSkpIGNvbnRpbnVlOwogICAgY29uc3QgY2FuZGlkYXRlID0gcGF0aC5qb2luKGRpcmVjdG9yeSwgJ25wbScpOwogICAgdHJ5IHsgZnMuYWNjZXNzU3luYyhjYW5kaWRhdGUsIGZzLmNvbnN0YW50cy5YX09LKTsgZXhlY3V0YWJsZSA9IGNhbmRpZGF0ZTsgYnJlYWs7IH0KICAgIGNhdGNoIChlcnJvcikgeyBpZiAoIVsnRU5PRU5UJywgJ0VBQ0NFUycsICdFTk9URElSJ10uaW5jbHVkZXMoZXJyb3IuY29kZSkpIGZhaWwoJ05QTV9QQVRIX0xPT0tVUF9GQUlMRUQnLCB7IGNvZGU6IGVycm9yLmNvZGUgfHwgJ1VOS05PV04nIH0pOyB9CiAgfQogIGlmICghZXhlY3V0YWJsZSkgZmFpbCgnTlBNX0VYRUNVVEFCTEVfTk9UX0ZPVU5EJyk7CiAgY29uc3Qgb2JzZXJ2ZWQgPSBbXTsKICBjb25zdCBjbGlQYXRoID0gY2xpRnJvbShleGVjdXRhYmxlLCBvYnNlcnZlZCk7CiAgY29uc3QgbnBtUm9vdCA9IHBhdGguZGlybmFtZShwYXRoLmRpcm5hbWUoY2xpUGF0aCkpOwogIGNvbnN0IHsgaWRlbnRpdHk6IHBhY2thZ2VJZGVudGl0eSwgYnl0ZXM6IHBhY2thZ2VCeXRlcyB9ID0gcmVhZEJvdW5kZWQocGF0aC5qb2luKG5wbVJvb3QsICdwYWNrYWdlLmpzb24nKSwgUEFDS0FHRV9MSU1JVCk7CiAgbGV0IG1ldGFkYXRhOwogIHRyeSB7IG1ldGFkYXRhID0gSlNPTi5wYXJzZShwYWNrYWdlQnl0ZXMudG9TdHJpbmcoJ3V0ZjgnKSk7IH0KICBjYXRjaCB7IGZhaWwoJ05QTV9QQUNLQUdFX01FVEFEQVRBX0lOVkFMSUQnKTsgfQogIGlmIChtZXRhZGF0YS5uYW1lICE9PSAnbnBtJyB8fCB0eXBlb2YgbWV0YWRhdGEudmVyc2lvbiAhPT0gJ3N0cmluZycgfHwgIS9eKD86MTB8MTF8MTIpXC5cZCtcLlxkKyQvLnRlc3QobWV0YWRhdGEudmVyc2lvbikpIHsKICAgIGZhaWwoJ05QTV9DTElfVkVSU0lPTl9VTlNVUFBPUlRFRCcpOwogIH0KICBpZiAocGFja2FnZUlkZW50aXR5LnJlc29sdmVkICE9PSBwYXRoLmpvaW4obnBtUm9vdCwgJ3BhY2thZ2UuanNvbicpKSBmYWlsKCdOUE1fUEFDS0FHRV9NRVRBREFUQV9TWU1MSU5LJyk7CiAgY29uc3QgY29uZmlnID0gYnVpbHRpbkNvbmZpZyhucG1Sb290KTsKICBjb25zdCBjbGkgPSBvYnNlcnZlZC5maW5kKHJvdyA9PiByb3cucmVzb2x2ZWQgPT09IGNsaVBhdGgpOwogIHJldHVybiB7CiAgICBuYW1lOiAnbnBtJywgdmVyc2lvbjogbWV0YWRhdGEudmVyc2lvbiwgY2xpLCBwYWNrYWdlOiBwYWNrYWdlSWRlbnRpdHksCiAgICBidWlsdGluQ29uZmlnOiBjb25maWcsIG5vZGU6IHsgLi4ubm9kZSwgdmVyc2lvbjogcHJvY2Vzcy52ZXJzaW9uIH0sCiAgICB3cmFwcGVyT2JzZXJ2YXRpb25zOiBvYnNlcnZlZC5maWx0ZXIocm93ID0+IHJvdy5yZXNvbHZlZCAhPT0gY2xpUGF0aCksCiAgICBzY29wZTogJ0VYSVNUSU5HX0NMSV9JREVOVElUSUVTX05PVF9GVUxMX05QTV9ESVNUUklCVVRJT05fSU5URUdSSVRZJywKICB9Owp9CgpmdW5jdGlvbiB0b29sc1ByZXNlcnZlZCh0b29sKSB7CiAgY29uc3Qgcm93cyA9IFt0b29sLmNsaSwgdG9vbC5wYWNrYWdlLCB0b29sLm5vZGUsIC4uLnRvb2wud3JhcHBlck9ic2VydmF0aW9uc107CiAgaWYgKHRvb2wuYnVpbHRpbkNvbmZpZy5zdGF0ZSA9PT0gJ0ZJTEUnKSByb3dzLnB1c2godG9vbC5idWlsdGluQ29uZmlnKTsKICBlbHNlIGlmIChmcy5leGlzdHNTeW5jKHRvb2wuYnVpbHRpbkNvbmZpZy5wYXRoKSkgcmV0dXJuIGZhbHNlOwogIGZvciAoY29uc3Qgcm93IG9mIHJvd3MpIHsKICAgIHRyeSB7CiAgICAgIGNvbnN0IGN1cnJlbnQgPSByZWd1bGFySWRlbnRpdHkocm93LnBhdGgsIE1hdGgubWF4KHJvdy5ieXRlcywgMSkpOwogICAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIFsncmVzb2x2ZWQnLCAnc2hhMjU2JywgJ2J5dGVzJywgJ21vZGUnXSkgaWYgKHJvd1tmaWVsZF0gIT09IGN1cnJlbnRbZmllbGRdKSByZXR1cm4gZmFsc2U7CiAgICB9IGNhdGNoIHsgcmV0dXJuIGZhbHNlOyB9CiAgfQogIHJldHVybiB0cnVlOwp9CgpmdW5jdGlvbiBkaXJlY3RvcnkoZmlsZSkgewogIGNvbnN0IHN0YXQgPSBmcy5sc3RhdFN5bmMoZmlsZSk7CiAgaWYgKCFzdGF0LmlzRGlyZWN0b3J5KCkgfHwgc3RhdC5pc1N5bWJvbGljTGluaygpIHx8IGZzLnJlYWxwYXRoU3luYyhmaWxlKSAhPT0gcGF0aC5yZXNvbHZlKGZpbGUpKSBmYWlsKCdOUE1fRElSRUNUT1JZX05PVF9QSFlTSUNBTCcpOwogIHJldHVybiBmcy5yZWFscGF0aFN5bmMoZmlsZSk7Cn0KCmV4cG9ydCBhc3luYyBmdW5jdGlvbiBydW5OcG0odG9vbCwgc3RhZ2UsIHJlcG9ydERpcikgewogIHN0YWdlID0gZGlyZWN0b3J5KHN0YWdlKTsKICByZXBvcnREaXIgPSBkaXJlY3RvcnkocmVwb3J0RGlyKTsKICBpZiAoc3RhZ2UgPT09IHJlcG9ydERpciB8fCAhc3RhZ2Uuc3RhcnRzV2l0aChyZXBvcnREaXIgKyBwYXRoLnNlcCkpIGZhaWwoJ05QTV9TVEFHRV9OT1RfSU5TSURFX1JFUE9SVCcpOwogIGlmIChmcy5yZWFkZGlyU3luYyhzdGFnZSkuc29ydCgpLmpvaW4oJ1wwJykgIT09IFsncGFja2FnZS1sb2NrLmpzb24nLCAncGFja2FnZS5qc29uJ10uam9pbignXDAnKSkgZmFpbCgnTlBNX1NUQUdFX05PVF9GUkVTSF9NQU5JRkVTVF9QQUlSJyk7CiAgZm9yIChjb25zdCBuYW1lIG9mIFsncGFja2FnZS5qc29uJywgJ3BhY2thZ2UtbG9jay5qc29uJ10pIHsKICAgIGlmICghZnMubHN0YXRTeW5jKHBhdGguam9pbihzdGFnZSwgbmFtZSkpLmlzRmlsZSgpKSBmYWlsKCdOUE1fU1RBR0VfTUFOSUZFU1RfTk9UX1JFR1VMQVInKTsKICB9CiAgaWYgKCF0b29sc1ByZXNlcnZlZCh0b29sKSkgZmFpbCgnTlBNX1RPT0xfSURFTlRJVElFU19DSEFOR0VEJyk7CiAgY29uc3QgcHJpdmF0ZURpciA9IGZzLm1rZHRlbXBTeW5jKHBhdGguam9pbihyZXBvcnREaXIsICducG0tcnVuLScpKTsKICBmcy5jaG1vZFN5bmMocHJpdmF0ZURpciwgMG83MDApOwogIGZvciAoY29uc3QgY2hpbGQgb2YgWydjYWNoZScsICdsb2dzJywgJ3RtcCddKSBmcy5ta2RpclN5bmMocGF0aC5qb2luKHByaXZhdGVEaXIsIGNoaWxkKSwgeyBtb2RlOiAwbzcwMCB9KTsKICBjb25zdCB1c2VyQ29uZmlnID0gcGF0aC5qb2luKHByaXZhdGVEaXIsICdlbXB0eS11c2VyLm5wbXJjJyk7CiAgY29uc3QgZ2xvYmFsQ29uZmlnID0gcGF0aC5qb2luKHByaXZhdGVEaXIsICdlbXB0eS1nbG9iYWwubnBtcmMnKTsKICBmb3IgKGNvbnN0IGZpbGUgb2YgW3VzZXJDb25maWcsIGdsb2JhbENvbmZpZ10pIGZzLndyaXRlRmlsZVN5bmMoZmlsZSwgJycsIHsgZmxhZzogJ3d4JywgbW9kZTogMG82MDAgfSk7CiAgY29uc3QgbG9nUGF0aCA9IHBhdGguam9pbihwcml2YXRlRGlyLCAnbnBtLWNpLmxvZycpOwogIGNvbnN0IGxvZ0ZkID0gZnMub3BlblN5bmMobG9nUGF0aCwgJ3d4JywgMG82MDApOwogIGNvbnN0IGFyZ3MgPSBbCiAgICB0b29sLmNsaS5yZXNvbHZlZCwgJ2NpJywgYC0tcHJlZml4PSR7c3RhZ2V9YCwgJy0tZ2xvYmFsPWZhbHNlJywgJy0td29ya3NwYWNlcz1mYWxzZScsCiAgICAnLS1pZ25vcmUtc2NyaXB0cz10cnVlJywgJy0tYXVkaXQ9ZmFsc2UnLCAnLS1mdW5kPWZhbHNlJywgJy0tdXBkYXRlLW5vdGlmaWVyPWZhbHNlJywKICAgICctLXByb2dyZXNzPWZhbHNlJywgJy0tY29sb3I9ZmFsc2UnLCAnLS1pbmNsdWRlPWRldicsICctLWluY2x1ZGU9b3B0aW9uYWwnLCAnLS1pbmNsdWRlPXBlZXInLAogICAgJy0tbGVnYWN5LXBlZXItZGVwcz1mYWxzZScsICctLXN0cmljdC1wZWVyLWRlcHM9ZmFsc2UnLCAnLS1mb3JjZT1mYWxzZScsCiAgICAnLS1yZWdpc3RyeT1odHRwczovL3JlZ2lzdHJ5Lm5wbWpzLm9yZy8nLCBgLS11c2VyY29uZmlnPSR7dXNlckNvbmZpZ31gLCBgLS1nbG9iYWxjb25maWc9JHtnbG9iYWxDb25maWd9YCwKICAgIGAtLWNhY2hlPSR7cGF0aC5qb2luKHByaXZhdGVEaXIsICdjYWNoZScpfWAsIGAtLWxvZ3MtZGlyPSR7cGF0aC5qb2luKHByaXZhdGVEaXIsICdsb2dzJyl9YCwKICAgICctLWZldGNoLXJldHJpZXM9MScsICctLWZldGNoLXRpbWVvdXQ9NjAwMDAnLCAnLS1sb2dzLW1heD0wJywKICBdOwogIGNvbnN0IGVudiA9IHsKICAgIFBBVEg6IHBhdGguZGlybmFtZSh0b29sLm5vZGUucmVzb2x2ZWQpLCBMQU5HOiAnQycsIExDX0FMTDogJ0MnLCBOT19DT0xPUjogJzEnLAogICAgVE1QRElSOiBwYXRoLmpvaW4ocHJpdmF0ZURpciwgJ3RtcCcpLAogIH07CiAgY29uc3Qgc3RhcnRlZEF0ID0gRGF0ZS5ub3coKTsKICBjb25zdCByZXN1bHQgPSB7CiAgICBuYW1lOiAnbnBtLWNpLXByaXZhdGUtbG9ja2VkLXN0YWdlJywgYXR0ZW1wdHM6IDEsIGF0dGVtcHRlZDogdHJ1ZSwgc3RhcnRlZDogZmFsc2UsCiAgICBleGl0Q29kZTogbnVsbCwgc2lnbmFsOiBudWxsLCB0aW1lZE91dDogZmFsc2UsIGludGVycnVwdGVkQnk6IG51bGwsCiAgICBpbnRlcnJ1cHRlZDogZmFsc2UsIG91dHB1dExpbWl0RXhjZWVkZWQ6IGZhbHNlLCBsb2dMaW1pdEV4Y2VlZGVkOiBmYWxzZSwgc3Bhd25FcnJvckNvZGU6IG51bGwsIGVycm9yQ29kZXM6IFtdLAogICAgbnBtVmVyc2lvbjogdG9vbC52ZXJzaW9uLCBwcml2YXRlRGlyZWN0b3J5OiBwcml2YXRlRGlyLCBsb2dGaWxlOiBsb2dQYXRoLAogICAgbGlmZWN5Y2xlU2NyaXB0c0VuYWJsZWQ6IGZhbHNlLCBuZXR3b3JrQWN0aXZpdHk6ICdQRVJNSVRURURfTk9UX0NPVU5URUQnLAogIH07CiAgbGV0IGxvZ2dlZCA9IDA7CiAgbGV0IGNoaWxkLCB0aW1lb3V0LCBoZWFydGJlYXQsIGZvcmNlS2lsbDsKICBsZXQgY2xvc2luZyA9IGZhbHNlOwogIGNvbnN0IHJlcXVlc3RTdG9wID0gKCkgPT4gewogICAgaWYgKGNsb3NpbmcgfHwgIWNoaWxkIHx8IGNoaWxkLmV4aXRDb2RlICE9PSBudWxsIHx8IGNoaWxkLnNpZ25hbENvZGUgIT09IG51bGwpIHJldHVybjsKICAgIHRyeSB7IGNoaWxkLmtpbGwoJ1NJR1RFUk0nKTsgfSBjYXRjaCB7IHJlc3VsdC5jaGlsZFNpZ25hbEZhaWxlZCA9IHRydWU7IH0KICAgIGlmICghZm9yY2VLaWxsKSBmb3JjZUtpbGwgPSBzZXRUaW1lb3V0KCgpID0+IHsKICAgICAgaWYgKCFjbG9zaW5nICYmIGNoaWxkLmV4aXRDb2RlID09PSBudWxsICYmIGNoaWxkLnNpZ25hbENvZGUgPT09IG51bGwpIHsKICAgICAgICB0cnkgeyBjaGlsZC5raWxsKCdTSUdLSUxMJyk7IH0gY2F0Y2ggeyByZXN1bHQuY2hpbGRTaWduYWxGYWlsZWQgPSB0cnVlOyB9CiAgICAgIH0KICAgIH0sIDUwMDApOwogIH07CiAgY29uc3Qgb25JbnRlcnJ1cHQgPSBzaWduYWwgPT4gewogICAgcmVzdWx0LmludGVycnVwdGVkQnkgPSBzaWduYWw7CiAgICByZXN1bHQuaW50ZXJydXB0ZWQgPSB0cnVlOwogICAgcmVxdWVzdFN0b3AoKTsKICB9OwogIGNvbnN0IG9uU2lnaW50ID0gKCkgPT4gb25JbnRlcnJ1cHQoJ1NJR0lOVCcpOwogIGNvbnN0IG9uU2lndGVybSA9ICgpID0+IG9uSW50ZXJydXB0KCdTSUdURVJNJyk7CiAgY29uc3Qgb25Qcm9ncmVzc0Vycm9yID0gKCkgPT4geyByZXN1bHQucHJvZ3Jlc3NXcml0ZUZhaWxlZCA9IHRydWU7IHJlcXVlc3RTdG9wKCk7IH07CiAgY29uc3Qgd3JpdGVMb2cgPSBjaHVuayA9PiB7CiAgICBjb25zdCBieXRlcyA9IEJ1ZmZlci5pc0J1ZmZlcihjaHVuaykgPyBjaHVuayA6IEJ1ZmZlci5mcm9tKGNodW5rKTsKICAgIGNvbnN0IHJlbWFpbmluZyA9IExPR19MSU1JVCAtIGxvZ2dlZDsKICAgIGlmIChyZW1haW5pbmcgPiAwKSB7CiAgICAgIGNvbnN0IHNlbGVjdGVkID0gYnl0ZXMuc3ViYXJyYXkoMCwgcmVtYWluaW5nKTsKICAgICAgdHJ5IHsKICAgICAgICBsZXQgd3JpdHRlbiA9IDA7CiAgICAgICAgd2hpbGUgKHdyaXR0ZW4gPCBzZWxlY3RlZC5sZW5ndGgpIHdyaXR0ZW4gKz0gZnMud3JpdGVTeW5jKGxvZ0ZkLCBzZWxlY3RlZCwgd3JpdHRlbiwgc2VsZWN0ZWQubGVuZ3RoIC0gd3JpdHRlbik7CiAgICAgICAgbG9nZ2VkICs9IHNlbGVjdGVkLmxlbmd0aDsKICAgICAgfQogICAgICBjYXRjaCB7IHJlc3VsdC5sb2dXcml0ZUZhaWxlZCA9IHRydWU7IHJlcXVlc3RTdG9wKCk7IH0KICAgIH0KICAgIGlmIChieXRlcy5sZW5ndGggPiByZW1haW5pbmcpIHsgcmVzdWx0Lm91dHB1dExpbWl0RXhjZWVkZWQgPSB0cnVlOyByZXN1bHQubG9nTGltaXRFeGNlZWRlZCA9IHRydWU7IHJlcXVlc3RTdG9wKCk7IH0KICB9OwogIHRyeSB7CiAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHsKICAgICAgcHJvY2Vzcy5vbignU0lHSU5UJywgb25TaWdpbnQpOwogICAgICBwcm9jZXNzLm9uKCdTSUdURVJNJywgb25TaWd0ZXJtKTsKICAgICAgcHJvY2Vzcy5zdGRvdXQub24oJ2Vycm9yJywgb25Qcm9ncmVzc0Vycm9yKTsKICAgICAgdHJ5IHsKICAgICAgICBjaGlsZCA9IHNwYXduKHRvb2wubm9kZS5yZXNvbHZlZCwgYXJncywgeyBjd2Q6IHN0YWdlLCBlbnYsIHNoZWxsOiBmYWxzZSwgc3RkaW86IFsnaWdub3JlJywgJ3BpcGUnLCAncGlwZSddIH0pOwogICAgICB9IGNhdGNoIChlcnJvcikgewogICAgICAgIHJlc3VsdC5zcGF3bkVycm9yQ29kZSA9IC9eW0EtWjAtOV9dezEsNDh9JC8udGVzdChlcnJvci5jb2RlIHx8ICcnKSA/IGVycm9yLmNvZGUgOiAnVU5LTk9XTic7CiAgICAgICAgcmVzb2x2ZSgpOwogICAgICAgIHJldHVybjsKICAgICAgfQogICAgICBjaGlsZC5vbmNlKCdzcGF3bicsICgpID0+IHsgcmVzdWx0LnN0YXJ0ZWQgPSB0cnVlOyB9KTsKICAgICAgY2hpbGQuc3Rkb3V0Lm9uKCdkYXRhJywgd3JpdGVMb2cpOwogICAgICBjaGlsZC5zdGRlcnIub24oJ2RhdGEnLCB3cml0ZUxvZyk7CiAgICAgIGNoaWxkLnN0ZG91dC5vbignZXJyb3InLCAoKSA9PiB7IHJlc3VsdC5zdHJlYW1FcnJvciA9IHRydWU7IHJlcXVlc3RTdG9wKCk7IH0pOwogICAgICBjaGlsZC5zdGRlcnIub24oJ2Vycm9yJywgKCkgPT4geyByZXN1bHQuc3RyZWFtRXJyb3IgPSB0cnVlOyByZXF1ZXN0U3RvcCgpOyB9KTsKICAgICAgY2hpbGQub25jZSgnZXJyb3InLCBlcnJvciA9PiB7CiAgICAgICAgcmVzdWx0LnNwYXduRXJyb3JDb2RlID0gL15bQS1aMC05X117MSw0OH0kLy50ZXN0KGVycm9yLmNvZGUgfHwgJycpID8gZXJyb3IuY29kZSA6ICdVTktOT1dOJzsKICAgICAgfSk7CiAgICAgIGNoaWxkLm9uY2UoJ2Nsb3NlJywgKGNvZGUsIHNpZ25hbCkgPT4gewogICAgICAgIGNsb3NpbmcgPSB0cnVlOwogICAgICAgIHJlc3VsdC5leGl0Q29kZSA9IGNvZGU7CiAgICAgICAgcmVzdWx0LnNpZ25hbCA9IHNpZ25hbDsKICAgICAgICByZXNvbHZlKCk7CiAgICAgIH0pOwogICAgICB0aW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7IHJlc3VsdC50aW1lZE91dCA9IHRydWU7IHJlcXVlc3RTdG9wKCk7IH0sIFJVTl9USU1FT1VUKTsKICAgICAgaGVhcnRiZWF0ID0gc2V0SW50ZXJ2YWwoKCkgPT4gewogICAgICAgIGlmIChwcm9jZXNzLnN0ZG91dC5kZXN0cm95ZWQgfHwgIXByb2Nlc3Muc3Rkb3V0LndyaXRhYmxlKSB7IG9uUHJvZ3Jlc3NFcnJvcigpOyByZXR1cm47IH0KICAgICAgICB0cnkgeyBwcm9jZXNzLnN0ZG91dC53cml0ZShgTlBNX0NJX1BST0dSRVNTPVJVTk5JTkcgRUxBUFNFRF9TRUNPTkRTPSR7TWF0aC5mbG9vcigoRGF0ZS5ub3coKSAtIHN0YXJ0ZWRBdCkgLyAxMDAwKX0gTE9HX0JZVEVTPSR7bG9nZ2VkfVxuYCk7IH0KICAgICAgICBjYXRjaCB7IG9uUHJvZ3Jlc3NFcnJvcigpOyB9CiAgICAgIH0sIDMwMDAwKTsKICAgIH0pOwogIH0gY2F0Y2ggKGVycm9yKSB7CiAgICBlcnJvci5wcm9jZXNzUmVzdWx0ID0gcmVzdWx0OwogICAgdGhyb3cgZXJyb3I7CiAgfSBmaW5hbGx5IHsKICAgIGNsb3NpbmcgPSB0cnVlOwogICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpOwogICAgY2xlYXJUaW1lb3V0KGZvcmNlS2lsbCk7CiAgICBjbGVhckludGVydmFsKGhlYXJ0YmVhdCk7CiAgICBwcm9jZXNzLnJlbW92ZUxpc3RlbmVyKCdTSUdJTlQnLCBvblNpZ2ludCk7CiAgICBwcm9jZXNzLnJlbW92ZUxpc3RlbmVyKCdTSUdURVJNJywgb25TaWd0ZXJtKTsKICAgIHByb2Nlc3Muc3Rkb3V0LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uUHJvZ3Jlc3NFcnJvcik7CiAgICB0cnkgeyBmcy5jbG9zZVN5bmMobG9nRmQpOyB9IGNhdGNoIChlcnJvcikgeyBlcnJvci5wcm9jZXNzUmVzdWx0ID0gcmVzdWx0OyB0aHJvdyBlcnJvcjsgfQogIH0KICB0cnkgewogIHJlc3VsdC5kdXJhdGlvbk1zID0gRGF0ZS5ub3coKSAtIHN0YXJ0ZWRBdDsKICByZXN1bHQubG9nSWRlbnRpdHkgPSByZWd1bGFySWRlbnRpdHkobG9nUGF0aCwgTE9HX0xJTUlUKTsKICBjb25zdCBsb2cgPSBmcy5yZWFkRmlsZVN5bmMobG9nUGF0aCwgJ3V0ZjgnKTsKICByZXN1bHQuZXJyb3JDb2RlcyA9IFsuLi5uZXcgU2V0KFsuLi5sb2cubWF0Y2hBbGwoLyg/Om5wbVxzKyg/OmVycm9yfEVSUiEpWyBcdF0rY29kZVsgXHRdKykoW0EtWl1bQS1aMC05X10rKS9nKV0KICAgIC5tYXAobWF0Y2ggPT4gbWF0Y2hbMV0pLmZpbHRlcihjb2RlID0+IE5QTV9DT0RFUy5oYXMoY29kZSkpKV0uc29ydCgpOwogIHJlc3VsdC50b29sSWRlbnRpdGllc1ByZXNlcnZlZCA9IHRvb2xzUHJlc2VydmVkKHRvb2wpOwogIHJlc3VsdC5zdGF0dXMgPSByZXN1bHQuc3RhcnRlZCAmJiByZXN1bHQuZXhpdENvZGUgPT09IDAgJiYgIXJlc3VsdC5zaWduYWwgJiYgIXJlc3VsdC50aW1lZE91dCAmJgogICAgIXJlc3VsdC5pbnRlcnJ1cHRlZEJ5ICYmICFyZXN1bHQub3V0cHV0TGltaXRFeGNlZWRlZCAmJiAhcmVzdWx0LmxvZ1dyaXRlRmFpbGVkICYmICFyZXN1bHQucHJvZ3Jlc3NXcml0ZUZhaWxlZCAmJiAhcmVzdWx0LnN0cmVhbUVycm9yICYmICFyZXN1bHQuY2hpbGRTaWduYWxGYWlsZWQgJiYgIXJlc3VsdC5zcGF3bkVycm9yQ29kZSAmJiByZXN1bHQudG9vbElkZW50aXRpZXNQcmVzZXJ2ZWQKICAgID8gJ05QTV9DSV9QUk9DRVNTX1BBU1NfUEVORElOR19UUkVFX1ZFUklGSUNBVElPTicgOiAnTlBNX0NJX1BST0NFU1NfRkFJTEVEJzsKICByZXN1bHQuc2NvcGUgPSAnTlBNX1BST0NFU1NfT05MWV9OT1RfTkFUSVZFX1RPT0xfQlVJTERfQVBQTElDQVRJT05fT1JfUkVMRUFTRV9RVUFMSUZJQ0FUSU9OJzsKICByZXR1cm4gcmVzdWx0OwogIH0gY2F0Y2ggKGVycm9yKSB7IGVycm9yLnByb2Nlc3NSZXN1bHQgPSByZXN1bHQ7IHRocm93IGVycm9yOyB9Cn0K';
const RUNNER_SHA = '6f28f812900febfc749e1779e73c23203cee089f1c0c160e61a794f450214c4f';
const PRIOR_REPORT = '/tmp/mmhb-prompt-assets-r15-dlss23';
const EXPECTED_CANDIDATE_MANIFEST = '0a7b88ff831e4635b735f038a3538fba4069c21558915b84bd5bf241622f690f';
const EXPECTED_CANDIDATE_FILES = 625;
const EXPECTED_CANDIDATE_BYTES = 40501647;
const selectedNames = ['@vitejs/plugin-react','resend','vite','esbuild','pg','bcrypt','argon2'];
let reportDir,stageDir,before,baseline,priorTree,tool,policyModule,runnerModule,failure;
let phase='PREFLIGHT',stageInputsReady=false;
const observed=new Map();
const result={project:'MyMentalHealthBuddy',status:'LOCKED_DEPENDENCIES_FAILED',releaseReady:false,
  workspaceDependencyAlignment:'UNCHANGED_PENDING',privateDependencyAlignment:'NOT_STARTED',
  applicationRuntime:'UNPROVEN',deployedArtifact:'UNPROVEN',npmProcess:{attempted:false,started:false}};
function save(name,value){fs.writeFileSync(path.join(reportDir,name),JSON.stringify(value,null,2),{flag:'wx',mode:0o600});}
function observe(rel,expected=null){
  const id=identity(path.join(ROOT,rel),rel.startsWith('node_modules/'));
  observed.set(rel,id);
  if(expected)gate(id.sha256===expected,'R15_SOURCE_OR_SELECTED_INPUT_DRIFT',{file:label(rel)});
  return id;
}
function errorInfo(error,at){
  const code=error.gate||error.code;
  const safeCode=typeof code==='string'&&/^[A-Z][A-Z0-9_]{0,100}$/.test(code)?code:'UNEXPECTED_INSTALL_DRIVER_FAILURE';
  const detail={};
  if(error.detail&&typeof error.detail==='object')for(const key of ['reason','file','operation','code']){
    if(typeof error.detail[key]==='string')detail[key]=label(error.detail[key]);
  }
  if(typeof error.file==='string')detail.file=label(error.file);
  if(typeof error.path==='string'){
    const full=path.resolve(ROOT,error.path);
    const base=[reportDir,PRIOR_REPORT].find(x=>x&&(full===x||inside(x,full)));
    detail.file=base?'REPORT/'+label(path.relative(base,full)||'ROOT'):inside(ROOT,full)?label(path.relative(ROOT,full)):label(error.path);
  }
  return {gate:safeCode,phase:at,detail};
}
function selectedWorkspace(){
  return selectedNames.map(name=>{
    const rel='node_modules/'+name+'/package.json',id=observe(rel);
    const obj=id.state==='FILE'?readJSON(path.join(ROOT,rel),1024*1024):null;
    const value=obj?.version;
    return {name,state:id.state,version:typeof value==='string'&&/^[0-9A-Za-z.+-]{1,100}$/.test(value)?value:null,
      identity:id};
  });
}
function verifyCurrent(suffix){
  const problems=[];
  if(before)try{
    const after=snapshot(); save('git-'+suffix+'.json',after);
    result.currentPreservation=snapshotDifference(before,after);
    if(result.currentPreservation.components.length)problems.push({gate:'GIT_OR_WORKTREE_NOT_PRESERVED',phase:suffix});
  }catch(error){problems.push(errorInfo(error,suffix));}
  for(const [rel,prior] of observed)try{
    gate(JSON.stringify(identity(path.join(ROOT,rel),rel.startsWith('node_modules/')))===JSON.stringify(prior),
      'OBSERVED_WORKSPACE_INPUT_CHANGED',{file:label(rel)});
  }catch(error){problems.push(errorInfo(error,suffix));}
  for(const entry of retainedFiles.values())try{
    gate(JSON.stringify(artifactIdentity(entry.base,entry.rel))===JSON.stringify(entry.id),
      'RETAINED_R15_REPORT_CHANGED',{file:entry.rel});
  }catch(error){problems.push(errorInfo(error,suffix));}
  if(priorTree)try{sameTree(artifactTree(path.join(PRIOR_REPORT,'candidate')),priorTree,'R15_CANDIDATE_CHANGED');}
  catch(error){problems.push(errorInfo(error,suffix));}
  if(tool)try{
    gate(JSON.stringify(runnerModule.discoverNpm(process.env.PATH||'',process.execPath))===JSON.stringify(tool),
      'NPM_TOOL_IDENTITY_CHANGED');
  }catch(error){problems.push(errorInfo(error,suffix));}
  if(stageInputsReady)try{checkStageInputs();}catch(error){problems.push(errorInfo(error,suffix));}
  result.preservationScope={git:!!before,pins:!!baseline,promptAssets:22===Object.keys(ASSET_PINS).filter(x=>observed.has(x)).length,
    retainedCandidate:!!priorTree,npmTool:!!tool,ignoredWorkspaceDependencies:'SELECTED_IDENTITIES_ONLY'};
  if(problems.length){result.preservationFailures=problems;throw Object.assign(new Error('PRESERVATION_FAILED'),{gate:'PRESERVATION_FAILED'});}
  result.preservation=before&&baseline&&priorTree&&tool?'OBSERVED_WORKSPACE_R15_AND_NPM_TOOL_PRESERVED':'PARTIAL_OBSERVATIONS_ONLY';
}
function checkStageInputs(){
  for(const file of ['package.json','package-lock.json'])gate(artifactIdentity(stageDir,file).sha256===PINS[file],
    'STAGED_MANIFEST_CHANGED',{file});
}
try{
  gate(ROOT===EXPECTED_ROOT,'WORKSPACE_IDENTITY');
  gate(process.version===EXPECTED_NODE&&process.platform==='linux'&&process.arch==='x64','NODE_PLATFORM_IDENTITY');
  gate(fs.realpathSync('/tmp')==='/tmp','TEMP_DIRECTORY_BOUNDARY');
  process.umask(0o077);
  reportDir=fs.mkdtempSync('/tmp/mmhb-locked-dependencies-r16-'); fs.chmodSync(reportDir,0o700);
  console.log('COMMAND_ID=MMHB-LOCKED-DEPENDENCIES-R16');console.log('UTC='+new Date().toISOString());
  console.log('ISSUE_ID=LOCKED-DEPENDENCY-RECONSTRUCTION-001');console.log('REPORT_DIRECTORY='+reportDir);
  const helperSources={policy:Buffer.from(POLICY_B64,'base64'),runner:Buffer.from(RUNNER_B64,'base64')};
  gate(hash(helperSources.policy)===POLICY_SHA&&hash(helperSources.runner)===RUNNER_SHA,'EMBEDDED_HELPER_IDENTITY');
  for(const [name,raw] of Object.entries(helperSources))fs.writeFileSync(path.join(reportDir,name+'-r16.mjs'),raw,{flag:'wx',mode:0o600});
  policyModule=await import('data:text/javascript;base64,'+POLICY_B64);
  runnerModule=await import('data:text/javascript;base64,'+RUNNER_B64);
  phase='CURRENT_R15_BASELINE';
  before=snapshot();save('git-before.json',before);
  gate(before.head===EXPECTED_HEAD&&before.branch==='integration','GIT_BASELINE');
  baseline=checkPins();for(const [rel,id] of Object.entries(baseline))observed.set(rel,id);
  for(const [rel,expected] of Object.entries(ASSET_PINS))observe(rel,expected);
  result.workspacePackages=selectedWorkspace();
  const evidence=retainedJSON(PRIOR_REPORT,'prompt-asset-repair-evidence.json');
  gate(evidence.project==='MyMentalHealthBuddy'&&evidence.status==='PROMPT_ASSETS_REPAIRED_AND_LOAD_PASS_NOT_RELEASE'
    &&evidence.preservation==='EXPECTED_SOURCE_CHANGES_AND_R13_PRESERVED','R15_EVIDENCE_STATUS');
  const manifest=retainedJSON(PRIOR_REPORT,'candidate-manifest.json');
  gate(hash(JSON.stringify(manifest))===EXPECTED_CANDIDATE_MANIFEST,'R15_MANIFEST_IDENTITY');
  gate(evidence.candidateManifestSha256===EXPECTED_CANDIDATE_MANIFEST,'R15_EVIDENCE_MANIFEST');
  priorTree=artifactTree(path.join(PRIOR_REPORT,'candidate'));matchTree(priorTree,manifest.rows,'R15_CANDIDATE_IDENTITY');
  gate(priorTree.rows.length===EXPECTED_CANDIDATE_FILES&&priorTree.bytes===EXPECTED_CANDIDATE_BYTES,'R15_CANDIDATE_SIZE');
  save('r15-candidate-before.json',priorTree);save('workspace-inputs-before.json',Object.fromEntries(observed));
  console.log('GATE=CURRENT_SOURCE_AND_R15_CANDIDATE RESULT=PASS');
  phase='LOCK_AND_NPM_PREFLIGHT';
  const packageBytes=fs.readFileSync(path.join(ROOT,'package.json'));
  const lockBytes=fs.readFileSync(path.join(ROOT,'package-lock.json'));
  gate(hash(packageBytes)===PINS['package.json']&&hash(lockBytes)===PINS['package-lock.json'],'PACKAGE_COPY_SOURCE_DRIFT');
  const pkg=JSON.parse(packageBytes),lock=JSON.parse(lockBytes);
  const policy=policyModule.validateLock(pkg,lock);save('lock-policy.json',policy);
  result.lockPolicy={status:policy.status,packageCount:policy.packageCount,selectedLocked:policy.selectedLocked,optionalCount:policy.optionalCount,platformExcludedBundleDeclarations:policy.platformExcludedBundleDeclarations};
  tool=runnerModule.discoverNpm(process.env.PATH||'',process.execPath);save('npm-tool-before.json',tool);
  result.tool=tool;
  stageDir=path.join(reportDir,'stage');fs.mkdirSync(stageDir,{mode:0o700});result.stageDirectory=stageDir;
  fs.writeFileSync(path.join(stageDir,'package.json'),packageBytes,{flag:'wx',mode:0o600});
  fs.writeFileSync(path.join(stageDir,'package-lock.json'),lockBytes,{flag:'wx',mode:0o600});
  checkStageInputs();stageInputsReady=true;save('install-inputs.json',{project:'MyMentalHealthBuddy',stageDirectory:stageDir,
    packageSha256:hash(packageBytes),lockSha256:hash(lockBytes),policySha256:POLICY_SHA,runnerSha256:RUNNER_SHA});
  verifyCurrent('before-install');
  console.log('GATE=LOCK_AND_PRIVATE_INSTALL_CONTRACT RESULT=PASS');
  phase='PRIVATE_NPM_CI';
  result.npmProcess={attempted:true,started:false};result.privateDependencyAlignment='INSTALL_ATTEMPTED_UNQUALIFIED';
  const npmResult=await runnerModule.runNpm(tool,stageDir,reportDir);
  result.npmProcess=npmResult;save('npm-process.json',npmResult);
  gate(npmResult.status==='NPM_CI_PROCESS_PASS_PENDING_TREE_VERIFICATION','PRIVATE_NPM_CI_FAILED');
  console.log('GATE=PRIVATE_NPM_CI RESULT=PASS');
  phase='INSTALLED_LOCK_VERIFICATION';result.privateDependencyAlignment='INSTALLED_PENDING_VERIFICATION';checkStageInputs();
  const installed=policyModule.inspectInstalled(stageDir,lock);gate(installed.status==='PRIVATE_LOCKED_DEPENDENCIES_INSPECTED','INSTALLED_LOCK_VERIFICATION_FAILED');save('installed-dependencies.json',installed);
  const {fileManifest,installed:allPackages,absentOptional,...summary}=installed;
  result.installed={...summary,absentOptionalCount:absentOptional.length,absentOptionalDisplayed:absentOptional.slice(0,12),
    selectedRuntimeFiles:fileManifest.filter(x=>['node_modules/resend/dist/index.mjs','node_modules/resend/dist/index.cjs','node_modules/pg/lib/native/client.js','node_modules/@vitejs/plugin-react/package.json','node_modules/esbuild/bin/esbuild'].includes(x.file))};
  result.privateDependencyAlignment='LOCKED_STAGE_METADATA_PASS';
  result.stageDirectory=stageDir;
  result.status='LOCKED_DEPENDENCY_STAGE_PASS_SCRIPTS_DISABLED_NOT_RELEASE';
  console.log('GATE=INSTALLED_LOCKED_DEPENDENCIES RESULT=PASS');
}catch(error){if(error.processResult)result.npmProcess=error.processResult;failure=errorInfo(error,phase);}
finally{
  if(reportDir)try{verifyCurrent('final');console.log('GATE=OBSERVED_WORKSPACE_AND_R15_PRESERVATION RESULT='+ (result.preservation==='OBSERVED_WORKSPACE_R15_AND_NPM_TOOL_PRESERVED'?'PASS':'PARTIAL'));}
  catch(error){failure={...errorInfo(error,'FINAL_PRESERVATION'),previousFailure:failure};result.preservation='FAILED';}
  if(failure)result.status='LOCKED_DEPENDENCIES_FAILED';
  result.failure=failure;
  result.limitations=[
    'This stage contains dependencies and package manifests only; no app source or candidate is rebuilt.',
    'The workspace still uses its original dependencies; R15 retains its older build-tool versions.',
    'npm installation executes the existing npm CLI and uses the network. Dependency lifecycle scripts are disabled.',
    'Registry URL validation and a minimal environment are not an OS filesystem/network sandbox.',
    'Archive integrity is checked by npm against the lockfile; no independent publisher/provenance or vulnerability audit is claimed.',
    'Absent optional packages are reported, not proven unnecessary. Native and build-tool readiness require subsequent tests.',
    'Before/after observations do not lock editors or cover every ignored workspace dependency.',
    'This does not qualify application, browser, database, AI safety, backup/restore or deployed identity.'
  ];
  result.evidenceWrite=reportDir?'SAVED':'REPORT_NOT_CREATED';
  if(reportDir)try{save('locked-dependencies-evidence.json',result);}
  catch(error){result.failure={...errorInfo(error,'EVIDENCE_WRITE'),previousFailure:failure};failure=result.failure;result.evidenceWrite='FAILED';result.status='LOCKED_DEPENDENCIES_FAILED';}
  if(failure)console.log('FAILED_GATE='+failure.gate);
  console.log(JSON.stringify(result,null,2));
  console.log('SOURCE_EDIT=0 WORKSPACE_PACKAGE_EDIT=0 WORKSPACE_PACKAGE_INSTALL=0 R15_CANDIDATE_MODIFIED=0');
  console.log('PRIVATE_NPM_INSTALL_ATTEMPTED='+(result.npmProcess.attempted?1:0)+' LIFECYCLE_SCRIPTS=DISABLED NETWORK_REQUEST_COUNT=NOT_MEASURED');
  console.log('BUILD=NOT_RUN APPLICATION_STARTED=0 AI_REQUEST=0 DATABASE_CONNECTION=0 DATABASE_WRITE=0');
  console.log('CREDENTIAL_CHANGE=0 GIT_STAGE=0 COMMIT=0 PUSH=0 DEPLOY=0');
  if(reportDir)console.log('REPORT_DIRECTORY='+reportDir);
  console.log('STATUS='+result.status);console.log('NEXT_ACTION=STOP_AND_RETURN_COMPLETE_OUTPUT');process.exitCode=failure?1:0;
}
