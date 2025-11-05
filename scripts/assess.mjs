import fs from "fs";
import { execSync } from "child_process";
const out = [];
function add(s=""){ out.push(s); }
function sh(c){ try{ return execSync(c,{stdio:["ignore","pipe","pipe"]}).toString().trim(); }catch(e){ return (e.stderr?.toString()||e.message||"").trim(); } }
function has(p){ return fs.existsSync(p); }
function pj(p){ try{ return JSON.parse(fs.readFileSync(p,"utf8")); }catch(e){ return {__invalid:e.message}; } }

add("# MMHB 360° Assessment");
add(`Generated: ${new Date().toISOString()}`);
add("\n## Runtime");
add("- node: "+sh("node -v || echo missing"));
add("- npm:  "+sh("npm -v || echo missing"));
add("- replit.nix: "+(has("replit.nix")?"present":"missing"));
add("- .replit: "+(has(".replit")?"present":"missing"));

add("\n## Packages");
const files = ["package.json"];
if (has("apps")) for (const d of fs.readdirSync("apps")) if (has(`apps/${d}/package.json`)) files.push(`apps/${d}/package.json`);
for (const f of files){
  const j = pj(f);
  add(`### ${f}`);
  add("```json\n"+JSON.stringify(j,null,2)+"\n```");
  if (j.__invalid) add("❌ invalid json: "+j.__invalid);
}
add("\n## Tailwind/PostCSS");
add("- client/tailwind.config.js: "+(has("apps/client/tailwind.config.js")?"present":"missing"));
add("- client/postcss.config.cjs: "+(has("apps/client/postcss.config.cjs")?"present":"missing"));

add("\n## Quick dep trees");
if (has("apps/server")) add("### server\n```\n"+sh("npm --prefix apps/server ls --depth=0 || true")+"\n```");
if (has("apps/client")) add("### client\n```\n"+sh("npm --prefix apps/client ls --depth=0 || true")+"\n```");

add("\n## Health probe");
add("```txt\n"+sh("curl -sS http://localhost:5000/healthz || echo no-response")+"\n```");

fs.mkdirSync("audit",{recursive:true});
fs.writeFileSync("audit/report.md", out.join("\n")+"\n");
console.log("audit/report.md written");
