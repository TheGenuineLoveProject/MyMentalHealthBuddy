import { useState, useEffect } from "react";
import { Heart, RefreshCw, Share2, Bookmark, Sun, Star, Sparkles } from "lucide-react";

const AFFIRMATIONS = [
  { text: "I am worthy of love, peace, and happiness.", category: "self-worth" },
  { text: "I choose to focus on what I can control and let go of what I cannot.", category: "mindfulness" },
  { text: "I am growing stronger every day, one step at a time.", category: "growth" },
  { text: "My feelings are valid, and I honor them with compassion.", category: "emotions" },
  { text: "I deserve rest and allow myself to recharge.", category: "self-care" },
  { text: "I am resilient and can handle whatever comes my way.", category: "strength" },
  { text: "I release anxiety and embrace calm.", category: "peace" },
  { text: "I am enough, exactly as I am right now.", category: "self-worth" },
  { text: "Today, I choose joy over worry.", category: "mindfulness" },
  { text: "I trust the journey, even when I don't understand it.", category: "trust" },
  { text: "My mind is clear, focused, and at peace.", category: "peace" },
  { text: "I am surrounded by love and support.", category: "connection" },
  { text: "I forgive myself for past mistakes and grow from them.", category: "forgiveness" },
  { text: "I attract positive energy and release negativity.", category: "energy" },
  { text: "I am capable of achieving my goals.", category: "confidence" },
  { text: "I embrace change as an opportunity for growth.", category: "growth" },
  { text: "My potential is limitless.", category: "confidence" },
  { text: "I am grateful for this moment and all it brings.", category: "gratitude" },
  { text: "I give myself permission to take things slowly.", category: "self-care" },
  { text: "I am healing, and that's a beautiful process.", category: "healing" },
];

const CATEGORY_COLORS = {
  "self-worth": "from-pink-400 to-rose-500",
  "mindfulness": "from-teal-400 to-cyan-500",
  "growth": "from-emerald-400 to-green-500",
  "emotions": "from-purple-400 to-violet-500",
  "self-care": "from-amber-400 to-orange-500",
  "strength": "from-red-400 to-rose-500",
  "peace": "from-blue-400 to-indigo-500",
  "trust": "from-indigo-400 to-purple-500",
  "connection": "from-pink-400 to-fuchsia-500",
  "forgiveness": "from-violet-400 to-purple-500",
  "energy": "from-yellow-400 to-amber-500",
  "confidence": "from-orange-400 to-red-500",
  "gratitude": "from-emerald-400 to-teal-500",
  "healing": "from-cyan-400 to-blue-500",
};

const CATEGORY_ICONS = {
  "self-worth": Heart,
  "mindfulness": Sun,
  "growth": Sparkles,
  "emotions": Heart,
  "self-care": Star,
  "strength": Star,
  "peace": Sun,
  "trust": Heart,
  "connection": Heart,
  "forgiveness": Heart,
  "energy": Sparkles,
  "confidence": Star,
  "gratitude": Heart,
  "healing": Sparkles,
};

export default function DailyAffirmations({ compact = false }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saved, setSaved] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const savedAffirmations = localStorage.getItem("savedAffirmations");
    if (savedAffirmations) {
      setSaved(JSON.parse(savedAffirmations));
    }

    const today = new Date().toDateString();
    const lastDate = localStorage.getItem("affirmationDate");
    if (lastDate !== today) {
      const randomIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
      setCurrentIndex(randomIndex);
      localStorage.setItem("affirmationDate", today);
      localStorage.setItem("dailyAffirmationIndex", randomIndex.toString());
    } else {
      const savedIndex = localStorage.getItem("dailyAffirmationIndex");
      if (savedIndex) {
        setCurrentIndex(parseInt(savedIndex, 10));
      }
    }
  }, []);

  const affirmation = AFFIRMATIONS[currentIndex];
  const CategoryIcon = CATEGORY_ICONS[affirmation.category] || Heart;
  const gradientColor = CATEGORY_COLORS[affirmation.category] || "from-purple-400 to-pink-500";

  const getNewAffirmation = () => {
    setIsAnimating(true);
    setTimeout(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
      } while (newIndex === currentIndex && AFFIRMATIONS.length > 1);
      setCurrentIndex(newIndex);
      setIsAnimating(false);
    }, 300);
  };

  const toggleSave = () => {
    const affirmationText = affirmation.text;
    let newSaved;
    if (saved.includes(affirmationText)) {
      newSaved = saved.filter((a) => a !== affirmationText);
    } else {
      newSaved = [...saved, affirmationText];
    }
    setSaved(newSaved);
    localStorage.setItem("savedAffirmations", JSON.stringify(newSaved));
  };

  const shareAffirmation = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Daily Affirmation",
          text: affirmation.text,
        });
      } catch (err) {
        // Share cancelled
      }
    } else {
      navigator.clipboard.writeText(affirmation.text);
    }
  };

  const isSaved = saved.includes(affirmation.text);

  if (compact) {
    return (
      <div 
        className="card-elevated p-6 relative overflow-hidden"
        data-testid="daily-affirmation-compact"
      >
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradientColor} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`} />
        
        <div className="flex items-start gap-4 relative z-10">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center shadow-lg flex-shrink-0`}>
            <CategoryIcon className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-[var(--text-secondary)] mb-1">Today's Affirmation</p>
            <p className={`text-lg font-medium text-[var(--text)] transition-opacity duration-300 ${isAnimating ? "opacity-0" : "opacity-100"}`}>
              "{affirmation.text}"
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            onClick={toggleSave}
            className={`p-2 rounded-lg transition-all ${
              isSaved 
                ? "bg-amber-500/20 text-amber-500" 
                : "bg-[var(--surface)] text-[var(--text-muted)] hover:text-amber-500"
            }`}
            aria-label={isSaved ? "Remove from saved" : "Save affirmation"}
            data-testid="button-save-affirmation"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={getNewAffirmation}
            className="p-2 rounded-lg bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--primary)] transition-all"
            aria-label="Get new affirmation"
            data-testid="button-refresh-affirmation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="card-elevated p-8 text-center relative overflow-hidden"
      data-testid="daily-affirmation"
    >
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-gradient-to-br ${gradientColor} opacity-10 rounded-full blur-3xl -translate-y-1/2`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center shadow-lg`}>
            <Sun className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-display font-bold text-[var(--text)]">
            Daily Affirmation
          </h3>
        </div>

        <div className={`mb-8 transition-all duration-300 ${isAnimating ? "opacity-0 transform scale-95" : "opacity-100 transform scale-100"}`}>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${gradientColor} bg-opacity-10 text-sm font-medium mb-4`}>
            <CategoryIcon className="w-4 h-4" aria-hidden="true" />
            <span className="capitalize">{affirmation.category.replace("-", " ")}</span>
          </div>
          
          <p className="text-2xl md:text-3xl font-display font-medium text-[var(--text)] leading-relaxed">
            "{affirmation.text}"
          </p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleSave}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
              isSaved
                ? "bg-amber-500 text-white shadow-lg"
                : "bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-hover)]"
            }`}
            data-testid="button-save-affirmation-full"
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} aria-hidden="true" />
            {isSaved ? "Saved" : "Save"}
          </button>

          <button
            onClick={shareAffirmation}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-hover)] transition-all"
            data-testid="button-share-affirmation"
          >
            <Share2 className="w-5 h-5" aria-hidden="true" />
            Share
          </button>

          <button
            onClick={getNewAffirmation}
            className="btn-gradient px-5 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
            data-testid="button-new-affirmation"
          >
            <RefreshCw className="w-5 h-5" aria-hidden="true" />
            New
          </button>
        </div>

        {saved.length > 0 && (
          <p className="text-sm text-[var(--text-muted)] mt-6">
            You've saved {saved.length} affirmation{saved.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}
