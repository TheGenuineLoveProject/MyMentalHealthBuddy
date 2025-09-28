import React from "react";

export function HealingPanel(){
  const [busy,setBusy]=React.useState(false);
  const [msg,setMsg]=React.useState<string>("Ready");
  const [report,setReport]=React.useState<any>(null);

  async function runHeal(){
    setBusy(true); setMsg("Healing in progress…");
    try{
      const res = await fetch("/api/heal",{ method:"POST" });
      const j = await res.json();
      if(j.ok){ setReport(j.report); setMsg("✅ Healed. See details below."); }
      else { setMsg("❌ Failed. Check console."); console.error(j); }
    } catch(e){ setMsg("❌ Network error."); console.error(e); }
    finally{ setBusy(false); }
  }

  return (
    <section style={{padding:16,border:"1px solid #ddd",borderRadius:12}}>
      <h2>🛠️ Healing Panel</h2>
      <button onClick={runHeal} disabled={busy} style={{padding:"10px 16px",borderRadius:8}}>
        {busy ? "Healing…" : "Run Heal"}
      </button>
      <p aria-live="polite">{msg}</p>
      {report && (
        <pre style={{maxHeight:300,overflow:"auto",background:"#fafafa",padding:12}}>
          {JSON.stringify(report,null,2)}
        </pre>
      )}
    </section>
  );
}