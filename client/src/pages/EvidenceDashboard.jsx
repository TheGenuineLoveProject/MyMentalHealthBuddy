import React, { useEffect, useState } from "react";

export default function EvidenceDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/api/analytics/snapshots")
      .then(res => res.json())
      .then(json => setData(json.analytics || []))
      .catch(err => console.error("Error:", err));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🧠 Evidence & Analytics Dashboard</h1>
      <p>All validated APA studies and live metrics.</p>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Metric</th>
            <th>Value</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {data.map(d => (
            <tr key={d.id}>
              <td>{d.metric}</td>
              <td>{d.value}</td>
              <td>{new Date(d.timestamp).toLocaleTimeString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
