import React, { useState } from "react";

export default function AIChat() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  async function sendMessage() {
    setOutput("");

    const token = localStorage.getItem("jwt");
    const response = await fetch("/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ message: input }),
    });

    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      setOutput((prev) => prev + text.replace("data:", ""));
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Employee Chat</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Say something..."
      />
      <button onClick={sendMessage}>Send</button>

      <pre>{output}</pre>
    </div>
  );
}