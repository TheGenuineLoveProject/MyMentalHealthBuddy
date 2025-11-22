// --- FINAL-PERFECTED-DashboardPage.jsx --- 8888^ ---
import React, { useEffect, useState } from "react";
import { getToken } from "../App.jsx";

export default function DashboardPage() {
  const [message, setMessage] = useState("Loading dashboard…");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const token = getToken();
        const result = await fetch("/ai-dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await result.json();
        setMessage(JSON.stringify(data, null, 2));
      } catch (e) {
        setMessage("Error loading dashboard.");
      }
    }

    loadDashboard();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Dashboard</h1>
      <pre>{message}</pre>
    </div>
  );
}