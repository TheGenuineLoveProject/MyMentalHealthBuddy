import React, { useState } from "react";

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
    <section aria-label="Examples" className="rounded-xl border p-4">
      <h2 className="text-base font-semibold">Examples (choose your level)</h2>

      <div className="mt-3 flex flex-wrap gap-2">
        {tiers.map((t) => (
          <button
            key={t.label}
            type="button"
            onClick={() => setOpen(t.label)}
            className={`rounded-lg border px-3 py-1 text-sm ${
              open === t.label ? "font-semibold" : "opacity-80"
            }`}
            aria-pressed={open === t.label}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="mt-4 list-disc pl-5 text-sm">
        {tiers
          .find((t) => t.label === open)
          ?.examples.map((ex, i) => (
            <li key={i} className="mb-2">
              {ex}
            </li>
          ))}
      </ul>
    </section>
  );
}