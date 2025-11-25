import { useState, useRef, useEffect } from "react";
import { apiPost, ApiError } from "../utils/api";
import { MessageCircle, Send, AlertTriangle, Phone, Heart, Sparkles } from "lucide-react";

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

  const suggestions = [
    "I'm feeling stressed today",
    "Can we talk about anxiety?",
    "I need help relaxing",
    "I'm having a hard day",
  ];

  return (
    <div 
      data-testid="page-ai-chat" 
      className="min-h-screen flex flex-col"
      style={{ background: "var(--background)" }}
    >
      <div 
        className="py-8 px-6 animate-fade-in"
        style={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          borderRadius: "0 0 2rem 2rem"
        }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 
                data-testid="text-chat-title"
                className="text-2xl font-bold text-white"
              >
                Chat with Your Buddy
              </h1>
              <p className="text-white/80 text-sm">
                I'm here to listen and support you
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 flex flex-col">
        <div
          data-testid="container-chat"
          className="card flex-1 flex flex-col overflow-hidden animate-fade-in"
          style={{ minHeight: "450px" }}
        >
          <div
            data-testid="container-messages"
            className="flex-1 overflow-y-auto p-4"
            style={{ background: "var(--background)" }}
          >
            {messages.length === 0 && (
              <div
                data-testid="text-chat-prompt"
                className="text-center py-8"
              >
                <div 
                  className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center animate-float"
                  style={{ 
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    boxShadow: "0 8px 30px rgba(102, 126, 234, 0.3)"
                  }}
                >
                  <Heart className="w-10 h-10 text-white" />
                </div>
                <h3 
                  className="text-xl font-semibold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Welcome! I'm here to listen
                </h3>
                <p 
                  className="mb-6"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Share what's on your mind, or try one of these starters:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      data-testid={`button-suggestion-${index}`}
                      onClick={() => setInput(suggestion)}
                      className="px-4 py-2 rounded-full text-sm transition-all hover:scale-105"
                      style={{ 
                        background: "var(--primary-light)",
                        color: "var(--primary)",
                        border: "1px solid var(--primary)"
                      }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, idx) => (
              <div
                key={idx}
                data-testid={`message-${m.role}-${idx}`}
                className="mb-4 flex flex-col animate-fade-in"
                style={{
                  alignItems: m.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div className="flex items-end gap-2" style={{ maxWidth: "85%" }}>
                  {m.role === "assistant" && (
                    <div 
                      className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                    >
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className="px-4 py-3 rounded-2xl"
                    style={{
                      background: m.role === "user" 
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                        : "var(--card-bg)",
                      color: m.role === "user" ? "white" : "var(--text-primary)",
                      borderRadius: m.role === "user" 
                        ? "20px 20px 4px 20px" 
                        : "20px 20px 20px 4px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {m.content}
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs mt-1 px-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {formatTime(m.timestamp)}
                </span>
              </div>
            ))}

            {isSending && (
              <div
                data-testid="indicator-typing"
                className="flex items-center gap-3 animate-fade-in"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div 
                  className="px-4 py-3 rounded-2xl"
                  style={{ background: "var(--card-bg)" }}
                >
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div
              data-testid="text-chat-error"
              role="alert"
              className="mx-4 mb-3 p-3 rounded-xl flex items-center gap-2 animate-fade-in"
              style={{ background: "#fef2f2", color: "#dc2626" }}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form
            onSubmit={sendMessage}
            data-testid="form-chat"
            className="p-4 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex gap-3">
              <label htmlFor="chat-input" className="sr-only">
                Type your message
              </label>
              <input
                id="chat-input"
                type="text"
                data-testid="input-chat-message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share what's on your mind..."
                maxLength={4000}
                disabled={isSending}
                className="flex-1 px-5 py-3 rounded-full border-2 transition-all focus:outline-none"
                style={{ 
                  background: "var(--background)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)"
                }}
              />
              <button
                type="submit"
                data-testid="button-send-message"
                disabled={isSending || !input.trim()}
                aria-busy={isSending}
                aria-label="Send message"
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-50"
                style={{
                  background: isSending || !input.trim() 
                    ? "var(--text-muted)" 
                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  cursor: isSending || !input.trim() ? "not-allowed" : "pointer",
                }}
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </form>
        </div>

        <div
          data-testid="section-crisis-resources"
          className="mt-6 p-5 rounded-xl animate-fade-in"
          style={{
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            border: "1px solid #fbbf24",
          }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(234, 179, 8, 0.3)" }}
            >
              <Phone className="w-5 h-5" style={{ color: "#92400e" }} />
            </div>
            <div>
              <h3 className="font-semibold mb-2" style={{ color: "#92400e" }}>
                Crisis Resources
              </h3>
              <p className="text-sm mb-3" style={{ color: "#a16207" }}>
                If you're in crisis, please reach out for immediate help:
              </p>
              <ul className="text-sm space-y-1" style={{ color: "#92400e" }}>
                <li><strong>988</strong> — Suicide & Crisis Lifeline (call or text)</li>
                <li><strong>741741</strong> — Crisis Text Line (text HOME)</li>
                <li><strong>911</strong> — Emergency Services</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
