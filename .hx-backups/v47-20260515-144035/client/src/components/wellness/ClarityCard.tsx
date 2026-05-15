export type ClaritySpec = {
  what: string;
  why: string;
  who?: string;
  when?: string;
  where?: string;
  how: string;
};

export function ClarityCard({ spec }: { spec: ClaritySpec }) {
  const fields = [
    { key: "what", label: "WHAT" },
    { key: "why", label: "WHY" },
    { key: "who", label: "WHO" },
    { key: "when", label: "WHEN" },
    { key: "where", label: "WHERE" },
    { key: "how", label: "HOW" },
  ].filter((f) => spec[f.key as keyof ClaritySpec]);

  return (
    <section aria-label="Clarity" className="space-y-3" data-testid="clarity-card">
      <h2 className="text-base font-semibold text-foreground">What This Is</h2>
      <dl className="grid gap-3 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key} className="p-3 rounded-lg bg-muted/50">
            <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              {f.label}
            </dt>
            <dd className="text-sm text-foreground">
              {spec[f.key as keyof ClaritySpec]}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
