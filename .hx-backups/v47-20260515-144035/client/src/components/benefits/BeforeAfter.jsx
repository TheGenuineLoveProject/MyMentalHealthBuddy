import { ArrowRight } from "lucide-react";

const TRANSFORMATIONS = [
  {
    before: "My thoughts feel loud.",
    after: "I can slow down and choose one next step.",
  },
  {
    before: "I don't know what I feel.",
    after: "I can name it with simple words.",
  },
  {
    before: "I start then stop.",
    after: "I can keep a gentle rhythm without pressure.",
  },
  {
    before: "I'm hard on myself.",
    after: "I can practice self-respect in moments that matter.",
  },
  {
    before: "I feel stuck in patterns.",
    after: "I can notice patterns and try something different.",
  },
];

export default function BeforeAfter({ 
  className = "", 
  limit = 4,
  variant = "cards" 
}) {
  const items = TRANSFORMATIONS.slice(0, limit);
  
  if (variant === "inline") {
    return (
      <div className={`space-y-3 ${className}`} data-testid="before-after-inline">
        {items.map((item, idx) => (
          <div 
            key={idx}
            className="flex items-center gap-3 text-sm"
            data-testid={`transformation-${idx}`}
          >
            <span className="text-slate-500 dark:text-slate-400 line-through">
              {item.before}
            </span>
            <ArrowRight className="w-4 h-4 text-[var(--glp-sage)] flex-shrink-0" />
            <span className="text-slate-900 dark:text-white font-medium">
              {item.after}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section 
      className={`py-12 ${className}`}
      aria-labelledby="transformation-heading"
      data-testid="before-after"
    >
      <div className="max-w-4xl mx-auto px-4">
        <h2 
          id="transformation-heading"
          className="text-2xl font-semibold text-center text-slate-900 dark:text-white mb-2"
        >
          From Where You Are to Where You're Going
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
          Small shifts that some people notice with consistent practice
        </p>
        
        <div className="grid md:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-700"
              data-testid={`transformation-${idx}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      Before
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 italic">
                    "{item.before}"
                  </p>
                </div>
                
                <ArrowRight className="w-5 h-5 text-[var(--glp-sage)] flex-shrink-0 mt-6" />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-[var(--glp-sage)] uppercase tracking-wide">
                      After
                    </span>
                  </div>
                  <p className="text-slate-900 dark:text-white font-medium">
                    "{item.after}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-center text-xs text-slate-400 mt-6">
          These reflect what some users report. Individual experiences vary.
        </p>
      </div>
    </section>
  );
}

export { TRANSFORMATIONS };
