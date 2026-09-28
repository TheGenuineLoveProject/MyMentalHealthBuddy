import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import http from 'node:http';
import https from 'node:https';
import net from 'node:net';
import cp from 'node:child_process';

// Run the installed npm Arborist virtual loader, not npm ci/reify. Fixtures are
// synthetic and local. No dependency package or lifecycle script is imported.
const npmRoot = process.argv[2] ?? path.dirname(path.dirname(fs.realpathSync(path.join(path.dirname(process.execPath),'npm'))));
const requireNpm = createRequire(path.join(npmRoot,'package.json'));
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const roots = [], results = [], restore = [];
const calls = {network:0,children:0};
function block(object,key,kind) {
  const old=object[key];
  object[key]=()=>{calls[kind]++;throw new Error('UNEXPECTED_'+kind.toUpperCase()+'_IN_OFFLINE_TEST');};
  restore.push(()=>{object[key]=old;});
}
for (const [object,keys,kind] of [
  [http,['request','get'],'network'],[https,['request','get'],'network'],
  [net,['connect','createConnection'],'network'],[net.Socket.prototype,['connect'],'network'],
  [cp,['spawn','spawnSync','exec','execSync','execFile','execFileSync','fork'],'children'],
]) for (const key of keys) block(object,key,kind);
block(globalThis,'fetch','network');
function write(root,file,value) {
  const full=path.join(root,file);fs.mkdirSync(path.dirname(full),{recursive:true});
  fs.writeFileSync(full,JSON.stringify(value)+'\n');
}
function fixture(workspaces) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'mmhb-r16e-npm-virtual-'));roots.push(root);
  const manifest={name:'mymentalhealthbuddy',version:'1.0.0',dependencies:{eslint:'9.39.1'}};
  const lock={name:manifest.name,version:manifest.version,lockfileVersion:3,requires:true,packages:{
    '':structuredClone(manifest),
    'node_modules/eslint':{version:'9.39.1',resolved:'https://registry.npmjs.org/eslint/-/eslint-9.39.1.tgz',
      integrity:'sha512-'+Buffer.alloc(64).toString('base64'),workspaces},
  }};
  write(root,'package.json',manifest);write(root,'package-lock.json',lock);
  write(root,'node_modules/eslint/packages/embedded/package.json',{name:'embedded',version:'1.0.0'});
  return {root,manifest,lock};
}
function snapshot(root) {
  const files={};
  function walk(dir) {
    for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
      const full=path.join(dir,entry.name);
      if (entry.isDirectory()) walk(full);
      else {assert(entry.isFile());files[path.relative(root,full)]=hash(fs.readFileSync(full));}
    }
  }
  walk(root);return files;
}
const identities={};
try {
  const Arborist=requireNpm('@npmcli/arborist');
  const mapWorkspaces=requireNpm('@npmcli/map-workspaces');
  for (const file of ['package.json','node_modules/@npmcli/arborist/package.json','node_modules/@npmcli/map-workspaces/package.json',
    'node_modules/@npmcli/arborist/lib/arborist/load-virtual.js','node_modules/@npmcli/map-workspaces/lib/index.js']) {
    identities[file]=hash(fs.readFileSync(path.join(npmRoot,file)));
  }
  for (const [name,metadata] of [['array workspace metadata',['packages/*']],['object workspace metadata',{packages:['packages/*'],nohoist:['**']} ]]) {
    const f=fixture(metadata),before=snapshot(f.root);
    assert.equal(mapWorkspaces.virtual({cwd:f.root,lockfile:f.lock}).size,0);
    const tree=await new Arborist({path:f.root,workspaces:[],workspacesEnabled:false,offline:true,ignoreScripts:true,audit:false,fund:false}).loadVirtual();
    assert.equal(tree.workspaces?.size??0,0);
    assert.equal(tree.children.get('eslint').workspaces?.size??0,0);
    assert.equal(tree.inventory.size,2);
    assert.deepEqual(tree.children.get('eslint').package.workspaces,metadata);
    assert.deepEqual(snapshot(f.root),before);
    results.push({name:'Real npm ignores dependency '+name+' for project mapping',status:'PASS'});
  }
  const f=fixture(['packages/*']);
  f.manifest.workspaces=['packages/local'];f.lock.packages['']=structuredClone(f.manifest);
  f.lock.packages['packages/local']={name:'local',version:'1.0.0'};
  f.lock.packages['node_modules/local']={resolved:'packages/local',link:true};
  write(f.root,'package.json',f.manifest);write(f.root,'package-lock.json',f.lock);
  write(f.root,'packages/local/package.json',{name:'local',version:'1.0.0'});
  const before=snapshot(f.root);
  const mapped=mapWorkspaces.virtual({cwd:f.root,lockfile:f.lock});
  assert.equal(mapped.size,1);assert.equal(mapped.get('local'),path.join(f.root,'packages/local'));
  const tree=await new Arborist({path:f.root,offline:true,ignoreScripts:true,audit:false,fund:false}).loadVirtual();
  assert.equal(tree.workspaces.size,1);assert.equal(tree.children.get('local').isLink,true);
  assert.deepEqual(snapshot(f.root),before);
  results.push({name:'Positive control: actual root workspace is mapped and linked in virtual tree',status:'PASS'});
  assert.deepEqual(calls,{network:0,children:0});
} finally {
  for (const undo of restore.reverse()) undo();
  for (const root of roots) fs.rmSync(root,{recursive:true,force:true});
}
const npm=JSON.parse(fs.readFileSync(path.join(npmRoot,'package.json')));
const report={scope:'REAL_INSTALLED_NPM_VIRTUAL_LOADER_ON_SYNTHETIC_LOCAL_LOCKS_NO_INSTALL_OR_REIFY',node:process.version,
  npm:npm.version,identities,passed:results.length,interceptedApiCalls:calls,cases:results,
  limitations:['Virtual lock graph only; not npm ci or native/build/application execution.','API interception is a test guard, not an OS network sandbox.','Local npm version is recorded; the Replit npm version remains an execution-time observation.']};
fs.writeFileSync(new URL('./r16e-npm-workspace-semantics-results.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
