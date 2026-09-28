import fs from 'node:fs'; import path from 'node:path'; import {createHash,randomUUID} from 'node:crypto';
const root="/home/runner/workspace", index="dist/client/dist/index.html", backup="mmhb-shell-checkpoints/monitor-session-stage-qeKEDY/package-backup-S9Y1rF/index.before.html";
const sha=b=>createHash('sha256').update(b).digest('hex');
function safe(f){let p=root;for(const part of f.split('/')){p=path.join(p,part);if(fs.existsSync(p)&&fs.lstatSync(p).isSymbolicLink())throw Error('SYMLINK_REVIEW_REQUIRED');}return p;}
const old=fs.readFileSync(safe(backup)), current=sha(fs.readFileSync(safe(index)));
if(sha(old)!=="19d623a4c10637a987f71b7557052c11faaff6b6a53d17f9ccbbb08f1f6973ac")throw Error('BACKUP_CHANGED');
if(current===sha(old)){console.log('PACKAGE_INDEX_ALREADY_RESTORED');}
else{if(current!=="8ee76908c36cc92e6f2fd70cfc60d9b4ec0c320e94c81b4c7b579637f80f3204")throw Error('INDEX_CHANGED_NOT_OVERWRITTEN');
const temp=safe('dist/client/dist/.mmhb-'+randomUUID()+'.tmp'), previousTime=fs.statSync(safe(index)).mtimeMs;
fs.writeFileSync(temp,old,{flag:'wx',mode:0o644});fs.utimesSync(temp,new Date(),new Date(Math.max(Date.now(),previousTime+1000)));
if(sha(fs.readFileSync(safe(index)))!==current)throw Error('INDEX_CHANGED_NOT_OVERWRITTEN');
fs.renameSync(temp,safe(index));console.log('PACKAGE_INDEX_RESTORED');}
