import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
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
// No npm, application-server startup or inherited child secrets; one reviewed loader child only.
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
    scope: 'CURRENT_R15_OBSERVATIONS_ONLY_NOT_HISTORICAL_RUNS' };
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

const PRIOR_REPORT = '/tmp/mmhb-release-assembly-r13-1kpDjX';
const R14_REPORT = '/tmp/mmhb-runtime-contract-r14-PQFMQy';
const EXPECTED_ASSEMBLY_MANIFEST = '1095b15223d1fa650535017c44c24ecc2a2018c018759026e3a29dbf42820dd2';
const EXPECTED_R14_REPORT = '228ac0a23404158a690a63eeb890cad3b2c8c9dc417033e8beea0ec32c4b5439';
const MODULE_FILE = 'server/lib/promptEngine.mjs';
const MODULE_SHA = 'fbbd43eaab399b029b5d976508da8f1e055e25d69fd2ee65551e23d102363170';
const REPAIR_POLICY = {
  "project": "MyMentalHealthBuddy",
  "policyId": "MMHB-R15-AI-ASSET-REPAIR-1",
  "scope": {
    "selectedAssets": 22,
    "changedAssets": 6,
    "unchangedAssets": 16,
    "registries": 2,
    "systems": 2,
    "promptModules": 18,
    "contentEvaluation": "PENDING",
    "releaseReady": false,
    "candidateOnly": false,
    "workspaceSourceMutation": true,
    "includesKernelAssets": false,
    "includesBlogAssets": false,
    "exactTextEdits": 11,
    "applicationOrder": "QUALIFY_PRIVATE_CANDIDATE_THEN_APPLY_SIX_EXACT_SOURCE_REPLACEMENTS_WITH_BACKUP_AND_ROLLBACK"
  },
  "basis": {
    "r14ReportedStatus": "RUNTIME_CONTRACT_EVIDENCE_COMPLETE",
    "r14Report": "/tmp/mmhb-runtime-contract-r14-PQFMQy",
    "r14EvidenceSha256": "228ac0a23404158a690a63eeb890cad3b2c8c9dc417033e8beea0ec32c4b5439",
    "allSelectedSourceAssetsReportedMatchingReviewedBytes": true,
    "selectedAssetsReportedPresentInR13Candidate": 0
  },
  "assets": [
    {
      "file": "ai/business/prompts/b01_offer_design.md",
      "expectedSha256": "213c90aed86e64685dd0ef9dfe2117736a441d019b419de9b9fd0c4df756eddc",
      "expectedBytes": 954,
      "resultSha256": "ec5d4e3eb2a13bda0bc593ec7eeb0872c35cfef9f24ed514b7ba632b43de8043",
      "resultBytes": 949,
      "action": "EXACT_TEXT_REPLACEMENT"
    },
    {
      "file": "ai/business/prompts/b02_funnel_map.md",
      "expectedSha256": "f9499b81f35d0a53c3442296f84fd6a70be7ca288a5a905a05f6340da05af1bf",
      "expectedBytes": 752,
      "resultSha256": "f9499b81f35d0a53c3442296f84fd6a70be7ca288a5a905a05f6340da05af1bf",
      "resultBytes": 752,
      "action": "COPY_UNCHANGED"
    },
    {
      "file": "ai/business/prompts/b03_content_factory.md",
      "expectedSha256": "d27b0be5cbf7509c13cb299e24d8cdc395bb2ead7bb4d4297baf3865152e8252",
      "expectedBytes": 781,
      "resultSha256": "d27b0be5cbf7509c13cb299e24d8cdc395bb2ead7bb4d4297baf3865152e8252",
      "resultBytes": 781,
      "action": "COPY_UNCHANGED"
    },
    {
      "file": "ai/business/prompts/b04_email_sequences.md",
      "expectedSha256": "77bb6e3b57aa7ef73f3a5703e5ba6df3137c1ce9b41b082cc2d7e5ef3d9a837f",
      "expectedBytes": 868,
      "resultSha256": "4723859fce5ae1d02fac1b27daa4b6fe47b57a8c3b1498e952419e43ab455907",
      "resultBytes": 970,
      "action": "EXACT_TEXT_REPLACEMENT"
    },
    {
      "file": "ai/business/prompts/b05_seo_briefs.md",
      "expectedSha256": "38cf749f52577272b841e0e4eb86bf53e9d8d27a71b4c4100dfc1db65746419f",
      "expectedBytes": 941,
      "resultSha256": "38cf749f52577272b841e0e4eb86bf53e9d8d27a71b4c4100dfc1db65746419f",
      "resultBytes": 941,
      "action": "COPY_UNCHANGED"
    },
    {
      "file": "ai/business/prompts/b06_competitive_scan.md",
      "expectedSha256": "d79db57c633b5e11141b1e5d13af0e13d478d4dab3307e82fdb5be7adc2ea709",
      "expectedBytes": 805,
      "resultSha256": "d79db57c633b5e11141b1e5d13af0e13d478d4dab3307e82fdb5be7adc2ea709",
      "resultBytes": 805,
      "action": "COPY_UNCHANGED"
    },
    {
      "file": "ai/business/prompts/b07_pricing_packaging.md",
      "expectedSha256": "f9e1be975bcbb611cb03d133650619d9356e9515452ee79ea04b0d0c49f51e57",
      "expectedBytes": 995,
      "resultSha256": "f9e1be975bcbb611cb03d133650619d9356e9515452ee79ea04b0d0c49f51e57",
      "resultBytes": 995,
      "action": "COPY_UNCHANGED"
    },
    {
      "file": "ai/business/prompts/b08_retention_loyalty.md",
      "expectedSha256": "ebafa326a0a5d552f9fc7316321b93119bc88df7e15b5aa87edff1f6a7feff7b",
      "expectedBytes": 820,
      "resultSha256": "ebafa326a0a5d552f9fc7316321b93119bc88df7e15b5aa87edff1f6a7feff7b",
      "resultBytes": 820,
      "action": "COPY_UNCHANGED"
    },
    {
      "file": "ai/business/prompts/b09_partnerships.md",
      "expectedSha256": "7b409622fdf473b8e2e01f5145503fe35578ba7ba0e7d1e05ca94d256a22433d",
      "expectedBytes": 1075,
      "resultSha256": "7b409622fdf473b8e2e01f5145503fe35578ba7ba0e7d1e05ca94d256a22433d",
      "resultBytes": 1075,
      "action": "COPY_UNCHANGED"
    },
    {
      "file": "ai/business/prompts/b10_ops_sops.md",
      "expectedSha256": "d03b38de531eb442d925c71a1f33b1ab82667887a4b9ab4d722ff4b6c2ffab8e",
      "expectedBytes": 1030,
      "resultSha256": "d03b38de531eb442d925c71a1f33b1ab82667887a4b9ab4d722ff4b6c2ffab8e",
      "resultBytes": 1030,
      "action": "COPY_UNCHANGED"
    },
    {
      "file": "ai/business/registry.json",
      "expectedSha256": "d90a0981f3b9dab33c80da4923aa6abe4e6503762740193a78a8134081c5663b",
      "expectedBytes": 848,
      "resultSha256": "d90a0981f3b9dab33c80da4923aa6abe4e6503762740193a78a8134081c5663b",
      "resultBytes": 848,
      "action": "COPY_UNCHANGED"
    },
    {
      "file": "ai/business/system.md",
      "expectedSha256": "400428b0164409e84c048e29447a4f6b7cf484729efb01dabb6b31fba36a5da7",
      "expectedBytes": 925,
      "resultSha256": "3c98b23bfb28ae5d1aa41b6693aea2e3d2db184c51d4b428badac5d415c04baf",
      "resultBytes": 1011,
      "action": "EXACT_TEXT_REPLACEMENT"
    },
    {
      "file": "ai/healing/prompts/h01_intake.md",
      "expectedSha256": "6bdf4ea38534d527bc4fd84ecaa8cfb004da1de967ba70cb2885a3ce0ccadaa1",
      "expectedBytes": 861,
      "resultSha256": "897ee547b4cb3e416dfa342fd4e0b0873f484b490f044f3e6b0c5953451dadec",
      "resultBytes": 966,
      "action": "EXACT_TEXT_REPLACEMENT"
    },
    {
      "file": "ai/healing/prompts/h02_journal_reflect.md",
      "expectedSha256": "f5f4872d9447030b1b26d054894b3650e9bdb2c6c30ff83e0e41fa37a1778902",
      "expectedBytes": 426,
      "resultSha256": "f5f4872d9447030b1b26d054894b3650e9bdb2c6c30ff83e0e41fa37a1778902",
      "resultBytes": 426,
      "action": "COPY_UNCHANGED"
    },
    {
      "file": "ai/healing/prompts/h03_cbt_reframe.md",
      "expectedSha256": "44062bd3e621d7abf7d32b77c01d2f70287a699bb1a913686b5d4c35e01b338d",
      "expectedBytes": 1033,
      "resultSha256": "44062bd3e621d7abf7d32b77c01d2f70287a699bb1a913686b5d4c35e01b338d",
      "resultBytes": 1033,
      "action": "COPY_UNCHANGED"
    },
    {
      "file": "ai/healing/prompts/h04_act_values.md",
      "expectedSha256": "b5ad3efc7403874112502dde7f01b5eb8e9aaf21de93e499036ceafb77ba7f5b",
      "expectedBytes": 1095,
      "resultSha256": "b5ad3efc7403874112502dde7f01b5eb8e9aaf21de93e499036ceafb77ba7f5b",
      "resultBytes": 1095,
      "action": "COPY_UNCHANGED"
    },
    {
      "file": "ai/healing/prompts/h05_breathing_grounding.md",
      "expectedSha256": "0488004edba218e43fa5ecf6aea53df3d98a08838633bf579033f01b36ea4e56",
      "expectedBytes": 1105,
      "resultSha256": "0488004edba218e43fa5ecf6aea53df3d98a08838633bf579033f01b36ea4e56",
      "resultBytes": 1105,
      "action": "COPY_UNCHANGED"
    },
    {
      "file": "ai/healing/prompts/h06_sleep_reset.md",
      "expectedSha256": "578769ff00486a72436d68789c403a8f2e31405bb9cc8242249992981104edd2",
      "expectedBytes": 1068,
      "resultSha256": "578769ff00486a72436d68789c403a8f2e31405bb9cc8242249992981104edd2",
      "resultBytes": 1068,
      "action": "COPY_UNCHANGED"
    },
    {
      "file": "ai/healing/prompts/h07_conflict_script.md",
      "expectedSha256": "2aaaa5d222baeb746d452514af1ca17e0417fd013cb45dd1d90891e9f73e63f4",
      "expectedBytes": 1267,
      "resultSha256": "2aaaa5d222baeb746d452514af1ca17e0417fd013cb45dd1d90891e9f73e63f4",
      "resultBytes": 1267,
      "action": "COPY_UNCHANGED"
    },
    {
      "file": "ai/healing/prompts/h08_safety_check.md",
      "expectedSha256": "99292ed3282e9bb35a564f1341b5d59511e7406a90d6fd113129671a12241c30",
      "expectedBytes": 1746,
      "resultSha256": "bbafc7827f4ebad1fe975c5c36039a2e1d3a3289fb3a4ead18bd05fa9e57603d",
      "resultBytes": 1797,
      "action": "EXACT_TEXT_REPLACEMENT"
    },
    {
      "file": "ai/healing/registry.json",
      "expectedSha256": "be846525e46ce27d2f79f7f3baaeca990f8de91433cff89368da71bcc07178ce",
      "expectedBytes": 746,
      "resultSha256": "be846525e46ce27d2f79f7f3baaeca990f8de91433cff89368da71bcc07178ce",
      "resultBytes": 746,
      "action": "COPY_UNCHANGED"
    },
    {
      "file": "ai/healing/system.md",
      "expectedSha256": "7c7b9649f650bbfa75259b5f6a0ed7015680ac94fd8912f1dd01ae78ae57ed65",
      "expectedBytes": 1418,
      "resultSha256": "185686a9a02290ada767a6ca970e336b74479ab109374faf6f852ee6b29f209f",
      "resultBytes": 1526,
      "action": "EXACT_TEXT_REPLACEMENT"
    }
  ],
  "replacements": [
    {
      "file": "ai/business/prompts/b01_offer_design.md",
      "expectedSha256": "213c90aed86e64685dd0ef9dfe2117736a441d019b419de9b9fd0c4df756eddc",
      "expectedBytes": 954,
      "resultSha256": "ec5d4e3eb2a13bda0bc593ec7eeb0872c35cfef9f24ed514b7ba632b43de8043",
      "resultBytes": 949,
      "action": "EXACT_TEXT_REPLACEMENT",
      "oldText": "# b01 — Offer Design\n\n## Purpose\nDesign or refine a single offer (product, plan, service) for The Genuine Love Project that is mission-aligned, clearly priced, and ethically positioned.\n\n## Output Contract\n1. **Offer Name** (1 line, plain English).\n2. **One-Sentence Promise** (who it's for + the transformation, no hype).\n3. **What's Included** (3–7 concrete bullets — features, not adjectives).\n4. **Price + Cadence** (one-time, monthly, annual).\n5. **Mission Alignment Check** (2 bullets):\n   - How this serves the user's healing first.\n   - What we are explicitly NOT promising (no diagnosis, no cure).\n6. **Success Metric** (1 line): the ONE measurable signal that this offer is working (retention %, completion rate, etc.).\n\n## Hard Rules\n- No fake scarcity, no pressure tactics, no \"limited spots\" unless literally true.\n- No claims of medical or therapeutic outcome.\n- Price must reflect value delivered, not what the market will tolerate.\n",
      "newText": "# b01 — Offer Design\n\n## Purpose\nDesign or refine a single offer (product, plan, service) for MyMentalHealthBuddy that is mission-aligned, clearly priced, and ethically positioned.\n\n## Output Contract\n1. **Offer Name** (1 line, plain English).\n2. **One-Sentence Promise** (who it's for + the transformation, no hype).\n3. **What's Included** (3–7 concrete bullets — features, not adjectives).\n4. **Price + Cadence** (one-time, monthly, annual).\n5. **Mission Alignment Check** (2 bullets):\n   - How this serves the user's healing first.\n   - What we are explicitly NOT promising (no diagnosis, no cure).\n6. **Success Metric** (1 line): the ONE measurable signal that this offer is working (retention %, completion rate, etc.).\n\n## Hard Rules\n- No fake scarcity, no pressure tactics, no \"limited spots\" unless literally true.\n- No claims of medical or therapeutic outcome.\n- Price must reflect value delivered, not what the market will tolerate.\n",
      "changes": [
        {
          "old": "The Genuine Love Project",
          "new": "MyMentalHealthBuddy",
          "count": 1
        }
      ]
    },
    {
      "file": "ai/business/prompts/b04_email_sequences.md",
      "expectedSha256": "77bb6e3b57aa7ef73f3a5703e5ba6df3137c1ce9b41b082cc2d7e5ef3d9a837f",
      "expectedBytes": 868,
      "resultSha256": "4723859fce5ae1d02fac1b27daa4b6fe47b57a8c3b1498e952419e43ab455907",
      "resultBytes": 970,
      "action": "EXACT_TEXT_REPLACEMENT",
      "oldText": "# b04 — Email Sequences\n\n## Purpose\nDraft a multi-email lifecycle sequence (welcome, nurture, re-engagement, win-back) that respects the subscriber's time and emotional state.\n\n## Output Contract\n1. **Sequence Name + Goal** (1 line each).\n2. **Audience Segment** (who triggers this, who is excluded).\n3. **Cadence Map** (table):\n   | # | Day | Subject Line | Preview | One-Line Body Goal | CTA |\n4. **Tone Notes** (3 bullets): voice, length, signature.\n5. **Suppression Rules** (3 bullets): when to pause sending (crisis flag, low engagement, recent unsubscribe).\n6. **Success Metric** (1 line): open %, click %, reply %, or unsubscribe rate threshold.\n\n## Hard Rules\n- Maximum 1 CTA per email.\n- Every email has a one-click unsubscribe.\n- No dark patterns (fake re-subscribe links, hidden preferences).\n- Subject lines must be honest — no \"RE:\" or \"FWD:\" tricks.\n",
      "newText": "# b04 — Email Sequences\n\n## Purpose\nDraft a multi-email lifecycle sequence (welcome, nurture, re-engagement, win-back) that respects the subscriber's time and emotional state.\n\n## Output Contract\n1. **Sequence Name + Goal** (1 line each).\n2. **Audience Segment** (who triggers this, who is excluded).\n3. **Cadence Map** (table):\n   | # | Day | Subject Line | Preview | One-Line Body Goal | CTA |\n4. **Tone Notes** (3 bullets): voice, length, signature.\n5. **Suppression Rules** (3 bullets): when to pause sending based only on consent, communication preferences, unsubscribe status, or bounces; do not use crisis flags, health information, or inferred mental state.\n6. **Success Metric** (1 line): open %, click %, reply %, or unsubscribe rate threshold.\n\n## Hard Rules\n- Maximum 1 CTA per email.\n- Every email has a one-click unsubscribe.\n- No dark patterns (fake re-subscribe links, hidden preferences).\n- Subject lines must be honest — no \"RE:\" or \"FWD:\" tricks.\n",
      "changes": [
        {
          "old": "5. **Suppression Rules** (3 bullets): when to pause sending (crisis flag, low engagement, recent unsubscribe).",
          "new": "5. **Suppression Rules** (3 bullets): when to pause sending based only on consent, communication preferences, unsubscribe status, or bounces; do not use crisis flags, health information, or inferred mental state.",
          "count": 1
        }
      ]
    },
    {
      "file": "ai/business/system.md",
      "expectedSha256": "400428b0164409e84c048e29447a4f6b7cf484729efb01dabb6b31fba36a5da7",
      "expectedBytes": 925,
      "resultSha256": "3c98b23bfb28ae5d1aa41b6693aea2e3d2db184c51d4b428badac5d415c04baf",
      "resultBytes": 1011,
      "action": "EXACT_TEXT_REPLACEMENT",
      "oldText": "# Business Engine — System Prompt\n\nYou are BusinessOpsOS for The Genuine Love Project — a strategic growth architect.\n\n## Scope\nPlatform monetization, content strategy, SEO, marketing, partnerships,\noffer design, pricing, funnels, email sequences, competitive intelligence,\nretention systems, and operational SOPs.\n\n## Hard Rules\n- You have ZERO access to subscriber data, journals, crisis logs, or therapy notes.\n- You do NOT generate healing prompts, therapy scripts, or user support content.\n- You do NOT use manipulative marketing tactics or create false urgency.\n- All outputs must be structured, deterministic, and implementation-ready.\n- All marketing must align with the healing mission — no exploitation of vulnerability.\n\n## Output Standard\nEvery output must follow the defined Output Contract for the active prompt module.\nStructure before prose. Specifics before generalities. Measurable outcomes required.\n",
      "newText": "# Business Engine — System Prompt\n\nYou are BusinessOpsOS for MyMentalHealthBuddy — a strategic growth architect.\n\n## Scope\nPlatform monetization, content strategy, SEO, marketing, partnerships,\noffer design, pricing, funnels, email sequences, competitive intelligence,\nretention systems, and operational SOPs.\n\n## Hard Rules\n- You do NOT request, use, or disclose sensitive subscriber data, including journals, crisis logs, or therapy notes. Do NOT infer technical access isolation from this prompt.\n- You do NOT generate healing prompts, therapy scripts, or user support content.\n- You do NOT use manipulative marketing tactics or create false urgency.\n- All outputs must use a consistent structure and be implementation-ready.\n- All marketing must align with the healing mission — no exploitation of vulnerability.\n\n## Output Standard\nEvery output must follow the defined Output Contract for the active prompt module.\nStructure before prose. Specifics before generalities. Measurable outcomes required.\n",
      "changes": [
        {
          "old": "The Genuine Love Project",
          "new": "MyMentalHealthBuddy",
          "count": 1
        },
        {
          "old": "- You have ZERO access to subscriber data, journals, crisis logs, or therapy notes.",
          "new": "- You do NOT request, use, or disclose sensitive subscriber data, including journals, crisis logs, or therapy notes. Do NOT infer technical access isolation from this prompt.",
          "count": 1
        },
        {
          "old": "- All outputs must be structured, deterministic, and implementation-ready.",
          "new": "- All outputs must use a consistent structure and be implementation-ready.",
          "count": 1
        }
      ]
    },
    {
      "file": "ai/healing/prompts/h01_intake.md",
      "expectedSha256": "6bdf4ea38534d527bc4fd84ecaa8cfb004da1de967ba70cb2885a3ce0ccadaa1",
      "expectedBytes": 861,
      "resultSha256": "897ee547b4cb3e416dfa342fd4e0b0873f484b490f044f3e6b0c5953451dadec",
      "resultBytes": 966,
      "action": "EXACT_TEXT_REPLACEMENT",
      "oldText": "# h01 — Intake & Welcome\n\n## Purpose\nGreet a brand-new visitor warmly. Establish psychological safety, set expectations, and invite them to share at their own pace.\n\n## Voice\nSoft, unhurried, consent-based. The person decides everything.\n\n## Output Contract\n1. **Welcome** (1–2 sentences): warm, no clinical language.\n2. **Expectations** (3 bullets):\n   - You are not a therapist or doctor.\n   - Nothing here is stored against them.\n   - They can stop, skip, or change topics anytime.\n3. **One Open Door**: ask ONE gentle question (e.g., \"If it feels right, would you like to share what brought you here today?\").\n4. **Crisis Reminder** (1 line): \"If you're ever in immediate distress, 988 is there for you 24/7.\"\n\n## Hard Rules\n- Never assume the user's emotional state.\n- Never ask for personal identifying information.\n- Do not stack multiple questions.\n",
      "newText": "# h01 — Intake & Welcome\n\n## Purpose\nGreet a brand-new visitor warmly. Establish psychological safety, set expectations, and invite them to share at their own pace.\n\n## Voice\nSoft, unhurried, consent-based. The person decides everything.\n\n## Output Contract\n1. **Welcome** (1–2 sentences): warm, no clinical language.\n2. **Expectations** (3 bullets):\n   - You are not a therapist or doctor.\n   - Explain privacy, memory, and storage only from verified MyMentalHealthBuddy information; do not promise that nothing is stored.\n   - They can stop, skip, or change topics anytime.\n3. **One Open Door**: ask ONE gentle question (e.g., \"If it feels right, would you like to share what brought you here today?\").\n4. **Crisis Reminder** (1 line): \"If you're in the US and need crisis support, call or text 988, available 24/7.\"\n\n## Hard Rules\n- Never assume the user's emotional state.\n- Never ask for personal identifying information.\n- Do not stack multiple questions.\n",
      "changes": [
        {
          "old": "   - Nothing here is stored against them.",
          "new": "   - Explain privacy, memory, and storage only from verified MyMentalHealthBuddy information; do not promise that nothing is stored.",
          "count": 1
        },
        {
          "old": "4. **Crisis Reminder** (1 line): \"If you're ever in immediate distress, 988 is there for you 24/7.\"",
          "new": "4. **Crisis Reminder** (1 line): \"If you're in the US and need crisis support, call or text 988, available 24/7.\"",
          "count": 1
        }
      ]
    },
    {
      "file": "ai/healing/prompts/h08_safety_check.md",
      "expectedSha256": "99292ed3282e9bb35a564f1341b5d59511e7406a90d6fd113129671a12241c30",
      "expectedBytes": 1746,
      "resultSha256": "bbafc7827f4ebad1fe975c5c36039a2e1d3a3289fb3a4ead18bd05fa9e57603d",
      "resultBytes": 1797,
      "action": "EXACT_TEXT_REPLACEMENT",
      "oldText": "# h08 — Safety Check (Crisis Protocol)\n\n## Purpose\nABSOLUTE PRIORITY. The user has expressed thoughts of self-harm, suicide, or being in immediate danger. Respond with warmth, brevity, and resources — never probe, never delay.\n\n## Voice\nSoft. Slow. Human. No clinical distance. No platitudes.\n\n## Output Contract (this exact order, every time)\n1. **Reach Toward Them** (2–3 sentences): \"Thank you for telling me. I'm so glad you said something. You're not alone in this moment.\"\n2. **Resources First — always show these in the FIRST response**:\n   - **988 Suicide & Crisis Lifeline** — call or text **988** (US, 24/7)\n   - **Crisis Text Line** — text **HOME** to **741741** (US/Canada/UK/Ireland)\n   - **International**: https://findahelpline.com\n3. **One Human Connection** (1–2 sentences): \"If you can, please reach one person who knows you — a friend, family member, or anyone you trust. You don't have to explain everything. 'I'm not okay, can you stay with me?' is enough.\"\n4. **Stay With Them** (1 sentence): \"I'm right here. We can sit together for as long as you need.\"\n\n## Hard Rules — ZERO EXCEPTIONS\n- NEVER ask \"why\" or probe for details about the crisis.\n- NEVER offer techniques, exercises, or homework first.\n- NEVER imply they need to \"calm down\" or \"think positively.\"\n- NEVER skip the resources, even if the user dismisses them.\n- ALWAYS show 988 in the FIRST response.\n- If the user is a minor or in another country, mention findahelpline.com.\n- Keep the entire response under 150 words.\n\n## After Resources\nOnly after the resources are visible, you may gently invite them to keep talking — at THEIR pace.\n\"If it helps to keep talking, I'm here. If you'd rather just sit quietly together, that's okay too.\"\n",
      "newText": "# h08 — Safety Check (Crisis Protocol)\n\n## Purpose\nABSOLUTE PRIORITY. The user has expressed thoughts of self-harm, suicide, or being in immediate danger. Respond with warmth, brevity, and resources — never probe, never delay.\n\n## Voice\nSoft. Slow. Human. No clinical distance. No platitudes.\n\n## Output Contract (this exact order, every time)\n1. **Reach Toward Them** (2–3 sentences): \"Thank you for telling me. I'm so glad you said something. You're not alone in this moment.\"\n2. **Resources First — always show these in the FIRST response**:\n   - **988 Suicide & Crisis Lifeline** — call or text **988** (US, 24/7)\n   - **Crisis Text Line** — text **HOME** to **741741** (US)\n   - **International**: https://findahelpline.com\n3. **One Human Connection** (1–2 sentences): \"If you can, please reach one person who knows you — a friend, family member, or anyone you trust. You don't have to explain everything. 'I'm not okay, can you stay with me?' is enough.\"\n4. **Support Human Connection** (1 sentence): \"You deserve support from a person who can be with you; if you can, contact someone you trust or a crisis counselor now.\"\n\n## Hard Rules — ZERO EXCEPTIONS\n- NEVER ask \"why\" or probe for details about the crisis.\n- NEVER offer techniques, exercises, or homework first.\n- NEVER imply they need to \"calm down\" or \"think positively.\"\n- NEVER skip the resources, even if the user dismisses them.\n- ALWAYS show 988 in the FIRST response.\n- If the user is a minor or in another country, mention findahelpline.com.\n- Keep the entire response under 150 words.\n\n## After Resources\nOnly after the resources are visible, you may gently invite them to keep talking — at THEIR pace.\n\"If it helps to keep talking, I'm here. If you'd rather just sit quietly together, that's okay too.\"\n",
      "changes": [
        {
          "old": "   - **Crisis Text Line** — text **HOME** to **741741** (US/Canada/UK/Ireland)",
          "new": "   - **Crisis Text Line** — text **HOME** to **741741** (US)",
          "count": 1
        },
        {
          "old": "4. **Stay With Them** (1 sentence): \"I'm right here. We can sit together for as long as you need.\"",
          "new": "4. **Support Human Connection** (1 sentence): \"You deserve support from a person who can be with you; if you can, contact someone you trust or a crisis counselor now.\"",
          "count": 1
        }
      ]
    },
    {
      "file": "ai/healing/system.md",
      "expectedSha256": "7c7b9649f650bbfa75259b5f6a0ed7015680ac94fd8912f1dd01ae78ae57ed65",
      "expectedBytes": 1418,
      "resultSha256": "185686a9a02290ada767a6ca970e336b74479ab109374faf6f852ee6b29f209f",
      "resultBytes": 1526,
      "action": "EXACT_TEXT_REPLACEMENT",
      "oldText": "# Healing Engine — System Prompt\n\nYou are MyMentalHealthBuddy — a warm, evidence-informed reflection companion for The Genuine Love Project.\n\n## Tone\nEmpathetic, grounded, non-judgmental, trauma-informed, and non-clinical.\nSpeak with the warmth of a trusted friend and the wisdom of a coach.\n\n## Hard Rules\n- You do NOT diagnose mental illness.\n- You do NOT provide medical or psychiatric advice.\n- You do NOT discuss pricing, funnels, revenue, or business strategy.\n- You do NOT retain information between sessions.\n- You ALWAYS frame suggestions as possibilities, never prescriptions.\n- You ALWAYS use consent-based, calm language (\"if you'd like…\", \"you might explore…\").\n\n## Crisis Protocol\nIf ANY message contains signals of self-harm, suicidal ideation, or immediate danger:\n1. Respond warmly and immediately — do not probe or ask follow-up questions.\n2. Provide crisis resources in the first response, always:\n   - 988 Suicide and Crisis Lifeline: call or text 988\n   - Crisis Text Line: text HOME to 741741\n   - International: https://findahelpline.com\n3. Encourage the person to reach a trusted human immediately.\n4. Keep your response short, warm, and simple.\n\n## Frameworks\nUse CBT, ACT, mindfulness, somatic awareness, Motivational Interviewing,\nStrengths-Based reflection, and NLP-informed reframing where appropriate.\nAlways honor the user's autonomy — they are the expert on their own life.\n",
      "newText": "# Healing Engine — System Prompt\n\nYou are MyMentalHealthBuddy — a warm, evidence-informed reflection companion for MyMentalHealthBuddy.\n\n## Tone\nEmpathetic, grounded, non-judgmental, trauma-informed, and non-clinical.\nSpeak with the warmth of a trusted friend and the wisdom of a coach.\n\n## Hard Rules\n- You do NOT diagnose mental illness.\n- You do NOT provide medical or psychiatric advice.\n- You do NOT discuss pricing, funnels, revenue, or business strategy.\n- Describe privacy, memory, and data retention only from verified platform information. Do not make blanket promises that information is never stored or retained.\n- You ALWAYS frame suggestions as possibilities, never prescriptions.\n- You ALWAYS use consent-based, calm language (\"if you'd like…\", \"you might explore…\").\n\n## Crisis Protocol\nIf ANY message contains signals of self-harm, suicidal ideation, or immediate danger:\n1. Respond warmly and immediately — do not probe or ask follow-up questions.\n2. Provide crisis resources in the first response, always:\n   - 988 Suicide and Crisis Lifeline: call or text 988\n   - Crisis Text Line: text HOME to 741741\n   - International: https://findahelpline.com\n3. Encourage the person to reach a trusted human immediately.\n4. Keep your response short, warm, and simple.\n\n## Frameworks\nUse CBT, ACT, mindfulness, somatic awareness, Motivational Interviewing,\nStrengths-Based reflection, and NLP-informed reframing where appropriate.\nAlways honor the user's autonomy — they are the expert on their own life.\n",
      "changes": [
        {
          "old": "The Genuine Love Project",
          "new": "MyMentalHealthBuddy",
          "count": 1
        },
        {
          "old": "- You do NOT retain information between sessions.",
          "new": "- Describe privacy, memory, and data retention only from verified platform information. Do not make blanket promises that information is never stored or retained.",
          "count": 1
        }
      ]
    }
  ],
  "limitations": [
    "Exact asset identity, structural validation, and packaging do not establish application runtime behavior or publication readiness.",
    "Six assets have eleven bounded text edits for MMHB identity, verified privacy statements, business data boundaries, output structure, crisis resource geography, and truthful assistant availability.",
    "The healing system Crisis Protocol and Frameworks sections and h08 Hard Rules/After Resources sections remain byte-preserved and require clinical safety and evidence evaluation.",
    "The two registries and fourteen other assets are unchanged. Registry role labels and prompt instructions do not establish server authorization or technical data isolation.",
    "Other module-level concerns are recorded in r15-asset-content-review.md and remain pending before prompts serve users.",
    "No kernel, fallback blog, script, package, or application code is included by this asset policy.",
    "The source-application driver must first qualify the private candidate, retain exact original backups, reject changed source bytes, and restore completed source writes on a handled failure without overwriting unrelated concurrent changes.",
    "Deployment, provider behavior, runtime authorization, retention configuration, and safety evaluation remain unproven."
  ]
};
const LOADER_B64 = 'aW1wb3J0IGZzIGZyb20gJ25vZGU6ZnMnOwppbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnOwppbXBvcnQgeyBjcmVhdGVIYXNoIH0gZnJvbSAnbm9kZTpjcnlwdG8nOwoKLy8gRXhlY3V0ZXMgb25seSB0aGUgZXhhY3QgcmV2aWV3ZWQgcHJvbXB0RW5naW5lIG1vZHVsZSBhbmQgaXRzIHJlYWQtb25seSBleHBvcnRzLgovLyBUaGUgdmVyaWZpZWQgYnl0ZXMgYXJlIGltcG9ydGVkIHRocm91Z2ggYSBkYXRhIFVSTDogdGhlIGRpc2sgY29weSBjYW5ub3QgYmUKLy8gcmVwbGFjZWQgYmV0d2VlbiBpdHMgaGFzaCBjaGVjayBhbmQgTm9kZSdzIG1vZHVsZSBldmFsdWF0aW9uLgpjb25zdCBNT0RVTEVfU0hBMjU2ID0gJ2ZiYmQ0M2VhYWIzOTliMDI5YjVkOTc2NTA4ZGE4ZjFlMDU1ZTI1ZDY5ZmQyZWU2NTU1MWUyM2QxMDIzNjMxNzAnOwpjb25zdCBJRFMgPSB7CiAgaGVhbGluZzogWydoMDFfaW50YWtlJywgJ2gwMl9qb3VybmFsX3JlZmxlY3QnLCAnaDAzX2NidF9yZWZyYW1lJywgJ2gwNF9hY3RfdmFsdWVzJywgJ2gwNV9icmVhdGhpbmdfZ3JvdW5kaW5nJywgJ2gwNl9zbGVlcF9yZXNldCcsICdoMDdfY29uZmxpY3Rfc2NyaXB0JywgJ2gwOF9zYWZldHlfY2hlY2snXSwKICBidXNpbmVzczogWydiMDFfb2ZmZXJfZGVzaWduJywgJ2IwMl9mdW5uZWxfbWFwJywgJ2IwM19jb250ZW50X2ZhY3RvcnknLCAnYjA0X2VtYWlsX3NlcXVlbmNlcycsICdiMDVfc2VvX2JyaWVmcycsICdiMDZfY29tcGV0aXRpdmVfc2NhbicsICdiMDdfcHJpY2luZ19wYWNrYWdpbmcnLCAnYjA4X3JldGVudGlvbl9sb3lhbHR5JywgJ2IwOV9wYXJ0bmVyc2hpcHMnLCAnYjEwX29wc19zb3BzJ10sCn07CmNvbnN0IEVOR0lORVMgPSBPYmplY3Qua2V5cyhJRFMpOwpjb25zdCBBU1NFVF9QQVRIUyA9IEVOR0lORVMuZmxhdE1hcChlbmdpbmUgPT4gWwogIGBhaS8ke2VuZ2luZX0vcmVnaXN0cnkuanNvbmAsIGBhaS8ke2VuZ2luZX0vc3lzdGVtLm1kYCwKICAuLi5JRFNbZW5naW5lXS5tYXAoaWQgPT4gYGFpLyR7ZW5naW5lfS9wcm9tcHRzLyR7aWR9Lm1kYCksCl0pLnNvcnQoKTsKY29uc3QgaGFzaCA9IGJ5dGVzID0+IGNyZWF0ZUhhc2goJ3NoYTI1NicpLnVwZGF0ZShieXRlcykuZGlnZXN0KCdoZXgnKTsKY29uc3Qgc2FtZSA9IChhLCBiKSA9PiBKU09OLnN0cmluZ2lmeShhKSA9PT0gSlNPTi5zdHJpbmdpZnkoYik7CmZ1bmN0aW9uIGdhdGUob2ssIGNvZGUpIHsgaWYgKCFvaykgdGhyb3cgT2JqZWN0LmFzc2lnbihuZXcgRXJyb3IoY29kZSksIHsgZ2F0ZTogY29kZSB9KTsgfQpmdW5jdGlvbiByZWNvcmQodmFsdWUpIHsgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkodmFsdWUpOyB9CmZ1bmN0aW9uIGtleXNFeGFjdGx5KG9iaiwga2V5cykgeyByZXR1cm4gcmVjb3JkKG9iaikgJiYgc2FtZShPYmplY3Qua2V5cyhvYmopLnNvcnQoKSwgWy4uLmtleXNdLnNvcnQoKSk7IH0KZnVuY3Rpb24gY29udGFpbmVkKHJvb3QsIGZpbGUpIHsgY29uc3QgcmVsID0gcGF0aC5yZWxhdGl2ZShyb290LCBmaWxlKTsgcmV0dXJuIHJlbCAhPT0gJycgJiYgcmVsICE9PSAnLi4nICYmICFyZWwuc3RhcnRzV2l0aChgLi4ke3BhdGguc2VwfWApICYmICFwYXRoLmlzQWJzb2x1dGUocmVsKTsgfQpmdW5jdGlvbiBjaGVja2VkRmlsZShhYnNvbHV0ZVBhdGgsIG1heEJ5dGVzKSB7CiAgZ2F0ZSh0eXBlb2YgYWJzb2x1dGVQYXRoID09PSAnc3RyaW5nJyAmJiBwYXRoLmlzQWJzb2x1dGUoYWJzb2x1dGVQYXRoKSwgJ0lOUFVUX0FCU09MVVRFX1BBVEhfUkVRVUlSRUQnKTsKICBnYXRlKGFic29sdXRlUGF0aCA9PT0gcGF0aC5ub3JtYWxpemUoYWJzb2x1dGVQYXRoKSwgJ0lOUFVUX05PUk1BTElaRURfUEFUSF9SRVFVSVJFRCcpOwogIGxldCBjdXJyZW50ID0gcGF0aC5wYXJzZShhYnNvbHV0ZVBhdGgpLnJvb3Q7CiAgY29uc3QgcGFydHMgPSBhYnNvbHV0ZVBhdGguc2xpY2UoY3VycmVudC5sZW5ndGgpLnNwbGl0KHBhdGguc2VwKTsKICBmb3IgKGxldCBpID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgaSsrKSB7CiAgICBjdXJyZW50ID0gcGF0aC5qb2luKGN1cnJlbnQsIHBhcnRzW2ldKTsKICAgIGNvbnN0IGl0ZW0gPSBmcy5sc3RhdFN5bmMoY3VycmVudCk7CiAgICBnYXRlKCFpdGVtLmlzU3ltYm9saWNMaW5rKCksICdJTlBVVF9TWU1MSU5LJyk7CiAgICBnYXRlKGkgPT09IHBhcnRzLmxlbmd0aCAtIDEgPyBpdGVtLmlzRmlsZSgpIDogaXRlbS5pc0RpcmVjdG9yeSgpLCAnSU5QVVRfRklMRV9UWVBFJyk7CiAgfQogIGNvbnN0IGZkID0gZnMub3BlblN5bmMoYWJzb2x1dGVQYXRoLCBmcy5jb25zdGFudHMuT19SRE9OTFkgfCBmcy5jb25zdGFudHMuT19OT0ZPTExPVyk7CiAgdHJ5IHsKICAgIGNvbnN0IGJlZm9yZSA9IGZzLmZzdGF0U3luYyhmZCk7CiAgICBnYXRlKGJlZm9yZS5pc0ZpbGUoKSAmJiBiZWZvcmUuc2l6ZSA+IDAgJiYgYmVmb3JlLnNpemUgPD0gbWF4Qnl0ZXMsICdJTlBVVF9TSVpFJyk7CiAgICBjb25zdCBidWZmZXIgPSBCdWZmZXIuYWxsb2MobWF4Qnl0ZXMgKyAxKTsKICAgIGxldCB0b3RhbCA9IDA7CiAgICB3aGlsZSAodG90YWwgPCBidWZmZXIubGVuZ3RoKSB7CiAgICAgIGNvbnN0IGNvdW50ID0gZnMucmVhZFN5bmMoZmQsIGJ1ZmZlciwgdG90YWwsIGJ1ZmZlci5sZW5ndGggLSB0b3RhbCwgdG90YWwpOwogICAgICBpZiAoY291bnQgPT09IDApIGJyZWFrOwogICAgICB0b3RhbCArPSBjb3VudDsKICAgIH0KICAgIGdhdGUodG90YWwgPD0gbWF4Qnl0ZXMsICdJTlBVVF9TSVpFJyk7CiAgICBjb25zdCBieXRlcyA9IGJ1ZmZlci5zdWJhcnJheSgwLCB0b3RhbCk7CiAgICBjb25zdCBhZnRlciA9IGZzLmZzdGF0U3luYyhmZCk7CiAgICBnYXRlKGJ5dGVzLmxlbmd0aCA9PT0gYmVmb3JlLnNpemUgJiYgYmVmb3JlLnNpemUgPT09IGFmdGVyLnNpemUgJiYgYmVmb3JlLm10aW1lTXMgPT09IGFmdGVyLm10aW1lTXMgJiYgYmVmb3JlLmN0aW1lTXMgPT09IGFmdGVyLmN0aW1lTXMsICdJTlBVVF9DSEFOR0VEX0RVUklOR19SRUFEJyk7CiAgICByZXR1cm4geyBieXRlcywgaWRlbnRpdHk6IHsgc2hhMjU2OiBoYXNoKGJ5dGVzKSwgYnl0ZXM6IGJ5dGVzLmxlbmd0aCwgbW9kZTogYWZ0ZXIubW9kZSB9IH07CiAgfSBmaW5hbGx5IHsgZnMuY2xvc2VTeW5jKGZkKTsgfQp9CmZ1bmN0aW9uIGNoZWNrTWFuaWZlc3QodmFsdWUpIHsKICBnYXRlKGtleXNFeGFjdGx5KHZhbHVlLCBbJ3Byb2plY3QnLCAnc2NoZW1hVmVyc2lvbicsICdhc3NldHMnLCAnZW5naW5lcyddKSwgJ01BTklGRVNUX1NIQVBFJyk7CiAgZ2F0ZSh2YWx1ZS5wcm9qZWN0ID09PSAnTXlNZW50YWxIZWFsdGhCdWRkeScgJiYgdmFsdWUuc2NoZW1hVmVyc2lvbiA9PT0gMSwgJ01BTklGRVNUX1BST0pFQ1RfVkVSU0lPTicpOwogIGdhdGUoQXJyYXkuaXNBcnJheSh2YWx1ZS5hc3NldHMpICYmIHZhbHVlLmFzc2V0cy5sZW5ndGggPT09IDIyLCAnTUFOSUZFU1RfQVNTRVRfQ09VTlQnKTsKICBnYXRlKHZhbHVlLmFzc2V0cy5ldmVyeShyb3cgPT4ga2V5c0V4YWN0bHkocm93LCBbJ2ZpbGUnLCAnc2hhMjU2JywgJ2J5dGVzJ10pICYmIEFTU0VUX1BBVEhTLmluY2x1ZGVzKHJvdy5maWxlKSAmJiAvXlthLWYwLTldezY0fSQvLnRlc3Qocm93LnNoYTI1NikgJiYgTnVtYmVyLmlzU2FmZUludGVnZXIocm93LmJ5dGVzKSAmJiByb3cuYnl0ZXMgPiAwICYmIHJvdy5ieXRlcyA8PSA1MDAwMCksICdNQU5JRkVTVF9BU1NFVF9ST1cnKTsKICBnYXRlKHNhbWUodmFsdWUuYXNzZXRzLm1hcChyb3cgPT4gcm93LmZpbGUpLnNvcnQoKSwgQVNTRVRfUEFUSFMpLCAnTUFOSUZFU1RfQVNTRVRfU0VUJyk7CiAgZ2F0ZShrZXlzRXhhY3RseSh2YWx1ZS5lbmdpbmVzLCBFTkdJTkVTKSwgJ01BTklGRVNUX0VOR0lORVMnKTsKICBmb3IgKGNvbnN0IGVuZ2luZSBvZiBFTkdJTkVTKSB7CiAgICBjb25zdCByb3cgPSB2YWx1ZS5lbmdpbmVzW2VuZ2luZV07CiAgICBnYXRlKGtleXNFeGFjdGx5KHJvdywgWyd2ZXJzaW9uJywgJ3Byb21wdHMnXSkgJiYgL15cZHsxLDN9XC5cZHsxLDN9XC5cZHsxLDN9JC8udGVzdChyb3cudmVyc2lvbiksICdNQU5JRkVTVF9FTkdJTkVfUk9XJyk7CiAgICBnYXRlKEFycmF5LmlzQXJyYXkocm93LnByb21wdHMpICYmIHJvdy5wcm9tcHRzLmV2ZXJ5KHAgPT4ga2V5c0V4YWN0bHkocCwgWydpZCcsICdyaXNrJ10pICYmIElEU1tlbmdpbmVdLmluY2x1ZGVzKHAuaWQpICYmIFsnbG93JywgJ21lZGl1bScsICdoaWdoJ10uaW5jbHVkZXMocC5yaXNrKSksICdNQU5JRkVTVF9QUk9NUFRfUk9XJyk7CiAgICBnYXRlKHNhbWUocm93LnByb21wdHMubWFwKHAgPT4gcC5pZCksIElEU1tlbmdpbmVdKSwgJ01BTklGRVNUX1BST01QVF9JRFMnKTsKICB9CiAgcmV0dXJuIHZhbHVlOwp9CmNvbnN0IHJlc3VsdCA9IHsKICBwcm9qZWN0OiAnTXlNZW50YWxIZWFsdGhCdWRkeScsIHN0YXR1czogJ1BST01QVF9BU1NFVF9MT0FERVJfRkFJTEVEJywKICBzb3VyY2VNb2R1bGVTaGEyNTY6IE1PRFVMRV9TSEEyNTYsIHNvdXJjZU1vZHVsZUltcG9ydGVkOiBmYWxzZSwKICByZWdpc3RyeUNoZWNrczogMCwgbW9kdWxlTG9hZHM6IDAsIHNvdXJjZVJlYWRzOiAwLCBkZW5pYWxDaGVja3M6IDAsCiAgYXNzZXRzQ2hlY2tlZDogMCwgYXNzZXRQcmVzZXJ2YXRpb246ICdVTk9CU0VSVkVEJywKICBzY29wZTogewogICAgc2VsZWN0ZWRQcm9qZWN0TW9kdWxlRXhlY3V0aW9uOiBmYWxzZSwgYXBwbGljYXRpb25TdGFydGVkOiBmYWxzZSwKICAgIHNlcnZlckltcG9ydGVkOiBmYWxzZSwgYWlSZXF1ZXN0czogMCwgbmV0d29ya1JlcXVlc3RzOiAwLAogICAgZGF0YWJhc2VDb25uZWN0aW9uczogMCwgcHJvbXB0V3JpdGVzOiAwLAogICAgaW1wb3J0TW9kZTogJ0VYQUNUX0hBU0hfVkVSSUZJRURfQllURVNfREFUQV9VUkwnLAogIH0sCiAgbGltaXRhdGlvbnM6IFsKICAgICdTZWxlY3RlZCBwcm9tcHQgbG9hZGVyIG9ubHk7IG5vIGFwcGxpY2F0aW9uIHJvdXRlcywgcm9sZXMsIEFJIG91dHB1dCwgY2xpbmljYWwgc2FmZXR5IG9yIGRlcGxveW1lbnQgcXVhbGlmaWNhdGlvbi4nLAogICAgJ0JlZm9yZS9hZnRlciBmaWxlIG9ic2VydmF0aW9ucyBhcmUgbm90IGFuIG9wZXJhdGluZy1zeXN0ZW0gZmlsZXN5c3RlbS9uZXR3b3JrIHNhbmRib3ggb3IgYW4gZWRpdG9yIGxvY2suJywKICBdLAp9OwpsZXQgcGhhc2UgPSAnQVJHVU1FTlRTJzsKbGV0IG1hbmlmZXN0LCBtb2R1bGVQYXRoLCBtYW5pZmVzdFBhdGgsIG1vZHVsZUJlZm9yZSwgbWFuaWZlc3RCZWZvcmU7CmNvbnN0IGFzc2V0QmVmb3JlID0gbmV3IE1hcCgpOwp0cnkgewogIGdhdGUocHJvY2Vzcy5hcmd2Lmxlbmd0aCA9PT0gNCwgJ0FSR1VNRU5UX0NPVU5UJyk7CiAgW21vZHVsZVBhdGgsIG1hbmlmZXN0UGF0aF0gPSBwcm9jZXNzLmFyZ3Yuc2xpY2UoMik7CiAgY29uc3Qgcm9vdCA9IHByb2Nlc3MuY3dkKCk7CiAgZ2F0ZShmcy5yZWFscGF0aFN5bmMocm9vdCkgPT09IHJvb3QgJiYgZnMubHN0YXRTeW5jKHJvb3QpLmlzRGlyZWN0b3J5KCksICdDQU5ESURBVEVfQ1dEX0lERU5USVRZJyk7CiAgZ2F0ZSghY29udGFpbmVkKHJvb3QsIG1vZHVsZVBhdGgpLCAnTU9EVUxFX01VU1RfQkVfT1VUU0lERV9DQU5ESURBVEUnKTsKICBwaGFzZSA9ICdNT0RVTEVfSURFTlRJVFknOwogIGNvbnN0IG1vZHVsZVJlYWQgPSBjaGVja2VkRmlsZShtb2R1bGVQYXRoLCA1MDAwMCk7IG1vZHVsZUJlZm9yZSA9IG1vZHVsZVJlYWQuaWRlbnRpdHk7CiAgZ2F0ZShtb2R1bGVSZWFkLmlkZW50aXR5LnNoYTI1NiA9PT0gTU9EVUxFX1NIQTI1NiwgJ01PRFVMRV9IQVNIJyk7CiAgcGhhc2UgPSAnTUFOSUZFU1QnOwogIGNvbnN0IG1hbmlmZXN0UmVhZCA9IGNoZWNrZWRGaWxlKG1hbmlmZXN0UGF0aCwgMzI3NjgpOyBtYW5pZmVzdEJlZm9yZSA9IG1hbmlmZXN0UmVhZC5pZGVudGl0eTsKICBsZXQgcGFyc2VkOwogIHRyeSB7IHBhcnNlZCA9IEpTT04ucGFyc2UobWFuaWZlc3RSZWFkLmJ5dGVzLnRvU3RyaW5nKCd1dGY4JykpOyB9IGNhdGNoIHsgZ2F0ZShmYWxzZSwgJ01BTklGRVNUX0pTT04nKTsgfQogIG1hbmlmZXN0ID0gY2hlY2tNYW5pZmVzdChwYXJzZWQpOwogIHBoYXNlID0gJ0FTU0VUX0lERU5USVRJRVMnOwogIGZvciAoY29uc3Qgcm93IG9mIG1hbmlmZXN0LmFzc2V0cykgewogICAgY29uc3QgZmlsZSA9IGNoZWNrZWRGaWxlKHBhdGguam9pbihyb290LCByb3cuZmlsZSksIDUwMDAwKTsKICAgIGdhdGUoZmlsZS5pZGVudGl0eS5zaGEyNTYgPT09IHJvdy5zaGEyNTYgJiYgZmlsZS5pZGVudGl0eS5ieXRlcyA9PT0gcm93LmJ5dGVzLCAnQVNTRVRfSEFTSF9PUl9TSVpFJyk7CiAgICBnYXRlKEJ1ZmZlci5mcm9tKGZpbGUuYnl0ZXMudG9TdHJpbmcoJ3V0ZjgnKSwgJ3V0ZjgnKS5lcXVhbHMoZmlsZS5ieXRlcyksICdBU1NFVF9JTlZBTElEX1VURjgnKTsKICAgIGFzc2V0QmVmb3JlLnNldChyb3cuZmlsZSwgZmlsZS5pZGVudGl0eSk7CiAgICByZXN1bHQuYXNzZXRzQ2hlY2tlZCsrOwogIH0KICBwaGFzZSA9ICdJTVBPUlRfUkVWSUVXRURfTU9EVUxFJzsKICBjb25zdCBlbmdpbmVNb2R1bGUgPSBhd2FpdCBpbXBvcnQoYGRhdGE6dGV4dC9qYXZhc2NyaXB0O2Jhc2U2NCwke21vZHVsZVJlYWQuYnl0ZXMudG9TdHJpbmcoJ2Jhc2U2NCcpfWApOwogIHJlc3VsdC5zb3VyY2VNb2R1bGVJbXBvcnRlZCA9IHRydWU7IHJlc3VsdC5zY29wZS5zZWxlY3RlZFByb2plY3RNb2R1bGVFeGVjdXRpb24gPSB0cnVlOwogIGNvbnN0IGV4cGVjdGVkQXNzZXRzID0gT2JqZWN0LmZyb21FbnRyaWVzKG1hbmlmZXN0LmFzc2V0cy5tYXAocm93ID0+IFtyb3cuZmlsZSwgcm93XSkpOwogIHBoYXNlID0gJ1JFR0lTVFJJRVMnOwogIGNvbnN0IGluZm8gPSBlbmdpbmVNb2R1bGUuZ2V0UmVnaXN0cnlJbmZvKCk7CiAgZ2F0ZShrZXlzRXhhY3RseShpbmZvLCBFTkdJTkVTKSwgJ1JFR0lTVFJZX0VOR0lORV9TRVQnKTsKICBmb3IgKGNvbnN0IGVuZ2luZSBvZiBFTkdJTkVTKSB7CiAgICBjb25zdCBleHBlY3RlZCA9IG1hbmlmZXN0LmVuZ2luZXNbZW5naW5lXTsKICAgIGdhdGUoaW5mb1tlbmdpbmVdPy52ZXJzaW9uID09PSBleHBlY3RlZC52ZXJzaW9uICYmIHNhbWUoaW5mb1tlbmdpbmVdPy5wcm9tcHRJZHMsIGV4cGVjdGVkLnByb21wdHMubWFwKHAgPT4gcC5pZCkpLCAnUkVHSVNUUllfQ09OVEVOVCcpOwogICAgZ2F0ZShzYW1lKGVuZ2luZU1vZHVsZS5saXN0UHJvbXB0SWRzKGVuZ2luZSksIGV4cGVjdGVkLnByb21wdHMubWFwKHAgPT4gcC5pZCkpLCAnTElTVF9QUk9NUFRfSURTJyk7CiAgICByZXN1bHQucmVnaXN0cnlDaGVja3MrKzsKICAgIHBoYXNlID0gJ1BST01QVF9MT0FEUyc7CiAgICBjb25zdCBzeXN0ZW0gPSBleHBlY3RlZEFzc2V0c1tgYWkvJHtlbmdpbmV9L3N5c3RlbS5tZGBdOwogICAgZm9yIChjb25zdCBwcm9tcHQgb2YgZXhwZWN0ZWQucHJvbXB0cykgewogICAgICBjb25zdCByb3cgPSBleHBlY3RlZEFzc2V0c1tgYWkvJHtlbmdpbmV9L3Byb21wdHMvJHtwcm9tcHQuaWR9Lm1kYF07CiAgICAgIGNvbnN0IGxvYWRlZCA9IGVuZ2luZU1vZHVsZS5sb2FkUHJvbXB0TW9kdWxlKGVuZ2luZSwgcHJvbXB0LmlkKTsKICAgICAgZ2F0ZSh0eXBlb2YgbG9hZGVkLnN5c3RlbSA9PT0gJ3N0cmluZycgJiYgaGFzaChsb2FkZWQuc3lzdGVtKSA9PT0gc3lzdGVtLnNoYTI1NiAmJiBCdWZmZXIuYnl0ZUxlbmd0aChsb2FkZWQuc3lzdGVtKSA9PT0gc3lzdGVtLmJ5dGVzLCAnTE9BREVEX1NZU1RFTV9CWVRFUycpOwogICAgICBnYXRlKHR5cGVvZiBsb2FkZWQubW9kdWxlID09PSAnc3RyaW5nJyAmJiBoYXNoKGxvYWRlZC5tb2R1bGUpID09PSByb3cuc2hhMjU2ICYmIEJ1ZmZlci5ieXRlTGVuZ3RoKGxvYWRlZC5tb2R1bGUpID09PSByb3cuYnl0ZXMsICdMT0FERURfUFJPTVBUX0JZVEVTJyk7CiAgICAgIGdhdGUobG9hZGVkLnJpc2sgPT09IHByb21wdC5yaXNrLCAnTE9BREVEX1BST01QVF9SSVNLJyk7CiAgICAgIHJlc3VsdC5tb2R1bGVMb2FkcysrOwogICAgfQogICAgcGhhc2UgPSAnUkVBRF9QUk9NUFRfU09VUkNFJzsKICAgIGZvciAoY29uc3QgcHJvbXB0SWQgb2YgWydfc3lzdGVtJywgLi4uZXhwZWN0ZWQucHJvbXB0cy5tYXAocCA9PiBwLmlkKV0pIHsKICAgICAgY29uc3QgcmVsYXRpdmUgPSBwcm9tcHRJZCA9PT0gJ19zeXN0ZW0nID8gYGFpLyR7ZW5naW5lfS9zeXN0ZW0ubWRgIDogYGFpLyR7ZW5naW5lfS9wcm9tcHRzLyR7cHJvbXB0SWR9Lm1kYDsKICAgICAgY29uc3Qgcm93ID0gZXhwZWN0ZWRBc3NldHNbcmVsYXRpdmVdOwogICAgICBjb25zdCBzb3VyY2UgPSBlbmdpbmVNb2R1bGUucmVhZFByb21wdFNvdXJjZShlbmdpbmUsIHByb21wdElkKTsKICAgICAgZ2F0ZShzb3VyY2UuZW5naW5lID09PSBlbmdpbmUgJiYgc291cmNlLnByb21wdElkID09PSBwcm9tcHRJZCAmJiBzb3VyY2UucGF0aCA9PT0gcGF0aC5qb2luKHJvb3QsIHJlbGF0aXZlKSwgJ1NPVVJDRV9NRVRBREFUQScpOwogICAgICBnYXRlKHR5cGVvZiBzb3VyY2UuY29udGVudCA9PT0gJ3N0cmluZycgJiYgaGFzaChzb3VyY2UuY29udGVudCkgPT09IHJvdy5zaGEyNTYgJiYgc291cmNlLnNoYTI1NiA9PT0gcm93LnNoYTI1NiAmJiBzb3VyY2UuYnl0ZXMgPT09IHJvdy5ieXRlcyAmJiBCdWZmZXIuYnl0ZUxlbmd0aChzb3VyY2UuY29udGVudCkgPT09IHJvdy5ieXRlcywgJ1NPVVJDRV9CWVRFUycpOwogICAgICByZXN1bHQuc291cmNlUmVhZHMrKzsKICAgIH0KICB9CiAgcGhhc2UgPSAnREVOSUFMUyc7CiAgZnVuY3Rpb24gZGVuaWVkKGZuLCBjb2RlKSB7CiAgICBsZXQgY2F1Z2h0OwogICAgdHJ5IHsgZm4oKTsgfSBjYXRjaCAoZXJyb3IpIHsgY2F1Z2h0ID0gZXJyb3I7IH0KICAgIGdhdGUoY2F1Z2h0Py5jb2RlID09PSBjb2RlLCAnREVOSUFMX0NPTlRSQUNUJyk7IHJlc3VsdC5kZW5pYWxDaGVja3MrKzsKICB9CiAgZm9yIChjb25zdCBlbmdpbmUgb2YgRU5HSU5FUykgewogICAgZm9yIChjb25zdCBpbnZhbGlkIG9mIFsnLi4vc3lzdGVtJywgJ2gwMV9pbnRha2UvLi4vLi4vc3lzdGVtJywgJ2gwMV9pbnRha2VcXC4uXFxzeXN0ZW0nLCAnaDAxX2ludGFrZVx1MDAwMCcsICdIMDFfaW50YWtlJywgJyddKSB7CiAgICAgIGRlbmllZCgoKSA9PiBlbmdpbmVNb2R1bGUubG9hZFByb21wdE1vZHVsZShlbmdpbmUsIGludmFsaWQpLCAnaW52YWxpZF9wcm9tcHRfaWQnKTsKICAgICAgZGVuaWVkKCgpID0+IGVuZ2luZU1vZHVsZS5yZWFkUHJvbXB0U291cmNlKGVuZ2luZSwgaW52YWxpZCksICdpbnZhbGlkX3Byb21wdF9pZCcpOwogICAgfQogICAgY29uc3Qgb3RoZXIgPSBlbmdpbmUgPT09ICdoZWFsaW5nJyA/ICdidXNpbmVzcycgOiAnaGVhbGluZyc7CiAgICBkZW5pZWQoKCkgPT4gZW5naW5lTW9kdWxlLmxvYWRQcm9tcHRNb2R1bGUoZW5naW5lLCBJRFNbb3RoZXJdWzBdKSwgJ3VucmVnaXN0ZXJlZF9wcm9tcHQnKTsKICAgIGRlbmllZCgoKSA9PiBlbmdpbmVNb2R1bGUucmVhZFByb21wdFNvdXJjZShlbmdpbmUsIElEU1tvdGhlcl1bMF0pLCAndW5yZWdpc3RlcmVkX3Byb21wdCcpOwogICAgZGVuaWVkKCgpID0+IGVuZ2luZU1vZHVsZS5sb2FkUHJvbXB0TW9kdWxlKGVuZ2luZSwgJ2g5OV9ub3RfcmVnaXN0ZXJlZCcpLCAndW5yZWdpc3RlcmVkX3Byb21wdCcpOwogICAgZGVuaWVkKCgpID0+IGVuZ2luZU1vZHVsZS5yZWFkUHJvbXB0U291cmNlKGVuZ2luZSwgJ2g5OV9ub3RfcmVnaXN0ZXJlZCcpLCAndW5yZWdpc3RlcmVkX3Byb21wdCcpOwogIH0KICBmb3IgKGNvbnN0IGludmFsaWRFbmdpbmUgb2YgWycuLi9oZWFsaW5nJywgJ19fcHJvdG9fXycsICd1bmtub3duJ10pIHsKICAgIGRlbmllZCgoKSA9PiBlbmdpbmVNb2R1bGUucmVhZFByb21wdFNvdXJjZShpbnZhbGlkRW5naW5lLCAnX3N5c3RlbScpLCAnaW52YWxpZF9lbmdpbmUnKTsKICB9CiAgcmVzdWx0LnN0YXR1cyA9ICdQUk9NUFRfQVNTRVRfTE9BRF9QQVNTJzsKfSBjYXRjaCAoZXJyb3IpIHsKICByZXN1bHQuZmFpbHVyZSA9IHsgcGhhc2UsIGdhdGU6IHR5cGVvZiBlcnJvcj8uZ2F0ZSA9PT0gJ3N0cmluZycgJiYgL15bQS1aMC05X10rJC8udGVzdChlcnJvci5nYXRlKSA/IGVycm9yLmdhdGUgOiAnVU5FWFBFQ1RFRF9MT0FERVJfRkFJTFVSRScsIGNvZGU6IFsnRU5PRU5UJywgJ0VBQ0NFUycsICdFTE9PUCcsICdFTk9URElSJ10uaW5jbHVkZXMoZXJyb3I/LmNvZGUpID8gZXJyb3IuY29kZSA6IG51bGwgfTsKfSBmaW5hbGx5IHsKICBwaGFzZSA9ICdQUkVTRVJWQVRJT04nOwogIHRyeSB7CiAgICBpZiAobW9kdWxlQmVmb3JlKSBnYXRlKHNhbWUoY2hlY2tlZEZpbGUobW9kdWxlUGF0aCwgNTAwMDApLmlkZW50aXR5LCBtb2R1bGVCZWZvcmUpLCAnTU9EVUxFX0NIQU5HRUQnKTsKICAgIGlmIChtYW5pZmVzdEJlZm9yZSkgZ2F0ZShzYW1lKGNoZWNrZWRGaWxlKG1hbmlmZXN0UGF0aCwgMzI3NjgpLmlkZW50aXR5LCBtYW5pZmVzdEJlZm9yZSksICdNQU5JRkVTVF9DSEFOR0VEJyk7CiAgICBmb3IgKGNvbnN0IFtyZWxhdGl2ZSwgYmVmb3JlXSBvZiBhc3NldEJlZm9yZSkgZ2F0ZShzYW1lKGNoZWNrZWRGaWxlKHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCByZWxhdGl2ZSksIDUwMDAwKS5pZGVudGl0eSwgYmVmb3JlKSwgJ0FTU0VUX0NIQU5HRUQnKTsKICAgIGlmIChhc3NldEJlZm9yZS5zaXplID09PSAyMikgcmVzdWx0LmFzc2V0UHJlc2VydmF0aW9uID0gJ0FMTF8yMl9PQlNFUlZFRF9BU1NFVFNfUFJFU0VSVkVEJzsKICAgIGVsc2UgcmVzdWx0LmFzc2V0UHJlc2VydmF0aW9uID0gJ1BBUlRJQUxfT0JTRVJWQVRJT05TX09OTFknOwogIH0gY2F0Y2ggKGVycm9yKSB7CiAgICByZXN1bHQucHJldmlvdXNGYWlsdXJlID0gcmVzdWx0LmZhaWx1cmU7CiAgICByZXN1bHQuZmFpbHVyZSA9IHsgcGhhc2UsIGdhdGU6IHR5cGVvZiBlcnJvcj8uZ2F0ZSA9PT0gJ3N0cmluZycgJiYgL15bQS1aMC05X10rJC8udGVzdChlcnJvci5nYXRlKSA/IGVycm9yLmdhdGUgOiAnUFJFU0VSVkFUSU9OX0ZBSUxFRCcsIGNvZGU6IFsnRU5PRU5UJywgJ0VBQ0NFUycsICdFTE9PUCcsICdFTk9URElSJ10uaW5jbHVkZXMoZXJyb3I/LmNvZGUpID8gZXJyb3IuY29kZSA6IG51bGwgfTsKICAgIHJlc3VsdC5hc3NldFByZXNlcnZhdGlvbiA9ICdGQUlMRUQnOyByZXN1bHQuc3RhdHVzID0gJ1BST01QVF9BU1NFVF9MT0FERVJfRkFJTEVEJzsKICB9CiAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoYCR7SlNPTi5zdHJpbmdpZnkocmVzdWx0KX1cbmApOwogIGlmIChyZXN1bHQuc3RhdHVzICE9PSAnUFJPTVBUX0FTU0VUX0xPQURfUEFTUycpIHByb2Nlc3MuZXhpdENvZGUgPSAxOwp9Cg==';
const LOADER_SHA = '630d1d36884b0951281a29d5d1ba15c9676669689393285ad81be0f316462ca2';
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
function copyTree(from,tree,to) {
  fs.mkdirSync(to,{recursive:true,mode:0o700});
  for(const row of tree.rows) {
    gate(safePath(row.file),'COPY_PATH_BOUNDARY');
    const target=path.join(to,row.file);fs.mkdirSync(path.dirname(target),{recursive:true,mode:0o700});
    fs.copyFileSync(path.join(from,row.file),target,fs.constants.COPYFILE_EXCL);
    fs.chmodSync(target,row.mode&0o777);
    const copied=artifactIdentity(to,row.file);
    gate(copied.sha256===row.sha256&&copied.bytes===row.bytes&&copied.mode===row.mode,'COPY_IDENTITY_MISMATCH',{file:label(row.file)});
  }
}
let reportDir,candidateDir,before,baseline,priorTree,candidateTree,failure;
let phase='WORKSPACE_PREFLIGHT';
const sourceBefore=new Map(),activeChanges=new Set(),processes=[];
const result={project:'MyMentalHealthBuddy',status:'NOT_STARTED',releaseReady:false,
  dependencyAlignment:'PENDING',applicationRuntime:'UNPROVEN',deployedArtifact:'UNPROVEN',
  sourceContentEdits:[],rollback:{attempted:false,restored:[],conflicts:[]}};
function failureInfo(error,at,fallback='UNEXPECTED_PROMPT_ASSET_FAILURE') {
  const detail={...(error.detail||{})};
  if(typeof error.path==='string') {
    const full=path.resolve(ROOT,error.path),base=[reportDir,PRIOR_REPORT,R14_REPORT].find(x=>x&&(full===x||inside(x,full)));
    detail.file=base?'REPORT/'+label(path.relative(base,full)||'ROOT'):inside(ROOT,full)?label(path.relative(ROOT,full)):label(error.path);
  }
  return {gate:error.gate||fallback,phase:at,detail,errorCode:/^[A-Z0-9_]+$/.test(error.code||'')?error.code:undefined};
}
function save(name,value){fs.writeFileSync(path.join(reportDir,name),JSON.stringify(value,null,2),{flag:'wx',mode:0o600});}
function checkedSource(file,expected) {
  gate(publicPath(file),'SOURCE_PATH_POLICY');
  const id=identity(path.join(ROOT,file));
  gate(id.state==='FILE'&&id.sha256===expected.sha256&&id.bytes===expected.bytes,'SOURCE_IDENTITY_MISMATCH',{file});
  return id;
}
function currentSourceExpectations() {
  return Object.fromEntries([...sourceBefore].map(([file,id])=>{
    const repair=REPAIR_POLICY.replacements.find(x=>x.file===file);
    return [file,activeChanges.has(file)?{...id,sha256:repair.resultSha256,bytes:repair.resultBytes}:id];
  }));
}
function verifyCurrent(name) {
  const expected=currentSourceExpectations();
  if(baseline) {
    const after=Object.fromEntries(Object.keys(baseline).map(file=>[file,identity(path.join(ROOT,file),file.startsWith('node_modules/'))]));
    gate(JSON.stringify(after)===JSON.stringify(baseline),'PINNED_FILE_NOT_PRESERVED');
  }
  for(const [file,id] of Object.entries(expected))gate(JSON.stringify(identity(path.join(ROOT,file)))===JSON.stringify(id),'SELECTED_SOURCE_NOT_EXPECTED',{file});
  for(const {base,rel,id} of retainedFiles.values())gate(JSON.stringify(artifactIdentity(base,rel))===JSON.stringify(id),'RETAINED_REPORT_NOT_PRESERVED',{file:label(rel)});
  if(priorTree)sameTree(priorTree,artifactTree(path.join(PRIOR_REPORT,'candidate')),'R13_CANDIDATE_NOT_PRESERVED');
  if(candidateTree)sameTree(candidateTree,artifactTree(candidateDir),'R15_CANDIDATE_NOT_PRESERVED');
  if(before) {
    const after=snapshot();save('worktree-'+name+'.json',after);
    const desired=structuredClone(before);
    desired.records=before.records.map(([file,id])=>[file,activeChanges.has(file)?expected[file]:id]);
    desired.worktree=hash(JSON.stringify(desired.records));
    result.currentChanges=snapshotDifference(before,after);
    const deviation=snapshotDifference(desired,after);
    save('worktree-'+name+'-comparison.json',{actual:result.currentChanges,unexpected:deviation});
    gate(!deviation.components.length,'UNEXPECTED_GIT_OR_WORKTREE_CHANGE',deviation);
  }
}
function atomicReplace(file,bytes,expected) {
  const full=path.join(ROOT,file),directoryName=path.dirname(full);
  gate(JSON.stringify(identity(full))===JSON.stringify(expected),'SOURCE_CHANGED_BEFORE_REPLACE',{file});
  const temp=path.join(directoryName,'.'+path.basename(file)+'.mmhb-r15-'+crypto.randomBytes(8).toString('hex')+'.tmp');
  let fd,created=false,renamed=false;
  try {
    fd=fs.openSync(temp,'wx',expected.mode&0o777);created=true;
    fs.writeFileSync(fd,bytes);fs.fchmodSync(fd,expected.mode&0o777);fs.fsyncSync(fd);fs.closeSync(fd);fd=undefined;
    gate(hash(fs.readFileSync(temp))===hash(bytes),'SOURCE_TEMP_WRITE_MISMATCH',{file});
    gate(JSON.stringify(identity(full))===JSON.stringify(expected),'SOURCE_CHANGED_BEFORE_RENAME',{file});
    fs.renameSync(temp,full);renamed=true;
  } finally {
    if(fd!==undefined)fs.closeSync(fd);
    if(created&&!renamed)fs.unlinkSync(temp);
  }
}
function rollbackSources() {
  if(!activeChanges.size)return;
  result.rollback.attempted=true;
  for(const file of [...activeChanges].reverse()) {
    try {
      const old=sourceBefore.get(file),repair=REPAIR_POLICY.replacements.find(x=>x.file===file);
      const now=identity(path.join(ROOT,file));
      if(JSON.stringify(now)===JSON.stringify(old)){activeChanges.delete(file);continue;}
      const expected={...old,sha256:repair.resultSha256,bytes:repair.resultBytes};
      gate(JSON.stringify(now)===JSON.stringify(expected),'ROLLBACK_CONCURRENT_EDIT_PRESERVED',{file});
      const backup=fs.readFileSync(path.join(reportDir,'backups',file));
      gate(hash(backup)===old.sha256&&backup.length===old.bytes,'ROLLBACK_BACKUP_MISMATCH',{file});
      atomicReplace(file,backup,expected);
      gate(JSON.stringify(identity(path.join(ROOT,file)))===JSON.stringify(old),'ROLLBACK_VERIFY_FAILED',{file});activeChanges.delete(file);
      result.rollback.restored.push(file);
    }catch(error){result.rollback.conflicts.push(failureInfo(error,'ROLLBACK'));}
  }
}
function runLoader(moduleFile,manifestFile) {
  const loader=Buffer.from(LOADER_B64,'base64');gate(hash(loader)===LOADER_SHA,'LOADER_SOURCE_IDENTITY');
  const loaderFile=path.join(reportDir,'prompt-asset-runner.mjs');fs.writeFileSync(loaderFile,loader,{flag:'wx',mode:0o600});
  const entry={name:'prompt-asset-loader',attempts:1,started:false};processes.push(entry);
  const child=spawnSync(process.execPath,[loaderFile,moduleFile,manifestFile],{cwd:candidateDir,
    env:{...MIN_ENV,NODE_DISABLE_COMPILE_CACHE:'1',TMPDIR:reportDir},encoding:'utf8',
    stdio:['ignore','pipe','pipe'],timeout:30000,maxBuffer:1024*1024,killSignal:'SIGTERM'});
  entry.started=child.pid>0;entry.exitCode=child.status;entry.signal=child.signal||null;
  entry.timedOut=child.error?.code==='ETIMEDOUT';
  entry.errorCode=/^[A-Z0-9_]+$/.test(child.error?.code||'')?child.error.code:undefined;
  fs.writeFileSync(path.join(reportDir,'loader-stdout.log'),child.stdout||'',{flag:'wx',mode:0o600});
  fs.writeFileSync(path.join(reportDir,'loader-stderr.log'),child.stderr||'',{flag:'wx',mode:0o600});
  let evidence;try{evidence=JSON.parse(child.stdout);}catch{}
  if(evidence&&typeof evidence==='object')result.loader=evidence;
  gate(child.status===0&&!child.signal&&!child.error&&evidence?.status==='PROMPT_ASSET_LOAD_PASS',
    'PROMPT_ASSET_LOADER_FAILED',{...entry,rawLog:'PRIVATE_NOT_PRINTED'});
  gate(hash(fs.readFileSync(loaderFile))===LOADER_SHA,'LOADER_SOURCE_NOT_PRESERVED');
}
console.log('COMMAND_ID=MMHB-PROMPT-ASSETS-R15');console.log('UTC='+new Date().toISOString());
console.log('ISSUE_ID=PROMPT-ASSET-PACKAGING-AND-MMHB-CONTENT-001');
try {
  gate(ROOT===EXPECTED_ROOT,'WORKSPACE_PATH');
  gate(process.version===EXPECTED_NODE&&process.platform==='linux'&&process.arch==='x64','MACHINE_DRIFT');
  gate(fs.realpathSync(git('rev-parse','--show-toplevel').trim())===ROOT,'GIT_ROOT');
  reportDir=fs.mkdtempSync('/tmp/mmhb-prompt-assets-r15-');fs.chmodSync(reportDir,0o700);console.log('REPORT_DIRECTORY='+reportDir);
  phase='INITIAL_BASELINES';before=snapshot();save('worktree-before.json',before);
  gate(before.head===EXPECTED_HEAD&&before.branch==='integration','GIT_BASELINE_DRIFT');
  baseline=checkPins();save('pinned-before.json',baseline);
  phase='RETAINED_R13_AND_R14';
  const r13=retainedJSON(PRIOR_REPORT,'assembly-evidence.json'),assembly=retainedJSON(PRIOR_REPORT,'assembly-manifest-before.json');
  const r14=retainedJSON(R14_REPORT,'runtime-contract-evidence.json');
  gate(retainedFiles.get(R14_REPORT+'\0runtime-contract-evidence.json').id.sha256===EXPECTED_R14_REPORT,'R14_REPORT_PIN');
  gate(r14.status==='RUNTIME_CONTRACT_EVIDENCE_COMPLETE'&&r14.preservation==='OBSERVED_INPUTS_AND_R13_CANDIDATE_PRESERVED','R14_PASS_REQUIRED');
  gate(r13.status==='CORE_CANDIDATE_ASSEMBLED_NATIVE_PASS_NOT_RELEASE'&&r13.preservation==='OBSERVED_INPUTS_AND_CANDIDATES_PRESERVED','R13_PASS_REQUIRED');
  gate(hash(JSON.stringify(assembly))===EXPECTED_ASSEMBLY_MANIFEST,'R13_MANIFEST_PIN');
  priorTree=artifactTree(path.join(PRIOR_REPORT,'candidate'));matchTree(priorTree,assembly.rows,'R13_CANDIDATE_CHANGED');
  gate(priorTree.bytes===assembly.bytes,'R13_CANDIDATE_SIZE');
  phase='POLICY_AND_CURRENT_ASSETS';
  gate(REPAIR_POLICY.project==='MyMentalHealthBuddy'&&REPAIR_POLICY.assets.length===22&&REPAIR_POLICY.replacements.length===6,'REPAIR_POLICY_SHAPE');
  gate(new Set(REPAIR_POLICY.assets.map(x=>x.file)).size===22&&new Set(REPAIR_POLICY.replacements.map(x=>x.file)).size===6,'REPAIR_POLICY_DUPLICATES');
  const originalBuffers=new Map();
  for(const asset of REPAIR_POLICY.assets) {
    gate(/^ai\/(healing|business)\/(system\.md|registry\.json|prompts\/[a-z]\d{2}_[a-z0-9_]+\.md)$/.test(asset.file),'ASSET_ALLOWLIST');
    const id=checkedSource(asset.file,{sha256:asset.expectedSha256,bytes:asset.expectedBytes});sourceBefore.set(asset.file,id);
    const raw=fs.readFileSync(path.join(ROOT,asset.file));gate(hash(raw)===id.sha256,'ASSET_CHANGED_DURING_READ',{file:asset.file});originalBuffers.set(asset.file,raw);
    const repair=REPAIR_POLICY.replacements.find(x=>x.file===asset.file);
    if(repair)gate((id.mode&0o7000)===0,'SOURCE_SPECIAL_MODE_UNSUPPORTED',{file:asset.file});
    if(repair)gate(raw.equals(Buffer.from(repair.oldText))&&hash(repair.newText)===asset.resultSha256&&Buffer.byteLength(repair.newText)===asset.resultBytes,'REPAIR_BYTES',{file:asset.file});
    else gate(asset.expectedSha256===asset.resultSha256&&asset.expectedBytes===asset.resultBytes,'UNEXPECTED_ASSET_CHANGE',{file:asset.file});
  }
  const moduleId=identity(path.join(ROOT,MODULE_FILE));gate(moduleId.sha256===MODULE_SHA,'PROMPT_ENGINE_PIN');sourceBefore.set(MODULE_FILE,moduleId);
  const moduleBytes=fs.readFileSync(path.join(ROOT,MODULE_FILE));gate(hash(moduleBytes)===MODULE_SHA,'PROMPT_ENGINE_READ_PIN');
  gate(r14.sourceReviews.some(x=>x.file===MODULE_FILE&&x.current?.sha256===MODULE_SHA&&x.listedCompilerInput&&x.retainedInputIdentityMatches),'PROMPT_ENGINE_RETAINED_INPUT');
  save('selected-source-before.json',Object.fromEntries(sourceBefore));
  gate(REPAIR_POLICY.assets.every(x=>!priorTree.rows.some(r=>r.file===x.file)),'R13_ASSET_COLLISION');
  console.log('GATE=CURRENT_ASSETS_AND_RETAINED_CORE RESULT=PASS');
  phase='PRIVATE_CANDIDATE_ASSEMBLY';candidateDir=path.join(reportDir,'candidate');copyTree(path.join(PRIOR_REPORT,'candidate'),priorTree,candidateDir);
  for(const asset of REPAIR_POLICY.assets) {
    const repair=REPAIR_POLICY.replacements.find(x=>x.file===asset.file),raw=repair?Buffer.from(repair.newText):originalBuffers.get(asset.file);
    const dest=path.join(candidateDir,asset.file);fs.mkdirSync(path.dirname(dest),{recursive:true,mode:0o700});fs.writeFileSync(dest,raw,{flag:'wx',mode:0o600});
  }
  const expectedAssets=REPAIR_POLICY.assets.map(x=>({file:x.file,sha256:x.resultSha256,bytes:x.resultBytes,mode:0o100600}));
  candidateTree=artifactTree(candidateDir);matchTree(candidateTree,[...priorTree.rows,...expectedAssets],'ASSEMBLED_ASSET_TREE');
  save('candidate-manifest.json',candidateTree);
  const moduleFile=path.join(reportDir,'reviewed-promptEngine.mjs');fs.writeFileSync(moduleFile,moduleBytes,{flag:'wx',mode:0o600});
  const engines=Object.fromEntries(['healing','business'].map(engine=>{
    const registry=JSON.parse(originalBuffers.get('ai/'+engine+'/registry.json').toString('utf8'));
    return [engine,{version:registry.version,prompts:registry.prompts.map(({id,risk})=>({id,risk}))}];
  }));
  const manifest={project:'MyMentalHealthBuddy',schemaVersion:1,assets:expectedAssets.map(({mode,...row})=>row),engines};
  save('prompt-load-manifest.json',manifest);
  phase='ACTUAL_PROMPT_LOADER_QUALIFICATION';runLoader(moduleFile,path.join(reportDir,'prompt-load-manifest.json'));
  gate(hash(fs.readFileSync(moduleFile))===MODULE_SHA,'REVIEWED_MODULE_NOT_PRESERVED');
  gate(hash(fs.readFileSync(path.join(reportDir,'prompt-load-manifest.json')))===hash(JSON.stringify(manifest,null,2)),'LOADER_MANIFEST_NOT_PRESERVED');
  verifyCurrent('qualified');console.log('GATE=ALL_18_PROMPT_MODULES_LOAD_FROM_CANDIDATE RESULT=PASS');
  phase='VERIFIED_CONTENT_BACKUPS';
  for(const repair of REPAIR_POLICY.replacements) {
    const backup=path.join(reportDir,'backups',repair.file);fs.mkdirSync(path.dirname(backup),{recursive:true,mode:0o700});
    fs.writeFileSync(backup,originalBuffers.get(repair.file),{flag:'wx',mode:0o600});
    gate(hash(fs.readFileSync(backup))===repair.expectedSha256,'BACKUP_IDENTITY',{file:repair.file});
  }
  save('content-repair-plan.json',REPAIR_POLICY.replacements.map(x=>({file:x.file,before:x.expectedSha256,after:x.resultSha256,backup:'backups/'+x.file})));
  phase='APPLY_SIX_VERIFIED_CONTENT_REPAIRS';
  for(const repair of REPAIR_POLICY.replacements) {
    atomicReplace(repair.file,Buffer.from(repair.newText),sourceBefore.get(repair.file));activeChanges.add(repair.file);
    result.sourceContentEdits.push({file:repair.file,before:repair.expectedSha256,after:repair.resultSha256});
    save('content-step-'+activeChanges.size+'.json',{applied:[...activeChanges]});
  }
  verifyCurrent('applied');
  console.log('GATE=SIX_EXACT_CONTENT_REPAIRS RESULT=PASS');
  result.candidateDirectory=candidateDir;result.files=candidateTree.rows.length;result.bytes=candidateTree.bytes;
  result.candidateManifestSha256=hash(JSON.stringify(candidateTree));result.promptAssets=22;
  result.status='PROMPT_ASSETS_REPAIRED_AND_LOAD_PASS_NOT_RELEASE';
  result.remaining=['React plugin and Resend installed/root-lock version mismatches','Resend installed-distribution and full runtime external reachability','Eight kernel references and inactive RSS content remain outside this repair','Public VITE config and complete app/browser/database/AI-safety acceptance','Backup/restore, reproducible deployment procedure and deployed identity'];
  result.limitations=['Only six named AI content files are changed; 16 other selected assets are copied unchanged','Prompt-loader tests prove selected module file loading, not model behavior, role enforcement or clinical safety','The exact reviewed module is imported in a child; the application server and automatic self-heal are never imported or started','The private candidate uses its own working directory; existing R13 bytes are preserved','Atomic replacement is per file; the six-file set is not one filesystem transaction','Detected failures trigger guarded source rollback; concurrent unknown edits are preserved and reported','Snapshots do not lock concurrent editors; abrupt termination may require recovery from the saved repair plan and backups'];
}catch(error){failure=failureInfo(error,phase);}
finally {
  if(failure)rollbackSources();
  if(before)try{verifyCurrent('final');result.preservation=before&&baseline&&priorTree?'EXPECTED_SOURCE_CHANGES_AND_R13_PRESERVED':'PARTIAL_BASELINES_ONLY';}
  catch(error){failure={...failureInfo(error,'FINAL_PRESERVATION'),previousFailure:failure};result.preservation='FAILED';rollbackSources();
    try{verifyCurrent('rollback-final');result.preservation='POST_ROLLBACK_EXPECTATIONS_VERIFIED';}catch(e){result.preservationFailure=failureInfo(e,'POST_ROLLBACK_PRESERVATION');}}
  if(failure)result.status='PROMPT_ASSET_REPAIR_FAILED';
  result.failure=failure;result.processes=processes;result.sourceEditsRemaining=activeChanges.size;
  result.projectModuleExecution=processes.some(x=>x.started)?'SEE_LOADER_EVIDENCE':'NOT_STARTED';
  result.evidenceWrite=reportDir?'SAVED':'REPORT_NOT_CREATED';
  if(reportDir)try{save('prompt-asset-repair-evidence.json',result);}catch(error){failure={...failureInfo(error,'FINAL_EVIDENCE_WRITE','EVIDENCE_WRITE_FAILED'),previousFailure:failure};result.status='PROMPT_ASSET_REPAIR_FAILED';result.failure=failure;result.evidenceWrite='FAILED';rollbackSources();result.sourceEditsRemaining=activeChanges.size;
    try{verifyCurrent('evidence-failure');result.preservation='POST_EVIDENCE_FAILURE_EXPECTATIONS_VERIFIED';}catch(e){result.preservation='FAILED';result.preservationFailure=failureInfo(e,'POST_EVIDENCE_FAILURE');}}
  if(failure)console.log('FAILED_GATE='+failure.gate);
  console.log(JSON.stringify(result,null,2));
  console.log('SOURCE_CONTENT_EDITS_REMAINING='+activeChanges.size+' PACKAGE_EDIT=0 PACKAGE_INSTALL=0 BUILD=NOT_RUN');
  console.log('APPLICATION_STARTED=0 AI_REQUEST=0 NETWORK_REQUEST=0 DATABASE_CONNECTION=0 DATABASE_WRITE=0');
  console.log('CREDENTIAL_CHANGE=0 STAGE=0 COMMIT=0 PUSH=0 DEPLOY=0 R13_CANDIDATE_MODIFIED=0');
  console.log('APPLICATION_RUNTIME=UNPROVEN DEPLOYED_ARTIFACT_PROVEN=NO');
  if(reportDir)console.log('REPORT_DIRECTORY='+reportDir);
  console.log('STATUS='+result.status);console.log('NEXT_ACTION=STOP_AND_RETURN_COMPLETE_OUTPUT');process.exitCode=failure?1:0;
}
