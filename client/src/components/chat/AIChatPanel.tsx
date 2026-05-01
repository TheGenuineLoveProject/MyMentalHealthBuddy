import React, { useEffect, useState } from "react";
import { sendAIMessage, getAIHistory, clearAIHistory } from "../../lib/aiChat";
import lumiAvatarUrl from "@assets/mmhb_buddy_interactive_fullbody_1777538625498.png";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getAIHistory();
        if (data?.messages) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  async function handleSend() {
    if (!input.trim() || loading) return;

    const text = input.trim();
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendAIMessage(text);

      const reply =
        data?.response?.reply ||
        data?.reply ||
        data?.message ||
        data?.error ||
        "I'm here, but I couldn't form a reply just now. Please try again, or visit /crisis if you need immediate support.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply }
      ]);
    } catch (err: any) {
      setError(err?.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  }

  async function handleClear() {
    try {
      await clearAIHistory();
      setMessages([]);
    } catch (err: any) {
      setError(err?.message || "Failed to clear history.");
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <nav
        aria-label="Chat navigation"
        className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm"
        data-testid="nav-chat-breadcrumbs"
      >
        <a
          href="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium text-emerald-800 hover:bg-emerald-50 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          data-testid="link-back-dashboard"
        >
          <span aria-hidden="true">←</span>
          <span>Back to Dashboard</span>
        </a>
        <span className="text-gray-300" aria-hidden="true">·</span>
        <a href="/" className="text-gray-600 hover:underline" data-testid="link-chat-home">Home</a>
        <a href="/journal" className="text-gray-600 hover:underline" data-testid="link-chat-journal">Journal</a>
        <a href="/mood" className="text-gray-600 hover:underline" data-testid="link-chat-mood">Mood</a>
        <a
          href="/crisis"
          className="ml-auto inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 font-semibold text-rose-700 hover:bg-rose-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          data-testid="link-chat-crisis"
        >
          Crisis Support
        </a>
      </nav>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">AI Companion</h1>
        <button
          onClick={handleClear}
          className="rounded-md border px-3 py-2 text-sm"
          type="button"
        >
          Clear history
        </button>
      </div>

      <div className="mb-4 rounded-xl border p-4 text-sm text-gray-600">
        For reflection support, not clinical care. If you may be in immediate danger,
        call or text 988 now.
      </div>

      <div className="mb-4 min-h-[420px] rounded-xl border p-4">
        <div className="space-y-3">
          {messages.map((m, i) => (
            <div
              key={`${m.role}-${i}`}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "assistant" && (
                <img
                  src={lumiAvatarUrl}
                  alt=""
                  width={32}
                  height={32}
                  aria-hidden="true"
                  draggable={false}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  style={{ width: 32, height: 32, objectFit: "contain", flexShrink: 0, alignSelf: "flex-start" }}
                />
              )}
              <div
                className={`rounded-xl p-3 max-w-[85%] ${
                  m.role === "user"
                    ? "bg-blue-50 text-blue-900"
                    : "bg-gray-50 text-gray-900"
                }`}
              >
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide">
                  {m.role === "user" ? "You" : "Companion"}
                </div>
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <img
                src={lumiAvatarUrl}
                alt=""
                width={32}
                height={32}
                aria-hidden="true"
                draggable={false}
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                className="lumi-breathe"
                style={{ width: 32, height: 32, objectFit: "contain", flexShrink: 0, alignSelf: "flex-start" }}
              />
              <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-500">
                Companion is thinking...
              </div>
            </div>
          )}
        </div>
      </div>

      {error ? (
        <div className="mb-3 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="flex gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What feels most present right now?"
          className="min-h-[96px] flex-1 rounded-xl border p-3"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="rounded-xl bg-black px-5 py-3 text-white disabled:opacity-50"
          type="button"
        >
          Send
        </button>
      </div>
    </div>
  );
}
