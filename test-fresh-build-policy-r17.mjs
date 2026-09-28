import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import assert from 'node:assert/strict';
import * as p from './fresh-build-policy-r17.mjs';
const root=fs.mkdtempSync(path.join(os.tmpdir(),'mmhb-r17-policy-'));let count=0;const results=[];
const run=(name,fn)=>{fn();count++;results.push({name,result:'PASS'});console.log('PASS '+name);};
function file(base,rel,raw){const full=path.join(base,rel);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,raw);return full;}
try {
 const src=path.join(root,'src'),dst=path.join(root,'dst');fs.mkdirSync(src);fs.mkdirSync(dst);
 file(src,'content with spaces.svg','<svg/>');file(src,'node_modules/es5-ext/#/a.js','module.exports=1');
 run('legitimate_spaces_and_hash_components',()=>assert.equal(p.regularTree(src).rows.length,2));
 run('source_private_and_generated_exclusions',()=>{for(const name of ['.env.production','x/.env','x/private.pem','client/dist/a.js','node_modules/pkg/a.js'])assert.equal(p.sourceSkip(name),true);assert.equal(p.sourceSkip('client/src/index.jsx'),false);});
 run('source_symlink_refused',()=>{const link=path.join(src,'linked');fs.symlinkSync('/etc/passwd',link);assert.throws(()=>p.regularTree(src),{code:'SOURCE_OR_OUTPUT_SYMLINK'});fs.unlinkSync(link);});
 const rows=p.regularTree(src).rows;
 run('copy_preserves_bytes_and_modes',()=>{p.copyRows(src,dst,rows);assert.deepEqual(p.regularTree(dst),p.regularTree(src));});
 run('existing_destination_not_overwritten',()=>assert.throws(()=>p.copyRows(src,dst,rows),{code:'EEXIST'}));
 run('manifest_traversal_refused',()=>assert.throws(()=>p.copyRows(src,dst,[{file:'../escape',type:'file'}]),{code:'COPY_ROW_PATH'}));
 run('source_drift_refused',()=>{const to=path.join(root,'changed');fs.mkdirSync(to);fs.appendFileSync(path.join(src,rows[0].file),'changed');assert.throws(()=>p.copyRows(src,to,rows),{code:'COPY_SOURCE_CHANGED'});});
 run('copied_bin_link_stays_inside_modules',()=>{const a=path.join(root,'links-a'),b=path.join(root,'links-b');fs.mkdirSync(a);fs.mkdirSync(b);file(a,'node_modules/pkg/cli.js','#!/bin/true\n');fs.mkdirSync(path.join(a,'node_modules/.bin'));fs.symlinkSync('../pkg/cli.js',path.join(a,'node_modules/.bin/pkg'));p.copyRows(a,b,[p.fileIdentity(a,'node_modules/pkg/cli.js'),{file:'node_modules/.bin/pkg',type:'symlink',link:'../pkg/cli.js'}],{links:true});assert.equal(fs.realpathSync(path.join(b,'node_modules/.bin/pkg')),path.join(b,'node_modules/pkg/cli.js'));});
 run('escaping_bin_link_refused',()=>{const b=path.join(root,'badlink');fs.mkdirSync(b);assert.throws(()=>p.copyRows(src,b,[{file:'node_modules/.bin/pkg',type:'symlink',link:'../../../outside'}],{links:true}),{code:'COPY_LINK_BOUNDARY'});});
 run('server_input_outside_copy_refused',()=>assert.throws(()=>p.verifyBuildInputs({inputs:{'/etc/passwd':{}},outputs:{}},src,[]),{code:'SERVER_INPUT_NOT_IN_SNAPSHOT'}));
 run('native_runner_only_report_path_changed',()=>{const before=fs.readFileSync(new URL('./native-candidate-runner-r13.mjs',import.meta.url),'utf8');const after=fs.readFileSync(new URL('./native-candidate-runner-r17.mjs',import.meta.url),'utf8');assert.equal(after,before.replace('/^\\/tmp\\/mmhb-release-assembly-r13-[A-Za-z0-9]+$/','/^\\/home\\/runner\\/workspace\\/\\.mmhb-release-evidence\\/r17-[A-Za-z0-9]+$/'));assert.match('/home/runner/workspace/.mmhb-release-evidence/r17-abc123',/^\/home\/runner\/workspace\/\.mmhb-release-evidence\/r17-[A-Za-z0-9]+$/);});
 fs.writeFileSync(new URL('./r17-policy-fixture-results.json',import.meta.url),JSON.stringify({status:'PASS',checks:count,results},null,2)+'\n');
}finally{fs.rmSync(root,{recursive:true,force:true});}
