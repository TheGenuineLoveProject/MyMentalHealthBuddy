import fs from "fs";
const f="package.json", b=".rollback/package.json.bak";
if (fs.existsSync(f)) fs.copyFileSync(f,b);
const j = JSON.parse(fs.readFileSync(f,"utf8"));
j.scripts = Object.assign({
  "analytics:build": "node scripts/analytics-build.mjs",
  "analytics:open": "echo 'Open /public/analytics/index.html or /analytics in your client app'"
}, j.scripts||{});
fs.writeFileSync(f, JSON.stringify(j,null,2));
console.log("📝 package.json patched (analytics scripts) → backup at", b);
