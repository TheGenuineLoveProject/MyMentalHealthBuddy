#!/usr/bin/env node
import fs from 'fs'; import path from 'path';

const exists = p => fs.existsSync(p);
const globs = (dir, exts) => exists(dir) ? fs.readdirSync(dir).filter(f=>exts.some(e=>f.endsWith(e))).map(f=>path.join(dir,f)) : [];

function hasDuplicateToast(){
  const files = (['client/src/components','apps/client/src/components']
    .filter(exists)
    .flatMap(d => globs(d, ['.jsx','.tsx']))
    .filter(f => /toast/i.test(path.basename(f))));
  return {files, duplicates: files.length > 1};
}

function findAnalyticsRoute(){
  const serverDir = exists('apps/server/src') ? 'apps/server/src' : (exists('server') ? 'server' : null);
  if(!serverDir) return {serverDir:null, has:false};
  const routeFiles = globs(path.join(serverDir), ['.ts','.js','.mjs']).filter(f=>/analyt/i.test(f));
  return {serverDir, has: routeFiles.length>0, routeFiles};
}

const toast = hasDuplicateToast();
const analytics = findAnalyticsRoute();

const envTemplate = exists('.env.example') ? fs.readFileSync('.env.example','utf8') : '';
const needsS3 = !/S3_ENDPOINT|S3_BUCKET|S3_ACCESS_KEY|S3_SECRET_KEY/.test(envTemplate);

const findings = [];
if (!analytics.has) findings.push({type:'missing_api', path:'/api/analytics/*', detail:'Add analytics snapshot endpoints'});
if (toast.duplicates) findings.push({type:'duplicate_component', path:'Toast.jsx', detail:'Archive extras; keep one canonical'});
if (needsS3) findings.push({type:'missing_env', keyset:'S3_*', detail:'Add S3 env keys to .env.example'});
if (!exists('scripts/validate-apa.mjs')) findings.push({type:'missing_script', path:'scripts/validate-apa.mjs', detail:'APA evidence validator missing'});

const health = 92 - (findings.length*2);

const plan = [];
if (!analytics.has) plan.push({path:`${analytics.serverDir||'server'}/routes/analytics.mjs`, impact:'add', intent:'analytics snapshots + kpis'});
if (toast.duplicates) plan.push({path:'client/src/components/*Toast*', impact:'archive-duplicates', intent:'keep-first, archive others'});
if (needsS3) plan.push({path:'.env.example', impact:'modify', intent:'append S3 keys'});
if (!exists('scripts/validate-apa.mjs')) plan.push({path:'scripts/validate-apa.mjs', impact:'add', intent:'APA checks'});

const report = {
  consent_required: true,
  consent_token: "PROCEED_MHB_APPLY",
  health_score: Math.max(0, Math.min(100, health)),
  summary: "Repo scanned safely. No writes performed.",
  findings, plan,
  success_criteria: [
    "npm run verify passes",
    "Vite preview appears in Replit Preview",
    "GET /api/analytics/snapshots returns JSON",
    "No duplicate Toast components active"
  ]
};
console.log(JSON.stringify(report,null,2));
