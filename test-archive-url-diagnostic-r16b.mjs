import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {diagnose,diagnoseAll} from './archive-url-diagnostic-r16b-helper.mjs';
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const old=fs.readFileSync(new URL('./locked-dependency-policy-r16.mjs',import.meta.url),'utf8');
const fn=old.slice(old.indexOf('function archivePolicy('),old.indexOf('\nexport function validateLock'));
const newText=fs.readFileSync(new URL('./archive-url-diagnostic-r16b-helper.mjs',import.meta.url),'utf8');
assert.ok(newText.includes(fn),'R16 archive checker must be byte-identical');
const golden=await import('data:text/javascript;base64,'+Buffer.from("const stop=(code)=>{throw Object.assign(new Error(code),{code});};\n"+fn+'\nexport {archivePolicy};').toString('base64'));
const integrity='sha512-'+Buffer.alloc(64).toString('base64');
const base='https://registry.npmjs.org/@alloc/quick-lru/-/quick-lru-5.2.0.tgz';
const secret='MMHB_SECRET_SENTINEL';
const cases=[
 ['ordinary scoped archive',base,null],
 ['HTTP archive',base.replace('https:','http:'),'SCHEME_NOT_HTTPS'],
 ['different registry',base.replace('registry.npmjs.org','registry.yarnpkg.com'),'HOST_NOT_NPM_REGISTRY'],
 ['unknown secret host',base.replace('registry.npmjs.org',secret.toLowerCase()+'.invalid'),'HOST_NOT_NPM_REGISTRY'],
 ['percent scoped slash',base.replace('@alloc/','@alloc%2F'),'ARCHIVE_PATH_SHAPE_MISMATCH'],
 ['percent at sign',base.replace('@alloc','%40alloc'),'ARCHIVE_PATH_SHAPE_MISMATCH'],
 ['URL credentials',base.replace('https://','https://user:'+secret+'@'),'URL_CONTAINS_CREDENTIALS'],
 ['query',base+'?token='+secret,'URL_CONTAINS_QUERY'],
 ['fragment',base+'#'+secret,'URL_CONTAINS_FRAGMENT'],
 ['explicit default port',base.replace('.org/','.org:443/'),'NONCANONICAL_URL_SERIALIZATION'],
 ['nondefault port',base.replace('.org/','.org:444/'),'NONDEFAULT_PORT'],
 ['outer whitespace',' '+base+'\n','NONCANONICAL_URL_SERIALIZATION'],
 ['normalizing host uppercase',base.replace('.npmjs.org','.NPMJS.ORG'),'NONCANONICAL_URL_SERIALIZATION'],
 ['malformed URL','http://%'+secret,'URL_PARSE_FAILED'],
 ['missing URL',undefined,'RESOLVED_NOT_STRING'],
 ['object URL',{token:secret},'RESOLVED_NOT_STRING'],
 ['control URL',base+'\t','NONCANONICAL_URL_SERIALIZATION'],
 ['backslash URL',base.replace('/@alloc','\\@alloc'),'NONCANONICAL_URL_SERIALIZATION'],
 ['path payload',base.replace('quick-lru-5.2.0.tgz',secret+'.tgz'),null],
 ['very long URL',base+secret.repeat(200),'URL_LENGTH_LIMIT'],
 ['malformed percent',base.replace('@alloc','%XYalloc'),'ARCHIVE_PATH_SHAPE_MISMATCH'],
];
const results=[];
for(const [name,resolved,reason] of cases){
 const e={version:'5.2.0',resolved,integrity};const r=diagnose(e,'node_modules/@alloc/quick-lru');
 let expected='PASS';try{golden.archivePolicy(e,'node_modules/@alloc/quick-lru');}catch(e){expected=e.code;}
 assert.equal(r.archivePolicy,expected,name);
 if(reason)assert.ok(r.reasons.includes(reason),name);
 assert.ok(!JSON.stringify(r).toLowerCase().includes(secret.toLowerCase()),name+' leaked URL payload');
 results.push({case:name,status:'PASS'});
}
const invalidIntegrity=diagnose({version:'5.2.0',resolved:base,integrity:'sha512-'+secret},'node_modules/@alloc/quick-lru');
assert.equal(invalidIntegrity.archivePolicy,'ARCHIVE_INTEGRITY_INVALID');assert.ok(!JSON.stringify(invalidIntegrity).includes(secret));results.push({case:'integrity reason without payload leak',status:'PASS'});
const scan=diagnoseAll({packages:{'':{},'node_modules/@alloc/quick-lru':{version:'5.2.0',resolved:base,integrity},'node_modules/encoded':{version:'5.2.0',resolved:base.replace('@','%40'),integrity},'node_modules/query':{version:'5.2.0',resolved:base+'?token='+secret,integrity}}});
assert.equal(scan.packageCount,3);assert.equal(scan.archiveRejectedCount,2);assert.ok(!JSON.stringify(scan).includes(secret));results.push({case:'all rejected entries collected without secret values',status:'PASS'});
fs.writeFileSync(new URL('./r16b-classifier-test-results.json',import.meta.url),JSON.stringify({scope:'STATIC_URL_CLASSIFICATION_NO_NETWORK',node:process.version,helperSha256:sha(newText),priorPolicySha256:sha(old),archiveFunctionByteIdentical:true,passed:results.length,cases:results},null,2)+'\n');
console.log('R16B_CLASSIFIER_TESTS='+results.length+'_PASS');
