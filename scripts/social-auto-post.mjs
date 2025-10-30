#!/usr/bin/env node
import fs from "fs"; import path from "path";
const date=new Date().toISOString().slice(0,10);
const sum=`public/analytics/summaries/daily-${date}.json`;
if(!fs.existsSync(sum))process.exit(0);
const {summary}=JSON.parse(fs.readFileSync(sum,"utf8"));
const dir="content/blog/auto-drafts"; fs.mkdirSync(dir,{recursive:true});
const slug=`daily-summary-${date}`;
const post=`---\ntitle: Daily Healing Summary ${date}\nauthor: AI Suite\nstatus: awaiting_approval\nchannels: [blog, social]\ndate: ${date}\n---\n${summary}\n`;
fs.writeFileSync(path.join(dir,`${slug}.md`),post);
console.log("📝 Draft created → content/blog/auto-drafts/"+slug+".md");
