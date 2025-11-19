import { useState } from "react";
import { askAI } from "../services/ai";

export default function AIPage() {
  const [text, setText] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendToAI() {
    if (!text.trim()) return;
    setLoading(true);

    const reply = await askAI(text);
    setResponse(reply);

    setLoading(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-700">AI Buddy 🤖💚</h1>

      <textarea
        className="w-full mt-4 p-3 border rounded h-32"
        placeholder="Tell me anything…"
        onChange={e => setText(e.target.value)}
      />

      <button
        onClick={sendToAI}
        className="mt-4 bg-green-700 text-white px-4 py-2 rounded"
      >
        {loading ? "Thinking…" : "Ask AI"}
      </button>

      {response && (
        <div className="mt-6 bg-white p-4 shadow rounded">
          <p className="font-semibold">AI says:</p>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}