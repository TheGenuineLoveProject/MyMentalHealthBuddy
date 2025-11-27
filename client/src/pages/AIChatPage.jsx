import React, { useState } from "react";

export default function AIChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const res = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();

    const botMsg = {
      sender: "bot",
      text: data.reply || "I’m here with you. 💛"
    };

    setMessages((prev) => [...prev, botMsg]);
    setInput("");
  }

  return (
    <div>
      <h1>AI Chat</h1>

      <div style={styles.chatWindow}>
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              background: m.sender === "user" ? "#d0f0ff" : "#ffe7d1"
            }}
          >
            <strong>{m.sender === "user" ? "You" : "Buddy"}:</strong>{" "}
            {m.text}
          </div>
        ))}
      </div>

      <div style={styles.row}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  chatWindow: {
    height: "300px",
    overflowY: "auto",
    border: "1px solid #ddd",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "10px"
  },
  message: {
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px"
  },
  row: { display: "flex", gap: "10px" },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px"
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "8px",
    background: "#4a90e2",
    color: "white",
    border: "none"
  }
};