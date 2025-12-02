import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Send, Bot, User, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { apiRequest, queryClient } from "../lib/queryClient.js";

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "Hello! I'm your mental wellness companion. I'm here to listen and support you. How are you feeling today?",
};

export default function AIChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  // Load chat history
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["/api/ai/history"],
  });

  // Set messages from history when loaded
  useEffect(() => {
    if (historyData?.messages && historyData.messages.length > 0) {
      setMessages(historyData.messages);
    }
  }, [historyData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clear history mutation
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
      console.error("Chat error:", err);
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-neutral-900 to-neutral-950 text-white">
      <header className="flex items-center gap-4 p-4 border-b border-neutral-800">
        <Link href="/dashboard" className="text-neutral-400 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-blue-400 rounded" data-testid="link-back" aria-label="Back to dashboard">
          <ArrowLeft className="w-6 h-6" aria-hidden="true" />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center" aria-hidden="true">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-semibold" data-testid="text-title">Wellness Companion</h1>
            <p className="text-sm text-neutral-400">Always here to listen</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/crisis"
            className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-900/50 hover:bg-red-900 border border-red-700 text-red-200 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-red-400"
            data-testid="link-crisis"
          >
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Crisis Help</span>
          </Link>
          <button
            onClick={() => clearHistoryMutation.mutate()}
            disabled={clearHistoryMutation.isPending || messages.length <= 1}
            className="p-2 text-neutral-400 hover:text-white transition disabled:opacity-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            data-testid="button-clear-history"
            aria-label="Clear chat history"
            title="Clear chat history"
          >
            <Trash2 className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-label="Chat conversation">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            data-testid={`message-${idx}`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <Bot className="w-5 h-5" />
              </div>
            )}
            <div
              className={`max-w-[80%] p-4 rounded-2xl ${
                message.role === "user"
                  ? "bg-blue-600 rounded-br-md"
                  : "bg-neutral-800 rounded-bl-md"
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0" aria-hidden="true">
                <User className="w-5 h-5" />
              </div>
            )}
          </div>
        ))}

        {chatMutation.isPending && (
          <div className="flex gap-3 justify-start" role="status" aria-live="polite">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-neutral-800 p-4 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                <span className="text-neutral-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="px-4 py-2 bg-red-900/50 border-t border-red-700 text-red-200 text-sm" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={sendMessage} className="p-4 border-t border-neutral-800" aria-label="Send a message">
        <div className="flex gap-3">
          <label htmlFor="chat-input" className="sr-only">Type your message</label>
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={chatMutation.isPending}
            className="flex-1 p-4 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
            data-testid="input-message"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={chatMutation.isPending || !input.trim()}
            className="px-6 rounded-xl bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
            data-testid="button-send"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
        <p className="text-xs text-neutral-500 mt-2 text-center" role="note">
          Remember: This is a supportive companion, not a replacement for professional mental health care.
        </p>
      </form>
    </div>
  );
}
