import { Shield, Accessibility, FileText, Heart, Phone, Lock } from "lucide-react";

const TRUST_SIGNALS = [
  {
    icon: Heart,
    title: "Consent-Based Design",
    description: "Pause, stop, or skip anytime. You're always in control.",
  },
  {
    icon: Shield,
    title: "Crisis Routing",
    description: "Urgent help resources always accessible at /crisis.",
  },
  {
    icon: FileText,
    title: "Evidence-Informed",
    description: "Tools built on research, translated for everyday use.",
  },
  {
    icon: Accessibility,
    title: "Accessible by Design",
    description: "WCAG AA compliant. Built for everyone.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your reflections belong to you. Delete anytime.",
  },
];

export default function TrustSignals({ 
  className = "", 
  variant = "full",
  showDisclaimer = true 
}) {
  if (variant === "compact") {
    return (
      <div 
        className={`flex flex-wrap justify-center gap-4 ${className}`}
        data-testid="trust-signals-compact"
      >
        {TRUST_SIGNALS.slice(0, 3).map((signal, idx) => {
          const Icon = signal.icon;
          return (
            <div 
              key={idx}
              className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
            >
              <Icon className="w-4 h-4 text-[var(--glp-sage)]" />
              <span>{signal.title}</span>
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div 
        className={`bg-[var(--glp-sage-10)] dark:bg-slate-800 py-4 px-6 rounded-xl ${className}`}
        data-testid="trust-signals-banner"
      >
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          {TRUST_SIGNALS.slice(0, 4).map((signal, idx) => {
            const Icon = signal.icon;
            return (
              <div key={idx} className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-[var(--glp-sage)]" />
                <span className="text-slate-700 dark:text-slate-300">{signal.title}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <section 
      className={`py-12 bg-slate-50 dark:bg-slate-900 ${className}`}
      aria-labelledby="trust-heading"
      data-testid="trust-signals"
    >
      <div className="max-w-5xl mx-auto px-4">
        <h2 
          id="trust-heading"
          className="text-2xl font-semibold text-center text-slate-900 dark:text-white mb-2"
        >
          Built With Care
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
          Your safety and autonomy come first
        </p>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {TRUST_SIGNALS.map((signal, idx) => {
            const Icon = signal.icon;
            return (
              <div 
                key={idx}
                className="text-center"
                data-testid={`trust-signal-${idx}`}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--glp-sage-10)] flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[var(--glp-sage)]" />
                </div>
                <h3 className="font-medium text-slate-900 dark:text-white mb-1">
                  {signal.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {signal.description}
                </p>
              </div>
            );
          })}
        </div>
        
        {showDisclaimer && (
          <div className="mt-10 p-4 bg-white dark:bg-slate-800 rounded-xl text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              <strong className="text-slate-700 dark:text-slate-300">Educational support only.</strong>{" "}
              This is not therapy, medical treatment, or crisis intervention.{" "}
              <a 
                href="/crisis" 
                className="text-[var(--glp-sage)] hover:underline font-medium"
              >
                If you need urgent help, visit our crisis page.
              </a>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export { TRUST_SIGNALS };
