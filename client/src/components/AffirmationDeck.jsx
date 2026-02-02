import { useState, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Heart, RefreshCw, Sparkles, BookmarkPlus, Volume2, VolumeX } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

const AFFIRMATIONS = [
  { text: "I am worthy of love, happiness, and all good things.", category: "self-worth" },
  { text: "I release what no longer serves me and welcome peace.", category: "healing" },
  { text: "My feelings are valid, and I honor them with compassion.", category: "emotions" },
  { text: "I am becoming the person I was always meant to be.", category: "growth" },
  { text: "I trust my journey, even when I cannot see the path.", category: "trust" },
  { text: "I am a magnet for miracles and blessings.", category: "abundance" },
  { text: "My heart is open to giving and receiving love freely.", category: "love" },
  { text: "I forgive myself for my past and embrace my present.", category: "forgiveness" },
  { text: "I am safe, grounded, and at peace in this moment.", category: "calm" },
  { text: "Every breath I take fills me with healing energy.", category: "healing" },
  { text: "I choose joy, and it flows through me effortlessly.", category: "joy" },
  { text: "I am resilient, strong, and capable of overcoming anything.", category: "strength" },
  { text: "My authentic self is my greatest gift to the world.", category: "authenticity" },
  { text: "I attract positive energy and loving relationships.", category: "relationships" },
  { text: "I am exactly where I need to be right now.", category: "acceptance" },
  { text: "My intuition guides me toward my highest good.", category: "wisdom" },
  { text: "I release fear and step boldly into my power.", category: "courage" },
  { text: "Gratitude transforms my life in magical ways.", category: "gratitude" },
  { text: "I am a beautiful work in progress, and that is enough.", category: "self-compassion" },
  { text: "Love and light flow through me to everyone I meet.", category: "connection" }
];

export default function AffirmationDeck({ className = "" }) {
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * AFFIRMATIONS.length));
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const currentAffirmation = AFFIRMATIONS[currentIndex];

  const { data: favorites } = useQuery({
    queryKey: ["/api/favorites", "affirmation"],
    staleTime: 1000 * 60 * 5
  });

  const saveFavorite = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/favorites", {
        itemType: "affirmation",
        itemContent: currentAffirmation.text
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2000);
    }
  });

  const isFavorited = useMemo(() => {
    return favorites?.some(f => f.itemContent === currentAffirmation.text);
  }, [favorites, currentAffirmation]);

  const drawNewCard = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    setIsFlipped(true);
    
    setTimeout(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * AFFIRMATIONS.length);
      } while (newIndex === currentIndex && AFFIRMATIONS.length > 1);
      
      setCurrentIndex(newIndex);
      setIsFlipped(false);
      setIsFlipping(false);
    }, 300);
  };

  const speakAffirmation = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(currentAffirmation.text);
    utterance.rate = 0.85;
    utterance.pitch = 1.05;
    
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes("Samantha") || 
      (v.lang.startsWith("en") && v.name.toLowerCase().includes("female"))
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const categoryColors = {
    "self-worth": "from-rose-400 to-pink-500",
    healing: "from-teal-400 to-cyan-500",
    emotions: "from-violet-400 to-purple-500",
    growth: "from-green-400 to-emerald-500",
    trust: "from-blue-400 to-indigo-500",
    abundance: "from-amber-400 to-orange-500",
    love: "from-pink-400 to-rose-500",
    forgiveness: "from-sky-400 to-blue-500",
    calm: "from-cyan-400 to-teal-500",
    joy: "from-yellow-400 to-amber-500",
    strength: "from-red-400 to-rose-500",
    authenticity: "from-purple-400 to-violet-500",
    relationships: "from-pink-400 to-fuchsia-500",
    acceptance: "from-indigo-400 to-violet-500",
    wisdom: "from-amber-400 to-yellow-500",
    courage: "from-orange-400 to-red-500",
    gratitude: "from-rose-400 to-amber-500",
    "self-compassion": "from-pink-400 to-purple-500",
    connection: "from-violet-400 to-pink-500"
  };

  const gradientClass = categoryColors[currentAffirmation.category] || "from-violet-400 to-purple-500";

  return (
    <div className={`space-y-6 ${className}`} data-testid="affirmation-deck">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="font-medium text-amber-700 dark:text-amber-300">Daily Affirmation</span>
        </div>
      </div>

      <div 
        className="relative perspective-1000"
        style={{ perspective: "1000px" }}
      >
        <div 
          className={`relative w-full aspect-[3/4] max-w-sm mx-auto transition-transform duration-300 transform-style-preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{ 
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)"
          }}
        >
          <div 
            className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${gradientClass} shadow-2xl p-8 flex flex-col items-center justify-center backface-hidden`}
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="absolute inset-4 rounded-2xl border-2 border-white/30" />
            
            <div className="absolute top-6 left-6">
              <span className="text-4xl">✨</span>
            </div>
            <div className="absolute bottom-6 right-6">
              <span className="text-4xl">🌸</span>
            </div>

            <p className="text-xl md:text-2xl font-serif text-white text-center leading-relaxed italic px-4">
              "{currentAffirmation.text}"
            </p>

            <div className="mt-6 px-4 py-1 rounded-full bg-white/20 backdrop-blur-sm">
              <span className="text-sm text-white/90 capitalize">
                {currentAffirmation.category}
              </span>
            </div>
          </div>

          <div 
            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-gray-700 to-gray-900 shadow-2xl flex items-center justify-center"
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)"
            }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={speakAffirmation}
          className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          title={isSpeaking ? "Stop speaking" : "Speak affirmation"}
          data-testid="button-speak-affirmation"
        >
          {isSpeaking ? (
            <VolumeX className="w-5 h-5 text-rose-500" />
          ) : (
            <Volume2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        <button
          onClick={drawNewCard}
          disabled={isFlipping}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 flex items-center gap-2"
          data-testid="button-draw-card"
        >
          <RefreshCw className={`w-5 h-5 ${isFlipping ? "animate-spin" : ""}`} />
          Draw New Card
        </button>

        <button
          onClick={() => saveFavorite.mutate()}
          disabled={isFavorited || saveFavorite.isPending}
          className={`p-3 rounded-full shadow-lg transition-all hover:-translate-y-0.5 ${
            isFavorited || justSaved
              ? "bg-rose-500 text-white"
              : "bg-white dark:bg-gray-800 hover:shadow-xl"
          }`}
          title={isFavorited ? "Already saved" : "Save to favorites"}
          data-testid="button-save-affirmation"
        >
          {isFavorited || justSaved ? (
            <Heart className="w-5 h-5 fill-current" />
          ) : (
            <BookmarkPlus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {justSaved && (
        <p className="text-center text-sm text-rose-500 dark:text-rose-400 animate-pulse">
          Saved to your favorites! 💝
        </p>
      )}
    </div>
  );
}
