#!/usr/bin/env node
import fs from "fs"; import path from "path";
const langs=["en","es","fr","pt","ko","de","ja"];
const date=new Date().toISOString().slice(0,10);
const queueFile="content/social/queue.json";
const queue=fs.existsSync(queueFile)?JSON.parse(fs.readFileSync(queueFile,"utf8")):[];
for(const lang of langs){
  const f=`public/analytics/summaries/daily-${date}-${lang}.json`;
  if(!fs.existsSync(f)) continue;
  const {summary}=JSON.parse(fs.readFileSync(f,"utf8"));
  const slug=`summary-${date}-${lang}`;
  const postPath=`content/blog/auto-drafts/${slug}.md`;
  const fm=`---\ntitle: Daily Healing Summary ${date} (${lang})\nstatus: awaiting_approval\nlang: ${lang}\nchannels: [blog,social]\ndate: ${date}\n---\n${summary}\n`;
  fs.writeFileSync(postPath,fm);
  queue.push({id:slug,lang,status:"awaiting_approval",scheduled_at:null});
  console.log("📝 Draft synced:",postPath);
}
fs.writeFileSync(queueFile,JSON.stringify(queue,null,2));
console.log("💾 Auto-sync complete →",queueFile);
