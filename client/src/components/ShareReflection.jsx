import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { X, Heart, Sparkles, Eye, EyeOff, Loader2, BookOpen } from 'lucide-react';
import { apiRequest, queryClient } from "@/lib/queryClient";
import "@/styles/sacred-visuals.css";

const EMOTIONS = [
  { id: "joy", label: "Joy", emoji: "✨" },
  { id: "calm", label: "Calm", emoji: "🌊" },
  { id: "grateful", label: "Grateful", emoji: "💝" },
  { id: "hopeful", label: "Hopeful", emoji: "🌱" },
  { id: "healing", label: "Healing", emoji: "💚" },
];

export default function ShareReflection({ onClose, onSuccess }) {
  const [content, setContent] = useState("");
  const [emotion, setEmotion] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [isBlessing, setIsBlessing] = useState(false);

  const { data: journals } = useQuery({
    queryKey: ["/api/journals"],
    select: (data) => (Array.isArray(data) ? data.slice(0, 10) : []),
  });

  const shareMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/community/reflections", {
        content: content.trim(),
        emotion,
        isAnonymous,
        displayName: isAnonymous ? null : displayName.trim(),
        journalId: selectedJournal?.id || null,
        isBlessed: isBlessing
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/reflections"] });
      onSuccess?.();
    }
  });

  const selectJournalEntry = (journal) => {
    setSelectedJournal(journal);
    setContent(journal.text?.slice(0, 500) || "");
  };

  const handleBless = () => {
    setIsBlessing(true);
    shareMutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-lg bg-dawn dark:bg-dawn rounded-2xl shadow-2xl overflow-hidden glow-border glow-border-active"
        data-testid="share-reflection-modal"
      >
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-violet-400 via-purple-400 to-pink-400 opacity-20" />
        
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-gray-800 dark:text-white">
                  Share Your Light
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Inspire the community with your wisdom
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              data-testid="button-close-share"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {journals?.length > 0 && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Share from a journal entry (optional)
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {journals.map((journal) => (
                  <button
                    key={journal.id}
                    onClick={() => selectJournalEntry(journal)}
                    className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm transition ${
                      selectedJournal?.id === journal.id
                        ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 ring-2 ring-violet-500"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                    data-testid={`select-journal-${journal.id}`}
                  >
                    <BookOpen className="w-4 h-4 inline mr-1" />
                    {new Date(journal.createdAt).toLocaleDateString()}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Your reflection
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share a thought, insight, or moment of gratitude..."
              className="w-full h-32 p-4 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white resize-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              maxLength={500}
              data-testid="input-reflection-content"
            />
            <p className="text-xs text-gray-400 text-right mt-1">
              {content.length}/500
            </p>
          </div>

          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Emotion
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOTIONS.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setEmotion(e.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition ${
                    emotion === e.id
                      ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 ring-2 ring-violet-500"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                  data-testid={`emotion-${e.id}`}
                >
                  <span>{e.emoji}</span>
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mb-6 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
            <div className="flex items-center gap-2">
              {isAnonymous ? (
                <EyeOff className="w-5 h-5 text-gray-500" />
              ) : (
                <Eye className="w-5 h-5 text-violet-500" />
              )}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isAnonymous ? "Share anonymously" : "Show your name"}
              </span>
            </div>
            <button
              onClick={() => setIsAnonymous(!isAnonymous)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isAnonymous ? "bg-gray-300 dark:bg-gray-600" : "bg-violet-500"
              }`}
              data-testid="toggle-anonymous"
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  isAnonymous ? "left-1" : "left-7"
                }`}
              />
            </button>
          </div>

          {!isAnonymous && (
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Display name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="How would you like to be known?"
                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                maxLength={50}
                data-testid="input-display-name"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              data-testid="button-cancel-share"
            >
              Cancel
            </button>
            <button
              onClick={handleBless}
              disabled={!content.trim() || !emotion || shareMutation.isPending}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              data-testid="button-bless-share"
            >
              {shareMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Blessing...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  Bless This Entry
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
