import React, { useState } from "react";
import { Link } from "wouter";

export default function JournalPage() {
  const [text, setText] = useState("");

  const saveJournal = async () => {
    await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    alert("Journal entry saved!");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Journal</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
        style={{ width: "400px" }}
      />

      <button
        onClick={saveJournal}
        style={{ display: "block", marginTop: "1rem", padding: "0.5rem" }}
      >
        Save
      </button>

      <div style={{ marginTop: "1rem" }}>
        <Link href="/dashboard">Back to Dashboard</Link>
      </div>
    </div>
  );
}