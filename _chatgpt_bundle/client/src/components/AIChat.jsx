import { useState } from "react";
import axios from "axios";

export default function AIChat({ userId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  async function sendMessage(e) {
    e.preventDefault();

    const token = localStorage.getItem("token"); // your JWT

    const res = await axios.post(
      "/api/ai/chat",
      { userId, message: text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
    const userMsg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);

    const res = await axios.post("/api/ai/chat", {
      userId,
      message: text,
    });

    const botMsg = { role: "assistant", content: res.data.reply };
    setMessages((m) => [...m, botMsg]);

    setText("");
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