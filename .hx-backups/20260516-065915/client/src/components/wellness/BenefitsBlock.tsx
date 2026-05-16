import { Check, Sparkles, Brain } from "lucide-react";

export type ReadingTier = "beginner" | "intermediate" | "advanced";

export interface BenefitItem {
  title: string;
  body: string;
}

interface BenefitsBlockProps {
  items?: BenefitItem[];
  title?: string;
  tier?: ReadingTier;
  className?: string;
}

const TIER_TITLES: Record<ReadingTier, string> = {
  beginner: "What you can do here",
  intermediate: "What you can do here",
  advanced: "Key capabilities",
};

const TIER_ICONS: Record<ReadingTier, typeof Check> = {
  beginner: Sparkles,
  intermediate: Check,
  advanced: Brain,
};

const TIER_STYLES: Record<ReadingTier, { icon: string; text: string; body: string }> = {
  beginner: {
    icon: "text-amber-400",
    text: "text-base",
    body: "text-sm opacity-80",
  },
  intermediate: {
    icon: "text-emerald-400",
    text: "text-sm font-medium",
    body: "text-sm opacity-80",
  },
  advanced: {
    icon: "text-violet-400",
    text: "text-sm font-semibold",
    body: "text-xs opacity-70",
  },
};

const DEFAULT_ITEMS: Record<ReadingTier, BenefitItem[]> = {
  beginner: [
    { title: "One tiny step", body: "Do just one small thing. No pressure." },
    { title: "Go at your pace", body: "Pause or stop anytime you need." },
    { title: "Feel calmer", body: "Simple tools that help you feel more grounded." },
  ],
  intermediate: [
    { title: "Build a doable next step", body: "Turn insight into a simple, repeatable plan." },
    { title: "Practice self-awareness", body: "Use calm tools that support regulation." },
    { title: "Track your progress", body: "Notice patterns over time without judgment." },
  ],
  advanced: [
    { title: "Develop sustainable practices", body: "Build habits that support long-term nervous system regulation." },
    { title: "Integrate insights systematically", body: "Connect reflection with evidence-informed strategies." },
    { title: "Cultivate metacognitive awareness", body: "Observe your patterns with curiosity and precision." },
  ],
};

export function BenefitsBlock({ 
  items,
  title,
  tier = "intermediate",
  className = ""
}: BenefitsBlockProps) {
  const effectiveItems = items || DEFAULT_ITEMS[tier];
  const effectiveTitle = title || TIER_TITLES[tier];
  const IconComponent = TIER_ICONS[tier];
  const styles = TIER_STYLES[tier];

  if (!effectiveItems?.length) return null;

  return (
    <section 
      className={`rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 ${className}`}
      aria-label="Benefits"
      role="region"
      data-testid="wellness-benefits-block"
      data-tier={tier}
    >
      <h3 className="text-base font-semibold mb-4">{effectiveTitle}</h3>
      
      <ul className="space-y-3" role="list">
        {effectiveItems.slice(0, 6).map((item, idx) => (
          <li 
            key={idx} 
            className="flex items-start gap-3"
            data-testid={`benefit-item-${idx}`}
          >
            <div className={`shrink-0 mt-0.5 ${styles.icon}`}>
              <IconComponent className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={styles.text}>{item.title}</p>
              <p className={styles.body}>{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default BenefitsBlock;
