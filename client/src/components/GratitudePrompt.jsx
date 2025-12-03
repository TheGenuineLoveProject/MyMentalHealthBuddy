import { useState } from "react";
import { Heart, Sparkles, Send, RefreshCw, Lightbulb } from "lucide-react";

const GRATITUDE_PROMPTS = [
  "What made you smile today?",
  "Who is someone you're grateful to have in your life?",
  "What's a small thing that brought you comfort recently?",
  "What's a skill or ability you're thankful for?",
  "What's something in nature you appreciate?",
  "What's a challenge that helped you grow?",
  "What's a favorite memory you cherish?",
  "What's something you often take for granted?",
  "What's a kind thing someone did for you recently?",
  "What's a simple pleasure you enjoyed today?",
  "What part of your home do you love most?",
  "What's a book, song, or show that brought you joy?",
  "What's something about your body you appreciate?",
  "Who taught you something valuable?",
  "What's a goal you achieved that you're proud of?",
  "What technology makes your life easier?",
  "What's a comfort food that makes you happy?",
  "What's something you're looking forward to?",
  "What's a quality about yourself you value?",
  "What made today better than yesterday?",
];

export default function GratitudePrompt({ onSave }) {
  const [currentPrompt, setCurrentPrompt] = useState(
    GRATITUDE_PROMPTS[Math.floor(Math.random() * GRATITUDE_PROMPTS.length)]
  );
  const [response, setResponse] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const getNewPrompt = () => {
    setIsAnimating(true);
    setTimeout(() => {
      let newPrompt;
      do {
        newPrompt = GRATITUDE_PROMPTS[Math.floor(Math.random() * GRATITUDE_PROMPTS.length)];
      } while (newPrompt === currentPrompt);
      setCurrentPrompt(newPrompt);
      setResponse("");
      setIsSaved(false);
      setIsAnimating(false);
    }, 200);
  };

  const handleSave = () => {
    if (!response.trim()) return;
    
    if (onSave) {
      onSave({
        prompt: currentPrompt,
        response: response.trim(),
        timestamp: new Date().toISOString(),
      });
    }

    const existing = JSON.parse(localStorage.getItem("gratitudeEntries") || "[]");
    const updated = [
      {
        prompt: currentPrompt,
        response: response.trim(),
        timestamp: new Date().toISOString(),
      },
      ...existing,
    ].slice(0, 100);
    localStorage.setItem("gratitudeEntries", JSON.stringify(updated));

    setIsSaved(true);
  };

  return (
    <div className="card-elevated p-8 relative overflow-hidden" data-testid="gratitude-prompt">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-rose-400/20 to-pink-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-orange-500/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-display font-bold text-[var(--text)]">
            Gratitude Reflection
          </h3>
        </div>

        <div className={`mb-6 transition-all duration-200 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
          <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl mb-4">
            <Lightbulb className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-lg font-medium text-[var(--text)]">
              {currentPrompt}
            </p>
          </div>

          <textarea
            value={response}
            onChange={(e) => {
              setResponse(e.target.value);
              setIsSaved(false);
            }}
            placeholder="Take a moment to reflect and write your thoughts..."
            rows={4}
            className="w-full p-4 rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 resize-none transition-all"
            disabled={isSaved}
            data-testid="textarea-gratitude"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={getNewPrompt}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--surface)] transition-all"
            data-testid="button-new-prompt"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            New Prompt
          </button>

          {isSaved ? (
            <div className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
              <span className="font-medium">Saved!</span>
            </div>
          ) : (
            <button
              onClick={handleSave}
              disabled={!response.trim()}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                response.trim()
                  ? "btn-gradient shadow-lg hover:shadow-xl"
                  : "bg-[var(--surface)] text-[var(--text-muted)] cursor-not-allowed"
              }`}
              data-testid="button-save-gratitude"
            >
              <Send className="w-5 h-5" aria-hidden="true" />
              Save Reflection
            </button>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-[var(--border)]">
          <p className="text-sm text-[var(--text-muted)] text-center">
            💡 Regular gratitude practice can boost happiness and reduce stress
          </p>
        </div>
      </div>
    </div>
  );
}
