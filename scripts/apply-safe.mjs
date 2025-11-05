#!/usr/bin/env node
import fs from 'fs'; import path from 'path';

const CONSENT = process.argv[2] || "";
if (CONSENT !== "PROCEED_MHB_APPLY") {
  console.error("Refused: missing consent token PROCEED_MHB_APPLY");
  process.exit(2);
}
const roll = process.env.ROLL || ".rollback/latest";
fs.mkdirSync(roll, {recursive:true});
const copy = p => { if(fs.existsSync(p)) { const dest=path.join(roll,'copies',p); fs.mkdirSync(path.dirname(dest),{recursive:true}); fs.cpSync(p,dest,{recursive:true}); }};

function ensureDir(p){ fs.mkdirSync(path.dirname(p),{recursive:true}); }
function safeWrite(p, content){ if(!fs.existsSync(p)){ ensureDir(p); fs.writeFileSync(p, content); return "add"; } else { return "skip"; } }
function appendEnvExample(lines){
  const f='.env.example';
  if(!fs.existsSync(f)){ fs.writeFileSync(f, lines.join('\n')+'\n'); return "add"; }
  const raw=fs.readFileSync(f,'utf8');
  const need = lines.filter(l=>!raw.includes(l.split('=')[0]));
  if(need.length){ fs.writeFileSync(f, raw.trimEnd()+'\n'+need.join('\n')+'\n'); return "modify"; }
  return "skip";
}

const touched=[];

//// A) Analytics routes (only if missing)
const serverDir = fs.existsSync('apps/server/src') ? 'apps/server/src' : (fs.existsSync('server') ? 'server' : null);
if(serverDir){
  const routePath = path.join(serverDir,'routes','analytics.mjs');
  if(!fs.existsSync(routePath)){
    copy(serverDir);
    const code = `import { Router } from 'express';
const r = Router();

// Tiny in-memory snapshots (replace with DB reads)
const snapshots = [];
r.get('/snapshots', (req,res)=> res.json(snapshots));
r.post('/snapshots', expressJsonGuard, (req,res)=>{
  const s = { at: Date.now(), ...req.body };
  snapshots.push(s);
  res.status(201).json(s);
});
r.get('/kpis', (req,res)=> res.json({ DAU: 0, ActiveUsers: 0, EngagementScore: 0 }));

function expressJsonGuard(req,res,next){ return next(); } // placeholder for raw-body collisions
export default r;
`;
    fs.mkdirSync(path.dirname(routePath),{recursive:true});
    fs.writeFileSync(routePath, code);
    touched.push({add:routePath});
  }
  // Wire into main server only if not already linked
  const indexCandidates = ['index.mjs','index.js','src/index.mjs','src/index.js'].map(f=>path.join(serverDir,f)).filter(f=>fs.existsSync(f));
  if(indexCandidates.length){
    const idx = indexCandidates[0];
    const raw = fs.readFileSync(idx,'utf8');
    if(!/\/api\/analytics/.test(raw)){
      copy(idx);
      const wired = raw.replace(/(app\.use\([^\)]*\);\s*)$/m, `$1\n// Analytics API\nimport analyticsRouter from './routes/analytics.mjs';\napp.use('/api/analytics', analyticsRouter);\n`);
      fs.writeFileSync(idx, wired);
      touched.push({modify:idx});
    }
  }
}

//// B) APA validator (only if missing)
if(!fs.existsSync('scripts/validate-apa.mjs')){
  const code = `#!/usr/bin/env node
import fs from 'fs'; import path from 'path'; import matter from 'gray-matter';
const dir='content/blog';
const req = ['title','authors','source','year','apa_citation'];
const rows=[];
if(fs.existsSync(dir)){
  for(const f of fs.readdirSync(dir).filter(f=>/\\.mdx?$/.test(f))){
    const raw=fs.readFileSync(path.join(dir,f),'utf8'); const {data}=matter(raw);
    const missing=req.filter(k=>!data[k]);
    rows.push({file:f, valid:missing.length===0, missing});
  }
}
console.table(rows);
const invalid=rows.filter(r=>!r.valid).length;
process.exit(invalid?1:0);
`;
  fs.writeFileSync('scripts/validate-apa.mjs', code); touched.push({add:'scripts/validate-apa.mjs'});
}

//// C) Toast duplicate archive (never delete)
function archiveDuplicates(dir){
  if(!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter(f=>/toast/i.test(f) && /\.(t|j)sx$/.test(f));
  if(files.length<=1) return;
  const keep = files[0];
  for(const f of files.slice(1)){
    const p = path.join(dir,f);
    copy(p);
    fs.renameSync(p, p+`.archived.${Date.now()}`);
    touched.push({archive:p});
  }
}
archiveDuplicates('client/src/components');
archiveDuplicates('apps/client/src/components');

//// D) Env example – append S3 keys if missing
const status = appendEnvExample([
  'S3_ENDPOINT=',
  'S3_REGION=',
  'S3_BUCKET=',
  'S3_ACCESS_KEY=',
  'S3_SECRET_KEY='
]);
if(status!=='skip') touched.push({[status]:'.env.example'});

console.log(JSON.stringify({ok:true, touched}, null, 2));
