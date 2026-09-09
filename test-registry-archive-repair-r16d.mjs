import assert from 'node:assert/strict';
import fs from 'node:fs';
import https from 'node:https';
import crypto from 'node:crypto';
import {EventEmitter} from 'node:events';
import {PassThrough} from 'node:stream';
import {planArchiveRepair, assertOnlyResolvedChanges, verifyArchiveSources, createRegistryClient} from './registry-archive-repair-r16d.mjs';
import {validateLock, classifyExcludedBundles} from './locked-dependency-policy-r16d.mjs';

const results=[], clone=x=>JSON.parse(JSON.stringify(x));
const secret='FIXTURE_PRIVATE_URL_SECRET';
const digest=bytes=>'sha512-'+crypto.createHash('sha512').update(bytes).digest('base64');
const integrity=digest('synthetic archive, never executable');
const publicURL=(name,version)=>`https://registry.npmjs.org/${name}/-/${name.split('/').pop()}-${version}.tgz`;
const fixture=()=>{
  const manifest={name:'mymentalhealthbuddy',version:'1.0.0',dependencies:{'@vitejs/plugin-react':'6.1.0',resend:'6.22.1'}};
  const lock={name:manifest.name,version:manifest.version,lockfileVersion:3,packages:{'':clone(manifest)}};
  for(const [name,version] of Object.entries(manifest.dependencies))lock.packages['node_modules/'+name]={version,integrity,resolved:`http://mirror.invalid/cache/${name}/${version}`};
  return {manifest,lock};
};
async function test(name,fn){await fn();results.push({case:name,status:'PASS'});console.log('PASS '+name);}
async function rejects(code,fn){await assert.rejects(fn,e=>{assert.equal(e.code,code);assert(!e.message.includes(secret));return true;});}
function throws(code,fn){assert.throws(fn,e=>{assert.equal(e.code,code);return true;});}
function plan(f=fixture()){return planArchiveRepair(f.manifest,f.lock,validateLock,classifyExcludedBundles);}
function stubClient(mutate=()=>{},archiveIntegrity=integrity){
  let closed=false,active=0,maxActive=0;
  const stats={requests:0,bytes:0,metadataResponses:0,archiveResponses:0};
  return {stats,get closed(){return closed},get maxActive(){return maxActive},
    async getMetadata(url){
      active++;maxActive=Math.max(maxActive,active);stats.requests++;
      await new Promise(r=>setTimeout(r,1));
      const chunks=new URL(url).pathname.slice(1).split('/'),version=decodeURIComponent(chunks.pop()),name=decodeURIComponent(chunks.join('/'));
      const value={name,version,dist:{tarball:publicURL(name,version),integrity}};
      mutate(value);active--;stats.metadataResponses++;
      return {value,bytes:100,sha256:'a'.repeat(64)};
    },async getArchive(url){assert(url.startsWith('https://registry.npmjs.org/'));stats.requests++;stats.archiveResponses++;return {bytes:40,integrity:archiveIntegrity};},close(){closed=true;}};
}

const WASM='node_modules/@tailwindcss/oxide-wasm32-wasi';
function bundleFixture(){
  const f=fixture();
  f.lock.packages[WASM]={version:'4.3.3',optional:true,cpu:['wasm32'],bundleDependencies:['@emnapi/core'],
    resolved:'http://mirror.invalid/tailwind',integrity};
  f.lock.packages[WASM+'/node_modules/@emnapi/core']={version:'1.11.3',inBundle:true,optional:true};
  return f;
}
await test('reproduce R16C failure and accept only excluded bundled representation in R16D',async()=>{
  const old=await import('./registry-archive-repair-r16c.mjs');
  const f=bundleFixture();
  throws('ARCHIVE_INTEGRITY_INVALID',()=>old.planArchiveRepair(f.manifest,f.lock,validateLock));
  const before=JSON.stringify(f.lock),p=plan(f),client=stubClient();
  assert.equal(p.excludedBundledMembers.length,1);assert.equal(p.changedEntries,3);
  assert(p.requests.every(x=>x.name!=='@emnapi/core'));
  const verified=await verifyArchiveSources(p,{clientFactory:()=>client});
  assert.equal(verified.uniqueSourcesVerified,3);assert.equal(JSON.stringify(f.lock),before);
  assert.deepEqual(p.normalized.packages[WASM+'/node_modules/@emnapi/core'],f.lock.packages[WASM+'/node_modules/@emnapi/core']);
  assertOnlyResolvedChanges(f.lock,p);
});
await test('excluded parent still requires original SHA512 before network',()=>{
  const f=bundleFixture();delete f.lock.packages[WASM].integrity;
  throws('ARCHIVE_INTEGRITY_INVALID',()=>plan(f));
});
await test('ordinary missing SHA512 is never treated as bundled',()=>{
  const f=bundleFixture();delete f.lock.packages['node_modules/resend'].integrity;
  throws('ARCHIVE_INTEGRITY_INVALID',()=>plan(f));
});
await test('bundled member modification fails immutable lock check',()=>{
  const f=bundleFixture(),p=plan(f);p.normalized.packages[WASM+'/node_modules/@emnapi/core'].version='2.0.0';
  throws('ARCHIVE_NORMALIZED_OBJECT_CHANGED',()=>assertOnlyResolvedChanges(f.lock,p));
});
await test('parent registry checksum mismatch still stops excluded bundle plan',async()=>{
  const f=bundleFixture(),client=stubClient(v=>{if(v.name==='@tailwindcss/oxide-wasm32-wasi')v.dist.integrity=digest('wrong parent');});
  await rejects('REGISTRY_INTEGRITY_MISMATCH',()=>verifyArchiveSources(plan(f),{clientFactory:()=>client}));
});
await test('HTTP mirror relocated only in copy, checksums and dependency graph preserved',()=>{
  const f=fixture(),original=JSON.stringify(f.lock),p=plan(f);
  assert.equal(JSON.stringify(f.lock),original);assert.equal(p.changedEntries,2);assert.equal(p.requests.length,2);
  assertOnlyResolvedChanges(f.lock,p);
  for(const row of p.changes){assert.equal(row.resolved,publicURL(row.name,row.version));assert(!JSON.stringify(row).includes('mirror.invalid'));}
});
await test('already canonical archive needs no registry query',()=>{
  const f=fixture();for(const [file,e] of Object.entries(f.lock.packages))if(file)e.resolved=publicURL(file.slice(13),e.version);
  const p=plan(f);assert.equal(p.changedEntries,0);assert.equal(p.requests.length,0);
});
await test('nested alias uses locked real package name and deduplicates requests',()=>{
  const f=fixture();f.lock.packages['node_modules/parent/node_modules/alias']={...f.lock.packages['node_modules/resend'],name:'resend'};
  const p=plan(f);assert.equal(p.changedEntries,3);assert.equal(p.requests.length,2);assert.equal(p.normalized.packages['node_modules/parent/node_modules/alias'].resolved,publicURL('resend','6.22.1'));
});
for(const [label,change,code] of [
  ['conflicting identity digests',f=>{f.lock.packages['node_modules/parent/node_modules/resend']={...f.lock.packages['node_modules/resend'],integrity:digest('other')};},'ARCHIVE_DUPLICATE_INTEGRITY_CONFLICT'],
  ['traversal path',f=>{f.lock.packages['node_modules/../escape']=f.lock.packages['node_modules/resend'];},'LOCK_PACKAGE_PATH_INVALID'],
  ['file source',f=>{f.lock.packages['node_modules/resend'].resolved='file:///private/package.tgz';},'ARCHIVE_ORIGINAL_SOURCE_UNSUPPORTED'],
  ['git source',f=>{f.lock.packages['node_modules/resend'].resolved='git+https://github.com/owner/pkg';},'ARCHIVE_ORIGINAL_SOURCE_UNSUPPORTED'],
  ['credential source',f=>{f.lock.packages['node_modules/resend'].resolved=`https://${secret}@mirror.invalid/package.tgz`;},'ARCHIVE_ORIGINAL_SOURCE_UNSUPPORTED'],
  ['query source',f=>{f.lock.packages['node_modules/resend'].resolved=`https://mirror.invalid/package.tgz?key=${secret}`;},'ARCHIVE_ORIGINAL_SOURCE_UNSUPPORTED'],
  ['missing source',f=>{delete f.lock.packages['node_modules/resend'].resolved;},'ARCHIVE_ORIGINAL_URL_INVALID'],
  ['whitespace source',f=>{f.lock.packages['node_modules/resend'].resolved=' http://mirror.invalid/a';},'ARCHIVE_ORIGINAL_URL_INVALID'],
  ['SHA-1 locked digest',f=>{f.lock.packages['node_modules/resend'].integrity='sha1-AAAAAAAAAAAAAAAAAAAAAAAAAAA=';},'ARCHIVE_INTEGRITY_INVALID'],
  ['mismatched root dependency maps',f=>{f.manifest.dependencies.resend='6.24.0';},'ROOT_DEPENDENCY_MAP_MISMATCH'],
  ['unsupported workspace declaration',f=>{f.manifest.workspaces=['packages/*'];},'WORKSPACES_UNSUPPORTED'],
  ['linked lock package',f=>{f.lock.packages['node_modules/resend'].link=true;},'LOCK_SOURCE_FEATURE_UNSUPPORTED'],
])await test(label+' refused before network',()=>{const f=fixture();change(f);throws(code,()=>plan(f));});
await test('mutated original object cannot be accepted',()=>{const f=fixture(),p=plan(f);f.lock.version='2.0.0';throws('ARCHIVE_ORIGINAL_OBJECT_CHANGED',()=>assertOnlyResolvedChanges(f.lock,p));});
await test('mutated staged version cannot be accepted',()=>{const f=fixture(),p=plan(f);p.normalized.packages['node_modules/resend'].version='6.24.0';throws('ARCHIVE_NORMALIZED_OBJECT_CHANGED',()=>assertOnlyResolvedChanges(f.lock,p));});
await test('malformed change set cannot hide edits',()=>{const f=fixture(),p=plan(f);p.changes[0].version='9.0.0';throws('ARCHIVE_CHANGE_SET_INVALID',()=>assertOnlyResolvedChanges(f.lock,p));});
await test('exact public metadata validates all changed sources',async()=>{const client=stubClient(),r=await verifyArchiveSources(plan(),{clientFactory:()=>client});assert.equal(r.status,'ARCHIVE_SOURCES_VERIFIED');assert.equal(r.uniqueSourcesVerified,2);assert(client.closed);assert.equal(r.archiveResponses,0);});
for(const [label,mutate,code] of [
  ['wrong package name',v=>{v.name='another';},'REGISTRY_PACKAGE_IDENTITY_MISMATCH'],
  ['wrong package version',v=>{v.version='0.0.1';},'REGISTRY_PACKAGE_IDENTITY_MISMATCH'],
  ['third-party metadata tarball',v=>{v.dist.tarball='https://mirror.invalid/'+secret;},'REGISTRY_TARBALL_IDENTITY_MISMATCH'],
  ['downgraded metadata tarball',v=>{v.dist.tarball=v.dist.tarball.replace('https:','http:');},'REGISTRY_TARBALL_IDENTITY_MISMATCH'],
  ['different SHA-512',v=>{v.dist.integrity=digest('mismatch');},'REGISTRY_INTEGRITY_MISMATCH'],
  ['malformed metadata integrity',v=>{v.dist.integrity='invalid';},'REGISTRY_INTEGRITY_MISMATCH'],
])await test(label+' blocks verification',async()=>{const client=stubClient(mutate);await rejects(code,()=>verifyArchiveSources(plan(),{clientFactory:()=>client}));assert(client.closed);});
await test('legacy metadata hashes archive bytes using unchanged SHA-512',async()=>{const client=stubClient(v=>{delete v.dist.integrity;});const r=await verifyArchiveSources(plan(),{clientFactory:()=>client});assert.equal(r.archiveResponses,2);assert(r.receipts.every(x=>x.verification==='REGISTRY_ARCHIVE_BYTES_SHA512_MATCH'));});
await test('SHA-1 metadata still requires archive SHA-512',async()=>{const client=stubClient(v=>{v.dist.integrity='sha1-AAAAAAAAAAAAAAAAAAAAAAAAAAA=';});const r=await verifyArchiveSources(plan(),{clientFactory:()=>client});assert.equal(r.archiveResponses,2);});
await test('legacy metadata archive mismatch blocks verification',async()=>{const client=stubClient(v=>{delete v.dist.integrity;},digest('bad archive'));await rejects('REGISTRY_ARCHIVE_SHA512_MISMATCH',()=>verifyArchiveSources(plan(),{clientFactory:()=>client}));});
await test('no changed source completes without a request',async()=>{const f=fixture();for(const [file,e] of Object.entries(f.lock.packages))if(file)e.resolved=publicURL(file.slice(13),e.version);const client=stubClient();const r=await verifyArchiveSources(plan(f),{clientFactory:()=>client});assert.equal(r.requests,0);assert(client.closed);});
await test('cancellation prevents request and success',async()=>{const c=new AbortController();c.abort();const client=stubClient();await rejects('REGISTRY_VERIFICATION_INTERRUPTED',()=>verifyArchiveSources(plan(),{signal:c.signal,clientFactory:()=>client}));assert.equal(client.stats.requests,0);});
await test('parallel metadata requests remain capped at four',async()=>{const f=fixture();for(let i=0;i<16;i++)f.lock.packages['node_modules/p'+i]={version:'1.0.0',integrity,resolved:'http://mirror.invalid/p'+i};const client=stubClient();const r=await verifyArchiveSources(plan(f),{clientFactory:()=>client});assert.equal(r.uniqueSourcesVerified,18);assert(client.maxActive<=4);});

// Exercise the real HTTPS wrapper with synthetic IncomingMessage streams. No
// external network and no alternate destination option is added to production.
const originalRequest=https.request;
async function transport(name,settings,fn){await test(name,async()=>{
  const seen=[];let count=0;
  https.request=(options,callback)=>{
    seen.push(options);const request=new EventEmitter();request.destroy=()=>{};
    request.end=()=>queueMicrotask(()=>{
      const data=typeof settings==='function'?settings(++count):settings;
      if(data.noResponse)return;
      if(data.error){request.emit('error',{code:data.error,message:secret});return;}
      const response=new PassThrough();response.statusCode=data.status??200;response.headers=data.headers??{};response.complete=data.complete??true;
      callback(response);
      if(!response.destroyed)response.end(data.body??'{"ok":true}');
    });return request;
  };
  const controller=new AbortController(),client=createRegistryClient(controller.signal);
  try{await fn(client,seen,controller);}finally{client.close();https.request=originalRequest;}
});}
await transport('HTTPS wrapper fixes host, TLS and credential-free GET',{body:'{"name":"resend"}'},async(c,seen)=>{const r=await c.getMetadata('https://registry.npmjs.org/resend/6.22.1');assert.equal(r.value.name,'resend');assert.equal(seen.length,1);assert.equal(seen[0].hostname,'registry.npmjs.org');assert.equal(seen[0].rejectUnauthorized,true);assert.equal(seen[0].method,'GET');assert.equal(seen[0].headers.Authorization,undefined);assert.equal(seen[0].path,'/resend/6.22.1');});
await transport('arbitrary request host rejected before transport',{},async(c,seen)=>{await rejects('REGISTRY_DESTINATION_INVALID',()=>c.getMetadata('https://bad.invalid/'+secret));assert.equal(seen.length,0);});
await transport('redirect is refused without following Location',{status:302,headers:{location:'https://bad.invalid/'+secret}},async(c,seen)=>{await rejects('REGISTRY_HTTP_302',()=>c.getMetadata('https://registry.npmjs.org/resend/6.22.1'));assert.equal(seen.length,1);});
await transport('404 stops without retry or response leakage',{status:404,body:secret},async(c,seen)=>{await rejects('REGISTRY_HTTP_404',()=>c.getMetadata('https://registry.npmjs.org/resend/6.22.1'));assert.equal(seen.length,1);});
await transport('transient registry failure gets one bounded retry',n=>n===1?{status:503}:{body:'{"ok":true}'},async(c,seen)=>{assert((await c.getMetadata('https://registry.npmjs.org/resend/6.22.1')).value.ok);assert.equal(seen.length,2);});
await transport('persistent transient failure stops after second request',{status:503},async(c,seen)=>{await rejects('REGISTRY_HTTP_503',()=>c.getMetadata('https://registry.npmjs.org/resend/6.22.1'));assert.equal(seen.length,2);});
await transport('oversized declared metadata is refused',{headers:{'content-length':String(3*1024*1024)}},async c=>{await rejects('REGISTRY_RESPONSE_SIZE_LIMIT',()=>c.getMetadata('https://registry.npmjs.org/resend/6.22.1'));});
await transport('oversized streamed metadata is refused',{body:Buffer.alloc(2*1024*1024+1)},async c=>{await rejects('REGISTRY_RESPONSE_SIZE_LIMIT',()=>c.getMetadata('https://registry.npmjs.org/resend/6.22.1'));});
await transport('incomplete metadata cannot pass',{complete:false},async c=>{await rejects('REGISTRY_RESPONSE_INCOMPLETE',()=>c.getMetadata('https://registry.npmjs.org/resend/6.22.1'));});
await transport('malformed metadata cannot pass',{body:secret},async c=>{await rejects('REGISTRY_JSON_INVALID',()=>c.getMetadata('https://registry.npmjs.org/resend/6.22.1'));});
await transport('unexpected content encoding is refused',{headers:{'content-encoding':'gzip'}},async c=>{await rejects('REGISTRY_CONTENT_ENCODING_UNSUPPORTED',()=>c.getMetadata('https://registry.npmjs.org/resend/6.22.1'));});
await transport('TLS errors do not leak raw error text',{error:'CERT_HAS_EXPIRED'},async(c,seen)=>{await rejects('REGISTRY_CONNECTION_FAILED',()=>c.getMetadata('https://registry.npmjs.org/resend/6.22.1'));assert.equal(seen.length,1);});
await transport('streamed archive bytes produce independent SHA-512',{body:'synthetic archive, never executable'},async c=>{assert.equal((await c.getArchive('https://registry.npmjs.org/resend/-/resend-6.22.1.tgz')).integrity,integrity);});
await transport('abort promptly ends an outstanding request',{noResponse:true},async(c,seen,controller)=>{const pending=c.getMetadata('https://registry.npmjs.org/resend/6.22.1');controller.abort();await rejects('REGISTRY_REQUEST_CANCELLED',()=>pending);});
await transport('hard request timeout ends a stalled response',{noResponse:true},async c=>{
  const timer=globalThis.setTimeout;
  globalThis.setTimeout=(fn,ms,...args)=>timer(fn,ms===30000?5:ms,...args);
  try{await rejects('REGISTRY_REQUEST_TIMEOUT',()=>c.getMetadata('https://registry.npmjs.org/resend/6.22.1'));}
  finally{globalThis.setTimeout=timer;}
});
await test('overall verification deadline cancels workers and cannot pass',async()=>{
  const timer=globalThis.setTimeout;let closed=false;
  globalThis.setTimeout=(fn,ms,...args)=>timer(fn,ms===600000?5:ms,...args);
  try{
    await rejects('REGISTRY_VERIFICATION_TIMEOUT',()=>verifyArchiveSources(plan(),{clientFactory:signal=>({
      stats:{requests:0,bytes:0},close(){closed=true;},
      getMetadata:()=>new Promise((resolve,reject)=>signal.addEventListener('abort',()=>reject(Object.assign(new Error('cancelled'),{code:'REGISTRY_REQUEST_CANCELLED'})),{once:true}))
    })}));
    assert(closed);
  }finally{globalThis.setTimeout=timer;}
});

const helper=new URL('./registry-archive-repair-r16d.mjs',import.meta.url);
fs.writeFileSync(new URL('./r16d-registry-fixture-results.json',import.meta.url),JSON.stringify({scope:'ACTUAL_HELPER_WITH_SYNTHETIC_METADATA_ARCHIVES_AND_HTTPS_STREAMS_NO_EXTERNAL_NETWORK',node:process.version,helperSha256:crypto.createHash('sha256').update(fs.readFileSync(helper)).digest('hex'),passed:results.length,cases:results},null,2)+'\n');
console.log('R16D_REGISTRY_FIXTURES='+results.length+'_PASS');
