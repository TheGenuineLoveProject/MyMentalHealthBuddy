#!/usr/bin/env node
import fs from "fs"; import path from "path";

const ENSURE = p => { const d = path.dirname(p); if (!fs.existsSync(d)) fs.mkdirSync(d, {recursive:true}); };
const READ = p => fs.existsSync(p) ? fs.readFileSync(p,"utf8") : "";
const OUT_JSON = (p,obj)=>{ ENSURE(p); fs.writeFileSync(p, JSON.stringify(obj,null,2)); };
const OUT_TEXT = (p,txt)=>{ ENSURE(p); fs.writeFileSync(p, txt); };

const METRICS_LOG = "logs/metrics.log";
const COMPLIANCE_LOG = "logs/compliance.log";
const OTHER_LOGS = fs.readdirSync("logs").filter(f=>f.endsWith(".log") && f!=="metrics.log" && f!=="compliance.log");

function parseLine(line){
  // Examples:
  // [2025-10-30T21:23:45.000Z] Health 100/100
  // [2025-10-30T21:23:45.000Z] Compliance OK
  const mTs = line.match(/\[(.*?)\]/); const ts = mTs ? new Date(mTs[1]) : null;
  const mHealth = line.match(/Health\s+(\d{1,3})\/(\d{1,3})/);
  const complianceOK = /Compliance\s+OK/i.test(line);
  const errorFlag = /(CRITICAL|ERROR|FAIL|FATAL)/i.test(line);
  return { ts, health: mHealth? Number(mHealth[1]) : null, complianceOK, errorFlag, raw: line.trim() };
}

function readLines(file){
  try { return READ(file).split(/\r?\n/).filter(Boolean).map(parseLine).filter(r=>r.ts); }
  catch { return []; }
}

// --- derive series (last 14d) ---
const cutoff = Date.now() - 14*24*3600*1000;
const metrics = readLines(METRICS_LOG).filter(r=>r.ts.getTime()>=cutoff);
const compliance = readLines(COMPLIANCE_LOG).filter(r=>r.ts.getTime()>=cutoff);
let others = [];
for(const f of OTHER_LOGS){ others = others.concat(readLines(path.join("logs",f))); }

const series = metrics.map(r=>({ t:r.ts.toISOString(), health:r.health ?? null }));
const lastHealth = series.length ? series.at(-1).health : null;
const avgHealth = series.length ? Math.round(series.reduce((a,b)=>a+(b.health??0),0)/series.length) : null;
const complianceOKCount = compliance.filter(r=>r.complianceOK).length;

// --- goal tracker inputs (fallback if no explicit DAU/session logs exist) ---
// You can point these to your real counters later; we estimate from distinct timestamps per day.
function groupByDay(arr){ return arr.reduce((m,x)=>{ const d=x.t.split("T")[0]; (m[d]=m[d]||[]).push(x); return m; },{}); }
const byDay = groupByDay(series);
const days = Object.keys(byDay).sort();
const publishLog = READ("content/digests/index.json"); // optional external feed
const publishCount14d = (publishLog ? JSON.parse(publishLog) : []).filter(x=>Date.now()-Date.parse(x.date)<14*24*3600*1000).length;

// DAU proxy = number of metric samples per day (replace with true DAU when available)
const dauSeries = days.map(d=>({ d, dau: byDay[d].length }));
const sessionsSeries = dauSeries.map(({d,dau})=>({ d, sessions: Math.max(1, Math.round(dau/2)) })); // proxy
const publishCadence = publishCount14d; // count past 14d

// --- anomalies (scan all logs for the last 24h) ---
const since24h = Date.now() - 24*3600*1000;
const anomalyPool = metrics.concat(compliance).concat(others)
  .filter(r=>r.ts.getTime()>=since24h && (r.errorFlag || (r.health!==null && r.health<80)));
const anomalies = anomalyPool.map(r=>({ t:r.ts.toISOString(), msg:r.raw }));

// --- CSV export (date,health,status,compliance_ok) ---
const csvRows = [["date","health","compliance_ok","note"]];
for(const r of metrics){
  const compOK = compliance.find(c=>Math.abs(c.ts - r.ts) < 10*60*1000)?.complianceOK ? "yes":"";
  csvRows.push([r.ts.toISOString(), r.health??"", compOK, ""]);
}
const CSV = csvRows.map(r=>r.map(x=>String(x).replace(/"/g,'""')).map(x=>`"${x}"`).join(",")).join("\n");

// --- write outputs ---
OUT_JSON("public/analytics/metrics.json", {
  generated_at: new Date().toISOString(),
  lastHealth, avgHealth, complianceOKCount,
  series, dauSeries, sessionsSeries, publishCadence
});
OUT_JSON("public/analytics/anomalies.json", { generated_at: new Date().toISOString(), anomalies });
OUT_TEXT("public/analytics/metrics.csv", CSV);

console.log("📊 analytics -> public/analytics/{metrics.json, anomalies.json, metrics.csv}");
