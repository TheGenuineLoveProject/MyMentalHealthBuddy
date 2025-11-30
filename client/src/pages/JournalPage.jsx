// MyMentalHealthBuddy — JournalPage.jsx
// Frontend journaling UI wired to /api/journal using React Query
// Replit compliant · Wouter routing · Healing UI

import React, { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient
} from "@tanstack/react-query";

const fetchJournal = async () => {
  const res = await fetch("/api/journal");
  if (!res.ok) throw new Error("Failed to load journal entries");
  return res.json();
};

const submitJournal = async (entry) => {
  const res = await fetch("/api/journal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error("Failed to save journal entry");
  return res.json();
};

export default function JournalPage() {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["journal"],
    queryFn: fetchJournal,
  });

  const {
    mutate: saveEntry,
    isLoading: isSaving,
    isSuccess: saveSuccess,
    isError: isSaveError,
    error: saveError,
  } = useMutation({
    mutationFn: submitJournal,
    onSuccess: () => {
      queryClient.invalidateQueries(["journal"]);
      setText("");
    },
  });

  const handleSave = () => {
    if (!text.trim()) return;
    saveEntry({ text });
  };

  const entries = Array.isArray(data?.entries)
    ? data.entries
    : Array.isArray(data)
    ? data
    : [];

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50 px-4 py-8 flex flex-col items-center"
      data-testid="journal-page"
    >
      <div className="w-full max-w-4xl">
        {/* HEADER */}
        <header className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
            MyMentalHealthBuddy · Journal
          </p>

          <h1 className="text-3xl md:text-4xl font-semibold mb-2">
            What&apos;s on your <span className="text-emerald-300">mind</span> and heart?
          </h1>

          <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
            This journal is your safe, private place to speak your truth honestly.
            No judgment. Just space for you.
          </p>
        </header>

        {/* JOURNAL INPUT */}
        <section className="mb-10" data-testid="journal-input-section">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write what you feel, what hurts, what heals…"
            rows={6}
            disabled={isSaving}
            className="
              w-full rounded-xl border border-slate-700/70 bg-slate-900/70 p-4
              text-slate-100 text-sm md:text-base resize-none
              focus:outline-none focus:ring-2 focus:ring-emerald-400
              disabled:opacity-70 disabled:cursor-wait
            "
            data-testid="journal-textarea"
          ></textarea>

          <button
            onClick={handleSave}
            disabled={isSaving || !text.trim()}
            className="
              mt-3 px-5 py-2 rounded-lg bg-emerald-500 text-slate-900 font-medium
              hover:bg-emerald-400 transition disabled:opacity-60 disabled:cursor-wait
            "
            data-testid="journal-save-btn"
          >
            {isSaving ? "Saving…" : "Save Entry"}
          </button>

          {/* Status messages */}
          <div className="mt-2 text-sm">
            {saveSuccess && (
              <p className="text-emerald-300" data-testid="journal-save-success">
                Saved. Your voice matters. Keep going. 💛
              </p>
            )}

            {isSaveError && (
              <p className="text-rose-300" data-testid="journal-save-error">
                Could not save entry.
                {saveError?.message ? ` (${saveError.message})` : ""}
              </p>
            )}
          </div>
        </section>

        {/* JOURNAL HISTORY */}
        <section
          className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 md:p-5"
          data-testid="journal-history"
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm md:text-base font-medium text-slate-100">
              Your past entries
            </h2>
            <span className="text-[11px] tracking-[0.15em] text-slate-500">
              private & safe
            </span>
          </div>

          {isLoading && (
            <p className="text-slate-300 text-sm">Loading your thoughts…</p>
          )}

          {isError && (
            <p className="text-rose-300 text-sm">
              Could not load journal entries.
              {error?.message ? ` (${error.message})` : ""}
            </p>
          )}

          {!isLoading && entries.length === 0 && (
            <p
              className="text-slate-300 text-sm"
              data-testid="journal-empty"
            >
              No entries yet. When you’re ready, write something above.
            </p>
          )}

          {!isLoading && entries.length > 0 && (
            <ul className="space-y-3 max-h-80 overflow-y-auto">
              {entries.map((entry, idx) => {
                const timestamp = entry.createdAt
                  ? new Date(entry.createdAt).toLocaleString()
                  : "";

                return (
                  <li
                    key={entry.id || idx}
                    className="
                      rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-3
                      text-xs md:text-sm
                    "
                    data-testid="journal-history-item"
                  >
                    <p className="text-slate-100 mb-1 whitespace-pre-wrap">
                      {entry.text}
                    </p>

                    <p className="text-[10px] text-slate-500">
                      {timestamp}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* FOOTER */}
        <footer className="mt-8 text-center text-[11px] md:text-xs text-slate-500">
          This journaling tool is for reflection, grounding, and emotional wellness—
          not for crisis support or medical diagnosis. 💛
        </footer>
      </div>
    </main>
  );
}