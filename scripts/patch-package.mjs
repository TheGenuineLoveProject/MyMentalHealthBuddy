import fs from 'fs';
const path = 'package.json';
const backup = '.rollback/package.json.bak';
if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({name:"mmhb",version:"0.0.0"},null,2));
const raw = fs.readFileSync(path,'utf-8'); fs.writeFileSync(backup, raw);
const pkg = JSON.parse(raw);
pkg.scripts = Object.assign({
  diagnose: "node scripts/diagnose.mjs",
  heal: "node scripts/heal.mjs",
  verify: "node scripts/verify.mjs",
  optimize: "echo '🔧 optimize: stub' && exit 0",
  "start:all": "concurrently -k -n server,client \"npm:server\" \"npm:client\"",
  server: "npm run server:start || echo 'ℹ️ Define server:start to launch your API'",
  client: "npm run client:start || echo 'ℹ️ Define client:start to launch your web app'"
}, pkg.scripts || {});
pkg.devDependencies = Object.assign({ concurrently: "^8.2.2" }, pkg.devDependencies || {});
fs.writeFileSync(path, JSON.stringify(pkg, null, 2));
console.log("📦 package.json patched safely → backup at", backup);
