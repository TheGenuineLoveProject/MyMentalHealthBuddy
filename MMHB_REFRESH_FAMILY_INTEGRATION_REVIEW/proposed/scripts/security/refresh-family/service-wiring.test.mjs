/** Exercises the actual facade and adapter with synthetic dependency modules.
 * No application imports, environment configuration, network, or PostgreSQL.
 * Run with node --experimental-vm-modules (test process only).
 */
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const base=new URL('../../../',import.meta.url);
const serviceSource=readFileSync(new URL('server/services/refreshTokens.service.mjs',base),'utf8');
const adapterSource=readFileSync(new URL('server/services/refreshFamilyAdapter.mjs',base),'utf8');
const context=vm.createContext({});
const U='11111111-1111-4111-8111-111111111111';
const F='22222222-2222-4222-8222-222222222222';
const I='33333333-3333-4333-8333-333333333333';
const token='MMHB_SYNTHETIC_WIRING_TOKEN';
const hashToken=t=>createHash('sha256').update(t).digest('hex');
const sql=(strings,...params)=>({text:strings.join('?'),params});
let calls=[], reply=null, failure=null;
const db={execute:async q=>{calls.push(q);if(failure)throw failure;return {rows:[{result:reply}]};}};
const make=(exports,id)=>new vm.SyntheticModule(Object.keys(exports),function(){
 for(const [k,v] of Object.entries(exports))this.setExport(k,v);
},{context,identifier:id});
const modules=new Map([
 ['drizzle-orm',make({sql},'synthetic:drizzle')],
 ['../db/client.mjs',make({db},'synthetic:db')],
 ['../auth/tokens.mjs',make({hashToken},'synthetic:tokens')],
 ['./refreshFamilyAdapter.mjs',new vm.SourceTextModule(adapterSource,{context,identifier:'candidate:adapter'})],
]);
const facade=new vm.SourceTextModule(serviceSource,{context,identifier:'candidate:facade'});
const imports=[];
await facade.link((name,parent)=>{
 assert.equal(parent.identifier,'candidate:facade','Adapter must not import application dependencies');
 assert.ok(modules.has(name),'Unreviewed facade dependency: '+name);imports.push(name);return modules.get(name);
});
await facade.evaluate();
const svc=facade.namespace;
const expected=['storeRefreshToken','findValidRefreshToken','verifyRefreshToken','rotateRefreshToken',
 'revokeRefreshTokenByToken','revokeRefreshToken','revokeAllRefreshTokens'].sort();
const tests=[];const test=(name,fn)=>tests.push([name,fn]);
const row=(t=token)=>({id:I,userId:U,familyId:F,tokenHash:hashToken(t),expiresAt:'2030-01-01T00:00:00Z'});
const plain=x=>JSON.parse(JSON.stringify(x));
test('public_exports_preserved',()=>assert.deepEqual(Object.keys(svc).sort(),expected));
test('only_existing_db_sql_hash_and_adapter_imports',()=>assert.deepEqual(imports.sort(),[...modules.keys()].sort()));
test('import_does_not_query_or_migrate',()=>assert.equal(calls.length,0));
test('issue_uses_existing_db_and_hash',async()=>{reply=row();const v=await svc.storeRefreshToken({userId:U,token});assert.equal(v.tokenHash,hashToken(token));assert.deepEqual(calls[0].params,[U,hashToken(token)]);assert.match(calls[0].text,/mmhb_refresh_v1.issue/);});
test('find_and_verify_use_family_lookup',async()=>{reply=row();assert.equal((await svc.findValidRefreshToken(token)).familyId,F);assert.equal(await svc.verifyRefreshToken({userId:U,token}),true);assert.match(calls[0].text,/find_valid/);});
test('rotate_uses_both_hashes_not_raw_tokens',async()=>{const next=token+'_NEXT';reply=row(next);assert.equal((await svc.rotateRefreshToken({token,newToken:next})).tokenHash,hashToken(next));assert.deepEqual(calls[0].params,[hashToken(token),hashToken(next)]);assert.equal(JSON.stringify(calls).includes(token),false);});
test('presented_token_logout_uses_family_revoke',async()=>{reply={revoked:true,revokedCount:1};assert.deepEqual(plain(await svc.revokeRefreshTokenByToken(token)),reply);assert.match(calls[0].text,/mmhb_refresh_v1.revoke\(/);});
test('scoped_logout_retains_undefined_contract',async()=>{reply={revoked:false,revokedCount:0};assert.equal(await svc.revokeRefreshToken({userId:U,token}),undefined);assert.deepEqual(calls[0].params,[hashToken(token),U]);});
test('logout_honors_caller_transaction',async()=>{let n=0;const tx={execute:async()=>{n++;return {rows:[{result:{revoked:true,revokedCount:1}}]};}};await svc.revokeRefreshTokenByToken(token,tx);assert.equal(n,1);assert.equal(calls.length,0);});
test('account_revocation_honors_caller_transaction',async()=>{let n=0;const tx={execute:async()=>{n++;return {rows:[{result:2}]};}};assert.equal(await svc.revokeAllRefreshTokens(U,tx),undefined);assert.equal(n,1);assert.equal(calls.length,0);});
test('missing_migration_error_propagates_without_fallback',async()=>{failure=Object.assign(new Error('REFRESH_FAMILY_MIGRATION_REQUIRED'),{code:'55000'});await assert.rejects(svc.storeRefreshToken({userId:U,token}),e=>e===failure);assert.equal(calls.length,1);assert.ok(!calls[0].text.includes('refresh_tokens'));});
test('malformed_reply_is_not_success',async()=>{reply=null;await assert.rejects(svc.storeRefreshToken({userId:U,token}),/REFRESH_DATABASE_RESPONSE_INVALID/);});
let passed=0;
for(const [name,fn] of tests){calls=[];reply=null;failure=null;try{await fn();passed++;}catch(e){console.error('SERVICE_WIRING_FAILURE='+name+':'+e.message);}}
console.log(`SERVICE_WIRING_ASSERTIONS=${passed}_OF_${tests.length}`);
if(passed!==tests.length)process.exitCode=1;
