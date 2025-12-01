// client/src/pages/Dashboard.jsx

import React from "react";
import { useQuery } from "@tanstack/react-query";

async function fetchAnalyticsSummary() {
  const res = await fetch("/api/analytics/summary");
  if (!res.ok) throw new Error("Failed to load analytics");
  return res.json();
}

  export default function Dashboard() {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Welcome back! Here is your overview.</p>
      </div>
    );
  }

  if (isLoading) return <p>Loading…</p>;
  if (isError) return <p>Error: {error.message}</p>;

  const summary = data || {};

  return (
    <main style={{ padding: "1.2rem" }}>
      <h1>Dashboard</h1>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          marginTop: "1rem",
        }}
      >
        <div style={boxStyle}>
          <h2>Moods Logged</h2>
          <p style={valueStyle}>{summary.totalMoods ?? 0}</p>
        </div>

        <div style={boxStyle}>
          <h2>Journal Entries</h2>
          <p style={valueStyle}>{summary.totalJournals ?? 0}</p>
        </div>

        <div style={boxStyle}>
          <h2>Avg Mood</h2>
          <p style={valueStyle}>{summary.averageRating ?? "—"}</p>
        </div>

        <div style={boxStyle}>
          <h2>Streak</h2>
          <p style={valueStyle}>{summary.streakDays ?? 0} days</p>
        </div>
      </div>
    </main>
  );
}

const boxStyle = {
  padding: "1rem",
  border: "1px solid #ddd",
  borderRadius: "0.5rem",
};

const valueStyle = {
  fontSize: "1.8rem",
  fontWeight: "bold",
};