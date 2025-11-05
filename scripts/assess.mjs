import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const outDir = "audit";
fs.mkdirSync(outDir,{recursive:true});
const lines = [];
function add(l=""){ lines.push(l); }
function sh(cmd){
  try { return execSync(cmd,{stdio:["ignore","pipe","pipe"]}).toString().trim(); }
  catch(e){ return (e.stderr?.toString()||e.message||"").trim(); }
}
function has(p){ return fs.existsSync(p); }
function readJSON(p){ return JSON.parse(fs.readFileSync(p,"utf8")); }

add("# MyMentalHealthBuddy — 360° Assessment");
add(`_Generated: ${new Date().toISOString()}_`);
add("");

add("## Runtime");
add("- Node: " + sh("node -v || echo missing"));
add("- NPM:  " + sh("npm -v || echo missing"));
add("- Replit Nix: " + (has("replit.nix") ? "present" : "missing"));
add("- .replit: " + (has(".replit") ? "present" : "missing"));
add("");

add("## Repository Layout");
const tree = sh("ls -la || true");
add("```txt\n"+tree+"\n```");

add("## Packages");
const pkgs = [];
for (const file of ["package.json","apps/server/package.json","apps/client/package.json"]) {
  if (has(file)) pkgs.push(file);
}
const apps = has("apps") ? fs.readdirSync("apps").filter(x=>has(path.join("apps",x,"package.json"))) : [];
for (const a of apps) {
  const f = path.join("apps",a,"package.json");
  if (!pkgs.includes(f)) pkgs.push(f);
}
for (const f of pkgs) {
  add(`### ${f}`);
  try {
    const j = readJSON(f);
    add("```json\n"+JSON.stringify(j,null,2)+"\n```");
    const type = j.type || "N/A";
    add(`- type: \`${type}\``);
    if (f.includes("/server/") && type==="module") add("⚠ Server is ESM; consider `commonjs` if using `require()`.");
    if (f.includes("/client/") && type!=="module") add("⚠ Client should be `module` for Vite.");
  } catch(e) {
    add("❌ Invalid JSON: " + e.message);
  }
}
add("");

add("## Dependencies audit (quick)");
if (has("apps/server")) add("### Server\n```\n"+sh("npm --prefix apps/server ls --depth=0 || true")+"\n```");
if (has("apps/client")) add("### Client\n```\n"+sh("npm --prefix apps/client ls --depth=0 || true")+"\n```");

add("## Tailwind/PostCSS");
add("- apps/client/postcss.config.cjs: " + (has("apps/client/postcss.config.cjs")?"present":"missing"));
add("- apps/client/tailwind.config.js: " + (has("apps/client/tailwind.config.js")?"present":"missing"));
add("");

add("## Env / Ports");
add("- PORT expected: 5000 (server) / 5173 (client)");
add("- .env present: " + (has(".env")?"yes":"no"));
add("");

add("## Build / TypeScript quick checks");
if (has("apps/server/tsconfig.json")) add("- Server tsconfig.json present");
if (has("apps/client/tsconfig.json")) add("- Client tsconfig.json present");
add("- tsc version: " + sh("npx tsc -v || echo none"));

add("## Health Checks (best effort)");
add("- curl server /healthz: \n```txt\n"+sh("curl -sS http://localhost:5000/healthz || true")+"\n```");

fs.writeFileSync(path.join(outDir,"report.md"), lines.join("\n") + "\n");
console.log("Assessment written to audit/report.md");
