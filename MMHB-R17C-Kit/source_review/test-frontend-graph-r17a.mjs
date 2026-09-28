import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {inspectGraph} from './frontend-graph-policy-r17a.mjs';
import * as policy from './fresh-build-policy-r17.mjs';
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'mmhb-graph-r17a-test-'));
fs.mkdirSync(path.join(dir,'client'));
for(const n of ['index.html','main.jsx','space #file.js'])fs.writeFileSync(path.join(dir,'client',n),'content');
const inputs=policy.regularTree(dir).rows;
const opts={buildRoot:dir,inputs,fileIdentity:policy.fileIdentity,directory:policy.directory};
const results=[];
function graph(modules=[dir+'/client/main.jsx'],watchFiles=['client/index.html']){
 return {moduleIdsSupported:true,watchFilesSupported:true,modules:modules.map(id=>({id,isExternal:false})),watchFiles};
}
function run(name,fn){fn();results.push({case:name,result:'PASS'});}
try{
 run('cwd-relative watch path and resource query',()=>{
   const r=inspectGraph(graph([dir+'/client/main.jsx?commonjs-proxy']),opts);
   assert.equal(r.issueCount,0);assert.equal(r.counts.relativeWatchPaths,1);assert.equal(r.counts.physicalFiles,2);
 });
 run('relative directory watch within inventoried tree',()=>{
   const r=inspectGraph(graph(undefined,['client','.']),opts);assert.equal(r.issueCount,0);assert.equal(r.counts.physicalDirectories,2);
 });
 run('NUL virtual modules remain classified without file identity',()=>{
   const r=inspectGraph(graph([dir+'/client/main.jsx','\0rolldown/runtime.js'],['\0rolldown/runtime.js']),opts);
   assert.equal(r.issueCount,0);assert.equal(r.counts.virtualModuleIds,1);assert.equal(r.counts.virtualWatchReferences,1);
   assert.equal(r.physicalInputs.length,1);
 });
 run('relative module is unresolved rather than guessed to be a file',()=>{
   const r=inspectGraph(graph(['client/main.jsx']),opts);assert.equal(r.issues[0].code,'UNCLASSIFIED_MODULE_ID');
 });
 run('Vite production browser external is generated, not a missing file',()=>{
   const g=graph([dir+'/client/main.jsx','__vite-browser-external'],[]);
   g.modules[0].importedIds=['__vite-browser-external'];g.watchFilesSupported=false;
   const r=inspectGraph(g,opts);assert.equal(r.issueCount,0);assert.equal(r.counts.viteBrowserExternalModules,1);
   assert.equal(r.generatedModules[0].consumers.length,1);
   assert.equal(r.watchCoverage,'API_NOT_AVAILABLE_NO_WATCH_PATH_COVERAGE');
 });
 run('Vite scoped optional peer placeholder is explicit and runtime unqualified',()=>{
   const r=inspectGraph(graph(['__vite-optional-peer-dep:@foo/peer/subpath:@foo/parent']),opts);
   assert.equal(r.issueCount,0);assert.equal(r.counts.viteOptionalPeerModules,1);
   assert.equal(r.generatedModules[0].consumerRuntime,'UNQUALIFIED');
 });
 run('lookalike generated prefixes and malformed peers are rejected',()=>{
   const r=inspectGraph(graph(['__vite-browser-external-unknown','__vite-optional-peer-dep:missing-parent']),opts);
   assert.equal(r.issueCount,2);assert.ok(r.issues.every(x=>x.code==='UNCLASSIFIED_MODULE_ID'));
 });
 run('unavailable watch API with nonempty evidence is inconsistent',()=>{
   const g=graph();g.watchFilesSupported=false;assert.throws(()=>inspectGraph(g,opts),e=>e.code==='FRONTEND_GRAPH');
 });
 run('outside-copy paths rejected before file access',()=>{
   const r=inspectGraph(graph(['/etc/passwd'],['../elsewhere']),{...opts,fileIdentity:()=>assert.fail('read outside root')});
   assert.equal(r.issueCount,2);assert.ok(r.issues.every(x=>x.code==='GRAPH_INPUT_OUTSIDE_COPY'));
 });
 run('absolute fake Vite filesystem prefix receives no blanket exemption',()=>{
   const r=inspectGraph(graph(['/ @notreal'.replace(' ','')+'/fs/etc/passwd']),opts);assert.equal(r.issues[0].code,'GRAPH_INPUT_OUTSIDE_COPY');
 });
 run('unknown namespaces and watch patterns collected together',()=>{
   const r=inspectGraph(graph(['virtual:new-plugin','rolldown:other'],['client/**/*.js']),opts);assert.equal(r.issueCount,3);
 });
 run('secret-bearing URL diagnostics redact values',()=>{
   const r=inspectGraph(graph(['https://user:PRIVATE_SECRET@host.invalid/a?token=PRIVATE_SECRET']),opts);
   assert.ok(!JSON.stringify(r).includes('PRIVATE_SECRET'));assert.equal(r.issueCount,1);
 });
 run('ordinary spaces and hash in physical filenames preserved',()=>{
   const r=inspectGraph(graph([dir+'/client/space #file.js']),opts);assert.equal(r.issueCount,0);
 });
 run('unknown virtual watch item is not accepted as a physical path',()=>{
   const r=inspectGraph(graph(undefined,['\0orphan']),opts);assert.equal(r.issues[0].code,'VIRTUAL_WATCH_WITHOUT_MODULE');
 });
 run('duplicate module metadata rejected',()=>{
   assert.throws(()=>inspectGraph(graph(['same','same']),opts),e=>e.code==='GRAPH_MODULE_DUPLICATE');
 });
 run('file byte drift rejected',()=>{
   const file=path.join(dir,'client/main.jsx');fs.writeFileSync(file,'changed');
   const r=inspectGraph(graph(),opts);assert.equal(r.issues[0].code,'GRAPH_INPUT_CHANGED');fs.writeFileSync(file,'content');
 });
 run('file symlink rejected without following it',()=>{
   const file=path.join(dir,'client/main.jsx');fs.unlinkSync(file);fs.symlinkSync('/etc/passwd',file);
   const r=inspectGraph(graph(),opts);assert.equal(r.issues[0].code,'FILE_SYMLINK');fs.unlinkSync(file);fs.writeFileSync(file,'content');
 });
 run('native runner differs only in new report directory name',()=>{
   const here=path.dirname(fileURLToPath(import.meta.url));
   const a=fs.readFileSync(path.join(here,'native-candidate-runner-r17.mjs'),'utf8');
   const b=fs.readFileSync(path.join(here,'native-candidate-runner-r17a.mjs'),'utf8');
   assert.equal(a.replace('\\/r17-[A-Za-z0-9]+$','\\/r17a-[A-Za-z0-9]+$'),b);
 });
 const out={status:'PASS',checks:results.length,scope:'GRAPH_FILESYSTEM_CLASSIFICATION_AND_NATIVE_RUNNER_PATH_CONTRACT',results};
 fs.writeFileSync(new URL('./r17a-graph-fixture-results.json',import.meta.url),JSON.stringify(out,null,2)+'\n');
 console.log(JSON.stringify(out,null,2));
}finally{fs.rmSync(dir,{recursive:true,force:true});}
