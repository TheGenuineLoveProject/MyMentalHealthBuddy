import { useState } from "react";

type ChatWidgetProps = {
  onClose: () => void;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatWidget({ onClose }: ChatWidgetProps) {
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
      setError("Please log in to chat with your Buddy.");
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

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Sorry, I had trouble responding.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div
      data-testid="chat-widget"
      style={{
        position: "fixed",
        right: "1.5rem",
        bottom: "1.5rem",
        width: "320px",
        maxHeight: "480px",
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 20px 30px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        zIndex: 60,
      }}
    >
      <div
        data-testid="chat-widget-header"
        style={{
          padding: "0.75rem 1rem",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#4f46e5",
          color: "white",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>
            MyMentalHealthBuddy
          </div>
          <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>
            Here to listen, not to judge
          </div>
        </div>
        <button
          onClick={onClose}
          data-testid="button-close-chat"
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            fontSize: "1.1rem",
            cursor: "pointer",
          }}
          aria-label="Close chat"
        >
          ×
        </button>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          padding: "0.75rem 0.75rem 0.5rem",
          overflowY: "auto",
        }}
      >
        {messages.length === 0 && (
          <p style={{ fontSize: "0.85rem", color: "#6b7280" }}>
            Tell me how you’re feeling or what you’d like support with today.
          </p>
        )}

        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "0.5rem",
              textAlign: m.role === "user" ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "0.45rem 0.7rem",
                borderRadius: "999px",
                fontSize: "0.85rem",
                background: m.role === "user" ? "#4f46e5" : "#f3f4f6",
                color: m.role === "user" ? "white" : "#111827",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: "0.4rem 0.75rem",
            fontSize: "0.8rem",
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={sendMessage}
        data-testid="form-chat"
        style={{
          display: "flex",
          padding: "0.5rem 0.6rem 0.6rem",
          borderTop: "1px solid #e5e7eb",
          gap: "0.4rem",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          data-testid="input-chat-message"
          style={{
            flex: 1,
            padding: "0.4rem 0.6rem",
            borderRadius: "999px",
            border: "1px solid #d1d5db",
            fontSize: "0.85rem",
          }}
        />
        <button
          type="submit"
          disabled={isSending}
          data-testid="button-send-chat"
          style={{
            padding: "0.4rem 0.8rem",
            borderRadius: "999px",
            border: "none",
            background: isSending ? "#9ca3af" : "#4f46e5",
            color: "white",
            fontWeight: 600,
            fontSize: "0.85rem",
            cursor: isSending ? "default" : "pointer",
          }}
        >
          {isSending ? "…" : "Send"}
        </button>
      </form>
    </div>
  );
}