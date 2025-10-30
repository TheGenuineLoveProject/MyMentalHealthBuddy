#!/usr/bin/env node
import fs from "fs";
const q="content/social/queue.json";
if(!fs.existsSync(q)){console.log("⚠️ No queue.json");process.exit(0);}
const id=process.argv[2];
if(!id){console.log("Usage: npm run social:approve -- <id>");process.exit(1);}
const data=JSON.parse(fs.readFileSync(q,"utf8"));
const item=data.find(x=>x.id===id);
if(!item){console.log("❓ Not found:",id);process.exit(1);}
item.status="approved"; item.approved_at=new Date().toISOString();
fs.writeFileSync(q,JSON.stringify(data,null,2));
console.log("✅ Approved:",id);
