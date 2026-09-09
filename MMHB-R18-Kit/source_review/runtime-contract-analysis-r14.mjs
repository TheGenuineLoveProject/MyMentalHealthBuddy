// Pure, bounded summaries. The caller owns file reads and the approved path list.
// No source, prompt text, commands, URLs, integrity strings, or unknown IDs escape.
const R14_ENGINES = ['healing', 'business'];
const R14_AUDIENCES = ['anonymous', 'subscriber', 'owner', 'admin', 'staff'];
const R14_RISKS = ['low', 'medium', 'high'];
const R14_DEPENDENCY_FIELDS = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
const R14_LIFECYCLE_NAMES = ['preinstall', 'install', 'postinstall', 'prepublish', 'preprepare', 'prepare', 'postprepare'];

function r14Record(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function r14Parse(value) {
  if (value === null || value === undefined) return { state: 'ABSENT', value: null };
  if (typeof value === 'string') {
    if (value.length > 1_048_576) return { state: 'SIZE_LIMIT', value: null };
    try { value = JSON.parse(value); } catch { return { state: 'INVALID_JSON', value: null }; }
  }
  return r14Record(value) ? { state: 'OBJECT', value } : { state: 'INVALID_OBJECT', value: null };
}

function r14Version(value) {
  // Numeric releases and narrowly recognized prereleases only; never echo unknown suffixes.
  return typeof value === 'string' && value.length <= 64 &&
    /^(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-(?:alpha|beta|rc|next|canary|dev)(?:[.-]\d+)?)?$/.test(value)
    ? value : null;
}

function r14AvailableAsset(assets, file) {
  if (!r14Record(assets) || !Object.hasOwn(assets, file)) return false;
  const asset = assets[file];
  return r14Record(asset) && ['FILE', 'PRESENT'].includes(asset.state) &&
    Number.isSafeInteger(asset.bytes) && asset.bytes > 0;
}

export function r14RegistrySummary(engine, jsonText, allowedAssetPaths, assets) {
  const result = {
    engine: R14_ENGINES.includes(engine) ? engine : null,
    status: 'REGISTRY_STRUCTURE_REVIEW_REQUIRED', valid: false, version: null,
    promptCount: 0, approvedPromptCount: 0, allowedAudiences: [],
    riskCounts: { low: 0, medium: 0, high: 0 }, requiredAssets: [], issues: [],
    scope: 'STRUCTURE_AND_CALLER_ASSET_METADATA_ONLY_NOT_CONTENT_OR_RUNTIME_QUALIFICATION',
  };
  const issue = (code, index) => result.issues.push(index === undefined ? { code } : { code, index });
  if (!R14_ENGINES.includes(engine)) { issue('UNSUPPORTED_ENGINE'); return result; }
  if (!Array.isArray(allowedAssetPaths) || allowedAssetPaths.length > 1000) {
    issue('APPROVED_PATHS_INVALID'); return result;
  }
  const prefix = engine === 'healing' ? 'h' : 'b';
  const system = `ai/${engine}/system.md`;
  const promptPathPattern = new RegExp(`^ai/${engine}/prompts/${prefix}\\d{2}_[a-z0-9_]+\\.md$`);
  const approved = new Set(allowedAssetPaths.filter(file => typeof file === 'string' &&
    file.length <= 256 && (file === system || promptPathPattern.test(file))));
  const required = new Set();
  function addAsset(file, index) {
    if (required.has(file)) return;
    required.add(file);
    const available = r14AvailableAsset(assets, file);
    result.requiredAssets.push({ file, available });
    if (!available) issue(file === system ? 'SYSTEM_ASSET_MISSING_OR_EMPTY' : 'PROMPT_ASSET_MISSING_OR_EMPTY', index);
  }
  if (!approved.has(system)) issue('SYSTEM_ASSET_NOT_APPROVED');
  else addAsset(system);

  const parsed = r14Parse(jsonText);
  if (parsed.state !== 'OBJECT') { issue(`REGISTRY_${parsed.state}`); return result; }
  const registry = parsed.value;
  if (registry.engine !== engine) issue('ENGINE_MISMATCH');
  result.version = r14Version(registry.version);
  if (result.version === null) issue('VERSION_UNRECOGNIZED');
  if (!Array.isArray(registry.allowed_audiences) || registry.allowed_audiences.length === 0 ||
      registry.allowed_audiences.length > R14_AUDIENCES.length) issue('AUDIENCES_INVALID');
  else {
    const seen = new Set();
    for (const [index, audience] of registry.allowed_audiences.entries()) {
      if (!R14_AUDIENCES.includes(audience)) issue('AUDIENCE_UNRECOGNIZED', index);
      else if (seen.has(audience)) issue('AUDIENCE_DUPLICATE', index);
      else { seen.add(audience); result.allowedAudiences.push(audience); }
    }
  }
  if (!Array.isArray(registry.prompts)) { issue('PROMPTS_INVALID'); return result; }
  result.promptCount = registry.prompts.length;
  if (registry.prompts.length === 0 || registry.prompts.length > 100) {
    issue('PROMPT_COUNT_OUT_OF_BOUNDS'); return result;
  }
  const seenIds = new Set();
  for (const [index, prompt] of registry.prompts.entries()) {
    if (!r14Record(prompt)) { issue('PROMPT_INVALID', index); continue; }
    if (!R14_RISKS.includes(prompt.risk)) issue('RISK_UNRECOGNIZED', index);
    else result.riskCounts[prompt.risk]++;
    if (typeof prompt.id !== 'string' || prompt.id.length > 160 ||
        !/^[a-z]\d{2}_[a-z0-9_]+$/.test(prompt.id)) {
      issue('PROMPT_ID_INVALID', index); continue;
    }
    if (prompt.id[0] !== prefix) { issue('PROMPT_ENGINE_MISMATCH', index); continue; }
    if (seenIds.has(prompt.id)) { issue('PROMPT_ID_DUPLICATE', index); continue; }
    seenIds.add(prompt.id);
    const path = `ai/${engine}/prompts/${prompt.id}.md`;
    if (!approved.has(path)) { issue('PROMPT_ASSET_NOT_APPROVED', index); continue; }
    result.approvedPromptCount++;
    addAsset(path, index);
  }
  result.valid = result.issues.length === 0;
  if (result.valid) result.status = 'REGISTRY_STRUCTURE_PASS';
  return result;
}

function r14DependencyMap(value) {
  if (value === undefined) return { valid: true, count: 0, identity: '[]' };
  if (!r14Record(value)) return { valid: false, count: null, identity: null };
  const entries = Object.entries(value);
  if (entries.length > 5000 || entries.some(([key, item]) =>
    key.length > 256 || typeof item !== 'string' || item.length > 4096)) {
    return { valid: false, count: null, identity: null };
  }
  entries.sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0);
  return { valid: true, count: entries.length, identity: JSON.stringify(entries) };
}

function r14Resolved(value) {
  const result = { present: value !== undefined, officialNpmRegistry: false };
  if (typeof value !== 'string' || value.length > 4096) return result;
  try {
    const parsed = new URL(value);
    result.officialNpmRegistry = parsed.protocol === 'https:' &&
      parsed.hostname === 'registry.npmjs.org' && parsed.username === '' && parsed.password === '' &&
      parsed.port === '' && parsed.search === '' && parsed.hash === '';
  } catch { /* Return metadata only. */ }
  return result;
}

function r14PackageRecord(name, raw) {
  const parsed = r14Parse(raw);
  const result = { state: parsed.state, version: null, versionRecognized: false };
  if (parsed.state !== 'OBJECT') return { result, maps: null };
  const value = parsed.value;
  result.nameMatches = value.name === undefined ? null : value.name === name;
  result.version = r14Version(value.version);
  result.versionRecognized = result.version !== null;
  const maps = {};
  result.dependencyMaps = {};
  for (const field of R14_DEPENDENCY_FIELDS) {
    maps[field] = r14DependencyMap(value[field]);
    result.dependencyMaps[field] = { valid: maps[field].valid, count: maps[field].count };
  }
  result.resolved = r14Resolved(value.resolved);
  result.integrity = {
    present: value.integrity !== undefined,
    sha512Format: typeof value.integrity === 'string' && /^sha512-[A-Za-z0-9+/]{86}==$/.test(value.integrity),
  };
  const scripts = value.scripts;
  result.scripts = { present: scripts !== undefined, valid: true, count: 0, lifecycleNames: [], otherCount: 0 };
  if (scripts !== undefined) {
    if (!r14Record(scripts) || Object.keys(scripts).length > 1000 ||
        Object.values(scripts).some(command => typeof command !== 'string')) result.scripts.valid = false;
    else {
      result.scripts.count = Object.keys(scripts).length;
      result.scripts.lifecycleNames = R14_LIFECYCLE_NAMES.filter(key => Object.hasOwn(scripts, key));
      result.scripts.otherCount = result.scripts.count - result.scripts.lifecycleNames.length;
    }
  }
  result.bin = { present: value.bin !== undefined, valid: true, count: 0 };
  if (typeof value.bin === 'string') result.bin.count = 1;
  else if (value.bin !== undefined) {
    if (!r14Record(value.bin) || Object.keys(value.bin).length > 1000 ||
        Object.values(value.bin).some(path => typeof path !== 'string')) result.bin.valid = false;
    else result.bin.count = Object.keys(value.bin).length;
  }
  return { result, maps };
}

export function r14PackageSummary(name, installedJsonOrNull, lockEntryOrNull, hiddenLockEntryOrNull) {
  const safeName = typeof name === 'string' && name.length <= 128 &&
    /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(name) ? name : null;
  const sources = {
    installed: r14PackageRecord(safeName, installedJsonOrNull),
    locked: r14PackageRecord(safeName, lockEntryOrNull),
    hiddenLocked: r14PackageRecord(safeName, hiddenLockEntryOrNull),
  };
  function compare(left, right) {
    const a = sources[left], b = sources[right];
    const result = { versionMatch: null, dependencyMapsMatch: {} };
    if (a.result.versionRecognized && b.result.versionRecognized) result.versionMatch = a.result.version === b.result.version;
    for (const field of R14_DEPENDENCY_FIELDS) result.dependencyMapsMatch[field] =
      a.maps?.[field].valid && b.maps?.[field].valid ? a.maps[field].identity === b.maps[field].identity : null;
    return result;
  }
  return {
    name: safeName,
    status: safeName === null ? 'PACKAGE_NAME_UNRECOGNIZED' : 'PACKAGE_METADATA_ONLY',
    installed: sources.installed.result, locked: sources.locked.result, hiddenLocked: sources.hiddenLocked.result,
    comparisons: { installedToLock: compare('installed', 'locked'),
      installedToHiddenLock: compare('installed', 'hiddenLocked'), hiddenLockToLock: compare('hiddenLocked', 'locked') },
    scope: 'DECLARED_METADATA_ONLY_NOT_INSTALLED_TREE_INTEGRITY_OR_RUNTIME_QUALIFICATION',
  };
}
