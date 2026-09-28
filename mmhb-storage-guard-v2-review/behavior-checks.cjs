'use strict';
// Actual supplied storage method bodies; Drizzle and the database are mocked.
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const { before, after } = JSON.parse(fs.readFileSync(0, 'utf8'));
const results = [];
function load(source, rows = [], failSelect = false) {
  const state = { rows: structuredClone(rows), writes: [], predicates: [] };
  const users = Object.fromEntries(['id', 'replitId', 'email', 'role'].map(x => [x, x]));
  const eq = (field, value) => ({ field, value });
  const db = {
    select() { return { from() { return { async where(p) {
      if (failSelect) throw Error('SIMULATED_DB_FAILURE');
      state.predicates.push(p);
      return state.rows.filter(r => r[p.field] === p.value).map(r => ({...r}));
    } }; } }; },
    update() { return { set(values) { return { where(p) { return { async returning() {
      state.writes.push({ kind: 'update', values: {...values}, predicate: p });
      const rows = state.rows.filter(r => r[p.field] === p.value);
      rows.forEach(r => Object.assign(r, values)); return rows.map(r => ({...r}));
    } }; } }; } }; },
    insert() { return { values(values) { return { async returning() {
      state.writes.push({ kind: 'insert', values: {...values} });
      const row = { id: 'generated-' + state.rows.length, ...values };
      state.rows.push(row); return [{...row}];
    } }; } }; },
  };
  const imports = [
    'import { users } from "../../../shared/schema.mjs";',
    'import db from "../../db/client.mjs";',
    'import { eq } from "drizzle-orm";',
    'import { logger } from "../../utils/logger.mjs";',
  ];
  for (const item of imports) {
    assert.equal(source.split(item).length, 2, 'Unexpected import baseline');
    source = source.replace(item, '');
  }
  const end = 'export const authStorage = new AuthStorage();';
  assert.equal(source.split(end).length, 2, 'Unexpected export baseline');
  source = source.replace(end, 'globalThis.subject = new AuthStorage();');
  const sandbox = { users, db, eq, logger: {info(){}, error(){}, warn(){}} };
  const ctx = vm.createContext(sandbox);
  new vm.Script(source).runInContext(ctx, { timeout: 1000 });
  return { sut: ctx.subject, state };
}
const input = { id: 'new-subject', email: 'new@example.invalid', firstName: 'New', lastName: 'Person' };
const admin = email => ({ id: 'admin-id', replitId: 'admin-subject', email, role: 'admin', name: 'Owner' });
async function newUserIsOrdinary(source, rows = [], extra = {}) {
  const {sut,state} = load(source,rows);
  const r = await sut.upsertUser({...input,...extra});
  assert.equal(r.role, 'user'); assert.equal(r.isNewUser,true);
  assert.equal(state.writes.filter(x => x.kind==='insert').length,1);
  assert.equal(state.predicates.some(x=>x.field==='role'),false);
}
async function collisionBlocked(source, row, extra = {}) {
  const {sut,state} = load(source,[row]);
  const saved=JSON.stringify(state.rows);
  await assert.rejects(sut.upsertUser({...input,email:row.email,...extra}), e=>e.code==='AUTH_ACCOUNT_LINK_REQUIRED');
  assert.equal(state.writes.length,0); assert.equal(JSON.stringify(state.rows),saved);
}
async function preserveRole(source, role) {
  const row={id:'known-id',replitId:input.id,email:input.email,role,name:'Previous',profileImageUrl:'old'};
  const {sut,state}=load(source,[row]);
  const r=await sut.upsertUser({...input,role:role==='admin'?'user':'admin',profileImageUrl:'new'});
  assert.equal(r.role,role); assert.equal(r.id,'known-id'); assert.equal(r.replitId,input.id);
  assert.equal(r.name,'New Person'); assert.equal(r.profileImageUrl,'new');
  assert.equal(state.writes.length,1); assert.equal(state.writes[0].kind,'update');
  assert.equal(Object.hasOwn(state.writes[0].values,'role'),false);
}
async function check(name,fn,kind='patched_behavior') {
  try { await fn();results.push({name,kind,pass:true}); }
  catch(e) { results.push({name,kind,pass:false,reason:String(e.message).slice(0,180)}); }
}
(async()=>{
  await check('Original: no administrator causes new account admin',async()=>{
    const {sut}=load(before); assert.equal((await sut.upsertUser(input)).role,'admin');
  },'baseline_unsafe_behavior_reproduced');
  await check('Original: test-named administrators allow another admin',async()=>{
    const {sut}=load(before,[admin('test-owner@example.invalid')]);assert.equal((await sut.upsertUser(input)).role,'admin');
  },'baseline_unsafe_behavior_reproduced');
  await check('Original: same email overwrites a different linked subject',async()=>{
    const row=admin(input.email);const {sut,state}=load(before,[row]);
    const r=await sut.upsertUser(input);assert.equal(r.id,row.id);assert.equal(r.role,'admin');
    assert.equal(state.rows[0].replitId,input.id);
  },'baseline_unsafe_behavior_reproduced');
  for (const [name,rows] of [
    ['Empty account table',[]],['No admin but ordinary users',[{id:'u',role:'user'}]],
    ['Only test-named admin',[admin('test-owner@example.invalid')]],
    ['Only fixture-named admin',[admin('fixture@example.invalid')]],
    ['Normal existing admin',[admin('owner@example.invalid')]],
    ['Mixed admin emails',[admin('test@example.invalid'),{...admin('owner@example.invalid'),id:'other'}]],
    ['Incidental substring in real-looking admin email',[admin('contest@example.invalid')]],
  ]) await check(name+': new account is ordinary',()=>newUserIsOrdinary(after,rows));
  await check('Input role cannot promote new account',()=>newUserIsOrdinary(after,[],{role:'admin'}));
  await check('Email omitted: legacy placeholder preserved, role ordinary',async()=>{
    const {sut}=load(after);const r=await sut.upsertUser({id:'no-email'});
    assert.equal(r.email,'user_no-email@replit.auth');assert.equal(r.role,'user');
  });
  await check('Existing linked administrator retains role and identity',()=>preserveRole(after,'admin'));
  await check('Existing linked ordinary user cannot request promotion',()=>preserveRole(after,'user'));
  await check('Existing linked account keeps absent profile fields',async()=>{
    const {sut}=load(after,[{id:'k',replitId:'s',email:'old@example.invalid',role:'admin',name:'Old',profileImageUrl:'old'}]);
    const r=await sut.upsertUser({id:'s'});assert.equal(r.name,'Old');assert.equal(r.email,'old@example.invalid');
    assert.equal(r.profileImageUrl,'old');assert.equal(r.role,'admin');
  });
  await check('Unlinked matching email is not linked automatically',()=>collisionBlocked(after,{id:'u',email:input.email,role:'user'}));
  await check('Different subject on ordinary account is not replaced',()=>collisionBlocked(after,{id:'u',replitId:'other',email:input.email,role:'user'}));
  await check('Different subject on admin account is not replaced',()=>collisionBlocked(after,admin(input.email)));
  await check('Arbitrary verification/link flags cannot bypass explicit-link requirement',()=>collisionBlocked(after,admin(input.email),{email_verified:true,linkApproved:true}));
  await check('Multiple matching-email rows cause zero writes',async()=>{
    const {sut,state}=load(after,[admin(input.email),{id:'u',replitId:'other',email:input.email,role:'user'}]);
    await assert.rejects(sut.upsertUser(input),e=>e.code==='AUTH_ACCOUNT_LINK_REQUIRED');assert.equal(state.writes.length,0);
  });
  await check('Database read failure propagates without writes',async()=>{
    const {sut,state}=load(after,[],true);await assert.rejects(sut.upsertUser(input),/SIMULATED_DB_FAILURE/);assert.equal(state.writes.length,0);
  });
  await check('Existing getters preserve return shape (privacy filtering not addressed)',async()=>{
    const {sut}=load(after,[{id:'u',replitId:'s',passwordHash:'SYNTHETIC_NOT_SECRET'}]);
    assert.equal((await sut.getUser('u')).passwordHash,'SYNTHETIC_NOT_SECRET');
    assert.equal((await sut.getUserByReplitId('s')).id,'u');
  },'unresolved_behavior_retained');
  const auto=after.replace("role: 'user',", "role: 'admin',");
  await check('Mutation: automatic admin grant is detected',()=>assert.rejects(newUserIsOrdinary(auto)), 'mutation_detection');
  const bstart=before.indexOf('      if (existingByEmail.length > 0) {');
  const bend=before.indexOf('      // Check if there are any existing admins',bstart);
  const astart=after.indexOf('      if (existingByEmail.length > 0) {');
  const aend=after.indexOf('      // Public sign-in never grants',astart);
  const link=after.slice(0,astart)+before.slice(bstart,bend)+after.slice(aend);
  await check('Mutation: email-only linking is detected',()=>assert.rejects(collisionBlocked(link,admin(input.email))), 'mutation_detection');
  const demote=after.replace('.set({', ".set({\n          role: 'user',");
  await check('Mutation: existing administrator demotion is detected',()=>assert.rejects(preserveRole(demote,'admin')), 'mutation_detection');
  const summary={schema:'MMHB_STORAGE_GUARD_TEST_V1',runtime:process.version,
    scope:'Provided storage method bodies, mocked Drizzle API and database; no real SQL, OIDC, HTTP or browser',
    total:results.length,passed:results.filter(r=>r.pass).length,results};
  console.log(JSON.stringify(summary,null,2));if(summary.passed!==summary.total)process.exitCode=1;
})().catch(()=>{console.error('STORAGE_TEST_RUNNER_FAILED');process.exitCode=1;});
