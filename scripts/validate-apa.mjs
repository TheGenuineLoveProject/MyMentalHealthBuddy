import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
const dir = 'content/blog';
const req = ["title","authors","source","year","apa_citation"];
const rows = [];
if(!fs.existsSync(dir)){ console.log("ℹ️ no content/blog directory"); process.exit(0); }
for(const f of fs.readdirSync(dir).filter(x=>x.endsWith('.md')||x.endsWith('.mdx'))){
  const raw = fs.readFileSync(path.join(dir,f),'utf8');
  const { data } = matter(raw);
  const missing = req.filter(k=>!data[k]);
  rows.push({ file:f, valid: missing.length===0, missing: missing.join(', ')||'—', title: data.title||'(untitled)' });
}
console.log("\n📚 APA Validation Report"); console.table(rows);
const ok = rows.every(r=>r.valid); if(!ok) process.exitCode = 1;
