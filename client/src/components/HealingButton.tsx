// HealingButton.tsx
import React from "react";

export function HealingButton() {
  const runHeal = async () => {
    const res = await fetch("/api/run-healing", { method: "POST" });
    const json = await res.json();
    alert("✅ Healing Result:\n" + JSON.stringify(json, null, 2));
  };

  return (
    <button
      onClick={runHeal}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
    >
      🌱 Run Platform Healing
    </button>
  );
}