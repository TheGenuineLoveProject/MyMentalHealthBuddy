#!/usr/bin/env node
import fs from "fs"; import path from "path"; import OpenAI from "openai";
const key=process.env.TTS_API_KEY,lang=(process.env.LANG||"en").slice(0,2);
const date=new Date().toISOString().slice(0,10);
const file=`public/analytics/summaries/daily-${date}-${lang}.json`;
if(!fs.existsSync(file)){console.error("⚠️ No summary file");process.exit(0);}
const {summary}=JSON.parse(fs.readFileSync(file,"utf8"));
const voices={en:"alloy",es:"luna",fr:"ambre",ko:"seoyeon",pt:"cora"}; const voice=voices[lang]||"alloy";
if(!key){console.log("🔇 No TTS key");process.exit(0);}
const ai=new OpenAI({apiKey:key});
const out=`public/analytics/audio/daily-${date}-${lang}.mp3`;
const speech=await ai.audio.speech.create({model:"gpt-4o-mini-tts",voice,input:summary});
fs.writeFileSync(out,Buffer.from(await speech.arrayBuffer()));
console.log("🔊 Audio created →",out);
