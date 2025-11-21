// --- Analytics.jsx --- SAFE 8888^ ---
import React, { useEffect, useState } from "react";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/analytics", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  }, []);

  if (!data) return <h2>Loading Analytics…</h2>;

  return (
    <div style={{ padding: "40px" }}>
      <h1>Analytics Page Loaded ✓</h1>
      <pre
        style={{
          background: "black",
          color: "lime",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}