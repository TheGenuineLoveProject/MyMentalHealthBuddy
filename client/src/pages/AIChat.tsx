// ─────────────────────────────────────────────
// FILE: client/src/pages/AIChat.tsx
// Full-page AI chat experience
// ─────────────────────────────────────────────
import React, { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("Please log in to use the AI chat.");
      return;
    }

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed },
    ];

    setMessages(newMessages);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const res = await fetch("/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: trimmed,
          conversationHistory: newMessages,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Sorry, I had trouble responding.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        Talk to MyMentalHealthBuddy
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        This AI is a supportive companion, not a therapist. In a crisis, please
        contact local emergency services or a crisis hotline.
      </p>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "1rem",
          height: "480px",
          display: "flex",
          flexDirection: "column",
          background: "#fafafa",
        }}
      >
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          {messages.length === 0 && (
            <p style={{ color: "#6b7280" }}>
              You can start by telling me how your day has been or what’s on your
              mind.
            </p>
          )}

          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: "0.75rem",
                textAlign: m.role === "user" ? "right" : "left",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "999px",
                  background:
                    m.role === "user" ? "#4f46e5" : "white",
                  color: m.role === "user" ? "white" : "#111827",
                  border:
                    m.role === "user"
                      ? "none"
                      : "1px solid #e5e7eb",
                }}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div
            style={{
              marginBottom: "0.75rem",
              color: "#b91c1c",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={sendMessage} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: "0.6rem 0.75rem",
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              fontSize: "0.95rem",
            }}
          />
          <button
            type="submit"
            disabled={isSending}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: "999px",
              border: "none",
              background: isSending ? "#9ca3af" : "#4f46e5",
              color: "white",
              fontWeight: 600,
              cursor: isSending ? "default" : "pointer",
            }}
          >
            {isSending ? "Sending…" : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}