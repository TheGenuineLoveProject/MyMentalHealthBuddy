import { useState, useEffect } from "react";
import { Quote, RefreshCw, Heart, Share2 } from "lucide-react";

const QUOTES = [
  { text: "The only way out is through.", author: "Robert Frost" },
  { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "Every moment is a fresh beginning.", author: "T.S. Eliot" },
  { text: "Self-care is not selfish. You cannot serve from an empty vessel.", author: "Eleanor Brown" },
  { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
  { text: "Mental health problems don't define who you are. They are something you experience.", author: "Matt Haig" },
  { text: "There is hope, even when your brain tells you there isn't.", author: "John Green" },
  { text: "Be gentle with yourself. You're doing the best you can.", author: "Unknown" },
  { text: "Recovery is not one and done. It is a lifelong journey that takes place one day at a time.", author: "Unknown" },
  { text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.", author: "Unknown" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Healing takes time, and asking for help is a courageous step.", author: "Mariska Hargitay" },
  { text: "Your present circumstances don't determine where you can go; they merely determine where you start.", author: "Nido Qubein" },
  { text: "Sometimes the most important thing in a whole day is the rest we take between two deep breaths.", author: "Etty Hillesum" },
];

export default function MotivationalQuote({ variant = "default" }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("quote_date");
    const savedIndex = localStorage.getItem("quote_index");

    if (savedDate === today && savedIndex) {
      setCurrentIndex(parseInt(savedIndex, 10));
    } else {
      const randomIndex = Math.floor(Math.random() * QUOTES.length);
      setCurrentIndex(randomIndex);
      localStorage.setItem("quote_date", today);
      localStorage.setItem("quote_index", randomIndex.toString());
    }

    const likedQuotes = JSON.parse(localStorage.getItem("liked_quotes") || "[]");
    setLiked(likedQuotes.includes(currentIndex));
  }, [currentIndex]);

  const quote = QUOTES[currentIndex];

  const getNewQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * QUOTES.length);
      } while (newIndex === currentIndex);
      setCurrentIndex(newIndex);
      setLiked(false);
      setIsAnimating(false);
    }, 200);
  };

  const toggleLike = () => {
    const likedQuotes = JSON.parse(localStorage.getItem("liked_quotes") || "[]");
    if (liked) {
      const filtered = likedQuotes.filter((i) => i !== currentIndex);
      localStorage.setItem("liked_quotes", JSON.stringify(filtered));
    } else {
      likedQuotes.push(currentIndex);
      localStorage.setItem("liked_quotes", JSON.stringify(likedQuotes));
    }
    setLiked(!liked);
  };

  const shareQuote = async () => {
    const shareText = `"${quote.text}" — ${quote.author}`;
    if (navigator.share) {
      try {
        await navigator.share({ text: shareText });
      } catch (e) {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  if (variant === "minimal") {
    return (
      <div 
        className={`p-4 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 transition-all duration-200 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
        data-testid="motivational-quote-minimal"
      >
        <div className="flex items-start gap-3">
          <Quote className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" aria-hidden="true" />
          <div>
            <p className="text-sm text-[var(--text)] font-medium italic">"{quote.text}"</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">— {quote.author}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="card-elevated p-8 relative overflow-hidden"
      data-testid="motivational-quote"
    >
      <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-purple-400/10 to-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/4" />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400/10 to-rose-500/10 rounded-full blur-2xl translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-lg">
            <Quote className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
        </div>

        <div className={`text-center mb-6 transition-all duration-200 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
          <blockquote className="text-xl md:text-2xl font-display font-medium text-[var(--text)] leading-relaxed mb-4 italic" data-testid="text-quote">
            "{quote.text}"
          </blockquote>
          <cite className="text-[var(--text-secondary)] not-italic" data-testid="text-quote-author">
            — {quote.author}
          </cite>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={toggleLike}
            className={`p-3 rounded-xl transition-all ${
              liked
                ? "bg-pink-500 text-white shadow-lg"
                : "bg-[var(--surface)] text-[var(--text-muted)] hover:text-pink-500"
            }`}
            aria-label={liked ? "Unlike quote" : "Like quote"}
            data-testid="button-like-quote"
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={shareQuote}
            className="p-3 rounded-xl bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--primary)] transition-all"
            aria-label="Share quote"
            data-testid="button-share-quote"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <button
            onClick={getNewQuote}
            className="btn-gradient px-5 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            data-testid="button-new-quote"
          >
            <RefreshCw className="w-5 h-5" aria-hidden="true" />
            New Quote
          </button>
        </div>
      </div>
    </div>
  );
}
