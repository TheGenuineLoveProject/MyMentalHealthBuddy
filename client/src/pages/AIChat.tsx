import { useState, useRef, useEffect } from "react";
import { apiPost, ApiError } from "../utils/api";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);
    setError(null);

    try {
      const data = await apiPost<{ reply: string }>("/api/ai/chat", {
        message: trimmed,
        conversationHistory: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      if (data.ok && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
            timestamp: new Date(),
          },
        ]);
      } else {
        throw new Error(data.error || "Failed to get response");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Sorry, I had trouble responding. Please try again.");
      }
    } finally {
      setIsSending(false);
    }
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div data-testid="page-ai-chat" style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1rem" }}>
      <h1
        data-testid="text-chat-title"
        style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem", color: "#1f2937" }}
      >
        Talk to MyMentalHealthBuddy
      </h1>
      <p data-testid="text-chat-disclaimer" style={{ marginBottom: "1.5rem", color: "#6b7280" }}>
        This AI is a supportive companion, not a therapist. In a crisis, please
        contact local emergency services or call 988 (Suicide & Crisis Lifeline).
      </p>

      <div
        data-testid="container-chat"
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "1rem",
          height: "500px",
          display: "flex",
          flexDirection: "column",
          background: "#fafafa",
        }}
      >
        <div
          data-testid="container-messages"
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          {messages.length === 0 && (
            <div
              data-testid="text-chat-prompt"
              style={{
                padding: "2rem",
                textAlign: "center",
                color: "#6b7280",
              }}
            >
              <p style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                Hi there! I'm here to listen.
              </p>
              <p>
                You can start by telling me how your day has been or what's on your mind.
              </p>
            </div>
          )}

          {messages.map((m, idx) => (
            <div
              key={idx}
              data-testid={`message-${m.role}-${idx}`}
              style={{
                marginBottom: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "0.75rem 1rem",
                  borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: m.role === "user" ? "#4f46e5" : "white",
                  color: m.role === "user" ? "white" : "#1f2937",
                  border: m.role === "user" ? "none" : "1px solid #e5e7eb",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              >
                <p style={{ margin: 0, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
                  {m.content}
                </p>
              </div>
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "#9ca3af",
                  marginTop: "0.25rem",
                  paddingLeft: m.role === "assistant" ? "0.5rem" : "0",
                  paddingRight: m.role === "user" ? "0.5rem" : "0",
                }}
              >
                {formatTime(m.timestamp)}
              </span>
            </div>
          ))}

          {isSending && (
            <div
              data-testid="indicator-typing"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "#6b7280",
                fontSize: "0.9rem",
              }}
            >
              <span style={{ animation: "pulse 1.5s infinite" }}>Buddy is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {error && (
          <div
            data-testid="text-chat-error"
            role="alert"
            style={{
              marginBottom: "0.75rem",
              padding: "0.5rem 0.75rem",
              background: "#fef2f2",
              color: "#dc2626",
              fontSize: "0.9rem",
              borderRadius: "8px",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={sendMessage}
          data-testid="form-chat"
          style={{ display: "flex", gap: "0.5rem" }}
        >
          <label htmlFor="chat-input" className="sr-only">
            Type your message
          </label>
          <input
            id="chat-input"
            type="text"
            data-testid="input-chat-message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            maxLength={4000}
            disabled={isSending}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              borderRadius: "24px",
              border: "1px solid #d1d5db",
              fontSize: "0.95rem",
              outline: "none",
            }}
          />
          <button
            type="submit"
            data-testid="button-send-message"
            disabled={isSending || !input.trim()}
            aria-busy={isSending}
            style={{
              padding: "0.75rem 1.25rem",
              borderRadius: "24px",
              border: "none",
              background: isSending || !input.trim() ? "#9ca3af" : "#4f46e5",
              color: "white",
              fontWeight: 600,
              cursor: isSending || !input.trim() ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {isSending ? "..." : "Send"}
          </button>
        </form>
      </div>

      <div
        data-testid="section-crisis-resources"
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "#fef3c7",
          borderRadius: "8px",
          fontSize: "0.9rem",
        }}
      >
        <strong>Crisis Resources:</strong> If you're in crisis, please reach out for help.
        <ul style={{ margin: "0.5rem 0 0 1.5rem", padding: 0 }}>
          <li>National Suicide Prevention Lifeline: <strong>988</strong></li>
          <li>Crisis Text Line: Text <strong>HOME</strong> to <strong>741741</strong></li>
          <li>Emergency: <strong>911</strong></li>
        </ul>
      </div>
    </div>
  );
}
