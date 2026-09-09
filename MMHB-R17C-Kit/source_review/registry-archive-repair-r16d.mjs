import https from 'node:https';
import crypto from 'node:crypto';

const HOST = 'registry.npmjs.org';
const ORIGIN = `https://${HOST}`;
const NAME = /^(?:@[A-Za-z0-9_][A-Za-z0-9._-]*\/)?[A-Za-z0-9_][A-Za-z0-9._-]*$/;
const VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z][0-9A-Za-z.-]*)?(?:\+[0-9A-Za-z][0-9A-Za-z.-]*)?$/;
const SRI = /^sha512-[A-Za-z0-9+/]{86}==$/;
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const obj = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const copy = x => JSON.parse(JSON.stringify(x));
const problem = (code, file) => Object.assign(new Error(code), {code, ...(file ? {file} : {})});
const requireThat = (ok, code, file) => { if (!ok) throw problem(code, file); };
const signature = x => sha(JSON.stringify(x));

function identityFor(file, entry) {
  requireThat(typeof file === 'string' && file.length <= 2048
    && /^(?:node_modules\/(?:@[A-Za-z0-9_][A-Za-z0-9._-]*\/)?[A-Za-z0-9_][A-Za-z0-9._-]*\/)*node_modules\/(?:@[A-Za-z0-9_][A-Za-z0-9._-]*\/)?[A-Za-z0-9_][A-Za-z0-9._-]*$/.test(file), 'ARCHIVE_PACKAGE_PATH_INVALID');
  requireThat(obj(entry), 'ARCHIVE_PACKAGE_ENTRY_INVALID', file);
  const name = entry.name ?? file.slice(file.lastIndexOf('node_modules/') + 13);
  requireThat(typeof name === 'string' && name.length <= 214 && NAME.test(name), 'ARCHIVE_PACKAGE_NAME_INVALID', file);
  requireThat(typeof entry.version === 'string' && entry.version.length <= 100 && VERSION.test(entry.version), 'ARCHIVE_PACKAGE_VERSION_INVALID', file);
  requireThat(typeof entry.integrity === 'string' && SRI.test(entry.integrity)
    && Buffer.from(entry.integrity.slice(7), 'base64').toString('base64') === entry.integrity.slice(7), 'ARCHIVE_INTEGRITY_INVALID', file);
  const url = `${ORIGIN}/${name}/-/${name.split('/').pop()}-${entry.version}.tgz`;
  return {name, version:entry.version, integrity:entry.integrity, url};
}

// Only addresses change. The same locked names, versions and SHA-512 digests must
// be available from the official registry; an old mirror is never contacted.
export function planArchiveRepair(manifest, original, validateLock, classifyExcludedBundles = () => ({members:[]})) {
  requireThat(obj(original) && obj(original.packages), 'ARCHIVE_LOCK_INVALID');
  const paths = Object.keys(original.packages).filter(Boolean).sort();
  requireThat(paths.length > 0 && paths.length <= 20000, 'ARCHIVE_PACKAGE_COUNT_LIMIT');
  const normalized = copy(original), changes = [], groups = new Map(), identities = new Map();
  const excludedMembers = new Set(classifyExcludedBundles(original).members.map(entry => entry.file));
  for (const file of paths) {
    if (excludedMembers.has(file)) continue;
    const entry = original.packages[file], id = identityFor(file, entry);
    const key = `${id.name}@${id.version}`;
    requireThat(!identities.has(key) || identities.get(key) === id.integrity, 'ARCHIVE_DUPLICATE_INTEGRITY_CONFLICT', file);
    identities.set(key, id.integrity);
    requireThat(typeof entry.resolved === 'string' && entry.resolved.length <= 2048
      && entry.resolved === entry.resolved.trim() && !/[\x00-\x20\x7f\\]/.test(entry.resolved), 'ARCHIVE_ORIGINAL_URL_INVALID', file);
    let old;
    try { old = new URL(entry.resolved); } catch { throw problem('ARCHIVE_ORIGINAL_URL_INVALID', file); }
    requireThat(['http:', 'https:'].includes(old.protocol) && !!old.hostname
      && !old.username && !old.password && !old.search && !old.hash, 'ARCHIVE_ORIGINAL_SOURCE_UNSUPPORTED', file);
    if (entry.resolved === id.url) continue;
    normalized.packages[file].resolved = id.url;
    changes.push({file, name:id.name, version:id.version, integrity:id.integrity,
      originalUrlSha256:sha(entry.resolved), resolved:id.url});
    if (!groups.has(key)) groups.set(key, {...id, file, paths:[]});
    groups.get(key).paths.push(file);
  }
  // This checks the entire proposed tree, including every original non-URL field.
  // It is not an authorization to install until registry verification completes.
  const policy = validateLock(manifest, normalized);
  const plan = {status:'ARCHIVE_REPAIR_PLANNED_NOT_VERIFIED', originalObjectSha256:signature(original),
    normalizedObjectSha256:signature(normalized), changedEntries:changes.length,
    packageCount:paths.length, excludedBundledMembers:policy.platformExcludedBundledMembers ?? [],
    requests: [...groups.values()], changes, normalized,
    proposedLockPolicy:policy};
  assertOnlyResolvedChanges(original, plan);
  return plan;
}

export function assertOnlyResolvedChanges(original, plan) {
  requireThat(signature(original) === plan.originalObjectSha256, 'ARCHIVE_ORIGINAL_OBJECT_CHANGED');
  requireThat(signature(plan.normalized) === plan.normalizedObjectSha256, 'ARCHIVE_NORMALIZED_OBJECT_CHANGED');
  const reconstructed = copy(plan.normalized), seen = new Set();
  for (const row of plan.changes) {
    requireThat(!seen.has(row.file) && Object.hasOwn(original.packages, row.file), 'ARCHIVE_CHANGE_SET_INVALID');
    seen.add(row.file);
    const old = original.packages[row.file], next = reconstructed.packages[row.file], id = identityFor(row.file, old);
    requireThat(next && next.resolved === id.url && row.resolved === id.url && old.resolved !== id.url
      && row.name === id.name && row.version === id.version && row.integrity === id.integrity
      && row.originalUrlSha256 === sha(old.resolved), 'ARCHIVE_CHANGE_SET_INVALID', row.file);
    next.resolved = old.resolved;
  }
  requireThat(plan.changedEntries === seen.size && signature(reconstructed) === signature(original), 'ARCHIVE_NON_URL_CHANGE');
}

// Built-in HTTPS only. No proxy, npmrc, authentication, redirect following or
// environment-derived request destination. Limits also apply to streamed bodies.
export function createRegistryClient(signal) {
  const agent = new https.Agent({keepAlive:true, maxSockets:4, maxFreeSockets:4});
  const stats = {requests:0, bytes:0, metadataResponses:0, archiveResponses:0};
  let closed = false;
  const active = new Set();
  const close = () => {
    closed = true;
    for (const req of active) req.destroy(problem('REGISTRY_REQUEST_CANCELLED'));
    agent.destroy();
  };
  async function request(url, archive = false) {
    let parsed;
    try { parsed = new URL(url); } catch { throw problem('REGISTRY_DESTINATION_INVALID'); }
    requireThat(parsed.href === url && parsed.origin === ORIGIN && !parsed.username && !parsed.password
      && !parsed.search && !parsed.hash && !parsed.port, 'REGISTRY_DESTINATION_INVALID');
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await new Promise((resolve, reject) => {
          if (closed || signal?.aborted) { reject(problem('REGISTRY_REQUEST_CANCELLED')); return; }
          let req, timer, done = false, bytes = 0;
          const maxBytes = archive ? 64*1024*1024 : 2*1024*1024;
          const buffers = [], digest = crypto.createHash(archive ? 'sha512' : 'sha256');
          function finish(error, value) {
            if (done) return;
            done = true; clearTimeout(timer); signal?.removeEventListener('abort', abort);
            if (req) active.delete(req);
            if (error) { req?.destroy(); reject(error); } else resolve(value);
          }
          const abort = () => finish(problem('REGISTRY_REQUEST_CANCELLED'));
          signal?.addEventListener('abort', abort, {once:true});
          stats.requests++;
          try {
            req = https.request({protocol:'https:', hostname:HOST, port:443, method:'GET',
              path:parsed.pathname, servername:HOST, rejectUnauthorized:true, agent,
              headers:{Accept:archive ? 'application/octet-stream' : 'application/json',
                'Accept-Encoding':'identity', 'User-Agent':'MyMentalHealthBuddy-release-r16d'}}, res => {
              if (done) { res.destroy(); return; }
              if (res.statusCode !== 200) {
                const error = problem(`REGISTRY_HTTP_${Number.isInteger(res.statusCode) ? res.statusCode : 'INVALID'}`);
                error.retryable = [429,500,502,503,504].includes(res.statusCode);
                res.destroy(); finish(error); return;
              }
              if (res.headers['content-encoding'] && res.headers['content-encoding'] !== 'identity') {
                res.destroy(); finish(problem('REGISTRY_CONTENT_ENCODING_UNSUPPORTED')); return;
              }
              const contentLength = res.headers['content-length'];
              if (contentLength !== undefined && (!/^\d+$/.test(contentLength) || Number(contentLength) > maxBytes)) {
                res.destroy(); finish(problem('REGISTRY_RESPONSE_SIZE_LIMIT')); return;
              }
              res.on('data', chunk => {
                if (done) return;
                bytes += chunk.length; stats.bytes += chunk.length;
                if (bytes > maxBytes || stats.bytes > 512*1024*1024) {
                  res.destroy(); finish(problem('REGISTRY_RESPONSE_SIZE_LIMIT')); return;
                }
                digest.update(chunk); if (!archive) buffers.push(chunk);
              });
              res.once('aborted', () => finish(problem('REGISTRY_RESPONSE_INCOMPLETE')));
              res.once('error', () => finish(problem('REGISTRY_RESPONSE_ERROR')));
              res.once('end', () => {
                if (done) return;
                if (!res.complete || (contentLength !== undefined && Number(contentLength) !== bytes)) {
                  finish(problem('REGISTRY_RESPONSE_INCOMPLETE')); return;
                }
                if (archive) {
                  stats.archiveResponses++;
                  finish(null, {bytes, integrity:'sha512-'+digest.digest('base64')});
                } else {
                  let value;
                  try { value = JSON.parse(Buffer.concat(buffers).toString('utf8')); }
                  catch { finish(problem('REGISTRY_JSON_INVALID')); return; }
                  stats.metadataResponses++;
                  finish(null, {value, bytes, sha256:digest.digest('hex')});
                }
              });
            });
            active.add(req);
            req.once('error', raw => {
              const error = problem('REGISTRY_CONNECTION_FAILED');
              error.retryable = ['ECONNRESET','EAI_AGAIN','ETIMEDOUT'].includes(raw?.code);
              finish(error);
            });
            timer = setTimeout(() => finish(problem('REGISTRY_REQUEST_TIMEOUT')), 30000);
            req.end();
          } catch { finish(problem('REGISTRY_REQUEST_SETUP_FAILED')); }
        });
      } catch (error) {
        if (attempt || !error.retryable || closed || signal?.aborted) throw error;
        await new Promise(resolve => {
          const timer = setTimeout(done, 2000);
          function done() { clearTimeout(timer); signal?.removeEventListener('abort', done); resolve(); }
          signal?.addEventListener('abort', done, {once:true});
          if (signal?.aborted) done();
        });
      }
    }
  }
  return {stats, close, getMetadata:url=>request(url), getArchive:url=>request(url, true)};
}

export async function verifyArchiveSources(plan, {signal, onProgress = () => {}, clientFactory = createRegistryClient} = {}) {
  const controller = new AbortController(), started = Date.now();
  const cancel = () => controller.abort();
  signal?.addEventListener('abort', cancel, {once:true});
  if (signal?.aborted) cancel();
  const client = clientFactory(controller.signal), receipts = [];
  let cursor = 0, failure, deadlineReached = false;
  const deadline = setTimeout(() => { deadlineReached = true; cancel(); }, 10*60*1000);
  const heartbeat = setInterval(() => {
    try { onProgress({verified:receipts.length, total:plan.requests.length,
      requests:client.stats.requests, elapsedSeconds:Math.floor((Date.now()-started)/1000)}); }
    catch { failure ??= problem('REGISTRY_PROGRESS_WRITE_FAILED'); cancel(); }
  }, 30000);
  async function worker() {
    while (!controller.signal.aborted && cursor < plan.requests.length) {
      const id = plan.requests[cursor++];
      try {
        const encodedName = id.name.startsWith('@') ? '@'+encodeURIComponent(id.name.slice(1)) : encodeURIComponent(id.name);
        const metadataUrl = `${ORIGIN}/${encodedName}/${encodeURIComponent(id.version)}`;
        const received = await client.getMetadata(metadataUrl), meta = received.value;
        requireThat(obj(meta) && meta.name === id.name && meta.version === id.version, 'REGISTRY_PACKAGE_IDENTITY_MISMATCH', id.file);
        requireThat(obj(meta.dist) && meta.dist.tarball === id.url, 'REGISTRY_TARBALL_IDENTITY_MISMATCH', id.file);
        let verification = 'REGISTRY_SHA512_METADATA_MATCH', archive;
        if (meta.dist.integrity !== id.integrity) {
          // Old metadata can lack SHA-512. In that case compare actual archive
          // bytes to the unchanged lock digest; never downgrade to SHA-1.
          requireThat(meta.dist.integrity === undefined || (typeof meta.dist.integrity === 'string'
            && /^sha1-[A-Za-z0-9+/]{27}=$/.test(meta.dist.integrity)), 'REGISTRY_INTEGRITY_MISMATCH', id.file);
          archive = await client.getArchive(id.url);
          requireThat(archive.integrity === id.integrity, 'REGISTRY_ARCHIVE_SHA512_MISMATCH', id.file);
          verification = 'REGISTRY_ARCHIVE_BYTES_SHA512_MATCH';
        }
        receipts.push({name:id.name, version:id.version, paths:id.paths, metadataUrl,
          metadataSha256:received.sha256, metadataBytes:received.bytes, tarball:id.url,
          integrity:id.integrity, verification, ...(archive ? {archiveBytes:archive.bytes} : {}),
          observedAt:new Date().toISOString()});
      } catch (error) {
        failure ??= Object.assign(problem(/^[A-Z][A-Z0-9_]{0,90}$/.test(error.code || '') ? error.code : 'REGISTRY_VERIFICATION_FAILED', id.file), {});
        cancel();
      }
    }
  }
  try {
    await Promise.all(Array.from({length:Math.min(4, plan.requests.length)}, worker));
  } finally {
    clearInterval(heartbeat); clearTimeout(deadline); signal?.removeEventListener('abort', cancel); client.close();
  }
  if (deadlineReached) failure = problem('REGISTRY_VERIFICATION_TIMEOUT');
  if (signal?.aborted) failure = problem('REGISTRY_VERIFICATION_INTERRUPTED');
  if (!failure && receipts.length !== plan.requests.length) failure = problem('REGISTRY_VERIFICATION_INCOMPLETE');
  const evidence = {status:failure ? 'ARCHIVE_SOURCES_NOT_VERIFIED' : 'ARCHIVE_SOURCES_VERIFIED',
    changedEntries:plan.changedEntries, uniqueSourcesRequired:plan.requests.length,
    uniqueSourcesVerified:receipts.length, ...client.stats, durationMs:Date.now()-started,
    receipts:receipts.sort((a,b)=>(a.name+'@'+a.version).localeCompare(b.name+'@'+b.version)),
    scope:'CHANGED_URLS_MATCH_PUBLIC_REGISTRY_IDENTITY_AND_ORIGINAL_SHA512_NOT_PUBLISHER_OR_VULNERABILITY_AUDIT'};
  if (failure) { failure.sourceResult = evidence; throw failure; }
  return evidence;
}
