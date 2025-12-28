import type { InsightCard } from "@/lib/insights/insightEngine";

function Badge({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs text-muted-foreground">
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
  tags: string[];
  onSave?: () => void;
}) {
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
          >
            Save to my reflections
          </button>
        )}
      </div>

      {tags?.length > 0 && (
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