import { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient.js";
import { ArrowLeft, Heart, Sparkles, ChevronRight, Send, Check, RefreshCw } from 'lucide-react';
import SEO from "../components/SEO";
import SafetyFooter from "../components/ui/ReflectionFooter";

const PROMPTS = [
  "What small moment brought you comfort today?",
  "Who made you feel seen or heard recently?",
  "What part of your body are you grateful for right now?",
  "What challenge taught you something valuable?",
  "What simple pleasure did you enjoy recently?",
  "What about today's weather are you grateful for?",
  "What memory makes you smile when you think of it?",
  "What skill or ability are you thankful to have?",
  "What made you laugh or feel light recently?",
  "What boundary you've set are you grateful for?",
  "What place feels safe and comforting to you?",
  "What relationship (past or present) helped shape who you are?",
  "What did you learn this week that you appreciate?",
  "What about your home brings you comfort?",
  "What act of kindness have you witnessed or received lately?",
  "What part of your self-reflection practice are you grateful for?",
  "What strength have you discovered in yourself?",
  "What about this season do you appreciate?",
  "What book, song, or artwork has touched your heart?",
  "What daily routine brings you a sense of stability?",
];

function getDailyPrompt() {
  const day = Math.floor(Date.now() / 86400000);
  return PROMPTS[day % PROMPTS.length];
}

function getRandomPrompt(exclude) {
  const filtered = PROMPTS.filter((p) => p !== exclude);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export default function GratitudePractice() {
  const [activePrompt, setActivePrompt] = useState(getDailyPrompt);
  const [response, setResponse] = useState("");
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef(null);

  const { data: todayData, isLoading: todayLoading, error: todayError } = useQuery({
    queryKey: ["/api/gratitude", "today"],
    queryFn: () => apiRequest("GET", "/api/gratitude/today"),
    retry: false,
    staleTime: 30000,
  });

  const { data: recentEntries = [], isLoading: historyLoading, error: historyError } = useQuery({
    queryKey: ["/api/gratitude"],
    queryFn: () => apiRequest("GET", "/api/gratitude"),
    retry: false,
    staleTime: 30000,
  });

  const { data: weeklySummary } = useQuery({
    queryKey: ["/api/gratitude", "weekly-summary"],
    queryFn: () => apiRequest("GET", "/api/gratitude/weekly-summary"),
    retry: false,
    staleTime: 60000,
  });

  const isSignedOut = !!(todayError || historyError);

  const saveMutation = useMutation({
    mutationFn: (data) => apiRequest("POST", "/api/gratitude", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/gratitude"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      setSaved(true);
      setResponse("");
      setTimeout(() => setSaved(false), 3000);
    },
  });

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.focus();
  }, []);

  function handleSave() {
    if (!response.trim()) return;
    saveMutation.mutate({
      prompt: activePrompt,
      response: response.trim(),
    });
  }

  function handleNewPrompt() {
    setActivePrompt(getRandomPrompt(activePrompt));
    setResponse("");
    setSaved(false);
    if (textareaRef.current) textareaRef.current.focus();
  }

  const todayEntries = todayData?.entries || [];
  const wordCount = response.trim() ? response.trim().split(/\s+/).length : 0;

  const weekStats = useMemo(() => {
    if (!weeklySummary) return null;
    return {
      gratitudeCount: weeklySummary.gratitudeCount || 0,
      moodAvg: weeklySummary.averageMoodScore ? Number(weeklySummary.averageMoodScore).toFixed(1) : null,
      moodEntryCount: weeklySummary.moodEntryCount || 0,
    };
  }, [weeklySummary]);

  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(135deg, var(--glp-paper), var(--glp-teal-50))" }}
    >
      <SEO
        title="Gratitude Practice — MyMentalHealthBuddy"
        description="A gentle daily practice to notice what's good. Write what you're grateful for and build appreciation over time."
      />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <nav className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm hover:opacity-80 transition-opacity"
            style={{ color: "var(--glp-sage)" }}
            data-testid="link-back-dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-2xl font-semibold mb-2"
              style={{ color: "var(--glp-sage-deep)" }}
              data-testid="text-gratitude-title"
            >
              Gratitude Practice
            </h1>
            <p style={{ color: "var(--glp-ink)", opacity: 0.7 }} className="text-sm leading-relaxed">
              Noticing what's good — even the smallest things — can gently shift how you feel.
              There's no minimum. One honest sentence is enough.
            </p>
          </div>

          {weekStats && weekStats.gratitudeCount > 0 && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl shrink-0"
              style={{
                background: "var(--glp-paper)",
                border: "1px solid var(--glp-sage-15)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
              data-testid="section-week-stats"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center shadow-md">
                <Heart className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold" style={{ color: "var(--glp-ink)" }} data-testid="text-week-count">
                    {weekStats.gratitudeCount}
                  </span>
                  <span className="text-xs" style={{ color: "var(--glp-sage)" }}>
                    this week
                  </span>
                </div>
                <p className="text-xs" style={{ color: "var(--glp-sage)", opacity: 0.8 }}>
                  {weekStats.gratitudeCount >= 7
                    ? "Beautiful consistency!"
                    : weekStats.gratitudeCount >= 3
                      ? "Growing your practice"
                      : "Every entry matters"}
                </p>
              </div>
            </div>
          )}
        </div>

        {todayEntries.length > 0 && (
          <div
            className="mb-6 p-4 rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(244,63,94,0.05), rgba(236,72,153,0.05))",
              border: "1px solid rgba(244,63,94,0.12)",
            }}
            data-testid="section-today-entries"
          >
            <p className="text-sm font-medium mb-2" style={{ color: "var(--glp-sage-deep)" }}>
              <Heart className="w-4 h-4 inline mr-1.5" style={{ color: "var(--glp-blush, #e8a0a0)" }} aria-hidden="true" />
              You've already expressed gratitude today
            </p>
            {todayEntries.map((entry, i) => (
              <div key={entry.id || i} className="mt-2 pl-6">
                <p className="text-xs italic mb-1" style={{ color: "var(--glp-sage)", opacity: 0.7 }}>
                  {entry.prompt}
                </p>
                <p className="text-sm" style={{ color: "var(--glp-ink)" }}>
                  {entry.response}
                </p>
              </div>
            ))}
            <p className="text-xs mt-3 pl-6" style={{ color: "var(--glp-sage)", opacity: 0.6 }}>
              You can always add more — gratitude has no limit.
            </p>
          </div>
        )}

        <div
          className="rounded-2xl overflow-hidden mb-6"
          style={{
            background: "var(--glp-paper)",
            border: "1px solid var(--glp-sage-15)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          }}
        >
          <div
            className="p-5"
            style={{
              background: "linear-gradient(135deg, var(--glp-sage-10, rgba(107,142,112,0.08)), var(--glp-teal-50))",
              borderBottom: "1px solid var(--glp-sage-15)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <Sparkles
                  className="w-5 h-5 mt-0.5 shrink-0"
                  style={{ color: "var(--glp-gold, #d4a574)" }}
                  aria-hidden="true"
                />
                <p className="text-sm font-medium" style={{ color: "var(--glp-ink)" }} data-testid="text-gratitude-prompt">
                  {activePrompt}
                </p>
              </div>
              <button
                onClick={handleNewPrompt}
                className="shrink-0 p-1.5 rounded-lg hover:opacity-70 transition-opacity"
                style={{ color: "var(--glp-sage)" }}
                aria-label="Get a different prompt"
                data-testid="button-new-prompt"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-5">
            <textarea
              ref={textareaRef}
              value={response}
              onChange={(e) => { setResponse(e.target.value); setSaved(false); }}
              className="w-full min-h-[140px] rounded-xl p-4 focus:outline-none focus:ring-2 resize-y text-sm"
              style={{
                background: "var(--glp-paper)",
                border: "1px solid var(--glp-sage-20)",
                color: "var(--glp-ink)",
              }}
              placeholder="Write what comes to mind... even a single word counts."
              aria-label="Write your gratitude response"
              data-testid="input-gratitude-response"
            />

            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs" style={{ color: "var(--glp-sage)", opacity: 0.6 }} data-testid="text-word-count">
                {wordCount} {wordCount === 1 ? "word" : "words"}
              </span>

              <div className="flex items-center gap-3">
                {saved && (
                  <span
                    className="text-sm font-medium flex items-center gap-1.5"
                    style={{ color: "var(--glp-sage)" }}
                    role="status"
                    data-testid="text-saved-status"
                  >
                    <Check className="w-4 h-4" aria-hidden="true" />
                    Saved with care
                  </span>
                )}
                {saveMutation.isError && (
                  <span
                    className="text-sm"
                    style={{ color: "var(--glp-blush)" }}
                    role="alert"
                    data-testid="text-save-error"
                  >
                    Could not save — please try again
                  </span>
                )}
                <button
                  onClick={handleSave}
                  disabled={!response.trim() || saveMutation.isPending}
                  className="rounded-xl px-5 py-2.5 font-medium text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{
                    background: response.trim()
                      ? "linear-gradient(135deg, var(--glp-sage), var(--glp-sage-deep))"
                      : "var(--glp-sage-20)",
                    boxShadow: response.trim() ? "0 4px 16px var(--glp-sage-30)" : "none",
                  }}
                  data-testid="button-save-gratitude"
                >
                  {saveMutation.isPending ? (
                    "Saving..."
                  ) : (
                    <>
                      <Send className="w-4 h-4" aria-hidden="true" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {isSignedOut && (
          <div
            className="mb-6 p-4 rounded-xl text-center"
            style={{
              background: "var(--glp-sage-10, rgba(107,142,112,0.08))",
              border: "1px solid var(--glp-sage-15)",
            }}
            data-testid="section-sign-in-prompt"
          >
            <p className="text-sm mb-2" style={{ color: "var(--glp-ink)" }}>
              Sign in to save your gratitude entries and track your practice over time.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-sm font-medium underline-offset-2 hover:underline transition-colors"
              style={{ color: "var(--glp-sage)" }}
              data-testid="link-sign-in"
            >
              Sign in <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        )}

        <RecentGratitude entries={recentEntries} isLoading={historyLoading} />

        <SafetyFooter variant="subtle" />
      </div>
    </div>
  );
}

function RecentGratitude({ entries, isLoading }) {
  const [showAll, setShowAll] = useState(false);

  if (isLoading) {
    return (
      <section className="mt-8" aria-label="Loading gratitude history">
        <div className="space-y-3 animate-pulse motion-reduce:animate-none">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-xl" style={{ background: "var(--glp-sage-10)" }} />
          ))}
        </div>
      </section>
    );
  }

  if (!entries || entries.length === 0) return null;

  const displayEntries = showAll ? entries : entries.slice(0, 5);

  return (
    <section className="mt-8" aria-label="Recent gratitude entries" data-testid="section-recent-gratitude">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold" style={{ color: "var(--glp-ink)" }}>
          Your Gratitude Garden
        </h2>
        <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "var(--glp-sage-10)", color: "var(--glp-sage)" }}>
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </span>
      </div>

      <div className="space-y-3">
        {displayEntries.map((entry, idx) => (
          <article
            key={entry.id || idx}
            className="rounded-xl p-4"
            style={{ background: "var(--glp-paper)", border: "1px solid var(--glp-sage-15)" }}
            data-testid={`card-gratitude-${idx}`}
          >
            <p className="text-xs italic mb-1.5" style={{ color: "var(--glp-sage)", opacity: 0.7 }}>
              {entry.prompt}
            </p>
            <p className="text-sm mb-2" style={{ color: "var(--glp-ink)" }}>
              {entry.response.length > 200 ? entry.response.slice(0, 200) + "\u2026" : entry.response}
            </p>
            <time className="text-xs" style={{ color: "var(--glp-sage)", opacity: 0.5 }}>
              {new Date(entry.createdAt).toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </time>
          </article>
        ))}
      </div>

      {entries.length > 5 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-4 w-full py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
          style={{
            background: "var(--glp-sage-10)",
            color: "var(--glp-sage)",
            border: "1px solid var(--glp-sage-15)",
          }}
          data-testid="button-show-all-gratitude"
        >
          Show all {entries.length} entries
        </button>
      )}
    </section>
  );
}
