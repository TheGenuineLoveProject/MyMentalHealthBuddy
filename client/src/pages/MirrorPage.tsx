// client/src/pages/MirrorPage.tsx
import React, { useMemo, useState } from "react";
import JournalMirror from "../features/mirror/JournalMirror";

// Adjust this import to match your insightEngine export names.
// From your screenshots you have something like buildInsightCards in:
// client/src/lib/insights/insightEngine.ts
import { buildInsightCards } from "../lib/insights/insightEngine";

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
  const [reflection, setReflection] = useState<string>("");
  const [cards, setCards] = useState<InsightCard[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const hasCards = useMemo(() => Array.isArray(cards) && cards.length > 0, [cards]);

  function handleReflection(reflectionText: string) {
    setReflection(reflectionText);

    try {
      const out = buildInsightCards(reflectionText) as any;

      // Support both possible shapes:
      // (A) returns InsightCard[]
      // (B) returns { cards: InsightCard[], tags: string[] }
      if (Array.isArray(out)) {
        setCards(out);
        setTags([]);
      } else {
        setCards(Array.isArray(out?.cards) ? out.cards : []);
        setTags(Array.isArray(out?.tags) ? out.tags : []);
      }
    } catch {
      // If insight engine fails for any reason, still show reflection
      setCards([]);
      setTags([]);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white/90">Mirror</h1>
        <p className="mt-1 text-sm text-white/60">
          A gentle reflection tool + instant insight cards. Not medical advice.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEFT: Mirror input */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <JournalMirror title="Gentle Mirror" onReflection={handleReflection} />
        </div>

        {/* RIGHT: Insight Cards */}
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white/85">Insight Cards</h2>
            {tags.length ? (
              <div className="flex flex-wrap items-center gap-2">
                {tags.slice(0, 6).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          {!reflection ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
              Write something on the left and press <b>Reflect</b>. Your cards will appear here immediately.
            </div>
          ) : null}

          {reflection && !hasCards ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
              Reflection received. If cards aren’t showing, your `insightEngine` may have a TypeScript/shape mismatch.
              (The reflection still works.)
            </div>
          ) : null}

          {hasCards ? (
            <div className="space-y-3">
              {cards.map((c) => (
                <div key={c.id} className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-white/85">{c.title}</div>
                      {c.subtitle ? <div className="text-xs text-white/55">{c.subtitle}</div> : null}
                    </div>
                    {c.badge ? (
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70">
                        {c.badge}
                      </span>
                    ) : null}
                  </div>

                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-white/75">{c.body}</div>

                  {c.tags?.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {c.tags.slice(0, 6).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {c.cta ? <div className="mt-3 text-xs text-white/50">CTA: {c.cta}</div> : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}