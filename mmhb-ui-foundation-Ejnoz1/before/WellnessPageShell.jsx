import { useState } from "react";
import { Link } from "wouter";
import { BenefitBlock } from "@/components/benefits/BenefitBlock";
import { ConsentStrip } from "@/components/wellness/ConsentStrip";
import { ClarityCard } from "@/components/wellness/ClarityCard";
import { ExamplesAccordion } from "@/components/wellness/ExamplesAccordion";
import { CRISIS_PATH } from "@/lib/safety";
import { Info, Heart, Lightbulb, ChevronDown, ChevronUp, Home, Sparkles, MessageCircle, BookOpen, Activity, LifeBuoy } from "lucide-react";
import "@/styles/wellness-shell.css";

const QUICK_NAV = [
  { href: "/", label: "Home", icon: Home, testId: "quicknav-home" },
  { href: "/start", label: "Start", icon: Sparkles, testId: "quicknav-start" },
  { href: "/ai-chat", label: "Chat", icon: MessageCircle, testId: "quicknav-chat" },
  { href: "/journal", label: "Journal", icon: BookOpen, testId: "quicknav-journal" },
  { href: "/state", label: "Mood", icon: Activity, testId: "quicknav-mood" },
  { href: CRISIS_PATH, label: "Crisis", icon: LifeBuoy, testId: "quicknav-crisis" },
];

export function WellnessPageShell({
  title,
  subtitle,
  benefits,
  clarity,
  examples,
  children,
}) {
  const [activeTab, setActiveTab] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const tabs = [
    { id: "benefits", label: "Benefits", icon: Heart },
    { id: "clarity", label: "What This Is", icon: Info },
    { id: "examples", label: "Examples", icon: Lightbulb },
  ];

  return (
    <div className="wellness-shell mx-auto max-w-5xl px-4 py-8">
      <nav
        aria-label="Quick navigation"
        className="mb-6 -mx-1 flex flex-nowrap items-center gap-3 overflow-x-auto scrollbar-thin"
        style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}
        data-testid="wellness-quicknav"
      >
        {QUICK_NAV.map(({ href, label, icon: Icon, testId }) => (
          <Link
            key={href}
            href={href}
            className="no-underline inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-full border border-[var(--glp-sage-20)] text-sm text-[var(--glp-sage-deep)] hover:border-[var(--glp-sage)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glp-sage)] transition-colors"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.5rem 0.875rem', minHeight: '40px', whiteSpace: 'nowrap' }}
            data-testid={testId}
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {title ? (
        <header className="mb-6">
          <h1 className="text-3xl font-semibold text-foreground">{title}</h1>
          {subtitle ? <p className="mt-2 text-muted-foreground">{subtitle}</p> : null}
        </header>
      ) : null}

      <section className="rounded-xl border border-border bg-card p-4 md:p-6 mb-6">
        {children}
      </section>

      <button
        onClick={() => setShowInfo(!showInfo)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 min-h-[44px] px-3 rounded-lg hover:bg-muted"
        data-testid="button-toggle-info"
        aria-expanded={showInfo}
      >
        {showInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        <span>Learn more about this tool</span>
      </button>

      {showInfo && (
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="flex border-b border-border" role="tablist" aria-label="Information tabs">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => setActiveTab(activeTab === tab.id ? null : tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors min-h-[44px] ${
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  data-testid={`tab-${tab.id}`}
                >
                  <IconComponent className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab && (
            <div
              id={`panel-${activeTab}`}
              role="tabpanel"
              className="p-4"
            >
              {activeTab === "benefits" && <BenefitBlock benefits={benefits} />}
              {activeTab === "clarity" && <ClarityCard spec={clarity} />}
              {activeTab === "examples" && <ExamplesAccordion tiers={examples} />}
            </div>
          )}

          {!activeTab && (
            <div className="p-4 text-sm text-muted-foreground text-center">
              Select a tab above to learn more
            </div>
          )}
        </div>
      )}

      {/*
        Footer — single ConsentStrip only.
        Previously rendered three near-duplicate safety blocks:
          1. <ConsentStrip /> (the canonical one)
          2. an inline "Need urgent help? Visit crisis resources" <a> link
          3. <SafetyFooterStrip /> (educational disclaimer + crisis link AGAIN)
        ConsentStrip already includes the educational disclaimer
        (SAFETY_DISCLAIMER_SHORT), the pause/stop line (PAUSE_STOP_LINE),
        and the crisis-resource link, so the other two were pure duplicates
        producing the "wall of identical disclaimers" the user observed in
        the page-text scrape (Reflective Journal, State Check-in, Crisis,
        AI Companion all showed the same three blocks repeating). Keeping
        the canonical ConsentStrip preserves every safety message and the
        crisis path while collapsing the visual noise to one calm card.
      */}
      <div className="space-y-4">
        <ConsentStrip />
      </div>
    </div>
  );
}
