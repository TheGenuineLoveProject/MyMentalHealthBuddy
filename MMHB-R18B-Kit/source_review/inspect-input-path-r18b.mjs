import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT='/home/runner/workspace';
const TARGET='c4c8b0e9f50a3e6490cdce714f0cfe8b89563962cc4a3709a00a11e80704258b';
const TARGET_BYTES=52;
const PRIOR='.mmhb-release-evidence/r17b-q6rzGy';
const RECEIPT='.mmhb-release-evidence/r18a-8GxfuU/runtime-contract-evidence.json';
const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const check=(ok,code)=>{if(!ok)throw Object.assign(new Error(code),{code});};
const reads=new Map();
const safeRelative=s=>typeof s==='string'&&s.length>0&&s.length<=500&&!path.isAbsolute(s)
  &&/^[A-Za-z0-9_@.+/-]+$/.test(s)&&!s.split('/').some(p=>!p||p==='.'||p==='..');
function metadata(rel){
  check(safeRelative(rel),'METADATA_PATH');
  let at=ROOT;
  for(const part of rel.split('/')){at=path.join(at,part);check(!fs.lstatSync(at).isSymbolicLink(),'METADATA_SYMLINK');}
  const st=fs.statSync(at);check(st.isFile()&&st.size<=64*1024**2,'METADATA_SIZE');
  const raw=fs.readFileSync(at),id=hash(raw);
  check(!reads.has(rel)||reads.get(rel)===id,'METADATA_CHANGED');reads.set(rel,id);
  return JSON.parse(raw.toString('utf8'));
}
function reasons(file){
  const out=[];
  for(const p of file.split('/')){
    if(p.toLowerCase()==='private')out.push('DIRECTORY_OR_FILENAME_PRIVATE');
    if(['.git','.ssh','.npmrc','.netrc'].includes(p.toLowerCase()))out.push('SENSITIVE_METADATA_NAME');
    if(/^\.env(?:\.|$)/i.test(p))out.push('ENVIRONMENT_FILENAME');
    if(/\.(?:pem|key|p12|pfx)$/i.test(p))out.push('KEY_OR_CERTIFICATE_EXTENSION');
  }
  return [...new Set(out)];
}
let result={project:'MyMentalHealthBuddy',command:'MMHB-INPUT-PATH-INSPECT-R18B',releaseReady:false,
  applicationRuntime:'UNPROVEN',scope:'SAVED_METADATA_ONLY_NO_APPLICATION_MODULE_CONTENTS_READ'};
try{
  check(fs.realpathSync(process.cwd())===ROOT&&fs.realpathSync(ROOT)===ROOT,'WORKSPACE_PATH');
  const receipt=metadata(RECEIPT),failure=receipt.failure;
  check(receipt.project==='MyMentalHealthBuddy'&&receipt.status==='RUNTIME_CONTRACT_FAILED'
    &&failure?.gate==='RUNTIME_INPUT_PRIVATE_OR_INVALID'
    &&failure.graphDetails?.metadataIndex===1&&failure.graphDetails.graphSide==='INPUT'
    &&failure.graphDetails.specifierSha256===TARGET&&failure.graphDetails.specifierBytes===TARGET_BYTES,'R18A_RECEIPT');
  const inventory=metadata(PRIOR+'/build-input-manifest.json');
  check(Array.isArray(inventory.rows)&&inventory.rows.length<=100000
    &&hash(JSON.stringify(inventory.rows))===inventory.manifestSha256,'INVENTORY_DIGEST');
  const rows=new Map(inventory.rows.map(row=>[row.file,row]));check(rows.size===inventory.rows.length,'INVENTORY_DUPLICATE');
  const cwd=inventory.compilerWorkingDirectory;
  check(typeof cwd==='string'&&/^\/tmp\/mmhb-build-r17b-[A-Za-z0-9]{6}$/.test(cwd),'COMPILER_ROOT');
  const matches=[];
  for(const number of [1,2]){
    const meta=metadata(PRIOR+'/server-build/meta-'+number+'.json');
    check(meta.inputs&&typeof meta.inputs==='object'&&!Array.isArray(meta.inputs),'INPUT_MAP');
    const entries=Object.entries(meta.inputs);check(entries.length<=100000,'INPUT_COUNT');
    const found=entries.filter(([key])=>Buffer.byteLength(key)===TARGET_BYTES&&hash(key)===TARGET);
    check(found.length===1,'TARGET_INPUT_NOT_UNIQUE');
    const [raw,entry]=found[0],absolute=path.resolve(cwd,raw);
    check(absolute.startsWith(cwd+'/'),'INPUT_OUTSIDE_RETAINED_ROOT');
    const file=path.relative(cwd,absolute),row=rows.get(file);
    check(row&&row.type==='file'&&Number.isSafeInteger(row.bytes)&&entry.bytes===row.bytes
      &&/^[a-f0-9]{64}$/.test(row.sha256),'TARGET_INVENTORY_LINK');
    // Only module filenames are displayed. Sensitive-file names remain hashed.
    const why=reasons(file),display=safeRelative(file)&&/\.(?:[cm]?js|[cm]?ts|jsx|tsx|json)$/.test(file)
      &&why.every(r=>r==='DIRECTORY_OR_FILENAME_PRIVATE');
    const item={metadataIndex:number,inputPath:display?file:'REDACTED_NON_MODULE_PATH',
      pathSha256:hash(raw),pathBytes:Buffer.byteLength(raw),rejectedBy:why,
      recordedModule:{sha256:row.sha256,bytes:row.bytes},moduleContentsRead:false};
    const pieces=file.split('/'),i=pieces.lastIndexOf('node_modules');
    if(display&&i>=0&&pieces[i+1]){
      const end=i+(pieces[i+1].startsWith('@')?3:2),name=pieces.slice(i+1,end).join('/');
      check(/^(?:@[A-Za-z0-9._-]+\/)?[A-Za-z0-9._-]+$/.test(name),'PACKAGE_NAME');
      const packagePath=pieces.slice(0,end).join('/')+'/package.json',packageRow=rows.get(packagePath);
      if(packageRow?.type==='file'){
        const p=metadata(PRIOR+'/build-input/'+packagePath);
        check(reads.get(PRIOR+'/build-input/'+packagePath)===packageRow.sha256,'PACKAGE_METADATA_CHANGED');
        check(p.name===name&&typeof p.version==='string'&&/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(p.version),'PACKAGE_METADATA');
        item.package={name,version:p.version,metadataSha256:packageRow.sha256};
      }
    }
    matches.push(item);
  }
  check(matches[0].recordedModule.sha256===matches[1].recordedModule.sha256,'REPEAT_TARGET_CHANGED');
  result={...result,status:'INPUT_PATH_IDENTIFIED_REVIEW_REQUIRED',matches};
}catch(error){result={...result,status:'INPUT_PATH_INSPECTION_FAILED',gate:/^[A-Z0-9_]{1,80}$/.test(error.code||'')?error.code:'INSPECTION_ERROR'};process.exitCode=1;}
try{for(const [rel,id] of reads){metadata(rel);check(reads.get(rel)===id,'METADATA_CHANGED');}result.readMetadataStable=true;}
catch{result={...result,status:'INPUT_PATH_INSPECTION_FAILED',gate:'METADATA_CHANGED',readMetadataStable:false};process.exitCode=1;}
console.log(JSON.stringify(result,null,2));
console.log('BUILD=0 INSTALL=0 APPLICATION_START=0 SOURCE_EDIT=0 REPORT_WRITE=0');
console.log('NEXT_ACTION=RETURN_COMPLETE_OUTPUT');
