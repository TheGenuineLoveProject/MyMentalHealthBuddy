import { Heart, Eye, Shield, Users, TrendingUp, Compass } from "lucide-react";

const BENEFIT_CATEGORIES = [
  {
    id: "calm",
    title: "Calm & Regulation",
    description: "Downshift, steady, breathe",
    icon: Heart,
    color: "var(--glp-sage)",
  },
  {
    id: "clarity",
    title: "Clarity & Insight",
    description: "Name feelings, identify patterns",
    icon: Eye,
    color: "var(--glp-gold)",
  },
  {
    id: "confidence",
    title: "Confidence & Agency",
    description: "Small steps, boundaries, self-respect",
    icon: Shield,
    color: "var(--glp-rose)",
  },
  {
    id: "connection",
    title: "Connection & Support",
    description: "Community, kindness-first",
    icon: Users,
    color: "var(--glp-sage)",
  },
  {
    id: "consistency",
    title: "Consistency & Growth",
    description: "Gentle routines, progress snapshots",
    icon: TrendingUp,
    color: "var(--glp-gold)",
  },
  {
    id: "meaning",
    title: "Meaning & Purpose",
    description: "Values, identity, direction",
    icon: Compass,
    color: "var(--glp-rose)",
  },
];

export default function BenefitsStrip({ 
  variant = "full", 
  className = "",
  showDescriptions = true 
}) {
  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap justify-center gap-4 ${className}`} data-testid="benefits-strip-compact">
        {BENEFIT_CATEGORIES.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <div
              key={benefit.id}
              className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-sm"
              data-testid={`benefit-${benefit.id}`}
            >
              <Icon className="w-4 h-4" style={{ color: benefit.color }} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {benefit.title}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <section 
      className={`py-12 ${className}`} 
      aria-labelledby="benefits-heading"
      data-testid="benefits-strip"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 
          id="benefits-heading" 
          className="text-2xl font-semibold text-center text-slate-900 dark:text-white mb-8"
        >
          What You Can Build Here
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {BENEFIT_CATEGORIES.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.id}
                className="flex flex-col items-center text-center p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                data-testid={`benefit-${benefit.id}`}
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: `${benefit.color}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: benefit.color }} />
                </div>
                <h3 className="font-medium text-slate-900 dark:text-white text-sm mb-1">
                  {benefit.title}
                </h3>
                {showDescriptions && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {benefit.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Educational support tools. Not medical advice. 
          <a href="/crisis" className="text-[var(--glp-sage)] hover:underline ml-1">
            Need urgent help?
          </a>
        </p>
      </div>
    </section>
  );
}

export { BENEFIT_CATEGORIES };
