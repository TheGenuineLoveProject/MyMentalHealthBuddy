#!/usr/bin/env node
import fs from "fs"; import OpenAI from "openai";
const key=process.env.OPENAI_API_KEY; if(!key){console.log("⚠️ No OPENAI_API_KEY");process.exit(0);}
const ai=new OpenAI({apiKey:key});
const LANGS=["es","fr","pt","ko","de","ja"];
const date=new Date().toISOString().slice(0,10);
const src=`public/analytics/summaries/daily-${date}-en.json`;
if(!fs.existsSync(src)){console.log("⚠️ No English summary yet");process.exit(0);}
const base=JSON.parse(fs.readFileSync(src,"utf8")).summary;
for(const lang of LANGS){
  const res=await ai.chat.completions.create({
    model:"gpt-4o-mini",
    messages:[{role:"user",content:`Translate the following healing summary to ${lang}: ${base}`}],
    max_tokens:300});
  const translated=res.choices?.[0]?.message?.content?.trim()||base;
  const out=`public/analytics/summaries/daily-${date}-${lang}.json`;
  fs.writeFileSync(out,JSON.stringify({date,lang,summary:translated},null,2));
  console.log("🌐 translated →",out);
}
console.log("✅ nightly translation complete");
