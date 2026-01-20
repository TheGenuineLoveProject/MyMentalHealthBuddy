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
      className="fixed right-6 bottom-6 w-[340px] max-h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-60 overflow-hidden"
    >
      <header
        data-testid="chat-widget-header"
        className="p-4 bg-gradient-to-r from-sage-500 to-teal text-white flex justify-between items-center"
      >
        <div>
          <div className="font-bold text-base">
            Genuine Love
          </div>
          <div className="text-xs opacity-90">
            Live in Genuine Love
          </div>
        </div>
        <button
          onClick={onClose}
          data-testid="button-close-chat"
          type="button"
          aria-label="Close chat"
          className="bg-white/20 border-none text-white text-xl w-8 h-8 rounded-full cursor-pointer flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          ×
        </button>
      </header>

      <div
        data-testid="chat-messages"
        aria-label="Chat messages"
        className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-sage-50"
      >
        {messages.length === 0 && (
          <div className="text-center text-sage-400 py-8">
            <p className="mb-2">Hi there! 👋</p>
            <p className="text-sm">
              I&apos;m here to listen and support you. How are you feeling today?
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 shadow-sm text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-sage-600 text-white rounded-2xl rounded-br-sm"
                  : "bg-white text-teal rounded-2xl rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {chatMutation.isPending && (
          <div className="flex justify-start" role="status" aria-live="polite">
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white shadow-sm text-sage-400 text-sm">
              Thinking...
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm text-center" role="alert">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="flex p-3 border-t border-sage-200 gap-2 bg-white"
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
          className="flex-1 px-4 py-2.5 rounded-3xl border border-sage-300 text-sm outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={chatMutation.isPending || !input.trim()}
          data-testid="button-send-chat"
          aria-label="Send message"
          className={`px-4 py-2.5 rounded-3xl border-none text-white font-semibold text-sm transition-colors ${
            chatMutation.isPending || !input.trim()
              ? "bg-sage-400 cursor-not-allowed"
              : "bg-sage-600 cursor-pointer hover:bg-sage-700"
          }`}
        >
          {chatMutation.isPending ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
