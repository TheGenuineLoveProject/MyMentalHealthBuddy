import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { Heart, Calendar, Smile, Frown, Meh, Zap, Sun, Cloud, CloudRain, Sparkles, Send, Trash2 } from "lucide-react";

const EMOTIONS = [
  { name: "Happy", emoji: "😊", icon: Smile, color: "var(--mood-happy, #22c55e)" },
  { name: "Grateful", emoji: "🙏", icon: Heart, color: "var(--glp-gold, #d4af37)" },
  { name: "Calm", emoji: "😌", icon: Sun, color: "var(--mood-calm, #3b82f6)" },
  { name: "Neutral", emoji: "😐", icon: Meh, color: "var(--text-secondary, #64748b)" },
  { name: "Anxious", emoji: "😰", icon: Zap, color: "var(--mood-anxious, #f59e0b)" },
  { name: "Sad", emoji: "😢", icon: Frown, color: "var(--mood-sad, #6366f1)" },
  { name: "Overwhelmed", emoji: "😓", icon: Cloud, color: "var(--mood-tired, #8b5cf6)" },
  { name: "Hopeful", emoji: "🌟", icon: Sparkles, color: "var(--glp-sage, #8fbf9f)" },
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
      score: EMOTIONS.findIndex((e) => e.name === selectedEmotion.name) <= 3 ? 7 : 4,
    });
  }

  return (
    <div className="emotion-log-container" data-testid="emotion-log">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-[var(--glp-sage-10)] to-[var(--glp-paper)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--glp-sage)] to-[var(--glp-teal)] flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Emotion Log</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">How are you feeling right now?</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
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
                  className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                    selectedEmotion?.name === emotion.name
                      ? "border-[var(--glp-sage)] bg-[var(--glp-sage-10)] shadow-md scale-105"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                  data-testid={`emotion-${emotion.name.toLowerCase()}`}
                  aria-pressed={selectedEmotion?.name === emotion.name}
                >
                  <span className="text-2xl" aria-hidden="true">{emotion.emoji}</span>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{emotion.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="journal-text" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reflect on this feeling (optional)
            </label>
            <textarea
              id="journal-text"
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="What's on your mind? Take a moment to explore this feeling..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-[var(--glp-sage)] focus:border-transparent resize-none transition"
              data-testid="journal-textarea"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              This is your private space. Write freely without judgment.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-sm flex items-center gap-2" role="status">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              Entry saved. You're doing great by checking in with yourself.
            </div>
          )}

          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "var(--metallic-gold)", boxShadow: "0 4px 14px var(--metallic-gold-glow)" }}
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

        <div className="border-t border-gray-100 dark:border-gray-700">
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Recent Entries
            </h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center text-gray-500">Loading your entries...</div>
            ) : entries.length === 0 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <p>No entries yet. Start by logging how you feel above.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {entries.slice(0, 10).map((entry) => {
                  const emotionData = EMOTIONS.find((e) => e.name === entry.emotion) || EMOTIONS[3];
                  return (
                    <div
                      key={entry.id}
                      className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition group"
                      data-testid={`entry-${entry.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl" aria-hidden="true">{emotionData.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">{entry.emotion || entry.rating}</span>
                            <span className="text-xs text-gray-400">{formatDate(entry.createdAt)}</span>
                          </div>
                          {entry.content && (
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{entry.content}</p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteMutation.mutate(entry.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition"
                          aria-label={`Delete entry from ${formatDate(entry.createdAt)}`}
                          data-testid={`delete-entry-${entry.id}`}
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
