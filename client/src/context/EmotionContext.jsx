import { createContext, useContext, useState, useCallback, useEffect } from "react";

const EMOTION_GRADIENTS = {
  joy: "from-amber-200 via-yellow-100 to-orange-100",
  calm: "from-teal-100 via-cyan-50 to-blue-100",
  sad: "from-slate-200 via-blue-100 to-indigo-100",
  anxious: "from-purple-100 via-pink-50 to-rose-100",
  loved: "from-rose-200 via-pink-100 to-red-100",
  hopeful: "from-emerald-100 via-teal-50 to-cyan-100",
  grateful: "from-amber-100 via-orange-50 to-yellow-100",
  neutral: "from-gray-100 via-slate-50 to-zinc-100",
  angry: "from-red-200 via-orange-100 to-amber-100",
  peaceful: "from-sky-100 via-blue-50 to-indigo-50",
  excited: "from-yellow-200 via-amber-100 to-orange-100",
  tired: "from-indigo-100 via-purple-50 to-blue-100"
};

const EMOTION_COLORS = {
  joy: "#fbbf24",
  calm: "#14b8a6",
  sad: "#6366f1",
  anxious: "#a855f7",
  loved: "#ec4899",
  hopeful: "#10b981",
  grateful: "#f59e0b",
  neutral: "#6b7280",
  angry: "#ef4444",
  peaceful: "#0ea5e9",
  excited: "#f97316",
  tired: "#8b5cf6"
};

const EMOTION_AFFIRMATIONS = {
  joy: [
    "Your joy is a gift to the world.",
    "Let this beautiful feeling radiate outward.",
    "You deserve every moment of this happiness."
  ],
  calm: [
    "In stillness, you find your strength.",
    "Peace flows through you like a gentle stream.",
    "You are centered and grounded."
  ],
  sad: [
    "It's okay to feel this way. Your feelings are valid.",
    "This too shall pass. You are stronger than you know.",
    "Sadness is part of healing. Honor your process."
  ],
  anxious: [
    "You are safe in this moment.",
    "Take a deep breath. You've overcome challenges before.",
    "Anxiety doesn't define you. You are resilient."
  ],
  loved: [
    "You are worthy of all the love you receive.",
    "Love surrounds you, always.",
    "Your heart knows how to give and receive love."
  ],
  hopeful: [
    "Beautiful things are on their way to you.",
    "Hope is the light that guides your path.",
    "Trust in the journey ahead."
  ],
  grateful: [
    "Gratitude opens the door to abundance.",
    "Every blessing in your life multiplies with appreciation.",
    "Your grateful heart attracts more good."
  ],
  neutral: [
    "It's okay to simply be.",
    "Not every moment needs to be intense.",
    "Find peace in the ordinary."
  ],
  angry: [
    "Your anger has something to teach you.",
    "Breathe through this feeling. It will pass.",
    "You can choose how to respond to this emotion."
  ],
  peaceful: [
    "Inner peace is your natural state.",
    "You carry tranquility within you.",
    "Peace begins with you."
  ],
  excited: [
    "Channel this energy into something beautiful.",
    "Your enthusiasm is contagious and inspiring.",
    "Embrace this vibrant moment."
  ],
  tired: [
    "Rest is not a reward. It's a necessity.",
    "Honor what your body is telling you.",
    "It's okay to slow down and recharge."
  ]
};

const EMOTION_PRACTICES = {
  joy: ["Gratitude journaling", "Share kindness", "Dance or move freely"],
  calm: ["Meditation", "Deep breathing", "Nature walk"],
  sad: ["Gentle journaling", "Self-compassion practice", "Reach out to someone you trust"],
  anxious: ["Box breathing", "Grounding exercise", "Progressive muscle relaxation"],
  loved: ["Love letter to self", "Heart meditation", "Express appreciation to others"],
  hopeful: ["Vision journaling", "Set an intention", "Affirmation practice"],
  grateful: ["Count blessings", "Thank someone", "Gratitude meditation"],
  neutral: ["Mindful observation", "Body scan", "Gentle stretching"],
  angry: ["Physical release", "Journaling raw feelings", "Cool-down breathing"],
  peaceful: ["Silent meditation", "Mindful tea ceremony", "Slow mindful walking"],
  excited: ["Creative expression", "Channel into action", "Share enthusiasm"],
  tired: ["Rest without guilt", "Restorative yoga", "Sleep hygiene ritual"]
};

const EmotionContext = createContext(null);

const HISTORY_LIMIT = 10;
const STORAGE_KEY = "emotion_history";

export function EmotionProvider({ children }) {
  const [currentEmotion, setCurrentEmotion] = useState("neutral");
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [emotionIntensity, setEmotionIntensity] = useState(0.5);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEmotionHistory(parsed);
          const latest = parsed[parsed.length - 1];
          if (latest?.emotion) {
            setCurrentEmotion(latest.emotion);
            setEmotionIntensity(latest.intensity || 0.5);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to load emotion history:", e);
    }
  }, []);

  const setEmotion = useCallback((emotion, intensity = 0.5) => {
    if (!EMOTION_GRADIENTS[emotion]) {
      console.warn(`Unknown emotion: ${emotion}`);
      return;
    }

    setCurrentEmotion(emotion);
    setEmotionIntensity(intensity);

    const entry = {
      emotion,
      intensity,
      timestamp: new Date().toISOString()
    };

    setEmotionHistory(prev => {
      const updated = [...prev, entry].slice(-HISTORY_LIMIT);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to save emotion history:", e);
      }
      return updated;
    });
  }, []);

  const getGradient = useCallback(() => {
    return EMOTION_GRADIENTS[currentEmotion] || EMOTION_GRADIENTS.neutral;
  }, [currentEmotion]);

  const getColor = useCallback(() => {
    return EMOTION_COLORS[currentEmotion] || EMOTION_COLORS.neutral;
  }, [currentEmotion]);

  const getAffirmation = useCallback(() => {
    const affirmations = EMOTION_AFFIRMATIONS[currentEmotion] || EMOTION_AFFIRMATIONS.neutral;
    return affirmations[Math.floor(Math.random() * affirmations.length)];
  }, [currentEmotion]);

  const getPractices = useCallback(() => {
    return EMOTION_PRACTICES[currentEmotion] || EMOTION_PRACTICES.neutral;
  }, [currentEmotion]);

  const getMostFrequentEmotion = useCallback(() => {
    if (emotionHistory.length === 0) return "neutral";
    
    const counts = emotionHistory.reduce((acc, entry) => {
      acc[entry.emotion] = (acc[entry.emotion] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";
  }, [emotionHistory]);

  const clearHistory = useCallback(() => {
    setEmotionHistory([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch (err) { console.warn("[storage-safe-write]", err); }
  }, []);

  const value = {
    currentEmotion,
    emotionIntensity,
    emotionHistory,
    setEmotion,
    getGradient,
    getColor,
    getAffirmation,
    getPractices,
    getMostFrequentEmotion,
    clearHistory,
    EMOTION_GRADIENTS,
    EMOTION_COLORS,
    EMOTION_AFFIRMATIONS,
    EMOTION_PRACTICES
  };

  return (
    <EmotionContext.Provider value={value}>
      {children}
    </EmotionContext.Provider>
  );
}

export function useEmotion() {
  const context = useContext(EmotionContext);
  if (!context) {
    throw new Error("useEmotion must be used within an EmotionProvider");
  }
  return context;
}

export default EmotionContext;
