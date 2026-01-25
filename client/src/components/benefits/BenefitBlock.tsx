import { type BenefitToken, getBenefitDescription } from "@/lib/benefits";

interface BenefitBlockProps {
  benefits: BenefitToken[];
  columns?: 2 | 3 | 4;
}

export function BenefitBlock({ benefits, columns = 3 }: BenefitBlockProps) {
  const gridCols = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  };

  return (
    <div className={`grid gap-3 ${gridCols[columns]}`}>
      {benefits.map((token) => (
        <div
          key={token}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
        >
          <div className="font-semibold text-[var(--text)]">{token}</div>
          <div className="mt-1 text-sm text-[var(--text-muted)]">
            {getBenefitDescription(token)}
          </div>
        </div>
      ))}
    </div>
  );
}
