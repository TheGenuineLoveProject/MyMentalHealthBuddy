#!/usr/bin/env node
import fs from "fs"; import path from "path";
const metrics=JSON.parse(fs.readFileSync("public/analytics/metrics.json","utf8"));
const mood=metrics.mood||[]; const compliance=metrics.compliance||[]; const sentiment=metrics.sentiment||[];
const out={labels:mood.map(m=>m.t),mood:mood.map(m=>m.v),compliance, sentiment};
fs.writeFileSync("public/analytics/charts/comparison.json",JSON.stringify(out,null,2));
console.log("📊 comparison chart generated");
