#!/usr/bin/env node
import fs from 'fs'; import path from 'path'; import matter from 'gray-matter';
const dir='content/blog';
const req = ['title','authors','source','year','apa_citation'];
const rows=[];
if(fs.existsSync(dir)){
  for(const f of fs.readdirSync(dir).filter(f=>/\.mdx?$/.test(f))){
    const raw=fs.readFileSync(path.join(dir,f),'utf8'); const {data}=matter(raw);
    const missing=req.filter(k=>!data[k]);
    rows.push({file:f, valid:missing.length===0, missing});
  }
}
console.table(rows);
const invalid=rows.filter(r=>!r.valid).length;
process.exit(invalid?1:0);
