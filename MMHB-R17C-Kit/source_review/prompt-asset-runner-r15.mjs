import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

// Executes only the exact reviewed promptEngine module and its read-only exports.
// The verified bytes are imported through a data URL: the disk copy cannot be
// replaced between its hash check and Node's module evaluation.
const MODULE_SHA256 = 'fbbd43eaab399b029b5d976508da8f1e055e25d69fd2ee65551e23d102363170';
const IDS = {
  healing: ['h01_intake', 'h02_journal_reflect', 'h03_cbt_reframe', 'h04_act_values', 'h05_breathing_grounding', 'h06_sleep_reset', 'h07_conflict_script', 'h08_safety_check'],
  business: ['b01_offer_design', 'b02_funnel_map', 'b03_content_factory', 'b04_email_sequences', 'b05_seo_briefs', 'b06_competitive_scan', 'b07_pricing_packaging', 'b08_retention_loyalty', 'b09_partnerships', 'b10_ops_sops'],
};
const ENGINES = Object.keys(IDS);
const ASSET_PATHS = ENGINES.flatMap(engine => [
  `ai/${engine}/registry.json`, `ai/${engine}/system.md`,
  ...IDS[engine].map(id => `ai/${engine}/prompts/${id}.md`),
]).sort();
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function gate(ok, code) { if (!ok) throw Object.assign(new Error(code), { gate: code }); }
function record(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function keysExactly(obj, keys) { return record(obj) && same(Object.keys(obj).sort(), [...keys].sort()); }
function contained(root, file) { const rel = path.relative(root, file); return rel !== '' && rel !== '..' && !rel.startsWith(`..${path.sep}`) && !path.isAbsolute(rel); }
function checkedFile(absolutePath, maxBytes) {
  gate(typeof absolutePath === 'string' && path.isAbsolute(absolutePath), 'INPUT_ABSOLUTE_PATH_REQUIRED');
  gate(absolutePath === path.normalize(absolutePath), 'INPUT_NORMALIZED_PATH_REQUIRED');
  let current = path.parse(absolutePath).root;
  const parts = absolutePath.slice(current.length).split(path.sep);
  for (let i = 0; i < parts.length; i++) {
    current = path.join(current, parts[i]);
    const item = fs.lstatSync(current);
    gate(!item.isSymbolicLink(), 'INPUT_SYMLINK');
    gate(i === parts.length - 1 ? item.isFile() : item.isDirectory(), 'INPUT_FILE_TYPE');
  }
  const fd = fs.openSync(absolutePath, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
  try {
    const before = fs.fstatSync(fd);
    gate(before.isFile() && before.size > 0 && before.size <= maxBytes, 'INPUT_SIZE');
    const buffer = Buffer.alloc(maxBytes + 1);
    let total = 0;
    while (total < buffer.length) {
      const count = fs.readSync(fd, buffer, total, buffer.length - total, total);
      if (count === 0) break;
      total += count;
    }
    gate(total <= maxBytes, 'INPUT_SIZE');
    const bytes = buffer.subarray(0, total);
    const after = fs.fstatSync(fd);
    gate(bytes.length === before.size && before.size === after.size && before.mtimeMs === after.mtimeMs && before.ctimeMs === after.ctimeMs, 'INPUT_CHANGED_DURING_READ');
    return { bytes, identity: { sha256: hash(bytes), bytes: bytes.length, mode: after.mode } };
  } finally { fs.closeSync(fd); }
}
function checkManifest(value) {
  gate(keysExactly(value, ['project', 'schemaVersion', 'assets', 'engines']), 'MANIFEST_SHAPE');
  gate(value.project === 'MyMentalHealthBuddy' && value.schemaVersion === 1, 'MANIFEST_PROJECT_VERSION');
  gate(Array.isArray(value.assets) && value.assets.length === 22, 'MANIFEST_ASSET_COUNT');
  gate(value.assets.every(row => keysExactly(row, ['file', 'sha256', 'bytes']) && ASSET_PATHS.includes(row.file) && /^[a-f0-9]{64}$/.test(row.sha256) && Number.isSafeInteger(row.bytes) && row.bytes > 0 && row.bytes <= 50000), 'MANIFEST_ASSET_ROW');
  gate(same(value.assets.map(row => row.file).sort(), ASSET_PATHS), 'MANIFEST_ASSET_SET');
  gate(keysExactly(value.engines, ENGINES), 'MANIFEST_ENGINES');
  for (const engine of ENGINES) {
    const row = value.engines[engine];
    gate(keysExactly(row, ['version', 'prompts']) && /^\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(row.version), 'MANIFEST_ENGINE_ROW');
    gate(Array.isArray(row.prompts) && row.prompts.every(p => keysExactly(p, ['id', 'risk']) && IDS[engine].includes(p.id) && ['low', 'medium', 'high'].includes(p.risk)), 'MANIFEST_PROMPT_ROW');
    gate(same(row.prompts.map(p => p.id), IDS[engine]), 'MANIFEST_PROMPT_IDS');
  }
  return value;
}
const result = {
  project: 'MyMentalHealthBuddy', status: 'PROMPT_ASSET_LOADER_FAILED',
  sourceModuleSha256: MODULE_SHA256, sourceModuleImported: false,
  registryChecks: 0, moduleLoads: 0, sourceReads: 0, denialChecks: 0,
  assetsChecked: 0, assetPreservation: 'UNOBSERVED',
  scope: {
    selectedProjectModuleExecution: false, applicationStarted: false,
    serverImported: false, aiRequests: 0, networkRequests: 0,
    databaseConnections: 0, promptWrites: 0,
    importMode: 'EXACT_HASH_VERIFIED_BYTES_DATA_URL',
  },
  limitations: [
    'Selected prompt loader only; no application routes, roles, AI output, clinical safety or deployment qualification.',
    'Before/after file observations are not an operating-system filesystem/network sandbox or an editor lock.',
  ],
};
let phase = 'ARGUMENTS';
let manifest, modulePath, manifestPath, moduleBefore, manifestBefore;
const assetBefore = new Map();
try {
  gate(process.argv.length === 4, 'ARGUMENT_COUNT');
  [modulePath, manifestPath] = process.argv.slice(2);
  const root = process.cwd();
  gate(fs.realpathSync(root) === root && fs.lstatSync(root).isDirectory(), 'CANDIDATE_CWD_IDENTITY');
  gate(!contained(root, modulePath), 'MODULE_MUST_BE_OUTSIDE_CANDIDATE');
  phase = 'MODULE_IDENTITY';
  const moduleRead = checkedFile(modulePath, 50000); moduleBefore = moduleRead.identity;
  gate(moduleRead.identity.sha256 === MODULE_SHA256, 'MODULE_HASH');
  phase = 'MANIFEST';
  const manifestRead = checkedFile(manifestPath, 32768); manifestBefore = manifestRead.identity;
  let parsed;
  try { parsed = JSON.parse(manifestRead.bytes.toString('utf8')); } catch { gate(false, 'MANIFEST_JSON'); }
  manifest = checkManifest(parsed);
  phase = 'ASSET_IDENTITIES';
  for (const row of manifest.assets) {
    const file = checkedFile(path.join(root, row.file), 50000);
    gate(file.identity.sha256 === row.sha256 && file.identity.bytes === row.bytes, 'ASSET_HASH_OR_SIZE');
    gate(Buffer.from(file.bytes.toString('utf8'), 'utf8').equals(file.bytes), 'ASSET_INVALID_UTF8');
    assetBefore.set(row.file, file.identity);
    result.assetsChecked++;
  }
  phase = 'IMPORT_REVIEWED_MODULE';
  const engineModule = await import(`data:text/javascript;base64,${moduleRead.bytes.toString('base64')}`);
  result.sourceModuleImported = true; result.scope.selectedProjectModuleExecution = true;
  const expectedAssets = Object.fromEntries(manifest.assets.map(row => [row.file, row]));
  phase = 'REGISTRIES';
  const info = engineModule.getRegistryInfo();
  gate(keysExactly(info, ENGINES), 'REGISTRY_ENGINE_SET');
  for (const engine of ENGINES) {
    const expected = manifest.engines[engine];
    gate(info[engine]?.version === expected.version && same(info[engine]?.promptIds, expected.prompts.map(p => p.id)), 'REGISTRY_CONTENT');
    gate(same(engineModule.listPromptIds(engine), expected.prompts.map(p => p.id)), 'LIST_PROMPT_IDS');
    result.registryChecks++;
    phase = 'PROMPT_LOADS';
    const system = expectedAssets[`ai/${engine}/system.md`];
    for (const prompt of expected.prompts) {
      const row = expectedAssets[`ai/${engine}/prompts/${prompt.id}.md`];
      const loaded = engineModule.loadPromptModule(engine, prompt.id);
      gate(typeof loaded.system === 'string' && hash(loaded.system) === system.sha256 && Buffer.byteLength(loaded.system) === system.bytes, 'LOADED_SYSTEM_BYTES');
      gate(typeof loaded.module === 'string' && hash(loaded.module) === row.sha256 && Buffer.byteLength(loaded.module) === row.bytes, 'LOADED_PROMPT_BYTES');
      gate(loaded.risk === prompt.risk, 'LOADED_PROMPT_RISK');
      result.moduleLoads++;
    }
    phase = 'READ_PROMPT_SOURCE';
    for (const promptId of ['_system', ...expected.prompts.map(p => p.id)]) {
      const relative = promptId === '_system' ? `ai/${engine}/system.md` : `ai/${engine}/prompts/${promptId}.md`;
      const row = expectedAssets[relative];
      const source = engineModule.readPromptSource(engine, promptId);
      gate(source.engine === engine && source.promptId === promptId && source.path === path.join(root, relative), 'SOURCE_METADATA');
      gate(typeof source.content === 'string' && hash(source.content) === row.sha256 && source.sha256 === row.sha256 && source.bytes === row.bytes && Buffer.byteLength(source.content) === row.bytes, 'SOURCE_BYTES');
      result.sourceReads++;
    }
  }
  phase = 'DENIALS';
  function denied(fn, code) {
    let caught;
    try { fn(); } catch (error) { caught = error; }
    gate(caught?.code === code, 'DENIAL_CONTRACT'); result.denialChecks++;
  }
  for (const engine of ENGINES) {
    for (const invalid of ['../system', 'h01_intake/../../system', 'h01_intake\\..\\system', 'h01_intake\u0000', 'H01_intake', '']) {
      denied(() => engineModule.loadPromptModule(engine, invalid), 'invalid_prompt_id');
      denied(() => engineModule.readPromptSource(engine, invalid), 'invalid_prompt_id');
    }
    const other = engine === 'healing' ? 'business' : 'healing';
    denied(() => engineModule.loadPromptModule(engine, IDS[other][0]), 'unregistered_prompt');
    denied(() => engineModule.readPromptSource(engine, IDS[other][0]), 'unregistered_prompt');
    denied(() => engineModule.loadPromptModule(engine, 'h99_not_registered'), 'unregistered_prompt');
    denied(() => engineModule.readPromptSource(engine, 'h99_not_registered'), 'unregistered_prompt');
  }
  for (const invalidEngine of ['../healing', '__proto__', 'unknown']) {
    denied(() => engineModule.readPromptSource(invalidEngine, '_system'), 'invalid_engine');
  }
  result.status = 'PROMPT_ASSET_LOAD_PASS';
} catch (error) {
  result.failure = { phase, gate: typeof error?.gate === 'string' && /^[A-Z0-9_]+$/.test(error.gate) ? error.gate : 'UNEXPECTED_LOADER_FAILURE', code: ['ENOENT', 'EACCES', 'ELOOP', 'ENOTDIR'].includes(error?.code) ? error.code : null };
} finally {
  phase = 'PRESERVATION';
  try {
    if (moduleBefore) gate(same(checkedFile(modulePath, 50000).identity, moduleBefore), 'MODULE_CHANGED');
    if (manifestBefore) gate(same(checkedFile(manifestPath, 32768).identity, manifestBefore), 'MANIFEST_CHANGED');
    for (const [relative, before] of assetBefore) gate(same(checkedFile(path.join(process.cwd(), relative), 50000).identity, before), 'ASSET_CHANGED');
    if (assetBefore.size === 22) result.assetPreservation = 'ALL_22_OBSERVED_ASSETS_PRESERVED';
    else result.assetPreservation = 'PARTIAL_OBSERVATIONS_ONLY';
  } catch (error) {
    result.previousFailure = result.failure;
    result.failure = { phase, gate: typeof error?.gate === 'string' && /^[A-Z0-9_]+$/.test(error.gate) ? error.gate : 'PRESERVATION_FAILED', code: ['ENOENT', 'EACCES', 'ELOOP', 'ENOTDIR'].includes(error?.code) ? error.code : null };
    result.assetPreservation = 'FAILED'; result.status = 'PROMPT_ASSET_LOADER_FAILED';
  }
  process.stdout.write(`${JSON.stringify(result)}\n`);
  if (result.status !== 'PROMPT_ASSET_LOAD_PASS') process.exitCode = 1;
}
