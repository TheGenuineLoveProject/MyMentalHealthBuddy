#!/usr/bin/env node
import fs from "fs"; import OpenAI from "openai";
const key=process.env.OPENAI_API_KEY;
if(!key){console.log("⚠️ No OPENAI_API_KEY");process.exit(0);}
const ai=new OpenAI({apiKey:key});
const metrics=JSON.parse(fs.readFileSync("public/analytics/metrics.json","utf8"));
const recent=metrics.series?.slice(-7)||[];
const prompt=`Predict tomorrow's trend for mood, compliance, and AI sentiment based on this 7-day JSON:\n${JSON.stringify(recent)}`;
const res=await ai.chat.completions.create({model:"gpt-4o-mini",messages:[{role:"user",content:prompt}],max_tokens:200});
const prediction=res.choices?.[0]?.message?.content?.trim()||"{}";
fs.writeFileSync("public/analytics/predictions/tomorrow.json",prediction);
console.log("📈 Prediction saved → public/analytics/predictions/tomorrow.json");
