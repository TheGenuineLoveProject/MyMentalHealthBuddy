import crypto from 'node:crypto';
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const stop = code => { throw Object.assign(new Error(code),{code}); };
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

const shape = /^\/(?:@[A-Za-z0-9_.-]+\/)?[A-Za-z0-9_.-]+\/-\/[A-Za-z0-9_.+-]+\.tgz$/;
const safeVersion = v => typeof v==='string'&&/^[0-9A-Za-z.+-]{1,100}$/.test(v)?v:null;
const safeName = n => typeof n==='string'&&/^(?:@[A-Za-z0-9_.-]+\/)?[A-Za-z0-9_.-]+$/.test(n)?n:null;
const safeFile = s => typeof s==='string'&&s.length<=500&&/^node_modules\/(?:[A-Za-z0-9_@.-]+\/)*[A-Za-z0-9_.-]+$/.test(s)&&!s.split('/').some(p=>p==='.'||p==='..')?s:'REDACTED_'+hash(String(s)).slice(0,12);
export function diagnose(entry, file){
  const e=entry&&typeof entry==='object'&&!Array.isArray(entry)?entry:{};
  const out={file:safeFile(file),version:safeVersion(e.version),archivePolicy:'PASS',reasons:[]};
  try{archivePolicy(e,file);}catch(error){out.archivePolicy=error.code||'CLASSIFIER_ERROR';}
  const raw=e.resolved;
  out.resolvedType=raw===null?'null':typeof raw;
  if(typeof raw!=='string'){out.reasons.push('RESOLVED_NOT_STRING');return out;}
  out.rawSha256=hash(raw);out.rawBytes=Buffer.byteLength(raw);
  out.rawCharacterFlags={outerWhitespace:raw!==raw.trim(),controlCharacters:/[\x00-\x1f\x7f]/.test(raw),backslash:raw.includes('\\')};
  if(raw.length>2048){out.reasons.push('URL_LENGTH_LIMIT');return out;}
  let u;
  try{u=new URL(raw);}catch{out.reasons.push('URL_PARSE_FAILED');return out;}
  const c={canonicalSerialization:u.href===raw,https:u.protocol==='https:',npmRegistryHost:u.hostname==='registry.npmjs.org',credentialsAbsent:!u.username&&!u.password,nondefaultPortAbsent:!u.port,queryAbsent:!u.search,fragmentAbsent:!u.hash,archivePathShape:shape.test(u.pathname)};
  out.checks=c;
  const labels={canonicalSerialization:'NONCANONICAL_URL_SERIALIZATION',https:'SCHEME_NOT_HTTPS',npmRegistryHost:'HOST_NOT_NPM_REGISTRY',credentialsAbsent:'URL_CONTAINS_CREDENTIALS',nondefaultPortAbsent:'NONDEFAULT_PORT',queryAbsent:'URL_CONTAINS_QUERY',fragmentAbsent:'URL_CONTAINS_FRAGMENT',archivePathShape:'ARCHIVE_PATH_SHAPE_MISMATCH'};
  for(const [key,ok] of Object.entries(c))if(!ok)out.reasons.push(labels[key]);
  out.hostClass=c.npmRegistryHost?'NPM_PUBLIC_REGISTRY':u.hostname==='registry.npmjs.com'?'NPMJS_COM_HOST':u.hostname==='registry.yarnpkg.com'?'YARN_PUBLIC_REGISTRY':'OTHER_HOST_REDACTED';
  if(!c.npmRegistryHost)out.hostSha256=hash(u.hostname);
  out.pathEncoding={percentEscape:/%[0-9A-Fa-f]{2}/.test(u.pathname),encodedSlash:/%2f/i.test(u.pathname),encodedAt:/%40/i.test(u.pathname),encodedBackslash:/%5c/i.test(u.pathname),malformedPercent:/%(?![0-9A-Fa-f]{2})/.test(u.pathname)};
  let decoded;try{decoded=decodeURIComponent(u.pathname);}catch{decoded=null;}
  out.decodedPathHasArchiveShape=typeof decoded==='string'&&shape.test(decoded);
  // Reveal only the expected package/version path. Arbitrary URL payloads remain redacted.
  const logical=file.split('/node_modules/').at(-1).replace(/^node_modules\//,'');
  const name=safeName(e.name)||safeName(logical),version=safeVersion(e.version);
  const expected=name&&version?'/'+name+'/-/'+name.split('/').at(-1)+'-'+version+'.tgz':null;
  out.expectedPackageArchiveMatch=expected?u.pathname===expected:null;
  out.decodedExpectedPackageArchiveMatch=expected?decoded===expected:null;
  if(c.npmRegistryHost&&c.credentialsAbsent&&c.queryAbsent&&c.fragmentAbsent&&expected&&(u.pathname===expected||decoded===expected))out.expectedPublicPath=expected;
  if(out.archivePolicy==='ARCHIVE_INTEGRITY_INVALID')out.reasons.push('SHA512_INTEGRITY_FORMAT_INVALID');
  return out;
}
export function diagnoseAll(lock){
  if(!lock||typeof lock!=='object'||!lock.packages||typeof lock.packages!=='object'||Array.isArray(lock.packages))throw Object.assign(new Error('LOCK_STRUCTURE'),{code:'LOCK_STRUCTURE'});
  const entries=Object.entries(lock.packages).filter(([p])=>p!=='').sort(([a],[b])=>a<b?-1:a>b?1:0);
  if(entries.length<1||entries.length>20000)throw Object.assign(new Error('LOCK_COUNT_LIMIT'),{code:'LOCK_COUNT_LIMIT'});
  const rows=entries.map(([p,e])=>diagnose(e,p));
  const failed=rows.filter(r=>r.archivePolicy!=='PASS'),counts={};
  for(const r of failed)for(const why of r.reasons)counts[why]=(counts[why]||0)+1;
  return {packageCount:rows.length,archiveRejectedCount:failed.length,rejectionReasons:counts,selected:rows.find(r=>r.file==='node_modules/@alloc/quick-lru')||null,failed,scope:'ARCHIVE_FIELDS_ONLY_NOT_FULL_LOCK_POLICY_OR_INSTALL_AUTHORIZATION'};
}
