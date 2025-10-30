#!/usr/bin/env node
import fs from "fs"; import path from "path";
const queueFile="content/social/queue.json";
if(!fs.existsSync(queueFile)){console.log("⚠️ No queue found");process.exit(0);}
const queue=JSON.parse(fs.readFileSync(queueFile,"utf8"));
const published=[]; const remain=[];
for(const q of queue){
  if(q.status==="approved"){
    const src=`content/blog/auto-drafts/${q.id}.md`;
    const dst=`content/blog/published/${q.id}.md`;
    if(fs.existsSync(src)){
      const txt=fs.readFileSync(src,"utf8");
      fs.writeFileSync(dst,txt.replace("status: awaiting_approval","status: published"));
      published.push({id:q.id,lang:q.lang,date:new Date().toISOString()});
      console.log("✅ Published:",q.id);
    }
  } else remain.push(q);
}
fs.writeFileSync(queueFile,JSON.stringify(remain,null,2));
if(published.length)fs.writeFileSync("public/analytics/published.json",JSON.stringify(published,null,2));
console.log("📰 Auto-publish complete");
