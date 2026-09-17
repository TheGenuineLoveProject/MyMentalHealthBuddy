/** Real pg + Drizzle + PostgreSQL; synthetic private cluster only. */
import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';
import { readFileSync, writeFileSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createRefreshFamilyService } from './refreshFamilyAdapter.mjs';
const config=JSON.parse(readFileSync(process.argv[2],'utf8'));
assert.equal(path.resolve(config.base),process.cwd());
assert.match(config.base,/^\/tmp\/mmhb-refresh-test-[A-Za-z0-9_-]+$/);
assert.equal(config.socket,path.join(config.base,'socket'));
assert.equal(realpathSync(config.socket),config.socket);
assert.equal(config.port,55471);
assert.equal(config.database,'postgres');
assert.equal(config.user,'mmhb_adapter_runtime');
assert.equal(config.admin,'mmhb_test');
const require=createRequire(import.meta.url);
const pg=require(config.pgEntry);
const {drizzle}=require(config.drizzlePgEntry);
const {sql}=require(config.drizzleEntry);
const {PgDialect}=require(config.pgCoreEntry);
const hashToken=token=>createHash('sha256').update(token).digest('hex');
const fresh=()=>randomBytes(48).toString('base64url');
const U='11111111-1111-4111-8111-111111111111',V='22222222-2222-4222-8222-222222222222';
const poolOptions={host:config.socket,port:config.port,database:config.database,ssl:false,
 max:3,connectionTimeoutMillis:4000,idleTimeoutMillis:4000,statement_timeout:10000,
 query_timeout:12000,options:'-c timezone=UTC -c lock_timeout=5000',application_name:'mmhb_adapter_qualification'};
const runtimePool=new pg.Pool({...poolOptions,user:config.user});
const adminPool=new pg.Pool({...poolOptions,user:config.admin,max:1});
const db=drizzle(runtimePool), asDb=x=>createRefreshFamilyService({db:x,sql,hashToken});
const svc=asDb(db), results=[]; const tests=[]; const test=(name,fn)=>tests.push([name,fn]);
function errorHas(e,code){for(let i=0;e&&i<8;i++,e=e.cause){if(e.code===code)return true;}return false;}
const denied=fn=>assert.rejects(fn,e=>errorHas(e,'42501'));
const query=async(text,params=[])=> (await adminPool.query(text,params)).rows;
const defer=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};
async function race(firstOp,secondOp){
 const ready=defer(),release=defer();let second;
 const first=db.transaction(async tx=>{
  const out=await firstOp(asDb(tx));ready.resolve();await release.promise;return out;
 });
 first.catch(()=>ready.resolve());
 try{
  await ready.promise;
  second=secondOp(svc);second.catch(()=>{});
  let blocked=false;const end=Date.now()+2500;
  while(Date.now()<end){
   const row=await query("SELECT count(*)::int AS n FROM pg_stat_activity WHERE usename=$1 AND wait_event_type='Lock'",[config.user]);
   if(row[0].n>0){blocked=true;break;}
   await new Promise(r=>setTimeout(r,20));
  }
  assert.equal(blocked,true,'Expected actual competitor lock wait');
  release.resolve();return await Promise.all([first,second]);
 }finally{release.resolve();await Promise.allSettled([first,...(second?[second]:[])]);}
}
let before,successor,otherDevice;
test('runtime_is_non_superuser_non_owner_on_private_socket',async()=>{
 const r=await db.execute(sql`SELECT current_user AS who,inet_server_addr() AS address,
 (SELECT rolsuper FROM pg_roles WHERE rolname=current_user) AS superuser,
 (SELECT pg_get_userbyid(relowner) FROM pg_class WHERE oid='mmhb_refresh_v1.families'::regclass) AS owner`);
 assert.equal(r.rows[0].who,config.user);assert.equal(r.rows[0].address,null);
 assert.equal(r.rows[0].superuser,false);assert.notEqual(r.rows[0].owner,config.user);
});
test('runtime_cannot_run_migration_function',async()=>denied(()=>db.execute(sql`SELECT mmhb_refresh_v1.adopt_legacy()`)));
test('runtime_cannot_mark_migration_complete',async()=>denied(()=>db.execute(sql`INSERT INTO mmhb_refresh_v1.installation(version) VALUES(1)`)));
test('runtime_cannot_create_family_schema_objects',async()=>denied(()=>db.execute(sql`CREATE TABLE mmhb_refresh_v1.forbidden(id integer)`)));
test('missing_marker_blocks_adapter_issuance',async()=>assert.rejects(svc.storeRefreshToken({userId:U,token:fresh()}),e=>errorHas(e,'55000')));
test('admin_adopts_empty_synthetic_legacy_table',async()=>{
 const r=await query('SELECT mmhb_refresh_v1.adopt_legacy() AS n');assert.equal(r[0].n,0);
});
test('issue_and_lookup_preserve_js_date_and_user',async()=>{
 before=fresh();const r=await svc.storeRefreshToken({userId:U,token:before});
 assert.ok(r.expiresAt instanceof Date);assert.equal(r.tokenHash,hashToken(before));
 const found=await svc.findValidRefreshToken(before);assert.ok(found.expiresAt instanceof Date);assert.equal(found.userId,U);
 assert.equal(await svc.verifyRefreshToken({userId:U,token:before}),true);
 assert.equal(await svc.verifyRefreshToken({userId:V,token:before}),false);
});
test('drizzle_binds_hash_and_user_not_raw_token',async()=>{
 const captured=[],dialect=new PgDialect();const exec={execute:async statement=>{
  captured.push(dialect.sqlToQuery(statement));return db.execute(statement);
 }};
 const token=fresh();await asDb(exec).storeRefreshToken({userId:U,token});
 assert.match(captured[0].sql,/\$1/);assert.match(captured[0].sql,/\$2/);
 assert.deepEqual(captured[0].params,[U,hashToken(token)]);assert.equal(JSON.stringify(captured).includes(token),false);
});
test('rotation_consumes_predecessor_without_losing_family',async()=>{
 successor=fresh();const old=await svc.findValidRefreshToken(before);const rotated=await svc.rotateRefreshToken({token:before,newToken:successor});
 assert.equal(rotated.familyId,old.familyId);assert.ok(rotated.expiresAt instanceof Date);
 assert.equal(await svc.findValidRefreshToken(before),null);assert.ok(await svc.findValidRefreshToken(successor));
});
test('ordinary_logout_preserves_another_device',async()=>{
 otherDevice=fresh();await svc.storeRefreshToken({userId:U,token:otherDevice});
 const revoked=await svc.revokeRefreshTokenByToken(before);assert.deepEqual(revoked,{revoked:true,revokedCount:1});
 assert.equal(await svc.findValidRefreshToken(successor),null);assert.ok(await svc.findValidRefreshToken(otherDevice));
});
test('repeated_logout_returns_logical_zero',async()=>assert.deepEqual(await svc.revokeRefreshTokenByToken(before),{revoked:false,revokedCount:0}));
test('wrong_account_scoped_revoke_preserves_session',async()=>{
 assert.equal(await svc.revokeRefreshToken({userId:V,token:otherDevice}),undefined);assert.ok(await svc.findValidRefreshToken(otherDevice));
});
test('explicit_executor_revocation_rolls_back_with_caller',async()=>{
 await assert.rejects(db.transaction(async tx=>{
  await svc.revokeRefreshTokenByToken(otherDevice,tx);
  assert.equal(await asDb(tx).findValidRefreshToken(otherDevice),null);throw new Error('SYNTHETIC_ROLLBACK');
 }),/SYNTHETIC_ROLLBACK/);assert.ok(await svc.findValidRefreshToken(otherDevice));
});
test('account_revocation_uses_supplied_transaction',async()=>{
 await assert.rejects(db.transaction(async tx=>{
  assert.equal(await svc.revokeAllRefreshTokens(U,tx),undefined);
  assert.equal(await asDb(tx).findValidRefreshToken(otherDevice),null);throw new Error('SYNTHETIC_ACCOUNT_ROLLBACK');
 }),/SYNTHETIC_ACCOUNT_ROLLBACK/);assert.ok(await svc.findValidRefreshToken(otherDevice));
});
test('account_revocation_spares_other_accounts',async()=>{
 const t=fresh();await svc.storeRefreshToken({userId:V,token:t});await svc.revokeAllRefreshTokens(U);
 assert.equal(await svc.findValidRefreshToken(otherDevice),null);assert.ok(await svc.findValidRefreshToken(t));
});
test('insertion_collision_rolls_back_consumption_through_adapter',async()=>{
 const a=fresh(),b=fresh();await svc.storeRefreshToken({userId:U,token:a});await svc.storeRefreshToken({userId:V,token:b});
 await assert.rejects(svc.rotateRefreshToken({token:a,newToken:b}),e=>errorHas(e,'23505'));
 assert.ok(await svc.findValidRefreshToken(a));assert.ok(await svc.findValidRefreshToken(b));
});
test('concurrent_adapter_rotations_have_one_winner',async()=>{
 const a=fresh(),b=fresh(),c=fresh();await svc.storeRefreshToken({userId:U,token:a});
 const pair=await race(s=>s.rotateRefreshToken({token:a,newToken:b}),s=>s.rotateRefreshToken({token:a,newToken:c}));
 assert.ok(pair[0]);assert.equal(pair[1],null);assert.ok(await svc.findValidRefreshToken(b));assert.equal(await svc.findValidRefreshToken(c),null);
});
test('rotation_then_delayed_logout_revokes_successor_through_adapter',async()=>{
 const a=fresh(),b=fresh();await svc.storeRefreshToken({userId:U,token:a});
 const pair=await race(s=>s.rotateRefreshToken({token:a,newToken:b}),s=>s.revokeRefreshTokenByToken(a));
 assert.ok(pair[0]);assert.equal(pair[1].revoked,true);assert.equal(await svc.findValidRefreshToken(b),null);
});
test('logout_then_rotation_blocks_successor_through_adapter',async()=>{
 const a=fresh(),b=fresh();await svc.storeRefreshToken({userId:U,token:a});
 const pair=await race(s=>s.revokeRefreshTokenByToken(a),s=>s.rotateRefreshToken({token:a,newToken:b}));
 assert.equal(pair[0].revoked,true);assert.equal(pair[1],null);assert.equal(await svc.findValidRefreshToken(b),null);
});
test('runtime_cannot_delete_predecessor_history',async()=>denied(()=>db.execute(sql`DELETE FROM mmhb_refresh_v1.credentials WHERE false`)));
test('runtime_cannot_call_maintenance_prune',async()=>denied(()=>db.execute(sql`SELECT mmhb_refresh_v1.prune_expired(10)`)));
test('insufficient_table_privilege_is_not_silently_accepted',async()=>{
 await query('REVOKE INSERT ON mmhb_refresh_v1.credentials FROM mmhb_adapter_runtime');
 try{await assert.rejects(svc.storeRefreshToken({userId:U,token:fresh()}),e=>errorHas(e,'42501'));}
 finally{await query('GRANT INSERT ON mmhb_refresh_v1.credentials TO mmhb_adapter_runtime');}
});
test('null_or_malformed_response_is_not_success',async()=>{
 const fake=createRefreshFamilyService({db:{execute:async()=>({rows:[{}]})},sql,hashToken});
 await assert.rejects(fake.storeRefreshToken({userId:U,token:fresh()}),/REFRESH_DATABASE_RESPONSE_INVALID/);
});
test('all_legacy_rows_untouched_by_runtime_adapter',async()=>assert.equal((await query('SELECT count(*)::int AS n FROM public.refresh_tokens'))[0].n,0));
let fatal=null;
try{
 for(const [name,fn] of tests){
  try{await fn();results.push({test:name,pass:true});console.log('ADAPTER_TEST='+name+' PASS');}
  catch(e){results.push({test:name,pass:false,error:e.message,code:e.code??e.cause?.code??null});fatal=e;break;}
 }
}finally{
 const close=await Promise.allSettled([runtimePool.end(),adminPool.end()]);
 const closed=close.every(x=>x.status==='fulfilled');
 const report={schema:'MMHB_NODE_PG_DRIZZLE_ADAPTER_V1',node:process.version,
  scope:'Real pg, Drizzle and PostgreSQL in a private synthetic cluster; no application startup',
  planned:tests.length,total:results.length,passed:results.filter(x=>x.pass).length,
  poolsClosed:closed,results};
 writeFileSync('adapter-pg-results.json',JSON.stringify(report,null,2)+'\n');
 if(fatal||!closed||report.passed!==tests.length)process.exitCode=1;
 else console.log(`ADAPTER_POSTGRES_ASSERTIONS=${tests.length}_OF_${tests.length}`);
}
