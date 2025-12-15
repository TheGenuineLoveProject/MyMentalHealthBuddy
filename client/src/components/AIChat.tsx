import { useState } from "react";
import { aiChat } from "../lib/api";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");

  async function send() {
    const res = await aiChat(
      "00000000-0000-0000-0000-000000000001",
      message
    );
    setReply(res.reply);
  }

  return (
    <div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={send}>Send</button>
      <p>{reply}</p>
    </div>
  );
}