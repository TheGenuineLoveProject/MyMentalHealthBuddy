/** 
 * © 2025 Aaliyah Draws Art LLC. All rights reserved.
 * Unauthorized copying or distribution of this file is prohibited.
 * Built with GPT-4o, MIT/Proprietary license, integrated with evidence-based mental health models.
 */
import { useState } from "react";
import { HealingButton } from "./components/HealingButton";
// Inside JSX:
<HealingButton />
export default function App() {
  const [status, setStatus] = useState("🧘 Click to start healing");

  const triggerHealing = async () => {
    setStatus("🌀 Healing in progress...");
    try {
      const response = await fetch("http://localhost:5000/api/heal", {
        method: "POST",
      });
      const result = await response.json();
      if (result.success) {
        setStatus("✅ Healing complete!");
      } else {
        setStatus("⚠️ Healing failed.");
      }
    } catch (error) {
      setStatus("❌ Error connecting to server.");
    }
  };

  return (
    <div style={{ padding: "3rem", fontFamily: "sans-serif", textAlign: "center" }}>
      <h1>🌿 MyMentalHealthBuddy Healing UI</h1>
      <p>{status}</p>
      <button
        onClick={triggerHealing}
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "1rem 2rem",
          borderRadius: "8px",
          fontSize: "1.2rem",
          border: "none",
          cursor: "pointer",
        }}
      >
        🩺 Start Healing
      </button>
    </div>
  );
}