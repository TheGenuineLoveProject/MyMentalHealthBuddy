import { useState, useEffect } from "react";
import { Flame, RefreshCw, Heart, Bookmark, Sparkles, Star } from 'lucide-react';

const MOTIVATION_QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs", category: "work" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", category: "belief" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius", category: "persistence" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "dreams" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis", category: "goals" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", category: "challenges" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt", category: "belief" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson", category: "inner-strength" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill", category: "courage" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs", category: "authenticity" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb", category: "action" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair", category: "fear" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "persistence" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar", category: "beginning" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson", category: "destiny" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis", category: "challenges" },
  { text: "Your worth is not measured by your productivity.", author: "Unknown", category: "self-worth" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde", category: "authenticity" },
  { text: "The wound is the place where the light enters you.", author: "Rumi", category: "healing" },
  { text: "You have been criticizing yourself for years and it hasn't worked. Try approving of yourself and see what happens.", author: "Louise Hay", category: "self-love" },
];

const POWER_PHRASES = [
  "I am capable of amazing things",
  "Every challenge makes me stronger",
  "I choose to focus on what I can control",
  "My potential is unlimited",
  "I am worthy of success and happiness",
  "Today I choose courage over comfort",
  "I am the author of my story",
  "My past does not define my future",
];

const MICRO_CHALLENGES = [
  { text: "Send an encouraging message to someone", icon: "💬", points: 10 },
  { text: "Write down 3 things you're grateful for", icon: "📝", points: 15 },
  { text: "Take 5 deep breaths right now", icon: "🌬️", points: 5 },
  { text: "Drink a glass of water", icon: "💧", points: 5 },
  { text: "Do 10 jumping jacks or stretches", icon: "🏃", points: 10 },
  { text: "Say something kind about yourself out loud", icon: "🗣️", points: 15 },
  { text: "Tidy one small area around you", icon: "✨", points: 10 },
  { text: "Listen to an uplifting song", icon: "🎵", points: 10 },
];

export default function MotivationBooster() {
  const [currentQuote, setCurrentQuote] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [powerPhrase, setPowerPhrase] = useState("");
  const [todayChallenge, setTodayChallenge] = useState(null);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("motivation_booster_data");
    if (saved) {
      const data = JSON.parse(saved);
      setFavorites(data.favorites || []);
      setTotalPoints(data.points || 0);
      
      const today = new Date().toDateString();
      if (data.lastChallengeDate === today) {
        setChallengeComplete(data.challengeComplete || false);
      }
    }
    
    const quoteIndex = Math.floor(Math.random() * MOTIVATION_QUOTES.length);
    setCurrentQuote(MOTIVATION_QUOTES[quoteIndex]);
    
    const phraseIndex = Math.floor(Date.now() / 86400000) % POWER_PHRASES.length;
    setPowerPhrase(POWER_PHRASES[phraseIndex]);
    
    const challengeIndex = Math.floor(Date.now() / 86400000) % MICRO_CHALLENGES.length;
    setTodayChallenge(MICRO_CHALLENGES[challengeIndex]);
  }, []);

  const getNewQuote = () => {
    const available = MOTIVATION_QUOTES.filter((q) => q.text !== currentQuote?.text);
    const newQuote = available[Math.floor(Math.random() * available.length)];
    setCurrentQuote(newQuote);
  };

  const toggleFavorite = () => {
    if (!currentQuote) return;
    
    const isFav = favorites.some((f) => f.text === currentQuote.text);
    const newFavorites = isFav
      ? favorites.filter((f) => f.text !== currentQuote.text)
      : [...favorites, currentQuote].slice(-20);
    
    setFavorites(newFavorites);
    saveData({ favorites: newFavorites, points: totalPoints });
  };

  const completeChallenge = () => {
    if (!todayChallenge || challengeComplete) return;
    
    const newPoints = totalPoints + todayChallenge.points;
    setTotalPoints(newPoints);
    setChallengeComplete(true);
    
    saveData({ 
      favorites, 
      points: newPoints, 
      lastChallengeDate: new Date().toDateString(),
      challengeComplete: true,
    });
  };

  const saveData = (data) => {
    try { localStorage.setItem("motivation_booster_data", JSON.stringify(data)); } catch (err) { console.warn("[storage-safe-write]", err); }
  };

  const isFavorite = currentQuote && favorites.some((f) => f.text === currentQuote.text);

  return (
    <div className="card-elevated p-6 relative overflow-hidden" data-testid="motivation-booster">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-400/10 to-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Flame className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-display font-bold text-[var(--text)]" data-testid="text-motivation-title">
                Motivation Booster
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Ignite your inner fire</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
            <Star className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300" data-testid="text-points">
              {totalPoints} pts
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 mb-6">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 mb-1">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Today's Power Phrase</span>
          </div>
          <p className="font-bold text-[var(--text)]" data-testid="text-power-phrase">
            "{powerPhrase}"
          </p>
        </div>

        {!showFavorites ? (
          <>
            {currentQuote && (
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white mb-6">
                <p className="text-lg leading-relaxed mb-4 font-medium" data-testid="text-quote">
                  "{currentQuote.text}"
                </p>
                <p className="text-white/80 text-sm">— {currentQuote.author}</p>
                
                <div className="flex justify-center gap-3 mt-6">
                  <button
                    onClick={toggleFavorite}
                    className={`p-3 rounded-xl ${isFavorite ? "bg-white text-amber-500" : "bg-white/20 text-white hover:bg-white/30"} transition-colors`}
                    data-testid="button-favorite"
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                  </button>
                  <button
                    onClick={getNewQuote}
                    className="p-3 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-colors"
                    data-testid="button-new-quote"
                    aria-label="Get new quote"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {todayChallenge && (
              <div className={`p-4 rounded-xl ${challengeComplete ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-[var(--surface)]"} mb-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{todayChallenge.icon}</span>
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block">Today's Micro-Challenge</span>
                      <span className={`font-medium ${challengeComplete ? "text-emerald-600 line-through" : "text-[var(--text)]"}`}>
                        {todayChallenge.text}
                      </span>
                    </div>
                  </div>
                  {!challengeComplete ? (
                    <button
                      onClick={completeChallenge}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-medium text-sm"
                      data-testid="button-complete-challenge"
                    >
                      +{todayChallenge.points}
                    </button>
                  ) : (
                    <span className="text-emerald-500 font-medium">Done!</span>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={() => setShowFavorites(true)}
              className="w-full py-3 rounded-xl bg-[var(--surface)] text-[var(--text)] font-medium hover:bg-[var(--surface-hover)] flex items-center justify-center gap-2"
              data-testid="button-view-favorites"
            >
              <Bookmark className="w-4 h-4" />
              View Favorites ({favorites.length})
            </button>
          </>
        ) : (
          <div className="animate-fade-in-up">
            <h4 className="font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              Favorite Quotes
            </h4>
            {favorites.length === 0 ? (
              <p className="text-center text-[var(--text-muted)] py-8">
                No favorites yet. Heart some quotes to save them!
              </p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {favorites.map((quote, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[var(--surface)]">
                    <p className="text-[var(--text)] mb-1">"{quote.text}"</p>
                    <p className="text-sm text-[var(--text-muted)]">— {quote.author}</p>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setShowFavorites(false)}
              className="w-full py-3 rounded-xl bg-[var(--surface)] text-[var(--text)] font-medium hover:bg-[var(--surface-hover)]"
              data-testid="button-back"
            >
              Back to Quotes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
