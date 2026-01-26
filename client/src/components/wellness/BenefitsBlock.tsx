import { Check } from "lucide-react";

interface BenefitsBlockProps {
  benefits?: string[];
  title?: string;
  className?: string;
}

const DEFAULT_BENEFITS = [
  "Choose one tiny, doable next step (no pressure).",
  "Turn insight into a simple plan you can repeat.",
  "Use calm tools that support self-awareness.",
];

export function BenefitsBlock({ 
  benefits = DEFAULT_BENEFITS,
  title = "How this helps",
  className = ""
}: BenefitsBlockProps) {
  if (!benefits?.length) return null;

  return (
    <section 
      className={`rounded-xl border border-white/10 bg-white/5 p-4 ${className}`}
      aria-label="Benefits"
      data-testid="wellness-benefits-block"
    >
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <ul className="space-y-2">
        {benefits.map((benefit, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <Check className="h-4 w-4 mt-0.5 text-emerald-400 shrink-0" />
            <span className="opacity-90">{benefit}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default BenefitsBlock;
