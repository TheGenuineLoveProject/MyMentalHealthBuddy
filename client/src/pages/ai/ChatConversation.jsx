import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { 
  MessageCircle, ArrowLeft, Send, Heart, Sparkles, 
  Bot, User, Loader2, MoreVertical, Lightbulb, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSEO } from "@/hooks/useSEO";
import { WellnessPageShell } from "@/components/wellness/WellnessPageShell";
import { pickBenefits } from "@/lib/benefits";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const WELCOME_MESSAGE = {
  id: 1,
  role: "assistant",
  content: "Hello, I'm here to support you on your wellness journey. This is a safe space to share what's on your mind. How are you feeling today?",
  timestamp: new Date()
};

const SUGGESTIONS = [
  "I need help with anxiety",
  "Guide me through a breathing exercise",
  "Help me process today's emotions"
];

export default function ChatConversation() {
  useSEO({
    title: "AI Wellness Chat",
    description: "Have a supportive conversation with our AI companion for emotional guidance and wellness support.",
    noIndex: true
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to chat with the AI companion.",
        variant: "destructive"
      });
      return;
    }

    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Unable to get response");
      }

      const assistantMessage = {
        id: messages.length + 2,
        role: "assistant",
        content: data.content || data.reply || "I'm here to support you. Could you tell me more?",
        timestamp: new Date(),
        isCrisis: data.isCrisis
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Connection issue",
        description: "Unable to reach AI companion. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
  <WellnessPageShell
    title="ChatConversation"
    subtitle="Educational reflection tools. Choose what feels safe and supportive."
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

    <div className="min-h-screen hero-gradient flex flex-col">
      <header className="bg-white/80 backdrop-blur-sm border-b border-[var(--sage-200)] sticky top-0 z-10">
        <div className="content-wrapper py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="icon-container icon-sm icon-soft-sage" data-testid="link-back">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <div className="icon-container icon-md icon-gradient-teal">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-heading-sm text-teal" data-testid="text-page-title">AI Companion</h1>
                <p className="text-caption flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[var(--sage-500)]"></span>
                  Online and here for you
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" data-testid="button-menu">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="content-wrapper py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map(message => (
              <div 
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                data-testid={`message-${message.id}`}
              >
                {message.role === "assistant" && (
                  <div className="icon-container icon-md icon-soft-teal flex-shrink-0">
                    <Bot className="h-5 w-5" />
                  </div>
                )}
                <div className={`max-w-[75%] ${
                  message.role === "user" 
                    ? "bg-[var(--teal-500)] text-white rounded-2xl rounded-br-md" 
                    : "card-bordered"
                } p-4`}>
                  <p className="text-body-sm">{message.content}</p>
                  <p className={`text-caption mt-2 ${message.role === "user" ? "text-white/70" : ""}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="icon-container icon-md icon-soft-blush flex-shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="icon-container icon-md icon-soft-teal flex-shrink-0">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="card-bordered p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none text-[var(--sage-500)]" />
                    <span className="text-body-sm text-[var(--sage-500)]">Thinking with care...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      <footer className="bg-white/80 backdrop-blur-sm border-t border-[var(--sage-200)] sticky bottom-0">
        <div className="content-wrapper py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {SUGGESTIONS.map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInput(suggestion)}
                  className="flex-shrink-0 px-4 py-2 rounded-full bg-[var(--sage-100)] text-[var(--sage-700)] text-body-sm hover:bg-[var(--sage-200)] transition"
                  data-testid={`suggestion-${i}`}
                >
                  <Lightbulb className="h-4 w-4 inline mr-1" />
                  {suggestion}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Share what's on your mind..."
                className="input-premium flex-1"
                data-testid="input-message"
              />
              <Button 
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="btn-premium"
                data-testid="button-send"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-caption text-center mt-3 flex items-center justify-center gap-1">
              <Heart className="h-3 w-3 text-[var(--blush-500)]" />
              Your conversations are private and encrypted
            </p>
          </div>
        </div>
      </footer>
    </div>
  </WellnessPageShell>
  );
}
