import React from "react";

export default function CanvaPanel() {
  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Canva</h2>
      <p>Connect Canva via /api/canva routes. This panel can host your Canva app UI or link-outs.</p>
      <a href="/api/canva/login">Connect Canva</a>
    </div>
  );
}