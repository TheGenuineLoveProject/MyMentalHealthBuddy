import path from 'node:path';
import crypto from 'node:crypto';
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const requireThat=(ok,code)=>{if(!ok)throw Object.assign(new Error(code),{code});};
const keys=['head','branch','index','stagedEntriesSha256','trackedFlagsSha256','worktree','files'];
const digest=x=>typeof x==='string'&&/^[a-f0-9]{64}$/.test(x);
const relativeName=name=>typeof name==='string'&&name.length>0&&name.length<=4096&&!name.includes('\0')
  &&!path.isAbsolute(name)&&!name.split('/').some(x=>x==='..'||x==='.'||x==='');
const identityFields={FILE:['state','sha256','bytes','mode','resolved'],ABSENT:['state'],SYMLINK:['state','mode','sha256']};
function validIdentity(id){
  if(!id||typeof id!=='object'||Array.isArray(id)||!Object.hasOwn(identityFields,id.state))return false;
  const allowed=identityFields[id.state],own=Object.keys(id);
  if(own.length!==allowed.length||!allowed.every(k=>Object.hasOwn(id,k)))return false;
  if(id.state==='ABSENT')return true;
  if(!digest(id.sha256)||!Number.isSafeInteger(id.mode)||id.mode<0)return false;
  return id.state==='SYMLINK'||(Number.isSafeInteger(id.bytes)&&id.bytes>=0&&relativeName(id.resolved));
}
export function validateSnapshot(s){
  requireThat(s&&Array.isArray(s.records)&&s.records.length<=30000,'SNAPSHOT_SCHEMA');
  requireThat(typeof s.head==='string'&&/^[a-f0-9]{40,64}$/.test(s.head)&&typeof s.branch==='string','SNAPSHOT_GIT_SCHEMA');
  requireThat(digest(s.worktree)&&digest(s.stagedEntriesSha256)&&digest(s.trackedFlagsSha256),'SNAPSHOT_DIGEST_SCHEMA');
  const names=new Set();let previous;
  const identity=id=>requireThat(validIdentity(id),'SNAPSHOT_IDENTITY_SCHEMA');
  for(const row of s.records){
    requireThat(Array.isArray(row)&&row.length===2,'SNAPSHOT_RECORD_SCHEMA');
    const [name,id]=row;
    requireThat(relativeName(name),'SNAPSHOT_PATH');
    requireThat(!names.has(name)&&(previous===undefined||previous<name),'SNAPSHOT_DUPLICATE_OR_ORDER');
    names.add(name);previous=name;identity(id);
  }
  identity(s.index);
  requireThat(s.files===s.records.length&&sha(JSON.stringify(s.records))===s.worktree,'SNAPSHOT_SELF_CONSISTENCY');
  return s;
}
export function compareSnapshots(before,after){
  validateSnapshot(before);validateSnapshot(after);
  const b=new Map(before.records),a=new Map(after.records),changes=[];
  for(const file of [...new Set([...b.keys(),...a.keys()])].sort()){
    const old=b.get(file),next=a.get(file);
    if(JSON.stringify(old)!==JSON.stringify(next))changes.push({file,
      kind:!old?'ADDED_TO_OBSERVED_SET':!next?'REMOVED_FROM_OBSERVED_SET':'IDENTITY_CHANGED',
      fields:[...new Set([...Object.keys(old||{}),...Object.keys(next||{})])].filter(k=>JSON.stringify(old?.[k])!==JSON.stringify(next?.[k])),
      before:old??null,after:next??null});
  }
  return {components:keys.filter(k=>JSON.stringify(before[k])!==JSON.stringify(after[k])),changedFileCount:changes.length,changes};
}
export function publicIdentity(id){
  if(id===null||id===undefined)return {state:'NOT_IN_OBSERVED_SET'};
  // Failed current observations carry local diagnostic fields; never echo those here.
  if(id.state==='UNOBSERVED')return {state:'UNOBSERVED'};
  if(!validIdentity(id))return {state:'UNOBSERVED',reason:'INVALID_IDENTITY_SCHEMA'};
  if(id.state==='ABSENT')return {state:'ABSENT'};
  if(id.state==='SYMLINK')return {state:'SYMLINK',sha256:id.sha256,mode:id.mode};
  return {state:'FILE',sha256:id.sha256,bytes:id.bytes,mode:id.mode,resolvedPathSha256:sha(id.resolved)};
}
