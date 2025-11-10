// scripts/canva-final.mjs
// 360° one-paste Canva Bridge: starts backend, runs HTTP bridge, creates HTTPS tunnel (loca.lt),
// auto-handles OAuth + proxy, prints exact URLs for Canva console setup.
// Usage: node --env-file=.env scripts/canva-final.mjs

import 'dotenv/config';
import http from 'node:http';
import net from 'node:net';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import localtunnel from 'localtunnel';

// ---------- CONFIG ----------
const BACKEND_PORT = Number(process.env.PORT || 5173);
const HEALTH_PATH  = process.env.HEALTH_PATH || '/healthz';
const BRIDGE_START = Number(process.env.BRIDGE_START || 5174);
const BRIDGE_END   = Number(process.env.BRIDGE_END   || 5200);
const SUBDOMAIN    = (process.env.LT_SUBDOMAIN || 'genuineloveapi').toLowerCase().replace(/[^a-z0-9-]/g,'');
const CANVA_CLIENT_ID     = process.env.CANVA_CLIENT_ID     || 'genuinelove.dev.client';
const CANVA_CLIENT_SECRET = process.env.CANVA_CLIENT_SECRET || 'genuinelove.dev.secret';
// ---------------------------------------------

const log = (...a) => console.log('[GLP]', ...a);
const sleep = ms => new Promise(r=>setTimeout(r,ms));

async function isPortBusy(port){
  return new Promise(r=>{
    const s = net.connect({host:'127.0.0.1',port},()=>{s.destroy();r(true);});
    s.on('error',()=>r(false));
  });
}

async function waitForHealth(url,timeout=30000){
  const start=Date.now();
  while(Date.now()-start<timeout){
    try{const r=await fetch(url);if(r.ok)return true;}catch{}
    await sleep(500);
  }return false;
}

async function ensureBackend(){
  if(!(await isPortBusy(BACKEND_PORT))){
    const entry = path.join(process.cwd(),'server','index.js');
    if(!fs.existsSync(entry)) throw new Error(`Cannot find backend entry: ${entry}`);
    log('Starting backend on port', BACKEND_PORT);
    spawn(process.execPath, ['--env-file=.env', entry], {
      stdio: 'inherit', env: {...process.env, PORT:String(BACKEND_PORT)}
    });
  }
  log('Waiting for backend...');
  const ok = await waitForHealth(`http://127.0.0.1:${BACKEND_PORT}${HEALTH_PATH}`,35000);
  if(!ok) throw new Error('Backend failed health check.');
  log('✅ Backend healthy.');
}

async function findFreePort(start,end){
  return new Promise((resolve,reject)=>{
    let p=start; const check=()=>{
      if(p>end) return reject(new Error('No free port.'));
      const s=net.createServer();
      s.once('error',()=>{p++;check();});
      s.once('listening',()=>s.close(()=>resolve(p)));
      s.listen(p,'127.0.0.1');
    };check();
  });
}

function loadDevJs(){
  const paths=[
    path.join(process.cwd(),'public','canva-app.js'),
    path.join(process.cwd(),'canva-app.js'),
  ];
  for(const f of paths) if(fs.existsSync(f)) return fs.readFileSync(f);
  return Buffer.from(`// fallback GLP app
export default {name:"Genuine Love Project",pages:[{id:"home",elements:[{type:"TEXT",text:"GLP dev connected ✅"}]}]};`);
}

function parseBody(req){
  return new Promise(resolve=>{
    let buf=[]; req.on('data',c=>buf.push(c)); req.on('end',()=>{
      const raw=Buffer.concat(buf).toString('utf8');
      const ct=(req.headers['content-type']||'').split(';')[0];
      try{
        if(ct==='application/json')return resolve(JSON.parse(raw||'{}'));
        if(ct==='application/x-www-form-urlencoded'){
          const o={};for(const kv of raw.split('&')){const [k,v]=kv.split('=');if(k)o[decodeURIComponent(k)]=decodeURIComponent(v||'');}
          return resolve(o);
        }
      }catch{} resolve({});
    });
  });
}

(async()=>{
  try{
    await ensureBackend();

    const BRIDGE_PORT = await findFreePort(BRIDGE_START,BRIDGE_END);
    const appJS = loadDevJs();

    const server = http.createServer(async(req,res)=>{
      if(req.method==='GET' && req.url==='/canva-app.js'){
        res.writeHead(200,{'content-type':'application/javascript'}); return res.end(appJS);
      }

      if(req.method==='GET' && (req.url==='/'||req.url.startsWith('/authorize'))){
        res.writeHead(200,{'content-type':'text/html'});
        return res.end(`<meta charset=utf-8><div style="font:14px system-ui;padding:16px">
          <b>Genuine Love Project – Canva Auth</b><br>
          Client: ${CANVA_CLIENT_ID}<br>
          <p>Authorized ✔ Close window.</p></div>`);
      }

      if(req.method==='POST' && req.url==='/api/canva/callback'){
        const json = {
          access_token:'glp_dev_token_abc123',
          token_type:'Bearer',
          expires_in:3600,
          refresh_token:'glp_dev_refresh_xyz789',
          scope:'canva:all'
        };
        res.writeHead(200,{'content-type':'application/json'});
        return res.end(JSON.stringify(json));
      }

      if(req.url?.startsWith('/api/')){
        try{
          const target=new URL(`http://127.0.0.1:${BACKEND_PORT}${req.url}`);
          const r=await fetch(target,{method:req.method,body:['GET','HEAD'].includes(req.method)?undefined:req,headers:req.headers});
          res.writeHead(r.status,Object.fromEntries(r.headers));
          if(r.body){const rd=r.body.getReader();while(true){const{done,v}=await rd.read();if(done)break;res.write(v);}}
          return res.end();
        }catch(e){
          res.writeHead(502,{'content-type':'application/json'});
          return res.end(JSON.stringify({ok:false,error:String(e)}));
        }
      }

      res.writeHead(200,{'content-type':'text/html'});
      res.end(`<div style="font:14px system-ui;padding:12px">
        <b>GLP Bridge</b><br>
        Backend: http://localhost:${BACKEND_PORT}${HEALTH_PATH}<br>
        Dev JS: http://localhost:${BRIDGE_PORT}/canva-app.js
      </div>`);
    });

    await new Promise(r=>server.listen(BRIDGE_PORT,'127.0.0.1',r));
    const tunnel = await localtunnel({port:BRIDGE_PORT,subdomain:SUBDOMAIN||undefined});
    const base=tunnel.url;

    const AUTH_URL  = `${base}/`;
    const TOKEN_URL = `${base}/api/canva/callback`;
    const DEV_URL   = `http://localhost:${BRIDGE_PORT}/canva-app.js`;

    console.log('\n========================== COPY THESE INTO CANVA ==========================');
    console.log('Authorization server URL :', AUTH_URL);
    console.log('Token exchange URL       :', TOKEN_URL);
    console.log('Development URL          :', DEV_URL);
    console.log('==========================================================================\n');

    console.log('➡️  Canva → Authentication → Add provider (Custom):');
    console.log('   • Authorization server URL →', AUTH_URL);
    console.log('   • Token exchange URL       →', TOKEN_URL);
    console.log('\n➡️  Canva → Code Upload → Development URL →', DEV_URL);
    console.log('\n✅ Bridge running at', base, '| Local port', BRIDGE_PORT);
    console.log('Close with Ctrl+C.\n');

    const cleanup=async()=>{try{await tunnel.close();}catch{}server.close(()=>process.exit(0));};
    ['SIGINT','SIGTERM'].forEach(s=>process.on(s,cleanup));
  }catch(e){console.error('FATAL:',e);process.exit(1);}
})();