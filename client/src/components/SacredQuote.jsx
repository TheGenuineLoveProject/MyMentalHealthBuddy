import { useState, useEffect, useMemo } from "react";
import { Volume2, VolumeX, RefreshCw, Feather } from "lucide-react";
import { useEmotion } from "@/context/EmotionContext.jsx";

const SACRED_QUOTES = [
  { text: "The wound is the place where the Light enters you.", author: "Rumi", mood: ["sad", "healing"] },
  { text: "What you seek is seeking you.", author: "Rumi", mood: ["hopeful", "balanced"] },
  { text: "Be patient with yourself. Self-growth is tender; it's holy ground.", author: "Stephen Covey", mood: ["anxious", "healing"] },
  { text: "You are not a drop in the ocean. You are the entire ocean in a drop.", author: "Rumi", mood: ["joy", "loved"] },
  { text: "The present moment is filled with joy and happiness. If you are attentive, you will see it.", author: "Thich Nhat Hanh", mood: ["calm", "grateful"] },
  { text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.", author: "Rumi", mood: ["healing", "loved"] },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", mood: ["anxious", "hopeful"] },
  { text: "You yourself, as much as anybody in the entire universe, deserve your love and affection.", author: "Buddha", mood: ["sad", "self-worth"] },
  { text: "The only way out is through.", author: "Robert Frost", mood: ["anxious", "healing"] },
  { text: "Let yourself be silently drawn by the strange pull of what you really love.", author: "Rumi", mood: ["calm", "hopeful"] },
  { text: "Healing is not linear. Be gentle with yourself.", author: "Unknown", mood: ["healing", "sad"] },
  { text: "You are braver than you believe, stronger than you seem, and smarter than you think.", author: "A.A. Milne", mood: ["anxious", "hopeful"] },
  { text: "The lotus flower blooms most beautifully from the deepest and thickest mud.", author: "Buddhist Proverb", mood: ["healing", "hopeful"] },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha", mood: ["calm", "balanced"] },
  { text: "Every moment is a fresh beginning.", author: "T.S. Eliot", mood: ["hopeful", "joy"] },
  { text: "You are allowed to be both a masterpiece and a work in progress simultaneously.", author: "Sophia Bush", mood: ["grateful", "self-worth"] },
  { text: "Stars can't shine without darkness.", author: "D.H. Sidebottom", mood: ["sad", "hopeful"] },
  { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela", mood: ["healing", "strength"] },
  { text: "Your calm mind is the ultimate weapon against your challenges.", author: "Bryant McGill", mood: ["calm", "anxious"] },
  { text: "Love is the bridge between you and everything.", author: "Rumi", mood: ["loved", "connection"] }
];

const MOOD_COLORS = {
  joy: { bg: "from-yellow-100 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/20", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-800" },
  calm: { bg: "from-sky-100 to-blue-100 dark:from-sky-900/20 dark:to-blue-900/20", text: "text-sky-700 dark:text-sky-300", border: "border-sky-200 dark:border-sky-800" },
  sad: { bg: "from-indigo-100 to-violet-100 dark:from-indigo-900/20 dark:to-violet-900/20", text: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-200 dark:border-indigo-800" },
  anxious: { bg: "from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800" },
  grateful: { bg: "from-rose-100 to-pink-100 dark:from-rose-900/20 dark:to-pink-900/20", text: "text-rose-700 dark:text-rose-300", border: "border-rose-200 dark:border-rose-800" },
  hopeful: { bg: "from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20", text: "text-green-700 dark:text-green-300", border: "border-green-200 dark:border-green-800" },
  loved: { bg: "from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20", text: "text-pink-700 dark:text-pink-300", border: "border-pink-200 dark:border-pink-800" },
  healing: { bg: "from-teal-100 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-900/20", text: "text-teal-700 dark:text-teal-300", border: "border-teal-200 dark:border-teal-800" },
  balanced: { bg: "from-violet-100 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/20", text: "text-violet-700 dark:text-violet-300", border: "border-violet-200 dark:border-violet-800" },
  neutral: { bg: "from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800", text: "text-gray-700 dark:text-gray-300", border: "border-gray-200 dark:border-gray-700" }
};

export default function SacredQuote({ className = "" }) {
  const { emotion } = useEmotion?.() || { emotion: "balanced" };
  const [currentQuote, setCurrentQuote] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getMoodQuote = (mood) => {
    const relevantQuotes = SACRED_QUOTES.filter(q => q.mood.includes(mood));
    const quotes = relevantQuotes.length > 0 ? relevantQuotes : SACRED_QUOTES;
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  useEffect(() => {
    setCurrentQuote(getMoodQuote(emotion));
  }, [emotion]);

  const refreshQuote = () => {
    setCurrentQuote(getMoodQuote(emotion));
  };

  const speakQuote = () => {
    if (!currentQuote) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = `${currentQuote.text}. By ${currentQuote.author}.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;

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

  const colors = MOOD_COLORS[emotion] || MOOD_COLORS.balanced;

  if (!currentQuote) return null;

  return (
    <div 
      className={`p-6 rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} backdrop-blur-sm ${className}`}
      data-testid="sacred-quote"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg bg-white/50 dark:bg-black/20 flex items-center justify-center`}>
            <Feather className={`w-4 h-4 ${colors.text}`} />
          </div>
          <span className={`text-sm font-medium ${colors.text}`}>Sacred Wisdom</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={speakQuote}
            className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-black/20 transition"
            title={isSpeaking ? "Stop reading" : "Read aloud"}
            data-testid="button-speak-quote"
          >
            {isSpeaking ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className={`w-4 h-4 ${colors.text}`} />
            )}
          </button>
          <button
            onClick={refreshQuote}
            className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-black/20 transition"
            title="New quote"
            data-testid="button-refresh-quote"
          >
            <RefreshCw className={`w-4 h-4 ${colors.text}`} />
          </button>
        </div>
      </div>

      <blockquote className="mb-3">
        <p className="text-lg font-serif italic text-gray-800 dark:text-gray-100 leading-relaxed">
          "{currentQuote.text}"
        </p>
      </blockquote>

      <p className={`text-sm ${colors.text} text-right`}>
        — {currentQuote.author}
      </p>
    </div>
  );
}
