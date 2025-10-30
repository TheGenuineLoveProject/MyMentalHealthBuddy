#!/usr/bin/env node
import fs from "fs"; import path from "path"; import OpenAI from "openai";
const apiKey=process.env.OPENAI_API_KEY; const lang=(process.env.LANG||"en").slice(0,2);
const metrics=JSON.parse(fs.readFileSync("public/analytics/metrics.json","utf8"));
const date=new Date().toISOString().slice(0,10); const outDir="public/analytics/summaries";
fs.mkdirSync(outDir,{recursive:true}); const outFile=path.join(outDir,`daily-${date}-${lang}.json`);
let summary=`No key → skipped (${lang})`; if(apiKey){
 const openai=new OpenAI({apiKey});
 const prompt=`Summarize system health + user wellbeing in ${lang} (daily trend). Data:${JSON.stringify(metrics)}`;
 const res=await openai.chat.completions.create({model:"gpt-4o-mini",messages:[{role:"user",content:prompt}],max_tokens:200});
 summary=res.choices?.[0]?.message?.content?.trim()||summary;
}
fs.writeFileSync(outFile,JSON.stringify({date,lang,summary},null,2));
console.log("💬 Multi-Lang summary saved →",outFile);
