import React, { useEffect, useState } from "react";

export default function EvidenceDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    fetch("/api/content/evidence")
      .then(r => r.json())
      .then(data => { setPosts(data.posts || []); setLoading(false); });
  }, []);

  async function summarize(post) {
    setSelected(post);
    setSummary("⏳ Generating summary...");
    try {
      const r = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ text: post.excerpt, title: post.title })
      });
      const data = await r.json();
      setSummary(data.summary || "No summary generated.");
    } catch (err) {
      setSummary("⚠️ Error contacting AI summarizer.");
    }
  }

  if (loading) return <div style={{padding:20}}>Loading evidence...</div>;

  return (
    <div style={{padding:20}}>
      <h1>🧩 Evidence Dashboard</h1>
      <p>All articles validated with APA metadata.</p>
      <div style={{display:"grid",gap:16}}>
        {posts.map(p => (
          <div key={p.slug} style={{border:"1px solid #ccc",borderRadius:8,padding:12}}>
            <h2>{p.title}</h2>
            <p><strong>Authors:</strong> {p.authors?.join(", ")}</p>
            <p><em>{p.source} ({p.year})</em></p>
            <button onClick={()=>summarize(p)}>✨ Summarize</button>
          </div>
        ))}
      </div>
      {selected && (
        <div style={{marginTop:24,padding:16,borderTop:"2px solid #444"}}>
          <h2>AI Summary: {selected.title}</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
