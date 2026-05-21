import { useState } from "react";

export default function AIChat({ userId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  async function sendMessage(e) {
    e.preventDefault();

    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg = { role: "user", content: trimmed };
    setMessages((m) => [...m, userMsg]);
    setText("");

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          message: trimmed,
        }),
      });

      if (!res.ok) {
        throw new Error(`AI chat request failed: ${res.status}`);
      }

      const data = await res.json();

      const botMsg = {
        role: "assistant",
        content: data.reply || data.message || "I’m here with you.",
      };

      setMessages((m) => [...m, botMsg]);
    } catch (error) {
      console.error("[AIChat] send failed", error);

      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I’m having trouble connecting right now. Please try again in a moment.",
        },
      ]);
    }
  }

  return (
    <div className="chat-box">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.content}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Say something..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}