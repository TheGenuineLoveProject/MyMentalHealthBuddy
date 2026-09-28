#!/usr/bin/env python3
"""Qualify a candidate refresh-family adapter with existing Node/pg/Drizzle and a
new private PostgreSQL cluster. Never edits MMHB source or migrates a live DB.
Usage: python3 -I MMHB_REFRESH_ADAPTER_QUALIFY.py --test-local
The prior checksum-verified MMHB_REFRESH_FAMILY_QUALIFY.py must remain beside it.
"""
from __future__ import annotations
import argparse, datetime, hashlib, json, os, pathlib, re, shutil, subprocess, sys, types
P=pathlib.Path
ROOT=P('/home/runner/workspace')
HELPER=ROOT/'MMHB_REFRESH_FAMILY_QUALIFY.py'
HELPER_SHA='0d5aeaf4880a58c16ecf3212e46c8d1b2c6f81d83e9515a91112c87ad97c4f51'
SQL_SHA='1feb46d6f7f142c34403032ca1a87e3f8a6f1e493e91a5b63cdf075624d4f340'
EVIDENCE=ROOT/'MMHB_REFRESH_FAMILY_RESULTS_20260917T021550_0451f0.json'
# Embedded files are populated during packaging; no downloads at execution.
EMBEDDED={'refreshFamilyAdapter.mjs': "/**\n * Candidate adapter boundary for the SQL already qualified by MMHB's private\n * PostgreSQL runner. No environment reads, pools, migrations, or imports here.\n * The production wrapper must inject the existing db, Drizzle sql tag and\n * hashToken; this module does not authorize a live database cutover.\n */\nexport function createRefreshFamilyService({ db, sql, hashToken }) {\n  if (!db || typeof db.execute !== 'function' || typeof sql !== 'function' ||\n      typeof hashToken !== 'function') throw new TypeError('INVALID_ADAPTER_DEPENDENCIES');\n  const uuid = value => {\n    if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {\n      throw new TypeError('INVALID_REFRESH_USER_ID');\n    }\n    return value.toLowerCase();\n  };\n  const fail = () => { throw new Error('REFRESH_DATABASE_RESPONSE_INVALID'); };\n  const digest = token => {\n    if (typeof token !== 'string' || token.length === 0 || token.length > 4096) return null;\n    const value = hashToken(token);\n    if (typeof value !== 'string' || !/^[0-9a-f]{64}$/.test(value)) throw new TypeError('INVALID_TOKEN_DIGEST');\n    return value;\n  };\n  const object = value => {\n    if (!value || typeof value !== 'object' || Array.isArray(value)) fail();\n    return value;\n  };\n  const responseId = value => {\n    try { return uuid(value); } catch { return fail(); }\n  };\n  const expiry = value => {\n    // PostgreSQL jsonb timestamps are strings, unlike ordinary pg timestamp\n    // columns. Normalize explicitly, preserving the service's Date contract.\n    if (typeof value !== 'string' || !/^\\d{4}-\\d{2}-\\d{2}T.*(?:Z|[+-]\\d{2}:\\d{2})$/.test(value)) fail();\n    const result = new Date(value);\n    if (!Number.isFinite(result.getTime())) fail();\n    return result;\n  };\n  async function execute(executor, statement) {\n    if (!executor || typeof executor.execute !== 'function') throw new TypeError('INVALID_REFRESH_EXECUTOR');\n    const response = await executor.execute(statement);\n    if (!response || !Array.isArray(response.rows) || response.rows.length !== 1 ||\n        !response.rows[0] || !Object.hasOwn(response.rows[0], 'result') ||\n        response.rows[0].result === undefined) fail();\n    return response.rows[0].result;\n  }\n  function credential(value, expectedHash, kind) {\n    object(value);\n    if (value.tokenHash !== expectedHash) fail();\n    const out = {\n      tokenHash: value.tokenHash,\n      expiresAt: expiry(value.expiresAt),\n      familyId: responseId(value.familyId),\n    };\n    if (kind !== 'issue') out.userId = responseId(value.userId);\n    if (kind === 'find') out.id = responseId(value.id);\n    return out;\n  }\n  function revocation(value) {\n    object(value);\n    if (typeof value.revoked !== 'boolean' || !Number.isInteger(value.revokedCount) ||\n        value.revokedCount < 0 || value.revokedCount > 1 ||\n        value.revoked !== (value.revokedCount === 1)) fail();\n    return { revoked: value.revoked, revokedCount: value.revokedCount };\n  }\n  async function storeRefreshToken({ userId, token }) {\n    const id = uuid(userId), hash = digest(token);\n    if (!hash) throw new TypeError('INVALID_REFRESH_CREDENTIAL');\n    return credential(await execute(db, sql`SELECT mmhb_refresh_v1.issue(${id}::uuid, ${hash}) AS result`), hash, 'issue');\n  }\n  async function findValidRefreshToken(token) {\n    const hash = digest(token);\n    if (!hash) return null;\n    const value = await execute(db, sql`SELECT mmhb_refresh_v1.find_valid(${hash}) AS result`);\n    return value === null ? null : credential(value, hash, 'find');\n  }\n  async function verifyRefreshToken({ userId, token }) {\n    const id = uuid(userId), row = await findValidRefreshToken(token);\n    return Boolean(row && row.userId === id);\n  }\n  async function rotateRefreshToken({ token, newToken }) {\n    const before = digest(token), after = digest(newToken);\n    if (!before || !after) return null;\n    if (before === after) throw new TypeError('REFRESH_REPLACEMENT_MUST_DIFFER');\n    const value = await execute(db, sql`SELECT mmhb_refresh_v1.rotate(${before}, ${after}) AS result`);\n    return value === null ? null : credential(value, after, 'rotate');\n  }\n  async function revokeRefreshTokenByToken(token, executor = db) {\n    const hash = digest(token);\n    if (!hash) return { revoked: false, revokedCount: 0 };\n    return revocation(await execute(executor, sql`SELECT mmhb_refresh_v1.revoke(${hash}) AS result`));\n  }\n  async function revokeRefreshToken({ userId, token }) {\n    const id = uuid(userId), hash = digest(token);\n    if (!hash) return;\n    revocation(await execute(db, sql`SELECT mmhb_refresh_v1.revoke(${hash}, ${id}::uuid) AS result`));\n    // Preserve the previous public service's undefined return contract.\n  }\n  async function revokeAllRefreshTokens(userId, executor = db) {\n    const id = uuid(userId);\n    const count = await execute(executor, sql`SELECT mmhb_refresh_v1.revoke_user(${id}::uuid) AS result`);\n    if (!Number.isSafeInteger(count) || count < 0) fail();\n    // Preserve undefined; importantly, execution used the caller's tx if supplied.\n  }\n  return Object.freeze({ storeRefreshToken, findValidRefreshToken, verifyRefreshToken,\n    rotateRefreshToken, revokeRefreshTokenByToken, revokeRefreshToken, revokeAllRefreshTokens });\n}\n", 'adapter-unit-tests.mjs': "import assert from 'node:assert/strict';\nimport { createHash } from 'node:crypto';\nimport { createRefreshFamilyService } from './refreshFamilyAdapter.mjs';\nimport { writeFileSync } from 'node:fs';\nconst U='11111111-1111-4111-8111-111111111111', V='22222222-2222-4222-8222-222222222222';\nconst F='33333333-3333-4333-8333-333333333333', I='44444444-4444-4444-8444-444444444444';\nconst token='SYNTHETIC_ADAPTER_UNIT_ONLY';\nconst hashToken=x=>createHash('sha256').update(x).digest('hex');\nconst sql=(strings,...params)=>({text:strings.join('?'),params});\nconst valid={tokenHash:hashToken(token),familyId:F,id:I,userId:U,expiresAt:'2030-01-01T00:00:00+00:00'};\nconst record=x=>({rows:[{result:x}]});\nlet response=record(valid), calls=[];\nconst db={execute:async q=>{calls.push(q);return response;}};\nconst make=()=>createRefreshFamilyService({db,sql,hashToken});\nlet service=make(); const results=[];\nconst tests=[]; const test=(name,fn)=>tests.push([name,fn]);\nconst invalid=/REFRESH_DATABASE_RESPONSE_INVALID/;\ntest('rejects_invalid_dependencies',()=>assert.throws(()=>createRefreshFamilyService({db:{},sql,hashToken}),/INVALID_ADAPTER/));\ntest('issuance_preserves_date_contract',async()=>assert.ok((await service.storeRefreshToken({userId:U,token})).expiresAt instanceof Date));\ntest('find_valid_maps_expected_identity',async()=>assert.equal((await service.findValidRefreshToken(token)).id,I));\ntest('verification_checks_user_identity',async()=>{assert.equal(await service.verifyRefreshToken({userId:U,token}),true);assert.equal(await service.verifyRefreshToken({userId:V,token}),false);});\ntest('null_find_is_legitimate_absence',async()=>{response=record(null);assert.equal(await service.findValidRefreshToken(token),null);});\ntest('null_rotation_is_legitimate_conflict',async()=>{response=record(null);assert.equal(await service.rotateRefreshToken({token,newToken:'NEXT_TEST_TOKEN'}),null);});\nfor(const [name,value] of Object.entries({empty_rows:{rows:[]},missing_result:{rows:[{}]},undefined_result:record(undefined),multiple_rows:{rows:[{result:null},{result:null}]},missing_rows:{}})) {\n test('rejects_'+name,async()=>{response=value;await assert.rejects(service.findValidRefreshToken(token),invalid);});\n}\ntest('issuance_cannot_silently_accept_null',async()=>{response=record(null);await assert.rejects(service.storeRefreshToken({userId:U,token}),invalid);});\ntest('valid_revocation_maps_logical_count',async()=>{response=record({revoked:true,revokedCount:1});assert.deepEqual(await service.revokeRefreshTokenByToken(token),{revoked:true,revokedCount:1});});\nfor(const [name,val] of Object.entries({null:null,missing_count:{revoked:true},string_count:{revoked:true,revokedCount:'1'},inconsistent:{revoked:false,revokedCount:1},multiple_families:{revoked:true,revokedCount:2}})) {\n test('rejects_revocation_'+name,async()=>{response=record(val);await assert.rejects(service.revokeRefreshTokenByToken(token),invalid);});\n}\ntest('empty_revocation_does_not_query',async()=>{calls=[];assert.deepEqual(await service.revokeRefreshTokenByToken(''),{revoked:false,revokedCount:0});assert.equal(calls.length,0);});\ntest('long_token_does_not_query',async()=>{calls=[];assert.equal(await service.findValidRefreshToken('a'.repeat(4097)),null);assert.equal(calls.length,0);});\ntest('invalid_user_cannot_become_unscoped_revocation',async()=>{calls=[];await assert.rejects(service.revokeRefreshToken({token,userId:null}),/INVALID_REFRESH_USER_ID/);assert.equal(calls.length,0);});\ntest('bad_uuid_rejected_before_database',async()=>{calls=[];await assert.rejects(service.storeRefreshToken({userId:'not-a-uuid',token}),/INVALID_REFRESH_USER_ID/);assert.equal(calls.length,0);});\ntest('identical_replacement_refused',async()=>{calls=[];await assert.rejects(service.rotateRefreshToken({token,newToken:token}),/MUST_DIFFER/);assert.equal(calls.length,0);});\ntest('raw_token_never_sent_to_executor',async()=>{response=record(valid);calls=[];await service.storeRefreshToken({userId:U,token});assert.deepEqual(calls[0].params,[U,hashToken(token)]);assert.ok(!JSON.stringify(calls).includes(token));});\nfor(const [name,changed] of Object.entries({wrong_hash:{tokenHash:'f'.repeat(64)},bad_expiry:{expiresAt:'not-a-date'},timezone_missing:{expiresAt:'2030-01-01T00:00:00'},bad_family:{familyId:'not-a-uuid'}})) {\n test('rejects_'+name,async()=>{response=record({...valid,...changed});await assert.rejects(service.findValidRefreshToken(token),invalid);});\n}\ntest('caller_executor_receives_revocation',async()=>{calls=[];let touched=0;const tx={execute:async()=>{touched++;return record({revoked:false,revokedCount:0});}};await service.revokeRefreshTokenByToken(token,tx);assert.equal(touched,1);assert.equal(calls.length,0);});\ntest('account_revoke_uses_tx_and_preserves_return',async()=>{calls=[];let touched=0;const tx={execute:async()=>{touched++;return record(2);}};assert.equal(await service.revokeAllRefreshTokens(U,tx),undefined);assert.equal(touched,1);assert.equal(calls.length,0);});\ntest('account_revoke_rejects_missing_count',async()=>{response=record(null);await assert.rejects(service.revokeAllRefreshTokens(U),invalid);});\ntest('database_error_is_not_silently_swallowed',async()=>{const err=Object.assign(new Error('synthetic-db-error'),{code:'55000'});const failDb={execute:async()=>{throw err;}};const s=createRefreshFamilyService({db:failDb,sql,hashToken});await assert.rejects(s.storeRefreshToken({userId:U,token}),e=>e===err);});\ntest('invalid_digest_implementation_refused',async()=>{const s=createRefreshFamilyService({db,sql,hashToken:()=>''});await assert.rejects(s.findValidRefreshToken(token),/INVALID_TOKEN_DIGEST/);});\nfor(const [name,fn] of tests) {\n try {response=record(valid);calls=[];service=make();await fn();results.push({test:name,pass:true});}\n catch(e){results.push({test:name,pass:false,error:e.message});}\n}\nconst out={schema:'MMHB_ADAPTER_BOUNDARY_UNIT_V1',scope:'Real adapter and Node SHA-256; synthetic SQL tag and execute responses, no PostgreSQL',node:process.version,total:results.length,passed:results.filter(r=>r.pass).length,results};\nif(process.argv[2])writeFileSync(process.argv[2],JSON.stringify(out,null,2)+'\\n');\nconsole.log(JSON.stringify(out,null,2));if(out.passed!==out.total)process.exitCode=1;\n", 'adapter-postgres-tests.mjs': '/** Real pg + Drizzle + PostgreSQL; synthetic private cluster only. */\nimport assert from \'node:assert/strict\';\nimport { createHash, randomBytes } from \'node:crypto\';\nimport { readFileSync, writeFileSync, realpathSync } from \'node:fs\';\nimport path from \'node:path\';\nimport { createRequire } from \'node:module\';\nimport { createRefreshFamilyService } from \'./refreshFamilyAdapter.mjs\';\nconst config=JSON.parse(readFileSync(process.argv[2],\'utf8\'));\nassert.equal(path.resolve(config.base),process.cwd());\nassert.match(config.base,/^\\/tmp\\/mmhb-refresh-test-[A-Za-z0-9_-]+$/);\nassert.equal(config.socket,path.join(config.base,\'socket\'));\nassert.equal(realpathSync(config.socket),config.socket);\nassert.equal(config.port,55471);\nassert.equal(config.database,\'postgres\');\nassert.equal(config.user,\'mmhb_adapter_runtime\');\nassert.equal(config.admin,\'mmhb_test\');\nconst require=createRequire(import.meta.url);\nconst pg=require(config.pgEntry);\nconst {drizzle}=require(config.drizzlePgEntry);\nconst {sql}=require(config.drizzleEntry);\nconst {PgDialect}=require(config.pgCoreEntry);\nconst hashToken=token=>createHash(\'sha256\').update(token).digest(\'hex\');\nconst fresh=()=>randomBytes(48).toString(\'base64url\');\nconst U=\'11111111-1111-4111-8111-111111111111\',V=\'22222222-2222-4222-8222-222222222222\';\nconst poolOptions={host:config.socket,port:config.port,database:config.database,ssl:false,\n max:3,connectionTimeoutMillis:4000,idleTimeoutMillis:4000,statement_timeout:10000,\n query_timeout:12000,options:\'-c timezone=UTC -c lock_timeout=5000\',application_name:\'mmhb_adapter_qualification\'};\nconst runtimePool=new pg.Pool({...poolOptions,user:config.user});\nconst adminPool=new pg.Pool({...poolOptions,user:config.admin,max:1});\nconst db=drizzle(runtimePool), asDb=x=>createRefreshFamilyService({db:x,sql,hashToken});\nconst svc=asDb(db), results=[]; const tests=[]; const test=(name,fn)=>tests.push([name,fn]);\nfunction errorHas(e,code){for(let i=0;e&&i<8;i++,e=e.cause){if(e.code===code)return true;}return false;}\nconst denied=fn=>assert.rejects(fn,e=>errorHas(e,\'42501\'));\nconst query=async(text,params=[])=> (await adminPool.query(text,params)).rows;\nconst defer=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};\nasync function race(firstOp,secondOp){\n const ready=defer(),release=defer();let second;\n const first=db.transaction(async tx=>{\n  const out=await firstOp(asDb(tx));ready.resolve();await release.promise;return out;\n });\n first.catch(()=>ready.resolve());\n try{\n  await ready.promise;\n  second=secondOp(svc);second.catch(()=>{});\n  let blocked=false;const end=Date.now()+2500;\n  while(Date.now()<end){\n   const row=await query("SELECT count(*)::int AS n FROM pg_stat_activity WHERE usename=$1 AND wait_event_type=\'Lock\'",[config.user]);\n   if(row[0].n>0){blocked=true;break;}\n   await new Promise(r=>setTimeout(r,20));\n  }\n  assert.equal(blocked,true,\'Expected actual competitor lock wait\');\n  release.resolve();return await Promise.all([first,second]);\n }finally{release.resolve();await Promise.allSettled([first,...(second?[second]:[])]);}\n}\nlet before,successor,otherDevice;\ntest(\'runtime_is_non_superuser_non_owner_on_private_socket\',async()=>{\n const r=await db.execute(sql`SELECT current_user AS who,inet_server_addr() AS address,\n (SELECT rolsuper FROM pg_roles WHERE rolname=current_user) AS superuser,\n (SELECT pg_get_userbyid(relowner) FROM pg_class WHERE oid=\'mmhb_refresh_v1.families\'::regclass) AS owner`);\n assert.equal(r.rows[0].who,config.user);assert.equal(r.rows[0].address,null);\n assert.equal(r.rows[0].superuser,false);assert.notEqual(r.rows[0].owner,config.user);\n});\ntest(\'runtime_cannot_run_migration_function\',async()=>denied(()=>db.execute(sql`SELECT mmhb_refresh_v1.adopt_legacy()`)));\ntest(\'runtime_cannot_mark_migration_complete\',async()=>denied(()=>db.execute(sql`INSERT INTO mmhb_refresh_v1.installation(version) VALUES(1)`)));\ntest(\'runtime_cannot_create_family_schema_objects\',async()=>denied(()=>db.execute(sql`CREATE TABLE mmhb_refresh_v1.forbidden(id integer)`)));\ntest(\'missing_marker_blocks_adapter_issuance\',async()=>assert.rejects(svc.storeRefreshToken({userId:U,token:fresh()}),e=>errorHas(e,\'55000\')));\ntest(\'admin_adopts_empty_synthetic_legacy_table\',async()=>{\n const r=await query(\'SELECT mmhb_refresh_v1.adopt_legacy() AS n\');assert.equal(r[0].n,0);\n});\ntest(\'issue_and_lookup_preserve_js_date_and_user\',async()=>{\n before=fresh();const r=await svc.storeRefreshToken({userId:U,token:before});\n assert.ok(r.expiresAt instanceof Date);assert.equal(r.tokenHash,hashToken(before));\n const found=await svc.findValidRefreshToken(before);assert.ok(found.expiresAt instanceof Date);assert.equal(found.userId,U);\n assert.equal(await svc.verifyRefreshToken({userId:U,token:before}),true);\n assert.equal(await svc.verifyRefreshToken({userId:V,token:before}),false);\n});\ntest(\'drizzle_binds_hash_and_user_not_raw_token\',async()=>{\n const captured=[],dialect=new PgDialect();const exec={execute:async statement=>{\n  captured.push(dialect.sqlToQuery(statement));return db.execute(statement);\n }};\n const token=fresh();await asDb(exec).storeRefreshToken({userId:U,token});\n assert.match(captured[0].sql,/\\$1/);assert.match(captured[0].sql,/\\$2/);\n assert.deepEqual(captured[0].params,[U,hashToken(token)]);assert.equal(JSON.stringify(captured).includes(token),false);\n});\ntest(\'rotation_consumes_predecessor_without_losing_family\',async()=>{\n successor=fresh();const old=await svc.findValidRefreshToken(before);const rotated=await svc.rotateRefreshToken({token:before,newToken:successor});\n assert.equal(rotated.familyId,old.familyId);assert.ok(rotated.expiresAt instanceof Date);\n assert.equal(await svc.findValidRefreshToken(before),null);assert.ok(await svc.findValidRefreshToken(successor));\n});\ntest(\'ordinary_logout_preserves_another_device\',async()=>{\n otherDevice=fresh();await svc.storeRefreshToken({userId:U,token:otherDevice});\n const revoked=await svc.revokeRefreshTokenByToken(before);assert.deepEqual(revoked,{revoked:true,revokedCount:1});\n assert.equal(await svc.findValidRefreshToken(successor),null);assert.ok(await svc.findValidRefreshToken(otherDevice));\n});\ntest(\'repeated_logout_returns_logical_zero\',async()=>assert.deepEqual(await svc.revokeRefreshTokenByToken(before),{revoked:false,revokedCount:0}));\ntest(\'wrong_account_scoped_revoke_preserves_session\',async()=>{\n assert.equal(await svc.revokeRefreshToken({userId:V,token:otherDevice}),undefined);assert.ok(await svc.findValidRefreshToken(otherDevice));\n});\ntest(\'explicit_executor_revocation_rolls_back_with_caller\',async()=>{\n await assert.rejects(db.transaction(async tx=>{\n  await svc.revokeRefreshTokenByToken(otherDevice,tx);\n  assert.equal(await asDb(tx).findValidRefreshToken(otherDevice),null);throw new Error(\'SYNTHETIC_ROLLBACK\');\n }),/SYNTHETIC_ROLLBACK/);assert.ok(await svc.findValidRefreshToken(otherDevice));\n});\ntest(\'account_revocation_uses_supplied_transaction\',async()=>{\n await assert.rejects(db.transaction(async tx=>{\n  assert.equal(await svc.revokeAllRefreshTokens(U,tx),undefined);\n  assert.equal(await asDb(tx).findValidRefreshToken(otherDevice),null);throw new Error(\'SYNTHETIC_ACCOUNT_ROLLBACK\');\n }),/SYNTHETIC_ACCOUNT_ROLLBACK/);assert.ok(await svc.findValidRefreshToken(otherDevice));\n});\ntest(\'account_revocation_spares_other_accounts\',async()=>{\n const t=fresh();await svc.storeRefreshToken({userId:V,token:t});await svc.revokeAllRefreshTokens(U);\n assert.equal(await svc.findValidRefreshToken(otherDevice),null);assert.ok(await svc.findValidRefreshToken(t));\n});\ntest(\'insertion_collision_rolls_back_consumption_through_adapter\',async()=>{\n const a=fresh(),b=fresh();await svc.storeRefreshToken({userId:U,token:a});await svc.storeRefreshToken({userId:V,token:b});\n await assert.rejects(svc.rotateRefreshToken({token:a,newToken:b}),e=>errorHas(e,\'23505\'));\n assert.ok(await svc.findValidRefreshToken(a));assert.ok(await svc.findValidRefreshToken(b));\n});\ntest(\'concurrent_adapter_rotations_have_one_winner\',async()=>{\n const a=fresh(),b=fresh(),c=fresh();await svc.storeRefreshToken({userId:U,token:a});\n const pair=await race(s=>s.rotateRefreshToken({token:a,newToken:b}),s=>s.rotateRefreshToken({token:a,newToken:c}));\n assert.ok(pair[0]);assert.equal(pair[1],null);assert.ok(await svc.findValidRefreshToken(b));assert.equal(await svc.findValidRefreshToken(c),null);\n});\ntest(\'rotation_then_delayed_logout_revokes_successor_through_adapter\',async()=>{\n const a=fresh(),b=fresh();await svc.storeRefreshToken({userId:U,token:a});\n const pair=await race(s=>s.rotateRefreshToken({token:a,newToken:b}),s=>s.revokeRefreshTokenByToken(a));\n assert.ok(pair[0]);assert.equal(pair[1].revoked,true);assert.equal(await svc.findValidRefreshToken(b),null);\n});\ntest(\'logout_then_rotation_blocks_successor_through_adapter\',async()=>{\n const a=fresh(),b=fresh();await svc.storeRefreshToken({userId:U,token:a});\n const pair=await race(s=>s.revokeRefreshTokenByToken(a),s=>s.rotateRefreshToken({token:a,newToken:b}));\n assert.equal(pair[0].revoked,true);assert.equal(pair[1],null);assert.equal(await svc.findValidRefreshToken(b),null);\n});\ntest(\'runtime_cannot_delete_predecessor_history\',async()=>denied(()=>db.execute(sql`DELETE FROM mmhb_refresh_v1.credentials WHERE false`)));\ntest(\'runtime_cannot_call_maintenance_prune\',async()=>denied(()=>db.execute(sql`SELECT mmhb_refresh_v1.prune_expired(10)`)));\ntest(\'insufficient_table_privilege_is_not_silently_accepted\',async()=>{\n await query(\'REVOKE INSERT ON mmhb_refresh_v1.credentials FROM mmhb_adapter_runtime\');\n try{await assert.rejects(svc.storeRefreshToken({userId:U,token:fresh()}),e=>errorHas(e,\'42501\'));}\n finally{await query(\'GRANT INSERT ON mmhb_refresh_v1.credentials TO mmhb_adapter_runtime\');}\n});\ntest(\'null_or_malformed_response_is_not_success\',async()=>{\n const fake=createRefreshFamilyService({db:{execute:async()=>({rows:[{}]})},sql,hashToken});\n await assert.rejects(fake.storeRefreshToken({userId:U,token:fresh()}),/REFRESH_DATABASE_RESPONSE_INVALID/);\n});\ntest(\'all_legacy_rows_untouched_by_runtime_adapter\',async()=>assert.equal((await query(\'SELECT count(*)::int AS n FROM public.refresh_tokens\'))[0].n,0));\nlet fatal=null;\ntry{\n for(const [name,fn] of tests){\n  try{await fn();results.push({test:name,pass:true});console.log(\'ADAPTER_TEST=\'+name+\' PASS\');}\n  catch(e){results.push({test:name,pass:false,error:e.message,code:e.code??e.cause?.code??null});fatal=e;break;}\n }\n}finally{\n const close=await Promise.allSettled([runtimePool.end(),adminPool.end()]);\n const closed=close.every(x=>x.status===\'fulfilled\');\n const report={schema:\'MMHB_NODE_PG_DRIZZLE_ADAPTER_V1\',node:process.version,\n  scope:\'Real pg, Drizzle and PostgreSQL in a private synthetic cluster; no application startup\',\n  planned:tests.length,total:results.length,passed:results.filter(x=>x.pass).length,\n  poolsClosed:closed,results};\n writeFileSync(\'adapter-pg-results.json\',JSON.stringify(report,null,2)+\'\\n\');\n if(fatal||!closed||report.passed!==tests.length)process.exitCode=1;\n else console.log(`ADAPTER_POSTGRES_ASSERTIONS=${tests.length}_OF_${tests.length}`);\n}\n'}

class Stop(RuntimeError):pass
def require(ok,message):
    if not ok: raise Stop(message)
def sha(raw):return hashlib.sha256(raw).hexdigest()
def load_support():
    require(not HELPER.is_symlink() and HELPER.is_file(),'PRIOR_QUALIFIER_FILE_MISSING_OR_SYMLINK')
    raw=HELPER.read_bytes()
    require(sha(raw)==HELPER_SHA,'PRIOR_QUALIFIER_CHECKSUM_DIFFERS')
    # Execute exactly the reviewed helper definitions, never its __main__ block.
    h=types.ModuleType('mmhb_verified_cluster_support');h.__file__=str(HELPER)
    exec(compile(raw,str(HELPER),'exec'),h.__dict__)
    require(sha(h.PROTOTYPE_SQL.encode())==SQL_SHA,'QUALIFIED_SQL_CHECKSUM_DIFFERS')
    return h

def validate_evidence(h):
    data=h.read_plain(EVIDENCE,4*1024*1024);r=json.loads(data)
    require(r.get('schema')=='MMHB_REFRESH_FAMILY_POSTGRES_QUALIFICATION_V1','SQL_EVIDENCE_SCHEMA')
    require(r.get('checkpoint')==h.COMMIT and r.get('prototypeSqlSha256')==SQL_SHA,'SQL_EVIDENCE_IDENTITY')
    rows=r.get('results',[])
    require(r.get('passed')==31 and r.get('total')==31 and len(rows)==31 and
            all(x.get('pass') is True for x in rows) and len({x.get('test') for x in rows})==31,'SQL_EVIDENCE_INCOMPLETE')
    require(r.get('error') is None and r.get('testClusterStopped') is True and
            r.get('existingSourceAndCandidateMetadataUnchanged') is True and
            r.get('applicationSourceEdits')==0 and r.get('liveDatabaseConnections')==0,'SQL_EVIDENCE_NOT_CLEAN')
    return sha(data)

RESOLVE_JS=r'''
import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';
const config=JSON.parse(process.argv[1]);
const problems=[];
for(const base of config.bases){
 try{
  const req=createRequire(path.join(base,'package.json'));
  const out={base,versions:{}};
  const dirs={};
  for(const name of ['pg','drizzle-orm']){
   const dir=path.join(base,'node_modules',name);
   const manifest=JSON.parse(fs.readFileSync(path.join(dir,'package.json'),'utf8'));
   if(manifest.name!==name||manifest.version!==config.versions[name])throw Error('DEPENDENCY_VERSION_MISMATCH:'+name);
   dirs[name]=fs.realpathSync(dir);out.versions[name]=manifest.version;
  }
  for(const [key,spec,pkg] of [['pgEntry','pg','pg'],['drizzleEntry','drizzle-orm','drizzle-orm'],['drizzlePgEntry','drizzle-orm/node-postgres','drizzle-orm'],['pgCoreEntry','drizzle-orm/pg-core','drizzle-orm']]){
   const entry=fs.realpathSync(req.resolve(spec));
   if(!entry.startsWith(dirs[pkg]+path.sep))throw Error('DEPENDENCY_ENTRY_OUTSIDE_EXPECTED_PACKAGE');
   out[key]=entry;
  }
  console.log(JSON.stringify(out));process.exit(0);
 }catch(e){problems.push({base,error:e.code??e.message});}
}
console.log(JSON.stringify({error:'MATCHED_EXISTING_DEPENDENCIES_NOT_FOUND',problems}));process.exit(1);
'''

def prepare_node(h):
    node=shutil.which('node');require(bool(node),'NODE_NOT_FOUND_NO_INSTALL_ATTEMPTED')
    clean={'PATH':os.environ.get('PATH','/usr/bin:/bin'),'LANG':'C','LC_ALL':'C','TZ':'UTC','NODE_DISABLE_COMPILE_CACHE':'1'}
    v=subprocess.run([node,'--version'],env=clean,capture_output=True,text=True,timeout=5)
    require(v.returncode==0 and re.fullmatch(r'v24\.\d+\.\d+\s*',v.stdout) is not None,'NODE_24_REQUIRED_NO_INSTALL_ATTEMPTED')
    raw=h.git(['cat-file','blob',h.COMMIT+':package-lock.json'])
    require(raw==h.read_plain(h.WORK/'package-lock.json',24*1024*1024),'WORKING_LOCKFILE_DIFFERS')
    lock=json.loads(raw);versions={}
    for name in ('pg','drizzle-orm'):
        version=lock.get('packages',{}).get('node_modules/'+name,{}).get('version')
        require(isinstance(version,str) and bool(re.fullmatch(r'\d+\.\d+\.\d+(?:[-+][a-zA-Z0-9.-]+)?',version)),'DEPENDENCY_LOCK_ENTRY_MISSING:'+name)
        versions[name]=version
    config={'bases':[str(h.WORK),str(h.ROOT)],'versions':versions}
    r=subprocess.run([node,'--input-type=module','-e',RESOLVE_JS,json.dumps(config)],env=clean,cwd=h.STORE,capture_output=True,text=True,timeout=10)
    if r.returncode:
        print('DEPENDENCY_PREFLIGHT='+r.stdout.strip(),flush=True)
        raise Stop('MATCHED_EXISTING_DEPENDENCIES_NOT_FOUND_NO_INSTALL_ATTEMPTED')
    deps=json.loads(r.stdout);require(deps.get('versions')==versions,'DEPENDENCY_RESOLUTION_FAILED')
    return node,clean,deps,v.stdout.strip(),sha(raw)

GRANTS=r'''
CREATE ROLE mmhb_adapter_runtime LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION NOBYPASSRLS NOINHERIT;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
GRANT CONNECT ON DATABASE postgres TO mmhb_adapter_runtime;
GRANT USAGE ON SCHEMA public,mmhb_refresh_v1 TO mmhb_adapter_runtime;
GRANT SELECT(id), UPDATE(id) ON public.users TO mmhb_adapter_runtime;
GRANT SELECT ON mmhb_refresh_v1.installation TO mmhb_adapter_runtime;
GRANT SELECT,INSERT ON mmhb_refresh_v1.families,mmhb_refresh_v1.credentials TO mmhb_adapter_runtime;
GRANT UPDATE(expires_at,revoked_at) ON mmhb_refresh_v1.families TO mmhb_adapter_runtime;
GRANT UPDATE(consumed_at) ON mmhb_refresh_v1.credentials TO mmhb_adapter_runtime;
GRANT EXECUTE ON FUNCTION mmhb_refresh_v1.require_ready(),mmhb_refresh_v1.valid_hash(text),
 mmhb_refresh_v1.issue(uuid,text),mmhb_refresh_v1.find_valid(text),mmhb_refresh_v1.rotate(text,text),
 mmhb_refresh_v1.revoke(text,uuid),mmhb_refresh_v1.revoke_user(uuid) TO mmhb_adapter_runtime;
'''

def run_local(pg_bin=None):
    require(os.geteuid()!=0,'REFUSE_ROOT_TEST_CLUSTER')
    h=load_support();before=h.repository_snapshot();evidence=validate_evidence(h)
    print('CHECKPOINT='+h.COMMIT+'\nPREVIOUS_SQL_QUALIFICATION=31_OF_31_VERIFIED\nSQL_PAYLOAD=UNCHANGED',flush=True)
    node,clean,deps,node_version,locksha=prepare_node(h)
    folder,pg_version=h.binaries(pg_bin)
    print('NODE='+node_version+'\nPOSTGRES='+pg_version+'\nDEPENDENCY_VERSIONS='+json.dumps(deps['versions'],sort_keys=True),flush=True)
    print('DEPENDENCY_VERSION_SOURCE=CANDIDATE_LOCKFILE\nINSTALL=NO',flush=True)
    c=h.Cluster(folder);error=None;unchanged=False;stopped=False;boundary=None;integration=None
    try:
        c.start()
        print('TEST_DIRECTORY='+str(c.base)+'\nTCP_LISTENERS=DISABLED\nDATABASE_TARGET=NEW_PRIVATE_CLUSTER',flush=True)
        for name,content in EMBEDDED.items():
            require('/' not in name and name.endswith('.mjs'),'INVALID_EMBEDDED_FILE_NAME')
            (c.base/name).write_text(content)
        (c.base/'qualified-prototype.sql').write_text(h.PROTOTYPE_SQL)
        (c.base/'synthetic-runtime-grants.sql').write_text(GRANTS)
        # Establish schema as test administrator only. Application role gets no
        # migration, readiness-marker write, DDL or maintenance permission.
        c.sql(h.FIXTURE);c.sql(h.PROTOTYPE_SQL);c.sql(GRANTS)
        conf={**deps,'base':str(c.base),'socket':str(c.sock),'port':55471,
              'database':'postgres','user':'mmhb_adapter_runtime','admin':'mmhb_test'}
        (c.base/'adapter-config.json').write_text(json.dumps(conf))
        env={**clean,'HOME':str(c.base)}
        runs=[('adapter-unit-tests.mjs','boundary-results.json',45),('adapter-postgres-tests.mjs','adapter-config.json',100)]
        for filename,arg,limit in runs:
            p=subprocess.run([node,str(c.base/filename),str(c.base/arg)],env=env,cwd=c.base,
                stdout=subprocess.PIPE,stderr=subprocess.PIPE,timeout=limit)
            (c.base/(filename+'.log')).write_bytes(p.stdout+b'\n'+p.stderr)
            if filename=='adapter-unit-tests.mjs':
                require((c.base/'boundary-results.json').is_file(),'BOUNDARY_REPORT_MISSING')
                boundary=json.loads((c.base/'boundary-results.json').read_bytes())
                require(p.returncode==0 and boundary['total']==33 and boundary['passed']==33,'ADAPTER_BOUNDARY_TESTS_FAILED')
                print('ADAPTER_BOUNDARY_ASSERTIONS=33_OF_33',flush=True)
            else:
                for line in p.stdout.decode(errors='replace').splitlines():
                    if line.startswith(('ADAPTER_TEST=','ADAPTER_POSTGRES_ASSERTIONS=')):print(line,flush=True)
                require((c.base/'adapter-pg-results.json').is_file(),'ADAPTER_POSTGRES_REPORT_MISSING')
                integration=json.loads((c.base/'adapter-pg-results.json').read_bytes())
                require(p.returncode==0 and integration.get('planned')==24 and integration.get('total')==24 and
                        integration.get('passed')==24 and integration.get('poolsClosed') is True,'ADAPTER_POSTGRES_TESTS_FAILED')
    except (Exception,KeyboardInterrupt) as exc:
        error=type(exc).__name__+':'+str(exc)
    finally:
        try:stopped=c.stop()
        except Exception as exc:error=(error or '')+';STOP_ERROR:'+type(exc).__name__
        try:unchanged=(h.repository_snapshot()==before)
        except Exception as exc:error=(error or '')+';POSTCHECK:'+str(exc)
        if not stopped:error=(error or '')+';TEST_CLUSTER_STOP_NOT_CONFIRMED'
        if not unchanged:error=(error or '')+';SOURCE_OR_METADATA_CHANGED'
        for var,filename in [('boundary','boundary-results.json'),('integration','adapter-pg-results.json')]:
            if c.base and (c.base/filename).is_file():
                try:
                    value=json.loads((c.base/filename).read_bytes())
                    if var=='boundary':boundary=value
                    else:integration=value
                except Exception:pass
        report={'schema':'MMHB_REFRESH_ADAPTER_QUALIFICATION_V1','checkpoint':h.COMMIT,
            'previousSqlEvidenceSha256':evidence,'sqlSha256':SQL_SHA,'candidateLockfileSha256':locksha,
            'adapterSha256':sha(EMBEDDED['refreshFamilyAdapter.mjs'].encode()),
            'node':node_version,'postgres':pg_version,'dependencyVersions':deps['versions'],
            'dependencyBase':deps['base'],'dependencyVerificationScope':'Installed direct-package versions and entry locations; not a full dependency-integrity audit',
            'boundary':boundary,'integration':integration,'testDirectory':str(c.base) if c.base else None,
            'testClusterStopped':stopped,'existingSourceAndMetadataUnchanged':unchanged,
            'sourceEdits':0,'liveDatabaseConnections':0,'applicationStart':False,
            'applicationIntegration':'NOT_APPLIED','productionMigration':'NOT_APPROVED','error':error}
        name='MMHB_REFRESH_ADAPTER_RESULTS_'+datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S')+'_'+os.urandom(3).hex()+'.json'
        path=ROOT/name
        with path.open('x') as f:os.chmod(path,0o600);json.dump(report,f,indent=2);f.write('\n')
        print('RESULTS_FILE='+str(path),flush=True)
        print('TEST_CLUSTER_STOPPED='+('YES' if stopped else 'NO'),flush=True)
        print('EXISTING_SOURCE_AND_METADATA_UNCHANGED='+('YES' if unchanged else 'NO'),flush=True)
        print('APPLICATION_SOURCE_EDITS=NO\nMMHB_DATABASE_MIGRATION=NO\nMMHB_APPLICATION_START=NO\nPUSH=NO\nDEPLOY=NO',flush=True)
    if error:raise Stop(error)
    print('MMHB_RUNTIME_INTEGRATION=NOT_APPLIED\nSTATUS=REFRESH_ADAPTER_QUALIFIED_LOCALLY',flush=True)

if __name__=='__main__':
    os.umask(0o077)
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--test-local',action='store_true')
    ap.add_argument('--pg-bin',help='An existing PostgreSQL binary directory; never installed by this runner')
    args=ap.parse_args()
    print('COMMAND=MMHB_REFRESH_ADAPTER_QUALIFY',flush=True)
    if not args.test_local:
        print('ACTION_REQUIRED=--test-local\nAPPLICATION_SOURCE_EDITS=NO\nDATABASE_OPERATIONS=NO');sys.exit(0)
    try:run_local(args.pg_bin)
    except (Exception,KeyboardInterrupt) as exc:
        print('STOP='+str(exc),flush=True);print('STATUS=REFRESH_ADAPTER_QUALIFICATION_STOPPED',flush=True);sys.exit(1)
