import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const MAPS = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
const SELECTED = { '@vitejs/plugin-react': '6.1.0', resend: '6.22.1' };
const MAX_PACKAGES = 20000;
const MAX_FILES = 200000;
const MAX_BYTES = 4 * 1024 * 1024 * 1024;
const MAX_JSON = 32 * 1024 * 1024;
const exactVersion = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z][0-9A-Za-z.-]*)?(?:\+[0-9A-Za-z][0-9A-Za-z.-]*)?$/;
const part = /^(?!\.{1,2}$)[a-zA-Z0-9_][a-zA-Z0-9._-]*$/;
const packageName = /^(?:@[a-zA-Z0-9_][a-zA-Z0-9._-]*\/)?[a-zA-Z0-9_][a-zA-Z0-9._-]*$/;
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const own = (value, key) => Object.hasOwn(value, key);
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value)
  && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
const inside = (root, file) => file === root || file.startsWith(root + path.sep);
const sorted = values => [...values].sort();

function stop(code, file) {
  const error = new Error(code);
  error.code = code;
  if (typeof file === 'string' && file.length <= 2048 && !/[\x00-\x1f\x7f\\]/.test(file)
    && !path.isAbsolute(file) && !file.split('/').some(v => v === '..' || v === '.')) error.file = file;
  throw error;
}

function logicalPackagePath(file) {
  if (typeof file !== 'string' || file.length > 2048 || /[\x00-\x20\x7f\\]/.test(file)) return false;
  const parts = file.split('/');
  let cursor = 0;
  while (cursor < parts.length) {
    if (parts[cursor++] !== 'node_modules') return false;
    const name = parts[cursor++];
    if (name?.startsWith('@')) {
      if (!part.test(name.slice(1)) || !part.test(parts[cursor++] || '')) return false;
    } else if (!part.test(name || '')) return false;
  }
  return cursor === parts.length;
}

function registrySpecifier(value) {
  if (typeof value !== 'string' || value.length < 1 || value.length > 512 || value !== value.trim()) return false;
  if (value.startsWith('npm:')) {
    const alias = value.slice(4);
    const at = alias.lastIndexOf('@');
    if (at <= 0 || !packageName.test(alias.slice(0, at))) return false;
    return registrySpecifier(alias.slice(at + 1)) && !alias.slice(at + 1).startsWith('npm:');
  }
  if (/[\x00-\x1f\x7f:@/\\$]/.test(value)) return false;
  // npm tags and ordinary semver ranges stay within the fixed public registry.
  if (/^[A-Za-z][A-Za-z0-9._-]*$/.test(value)) return true;
  if (!/^[0-9vVxX*<>=~^| .+A-Za-z-]+$/.test(value)) return false;
  const normalized = value.replace(/([~^<>=]+)\s+(?=[vV\d*xX])/g, '$1');
  return normalized.split(/\s*\|\|\s*/).every(alt => /^[A-Za-z][A-Za-z0-9._-]*$/.test(alt)
    || (alt.length > 0 && alt.split(/\s+/).every(token => token === '-'
      || /^(?:[~^]|[<>]=?|=)?v?(?:\d+|[xX*])(?:\.(?:\d+|[xX*])){0,2}(?:-[0-9A-Za-z][0-9A-Za-z.-]*)?(?:\+[0-9A-Za-z][0-9A-Za-z.-]*)?$/.test(token))));
}

function dependencyMap(value, file) {
  if (value === undefined) return {};
  if (!object(value) || Object.keys(value).length > MAX_PACKAGES) stop('DEPENDENCY_MAP_INVALID', file);
  for (const [name, spec] of Object.entries(value)) {
    if (!packageName.test(name) || !registrySpecifier(spec)) stop('DEPENDENCY_SOURCE_UNSUPPORTED', file);
  }
  return value;
}

function canonicalMap(value) {
  return JSON.stringify(Object.fromEntries(Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)));
}

function forbiddenFeatures(record, file, platformExcludedBundle = false, excludedMember = false, dependencyEntry = false) {
  // npm maps active workspaces from the root project. Archive dependencies can
  // retain their publisher's workspace metadata; it does not activate a local
  // workspace in the consuming project. Links and non-registry edges stay denied.
  if (!dependencyEntry && own(record, 'workspaces')) stop('WORKSPACES_UNSUPPORTED', file);
  for (const name of ['link', 'inBundle', 'hasShrinkwrap']) {
    if (!(name === 'inBundle' && excludedMember && record[name] === true)
      && record[name] !== undefined && record[name] !== false) stop('LOCK_SOURCE_FEATURE_UNSUPPORTED', file);
  }
  for (const name of ['bundleDependencies', 'bundledDependencies']) {
    if (!platformExcludedBundle && record[name] !== undefined && record[name] !== false
      && !(Array.isArray(record[name]) && record[name].length === 0)) stop('BUNDLED_DEPENDENCIES_UNSUPPORTED', file);
  }
}

function excludedBundleDeclaration(entry, file) {
  const declared = ['bundleDependencies', 'bundledDependencies'].filter(key => entry[key] !== undefined && entry[key] !== false
    && !(Array.isArray(entry[key]) && entry[key].length === 0));
  if (!declared.length) return null;
  if (file !== 'node_modules/@tailwindcss/oxide-wasm32-wasi' || entry.optional !== true
    || JSON.stringify(entry.cpu) !== '["wasm32"]' || process.platform !== 'linux' || process.arch !== 'x64') return null;
  const names = new Set();
  for (const key of declared) {
    if (!Array.isArray(entry[key]) || entry[key].length > 100 || !entry[key].every(name => typeof name === 'string' && packageName.test(name))) return null;
    for (const name of entry[key]) names.add(name);
  }
  return { file, version: entry.version, reason: 'EXACT_OPTIONAL_WASM32_PACKAGE_EXCLUDED_ON_LINUX_X64',
    bundledDependencyCount: names.size, requiredState: 'DIRECTORY_ABSENT' };
}

// npm records bundled contents with inBundle=true. Those contents can omit a
// separate resolved/integrity pair because they belong to the parent archive.
// This release stage supports that representation ONLY inside the already
// excluded Tailwind wasm32 package. Its complete directory must remain absent.
export function classifyExcludedBundles(lock) {
  if (!object(lock) || !object(lock.packages)) stop('LOCK_IDENTITY_INVALID');
  const paths = sorted(Object.keys(lock.packages).filter(Boolean));
  if (paths.length > MAX_PACKAGES) stop('LOCK_PACKAGE_COUNT_LIMIT');
  for (const file of paths) {
    if (!logicalPackagePath(file)) stop('LOCK_PACKAGE_PATH_INVALID');
    if (!object(lock.packages[file])) stop('LOCK_PACKAGE_VERSION_INVALID', file);
  }
  const roots = [], members = [];
  for (const file of paths) {
    const root = excludedBundleDeclaration(lock.packages[file], file);
    if (!root) continue;
    const entry = lock.packages[file], rootName = file.slice(13);
    if (entry.name !== undefined && entry.name !== rootName) stop('EXCLUDED_BUNDLE_ROOT_NAME_MISMATCH', file);
    const declared = new Set(['bundleDependencies', 'bundledDependencies']
      .flatMap(key => Array.isArray(entry[key]) ? entry[key] : []));
    const contained = paths.filter(candidate => candidate.startsWith(file + '/node_modules/'));
    const containedSet = new Set(contained);
    if (contained.length > 1000) stop('EXCLUDED_BUNDLE_MEMBER_COUNT_LIMIT', file);
    for (const child of contained) {
      const meta = lock.packages[child], split = child.lastIndexOf('/node_modules/');
      const parent = child.slice(0, split), name = child.slice(split + 14);
      if (parent !== file && !containedSet.has(parent)) stop('EXCLUDED_BUNDLE_ANCESTOR_MISSING', child);
      if (meta.inBundle !== true) stop('EXCLUDED_BUNDLE_MARKER_MISSING', child);
      if (meta.name !== undefined && meta.name !== name) stop('EXCLUDED_BUNDLE_MEMBER_NAME_MISMATCH', child);
      if (own(meta, 'resolved') || own(meta, 'integrity')) stop('EXCLUDED_BUNDLE_ARCHIVE_FIELDS_UNSUPPORTED', child);
      // Invalid map/source metadata must never become an exemption by location.
      for (const field of MAPS) dependencyMap(meta[field], child);
    }
    const reachable = new Set(), pending = [];
    for (const name of declared) {
      const child = file + '/node_modules/' + name;
      if (containedSet.has(child)) { reachable.add(child); pending.push(child); }
    }
    for (let index = 0; index < pending.length; index++) {
      const child = pending[index], meta = lock.packages[child];
      for (const name of new Set(['dependencies', 'optionalDependencies', 'peerDependencies']
        .flatMap(key => Object.keys(meta[key] || {})))) {
        // Resolve only within this physical bundle; external dependencies keep
        // their own ordinary archive and installed-package requirements.
        let parent = child;
        while (parent === file || parent.startsWith(file + '/node_modules/')) {
          const target = parent + '/node_modules/' + name;
          if (containedSet.has(target)) {
            if (!reachable.has(target)) { reachable.add(target); pending.push(target); }
            break;
          }
          if (parent === file) break;
          parent = parent.slice(0, parent.lastIndexOf('/node_modules/'));
        }
      }
    }
    for (const child of contained) {
      if (!reachable.has(child)) stop('EXCLUDED_BUNDLE_MEMBER_UNREACHABLE', child);
      members.push({file: child, version: lock.packages[child].version, parentArchive: file,
        reason: 'DECLARED_BUNDLE_CONTENT_OF_EXCLUDED_WASM32_PARENT', requiredState: 'DIRECTORY_ABSENT'});
    }
    roots.push({...root, recordedBundledMembers: contained.length});
  }
  return {roots, members};
}

function overridesPolicy(overrides, rootDeps, depth = 0) {
  if (overrides === undefined) return;
  if (!object(overrides) || depth > 12 || Object.keys(overrides).length > MAX_PACKAGES) stop('OVERRIDES_INVALID');
  for (const [name, value] of Object.entries(overrides)) {
    let validKey = name === '.';
    if (!validKey) {
      const at = name.lastIndexOf('@');
      validKey = packageName.test(name)
        || (at > 0 && packageName.test(name.slice(0, at)) && registrySpecifier(name.slice(at + 1)));
    }
    if (!validKey) stop('OVERRIDE_SELECTOR_UNSUPPORTED');
    if (object(value)) overridesPolicy(value, rootDeps, depth + 1);
    else if (typeof value === 'string' && value.startsWith('$')) {
      if (!packageName.test(value.slice(1)) || !own(rootDeps, value.slice(1))) stop('OVERRIDE_REFERENCE_UNSUPPORTED');
    } else if (!registrySpecifier(value)) stop('OVERRIDE_SOURCE_UNSUPPORTED');
  }
}

function archivePolicy(entry, file) {
  if (typeof entry.resolved !== 'string' || entry.resolved.length > 2048) stop('ARCHIVE_URL_INVALID', file);
  let url;
  try { url = new URL(entry.resolved); } catch { stop('ARCHIVE_URL_INVALID', file); }
  if (url.href !== entry.resolved || url.protocol !== 'https:' || url.hostname !== 'registry.npmjs.org'
    || url.username || url.password || url.port || url.search || url.hash
    || !/^\/(?:@[A-Za-z0-9_.-]+\/)?[A-Za-z0-9_.-]+\/-\/[A-Za-z0-9_.+-]+\.tgz$/.test(url.pathname)) {
    stop('ARCHIVE_URL_NOT_ALLOWED', file);
  }
  if (typeof entry.integrity !== 'string' || !/^sha512-[A-Za-z0-9+/]{86}==$/.test(entry.integrity)) stop('ARCHIVE_INTEGRITY_INVALID', file);
  const decoded = Buffer.from(entry.integrity.slice(7), 'base64');
  if (decoded.length !== 64 || decoded.toString('base64') !== entry.integrity.slice(7)) stop('ARCHIVE_INTEGRITY_INVALID', file);
}

export function validateLock(manifest, lock) {
  if (!object(manifest) || manifest.name !== 'mymentalhealthbuddy' || !exactVersion.test(manifest.version || '')) stop('MANIFEST_IDENTITY_INVALID');
  if (!object(lock) || lock.lockfileVersion !== 3 || lock.name !== manifest.name || lock.version !== manifest.version
    || !object(lock.packages) || !object(lock.packages[''])) stop('LOCK_IDENTITY_INVALID');
  const root = lock.packages[''];
  if (root.name !== manifest.name || root.version !== manifest.version) stop('LOCK_ROOT_IDENTITY_MISMATCH');
  forbiddenFeatures(manifest, 'package.json');
  forbiddenFeatures(root, 'package-lock.json');
  if (manifest.packageManager !== undefined && !/^npm@\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(manifest.packageManager)) stop('PACKAGE_MANAGER_UNSUPPORTED');
  if (object(manifest.devEngines) && manifest.devEngines.packageManager !== undefined) {
    const managers = Array.isArray(manifest.devEngines.packageManager) ? manifest.devEngines.packageManager : [manifest.devEngines.packageManager];
    if (!managers.every(v => object(v) && v.name === 'npm')) stop('PACKAGE_MANAGER_UNSUPPORTED');
  }
  const rootDeps = {};
  for (const field of MAPS) {
    const a = dependencyMap(manifest[field], 'package.json');
    const b = dependencyMap(root[field], 'package-lock.json');
    if (canonicalMap(a) !== canonicalMap(b)) stop('ROOT_DEPENDENCY_MAP_MISMATCH');
    Object.assign(rootDeps, a);
  }
  overridesPolicy(manifest.overrides, rootDeps);
  const paths = sorted(Object.keys(lock.packages).filter(Boolean));
  if (paths.length === 0 || paths.length > MAX_PACKAGES) stop('LOCK_PACKAGE_COUNT_LIMIT');
  let optionalCount = 0;
  const bundles = classifyExcludedBundles(lock);
  const platformExcludedBundleDeclarations = bundles.roots;
  const excludedMembers = new Set(bundles.members.map(entry => entry.file));
  const dependencyWorkspaceMetadata = [];
  for (const file of paths) {
    const entry = lock.packages[file];
    if (!logicalPackagePath(file)) stop('LOCK_PACKAGE_PATH_INVALID');
    if (!object(entry) || !exactVersion.test(entry.version || '')) stop('LOCK_PACKAGE_VERSION_INVALID', file);
    if (entry.name !== undefined && !packageName.test(entry.name)) stop('LOCK_PACKAGE_NAME_INVALID', file);
    const excluded = excludedBundleDeclaration(entry, file);
    forbiddenFeatures(entry, file, !!excluded, excludedMembers.has(file), true);
    if (own(entry, 'workspaces')) {
      const metadata = entry.workspaces;
      dependencyWorkspaceMetadata.push({file, version:entry.version,
        kind:Array.isArray(metadata) ? 'ARRAY' : metadata === null ? 'NULL' : typeof metadata,
        sha256:hash(JSON.stringify(metadata)), scope:'DEPENDENCY_METADATA_NOT_ROOT_WORKSPACE_CONFIGURATION'});
    }
    for (const field of MAPS) dependencyMap(entry[field], file);
    for (const field of ['optional', 'devOptional', 'dev', 'peer']) {
      if (entry[field] !== undefined && typeof entry[field] !== 'boolean') stop('LOCK_PACKAGE_FLAG_INVALID', file);
    }
    if (!excludedMembers.has(file)) archivePolicy(entry, file);
    if (entry.optional === true) optionalCount++;
  }
  const selectedLocked = Object.entries(SELECTED).map(([name, version]) => {
    const file = `node_modules/${name}`;
    if (lock.packages[file]?.version !== version) stop('SELECTED_LOCK_VERSION_MISMATCH', file);
    return { name, version, file };
  });
  return { status: 'LOCK_POLICY_PASS', packageCount: paths.length, optionalCount, selectedLocked, lockPaths: paths,
    platformExcludedBundleDeclarations, platformExcludedBundledMembers: bundles.members, dependencyWorkspaceMetadata };
}

function statMaybe(file) {
  try { return fs.lstatSync(file); } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}

function fileRecord(absolute, relative, json = false) {
  const before = fs.lstatSync(absolute);
  if (!before.isFile() || before.isSymbolicLink()) stop('INSTALLED_FILE_NOT_REGULAR', relative);
  if (before.size > MAX_BYTES || (json && before.size > MAX_JSON)) stop('INSTALLED_FILE_SIZE_LIMIT', relative);
  let fd;
  try {
    fd = fs.openSync(absolute, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
    const opened = fs.fstatSync(fd);
    if (!opened.isFile() || opened.dev !== before.dev || opened.ino !== before.ino) stop('INSTALLED_FILE_CHANGED', relative);
    const digest = crypto.createHash('sha256');
    const chunk = Buffer.allocUnsafe(1024 * 1024);
    const buffers = [];
    let bytes = 0;
    while (true) {
      const read = fs.readSync(fd, chunk, 0, chunk.length, null);
      if (!read) break;
      bytes += read;
      if (bytes > MAX_BYTES || (json && bytes > MAX_JSON)) stop('INSTALLED_FILE_SIZE_LIMIT', relative);
      digest.update(chunk.subarray(0, read));
      if (json) buffers.push(Buffer.from(chunk.subarray(0, read)));
    }
    const after = fs.fstatSync(fd);
    const pathAfter = fs.lstatSync(absolute);
    if (after.dev !== before.dev || after.ino !== before.ino || after.size !== bytes || before.size !== bytes
      || after.mtimeMs !== before.mtimeMs || after.ctimeMs !== before.ctimeMs || after.mode !== before.mode
      || pathAfter.dev !== before.dev || pathAfter.ino !== before.ino || !pathAfter.isFile() || pathAfter.isSymbolicLink()) stop('INSTALLED_FILE_CHANGED', relative);
    const record = { file: relative, type: 'file', sha256: digest.digest('hex'), bytes, mode: after.mode };
    return json ? { record, text: Buffer.concat(buffers).toString('utf8') } : record;
  } finally { if (fd !== undefined) fs.closeSync(fd); }
}

function readJSON(absolute, relative) {
  const result = fileRecord(absolute, relative, true);
  try { result.value = JSON.parse(result.text); } catch { stop('INSTALLED_JSON_INVALID', relative); }
  if (!object(result.value)) stop('INSTALLED_JSON_INVALID', relative);
  delete result.text;
  return result;
}

function assertNoLinkAncestors(root, target, relative) {
  if (!inside(root, target)) stop('INSTALLED_PATH_ESCAPES_STAGE', relative);
  const parts = path.relative(root, target).split(path.sep).filter(Boolean);
  let cursor = root;
  for (let index = 0; index < parts.length; index++) {
    cursor = path.join(cursor, parts[index]);
    const stat = statMaybe(cursor);
    if (!stat) return false;
    if (stat.isSymbolicLink()) stop('INSTALLED_PATH_SYMLINK', relative);
    if (index < parts.length - 1 && !stat.isDirectory()) stop('INSTALLED_ANCESTOR_NOT_DIRECTORY', relative);
  }
  return true;
}

function inventory(stage, modules) {
  const manifest = [];
  const logicalDirectories = new Set();
  let bytes = 0;
  let entries = 0;
  function add(record) {
    manifest.push(record);
    bytes += record.bytes;
    if (manifest.length > MAX_FILES || bytes > MAX_BYTES) stop('INSTALLED_TREE_LIMIT');
  }
  function walk(directory, depth = 0) {
    if (depth > 100) stop('INSTALLED_TREE_DEPTH_LIMIT');
    for (const name of sorted(fs.readdirSync(directory))) {
      if (++entries > MAX_FILES * 2) stop('INSTALLED_TREE_ENTRY_LIMIT');
      if (name.length > 512 || /[\x00-\x1f\x7f\\]/.test(name) || name === '.' || name === '..') stop('INSTALLED_TREE_NAME_INVALID');
      const absolute = path.join(directory, name);
      const relative = path.relative(stage, absolute).split(path.sep).join('/');
      if (relative.length > 4096) stop('INSTALLED_TREE_PATH_LIMIT');
      const stat = fs.lstatSync(absolute);
      if (stat.isSymbolicLink()) {
        if (path.basename(directory) !== '.bin' || !part.test(name)) stop('INSTALLED_SYMLINK_NOT_BIN', relative);
        const link = fs.readlinkSync(absolute);
        if (!link || link.length > 2048 || path.isAbsolute(link) || /[\x00-\x1f\x7f\\]/.test(link)) stop('INSTALLED_BIN_LINK_INVALID', relative);
        const targetAbsolute = path.resolve(directory, link);
        if (!inside(modules, targetAbsolute)) stop('INSTALLED_BIN_LINK_ESCAPES', relative);
        if (!assertNoLinkAncestors(modules, targetAbsolute, relative)) stop('INSTALLED_BIN_TARGET_MISSING', relative);
        const target = path.relative(stage, targetAbsolute).split(path.sep).join('/');
        const targetRecord = fileRecord(targetAbsolute, target);
        if (fs.readlinkSync(absolute) !== link || !fs.lstatSync(absolute).isSymbolicLink()) stop('INSTALLED_BIN_LINK_CHANGED', relative);
        add({ file: relative, type: 'symlink', link, linkSha256: hash(link), bytes: Buffer.byteLength(link), mode: stat.mode,
          target, targetSha256: targetRecord.sha256, targetBytes: targetRecord.bytes });
      } else if (stat.isDirectory()) {
        if (logicalPackagePath(relative)) logicalDirectories.add(relative);
        walk(absolute, depth + 1);
      } else if (stat.isFile()) add(fileRecord(absolute, relative));
      else stop('INSTALLED_SPECIAL_FILE', relative);
    }
  }
  walk(modules);
  manifest.sort((a, b) => a.file < b.file ? -1 : a.file > b.file ? 1 : 0);
  return { manifest, logicalDirectories, bytes };
}

export function inspectInstalled(stage, lock) {
  if (typeof stage !== 'string' || !path.isAbsolute(stage)) stop('STAGE_PATH_INVALID');
  stage = path.resolve(stage);
  if (fs.realpathSync(stage) !== stage || !fs.lstatSync(stage).isDirectory()) stop('STAGE_PATH_NOT_CANONICAL');
  const root = lock?.packages?.[''];
  const policy = validateLock(root, lock);
  const modules = path.join(stage, 'node_modules');
  if (!assertNoLinkAncestors(stage, modules, 'node_modules') || !fs.lstatSync(modules).isDirectory()) stop('NODE_MODULES_MISSING');
  const observed = new Map();
  const installed = [];
  const absentOptional = [];
  const excludedPackages = new Set([...policy.platformExcludedBundleDeclarations,
    ...policy.platformExcludedBundledMembers].map(entry => entry.file));
  for (const file of policy.lockPaths) {
    const entry = lock.packages[file];
    const relative = `${file}/package.json`;
    const absolute = path.join(stage, relative);
    if (excludedPackages.has(file)) {
      if (assertNoLinkAncestors(modules, path.join(stage, file), file)) stop('PLATFORM_EXCLUDED_PACKAGE_PRESENT', file);
      absentOptional.push({ file, version: entry.version, optional: entry.optional === true, devOptional: entry.devOptional === true,
        state: 'PLATFORM_EXCLUDED_OPTIONAL_DIRECTORY_ABSENT', platformExcluded: true });
      continue;
    }
    if (!assertNoLinkAncestors(modules, absolute, relative)) {
      if (entry.optional === true) {
        absentOptional.push({ file, version: entry.version, optional: entry.optional === true, devOptional: entry.devOptional === true,
          state: 'ABSENT_OPTIONAL_NOT_FUNCTIONALLY_QUALIFIED' });
        continue;
      }
      stop('REQUIRED_LOCKED_PACKAGE_MISSING', file);
    }
    const data = readJSON(absolute, relative);
    if (data.value.version !== entry.version) stop('INSTALLED_VERSION_MISMATCH', file);
    const expectedName = entry.name ?? file.slice(file.lastIndexOf('node_modules/') + 'node_modules/'.length);
    if (!packageName.test(data.value.name || '') || data.value.name !== expectedName) stop('INSTALLED_PACKAGE_NAME_MISMATCH', file);
    observed.set(relative, data.record);
    installed.push({ file, name: data.value.name, version: data.value.version, packageJsonSha256: data.record.sha256 });
  }
  const hiddenRelative = 'node_modules/.package-lock.json';
  const hidden = readJSON(path.join(stage, hiddenRelative), hiddenRelative);
  observed.set(hiddenRelative, hidden.record);
  if (hidden.value.lockfileVersion !== 3 || !object(hidden.value.packages)) stop('HIDDEN_LOCK_INVALID');
  const installedPaths = new Set(installed.map(record => record.file));
  const absentPaths = new Set(absentOptional.map(record => record.file));
  const hiddenAbsentOptional = [];
  let hiddenEntries = 0;
  for (const [file, entry] of Object.entries(hidden.value.packages)) {
    if (!file) stop('HIDDEN_LOCK_UNEXPECTED_ROOT');
    if (++hiddenEntries > MAX_PACKAGES || !logicalPackagePath(file) || !own(lock.packages, file) || !object(entry)) stop('HIDDEN_LOCK_UNEXPECTED_PACKAGE');
    if (entry.version !== lock.packages[file].version || entry.link === true) stop('HIDDEN_LOCK_VERSION_OR_LINK_MISMATCH', file);
    if (entry.inBundle !== undefined && entry.inBundle !== lock.packages[file].inBundle) stop('HIDDEN_LOCK_BUNDLE_MARKER_MISMATCH', file);
    if (entry.resolved !== undefined && entry.resolved !== lock.packages[file].resolved) stop('HIDDEN_LOCK_ARCHIVE_MISMATCH', file);
    if (entry.integrity !== undefined && entry.integrity !== lock.packages[file].integrity) stop('HIDDEN_LOCK_INTEGRITY_MISMATCH', file);
    if (!installedPaths.has(file)) {
      if (!absentPaths.has(file)) stop('HIDDEN_LOCK_PACKAGE_MISSING', file);
      hiddenAbsentOptional.push(file);
    }
  }
  for (const file of installedPaths) if (!own(hidden.value.packages, file)) stop('HIDDEN_LOCK_MISSING_INSTALLED_PACKAGE', file);
  const tree = inventory(stage, modules);
  const byFile = new Map(tree.manifest.map(record => [record.file, record]));
  for (const [file, before] of observed) {
    const after = byFile.get(file);
    if (!after || after.type !== 'file' || after.sha256 !== before.sha256 || after.bytes !== before.bytes || after.mode !== before.mode) stop('INSTALLED_METADATA_CHANGED', file);
  }
  for (const file of tree.logicalDirectories) {
    if (!own(lock.packages, file)) stop('INSTALLED_UNEXPECTED_PACKAGE_DIRECTORY', file);
    if (!installedPaths.has(file)) stop('INSTALLED_PACKAGE_DIRECTORY_WITHOUT_METADATA', file);
  }
  const selected = policy.selectedLocked.map(expected => {
    const actual = installed.find(record => record.file === expected.file);
    if (!actual) stop('SELECTED_INSTALLED_PACKAGE_MISSING', expected.file);
    return { ...actual, expectedVersion: expected.version, versionMatch: actual.version === expected.version };
  });
  return {
    status: 'PRIVATE_LOCKED_DEPENDENCIES_INSPECTED',
    packageSummary: { locked: policy.packageCount, installed: installed.length, absentOptional: absentOptional.length },
    selected, installed, absentOptional,
    platformExcludedBundleDeclarations: policy.platformExcludedBundleDeclarations,
    platformExcludedBundledMembers: policy.platformExcludedBundledMembers,
    dependencyWorkspaceMetadata: policy.dependencyWorkspaceMetadata,
    hiddenLock: { status: hiddenAbsentOptional.length ? 'MATCHED_WITH_ABSENT_OPTIONAL_ENTRIES_REPORTED' : 'MATCHED_TO_INSTALLED_TREE',
      entries: hiddenEntries, absentOptionalEntries: hiddenAbsentOptional, sha256: hidden.record.sha256,
      scope: 'PATH_VERSION_AND_AVAILABLE_ARCHIVE_METADATA_NOT_FILESYSTEM_CONTENT_INTEGRITY' },
    fileManifest: tree.manifest, files: tree.manifest.length, bytes: tree.bytes,
    manifestSha256: hash(JSON.stringify(tree.manifest)),
    scope: 'LOCKED_VERSION_METADATA_AND_OBSERVED_INSTALLED_FILE_BYTES_NOT_PACKAGE_EXECUTION_OR_REPRODUCIBLE_BUILD',
    limits: { maxFiles: MAX_FILES, maxBytes: MAX_BYTES, maxPackages: MAX_PACKAGES }
  };
}
