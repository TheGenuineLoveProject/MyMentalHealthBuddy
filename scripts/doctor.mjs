import fs from "fs"; import { execSync } from "child_process";
const run=(c)=>{ try{return execSync(c,{stdio:["ignore","pipe","pipe"]}).toString().trim();}catch(e){return (e.stderr?.toString()||e.message).trim();} };
const has=(p)=>fs.existsSync(p);
const pj=(p)=>{ try{return JSON.parse(fs.readFileSync(p,"utf8"));}catch(e){return {__invalid:e.message}}; };

const lines=[];
const add=(s="")=>lines.push(s);

add("# MMHB Doctor Summary");
add("Generated: "+new Date().toISOString());
add("\n## Runtime\n- node: "+run("node -v || echo missing")+"\n- npm: "+run("npm -v || echo missing"));
add("\n## Important files\n- replit.nix: "+(has("replit.nix")?"present":"missing")+"\n- .replit: "+(has(".replit")?"present":"missing"));

const files=["package.json"]; if(has("apps")) for(const d of fs.readdirSync("apps")) if(has(`apps/${d}/package.json`)) files.push(`apps/${d}/package.json`);
for(const f of files){ const j=pj(f); add(`\n### ${f}\nname: ${j.name||"?"} | type: ${j.type||"?"}`); if(j.__invalid) add("❌ invalid json: "+j.__invalid); }

add("\n## Probe\nServer /healthz: "+run("curl -sS http://localhost:5000/healthz || echo no-response"));
fs.mkdirSync("audit",{recursive:true});
fs.writeFileSync("audit/doctor-summary.txt", lines.join("\n")+"\n");
fs.writeFileSync("audit/doctor-report.md", lines.join("\n")+"\n");
console.log("Wrote audit/doctor-summary.txt and audit/doctor-report.md");
