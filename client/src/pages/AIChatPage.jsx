import React, { useState } from "react";
import { Link } from "wouter";

export default function AIChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages([...messages, { role: "user", text: input }, { role: "ai", text: data.reply }]);

    setInput("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>AI Chat</h1>

      <div style={{ marginBottom: "1rem" }}>
        {messages.map((m, idx) => (
          <div key={idx}>
            <b>{m.role}:</b> {m.text}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Say something..."
        style={{ padding: "0.5rem", width: "300px" }}
      />

      <button
        onClick={sendMessage}
        style={{ marginLeft: "1rem", padding: "0.5rem" }}
      >
        Send
      </button>

      <div style={{ marginTop: "1rem" }}>
        <Link href="/dashboard">Back to Dashboard</Link>
      </div>
    </div>
  );
}