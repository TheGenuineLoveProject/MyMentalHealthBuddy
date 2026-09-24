(
set -eu
umask 077
cd /home/runner/workspace
node --input-type=commonjs <<'MMHB24_NODE'
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {spawnSync}=require('node:child_process');
const ROOT='/home/runner/workspace';
const PREVIOUS='/home/runner/mmhb-webhook-transaction.9cBDdT';
const PG='/nix/store/bgwr5i8jf8jpg75rr53rz3fqv5k8yrwp-postgresql-16.10/bin';
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const check=(ok,message)=>{if(!ok)throw Error(message);};
const env={PATH:process.env.PATH||'/usr/bin:/bin',LANG:'C.UTF-8',TZ:'UTC',CI:'true',GIT_OPTIONAL_LOCKS:'0',GIT_TERMINAL_PROMPT:'0'};
let directory,data,before,started=false,stopped='NOT_STARTED',status='STOPPED',report,interrupted=false;
process.on('SIGINT',()=>{interrupted=true;});process.on('SIGTERM',()=>{interrupted=true;});
function git(...args){
  const r=spawnSync('git',['--no-pager','--no-optional-locks','-c','core.fsmonitor=false',
    '-c','core.quotePath=true',...args],{cwd:ROOT,env,encoding:'utf8',timeout:30000,maxBuffer:33554432});
  check(!r.error&&r.status===0,'Git inspection failed: '+args[0]);return r.stdout;
}
function bytes(p){check(fs.lstatSync(p).isFile(),'Expected regular file: '+p);return fs.readFileSync(p);}
function state(){return JSON.stringify({head:git('rev-parse','HEAD').trim(),branch:git('branch','--show-current').trim(),
  index:hash(bytes(path.resolve(ROOT,git('rev-parse','--git-path','index').trim()))),
  status:git('status','--porcelain=v1','--untracked-files=no','--ignore-submodules=none'),
  diff:hash(git('diff','--binary','--no-ext-diff','--no-textconv','HEAD')),
  untrackedNames:hash(git('ls-files','--others','--exclude-standard','-z')),
  package:hash(bytes(path.join(ROOT,'package.json'))),lock:hash(bytes(path.join(ROOT,'package-lock.json')))});}
function put(name,value){const p=path.join(directory,name);fs.writeFileSync(p,value,{flag:'wx',mode:0o600});return p;}
function run(label,command,args,timeout=45000,ok=[0]){
  console.log(label+'=RUNNING');
  const r=spawnSync(command,args,{cwd:directory,env,encoding:'utf8',timeout,killSignal:'SIGKILL',maxBuffer:4194304});
  put(label+'.log',(r.stdout||'')+(r.stderr||''));
  if(r.error||!ok.includes(r.status)){
    console.log('DIAGNOSTICS='+JSON.stringify(((r.stderr||'')+(r.error?.message||'')).slice(-2000)));
    throw Error(label+' failed; log retained');
  }
  return r;
}
function deliveryFactory(crypto) {
  const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
  const check=(ok,message)=>{if(!ok)throw Error(message);};
  const columns='event_id=$1 AND kind=$2 AND user_id=$3::uuid';
  function identity(value) {
    check(value&&typeof value.eventId==='string'&&value.eventId.trim()===value.eventId&&
      value.eventId.length>0&&value.eventId.length<=255&&!/[\x00-\x20\x7f]/.test(value.eventId)&&
      ['upgrade','cancellation'].includes(value.kind)&&typeof value.userId==='string'&&
      /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value.userId),'Invalid delivery identity');
    return {eventId:value.eventId,kind:value.kind,userId:value.userId.toLowerCase()};
  }
  const tuple=value=>[value.eventId,value.kind,value.userId];
  const scope=value=>{check(typeof value==='string'&&/^[a-f0-9]{64}$/.test(value),'Invalid provider scope');return value;};
  const key=value=>'mmhb/billing/v1/'+hash(JSON.stringify(tuple(value)));
  function canonicalBody(value) {
    check(value&&[Object.prototype,null].includes(Object.getPrototypeOf(value)),'Invalid frozen email body');
    const allowed=['from','to','subject','html','text'];
    check(Object.keys(value).every(k=>allowed.includes(k)),'Unsupported frozen email field');
    const recipient=Array.isArray(value.to)?(value.to.length===1?value.to[0]:null):value.to;
    for(const [v,max]of [[value.from,320],[recipient,255],[value.subject,998]]) {
      check(typeof v==='string'&&v.trim().length>0&&v.length<=max&&!/[\r\n\x00]/.test(v),'Invalid frozen email headers');
    }
    check(['html','text'].some(k=>typeof value[k]==='string'&&value[k].length>0),'Missing frozen email content');
    const output={from:value.from,to:Array.isArray(value.to)?[recipient]:recipient,subject:value.subject};
    for(const k of ['html','text'])if(Object.hasOwn(value,k)) {
      check(typeof value[k]==='string'&&!value[k].includes('\0'),'Invalid frozen email content');output[k]=value[k];
    }
    const text=JSON.stringify(output);check(Buffer.byteLength(text)<=262144,'Frozen email is too large');
    return {text,recipient,body:output};
  }
  function validIntent(value,recipient) {
    check(value&&value.version===1&&typeof value.recipient==='string'&&value.recipient===recipient&&
      typeof value.name==='string'&&value.name.length<=1000&&
      (value.periodEnd===null||(Number.isSafeInteger(value.periodEnd)&&value.periodEnd>=0)), 'Notification intent differs');
  }
  function frozen(row) {
    const id=identity({eventId:row.event_id,kind:row.kind,userId:row.user_id});scope(row.provider_scope);
    const body=canonicalBody(JSON.parse(row.body_text));validIntent(row.intent_payload,body.recipient);
    check(body.text===row.body_text&&hash(body.text)===row.request_sha256&&key(id)===row.idempotency_key,'Frozen delivery integrity failed');
    return {id,body};
  }
  async function transaction(pool,work) {
    const client=await pool.connect();
    try {await client.query('BEGIN');const value=await work(client);await client.query('COMMIT');return value;}
    catch(error){try{await client.query('ROLLBACK');}catch{}throw error;}
    finally{client.release();}
  }
  async function prepareDelivery(pool,value,body,providerScope) {
    const id=identity(value),canonical=canonicalBody(body),provider=scope(providerScope);
    const requestSha256=hash(canonical.text),idempotencyKey=key(id);
    return transaction(pool,async client=>{
      const intent=await client.query('SELECT payload FROM public.billing_notification_intents WHERE '+columns,tuple(id));
      check(intent.rowCount===1,'Notification intent is missing');validIntent(intent.rows[0].payload,canonical.recipient);
      const saved=await client.query(`INSERT INTO public.billing_notification_deliveries
        (event_id,kind,user_id,provider_scope,body_text,request_sha256,idempotency_key)
        VALUES($1,$2,$3::uuid,$4,$5,$6,$7) ON CONFLICT(event_id,kind,user_id) DO NOTHING RETURNING status`,
        [...tuple(id),provider,canonical.text,requestSha256,idempotencyKey]);
      let status=saved.rows[0]?.status;
      if(!saved.rowCount) {
        const existing=(await client.query('SELECT * FROM public.billing_notification_deliveries WHERE '+columns,tuple(id))).rows[0];
        check(existing&&existing.body_text===canonical.text&&existing.request_sha256===requestSha256&&
          existing.idempotency_key===idempotencyKey&&existing.provider_scope===provider,'Prepared delivery is immutable');status=existing.status;
      }
      return {created:saved.rowCount===1,status,idempotencyKey,requestSha256,providerScope:provider};
    });
  }
  async function claimDelivery(pool,providerScope) {
    const provider=scope(providerScope);
    return transaction(pool,async client=>{
      const selected=await client.query(`SELECT d.*,i.payload AS intent_payload,
        first_attempt_at IS NOT NULL AND first_attempt_at<=clock_timestamp()-interval '23 hours' AS expired
        FROM public.billing_notification_deliveries d JOIN public.billing_notification_intents i USING(event_id,kind,user_id)
        WHERE provider_scope=$1 AND ((status IN ('pending','retry') AND next_attempt_at<=clock_timestamp())
          OR (status='sending' AND lease_until<=clock_timestamp()))
        ORDER BY next_attempt_at,event_id,kind,user_id LIMIT 1 FOR UPDATE OF d SKIP LOCKED`,[provider]);
      if(!selected.rowCount)return null;
      const row=selected.rows[0],id=identity({eventId:row.event_id,kind:row.kind,userId:row.user_id});
      let reason=row.expired?'retry_window_expired':row.attempts>=8?'attempt_limit':null,verified;
      if(!reason)try{verified=frozen(row);}catch{reason='invalid_frozen_request';}
      if(reason) {
        await client.query(`UPDATE public.billing_notification_deliveries SET status='manual',lease_until=NULL,lease_token=NULL,
          last_error_code=$4,updated_at=clock_timestamp() WHERE `+columns,[...tuple(id),reason]);
        return {status:'manual',reason};
      }
      const leaseToken=crypto.randomUUID();
      await client.query(`UPDATE public.billing_notification_deliveries SET status='sending',attempts=attempts+1,
        first_attempt_at=COALESCE(first_attempt_at,clock_timestamp()),lease_until=clock_timestamp()+interval '120 seconds',
        lease_token=$4::uuid,updated_at=clock_timestamp() WHERE `+columns,[...tuple(id),leaseToken]);
      return {status:'sending',...id,body:verified.body.body,bodyText:row.body_text,requestSha256:row.request_sha256,
        idempotencyKey:row.idempotency_key,providerScope:provider,leaseToken};
    });
  }
  function failure(error) {
    const name=typeof error?.name==='string'?error.name:'';
    if(['invalid_idempotent_request','daily_quota_exceeded','monthly_quota_exceeded'].includes(name))return {manual:true,code:name};
    if(name==='concurrent_idempotent_requests')return {manual:false,code:name};
    if(name==='delivery_timeout')return {manual:false,code:'delivery_timeout'};
    const status=Number(error?.statusCode??error?.status);
    if(Number.isInteger(status)&&status>=400&&status<500&&![408,409,425,429].includes(status))return {manual:true,code:'provider_rejected'};
    return {manual:false,code:'provider_ambiguous'};
  }
  async function completeDelivery(pool,claim,outcome) {
    const id=identity(claim),provider=scope(claim.providerScope);
    check(typeof claim.leaseToken==='string'&&/^[a-f0-9-]{36}$/i.test(claim.leaseToken),'Invalid delivery lease');
    return transaction(pool,async client=>{
      const selected=await client.query(`SELECT *,lease_until>clock_timestamp() AS active,
        first_attempt_at<=clock_timestamp()-interval '23 hours' AS expired FROM public.billing_notification_deliveries WHERE `+columns+' FOR UPDATE',tuple(id));
      const row=selected.rows[0];
      if(!row||row.status!=='sending'||row.lease_token!==claim.leaseToken||row.provider_scope!==provider||!row.active)return {status:'stale'};
      const accepted=outcome?.error==null&&typeof outcome?.id==='string'&&outcome.id.trim().length>0&&outcome.id.length<=255;
      const rejection=failure(outcome?.error),reason=row.expired?'retry_window_expired':row.attempts>=8?'attempt_limit':rejection.code;
      const status=accepted?'accepted':row.expired||row.attempts>=8||rejection.manual?'manual':'retry';
      const delay=Math.min(3600,15*2**(row.attempts-1));
      await client.query(`UPDATE public.billing_notification_deliveries SET status=$4,lease_until=NULL,lease_token=NULL,
        accepted_message_id=$5,last_error_code=$6,next_attempt_at=clock_timestamp()+($7::double precision*interval '1 second'),
        updated_at=clock_timestamp() WHERE `+columns,[...tuple(id),status,accepted?outcome.id:null,accepted?null:reason,delay]);
      return {status,...(accepted?{id:outcome.id}:{reason})};
    });
  }
  async function dispatchOne(pool,send,providerScope) {
    check(typeof send==='function','Missing delivery transport');
    const claim=await claimDelivery(pool,providerScope);
    if(!claim)return {status:'idle'};
    if(claim.status==='manual')return claim;
    // A fresh fence immediately before transport reduces paused-worker sends.
    const fresh=(await pool.query(`SELECT d.*,i.payload AS intent_payload,
      lease_until>clock_timestamp() AS active,first_attempt_at>clock_timestamp()-interval '23 hours' AS within_window
      FROM public.billing_notification_deliveries d JOIN public.billing_notification_intents i USING(event_id,kind,user_id)
      WHERE d.event_id=$1 AND d.kind=$2 AND d.user_id=$3::uuid`,tuple(claim))).rows[0];
    if(!fresh||fresh.status!=='sending'||fresh.lease_token!==claim.leaseToken||fresh.provider_scope!==claim.providerScope||!fresh.active)return {status:'stale'};
    if(!fresh.within_window)return completeDelivery(pool,claim,{error:{name:'retry_window_expired'}});
    let request;
    try{request=frozen(fresh).body.body;}catch{return completeDelivery(pool,claim,{error:{name:'invalid_idempotent_request'}});}
    if(Array.isArray(request.to))Object.freeze(request.to);Object.freeze(request);
    const controller=new AbortController();let timer;
    const timedOut=new Promise(resolve=>{timer=setTimeout(()=>{controller.abort();resolve({error:{name:'delivery_timeout'}});},10000);});
    // Both promise outcomes are handled even when the timeout wins and transport settles later.
    const operation=Promise.resolve().then(()=>send(request,fresh.idempotency_key,controller.signal))
      .then(value=>value,error=>({error}));
    let outcome;try{outcome=await Promise.race([operation,timedOut]);}finally{clearTimeout(timer);}
    return completeDelivery(pool,claim,outcome);
  }
  return {prepareDelivery,claimDelivery,completeDelivery,dispatchOne};
}
const DELIVERY_DDL=`CREATE TABLE public.billing_notification_deliveries (
  event_id text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('upgrade','cancellation')),
  user_id uuid NOT NULL,
  provider_scope text NOT NULL CHECK (provider_scope ~ '^[a-f0-9]{64}$'),
  body_text text NOT NULL CHECK (octet_length(body_text) BETWEEN 1 AND 262144),
  request_sha256 text NOT NULL CHECK (request_sha256 ~ '^[a-f0-9]{64}$'),
  idempotency_key text NOT NULL UNIQUE CHECK (idempotency_key ~ '^mmhb/billing/v1/[a-f0-9]{64}$'),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sending','retry','accepted','manual')),
  attempts integer NOT NULL DEFAULT 0 CHECK (attempts BETWEEN 0 AND 8),
  first_attempt_at timestamptz,
  lease_until timestamptz,
  lease_token uuid,
  next_attempt_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  accepted_message_id text,
  last_error_code text,
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY (event_id,kind,user_id),
  FOREIGN KEY (event_id,kind,user_id) REFERENCES public.billing_notification_intents(event_id,kind,user_id) ON DELETE RESTRICT,
  CHECK ((status='sending')=(lease_until IS NOT NULL AND lease_token IS NOT NULL)),
  CHECK (status='sending' OR (lease_until IS NULL AND lease_token IS NULL)),
  CHECK ((attempts=0)=(first_attempt_at IS NULL)),
  CHECK (status NOT IN ('sending','retry','accepted') OR attempts>0),
  CHECK (status<>'pending' OR attempts=0),
  CHECK ((status='accepted')=(accepted_message_id IS NOT NULL)),
  CHECK (accepted_message_id IS NULL OR length(btrim(accepted_message_id)) BETWEEN 1 AND 255),
  CHECK (last_error_code IS NULL OR last_error_code ~ '^[a-z0-9_]{1,64}$')
);
CREATE INDEX billing_delivery_due ON public.billing_notification_deliveries(provider_scope,next_attempt_at)
  WHERE status IN ('pending','retry','sending');
CREATE FUNCTION public.guard_billing_delivery_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF ROW(NEW.event_id,NEW.kind,NEW.user_id,NEW.provider_scope,NEW.body_text,NEW.request_sha256,NEW.idempotency_key,NEW.created_at)
     IS DISTINCT FROM ROW(OLD.event_id,OLD.kind,OLD.user_id,OLD.provider_scope,OLD.body_text,OLD.request_sha256,OLD.idempotency_key,OLD.created_at)
     OR (OLD.first_attempt_at IS NOT NULL AND NEW.first_attempt_at IS DISTINCT FROM OLD.first_attempt_at)
     OR NEW.attempts < OLD.attempts
     OR (OLD.status IN ('accepted','manual') AND NEW IS DISTINCT FROM OLD) THEN
    RAISE EXCEPTION 'Frozen billing delivery cannot be altered' USING ERRCODE='23514';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER billing_delivery_immutable BEFORE UPDATE ON public.billing_notification_deliveries
  FOR EACH ROW EXECUTE FUNCTION public.guard_billing_delivery_immutable();
`;
async function qualifyDelivery() {
  const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
  const crypto=require('node:crypto'),{createRequire}=require('node:module'),{pathToFileURL}=require('node:url');
  const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
  assert.ok(cfg.socket.startsWith(cfg.directory+path.sep));assert.match(cfg.password,/^[a-f0-9]{64}$/);
  const req=createRequire(path.join(cfg.root,'package.json')),{Pool}=req('pg'),{Resend}=req('resend');
  const component=await import(pathToFileURL(cfg.component).href);
  const {prepareDelivery,claimDelivery,completeDelivery,dispatchOne}=component;
  const connection={host:cfg.socket,port:6543,password:cfg.password,ssl:false,
    connectionTimeoutMillis:4000,idleTimeoutMillis:1000,statement_timeout:7000};
  const owner=new Pool({...connection,user:'mmhb_owner',database:'postgres',max:2});
  const role='mmhb_delivery_app',table='public.billing_notification_deliveries';
  const uid='11111111-1111-4111-8111-111111111111',scope='a'.repeat(64),recipient='fixture@example.invalid';
  const identity={eventId:'evt_delivery',kind:'upgrade',userId:uid};
  const body={from:'MMHB Fixture <billing@example.invalid>',to:recipient,subject:'Fixture billing update',html:'<p>Fixture</p>',text:'Fixture'};
  const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
  let appPool,active,fixtureFaults=[];const controls=[],checks=[],originalFetch=globalThis.fetch;
  const sdk=new Resend('re_fixture_not_a_key');
  const row=async()=>(await owner.query('SELECT * FROM '+table)).rows[0];
  const due=()=>owner.query('UPDATE '+table+" SET next_attempt_at=clock_timestamp()-interval '1 second',lease_until=CASE WHEN status='sending' THEN clock_timestamp()-interval '1 second' ELSE lease_until END");
  const prepare=(value=body,providerScope=scope,key=identity)=>prepareDelivery(appPool,key,value,providerScope);
  const send=async(value,key,signal)=>{const r=await sdk.emails.send(value,{idempotencyKey:key,signal});return{id:r?.data?.id,error:r?.error};};
  async function reset(){
    await owner.query('DROP TRIGGER IF EXISTS fail_delivery_commit ON '+table+'; GRANT SELECT,INSERT,UPDATE ON '+table+' TO '+role+'; GRANT SELECT ON billing_notification_intents TO '+role+'; TRUNCATE '+table+',billing_notification_intents,webhook_events');
    await owner.query("INSERT INTO webhook_events(id,event_type)VALUES($1,'checkout.session.completed')",[identity.eventId]);
    await owner.query('INSERT INTO billing_notification_intents(event_id,kind,user_id,payload)VALUES($1,$2,$3,$4)',
      [identity.eventId,identity.kind,uid,JSON.stringify({version:1,recipient,name:'Fixture',periodEnd:null})]);
    active={calls:[],accepted:0,cache:new Map(),failure:null,afterAccept:null,baseline:false};
  }
  async function test(name,fn,control=false){
    try{fixtureFaults=[];await reset();await fn();assert.deepEqual(fixtureFaults,[],'Provider fixture assertions failed');(control?controls:checks).push({name,pass:true});}
    catch(e){(control?controls:checks).push({name,pass:false,error:String(e.message).slice(0,700)});}
  }
  globalThis.fetch=async(url,options={})=>{
    try{
    assert.ok(active,'No active provider fixture');
    assert.equal(typeof url==='string'?url:url.url||String(url),'https://api.resend.com/emails');assert.equal(options.method,'POST');
    const headers=new Headers(options.headers),key=headers.get('Idempotency-Key'),raw=String(options.body),payload=JSON.parse(raw);
    const call={key,raw,signalPresent:!!options.signal};active.calls.push(call);
    assert.equal(headers.get('Authorization'),'Bearer re_fixture_not_a_key');assert.deepEqual(payload,body);
    if(!active.baseline){
      const frozen=await row();assert.ok(frozen,'No durable delivery before send');assert.equal(frozen.status,'sending');
      assert.equal(key,frozen.idempotency_key);assert.deepEqual(payload,JSON.parse(frozen.body_text));
      assert.equal(frozen.request_sha256,hash(frozen.body_text));assert.ok(frozen.first_attempt_at);assert.ok(frozen.lease_token);assert.ok(frozen.attempts>=1);
    }
    if(active.failure){const f=active.failure;if(f.network)throw Object.assign(Error('Fixture network outage'),{code:'MMHB_FIXTURE_NETWORK'});
      return new Response(JSON.stringify(f.body),{status:f.status,headers:{'content-type':'application/json'}});}
    let entry=key&&active.cache.get(key);
    if(entry){assert.equal(raw,entry.raw,'Idempotency retry changed HTTP body');}
    else{entry={raw,id:'email_fixture_'+(++active.accepted)};if(key)active.cache.set(key,entry);}
    if(active.afterAccept)await active.afterAccept();
    return new Response(JSON.stringify({id:entry.id}),{status:200,headers:{'content-type':'application/json'}});
    }catch(e){if(e.code!=='MMHB_FIXTURE_NETWORK')fixtureFaults.push(String(e.message).slice(0,400));throw e;}
  };
  try{
    const db=(await owner.query("SELECT current_setting('data_directory') AS data,current_setting('listen_addresses') AS listen,inet_server_addr() AS address,current_user AS owner")).rows[0];
    assert.equal(fs.realpathSync(db.data),fs.realpathSync(cfg.data));assert.equal(db.listen,'');assert.equal(db.address,null);assert.equal(db.owner,'mmhb_owner');
    await owner.query(`CREATE ROLE ${role} LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE PASSWORD '${cfg.password}';
      CREATE TABLE webhook_events(id text PRIMARY KEY,event_type varchar(100) NOT NULL,status varchar(50) NOT NULL DEFAULT 'processed',processed_at timestamptz NOT NULL DEFAULT now());
      GRANT USAGE ON SCHEMA public TO ${role}`);
    await owner.query(fs.readFileSync(cfg.intentsDDL,'utf8'));await owner.query(fs.readFileSync(cfg.deliveryDDL,'utf8'));
    appPool=new Pool({...connection,user:role,database:'postgres',max:4});
    assert.equal((await appPool.query('SELECT rolsuper FROM pg_roles WHERE rolname=current_user')).rows[0].rolsuper,false);
    await owner.query("CREATE FUNCTION reject_delivery_commit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'fixture commit failure' USING ERRCODE='23514'; END $$");
    await test('no_idempotency_repeats_provider_acceptance',async()=>{
      active.baseline=true;const a=await sdk.emails.send(body),b=await sdk.emails.send(body);
      assert.ok(a.data?.id&&b.data?.id);assert.notEqual(a.data.id,b.data.id);assert.equal(active.accepted,2);assert.equal(active.calls.length,2);
    },true);
    assert.ok(controls.length===1&&controls[0].pass,'Baseline control failed');
    await test('durable_freeze_claim_and_acceptance',async()=>{
      await prepare();assert.equal(active.calls.length,0);const initial=await row();assert.equal(initial.status,'pending');assert.equal(initial.first_attempt_at,null);
      assert.equal((await dispatchOne(appPool,send,scope)).status,'accepted');const saved=await row();
      assert.equal(saved.status,'accepted');assert.equal(saved.accepted_message_id,'email_fixture_1');assert.equal(saved.attempts,1);assert.equal(active.accepted,1);
    });
    await test('two_workers_one_provider_acceptance',async()=>{
      await prepare();const results=await Promise.allSettled([dispatchOne(appPool,send,scope),dispatchOne(appPool,send,scope)]);
      assert.ok(results.every(x=>x.status==='fulfilled'));assert.deepEqual(results.map(x=>x.value.status).sort(),['accepted','idle']);assert.equal(active.calls.length,1);assert.equal(active.accepted,1);
    });
    await test('network_retry_preserves_body_key_and_first_attempt',async()=>{
      await prepare();active.failure={network:true};assert.equal((await dispatchOne(appPool,send,scope)).status,'retry');const first=await row();
      await assert.rejects(()=>owner.query('UPDATE '+table+" SET first_attempt_at=clock_timestamp()-interval '1 hour'"));
      await due();active.failure=null;assert.equal((await dispatchOne(appPool,send,scope)).status,'accepted');const last=await row();
      assert.equal(last.first_attempt_at.getTime(),first.first_attempt_at.getTime());assert.equal(last.attempts,2);
      assert.equal(active.calls[0].raw,active.calls[1].raw);assert.equal(active.calls[0].key,active.calls[1].key);assert.equal(active.accepted,1);
      await reset();await prepare();active.afterAccept=async()=>{throw Object.assign(Error('Fixture response lost after provider acceptance'),{code:'MMHB_FIXTURE_NETWORK'});};
      assert.equal((await dispatchOne(appPool,send,scope)).status,'retry');assert.equal(active.accepted,1);assert.equal((await row()).accepted_message_id,null);
      active.afterAccept=null;await due();assert.equal((await dispatchOne(appPool,send,scope)).status,'accepted');
      assert.equal(active.calls.length,2);assert.equal(active.accepted,1);assert.equal(active.calls[0].raw,active.calls[1].raw);assert.equal(active.calls[0].key,active.calls[1].key);
    });
    await test('acceptance_then_completion_failure_reuses_provider_cache',async()=>{
      await prepare();active.afterAccept=()=>owner.query('REVOKE UPDATE ON '+table+' FROM '+role);
      await assert.rejects(()=>dispatchOne(appPool,send,scope));assert.equal(active.accepted,1);assert.equal((await row()).status,'sending');
      active.afterAccept=null;await owner.query('GRANT UPDATE ON '+table+' TO '+role);await due();
      assert.equal((await dispatchOne(appPool,send,scope)).status,'accepted');assert.equal(active.calls.length,2);assert.equal(active.accepted,1);
      assert.equal(active.calls[0].key,active.calls[1].key);assert.equal(active.calls[0].raw,active.calls[1].raw);
    });
    await test('stale_lease_cannot_overwrite_new_claim',async()=>{
      await prepare();const old=await claimDelivery(appPool,scope);await due();const current=await claimDelivery(appPool,scope);
      assert.ok(old&&current);assert.notEqual(old.leaseToken,current.leaseToken);
      assert.equal((await completeDelivery(appPool,old,{id:'email_stale'})).status,'stale');
      assert.equal((await completeDelivery(appPool,current,{id:'email_current'})).status,'accepted');assert.equal((await row()).accepted_message_id,'email_current');assert.equal(active.calls.length,0);
    });
    await test('prepare_replay_and_conflicting_body',async()=>{
      const initial=await prepare(),again=await prepare();assert.equal(initial.created,true);assert.equal(again.created,false);
      assert.equal(initial.idempotencyKey,again.idempotencyKey);await assert.rejects(()=>prepare({...body,subject:'Changed'}));assert.equal(active.calls.length,0);
    });
    await test('retry_window_expiry_requires_manual_review',async()=>{
      await prepare();await claimDelivery(appPool,scope);await owner.query('ALTER TABLE '+table+' DISABLE TRIGGER billing_delivery_immutable; UPDATE '+table+" SET first_attempt_at=clock_timestamp()-interval '23 hours 1 second',lease_until=clock_timestamp()-interval '1 second'; ALTER TABLE "+table+' ENABLE TRIGGER billing_delivery_immutable');
      await dispatchOne(appPool,send,scope);assert.equal((await row()).status,'manual');assert.equal(active.calls.length,0);
    });
    await test('attempt_limit_requires_manual_review',async()=>{
      await prepare();await owner.query('UPDATE '+table+" SET status='retry',attempts=8,first_attempt_at=clock_timestamp()-interval '1 minute'");
      await dispatchOne(appPool,send,scope);assert.equal((await row()).status,'manual');assert.equal(active.calls.length,0);
    });
    await test('freeze_permission_failure_prevents_send',async()=>{
      await owner.query('REVOKE INSERT ON '+table+' FROM '+role);await assert.rejects(()=>prepare());assert.equal(await row(),undefined);assert.equal(active.calls.length,0);
    });
    await test('claim_permission_failure_prevents_send',async()=>{
      await prepare();await owner.query('REVOKE UPDATE ON '+table+' FROM '+role);await assert.rejects(()=>dispatchOne(appPool,send,scope));assert.equal(active.calls.length,0);assert.equal((await row()).status,'pending');
    });
    await test('freeze_commit_failure_prevents_send',async()=>{
      await owner.query('CREATE CONSTRAINT TRIGGER fail_delivery_commit AFTER INSERT ON '+table+' DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION reject_delivery_commit()');
      await assert.rejects(()=>prepare());assert.equal(await row(),undefined);assert.equal(active.calls.length,0);
    });
    await test('invalid_acceptance_ids_remain_retryable',async()=>{
      for(const id of [undefined,'','  ',42]){await reset();await prepare();active.failure={status:200,body:id===undefined?{}:{id}};
        assert.equal((await dispatchOne(appPool,send,scope)).status,'retry');assert.equal((await row()).accepted_message_id,null);assert.equal(active.calls.length,1);}
    });
    for(const [label,httpStatus,name,expected]of [
      ['provider_422',422,'validation_error','manual'],['provider_429',429,'rate_limit_exceeded','retry'],
      ['provider_503',503,'application_error','retry'],['idempotency_payload_conflict',409,'invalid_idempotent_request','manual'],
      ['provider_concurrent_request',409,'concurrent_idempotent_requests','retry']]){
      await test(label,async()=>{await prepare();active.failure={status:httpStatus,body:{name,message:'Fixture provider response'}};
        assert.equal((await dispatchOne(appPool,send,scope)).status,expected);const saved=await row();assert.equal(saved.status,expected);assert.equal(saved.accepted_message_id,null);assert.equal(active.calls.length,1);
        if(httpStatus===429){await reset();await prepare();active.failure={status:429,body:{name:'daily_quota_exceeded',message:'Fixture quota exhausted'}};
          assert.equal((await dispatchOne(appPool,send,scope)).status,'manual');assert.equal((await row()).accepted_message_id,null);assert.equal(active.calls.length,1);}
      });
    }
    await test('credential_scope_mismatch_prevents_send',async()=>{
      await prepare();await dispatchOne(appPool,send,'b'.repeat(64));assert.equal(active.calls.length,0);assert.notEqual((await row()).status,'accepted');
    });
    await test('dispatcher_timeout_aborts_cooperative_sender',async()=>{
      await prepare();let observed=false;const start=Date.now();
      const abortedSend=(_body,_key,signal)=>new Promise((_resolve,reject)=>{assert.ok(signal);signal.addEventListener('abort',()=>{observed=true;reject(Error('Fixture abort'));},{once:true});});
      assert.equal((await dispatchOne(appPool,abortedSend,scope)).status,'retry');assert.equal(observed,true);assert.ok(Date.now()-start>=9000);assert.equal(active.calls.length,0);
    });
    await test('stored_payload_hash_mismatch_prevents_send',async()=>{
      await prepare();await owner.query('ALTER TABLE '+table+' DISABLE TRIGGER billing_delivery_immutable; UPDATE '+table+" SET body_text=replace(body_text,'Fixture billing update','Tampered billing update'); ALTER TABLE "+table+' ENABLE TRIGGER billing_delivery_immutable');
      await dispatchOne(appPool,send,scope);assert.equal((await row()).status,'manual');assert.equal(active.calls.length,0);
    });
    await test('claim_commit_failure_prevents_send',async()=>{
      await prepare();await owner.query('CREATE CONSTRAINT TRIGGER fail_delivery_commit AFTER UPDATE ON '+table+' DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION reject_delivery_commit()');
      await assert.rejects(()=>dispatchOne(appPool,send,scope));assert.equal(active.calls.length,0);assert.equal((await row()).status,'pending');
    });
    await test('future_retry_does_not_send_early',async()=>{
      await prepare();active.failure={network:true};assert.equal((await dispatchOne(appPool,send,scope)).status,'retry');
      await owner.query('UPDATE '+table+" SET next_attempt_at=clock_timestamp()+interval '1 hour'");
      assert.equal((await dispatchOne(appPool,send,scope)).status,'idle');assert.equal(active.calls.length,1);
    });
    await test('cancellation_identity_preserves_recipient',async()=>{
      await owner.query("UPDATE billing_notification_intents SET kind='cancellation',payload=jsonb_set(payload,'{periodEnd}','1800000000'::jsonb)");
      await prepare(body,scope,{...identity,kind:'cancellation'});assert.equal((await dispatchOne(appPool,send,scope)).status,'accepted');assert.equal((await row()).kind,'cancellation');assert.equal(active.calls.length,1);
    });
    await test('accepted_delivery_is_terminal',async()=>{
      await prepare();assert.equal((await dispatchOne(appPool,send,scope)).status,'accepted');
      assert.equal((await dispatchOne(appPool,send,scope)).status,'idle');assert.equal(active.calls.length,1);assert.equal(active.accepted,1);
    });
  }catch(e){checks.push({name:'setup_or_baseline_control',pass:false,error:String(e.message).slice(0,700)});}
  finally{
    globalThis.fetch=originalFetch;for(const pool of [appPool,owner])if(pool)await pool.end();
    const report={control:controls.length===1&&controls[0].pass?'UNKEYED_RETRY_DUPLICATES_REPRODUCED':'FAILED',controls,tests:checks.length,pass:checks.filter(x=>x.pass).length,checks,
      scope:'ISOLATED_DELIVERY_CORE_REAL_POSTGRES_RESEND_SDK_MOCKED_FETCH',sdkCancellationQualified:false,realEmailsSent:0,releaseQualified:false};
    fs.writeFileSync(cfg.result,JSON.stringify(report,null,2),{flag:'wx',mode:0o600});console.log(JSON.stringify(report));
    process.exitCode=checks.some(x=>!x.pass)||controls.some(x=>!x.pass)?1:0;
  }
}
try{
  console.log('COMMAND_ID=MMHB-DELIVERY-QUALIFICATION-20260924-24');
  check(JSON.parse(bytes(path.join(ROOT,'package.json'))).name==='mymentalhealthbuddy','Wrong project');
  check(!process.env.REPL_ID||process.env.REPL_ID==='9d71c4b8-8fcd-4b22-aee2-5883d9cbe5a4','Wrong Replit identity');
  check(git('rev-parse','--show-toplevel').trim()===ROOT,'Wrong repository root');
  before=state();const current=JSON.parse(before);
  check(current.head==='b3ce0daf53f52cab918dd0c40954f038ac68da9b'&&current.branch==='integration','Branch or HEAD changed');
  check(current.status===' M server/routes/webhook.mjs\n M server/services/email.mjs\n','Unexpected tracked changes');
  check(process.getuid()!==0,'Run as the regular Replit user');
  check(fs.lstatSync(PREVIOUS).isDirectory(),'Expected prior evidence directory');
  const previous=JSON.parse(bytes(path.join(PREVIOUS,'summary.json')));
  check(previous.command==='MMHB-WEBHOOK-TRANSACTION-20260924-23'&&
    previous.status==='WEBHOOK_TRANSACTION_CANDIDATE_QUALIFIED_IN_ISOLATION'&&previous.tests===30&&previous.pass===30&&
    previous.disposableDatabaseStopped==='PASS','Prior transaction qualification differs');
  const priorState=JSON.parse(bytes(path.join(PREVIOUS,'state.after.json')));
  for(const key of ['head','branch','index','status','diff','package','lock'])check(current[key]===priorState[key],'Reviewed checkout changed: '+key);
  const pins={
    'server/routes/webhook.mjs':'5f09d685e57e53a79e959e650b8e2b6a60abda89e1b089e07ad6a16672095ba7',
    'server/services/email.mjs':'815fba3d724995e1f809f861be476b32facbad298b99bae1284bb225804929df',
    'shared/schema.mjs':'bcd740ef7e5ffcb76d41c375ad8018a1d620c9854a995e86cd3ee2236607efa9',
    'server/utils/planMapping.mjs':'a4990a99c8b8cd87c37a0348c5dcd5f61040c927c4db80c9bc76a3a8fda34f55'};
  for(const [rel,pin]of Object.entries(pins))check(hash(bytes(path.join(ROOT,rel)))===pin,'Source differs: '+rel);
  const versions={node:process.version};
  for(const name of ['pg','resend'])versions[name]=JSON.parse(bytes(path.join(ROOT,'node_modules',name,'package.json'))).version;
  check(versions.pg==='8.23.0'&&versions.resend==='6.24.0','Database dependencies changed');
  console.log('DEPENDENCIES='+JSON.stringify(versions));
  for(const binary of ['initdb','pg_ctl','postgres'])fs.accessSync(path.join(PG,binary),fs.constants.X_OK);
  const space=fs.statfsSync('/home/runner');check(space.bavail*space.bsize>=536870912,'Need 512 MiB free for disposable database');
  directory=fs.mkdtempSync('/home/runner/mmhb-delivery-qualify.');
  console.log('EVIDENCE_DIRECTORY='+directory);put('state.before.json',before);
  check(hash(bytes(path.join(PREVIOUS,'webhook.after.mjs')))==='071a2dec33cb5b426e2616d0b017d21ea37f05849079bb091f095bb1712e6e08','Qualified route differs');
  const intentsBytes=bytes(path.join(PREVIOUS,'billing-notification-intents.sql'));
  check(hash(intentsBytes)==='0abfb97fdb56428ceb0d7f02ecb951216c2eb61f356c8412b886f1fe1a27feea','Qualified intent schema differs');
  const intentsDDL=put('billing-notification-intents.sql',intentsBytes);
  const component=put('billingDelivery.mjs',"import * as crypto from 'node:crypto';\nexport const {prepareDelivery,claimDelivery,completeDelivery,dispatchOne}=("+deliveryFactory.toString()+")(crypto);\n");
  const deliveryDDL=put('billing-notification-deliveries.sql',DELIVERY_DDL);
  check(hash(bytes(component))==='f57d672bebc870c6f3285e16525a7af64de16304fce6a63d5acc4b76dac30ef1','Delivery component differs');
  check(hash(bytes(deliveryDDL))==='49f51f3bcd963df35fa276b58d9e42ef04091976934b9a28a1bd119602551d9f','Delivery schema differs');
  const worker=put('qualify.cjs','('+qualifyDelivery.toString()+')().catch(e=>{console.error(e.message);process.exitCode=2;});\n');
  run('COMPONENT_SYNTAX',process.execPath,['--check',component]);run('HARNESS_SYNTAX',process.execPath,['--check',worker]);
  console.log('COMPONENT_SHA256='+hash(bytes(component)));
  data=path.join(directory,'data');const socket=path.join(directory,'socket');fs.mkdirSync(socket,{mode:0o700});
  const password=crypto.randomBytes(32).toString('hex'),pwfile=put('fixture-password',password+'\n');
  run('INITDB',path.join(PG,'initdb'),['-D',data,'-U','mmhb_owner','--auth-local=scram-sha-256',
    '--auth-host=reject','--pwfile='+pwfile,'--encoding=UTF8','--locale=C','--no-instructions']);
  fs.appendFileSync(path.join(data,'postgresql.conf'),`\nlisten_addresses = ''\nunix_socket_directories = '${socket}'\nunix_socket_permissions = 0700\nport = 6543\nmax_connections = 16\nshared_buffers = '16MB'\ntimezone = 'UTC'\nlog_statement = 'none'\n`);
  run('PG_START',path.join(PG,'pg_ctl'),['-D',data,'-l',path.join(directory,'postgres.log'),'-w','-t','20','start'],30000);
  started=true;stopped='PENDING';
  console.log('DATABASE_SCOPE=NEW_PRIVATE_UNIX_SOCKET_CLUSTER_WITH_SYNTHETIC_DATA');
  const result=path.join(directory,'result.json');
  const cfg=put('config.json',JSON.stringify({root:ROOT,directory,data,socket,password,component,intentsDDL,deliveryDDL,result}));
  const execution=run('DELIVERY_TESTS',process.execPath,[worker,cfg],60000,[0,1]);
  report=JSON.parse(bytes(result));
  check(Array.isArray(report.checks)&&report.tests===report.checks.length&&
    report.pass===report.checks.filter(x=>x.pass).length,'Malformed qualification result');
  console.log('BASELINE_CONTROL='+JSON.stringify(report.control));
  console.log('DELIVERY_RESULT='+JSON.stringify({tests:report.tests,pass:report.pass,failed:report.checks.filter(x=>!x.pass)}));
  check(execution.status===0&&report.control==='UNKEYED_RETRY_DUPLICATES_REPRODUCED'&&report.tests===24&&report.pass===24,'Delivery qualification failed');
  status='DELIVERY_COMPONENT_QUALIFIED_IN_ISOLATION';
}catch(error){console.log('REASON='+error.message);process.exitCode=2;}
finally{
  if(data&&(started||fs.existsSync(path.join(data,'postmaster.pid')))){
    try{
      run('PG_STOP',path.join(PG,'pg_ctl'),['-D',data,'-m','fast','-w','-t','20','stop'],30000);
      run('PG_STOP_VERIFY',path.join(PG,'pg_ctl'),['-D',data,'status'],10000,[3]);stopped='PASS';
    }catch(error){stopped='FAILED';status='STOPPED';process.exitCode=2;console.log('CLEANUP_ERROR='+error.message+'\nCLEANUP_DATA_DIRECTORY='+data);}
  }
  if(before){try{
    const after=state();check(after===before,'Checkout changed during qualification');
    if(directory)put('state.after.json',after);console.log('TRACKED_SOURCE_AND_PACKAGE_FILES_PRESERVATION=PASS');
  }catch(error){status='STOPPED';process.exitCode=2;console.log('PRESERVATION_ERROR='+error.message);}}
  if(interrupted){status='STOPPED';process.exitCode=2;}
  if(directory)put('summary.json',JSON.stringify({command:'MMHB-DELIVERY-QUALIFICATION-20260924-24',
    status,tests:report?.tests,pass:report?.pass,disposableDatabaseStopped:stopped,sourceWrites:0,
    deliveryComponentTested:!!report?.tests,liveWorkerActivated:false,releaseQualified:false},null,2));
  console.log('STATUS='+status+'\nDISPOSABLE_DATABASE_STOPPED='+stopped);
  console.log('SOURCE_WRITES_BY_COMMAND=0\nLIVE_DATABASE_CONNECTIONS=0\nLIVE_DATABASE_MIGRATIONS=0\nREAL_EMAILS_SENT=0');
  console.log('DELIVERY_WORKER_ACTIVATION=NOT_RUN\nTEMPLATE_AND_CONNECTOR_INTEGRATION=PENDING\nFULL_APP_TESTS=NOT_RUN');
  console.log('COMMIT=NOT_RUN\nPUSH=NOT_RUN\nDEPLOY=NOT_RUN\nRELEASE_QUALIFIED=false');
  if(directory)console.log('EVIDENCE_DIRECTORY='+directory);
  console.log('NEXT_ACTION=RETURN_FULL_OUTPUT\nREPORT_END=MMHB-DELIVERY-QUALIFICATION-20260924-24');
}
MMHB24_NODE
)
