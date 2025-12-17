import { ONBOARDING_COPY } from "../copy/onboarding";
import { DISCLAIMERS_COPY } from "../copy/disclaimers";
import React, { useState } from "react";
import { BRAND } from "@shared/brand";

export default function Onboarding() {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("Reduce stress");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/account/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, goal }),
      });
      if (!res.ok) throw new Error("Onboarding failed");
      window.location.href = "/dashboard";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ color: BRAND.colors.primary }}>{BRAND.name}</h1>
      <p>{BRAND.tagline}</p>

      <h2>Welcome 💚</h2>
      <p>Let’s personalize your experience.</p>

      <label>Name</label>
      <input value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: 12 }} />

      <label style={{ display: "block", marginTop: 16 }}>Primary goal</label>
      <select value={goal} onChange={(e) => setGoal(e.target.value)} style={{ width: "100%", padding: 12 }}>
        <option>Reduce stress</option>
        <option>Improve mood</option>
        <option>Build confidence</option>
        <option>Heal from burnout</option>
        <option>Practice self-love</option>
      </select>

      <button onClick={submit} disabled={loading} style={{ marginTop: 20, padding: "12px 18px" }}>
        {loading ? "Saving..." : "Continue"}
      </button>
    </div>
  );
}
