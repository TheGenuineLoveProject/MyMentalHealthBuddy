import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Send, Bot, User, Loader2, Trash2, AlertTriangle, Sparkles, Heart } from "lucide-react";
import { apiRequest, queryClient } from "../lib/queryClient.js";
import SEO from "../components/SEO";

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "Hello! I'm your mental wellness companion. I'm here to listen and support you without judgment. How are you feeling today?",
};

export default function AIChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["/api/ai/history"],
  });

  useEffect(() => {
    if (historyData?.messages && historyData.messages.length > 0) {
      setMessages(historyData.messages);
    }
  }, [historyData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearHistoryMutation = useMutation({
    mutationFn: () => apiRequest("DELETE", "/api/ai/history"),
    onSuccess: () => {
      setMessages([INITIAL_MESSAGE]);
      queryClient.invalidateQueries({ queryKey: ["/api/ai/history"] });
    },
  });

  const chatMutation = useMutation({
    mutationFn: (message) => apiRequest("POST", "/api/ai/chat", { message }),
    onSuccess: (data) => {
      if (data?.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "I'm having trouble responding right now. Please try again in a moment." },
        ]);
      }
    },
    onError: (err) => {
      setError(err.message || "Failed to send message");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "I'm sorry, I couldn't process your message. Please try again." },
      ]);
    },
  });

  function sendMessage(e) {
    e?.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage = input.trim();
    setInput("");
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    chatMutation.mutate(userMessage);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      <SEO 
        title="AI Chat"
        description="Chat with your AI wellness companion. Get compassionate support and guidance for your mental health journey."
      />
      <div className="min-h-screen flex flex-col bg-gradient-mesh">
        {/* Header */}
        <header className="flex items-center gap-4 p-4 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl sticky top-0 z-10">
          <Link 
            href="/dashboard" 
            className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:border-[var(--primary-light)] transition shadow-sm" 
            data-testid="link-back" 
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          </Link>
          
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--accent-teal)] to-teal-600 flex items-center justify-center shadow-lg" aria-hidden="true">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-semibold flex items-center gap-2" data-testid="text-title">
                Wellness Companion
                <Sparkles className="w-4 h-4 text-[var(--primary)]" aria-hidden="true" />
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">Always here to listen</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Link
              href="/crisis"
              className="flex items-center gap-1.5 px-4 py-2 text-sm bg-[var(--accent-rose-soft)] hover:bg-[var(--accent-rose)]/20 border border-[var(--accent-rose)]/30 text-[var(--accent-rose)] rounded-xl transition font-medium"
              data-testid="link-crisis"
            >
              <AlertTriangle className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Crisis Help</span>
            </Link>
            <button
              onClick={() => clearHistoryMutation.mutate()}
              disabled={clearHistoryMutation.isPending || messages.length <= 1}
              className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent-rose)] hover:border-[var(--accent-rose)]/50 transition disabled:opacity-40"
              data-testid="button-clear-history"
              aria-label="Clear chat history"
              title="Clear chat history"
            >
              <Trash2 className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-label="Chat conversation">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
              style={{ animationDelay: `${idx * 0.05}s` }}
              data-testid={`message-${idx}`}
            >
              {message.role === "assistant" && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-teal)] to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md" aria-hidden="true">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div
                className={`chat-bubble ${
                  message.role === "user"
                    ? "chat-bubble-user shadow-lg"
                    : "chat-bubble-assistant shadow-sm"
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md" aria-hidden="true">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {chatMutation.isPending && (
            <div className="flex gap-3 justify-start animate-fade-in-up" role="status" aria-live="polite">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-teal)] to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md" aria-hidden="true">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="chat-bubble chat-bubble-assistant">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                  <span className="text-[var(--text-muted)]">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 py-3 bg-[var(--accent-rose-soft)] border-t border-[var(--accent-rose)]/30 text-[var(--accent-rose)] text-sm flex items-center gap-2" role="alert">
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            {error}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={sendMessage} className="p-4 border-t border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl" aria-label="Send a message">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <label htmlFor="chat-input" className="sr-only">Type your message</label>
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={chatMutation.isPending}
              className="input-lg flex-1"
              data-testid="input-message"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={chatMutation.isPending || !input.trim()}
              className="btn btn-gradient px-6"
              data-testid="button-send"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-3 text-center flex items-center justify-center gap-1.5" role="note">
            <Heart className="w-3 h-3" aria-hidden="true" />
            This is a supportive companion, not a replacement for professional mental health care.
          </p>
        </form>
      </div>
    </>
  );
}
