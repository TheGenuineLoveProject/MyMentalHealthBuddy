import { useState, useEffect } from "react";
import { Heart, RefreshCw, Share2, Star, ChevronLeft, ChevronRight, Sparkles, Sun, Moon, Zap, Shield, Flower2 } from "lucide-react";

const AFFIRMATION_CATEGORIES = {
  selfLove: {
    name: "Self-Love",
    icon: Heart,
    color: "from-rose-400 to-pink-500",
    bgGradient: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30",
    affirmations: [
      "I am worthy of love and respect exactly as I am",
      "I choose to treat myself with kindness and compassion",
      "My self-worth is not determined by others' opinions",
      "I am enough, just as I am in this moment",
      "I forgive myself for past mistakes and embrace growth",
      "I honor my needs and set healthy boundaries",
      "I deserve happiness and actively pursue it",
      "I love and accept all parts of myself",
    ],
  },
  confidence: {
    name: "Confidence",
    icon: Zap,
    color: "from-amber-400 to-orange-500",
    bgGradient: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
    affirmations: [
      "I believe in my abilities and trust my decisions",
      "I am capable of achieving my goals",
      "My voice matters and deserves to be heard",
      "I face challenges with courage and determination",
      "I am becoming more confident every day",
      "I embrace new opportunities with enthusiasm",
      "I trust myself to handle whatever comes my way",
      "My potential is limitless",
    ],
  },
  peace: {
    name: "Inner Peace",
    icon: Flower2,
    color: "from-teal-400 to-cyan-500",
    bgGradient: "from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30",
    affirmations: [
      "I release what I cannot control",
      "I am at peace with my past and excited for my future",
      "I choose calm over chaos",
      "My mind is clear and my heart is light",
      "I breathe in peace and exhale tension",
      "I am grounded in the present moment",
      "Serenity flows through me like a gentle river",
      "I create space for peace in my daily life",
    ],
  },
  strength: {
    name: "Strength",
    icon: Shield,
    color: "from-indigo-400 to-purple-500",
    bgGradient: "from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30",
    affirmations: [
      "I am stronger than my challenges",
      "Every setback is a setup for a comeback",
      "I have overcome difficulties before and will do so again",
      "My resilience grows with every experience",
      "I choose to rise above negativity",
      "I am the architect of my own strength",
      "Challenges make me stronger and wiser",
      "I have the power to create positive change",
    ],
  },
  gratitude: {
    name: "Gratitude",
    icon: Sun,
    color: "from-yellow-400 to-amber-500",
    bgGradient: "from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30",
    affirmations: [
      "I am grateful for this moment and all it holds",
      "Abundance flows into my life in many forms",
      "I appreciate the small joys that make life beautiful",
      "My life is full of blessings I often overlook",
      "I am thankful for the lessons life teaches me",
      "Gratitude opens my heart to more blessings",
      "I find something to be thankful for every day",
      "I appreciate my journey and trust my path",
    ],
  },
};

const STORAGE_KEY = "affirmation-favorites";

export default function AffirmationCards() {
  const [selectedCategory, setSelectedCategory] = useState("selfLove");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const category = AFFIRMATION_CATEGORIES[selectedCategory];
  const affirmations = showFavorites ? favorites : category.affirmations;
  const currentAffirmation = affirmations[currentIndex] || "Add some favorites to see them here!";
  const CategoryIcon = category.icon;

  const nextCard = () => {
    if (affirmations.length === 0) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % affirmations.length);
      setIsFlipping(false);
    }, 150);
  };

  const prevCard = () => {
    if (affirmations.length === 0) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + affirmations.length) % affirmations.length);
      setIsFlipping(false);
    }, 150);
  };

  const shuffleCard = () => {
    if (affirmations.length === 0) return;
    setIsFlipping(true);
    setTimeout(() => {
      const newIndex = Math.floor(Math.random() * affirmations.length);
      setCurrentIndex(newIndex);
      setIsFlipping(false);
    }, 150);
  };

  const toggleFavorite = () => {
    const affirmation = currentAffirmation;
    let updated;
    
    if (favorites.includes(affirmation)) {
      updated = favorites.filter((f) => f !== affirmation);
    } else {
      updated = [...favorites, affirmation];
    }
    
    setFavorites(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const shareAffirmation = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Daily Affirmation",
          text: currentAffirmation,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(currentAffirmation);
    }
  };

  const isFavorited = favorites.includes(currentAffirmation);

  return (
    <div 
      className={`min-h-[500px] bg-gradient-to-br ${category.bgGradient} rounded-3xl p-6 relative overflow-hidden transition-all duration-500`}
      data-testid="affirmation-cards"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
              <Sparkles className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Affirmation Cards</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Daily positive affirmations</p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowFavorites(!showFavorites);
              setCurrentIndex(0);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              showFavorites
                ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg"
                : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300"
            }`}
            data-testid="button-show-favorites"
          >
            <Star className={`w-4 h-4 ${showFavorites ? "fill-current" : ""}`} />
            Favorites ({favorites.length})
          </button>
        </div>

        {!showFavorites && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {Object.entries(AFFIRMATION_CATEGORIES).map(([key, cat]) => {
              const Icon = cat.icon;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedCategory(key);
                    setCurrentIndex(0);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                    selectedCategory === key
                      ? `bg-gradient-to-r ${cat.color} text-white shadow-lg`
                      : "bg-white/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800"
                  }`}
                  data-testid={`button-category-${key}`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={prevCard}
            disabled={affirmations.length === 0}
            className="w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            data-testid="button-prev-card"
            aria-label="Previous affirmation"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>

          <div 
            className={`w-full max-w-md aspect-[3/4] rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300 ${
              isFlipping ? "scale-95 opacity-80" : "scale-100 opacity-100"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color}`} />
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            
            <div className="absolute top-4 left-4">
              <CategoryIcon className="w-8 h-8 text-white/60" aria-hidden="true" />
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <p className="text-2xl md:text-3xl font-serif text-white text-center leading-relaxed drop-shadow-lg">
                "{currentAffirmation}"
              </p>
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
              {affirmations.slice(0, 8).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex % 8 ? "bg-white w-4" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={nextCard}
            disabled={affirmations.length === 0}
            className="w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800/80 flex items-center justify-center shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
            data-testid="button-next-card"
            aria-label="Next affirmation"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={shuffleCard}
            className="flex items-center gap-2 px-5 py-3 bg-white/80 dark:bg-gray-800/80 rounded-xl font-medium text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-xl transition-all"
            data-testid="button-shuffle"
          >
            <RefreshCw className="w-5 h-5" aria-hidden="true" />
            Shuffle
          </button>
          
          <button
            onClick={toggleFavorite}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all ${
              isFavorited
                ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white"
                : "bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300"
            }`}
            data-testid="button-favorite"
          >
            <Star className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} aria-hidden="true" />
            {isFavorited ? "Favorited" : "Favorite"}
          </button>
          
          <button
            onClick={shareAffirmation}
            className="flex items-center gap-2 px-5 py-3 bg-white/80 dark:bg-gray-800/80 rounded-xl font-medium text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-xl transition-all"
            data-testid="button-share"
          >
            <Share2 className="w-5 h-5" aria-hidden="true" />
            Share
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {showFavorites 
              ? `Viewing ${favorites.length} favorite affirmations`
              : `Card ${currentIndex + 1} of ${affirmations.length} • ${category.name}`
            }
          </p>
        </div>

        <div className="mt-6 p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" aria-hidden="true" />
            How to Use Affirmations
          </h4>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• Read the affirmation slowly and intentionally</li>
            <li>• Repeat it 3 times, either silently or aloud</li>
            <li>• Take a deep breath and feel the words resonate</li>
            <li>• Return to your favorites throughout the day</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
