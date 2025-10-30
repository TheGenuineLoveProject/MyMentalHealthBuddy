#!/usr/bin/env node
import fs from "fs"; import OpenAI from "openai";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
const key=process.env.OPENAI_API_KEY; const emailKey=process.env.EMAIL_API_KEY;
const from=process.env.EMAIL_FROM||"noreply@example.com";
const to=process.env.EMAIL_TO||from;

const ai=key?new OpenAI({apiKey:key}):null;
const today=new Date(); const reportDir="public/analytics/reports";
fs.mkdirSync(reportDir,{recursive:true});
const end=today.getTime(), start=end-7*24*3600*1000;
let summaries=[]; try{
  summaries=fs.readdirSync("public/analytics/summaries")
    .filter(f=>f.endsWith(".json"))
    .map(f=>JSON.parse(fs.readFileSync(`public/analytics/summaries/${f}`,"utf8")))
    .filter(s=>new Date(s.date).getTime()>start);
}catch{console.log("⚠️ No summaries yet");}

let insight="Summary unavailable.";
if(ai){
  const prompt=`Summarize key healing trends from this JSON:\n${JSON.stringify(summaries.slice(-14))}`;
  const res=await ai.chat.completions.create({model:"gpt-4o-mini",messages:[{role:"user",content:prompt}],max_tokens:250});
  insight=res.choices?.[0]?.message?.content?.trim()||insight;
}
const pdf=await PDFDocument.create();
const page=pdf.addPage([600,780]);
const font=await pdf.embedFont(StandardFonts.Helvetica);
page.drawText("Weekly Healing Report", {x:50,y:740,size:22,font,color:rgb(0,0.5,0.7)});
page.drawText(`Week ending ${today.toISOString().slice(0,10)}`,{x:50,y:710,size:12,font});
page.drawText(insight,{x:50,y:680,size:11,font,lineHeight:14});
let y=640;for(const s of summaries.slice(-10)){
  const line=`• [${s.lang}] ${s.date}: ${s.summary.slice(0,100)}...`;
  page.drawText(line,{x:50,y,size:10,font}); y-=14;
}
const bytes=await pdf.save();
const out=`${reportDir}/weekly-report-${today.toISOString().slice(0,10)}.pdf`;
fs.writeFileSync(out,bytes);
console.log("📄 Weekly report saved:",out);

if(emailKey){
  const msg=`Subject: Weekly Healing Report\nFrom:${from}\nTo:${to}\n\nAttached: ${out}`;
  fs.writeFileSync(`${reportDir}/last-email.txt`,msg);
  console.log("💌 (stub) Email ready:",`${reportDir}/last-email.txt`);
}
