import { useState } from "react";
import { streamAI } from "../services/aiStream";

export default function AIPage() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!text.trim()) return;
    setResponse("");
    setLoading(true);

    await streamAI(text, null, (chunk) => {
      setResponse((prev) => prev + chunk);
    });

    setLoading(false);
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-green-700">GPT-5 Emotional Buddy 🤖💚</h1>

      <textarea
        className="w-full mt-4 p-3 border rounded h-32"
        placeholder="Tell me what’s on your heart…"
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={sendMessage}
        className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Listening…" : "Send"}
      </button>

      {response && (
        <div className="mt-6 bg-white p-4 shadow rounded whitespace-pre-wrap">
          {response}
        </div>
      )}
    </div>
  );
}