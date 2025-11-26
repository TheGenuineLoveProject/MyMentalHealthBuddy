import { useState, useRef, useEffect } from "react";
import { apiPost, ApiError, isAuthenticated } from "../utils/api";

type ChatWidgetProps = {
  onClose: () => void;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export default function ChatWidget({ onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

  return (
    <div
      data-testid="chat-widget"
      role="dialog"
      aria-label="Chat with AI Buddy"
      aria-modal="true"
      style={{
        position: "fixed",
        right: "1.5rem",
        bottom: "1.5rem",
        width: "340px",
        maxHeight: "500px",
        background: "white",
        borderRadius: "16px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        zIndex: 60,
        overflow: "hidden",
      }}
    >
      <header
        data-testid="chat-widget-header"
        style={{
          padding: "1rem",
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: "1rem" }}>
            MyMentalHealthBuddy
          </div>
          <div style={{ fontSize: "0.75rem", opacity: 0.9 }}>
            Here to listen, not to judge
          </div>
        </div>
        <button
          onClick={onClose}
          data-testid="button-close-chat"
          type="button"
          aria-label="Close chat"
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            color: "white",
            fontSize: "1.25rem",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 0.2s",
          }}
        >
          ×
        </button>
      </header>

      <div
        data-testid="chat-messages"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
        style={{
          flex: 1,
          padding: "1rem",
          overflowY: "auto",
          background: "#fafafa",
        }}
      >
        {messages.length === 0 && (
          <div
            data-testid="chat-welcome"
            style={{
              textAlign: "center",
              padding: "1rem",
              color: "#6b7280",
            }}
          >
            <p style={{ fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              Hi there! I'm here to listen.
            </p>
            <p style={{ fontSize: "0.85rem" }}>
              Tell me how you're feeling or what you'd like support with today.
            </p>
          </div>
        )}

        {messages.map((m, idx) => (
          <div
            key={idx}
            data-testid={`message-${m.role}-${idx}`}
            style={{
              marginBottom: "0.75rem",
              display: "flex",
              flexDirection: "column",
              alignItems: m.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "0.6rem 0.9rem",
                borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                fontSize: "0.9rem",
                lineHeight: 1.5,
                background: m.role === "user" ? "#4f46e5" : "white",
                color: m.role === "user" ? "white" : "#1f2937",
                boxShadow: m.role === "assistant" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isSending && (
          <div
            data-testid="typing-indicator"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
              padding: "0.5rem",
              color: "#6b7280",
              fontSize: "0.85rem",
            }}
          >
            <span>Buddy is typing</span>
            <span style={{ animation: "pulse 1s infinite" }}>...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div
          data-testid="chat-error"
          role="alert"
          style={{
            padding: "0.5rem 1rem",
            fontSize: "0.85rem",
            color: "#dc2626",
            background: "#fef2f2",
            borderTop: "1px solid #fecaca",
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
          padding: "0.75rem",
          borderTop: "1px solid #e5e7eb",
          gap: "0.5rem",
          background: "white",
        }}
      >
        <label htmlFor="chat-widget-input" className="sr-only">
          Type your message
        </label>
        <input
          id="chat-widget-input"
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          data-testid="input-chat-message"
          maxLength={2000}
          disabled={isSending}
          style={{
            flex: 1,
            padding: "0.6rem 1rem",
            borderRadius: "24px",
            border: "1px solid #d1d5db",
            fontSize: "0.9rem",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={isSending || !input.trim()}
          data-testid="button-send-chat"
          aria-label="Send message"
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "24px",
            border: "none",
            background: isSending || !input.trim() ? "#9ca3af" : "#4f46e5",
            color: "white",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: isSending || !input.trim() ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {isSending ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
