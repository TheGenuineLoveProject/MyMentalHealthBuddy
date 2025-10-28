import fs from "fs";
const cfg = JSON.parse(fs.readFileSync(".mmhb.config.json","utf8"));
const fetch = globalThis.fetch ?? (await import("node-fetch")).default;
async function chk(name,url){
  try{ const r=await fetch(url,{redirect:"manual"});
       const ok=(r.status>=200 && r.status<400);
       console.log(`[${name}] ${url} -> ${r.status} ${ok?"OK":"CHECK"}`); return ok;
  }catch(e){ console.log(`[${name}] FAIL ${e?.message}`); return false; }
}
const pass = (await Promise.all([chk("backend",cfg.backendURL), chk("frontend",cfg.frontendURL)])).every(Boolean);
fs.appendFileSync("logs/build-ledger.ndjson", JSON.stringify({ts:new Date().toISOString(), verify:pass})+"\\n");
if(!pass) process.exitCode=1;
