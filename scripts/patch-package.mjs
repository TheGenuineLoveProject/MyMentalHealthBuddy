import fs from 'fs';
const p='package.json', b='.rollback/package.json.bak';
if(!fs.existsSync(p)) fs.writeFileSync(p, JSON.stringify({name:"mmhb",version:"0.0.0"},null,2));
const raw=fs.readFileSync(p,'utf8'); fs.writeFileSync(b,raw);
const pkg=JSON.parse(raw);
pkg.scripts = Object.assign({
  diagnose:"node scripts/diagnose.mjs",
  heal:"node scripts/heal.mjs",
  verify:"node scripts/verify.mjs",
  optimize:"echo '🔧 optimize placeholder'",
  "start:all":"concurrently -k -n server,client \"npm:server\" \"npm:client\"",
  server:"npm run server:start || echo 'ℹ️ define server:start'",
  client:"npm run client:start || echo 'ℹ️ define client:start'"
}, pkg.scripts||{});
pkg.devDependencies = Object.assign({ concurrently:"^8.2.2", node-cron:"^3.0.3", "@aws-sdk/client-s3":"^3.666.0" }, pkg.devDependencies||{});
fs.writeFileSync(p, JSON.stringify(pkg,null,2));
console.log("📦 package.json safely patched; backup at", b);
