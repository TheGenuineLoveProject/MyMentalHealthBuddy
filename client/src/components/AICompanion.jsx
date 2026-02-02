import { useState, useRef, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { MessageCircle, X, Send, Sparkles, Heart, Loader2, Volume2, VolumeX } from "lucide-react";
import { apiRequest } from "../lib/queryClient";
import { LotusGuide } from "./sacred";
import { useEmotion } from "@/context/EmotionContext";

const INITIAL_MESSAGES = [
  {
    id: "welcome",
    role: "assistant",
    content: "Hello, beautiful soul. I'm here to listen and support you on your journey. How are you feeling right now?",
    timestamp: new Date()
  }
];

const SUPPORTIVE_RESPONSES = [
  "I hear you, and your feelings are completely valid.",
  "Thank you for sharing that with me. It takes courage to express what you're feeling.",
  "You're not alone in this. Many people experience similar feelings.",
  "What you're going through sounds challenging. How can I best support you right now?",
  "Your awareness of your emotions is a beautiful strength.",
  "It's okay to feel this way. Healing isn't linear, and every step matters.",
  "I'm here with you. Take all the time you need.",
  "Your journey matters, and so do you."
];

export default function AICompanion({ className = "" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showAffirmation, setShowAffirmation] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const speechSynthRef = useRef(null);
  
  let emotionContext = null;
  try {
    emotionContext = useEmotion();
  } catch {
    emotionContext = null;
  }
  
  const speakMessage = useCallback((text) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 0.8;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Samantha') || 
      v.name.includes('Google US English Female') ||
      v.lang.startsWith('en')
    );
    if (preferredVoice) utterance.voice = preferredVoice;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [voiceEnabled]);
  
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const chatMutation = useMutation({
    mutationFn: async (message) => {
      try {
        const response = await apiRequest("POST", "/api/ai/chat", { 
          message,
          context: "emotional_support"
        });
        return response;
      } catch {
        return { 
          response: SUPPORTIVE_RESPONSES[Math.floor(Math.random() * SUPPORTIVE_RESPONSES.length)]
        };
      }
    },
    onMutate: () => {
      setIsTyping(true);
    },
    onSuccess: (data) => {
      setTimeout(() => {
        setIsTyping(false);
        const responseContent = data?.reply || data?.response || data?.message || SUPPORTIVE_RESPONSES[Math.floor(Math.random() * SUPPORTIVE_RESPONSES.length)];
        const aiResponse = {
          id: `ai-${Date.now()}`,
          role: "assistant",
          content: responseContent,
          timestamp: new Date(),
          isCrisis: data?.isCrisis || false
        };
        setMessages(prev => [...prev, aiResponse]);
        
        if (voiceEnabled) {
          speakMessage(responseContent);
        }
        
        if (data?.detectedEmotion && emotionContext?.setEmotion) {
          emotionContext.setEmotion(data.detectedEmotion, data.emotionIntensity || 0.5);
        }
      }, 1000 + Math.random() * 1000);
    },
    onError: () => {
      setIsTyping(false);
      const fallbackResponse = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: SUPPORTIVE_RESPONSES[Math.floor(Math.random() * SUPPORTIVE_RESPONSES.length)],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackResponse]);
    }
  });

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    chatMutation.mutate(input.trim());
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClose = () => {
    if (messages.length > 2) {
      setShowAffirmation(true);
      setTimeout(() => {
        setShowAffirmation(false);
        setIsOpen(false);
      }, 4000);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all hover:scale-110 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--glp-gold)] ${className}`}
        style={{
          background: "linear-gradient(135deg, var(--glp-sage) 0%, var(--glp-teal) 100%)",
          boxShadow: "0 4px 20px rgba(143, 191, 159, 0.4)"
        }}
        aria-label="Open AI Companion"
        data-testid="button-open-companion"
      >
        <MessageCircle className="w-6 h-6" aria-hidden="true" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--glp-gold)] rounded-full animate-pulse" aria-hidden="true" />
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="companion-title"
        >
          <div 
            className="w-full max-w-lg h-[80vh] max-h-[600px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
            style={{
              background: "linear-gradient(to bottom, rgba(143, 191, 159, 0.05) 0%, transparent 30%)"
            }}
          >
            <header 
              className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800"
              style={{
                background: "linear-gradient(135deg, rgba(143, 191, 159, 0.1) 0%, rgba(47, 93, 93, 0.1) 100%)"
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, var(--glp-sage) 0%, var(--glp-teal) 100%)"
                  }}
                >
                  <Heart className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h2 id="companion-title" className="font-serif font-semibold text-gray-900 dark:text-white">
                    Sacred Companion
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Here to listen and support you
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className={`p-2 rounded-full transition ${
                    voiceEnabled 
                      ? 'bg-[var(--glp-sage)]/20 text-[var(--glp-sage)]' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400'
                  } ${isSpeaking ? 'animate-pulse' : ''}`}
                  aria-label={voiceEnabled ? "Disable voice" : "Enable voice"}
                  data-testid="button-toggle-voice"
                >
                  {voiceEnabled ? (
                    <Volume2 className="w-5 h-5" />
                  ) : (
                    <VolumeX className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  aria-label="Close companion"
                  data-testid="button-close-companion"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </header>

            <div className="mx-4 mt-2 p-3 rounded-lg bg-[var(--glp-rose)]/10 border border-[var(--glp-rose)]/20">
              <p className="text-xs text-gray-600 dark:text-gray-300">
                This is a supportive AI companion for emotional wellness, not a replacement for professional care.{" "}
                <a 
                  href="/crisis" 
                  className="underline text-[var(--glp-teal)] hover:text-[var(--glp-sage)] font-medium"
                  data-testid="link-crisis-support"
                >
                  Need immediate support? Visit our crisis resources →
                </a>
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-[var(--glp-sage)] text-white rounded-br-md"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-3 h-3 text-[var(--glp-gold)]" aria-hidden="true" />
                        <span className="text-xs font-medium text-[var(--glp-teal)]">Sacred Companion</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <span className="block text-xs opacity-60 mt-2">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl rounded-bl-md">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, var(--glp-sage) 0%, var(--glp-teal) 100%)',
                          animation: 'pulse 1.5s ease-in-out infinite'
                        }}
                      >
                        <Heart className="w-4 h-4 text-white animate-pulse" aria-hidden="true" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">Contemplating with care...</span>
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-[var(--glp-sage)] animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-[var(--glp-sage)] animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-[var(--glp-sage)] animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Share what's on your heart..."
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--glp-sage)] focus:border-transparent"
                  data-testid="input-message"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || chatMutation.isPending}
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, var(--glp-sage) 0%, var(--glp-teal) 100%)"
                  }}
                  aria-label="Send message"
                  data-testid="button-send"
                >
                  <Send className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-3">
                This is emotional support, not therapy. If in crisis, please seek professional help.
              </p>
            </div>
          </div>
        </div>
      )}

      {showAffirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="text-center max-w-md">
            <div className="flex justify-center mb-6">
              <LotusGuide mood="grateful" size={120} showMessage={false} />
            </div>
            <p className="font-serif text-2xl text-white mb-4">
              Thank you for sharing your heart today.
            </p>
            <p className="text-lg text-white/80">
              Remember: You are worthy of love and belonging. 
            </p>
            <Sparkles className="w-6 h-6 text-[var(--glp-gold)] mx-auto mt-6" aria-hidden="true" />
          </div>
        </div>
      )}
    </>
  );
}
