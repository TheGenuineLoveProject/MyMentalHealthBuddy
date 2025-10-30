#!/usr/bin/env node
import fs from "fs"; import OpenAI from "openai";
const ai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const text = fs.readFileSync(process.argv[2] || "README.md","utf8");
const langs=(process.env.CAPTION_LANGS||"en").split(",").map(s=>s.trim()).filter(Boolean);
const out={};
for(const lang of langs){
  try{
    const r = await ai.chat.completions.create({
      model:"gpt-4o-mini",
      messages:[{role:"user",content:`Summarize this for a social caption (<280 chars), language=${lang}, warm, hopeful, non-clinical:\n${text}`}],
      max_tokens:140, temperature:0.7
    });
    out[lang]=r.choices?.[0]?.message?.content?.trim()||"";
  }catch(e){ out[lang]=""; }
}
console.log(JSON.stringify(out,null,2));
