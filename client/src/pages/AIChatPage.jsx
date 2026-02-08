import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, Send, Bot, User, Loader2, Trash2, AlertTriangle, Sparkles, Heart, Lock, FileText, Copy, Check } from "lucide-react";
import { apiRequest, queryClient } from "../lib/queryClient.js";
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/SafetyFooter";
import { useGamification } from "../context/GamificationContext.jsx";
import { useAuth } from "@/context/AuthContext";
import { FEATURE_ACCESS } from "@/config/featureAccess";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import "../styles/sacred-visuals.css";

const INITIAL_MESSAGE = {
  role: "assistant",
  content: "Hello! I'm your mental wellness companion. I'm here to listen and support you without judgment. How are you feeling today?",
};

const AI_CHAT_CONFIG = FEATURE_ACCESS.aiChat;

function getDailySessionKey() {
  const today = new Date().toISOString().slice(0, 10);
  return `glp_chat_sessions_${today}`;
}

function getDailySessionCount() {
  try {
    return parseInt(localStorage.getItem(getDailySessionKey()) || "0", 10);
  } catch {
    return 0;
  }
}

function incrementDailySession() {
  try {
    const key = getDailySessionKey();
    const count = getDailySessionCount() + 1;
    localStorage.setItem(key, String(count));
    return count;
  } catch {
    return 0;
  }
}

export default function AIChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [error, setError] = useState("");
  const [xpAwarded, setXpAwarded] = useState(false);
  const [sessionCount, setSessionCount] = useState(getDailySessionCount);
  const [reflectionSummary, setReflectionSummary] = useState(null);
  const [copied, setCopied] = useState(false);
  const { awardXp } = useGamification();
  const { isPro } = useAuth();
  const messagesEndRef = useRef(null);

  const dailyLimit = AI_CHAT_CONFIG.freeLimit || 5;
  const hasReachedLimit = !isPro && sessionCount >= dailyLimit;
  const sessionsRemaining = isPro ? null : Math.max(0, dailyLimit - sessionCount);

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
      setXpAwarded(false);
      setReflectionSummary(null);
      queryClient.invalidateQueries({ queryKey: ["/api/ai/history"] });
    },
  });

  const reflectMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/ai/reflect"),
    onSuccess: (data) => {
      if (data?.summary) {
        setReflectionSummary(data.summary);
      }
    },
  });

  function copyReflection() {
    if (reflectionSummary) {
      navigator.clipboard.writeText(reflectionSummary).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    }
  }

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
      if (!xpAwarded) {
        awardXp("ai-chat-session", 120, { type: "therapy_chat" }).catch(() => {});
        setXpAwarded(true);
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
    if (hasReachedLimit) return;

    const userMessage = input.trim();
    setInput("");
    setError("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    const newCount = incrementDailySession();
    setSessionCount(newCount);
    chatMutation.mutate(userMessage);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
  <WellnessPageShell
    title=""
    subtitle=""
    benefits={pickBenefits(["agency","calm","clarity","selfRespect","meaning"], 5)}
    clarity={{
      what: "A self-paced reflection tool you control.",
      why: "To support clarity, values alignment, and gentle next steps.",
      who: "For adults (18+) who want educational wellness tools (not medical care).",
      when: "Anytime you want a small reset or a thoughtful pause.",
      where: "Anywhere you can breathe and write for 1–5 minutes.",
      how: "Pick one prompt, answer briefly, stop whenever you want."
    }}
    examples={[
      { label: "Beginner", examples: ["Write one honest sentence about how you feel.", "Name one value you want to protect today."] },
      { label: "Intermediate", examples: ["Describe the situation + the need underneath it.", "Write a boundary you could try in one sentence."] },
      { label: "Advanced", examples: ["Identify a pattern and the smallest experiment to change it.", "Write a compassionate reframe and one measurable step."] }
    ]}
  >

    <>
      <SEO 
        title="AI Chat"
        description="Chat with your AI wellness companion. Get compassionate support and guidance for your mental health journey."
      />
      <div className="min-h-screen flex flex-col safe-padding hero-gradient">
        <header className="flex items-center gap-4 p-4 border-b border-[var(--glp-border)] glass-card sticky top-0 z-10">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-body-sm text-secondary hover:text-brand transition focus-ring rounded-lg px-2 py-1" 
            data-testid="link-back" 
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="icon-sm" aria-hidden="true" />
            Back
          </Link>
          
          <div className="flex items-center gap-3 flex-1">
            <div className="icon-container icon-lg icon-gradient-teal" aria-hidden="true">
              <Bot className="w-6 h-6" />
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
              onClick={() => reflectMutation.mutate()}
              disabled={reflectMutation.isPending || messages.length <= 2}
              className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent-teal)] hover:border-[var(--accent-teal)]/50 transition disabled:opacity-40"
              data-testid="button-reflect"
              aria-label="Reflect on this conversation"
              title="Reflect on this conversation"
            >
              {reflectMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> : <FileText className="w-5 h-5" aria-hidden="true" />}
            </button>
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
                    <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce motion-reduce:animate-none" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce motion-reduce:animate-none" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce motion-reduce:animate-none" style={{ animationDelay: "300ms" }}></span>
                  </div>
                  <span className="text-[var(--text-muted)]">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Reflection Summary */}
        {reflectionSummary && (
          <div className="px-4 py-4 bg-[var(--glp-sage-5)] border-t border-[var(--glp-sage-15)]" data-testid="panel-reflection-summary">
            <div className="max-w-lg mx-auto space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[var(--accent-teal)]" aria-hidden="true" />
                  <span className="text-xs font-medium text-[var(--glp-ink-60)] uppercase tracking-wide">Reflection</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyReflection}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-[var(--card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--accent-teal)] transition"
                    data-testid="button-copy-reflection"
                    aria-label="Copy reflection to clipboard"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    onClick={() => setReflectionSummary(null)}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition px-2 py-1"
                    data-testid="button-dismiss-reflection"
                    aria-label="Dismiss reflection"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <p className="text-sm text-[var(--glp-ink-80)] leading-relaxed italic">
                {reflectionSummary}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="px-4 py-3 bg-[var(--accent-rose-soft)] border-t border-[var(--accent-rose)]/30 text-[var(--accent-rose)] text-sm flex items-center gap-2" role="alert">
            <AlertTriangle className="w-4 h-4" aria-hidden="true" />
            {error}
          </div>
        )}

        {/* Session Limit Reached Banner */}
        {hasReachedLimit && (
          <div className="px-4 py-5 bg-gradient-to-r from-[var(--glp-sage-5)] to-[var(--glp-gold-10)] border-t border-[var(--glp-sage-15)]" data-testid="banner-session-limit">
            <div className="max-w-lg mx-auto text-center space-y-3">
              <div className="w-10 h-10 mx-auto rounded-full bg-[var(--glp-gold-30)] flex items-center justify-center">
                <Heart className="w-5 h-5 text-[var(--glp-gold)]" />
              </div>
              <h3 className="text-base font-semibold text-[var(--glp-sage-deep)]">
                You've reached today's {dailyLimit} sessions — nothing went wrong
              </h3>
              <p className="text-sm text-[var(--glp-ink-60)]">
                This is just a natural daily pause. Your sessions reset automatically tomorrow — no action needed on your part.
              </p>
              <p className="text-sm text-[var(--glp-ink-60)]">
                Journaling, mood tracking, daily reflection, and crisis support are always available to you, free of charge.
              </p>
              <Link
                href="/account/billing"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all text-[var(--glp-sage-deep)]"
                style={{ background: "var(--glp-gold-gradient)", boxShadow: "var(--glp-gold-shadow)" }}
                data-testid="link-upgrade-chat"
              >
                <Sparkles className="w-4 h-4" />
                If you'd like unlimited sessions, explore Pro
              </Link>
              <p className="text-xs text-[var(--glp-ink-40)]">
                No obligation. You can continue using the free plan as long as you like.
              </p>
            </div>
          </div>
        )}

        {/* Sessions remaining indicator (free users only) */}
        {!isPro && !hasReachedLimit && sessionsRemaining !== null && (
          <div className="px-4 py-2 bg-[var(--glp-gold-10)] border-t border-[var(--glp-gold-20)] text-center" data-testid="banner-sessions-remaining">
            <p className="text-xs text-[var(--glp-ink-60)]">
              {sessionsRemaining} of {dailyLimit} {sessionsRemaining === 1 ? "session" : "sessions"} available today
            </p>
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
              placeholder={hasReachedLimit ? "Sessions reset tomorrow — your other tools are still here for you" : "Type your message..."}
              disabled={chatMutation.isPending || hasReachedLimit}
              className="input-lg flex-1"
              data-testid="input-message"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={chatMutation.isPending || !input.trim() || hasReachedLimit}
              className="btn btn-gradient px-6"
              data-testid="button-send"
              aria-label="Send message"
            >
              <Send className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          <SafetyFooter variant="compact" showDisclaimer={true} className="mt-4 max-w-4xl mx-auto" />
        </form>
      </div>
    </>
  </WellnessPageShell>
  );
}
