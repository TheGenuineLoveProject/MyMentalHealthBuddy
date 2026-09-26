#!/usr/bin/env bash
# G38: isolated PostgreSQL schema qualification; no application installation.
(
set -eu
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB38_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace';
const PREVIOUS=ROOT+'/.git/mmhb-review-evidence/billing-candidates-w7Q3B8';
const ID='MMHB-BILLING-SCHEMA-QUALIFICATION-20260925-38';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const check=(ok,why)=>{if(!ok)throw Error(why);};
const env={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',TZ:'UTC',CI:'true',
  GIT_OPTIONAL_LOCKS:'0',GIT_TERMINAL_PROMPT:'0',GIT_NO_LAZY_FETCH:'1'};
const inputs=new Map();
let directory,data,socket,PG,before,report,started=false,interrupted=false;
let status='STOPPED',stopped='NOT_STARTED',preserved=false;
process.on('SIGINT',()=>{interrupted=true;});
process.on('SIGTERM',()=>{interrupted=true;});
function git(...args){
  const r=spawnSync('git',['--no-pager','--no-optional-locks','-c','core.fsmonitor=false',
    '-c','core.quotePath=true',...args],{cwd:ROOT,env,encoding:'utf8',timeout:30000,maxBuffer:33554432});
  check(!r.error&&r.status===0,'Git inspection failed: '+args[0]);return r.stdout;
}
function bytes(file){
  const s=fs.lstatSync(file);
  check(s.isFile()&&s.size<=4194304&&fs.realpathSync(file)===file,'Unsafe or oversized input: '+file);
  const b=fs.readFileSync(file),h=hash(b);
  if(inputs.has(file))check(inputs.get(file)===h,'Input changed: '+file);
  else inputs.set(file,h);
  return b;
}
function snapshot(){
  const index=path.resolve(ROOT,git('rev-parse','--git-path','index').trim());
  check(fs.lstatSync(index).isFile(),'Unexpected Git index');
  return {head:git('rev-parse','HEAD').trim(),branch:git('branch','--show-current').trim(),
    index:hash(fs.readFileSync(index)),tracked:git('status','--porcelain=v1','--untracked-files=no','--ignore-submodules=none'),
    diff:hash(git('diff','--binary','--no-ext-diff','--no-textconv','HEAD','--')),
    untrackedNames:hash(git('ls-files','--others','--exclude-standard','-z')),
    package:hash(bytes(path.join(ROOT,'package.json'))),lock:hash(bytes(path.join(ROOT,'package-lock.json')))};
}
function put(rel,value){
  check(!path.isAbsolute(rel)&&!rel.split('/').includes('..'),'Invalid output path');
  const file=path.join(directory,rel);fs.mkdirSync(path.dirname(file),{recursive:true,mode:0o700});
  fs.writeFileSync(file,value,{flag:'wx',mode:0o600});return file;
}
function run(label,command,args,timeout=45000,ok=[0],cleanup=false){
  check(cleanup||!interrupted,'Interrupted before '+label);
  console.log(label+'=RUNNING');
  const r=spawnSync(command,args,{cwd:directory,env,encoding:'utf8',timeout,killSignal:'SIGKILL',maxBuffer:8388608});
  put('logs/'+label+'.log',(r.stdout||'')+(r.stderr||'')+(r.error?'\n'+r.error.message:''));
  check(!r.error&&ok.includes(r.status),label+' failed; private log retained');return r;
}
function privateDirectory(dir){
  const s=fs.lstatSync(dir);
  check(s.isDirectory()&&s.uid===process.getuid()&&(s.mode&0o077)===0&&fs.realpathSync(dir)===dir,
    'Expected private owned directory: '+dir);
}

const pins={
  'server/utils/planMapping.mjs':'a4990a99c8b8cd87c37a0348c5dcd5f61040c927c4db80c9bc76a3a8fda34f55',
  'server/routes/webhook.mjs':'5f09d685e57e53a79e959e650b8e2b6a60abda89e1b089e07ad6a16672095ba7',
  'server/services/email.mjs':'815fba3d724995e1f809f861be476b32facbad298b99bae1284bb225804929df',
  'server/app.mjs':'ef9c243bce76fe646a14a5c6556711faf664d772dc00384b24b8e85003d0eca6',
  'server/db/client.mjs':'c536d3d0390b1c1caa49edc69c82ba5fd953baf6e2f649eec7cc0d004d3c2c07',
  'server/db/connection.mjs':'6baa2747e839ce79d623564b5ad64067e9a8ca90975dc262383185592e7500fc',
  'server/db/sslConfig.mjs':'5cd34b8606acc79303666990a55bcaa355f67b34a02e0973dacb0d6c534e62fa',
  'server/db/ensureSchema.mjs':'23343e14ace7796e1da29fb335a448f044982c3346b26a1b026bd7b711cfb7e0',
  'server/db/schema.canonical.sql':'e92e18c4d6bbfdf6faef7760e1116aa786b7b9dddc266db37c2f03998913e712',
  'scripts/generate-canonical-schema.mjs':'5b9d9b3e0f32a96caa6dc6963b890fdb2888616429a09dae1c129174adf42e45',
  '.replit':'eaf2ed1554aef18cfbc30319b6828c68c15088ddde6c418e94a2a4b45eef3358',
  'scripts/build-server.mjs':'9e046524ba1e77b5202c0bbe895b8a6a430e38b5188b1a2f2613525a183c4816',
  'database/schema/index.ts':'654486629dc63c9b3dabea9921cd2d9fa82d753ff46c61626f8ddfdb7939e673',
  'shared/schema.mjs':'bcd740ef7e5ffcb76d41c375ad8018a1d620c9854a995e86cd3ee2236607efa9',
  'server/db/schemaBridge.mjs':'9ff59d540cbd4d3065097f5985ba495c541c9b072eb8a9a5dfe8e5d2d03fbe49',
  'server/db/schema/refreshTokens.js':'bfdcd9c2b31c1de68eb3be1a350803d39ed9b15e3602eea251f4d9562dc83f85'
};

function billingSchemaFactory() {
  const tableNames=['billing_notification_deliveries','billing_notification_intents'];
  const relationNames=[...tableNames,'billing_notification_deliveries_pkey',
    'billing_notification_deliveries_idempotency_key_key','billing_notification_intents_pkey','billing_delivery_due'];
  const functionName='guard_billing_delivery_immutable';
  const fault=code=>Object.assign(Error('Billing schema: '+code),{code});
  const check=(ok,code)=>{if(!ok)throw fault(code);};
  function canonical(value) {
    if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';
    if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';
    return JSON.stringify(value);
  }
  const sort=rows=>rows.sort((a,b)=>canonical(a).localeCompare(canonical(b),'en'));
  async function rows(client,text,values=[]) {
    const result=await client.query(text,values);
    check(Array.isArray(result.rows)&&result.rows.length<=256,'catalog_result_out_of_bounds');
    return result.rows;
  }
  async function captureBillingSchema(client) {
    check(client&&typeof client.query==='function','invalid_client');
    // Call within a transaction whose search_path is pg_catalog. OIDs are used
    // only to join catalogs and never form part of the portable contract.
    const settings=await rows(client,`SELECT current_setting('server_version_num')::integer/10000 AS major,
      current_setting('search_path') AS search_path`);
    check(settings[0]?.major===16,'unsupported_postgres_major');
    check(settings[0]?.search_path==='pg_catalog','catalog_search_path_required');
    const prerequisite=await rows(client,`SELECT c.relkind,c.relpersistence,c.relrowsecurity,c.relforcerowsecurity,c.relispartition,
      a.attname,pg_catalog.format_type(a.atttypid,a.atttypmod) AS type,a.attnotnull,
      a.attidentity,a.attgenerated,
      EXISTS(SELECT 1 FROM pg_catalog.pg_constraint k WHERE k.conrelid=c.oid AND k.contype='p'
        AND k.convalidated AND NOT k.condeferrable AND k.conkey=ARRAY[a.attnum]::smallint[]) AS single_primary,
      EXISTS(SELECT 1 FROM pg_catalog.pg_index ix WHERE ix.indrelid=c.oid AND ix.indisprimary
        AND ix.indisvalid AND ix.indisready AND ix.indimmediate AND ix.indnatts=1
        AND ix.indkey[0]=a.attnum) AS usable_primary
      FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace
      JOIN pg_catalog.pg_attribute a ON a.attrelid=c.oid AND a.attnum>0 AND NOT a.attisdropped
      WHERE n.nspname='public' AND c.relname='webhook_events'
        AND a.attname=ANY($1::text[]) ORDER BY a.attname LIMIT 257`,[['id','event_type','status','processed_at']]);
    const relations=await rows(client,`SELECT c.relname,c.relkind,c.relpersistence,c.relrowsecurity,c.relforcerowsecurity,c.relispartition,
      c.relreplident,c.reloptions,
      EXISTS(SELECT 1 FROM pg_catalog.pg_inherits i WHERE i.inhrelid=c.oid OR i.inhparent=c.oid) AS inherited
      FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace
      WHERE n.nspname='public' AND c.relname=ANY($1::text[]) ORDER BY c.relname LIMIT 257`,[relationNames]);
    const tables=[];
    for(const name of tableNames) {
      const params=[name];
      const columns=await rows(client,`SELECT a.attname,pg_catalog.format_type(a.atttypid,a.atttypmod) AS type,
        a.attnotnull,a.attidentity,a.attgenerated,
        pg_catalog.pg_get_expr(d.adbin,d.adrelid,false) AS default_expression,
        cn.nspname AS collation_schema,co.collname AS collation_name
        FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace
        JOIN pg_catalog.pg_attribute a ON a.attrelid=c.oid AND a.attnum>0 AND NOT a.attisdropped
        LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid=c.oid AND d.adnum=a.attnum
        LEFT JOIN pg_catalog.pg_collation co ON co.oid=a.attcollation
        LEFT JOIN pg_catalog.pg_namespace cn ON cn.oid=co.collnamespace
        WHERE n.nspname='public' AND c.relname=$1 ORDER BY a.attnum LIMIT 257`,params);
      const constraints=await rows(client,`SELECT k.conname,k.contype,k.convalidated,k.condeferrable,k.condeferred,k.connoinherit,
        (k.conparentid<>0) AS has_parent,pg_catalog.pg_get_constraintdef(k.oid,false) AS definition
        FROM pg_catalog.pg_constraint k JOIN pg_catalog.pg_class c ON c.oid=k.conrelid
        JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace
        WHERE n.nspname='public' AND c.relname=$1 ORDER BY k.conname LIMIT 257`,params);
      const indexes=await rows(client,`SELECT ic.relname,ix.indisunique,ix.indisprimary,ix.indisvalid,ix.indisready,
        ix.indislive,ix.indimmediate,ix.indisreplident,ix.indnullsnotdistinct,
        pg_catalog.pg_get_indexdef(ix.indexrelid,0,false) AS definition,
        pg_catalog.pg_get_expr(ix.indpred,ix.indrelid,false) AS predicate
        FROM pg_catalog.pg_index ix JOIN pg_catalog.pg_class c ON c.oid=ix.indrelid
        JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace
        JOIN pg_catalog.pg_class ic ON ic.oid=ix.indexrelid
        WHERE n.nspname='public' AND c.relname=$1 ORDER BY ic.relname LIMIT 257`,params);
      const triggers=sort(await rows(client,`SELECT CASE WHEN t.tgisinternal THEN NULL ELSE t.tgname END AS name,
        t.tgisinternal,t.tgenabled,t.tgtype,t.tgdeferrable,t.tginitdeferred,t.tgnargs,
        pg_catalog.encode(t.tgargs,'hex') AS arguments,
        pg_catalog.pg_get_expr(t.tgqual,t.tgrelid,false) AS when_expression,
        (t.tgparentid<>0) AS has_parent,t.tgoldtable,t.tgnewtable,
        pn.nspname AS function_schema,p.proname AS function_name,
        pg_catalog.pg_get_function_identity_arguments(p.oid) AS function_arguments,
        k.conname AS constraint_name,
        ARRAY(SELECT a.attname FROM pg_catalog.unnest(t.tgattr::smallint[]) WITH ORDINALITY u(attnum,ord)
          JOIN pg_catalog.pg_attribute a ON a.attrelid=c.oid AND a.attnum=u.attnum ORDER BY u.ord) AS update_columns
        FROM pg_catalog.pg_trigger t JOIN pg_catalog.pg_class c ON c.oid=t.tgrelid
        JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace
        JOIN pg_catalog.pg_proc p ON p.oid=t.tgfoid JOIN pg_catalog.pg_namespace pn ON pn.oid=p.pronamespace
        LEFT JOIN pg_catalog.pg_constraint k ON k.oid=t.tgconstraint
        WHERE n.nspname='public' AND c.relname=$1 LIMIT 257`,params));
      const rules=await rows(client,`SELECT r.rulename,r.ev_enabled,pg_catalog.pg_get_ruledef(r.oid,false) AS definition
        FROM pg_catalog.pg_rewrite r JOIN pg_catalog.pg_class c ON c.oid=r.ev_class
        JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace
        WHERE n.nspname='public' AND c.relname=$1 ORDER BY r.rulename LIMIT 257`,params);
      tables.push({name,columns,constraints,indexes,triggers,rules});
    }
    const functions=await rows(client,`SELECT p.proname,pg_catalog.pg_get_function_identity_arguments(p.oid) AS arguments,
      pg_catalog.pg_get_function_result(p.oid) AS result,l.lanname,p.prokind,p.prosecdef,p.proleakproof,p.proisstrict,
      p.provolatile,p.proparallel,p.proconfig,p.prosrc,p.probin,
      pg_catalog.pg_get_functiondef(p.oid) AS definition
      FROM pg_catalog.pg_proc p JOIN pg_catalog.pg_namespace n ON n.oid=p.pronamespace
      JOIN pg_catalog.pg_language l ON l.oid=p.prolang
      WHERE n.nspname='public' AND p.proname=$1 ORDER BY arguments LIMIT 257`,[functionName]);
    return {schemaVersion:1,pgMajor:16,prerequisite,relations,tables,functions};
  }
  function createBillingSchemaManager({pool,expected,migrationSQL}={}) {
    check(pool&&typeof pool.connect==='function','invalid_pool');
    check(expected?.schemaVersion===1&&expected.pgMajor===16&&Array.isArray(expected.prerequisite)&&
      expected.prerequisite.length===4&&Array.isArray(expected.tables)&&expected.tables.length===2&&
      Array.isArray(expected.functions)&&expected.functions.length===1&&Array.isArray(expected.relations)&&
      expected.relations.length===6,'invalid_expected_schema');
    check(typeof migrationSQL==='string'&&migrationSQL.length>0&&Buffer.byteLength(migrationSQL)<=65536,'invalid_migration_sql');
    // Caller supplies the hash-verified, review-owned migration and expected
    // contract; take a private JSON snapshot so later caller mutation cannot
    // change readiness semantics.
    const contract=JSON.parse(JSON.stringify(expected)),expectedText=canonical(contract);
    const prerequisiteText=canonical(contract.prerequisite);
    async function transaction(install) {
      const client=await pool.connect();let began=false,discard;
      try {
        await client.query(install?'BEGIN':'BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY');began=true;
        await client.query("SET LOCAL search_path = pg_catalog");
        await client.query("SET LOCAL lock_timeout = '3s'");
        await client.query("SET LOCAL statement_timeout = '10s'");
        await client.query("SET LOCAL idle_in_transaction_session_timeout = '15s'");
        if(install)await client.query('SELECT pg_catalog.pg_advisory_xact_lock(168489021,1)');
        let actual=await captureBillingSchema(client),status='ready';
        check(canonical(actual.prerequisite)===prerequisiteText,'webhook_prerequisite_mismatch');
        if(install) {
          const absent=actual.relations.length===0&&actual.functions.length===0&&
            actual.tables.every(t=>[t.columns,t.constraints,t.indexes,t.triggers,t.rules].every(a=>a.length===0));
          if(absent) {
            await client.query(migrationSQL);
            actual=await captureBillingSchema(client);status='installed';
          }else status='existing';
        }
        check(canonical(actual)===expectedText,'billing_schema_mismatch');
        const privileges=await rows(client,`SELECT
          pg_catalog.has_schema_privilege(current_user,'public','USAGE') AS schema_usage,
          pg_catalog.has_table_privilege(current_user,'public.webhook_events','SELECT') AS marker_select,
          pg_catalog.has_table_privilege(current_user,'public.webhook_events','INSERT') AS marker_insert,
          pg_catalog.has_table_privilege(current_user,'public.billing_notification_intents','SELECT') AS intent_select,
          pg_catalog.has_table_privilege(current_user,'public.billing_notification_intents','INSERT') AS intent_insert,
          pg_catalog.has_table_privilege(current_user,'public.billing_notification_deliveries','SELECT') AS delivery_select,
          pg_catalog.has_table_privilege(current_user,'public.billing_notification_deliveries','INSERT') AS delivery_insert,
          pg_catalog.has_table_privilege(current_user,'public.billing_notification_deliveries','UPDATE') AS delivery_update`);
        check(privileges.length===1&&Object.values(privileges[0]).every(value=>value===true),'billing_permissions_missing');
        await client.query('COMMIT');began=false;
        return Object.freeze({ok:true,status});
      } catch(error) {
        if(began)try{await client.query('ROLLBACK');}catch(rollbackError){discard=rollbackError;}
        throw error;
      } finally {client.release(discard);}
    }
    return Object.freeze({verify:()=>transaction(false),install:()=>transaction(true)});
  }
  return {captureBillingSchema,createBillingSchemaManager};
}

async function qualifySchema() {
  const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
  const {createRequire}=require('node:module'),{pathToFileURL}=require('node:url');
  const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  const directory=fs.realpathSync(cfg.directory),socket=fs.realpathSync(cfg.socket);
  assert.match(cfg.socket,/^\/tmp\/mmhb-g38-[A-Za-z0-9]+$/);
  assert.equal(socket,cfg.socket);
  const socketStat=fs.lstatSync(socket);
  assert.ok(socketStat.isDirectory());assert.equal(socketStat.mode&0o077,0);assert.equal(socketStat.uid,process.getuid());
  assert.match(cfg.password,/^[a-f0-9]{64}$/);
  const req=createRequire(path.join(cfg.root,'package.json')),{Pool}=req('pg');
  const {captureBillingSchema,createBillingSchemaManager}=await import(pathToFileURL(cfg.moduleFile).href);
  const migrationSQL=fs.readFileSync(cfg.migrationSQLFile,'utf8');assert.ok(migrationSQL.length>100&&migrationSQL.length<100000);
  const connection={host:socket,port:6543,user:'mmhb_owner',password:cfg.password,ssl:false,
    connectionTimeoutMillis:4000,idleTimeoutMillis:1000,statement_timeout:8000,query_timeout:10000};
  const owner=new Pool({...connection,database:'postgres',max:2});
  let golden,subject,restricted,expected;
  const checks=[],controls=[];
  const prerequisite=`CREATE TABLE public.webhook_events (
    id text PRIMARY KEY,event_type varchar(100) NOT NULL,
    status varchar(50) NOT NULL DEFAULT 'processed',processed_at timestamptz NOT NULL DEFAULT now()
  )`;
  const uid='11111111-1111-4111-8111-111111111111';
  const manager=()=>createBillingSchemaManager({pool:subject,expected,migrationSQL});
  async function ready(instance){const result=await instance.verify();assert.equal(result.ok,true);assert.equal(result.status,'ready');return result;}
  async function installed(instance){const result=await instance.install();assert.equal(result.ok,true);assert.ok(['installed','existing'].includes(result.status));return result;}
  async function rejected(fn){let error;try{await fn();}catch(e){error=e;}assert.ok(error,'Expected fail-closed rejection');assert.equal(typeof error.code,'string');return error;}
  async function exists(name){return (await subject.query('SELECT to_regclass($1) IS NOT NULL AS found',['public.'+name])).rows[0].found;}
  async function reset(){
    await subject.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT USAGE ON SCHEMA public TO PUBLIC');
    await subject.query(prerequisite);
  }
  async function catalog(){
    return (await subject.query(`SELECT c.relname,c.relkind,c.relpersistence
      FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
      WHERE n.nspname='public' ORDER BY c.relname`)).rows;
  }
  async function test(name,fn,control=false){
    try{await reset();await fn();(control?controls:checks).push({name,pass:true});}
    catch(error){(control?controls:checks).push({name,pass:false,error:String(error.message).slice(0,700)});}
  }
  async function seed(){
    const body='{"to":"fixture@example.invalid"}',sha=crypto.createHash('sha256').update(body).digest('hex');
    await subject.query("INSERT INTO public.webhook_events(id,event_type) VALUES('evt_schema_fixture','checkout.session.completed')");
    await subject.query(`INSERT INTO public.billing_notification_intents(event_id,kind,user_id,payload)
      VALUES('evt_schema_fixture','upgrade',$1,$2)`,[uid,{version:1,recipient:'fixture@example.invalid',name:'Synthetic Fixture',periodEnd:null}]);
    await subject.query(`INSERT INTO public.billing_notification_deliveries
      (event_id,kind,user_id,provider_scope,body_text,request_sha256,idempotency_key)
      VALUES('evt_schema_fixture','upgrade',$1,$2,$3,$4,$5)`,[uid,'a'.repeat(64),body,sha,'mmhb/billing/v1/'+'c'.repeat(64)]);
  }
  async function saved(){return (await subject.query(`SELECT jsonb_build_object(
    'events',(SELECT jsonb_agg(to_jsonb(e) ORDER BY e.id) FROM public.webhook_events e),
    'intents',(SELECT jsonb_agg(to_jsonb(i) ORDER BY i.event_id,i.kind,i.user_id) FROM public.billing_notification_intents i),
    'deliveries',(SELECT jsonb_agg(to_jsonb(d) ORDER BY d.event_id,d.kind,d.user_id) FROM public.billing_notification_deliveries d)
    ) AS rows`)).rows[0].rows;}
  async function dropConstraint(type,table){
    const rows=(await subject.query(`SELECT conname FROM pg_constraint
      WHERE conrelid=$1::regclass AND contype=$2 ORDER BY conname`,['public.'+table,type])).rows;
    assert.equal(rows.length,1);
    const name='"'+rows[0].conname.replaceAll('"','""')+'"';
    await subject.query('ALTER TABLE public.'+table+' DROP CONSTRAINT '+name);
  }
  try{
    const identity=(await owner.query(`SELECT current_setting('data_directory') AS data,
      current_setting('listen_addresses') AS listen,inet_server_addr() AS address,current_user AS username,
      current_setting('server_version_num') AS version,(SELECT rolsuper FROM pg_roles WHERE rolname=current_user) AS superuser`)).rows[0];
    assert.ok(fs.realpathSync(identity.data).startsWith(directory+path.sep));
    assert.equal(identity.listen,'');assert.equal(identity.address,null);assert.equal(identity.username,'mmhb_owner');
    assert.equal(identity.superuser,true);assert.match(identity.version,/^16\d{4}$/);
    await owner.query('CREATE DATABASE mmhb_schema_golden');await owner.query('CREATE DATABASE mmhb_schema_subject');
    golden=new Pool({...connection,database:'mmhb_schema_golden',max:2});
    subject=new Pool({...connection,database:'mmhb_schema_subject',max:8});
    await golden.query(prerequisite);await golden.query(migrationSQL);
    const client=await golden.connect();
    try{
      await client.query('BEGIN');await client.query('SET LOCAL search_path TO pg_catalog');
      expected=await captureBillingSchema(client);await client.query('COMMIT');
    }catch(error){await client.query('ROLLBACK').catch(()=>{});throw error;}finally{client.release();}
    assert.equal(expected.schemaVersion,1);assert.equal(expected.pgMajor,16);
    fs.writeFileSync(path.join(directory,'billing-schema-contract.json'),JSON.stringify(expected,null,2)+'\n',{flag:'wx',mode:0o600});
    await owner.query(`CREATE ROLE mmhb_schema_readonly LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD '${cfg.password}'`);
    restricted=new Pool({...connection,database:'mmhb_schema_subject',user:'mmhb_schema_readonly',max:1});
    await test('if_not_exists_accepts_incompatible_table',async()=>{
      await subject.query('CREATE TABLE public.billing_notification_intents(event_id text)');
      await subject.query('CREATE TABLE IF NOT EXISTS public.billing_notification_intents(event_id text NOT NULL,kind text NOT NULL)');
      const columns=(await subject.query("SELECT attname FROM pg_attribute WHERE attrelid='public.billing_notification_intents'::regclass AND attnum>0 AND NOT attisdropped ORDER BY attnum")).rows.map(x=>x.attname);
      assert.deepEqual(columns,['event_id']);await rejected(()=>manager().verify());
    },true);
    await test('readonly_missing_schema_rejects_without_installing',async()=>{
      const before=await catalog();await rejected(()=>manager().verify());assert.deepEqual(await catalog(),before);
      assert.equal(await exists('billing_notification_intents'),false);assert.equal(await exists('billing_notification_deliveries'),false);
    });
    await test('install_then_repeat_preserves_all_seeded_rows',async()=>{
      const instance=manager();assert.equal((await installed(instance)).status,'installed');await ready(instance);await seed();
      const before=await saved();assert.equal((await installed(instance)).status,'existing');await ready(instance);assert.deepEqual(await saved(),before);
    });
    await test('concurrent_installers_converge_without_partial_schema',async()=>{
      const settled=await Promise.allSettled(Array.from({length:4},()=>installed(manager())));
      assert.ok(settled.every(x=>x.status==='fulfilled'),'A concurrent installer rejected');
      const results=settled.map(x=>x.value);
      assert.equal(results.filter(x=>x.status==='installed').length,1);await ready(manager());
      await seed();assert.equal((await subject.query('SELECT count(*)::int AS n FROM public.billing_notification_deliveries')).rows[0].n,1);
    });
    await test('incompatible_existing_function_is_preserved_and_install_rejects',async()=>{
      await subject.query('CREATE FUNCTION public.guard_billing_delivery_immutable() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RETURN NEW; END $$');
      const definition=(await subject.query("SELECT pg_get_functiondef('public.guard_billing_delivery_immutable()'::regprocedure) AS d")).rows[0].d;
      await rejected(()=>manager().install());assert.equal(await exists('billing_notification_intents'),false);assert.equal(await exists('billing_notification_deliveries'),false);
      assert.equal((await subject.query("SELECT pg_get_functiondef('public.guard_billing_delivery_immutable()'::regprocedure) AS d")).rows[0].d,definition);
    });
    await test('late_server_ddl_failure_rolls_back_and_retry_succeeds',async()=>{
      await subject.query(`CREATE FUNCTION public.mmhh_schema_fail_ddl() RETURNS event_trigger LANGUAGE plpgsql AS $$
        BEGIN IF TG_TAG='CREATE TRIGGER' THEN RAISE EXCEPTION 'synthetic late DDL failure' USING ERRCODE='P0001'; END IF; END $$;
        CREATE EVENT TRIGGER mmhb_schema_late_failure ON ddl_command_start EXECUTE FUNCTION public.mmhh_schema_fail_ddl()`);
      const instance=manager();await rejected(()=>instance.install());
      assert.equal(await exists('billing_notification_intents'),false);assert.equal(await exists('billing_notification_deliveries'),false);
      assert.equal((await subject.query("SELECT to_regprocedure('public.guard_billing_delivery_immutable()') IS NULL AS missing")).rows[0].missing,true);
      await subject.query('DROP EVENT TRIGGER mmhb_schema_late_failure; DROP FUNCTION public.mmhh_schema_fail_ddl()');
      assert.equal((await installed(instance)).status,'installed');await ready(instance);
    });
    await test('wrong_due_index_predicate_is_not_ready',async()=>{
      await installed(manager());await subject.query(`DROP INDEX public.billing_delivery_due;
        CREATE INDEX billing_delivery_due ON public.billing_notification_deliveries(provider_scope,next_attempt_at) WHERE status='pending'`);
      await rejected(()=>manager().verify());
    });
    await test('disabled_trigger_invalidates_cached_success_and_can_recover',async()=>{
      const instance=manager();await installed(instance);await ready(instance);
      await subject.query('ALTER TABLE public.billing_notification_deliveries DISABLE TRIGGER billing_delivery_immutable');
      await rejected(()=>instance.verify());
      await subject.query('ALTER TABLE public.billing_notification_deliveries ENABLE TRIGGER billing_delivery_immutable');await ready(instance);
    });
    await test('changed_foreign_key_delete_action_is_not_ready',async()=>{
      await installed(manager());await dropConstraint('f','billing_notification_deliveries');
      await subject.query(`ALTER TABLE public.billing_notification_deliveries ADD FOREIGN KEY(event_id,kind,user_id)
        REFERENCES public.billing_notification_intents(event_id,kind,user_id) ON DELETE CASCADE`);
      await rejected(()=>manager().verify());
    });
    await test('missing_check_constraint_is_not_ready',async()=>{
      await installed(manager());const names=(await subject.query(`SELECT conname FROM pg_constraint
        WHERE conrelid='public.billing_notification_intents'::regclass AND contype='c' AND pg_get_constraintdef(oid) LIKE '%jsonb_typeof%'`)).rows;
      assert.equal(names.length,1);await subject.query('ALTER TABLE public.billing_notification_intents DROP CONSTRAINT "'+names[0].conname.replaceAll('"','""')+'"');
      await rejected(()=>manager().verify());
    });
    await test('changed_default_is_not_ready',async()=>{
      await installed(manager());await subject.query('ALTER TABLE public.billing_notification_deliveries ALTER COLUMN next_attempt_at SET DEFAULT now()');
      await rejected(()=>manager().verify());
    });
    await test('changed_column_type_is_not_ready',async()=>{
      await installed(manager());await subject.query('ALTER TABLE public.billing_notification_intents ALTER COLUMN created_at TYPE timestamp WITHOUT TIME ZONE');
      await rejected(()=>manager().verify());
    });
    await test('altered_immutable_function_body_is_not_ready',async()=>{
      await installed(manager());await subject.query('CREATE OR REPLACE FUNCTION public.guard_billing_delivery_immutable() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RETURN NEW; END $$');
      await rejected(()=>manager().verify());
    });
    await test('incompatible_existing_table_is_not_replaced',async()=>{
      await subject.query("CREATE TABLE public.billing_notification_intents(event_id text); INSERT INTO public.billing_notification_intents VALUES('keep_this_synthetic_row')");
      await rejected(()=>manager().install());assert.deepEqual((await subject.query('SELECT * FROM public.billing_notification_intents')).rows,[{event_id:'keep_this_synthetic_row'}]);
      assert.equal(await exists('billing_notification_deliveries'),false);
    });
    await test('missing_effective_write_privileges_is_not_ready',async()=>{
      await installed(manager());await subject.query(`GRANT SELECT ON public.webhook_events,public.billing_notification_intents,public.billing_notification_deliveries TO mmhb_schema_readonly`);
      const instance=createBillingSchemaManager({pool:restricted,expected,migrationSQL});
      await rejected(()=>instance.verify());
      await subject.query('GRANT INSERT ON public.webhook_events,public.billing_notification_intents,public.billing_notification_deliveries TO mmhb_schema_readonly; GRANT UPDATE ON public.billing_notification_deliveries TO mmhb_schema_readonly');
      await ready(instance);
    });
  }catch(error){checks.push({name:'harness_setup_or_global',pass:false,error:String(error.message).slice(0,700)});}
  finally{await Promise.allSettled([restricted?.end(),subject?.end(),golden?.end(),owner.end()]);}
  const report={scope:'DISPOSABLE_POSTGRES_SCHEMA_QUALIFICATION',tests:checks.length,pass:checks.filter(x=>x.pass).length,
    failed:checks.filter(x=>!x.pass),controls,checks,liveDatabaseConnections:0,sourceWrites:0,applicationIntegrated:false,releaseQualified:false};
  fs.writeFileSync(cfg.result,JSON.stringify(report,null,2)+'\n',{flag:'wx',mode:0o600});
  console.log('SCHEMA_NEGATIVE_CONTROL='+JSON.stringify(controls));
  console.log('SCHEMA_RESULT='+JSON.stringify({tests:report.tests,pass:report.pass,failed:report.failed}));
  if(report.failed.length||controls.some(x=>!x.pass)||controls.length!==1)process.exitCode=2;
}

try{
  console.log('COMMAND_ID='+ID);
  check(JSON.parse(bytes(path.join(ROOT,'package.json'))).name==='mymentalhealthbuddy','Project identity mismatch');
  check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Replit identity mismatch');
  check(git('rev-parse','--show-toplevel').trim()===ROOT,'Repository root mismatch');
  check(process.getuid()!==0,'Run as the regular Replit user');
  before=snapshot();console.log('CURRENT='+JSON.stringify({head:before.head,branch:before.branch}));
  check(before.branch==='integration'&&before.tracked==='','Unexpected branch or tracked changes; preserve work');
  privateDirectory(PREVIOUS);
  const prior=JSON.parse(bytes(path.join(PREVIOUS,'summary.json')));
  check(prior.command==='MMHB-RESTORE-BILLING-CANDIDATES-20260925-37'&&
    prior.status==='EXACT_BILLING_CANDIDATES_RESTORED_IN_PRIVATE_STAGING'&&prior.sourcePreserved===true&&
    prior.candidateCount===8&&prior.moduleSyntaxPass===6,'G37 recovery summary differs');
  const scope=['server/db/ensureSchema.mjs','server/db/schema.canonical.sql',
    'scripts/generate-canonical-schema.mjs','database/schema/index.ts','shared/schema.mjs'];
  for(const rel of scope)check(hash(bytes(path.join(ROOT,rel)))===pins[rel],'Reviewed schema source changed: '+rel);
  console.log('G37_SCHEMA_OWNERSHIP_PINS=PASS');
  const artifacts=[
    ['billingEventTransaction.mjs','f8a9fce70124b55d5197cdfed53be393cbd098b80cafb607b352c4a101f9db60'],
    ['billing-notification-intents.sql','0abfb97fdb56428ceb0d7f02ecb951216c2eb61f356c8412b886f1fe1a27feea'],
    ['billingDelivery.mjs','39cee16ceae83013e500f10cbc3ccc9ccbfca8bd9f9ceafbdb5d2065c3d68f25'],
    ['billing-notification-deliveries.sql','49f51f3bcd963df35fa276b58d9e42ef04091976934b9a28a1bd119602551d9f'],
    ['billingEmailTransport.mjs','c4757e3c030600af8bf4bb6d7946fc85195541b38e5c0534b8ba5608ec1892d4'],
    ['billingNotificationTemplate.mjs','cdb91217cea6ea6fb1bee2633a0f9b396d3d9a452acafd37a6d1491a37bd8e34'],
    ['billingNotificationWorker.mjs','daac9fb0f94fa026a5567d22c3de74041cc1e3f793f44ce4edb0fe3476c2a940'],
    ['webhook.after.mjs','071a2dec33cb5b426e2616d0b017d21ea37f05849079bb091f095bb1712e6e08']
  ].map(([name,pin])=>{const b=bytes(path.join(PREVIOUS,'candidate',name));
    check(hash(b)===pin,'Restored candidate changed: '+name);return {name,sha256:pin,bytes:b};});
  check(JSON.parse(bytes(path.join(ROOT,'node_modules/pg/package.json'))).version==='8.23.0','Installed pg version differs');
  check(process.versions.node.split('.')[0]==='24','Expected Node 24');
  const known='/nix/store/bgwr5i8jf8jpg75rr53rz3fqv5k8yrwp-postgresql-16.10/bin';
  if(fs.existsSync(path.join(known,'postgres')))PG=known;
  else {
    const r=spawnSync('pg_config',['--bindir'],{env,encoding:'utf8',timeout:10000,maxBuffer:1048576});
    check(!r.error&&r.status===0,'PostgreSQL binaries unavailable; no installation attempted');PG=r.stdout.trim();
  }
  check(path.isAbsolute(PG),'Invalid PostgreSQL binary directory');
  for(const name of ['initdb','postgres','pg_ctl'])fs.accessSync(path.join(PG,name),fs.constants.X_OK);
  const pgVersion=spawnSync(path.join(PG,'postgres'),['--version'],{env,encoding:'utf8',timeout:10000});
  check(!pgVersion.error&&pgVersion.status===0&&/PostgreSQL\) 16\./.test(pgVersion.stdout),'Expected PostgreSQL 16');
  console.log('DEPENDENCIES='+JSON.stringify({node:process.version,pg:'8.23.0',postgres:pgVersion.stdout.trim()}));
  const parent=path.join(path.resolve(ROOT,git('rev-parse','--absolute-git-dir').trim()),'mmhb-review-evidence');
  privateDirectory(parent);
  const space=fs.statfsSync(parent);check(space.bavail*space.bsize>=536870912,'Need 512 MiB free for disposable database');
  directory=fs.mkdtempSync(path.join(parent,'billing-schema-'));
  console.log('EVIDENCE_DIRECTORY='+directory);put('state.before.json',JSON.stringify(before,null,2));
  for(const a of artifacts)put('candidate/'+a.name,a.bytes);
  put('restored-manifest.json',JSON.stringify(artifacts.map(({name,sha256})=>({name,sha256})),null,2));
  for(const rel of scope)put('baseline/'+rel,bytes(path.join(ROOT,rel)));
  const migrationSQL=artifacts.find(a=>a.name==='billing-notification-intents.sql').bytes.toString('utf8')+'\n'+
    artifacts.find(a=>a.name==='billing-notification-deliveries.sql').bytes.toString('utf8');
  const migrationSQLFile=put('candidate/billing-schema-v1.sql',migrationSQL);
  const moduleFile=put('candidate/billingSchema.mjs',
    'export const {captureBillingSchema,createBillingSchemaManager}=('+billingSchemaFactory.toString()+')();\n');
  const harness=put('qualify.cjs','('+qualifySchema.toString()+')().catch(e=>{console.error(e.message);process.exitCode=2;});\n');
  const candidateManifest=[moduleFile,migrationSQLFile,harness].map(file=>({file:path.relative(directory,file),sha256:hash(bytes(file))}));
  put('candidate-manifest.json',JSON.stringify(candidateManifest,null,2));
  console.log('SCHEMA_MODULE_SHA256='+hash(bytes(moduleFile)));
  run('SCHEMA_SYNTAX',process.execPath,['--check',moduleFile]);
  run('HARNESS_SYNTAX',process.execPath,['--check',harness]);
  data=path.join(directory,'data');socket=fs.mkdtempSync('/tmp/mmhb-g38-');privateDirectory(socket);
  const password=crypto.randomBytes(32).toString('hex'),pwfile=put('fixture-password',password+'\n');
  run('INITDB',path.join(PG,'initdb'),['-D',data,'-U','mmhb_owner','--auth-local=scram-sha-256',
    '--auth-host=reject','--pwfile='+pwfile,'--encoding=UTF8','--locale=C','--no-instructions']);
  fs.appendFileSync(path.join(data,'postgresql.conf'),`\nlisten_addresses = ''\nunix_socket_directories = '${socket}'\nunix_socket_permissions = 0700\nport = 6543\nmax_connections = 20\nshared_buffers = '16MB'\ntimezone = 'UTC'\nlog_statement = 'none'\n`);
  stopped='PENDING';
  run('PG_START',path.join(PG,'pg_ctl'),['-D',data,'-l',path.join(directory,'postgres.log'),'-w','-t','20','start'],30000);
  started=true;console.log('DATABASE_SCOPE=NEW_PRIVATE_UNIX_SOCKET_CLUSTER_WITH_SYNTHETIC_DATA');
  const result=path.join(directory,'result.json');
  const config=put('config.json',JSON.stringify({root:ROOT,directory,data,socket,password,result,migrationSQLFile,moduleFile}));
  const execution=run('SCHEMA_POSTGRES_TESTS',process.execPath,[harness,config],120000,[0,1,2]);
  report=JSON.parse(bytes(result));
  console.log('NEGATIVE_CONTROL='+JSON.stringify(report.controls));
  console.log('SCHEMA_RESULT='+JSON.stringify({tests:report.tests,pass:report.pass,failed:report.checks?.filter(x=>!x.pass)}));
  check(execution.status===0&&report.controls?.length===1&&report.controls.every(x=>x.pass===true)&&
    report.tests===14&&report.pass===report.tests&&report.checks?.length===report.tests&&report.checks.every(x=>x.pass===true),
    'Schema qualification failed');
  const contract=bytes(path.join(directory,'billing-schema-contract.json'));
  console.log('SCHEMA_CONTRACT_SHA256='+hash(contract));
  put('qualification-manifest.json',JSON.stringify([...candidateManifest,
    {file:'billing-schema-contract.json',sha256:hash(contract)}],null,2));
  status='BILLING_SCHEMA_INSTALL_AND_READINESS_QUALIFIED_IN_ISOLATION';
}catch(e){console.log('REASON='+JSON.stringify(e.message));process.exitCode=2;}
finally{
  if(data&&(started||fs.existsSync(path.join(data,'postmaster.pid')))){
    try{
      run('PG_STOP',path.join(PG,'pg_ctl'),['-D',data,'-m','fast','-w','-t','20','stop'],30000,[0],true);
      run('PG_STOP_VERIFY',path.join(PG,'pg_ctl'),['-D',data,'status'],10000,[3],true);stopped='PASS';
    }catch(e){stopped='FAILED';status='STOPPED';process.exitCode=2;console.log('CLEANUP_ERROR='+JSON.stringify(e.message));}
  } else if(stopped==='PENDING')stopped='NO_PID_AFTER_FAILED_START';
  if(socket&&stopped==='PASS'){try{fs.rmdirSync(socket);}catch(e){console.log('SOCKET_CLEANUP='+JSON.stringify(e.code));}}
  if(before){try{
    check(JSON.stringify(snapshot())===JSON.stringify(before),'Checkout changed during qualification');
    for(const file of inputs.keys())bytes(file);
    if(directory)put('state.after.json',JSON.stringify(snapshot(),null,2));
    preserved=true;console.log('OBSERVED_SOURCE_AND_INPUT_PRESERVATION=PASS');
  }catch(e){status='STOPPED';process.exitCode=2;console.log('PRESERVATION_ERROR='+JSON.stringify(e.message));}}
  if(interrupted||!preserved||stopped!=='PASS'){status='STOPPED';process.exitCode=2;}
  if(directory){try{
    put('summary.json',JSON.stringify({command:ID,status,head:before?.head,sourcePreserved:preserved,
      tests:report?.tests,pass:report?.pass,disposableDatabaseStopped:stopped,
      sourceWrites:0,liveDatabaseConnections:0,applicationIntegrated:false,releaseQualified:false},null,2));
  }catch(e){status='STOPPED';process.exitCode=2;console.log('REPORT_WRITE_ERROR='+JSON.stringify(e.message));}}
  console.log('STATUS='+status+'\nDISPOSABLE_DATABASE_STOPPED='+stopped);
  console.log('SOURCE_WRITES_BY_COMMAND=0\nLIVE_DATABASE_CONNECTIONS=0\nLIVE_DATABASE_MIGRATIONS=0\nREAL_EMAILS_SENT=0');
  console.log('APPLICATION_INTEGRATION=PENDING\nWORKER_ACTIVATION=NOT_RUN');
  console.log('FULL_APP_TESTS=NOT_RUN:ISOLATED_SCHEMA_ONLY\nCOMMIT_PUSH_DEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false');
  if(directory)console.log('EVIDENCE_DIRECTORY='+directory);
  console.log('NEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END='+ID);
}

MMHB38_NODE
)
