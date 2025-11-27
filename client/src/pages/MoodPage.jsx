import React, { useState, useEffect } from "react";

export default function MoodPage() {
  const [score, setScore] = useState(5);
  const [note, setNote] = useState("");
  const [items, setItems] = useState([]);

  async function saveMood() {
    const res = await fetch("/api/mood", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, note })
    });

    const data = await res.json();
    loadMood();
    setNote("");
  }

  async function loadMood() {
    const res = await fetch("/api/mood");
    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => {
    loadMood();
  }, []);

  return (
    <div>
      <h1>Mood Tracker</h1>

      <div style={styles.inputContainer}>
        <label>Mood Score (1–10)</label>
        <input
          type="number"
          value={score}
          min={1}
          max={10}
          onChange={(e) => setScore(Number(e.target.value))}
          style={styles.input}
        />

        <label>Note (optional)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={styles.textarea}
        />

        <button style={styles.button} onClick={saveMood}>
          Save Mood
        </button>
      </div>

      <h2>History</h2>
      {items.map((item) => (
        <div key={item.id} style={styles.entry}>
          <strong>Score: {item.score}</strong>
          <p>{item.note}</p>
          <small>{item.createdAt}</small>
        </div>
      ))}
    </div>
  );
}

const styles = {
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px"
  },
  input: {
    padding: "10px",
    fontSize: "16px"
  },
  textarea: {
    padding: "10px",
    fontSize: "16px",
    height: "80px"
  },
  button: {
    padding: "12px 20px",
    background: "#4a90e2",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "16px"
  },
  entry: {
    padding: "10px",
    border: "1px solid #ddd",
    marginBottom: "10px",
    borderRadius: "8px"
  }
};