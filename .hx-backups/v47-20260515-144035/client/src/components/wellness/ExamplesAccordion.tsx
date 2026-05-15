import { useState } from "react";

export type ExampleTier = {
  label: "Beginner" | "Intermediate" | "Advanced";
  examples: string[];
};

export function ExamplesAccordion({
  tiers = [],
}: {
  tiers?: ExampleTier[];
}) {
  const [open, setOpen] = useState<string>("Beginner");

  if (!tiers || tiers.length === 0) {
    return null;
  }

  return (
    <section aria-label="Examples" className="space-y-3" data-testid="examples-accordion">
      <h2 className="text-base font-semibold text-foreground">Examples (choose your level)</h2>

      <div className="flex flex-wrap gap-2">
        {tiers.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => setOpen(t.label)}
            className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
              open === t.label
                ? "bg-primary text-white border-primary font-semibold"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
            aria-pressed={open === t.label}
            data-testid={`button-tier-${t.label.toLowerCase()}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="list-disc pl-5 text-sm text-foreground space-y-2">
        {tiers
          .find((t) => t.label === open)
          ?.examples.map((ex, i) => (
            <li key={i} className="leading-relaxed">
              {ex}
            </li>
          ))}
      </ul>
    </section>
  );
}
