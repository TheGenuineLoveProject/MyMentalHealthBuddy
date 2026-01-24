import { useState } from "react";
import { Heart, Copy, Check, Sparkles } from "lucide-react";

const IDENTITY_STATEMENTS = [
  "I'm becoming someone who chooses calm over chaos.",
  "I'm learning to trust myself again.",
  "I'm someone who pauses before reacting.",
  "I'm building a life that feels like mine.",
  "I'm allowed to take up space.",
  "I'm becoming someone who sets boundaries.",
  "I'm choosing presence over perfection.",
  "I'm learning to listen to my body.",
  "I'm someone who shows up for myself.",
  "I'm building consistency without pressure.",
  "I'm becoming someone who rests without guilt.",
  "I'm learning that slow is still moving.",
];

export default function IdentityMirror({ className = "" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [animating, setAnimating] = useState(false);

  const currentStatement = IDENTITY_STATEMENTS[currentIndex];

  const handleNext = () => {
    setAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % IDENTITY_STATEMENTS.length);
      setAnimating(false);
    }, 200);
  };

  const handleCopy = async () => {
    const shareText = `${currentStatement}\n\n— The Genuine Love Project\ngenuineloveproject.com`;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div 
      className={`bg-gradient-to-br from-[var(--glp-sage-10)] to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 ${className}`}
      data-testid="identity-mirror"
    >
      <div className="flex items-center justify-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-[var(--glp-gold)]" />
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          Identity Mirror
        </h3>
      </div>

      <div 
        className={`text-center transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}
      >
        <p 
          className="text-2xl md:text-3xl font-serif text-slate-800 dark:text-white leading-relaxed mb-6"
          data-testid="identity-statement"
        >
          "{currentStatement}"
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={handleNext}
          className="px-6 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
          data-testid="button-next-statement"
        >
          Show another
        </button>
        
        <button
          onClick={handleCopy}
          className="px-6 py-2.5 bg-[var(--glp-sage)] text-white rounded-full text-sm font-medium hover:bg-[var(--glp-sage-dark)] transition-colors flex items-center gap-2"
          data-testid="button-copy-statement"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy to share
            </>
          )}
        </button>
      </div>

      <p className="text-center text-xs text-slate-400 mt-6">
        Share if it resonates. No pressure.
      </p>
      
      <div className="flex items-center justify-center gap-1 mt-4 opacity-60">
        <Heart className="w-3 h-3 text-[var(--glp-rose)]" />
        <span className="text-xs text-slate-500">The Genuine Love Project</span>
      </div>
    </div>
  );
}

export { IDENTITY_STATEMENTS };
