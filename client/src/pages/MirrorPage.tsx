// client/src/pages/MirrorPage.tsx
import React, { useMemo, useState } from "react";
import JournalMirror from "../features/mirror/JournalMirror";

// Use whichever functions you already export.
// From your screenshots, these exist:
import {
  buildInsightCards,
  buildThematicCards,
  type InsightCard,
} from "../lib/insights/insightEngine";

function renderCard(card: InsightCard) {
  return (
    <div
      key={card.id}
      className="rounded-2xl border border-white/10 bg-black/20 p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white/90">{card.title}</h3>
          {card.subtitle ? (
            <p className="mt-1 text-xs text-white/60">{card.subtitle}</p>
          ) : null}
        </div>

        {/* badge / tag */}
        <div className="shrink-0">
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/70">
            {card.badge || card.tag}
          </span>
        </div>
      </div>

      <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/80">
        {card.body}
      </p>

      {card.cta ? (
        <p className="mt-3 text-xs text-white/60">→ {card.cta}</p>
      ) : null}
    </div>
  );
}

export default function MirrorPage() {
  const [reflectionText, setReflectionText] = useState("");
  const [cards, setCards] = useState<InsightCard[]>([]);

  const hasCards = cards.length > 0;

  const onReflection = (text: string) => {
    const safe = String(text || "").trim();
    setReflectionText(safe);

    // Prefer the “thematic” 3-card set if you want immediate, clean UI.
    // Fallback to buildInsightCards if needed.
    try {
      const thematic = buildThematicCards(safe);
      setCards(thematic.cards);
    } catch {
      setCards(buildInsightCards(safe));
    }
  };

  const headerSubtitle = useMemo(() => {
    if (!reflectionText) return "Write a few honest sentences. Then tap Reflect.";
    return "Your reflection is ready — your insight cards update instantly.";
  }, [reflectionText]);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-white/90">Mirror</h1>
        <p className="mt-2 text-sm text-white/60">{headerSubtitle}</p>
      </header>

      <div className="space-y-6">
        <JournalMirror
          title="Gentle Mirror"
          onReflection={(reflectionText) => onReflection(reflectionText)}
        />

        {hasCards ? (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-white/80">
              Insight Cards
            </h2>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {cards.map(renderCard)}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}