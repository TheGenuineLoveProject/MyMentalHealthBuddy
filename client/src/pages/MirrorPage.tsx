// client/src/pages/MirrorPage.tsx
import React, { useMemo, useState } from "react";
import JournalMirror from "../features/mirror/JournalMirror";

// If your path differs, adjust it to your actual file location.
// You told me: client/src/lib/insights/insightEngine.ts
import { buildInsightCards } from "../lib/insights/insightEngine";
import { useCallback, useEffect } from "react";
import InsightCards from "@/components/insights/InsightCards";
import WisdomCard from "@/components/wisdom/WisdomCard";
import PatternInsights from "@/components/patterns/PatternInsights";
import { useToast } from "@/hooks/use-toast";

type InsightCard = {
  id: string;
  title: string;
  body: string;
  tags?: string[];
  subtitle?: string;
  badge?: string;
  cta?: string;
};

export default function MirrorPage() {
  const [reflectionText, setReflectionText] = useState<string>("");

  const cards: InsightCard[] = useMemo(() => {
    if (!reflectionText?.trim()) return [];
    try {
      return buildInsightCards(reflectionText) as any;
    } catch {
      return [];
    }
  }, [reflectionText]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-white/90">Mirror</h1>
        <p className="mt-1 text-sm text-white/60">
          A gentle reflection space for journaling support — not medical advice.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Mirror input */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <JournalMirror
            title="Gentle Mirror"
            onReflection={(txt) => setReflectionText(txt)}
          />
        </div>

        {/* Right: Insight Cards */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white/90">
              Insight Cards
            </h2>
            {reflectionText ? (
              <button
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10"
                onClick={() => setReflectionText("")}
              >
                Clear cards
              </button>
            ) : null}
          </div>

          {!reflectionText ? (
            <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/60">
              Write a reflection on the left, press <b>Reflect</b>, and your
              insight cards will appear here instantly.
            </div>
          ) : null}

          {cards.length ? (
            <div className="mt-4 grid gap-3">
              {cards.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-white/10 bg-black/30 p-4"
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-white/90">
                        {c.title}
                      </h3>
                      {c.subtitle ? (
                        <p className="mt-1 text-xs text-white/60">
                          {c.subtitle}
                        </p>
                      ) : null}
                    </div>

                    {c.badge ? (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
                        {c.badge}
                      </span>
                    ) : null}
                  </div>

                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">
                    {c.body}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap gap-2">
                      {(c.tags || []).slice(0, 6).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {c.cta ? (
                      <span className="text-xs text-white/55">{c.cta}</span>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {reflectionText && !cards.length ? (
            <div className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-100">
              Reflection received, but no cards were produced. That usually means
              the <code>buildInsightCards()</code> import path is wrong, or the
              function name differs. If you tell me your actual exports from
              <code>insightEngine.ts</code>, I’ll align it exactly.
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}

  const { toast } = useToast();
  const [insightCards, setInsightCards] = useState(null);
  const [lastReflection, setLastReflection] = useState(null);
  const [savedReflections, setSavedReflections] = useState([]);
  const [showPatterns, setShowPatterns] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("glp_saved_reflections");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const formatted = parsed.map((r) => ({
          timestamp: r.createdAt,
          text: r.reflection || "",
          tags: r.tags || [],
        }));
        setSavedReflections(formatted);
      } catch {
        setSavedReflections([]);
      }
    }
  }, []);

  const handleReflectionComplete = useCallback(({ inputText, reflection, mode }) => {
    const cards = buildInsightCards(inputText);
    setInsightCards(cards);
    setLastReflection({ inputText, reflection, mode, timestamp: new Date().toISOString() });
  }, []);

  function handleSaveReflection() {
    if (!insightCards || !lastReflection) return;
    const payload = {
      createdAt: lastReflection.timestamp,
      reflection: lastReflection.reflection,
      text: lastReflection.inputText,
      cards: insightCards.cards,
      tags: insightCards.tags,
    };
    const key = "glp_saved_reflections";
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const updated = [payload, ...existing].slice(0, 50);
    localStorage.setItem(key, JSON.stringify(updated));

    setSavedReflections(updated.map((r) => ({
      timestamp: r.createdAt,
      text: r.text || r.reflection || "",
      tags: r.tags || [],
    })));

    toast({
      title: "Reflection saved",
      description: "Added to your private reflection history.",
    });
  }
  {
    return (
      <main className="min-h-screen w-full">
        <JournalMirror />
      </main>
    );
  };
