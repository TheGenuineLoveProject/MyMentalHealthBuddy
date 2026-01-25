import type { InsightCard } from "@/lib/insights/insightEngine";
import { SEO } from "../SEO";
import SafetyFooter from "../ui/SafetyFooter";

function Badge({ text }: { text?: string }) {
  if (!text) return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="Insight Cards — The Genuine Love Project" description="Draw reflective insight cards for daily guidance." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Insight Cards</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs opacity-80">
      {text}
    </span>
  );
}

export default function InsightCards({
  cards,
  tags,
  onSave,
}: {
  cards: InsightCard[];
  tags?: string[];
  onSave?: () => void;
}) {
  if (!cards?.length) return (
    <div className="min-h-screen safe-padding hero-gradient">
      <SEO title="Insight Cards — The Genuine Love Project" description="Draw reflective insight cards for daily guidance." />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Insight Cards</h1>
        <p className="text-muted-foreground mb-8">
          This page is being refined. Use the navigation to explore tools while we finish this section.
        </p>
        <SafetyFooter />
      </main>
    </div>
  );

  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Your gentle insights</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Not a diagnosis — just supportive reflection to help you feel grounded.
          </p>
        </div>

        {onSave && (
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg border px-3 py-2 text-sm hover:bg-muted"
            data-testid="button-save-reflection"
          >
            Save to my reflections
          </button>
        )}
      </div>

      {tags && tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-medium">{c.title}</div>
                {c.subtitle && (
                  <div className="mt-1 text-xs text-muted-foreground">{c.subtitle}</div>
                )}
              </div>
              <Badge text={c.badge} />
            </div>

            <div className="mt-3 text-sm text-foreground/90 leading-relaxed">
              {c.body}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
