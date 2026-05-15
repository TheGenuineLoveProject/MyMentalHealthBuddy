import { type BenefitToken, type BenefitKey, getBenefitDescription, BENEFIT_LIBRARY } from "@/lib/benefits";

type BenefitItem = BenefitToken | { title: string; micro: string; family?: string };

interface BenefitBlockProps {
  benefits: BenefitItem[];
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
      {benefits.map((item, index) => {
        const isObject = typeof item === "object" && item !== null;
        const title = isObject ? item.title : item;
        const description = isObject ? item.micro : getBenefitDescription(item as BenefitToken);
        const key = isObject ? `${item.title}-${index}` : item;
        
        return (
          <div
            key={key}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="font-semibold text-foreground">{title}</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {description}
            </div>
          </div>
        );
      })}
    </div>
  );
}
