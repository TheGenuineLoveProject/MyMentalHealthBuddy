import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRefreshFamilyService } from './refreshFamilyAdapter.mjs';
import { writeFileSync } from 'node:fs';
const U='11111111-1111-4111-8111-111111111111', V='22222222-2222-4222-8222-222222222222';
const F='33333333-3333-4333-8333-333333333333', I='44444444-4444-4444-8444-444444444444';
const token='SYNTHETIC_ADAPTER_UNIT_ONLY';
const hashToken=x=>createHash('sha256').update(x).digest('hex');
const sql=(strings,...params)=>({text:strings.join('?'),params});
const valid={tokenHash:hashToken(token),familyId:F,id:I,userId:U,expiresAt:'2030-01-01T00:00:00+00:00'};
const record=x=>({rows:[{result:x}]});
let response=record(valid), calls=[];
const db={execute:async q=>{calls.push(q);return response;}};
const make=()=>createRefreshFamilyService({db,sql,hashToken});
let service=make(); const results=[];
const tests=[]; const test=(name,fn)=>tests.push([name,fn]);
const invalid=/REFRESH_DATABASE_RESPONSE_INVALID/;
test('rejects_invalid_dependencies',()=>assert.throws(()=>createRefreshFamilyService({db:{},sql,hashToken}),/INVALID_ADAPTER/));
test('issuance_preserves_date_contract',async()=>assert.ok((await service.storeRefreshToken({userId:U,token})).expiresAt instanceof Date));
test('find_valid_maps_expected_identity',async()=>assert.equal((await service.findValidRefreshToken(token)).id,I));
test('verification_checks_user_identity',async()=>{assert.equal(await service.verifyRefreshToken({userId:U,token}),true);assert.equal(await service.verifyRefreshToken({userId:V,token}),false);});
test('null_find_is_legitimate_absence',async()=>{response=record(null);assert.equal(await service.findValidRefreshToken(token),null);});
test('null_rotation_is_legitimate_conflict',async()=>{response=record(null);assert.equal(await service.rotateRefreshToken({token,newToken:'NEXT_TEST_TOKEN'}),null);});
for(const [name,value] of Object.entries({empty_rows:{rows:[]},missing_result:{rows:[{}]},undefined_result:record(undefined),multiple_rows:{rows:[{result:null},{result:null}]},missing_rows:{}})) {
 test('rejects_'+name,async()=>{response=value;await assert.rejects(service.findValidRefreshToken(token),invalid);});
}
test('issuance_cannot_silently_accept_null',async()=>{response=record(null);await assert.rejects(service.storeRefreshToken({userId:U,token}),invalid);});
test('valid_revocation_maps_logical_count',async()=>{response=record({revoked:true,revokedCount:1});assert.deepEqual(await service.revokeRefreshTokenByToken(token),{revoked:true,revokedCount:1});});
for(const [name,val] of Object.entries({null:null,missing_count:{revoked:true},string_count:{revoked:true,revokedCount:'1'},inconsistent:{revoked:false,revokedCount:1},multiple_families:{revoked:true,revokedCount:2}})) {
 test('rejects_revocation_'+name,async()=>{response=record(val);await assert.rejects(service.revokeRefreshTokenByToken(token),invalid);});
}
test('empty_revocation_does_not_query',async()=>{calls=[];assert.deepEqual(await service.revokeRefreshTokenByToken(''),{revoked:false,revokedCount:0});assert.equal(calls.length,0);});
test('long_token_does_not_query',async()=>{calls=[];assert.equal(await service.findValidRefreshToken('a'.repeat(4097)),null);assert.equal(calls.length,0);});
test('invalid_user_cannot_become_unscoped_revocation',async()=>{calls=[];await assert.rejects(service.revokeRefreshToken({token,userId:null}),/INVALID_REFRESH_USER_ID/);assert.equal(calls.length,0);});
test('bad_uuid_rejected_before_database',async()=>{calls=[];await assert.rejects(service.storeRefreshToken({userId:'not-a-uuid',token}),/INVALID_REFRESH_USER_ID/);assert.equal(calls.length,0);});
test('identical_replacement_refused',async()=>{calls=[];await assert.rejects(service.rotateRefreshToken({token,newToken:token}),/MUST_DIFFER/);assert.equal(calls.length,0);});
test('raw_token_never_sent_to_executor',async()=>{response=record(valid);calls=[];await service.storeRefreshToken({userId:U,token});assert.deepEqual(calls[0].params,[U,hashToken(token)]);assert.ok(!JSON.stringify(calls).includes(token));});
for(const [name,changed] of Object.entries({wrong_hash:{tokenHash:'f'.repeat(64)},bad_expiry:{expiresAt:'not-a-date'},timezone_missing:{expiresAt:'2030-01-01T00:00:00'},bad_family:{familyId:'not-a-uuid'}})) {
 test('rejects_'+name,async()=>{response=record({...valid,...changed});await assert.rejects(service.findValidRefreshToken(token),invalid);});
}
test('caller_executor_receives_revocation',async()=>{calls=[];let touched=0;const tx={execute:async()=>{touched++;return record({revoked:false,revokedCount:0});}};await service.revokeRefreshTokenByToken(token,tx);assert.equal(touched,1);assert.equal(calls.length,0);});
test('account_revoke_uses_tx_and_preserves_return',async()=>{calls=[];let touched=0;const tx={execute:async()=>{touched++;return record(2);}};assert.equal(await service.revokeAllRefreshTokens(U,tx),undefined);assert.equal(touched,1);assert.equal(calls.length,0);});
test('account_revoke_rejects_missing_count',async()=>{response=record(null);await assert.rejects(service.revokeAllRefreshTokens(U),invalid);});
test('database_error_is_not_silently_swallowed',async()=>{const err=Object.assign(new Error('synthetic-db-error'),{code:'55000'});const failDb={execute:async()=>{throw err;}};const s=createRefreshFamilyService({db:failDb,sql,hashToken});await assert.rejects(s.storeRefreshToken({userId:U,token}),e=>e===err);});
test('invalid_digest_implementation_refused',async()=>{const s=createRefreshFamilyService({db,sql,hashToken:()=>''});await assert.rejects(s.findValidRefreshToken(token),/INVALID_TOKEN_DIGEST/);});
for(const [name,fn] of tests) {
 try {response=record(valid);calls=[];service=make();await fn();results.push({test:name,pass:true});}
 catch(e){results.push({test:name,pass:false,error:e.message});}
}
const out={schema:'MMHB_ADAPTER_BOUNDARY_UNIT_V1',scope:'Real adapter and Node SHA-256; synthetic SQL tag and execute responses, no PostgreSQL',node:process.version,total:results.length,passed:results.filter(r=>r.pass).length,results};
if(process.argv[2])writeFileSync(process.argv[2],JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));if(out.passed!==out.total)process.exitCode=1;
