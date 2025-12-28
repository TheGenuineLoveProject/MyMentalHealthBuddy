import { useState, useCallback, useEffect } from "react";
import InsightCards from "@/components/insights/InsightCards";
import { buildInsightCards } from "@/lib/insights/insightEngine";
import JournalMirror from "@/features/mirror/JournalMirror";
import WisdomCard from "@/components/wisdom/WisdomCard";
import PatternInsights from "@/components/patterns/PatternInsights";
import { useToast } from "@/hooks/use-toast";

export default function MirrorPage() {
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

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <header>
          <h1 className="text-3xl font-semibold leading-tight">Journaling Mirror</h1>
          <p className="mt-2 text-sm opacity-80">
            A gentle reflection of your own words - not advice, not diagnosis, not authority.
          </p>
        </header>

        <WisdomCard mode="daily" />

        <JournalMirror onReflectionComplete={handleReflectionComplete} />

        {insightCards && (
          <InsightCards
            cards={insightCards.cards}
            tags={insightCards.tags}
            onSave={handleSaveReflection}
          />
        )}

        {savedReflections.length >= 3 && (
          <div>
            <button
              onClick={() => setShowPatterns(!showPatterns)}
              className="text-sm underline underline-offset-2 opacity-70 hover:opacity-100"
              data-testid="button-toggle-patterns"
            >
              {showPatterns ? "Hide your patterns" : "See patterns in your reflections"}
            </button>
            {showPatterns && (
              <div className="mt-4">
                <PatternInsights reflections={savedReflections} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
