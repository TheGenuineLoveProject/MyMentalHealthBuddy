import React, { useState } from "react";
import FigmaPanel from "../design/FigmaPanel.jsx";
import CanvaPanel from "../design/CanvaPanel.jsx";

export default function DesignDashboard() {
  const [tab, setTab] = useState("figma");

  return (
    <div>
      <div style={{ display: "flex", gap: 8, padding: 12, borderBottom: "1px solid rgba(0,0,0,.08)" }}>
        <button onClick={() => setTab("figma")}>Figma</button>
        <button onClick={() => setTab("canva")}>Canva</button>
      </div>
      {tab === "figma" ? <FigmaPanel /> : <CanvaPanel />}
    </div>
  );
}