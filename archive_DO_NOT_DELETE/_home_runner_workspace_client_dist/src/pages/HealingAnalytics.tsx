import React, {useEffect, useState} from "react";
type Point = { t: string; health: number };
type Data = { summary: any; series: Point[]; insights: string[] };

export default function HealingAnalytics(){
  const [data,setData]=useState<Data|null>(null);
  useEffect(()=>{ fetch("/analytics/metrics.json",{cache:"no-store"}).then(r=>r.json()).then(setData).catch(()=>setData(null)); },[]);
  return (
    <div style={{padding:24,maxWidth:980,margin:"0 auto",fontFamily:"system-ui,-apple-system,Segoe UI,Roboto,sans-serif"}}>
      <h1>💚 Healing Analytics</h1>
      {!data && <p>Loading…</p>}
      {data && <>
        <section style={{border:"1px solid #eee",borderRadius:12,padding:16,margin:"12px 0"}}>
          <h3>Summary</h3>
          <pre style={{whiteSpace:"pre-wrap"}}>{JSON.stringify(data.summary,null,2)}</pre>
        </section>
        <section style={{border:"1px solid #eee",borderRadius:12,padding:16,margin:"12px 0"}}>
          <h3>Health (last 14 days)</h3>
          <canvas id="healing-chart" height={120}></canvas>
        </section>
        <section style={{border:"1px solid #eee",borderRadius:12,padding:16,margin:"12px 0"}}>
          <h3>Insights</h3>
          <ul>{(data.insights||[]).map((i,idx)=><li key={idx}>{i}</li>)}</ul>
        </section>
      </>}
    </div>
  );
}

// Chart.js injection without bundler plugin
declare global { interface Window { Chart:any } }
function ensureChartScript():Promise<void>{
  return new Promise((res,rej)=>{
    if (window.Chart) return res();
    const s=document.createElement("script");
    s.src="https://cdn.jsdelivr.net/npm/chart.js"; s.onload=()=>res(); s.onerror=()=>rej(); document.head.appendChild(s);
  });
}

function drawChart(points: Point[]){
  const el = document.getElementById("healing-chart") as HTMLCanvasElement | null;
  if(!el || !window.Chart) return;
  const labels = points.map(p=>new Date(p.t).toLocaleString());
  const vals = points.map(p=>p.health);
  // @ts-ignore
  new window.Chart(el, {type:"line", data:{labels, datasets:[{label:"System Health", data:vals, fill:false, tension:.2}]}, options:{scales:{y:{min:0,max:100}}}});
}

if (typeof window!=="undefined"){
  (async()=>{
    await ensureChartScript();
    fetch("/analytics/metrics.json",{cache:"no-store"}).then(r=>r.json()).then((d:Data)=>drawChart(d.series||[])).catch(()=>{});
  })();
}
