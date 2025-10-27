import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { Send, Copy, Trash2, Bot, User, Check } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sessionId] = useState(`session-${Date.now()}`);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message }),
        headers: { "x-session-id": sessionId }
      });
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.reply,
        timestamp: new Date()
      }]);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

    setMessages(prev => [...prev, { 
      role: "user", 
      content: input,
      timestamp: new Date()
    }]);
    chatMutation.mutate(input);
    setInput("");
  };

  const handleCopy = async (content: string, index: number) => {
    await navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear this conversation?")) {
      setMessages([]);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50">
      {/* Chat Header */}
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">AI Chat Support</h1>
          <p className="text-sm text-gray-600">Your compassionate mental health companion</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            data-testid="button-clear-chat"
          >
            <Trash2 size={18} />
            Clear Chat
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center mt-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4">
              <Bot className="text-blue-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to AI Chat Support</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              I'm here to listen and support you. Share your thoughts, feelings, or concerns.
              Everything is confidential and judgment-free.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
              <div className="bg-white p-4 rounded-lg shadow text-left">
                <p className="text-sm text-gray-600">💭 How are you feeling today?</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-left">
                <p className="text-sm text-gray-600">🌱 What's been on your mind?</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-left">
                <p className="text-sm text-gray-600">💪 How can I support you?</p>
              </div>
            </div>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            data-testid={`message-${msg.role}-${i}`}
          >
            {/* Avatar */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              msg.role === "user" ? "bg-blue-500" : "bg-gray-300"
            }`}>
              {msg.role === "user" ? (
                <User className="text-white" size={20} />
              ) : (
                <Bot className="text-gray-700" size={20} />
              )}
            </div>

            {/* Message Content */}
            <div className={`flex-1 max-w-[70%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">
                  {msg.role === "user" ? "You" : "AI Support"}
                </span>
                <span className="text-xs text-gray-400">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              
              <div className={`rounded-lg px-4 py-3 ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-900 shadow"
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => handleCopy(msg.content, i)}
                className={`text-xs flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-100 transition ${
                  msg.role === "user" ? "self-end" : "self-start"
                }`}
                data-testid={`button-copy-${i}`}
              >
                {copiedIndex === i ? (
                  <>
                    <Check size={12} className="text-green-600" />
                    <span className="text-green-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} className="text-gray-500" />
                    <span className="text-gray-500">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}

        {chatMutation.isPending && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <Bot className="text-gray-700" size={20} />
            </div>
            <div className="bg-white rounded-lg px-4 py-3 shadow">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Share what's on your mind..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            data-testid="input-chat-message"
            disabled={chatMutation.isPending}
          />
          <button
            type="submit"
            disabled={!input.trim() || chatMutation.isPending}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2 transition transform hover:scale-105"
            data-testid="button-send-chat"
          >
            <Send size={18} />
            <span className="font-medium">Send</span>
          </button>
        </div>
      </form>
    </div>
  );
}
