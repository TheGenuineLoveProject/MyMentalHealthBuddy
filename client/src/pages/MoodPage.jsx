// MyMentalHealthBuddy — MoodPage.jsx
// Uses React Query hooks from client/src/api/mood.js
// Route: /mood (wired in App.jsx via Wouter)

import React from "react";
import { useMoods, useSubmitMood } from "../api/mood";

const moodOptions = [
  { label: "💛 Calm", value: "calm", description: "I feel steady and okay." },
  { label: "😊 Light", value: "light", description: "I feel a bit hopeful." },
  { label: "😐 Neutral", value: "neutral", description: "I feel in the middle." },
  { label: "😔 Heavy", value: "heavy", description: "I feel weighed down." },
  { label: "💔 Hurting", value: "hurting", description: "I feel deeply in pain." },
];

export default function MoodPage() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useMoods();

  const {
    mutate: submitMood,
    isLoading: isSubmitting,
    isError: isSubmitError,
    error: submitError,
    isSuccess: isSubmitSuccess,
  } = useSubmitMood();

  const handleSelectMood = (value) => {
    if (isSubmitting) return;
    submitMood(value);
  };

  // Normalize mood list shape
  const moods = React.useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.moods)) return data.moods;
    return [];
  }, [data]);

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex flex-col items-center px-4 py-8"
      data-testid="mood-page"
    >
      <div className="w-full max-w-4xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
            MyMentalHealthBuddy · Mood
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">
            How is your <span className="text-emerald-300">heart</span> feeling right now?
          </h1>
          <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
            There is no “right” way to feel. This is a gentle place to notice your mood,
            without judgment. Every check-in is a step toward understanding yourself.
          </p>
        </header>

        {/* Mood buttons */}
        <section
          className="mb-10 grid gap-3 md:grid-cols-2"
          data-testid="mood-options"
        >
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              type="button"
              onClick={() => handleSelectMood(mood.value)}
              disabled={isSubmitting}
              className={`
                flex flex-col items-start justify-between rounded-xl border
                border-slate-700/70 bg-slate-900/70 px-4 py-3 text-left
                transition-all hover:border-emerald-300/80 hover:bg-slate-900
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-emerald-400/90
                disabled:opacity-60 disabled:cursor-wait
              `}
              data-testid={`mood-option-${mood.value}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg md:text-xl">{mood.label}</span>
              </div>
              <p className="text-xs md:text-sm text-slate-300">
                {mood.description}
              </p>
            </button>
          ))}
        </section>

        {/* Status + feedback */}
        <section className="mb-6" data-testid="mood-status">
          {isSubmitting && (
            <p className="text-xs md:text-sm text-emerald-300">
              Saving your mood… thank you for checking in with yourself. 💛
            </p>
          )}

          {isSubmitSuccess && !isSubmitting && (
            <p className="text-xs md:text-sm text-emerald-300">
              Mood saved. You matter here. One step at a time. 🌱
            </p>
          )}

          {isError && (
            <p className="text-xs md:text-sm text-rose-300">
              We couldn&apos;t load your past moods right now.
              {error?.message ? ` (${error.message})` : ""}  
              You didn&apos;t do anything wrong.
            </p>
          )}

          {isSubmitError && (
            <p className="text-xs md:text-sm text-rose-300">
              We couldn&apos;t save this mood yet.
              {submitError?.message ? ` (${submitError.message})` : ""}  
              Your feelings still count, even when the tech is glitchy.
            </p>
          )}
        </section>

        {/* History list */}
        <section
          className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-4 md:p-5"
          data-testid="mood-history"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm md:text-base font-medium text-slate-100">
              Your recent moods
            </h2>
            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              gentle history · not a diagnosis
            </span>
          </div>

          {isLoading && (
            <p className="text-xs md:text-sm text-slate-300">
              Loading your mood history… you&apos;re allowed to take up space here.
            </p>
          )}

          {!isLoading && moods.length === 0 && (
            <p className="text-xs md:text-sm text-slate-300">
              No moods saved yet. When you&apos;re ready, tap one of the mood cards above
              to begin your healing record.
            </p>
          )}

          {!isLoading && moods.length > 0 && (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {moods.map((entry, index) => {
                const moodLabel =
                  entry.label ||
                  entry.mood ||
                  entry.value ||
                  "unknown";

                // Try to format a timestamp if present
                let timestampText = "";
                if (entry.createdAt) {
                  try {
                    const date = new Date(entry.createdAt);
                    timestampText = date.toLocaleString();
                  } catch {
                    timestampText = entry.createdAt;
                  }
                }

                return (
                  <li
                    key={entry.id || entry._id || index}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs md:text-sm"
                    data-testid="mood-history-item"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-100">
                        {moodLabel.toString()}
                      </span>
                      {entry.note && (
                        <span className="text-[11px] text-slate-300">
                          {entry.note}
                        </span>
                      )}
                    </div>
                    {timestampText && (
                      <span className="text-[11px] text-slate-400">
                        {timestampText}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Gentle footer */}
        <footer className="mt-8 text-center text-[11px] md:text-xs text-slate-500">
          This page is for emotional tracking and reflection only — not a medical or
          crisis service. If you are in danger or thinking about self-harm,
          please reach out to local emergency services or a crisis hotline in your area. 💛
        </footer>
      </div>
    </main>
  );
}