import fs from "fs";
const f="package.json",b=".rollback/package.json.bak";
if(fs.existsSync(f)){fs.copyFileSync(f,b);}
const j=JSON.parse(fs.readFileSync(f,"utf-8"));
j.scripts = Object.assign(j.scripts||{},{
  "ai:dashboard":"vite dashboards/ai-dashboard.jsx",
  "compliance":"node scripts/compliance-loop.mjs",
  "publish:daily":"node scripts/publish-daily.mjs",
  "optimize:v12":"node scripts/optimizer.mjs",
  "evolve:master":"bash scripts/evolveMaster.sh"
});
fs.writeFileSync(f,JSON.stringify(j,null,2));
console.log("📦 package.json patched → backup at",b);
