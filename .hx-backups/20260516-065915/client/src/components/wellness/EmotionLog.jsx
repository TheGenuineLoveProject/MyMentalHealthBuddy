import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { Heart, Calendar, Smile, Frown, Meh, Zap, Sun, Cloud, Sparkles, Send, Trash2 } from "lucide-react";

const EMOTIONS = [
  { name: "Happy", emoji: "😊", icon: Smile, color: "#22c55e" },
  { name: "Grateful", emoji: "🙏", icon: Heart, color: "#d4af37" },
  { name: "Calm", emoji: "😌", icon: Sun, color: "#3b82f6" },
  { name: "Hopeful", emoji: "🌟", icon: Sparkles, color: "#8fbf9f" },
  { name: "Neutral", emoji: "😐", icon: Meh, color: "#64748b" },
  { name: "Anxious", emoji: "😰", icon: Zap, color: "#f59e0b" },
  { name: "Sad", emoji: "😢", icon: Frown, color: "#6366f1" },
  { name: "Overwhelmed", emoji: "😓", icon: Cloud, color: "#8b5cf6" },
];

const PASTEL_COLORS = [
  "bg-[#e8f5e9]", // sageGreen light
  "bg-[#fce4ec]", // dustyRose light
  "bg-[#e3f2fd]", // soft blue
  "bg-[#fff8e1]", // soft gold
];

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function EmotionLog({ onEntrySubmit }) {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [journalText, setJournalText] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["/api/mood"],
    staleTime: 30000,
  });

  const saveMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/mood", data),
    onSuccess: (newEntry) => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      setSuccess(true);
      setSelectedEmotion(null);
      setJournalText("");
      if (onEntrySubmit) onEntrySubmit(newEntry);
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: (err) => {
      setError(err.message || "Failed to save entry");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiRequest("DELETE", `/api/mood/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood"] });
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!selectedEmotion) {
      setError("Please select how you're feeling");
      return;
    }
    setError("");
    saveMutation.mutate({
      rating: selectedEmotion.name,
      emotion: selectedEmotion.name,
      content: journalText || null,
      score: EMOTIONS.findIndex((em) => em.name === selectedEmotion.name) <= 3 ? 7 : 4,
    });
  }

  return (
    <div className="emotion-log-container" data-testid="emotion-log">
      <div className="bg-softWhite dark:bg-gray-800 rounded-xl shadow-lg border border-sageGreen/20 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-sageGreen/20 dark:border-gray-700 bg-gradient-to-r from-sageGreen/10 to-softWhite">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sageGreen to-deepTeal flex items-center justify-center">
              <Heart className="w-5 h-5 text-softWhite" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-semibold text-deepTeal dark:text-white">Emotion Log</h2>
              <p className="font-sans text-sm text-deepTeal/70 dark:text-gray-400">How are you feeling right now?</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block font-sans text-sm font-medium text-deepTeal dark:text-gray-300 mb-3">
              Select your emotion
            </label>
            <div className="grid grid-cols-4 gap-3" role="group" aria-label="Select emotion">
              {EMOTIONS.map((emotion) => (
                <button
                  key={emotion.name}
                  type="button"
                  onClick={() => {
                    setSelectedEmotion(emotion);
                    setError("");
                  }}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 group ${
                    selectedEmotion?.name === emotion.name
                      ? "border-sageGreen bg-sageGreen/10 shadow-md scale-105"
                      : "border-sageGreen/20 dark:border-gray-600 hover:border-sageGreen/40 hover:bg-sageGreen/5 dark:hover:bg-gray-700"
                  }`}
                  data-testid={`emotion-${emotion.name.toLowerCase()}`}
                  aria-pressed={selectedEmotion?.name === emotion.name}
                >
                  <span 
                    className="text-2xl transition-all duration-200 group-hover:scale-110"
                    style={{ 
                      filter: selectedEmotion?.name === emotion.name 
                        ? `drop-shadow(0 0 8px ${emotion.color})` 
                        : 'none'
                    }}
                    aria-hidden="true"
                  >
                    {emotion.emoji}
                  </span>
                  <span className="font-sans text-xs font-medium text-deepTeal/80 dark:text-gray-300">{emotion.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="journal-text" className="block font-sans text-sm font-medium text-deepTeal dark:text-gray-300 mb-2">
              Reflect on this feeling (optional)
            </label>
            <textarea
              id="journal-text"
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="What's on your mind? Take a moment to explore this feeling..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-sageGreen/30 dark:border-gray-600 bg-softWhite dark:bg-gray-700 text-deepTeal dark:text-white placeholder-deepTeal/40 font-sans focus:ring-2 focus:ring-sageGreen focus:border-transparent resize-none transition"
              data-testid="journal-textarea"
            />
            <p className="mt-1 font-sans text-xs text-deepTeal/60 dark:text-gray-400">
              This is your private space. Write freely without judgment.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-dustyRose/20 dark:bg-red-900/20 text-dustyRose dark:text-red-400 font-sans text-sm" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-sageGreen/20 dark:bg-green-900/20 text-deepTeal dark:text-green-400 font-sans text-sm flex items-center gap-2" role="status">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Entry saved. You're doing great by checking in with yourself.
            </div>
          )}

          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="w-full py-3 px-4 rounded-xl font-sans font-semibold text-softWhite transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 bg-gradient-to-r from-metallicGold to-metallicGold-light hover:shadow-lg"
            style={{ boxShadow: "0 4px 14px rgba(212, 175, 55, 0.3)" }}
            data-testid="submit-emotion"
          >
            {saveMutation.isPending ? (
              "Saving..."
            ) : (
              <>
                <Send className="w-4 h-4" aria-hidden="true" />
                Log This Feeling
              </>
            )}
          </button>
        </form>

        <div className="border-t border-sageGreen/20 dark:border-gray-700">
          <div className="p-4 bg-sageGreen/5 dark:bg-gray-800/50">
            <h3 className="font-serif text-sm font-medium text-deepTeal dark:text-gray-300 flex items-center gap-2">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Recent Entries
            </h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto p-3 space-y-3">
            {isLoading ? (
              <div className="p-6 text-center font-sans text-deepTeal/60">Loading your entries...</div>
            ) : entries.length === 0 ? (
              <div className="p-6 text-center font-sans text-deepTeal/60 dark:text-gray-400">
                <p>No entries yet. Start by logging how you feel above.</p>
              </div>
            ) : (
              entries.slice(0, 10).map((entry, idx) => {
                const emotionData = EMOTIONS.find((e) => e.name === entry.emotion) || EMOTIONS[4];
                const pastelBg = PASTEL_COLORS[idx % PASTEL_COLORS.length];
                return (
                  <div
                    key={entry.id}
                    className={`p-4 rounded-xl ${pastelBg} dark:bg-gray-700/50 transition group hover:shadow-md`}
                    data-testid={`entry-${entry.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <span 
                        className="text-2xl transition-all duration-200 group-hover:scale-110"
                        style={{ filter: `drop-shadow(0 0 6px ${emotionData.color}40)` }}
                        aria-hidden="true"
                      >
                        {emotionData.emoji}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-sans font-medium text-deepTeal dark:text-white">{entry.emotion || entry.rating}</span>
                          <span className="font-sans text-xs text-deepTeal/50">{formatDate(entry.createdAt)}</span>
                        </div>
                        {entry.content && (
                          <p className="mt-1 font-sans text-sm text-deepTeal/80 dark:text-gray-300 line-clamp-2">{entry.content}</p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteMutation.mutate(entry.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-dustyRose/20 dark:hover:bg-red-900/20 text-deepTeal/40 hover:text-dustyRose transition"
                        aria-label={`Delete entry from ${formatDate(entry.createdAt)}`}
                        data-testid={`delete-entry-${entry.id}`}
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <style>{`
        .emotion-log-container button[data-testid^="emotion-"]:hover span[aria-hidden="true"] {
          filter: drop-shadow(0 0 8px currentColor);
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
