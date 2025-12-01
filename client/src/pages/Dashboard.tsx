import React from "react";
import { Link } from "wouter";

export default function Dashboard() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>

      <p>Your mood history, stats, and latest journal entries will appear here.</p>

      <div style={{ marginTop: "1rem" }}>
        <Link href="/mood">Record New Mood</Link>
      </div>
      <div>
        <Link href="/journal">Write Journal</Link>
      </div>
      <div>
        <Link href="/ai">Open AI Chat</Link>
      </div>
    </div>
  );
}