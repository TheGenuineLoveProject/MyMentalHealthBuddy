// client/src/components/ChatWidget.tsx
// Floating chat widget for quick AI conversations

import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", {
        message,
        conversationHistory: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply,
            timestamp: new Date(),
          },
        ]);
      }
    },
    onError: () => {
      setError("Sorry, I had trouble responding. Please try again.");
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || chatMutation.isPending) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setError(null);
    chatMutation.mutate(trimmed);
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
        aria-label="Chat messages"
        style={{
          flex: 1,
          padding: "1rem",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          background: "#f9fafb",
        }}
      >
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#6b7280", padding: "2rem 0" }}>
            <p style={{ marginBottom: "0.5rem" }}>Hi there! 👋</p>
            <p style={{ fontSize: "0.875rem" }}>
              I&apos;m here to listen and support you. How are you feeling today?
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "0.75rem 1rem",
                borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                background: msg.role === "user" ? "#4f46e5" : "white",
                color: msg.role === "user" ? "white" : "#1f2937",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                fontSize: "0.9rem",
                lineHeight: 1.5,
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {chatMutation.isPending && (
          <div style={{ display: "flex", justifyContent: "flex-start" }} role="status" aria-live="polite">
            <div
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "16px 16px 16px 4px",
                background: "white",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                color: "#6b7280",
                fontSize: "0.9rem",
              }}
            >
              Thinking...
            </div>
          </div>
        )}

        {error && (
          <div style={{ color: "#dc2626", fontSize: "0.875rem", textAlign: "center" }} role="alert">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={sendMessage}
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
          disabled={chatMutation.isPending}
          autoComplete="off"
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
          disabled={chatMutation.isPending || !input.trim()}
          data-testid="button-send-chat"
          aria-label="Send message"
          style={{
            padding: "0.6rem 1rem",
            borderRadius: "24px",
            border: "none",
            background: chatMutation.isPending || !input.trim() ? "#9ca3af" : "#4f46e5",
            color: "white",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: chatMutation.isPending || !input.trim() ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {chatMutation.isPending ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
