import { useState } from "react";
import { BenefitBlock } from "@/components/benefits/BenefitBlock";
import { ConsentStrip } from "@/components/wellness/ConsentStrip";
import { ClarityCard } from "@/components/wellness/ClarityCard";
import { ExamplesAccordion } from "@/components/wellness/ExamplesAccordion";
import { SafetyFooterStrip } from "@/components/safety/SafetyFooterStrip";
import { CRISIS_PATH } from "@/lib/safety";
import { Info, Heart, Lightbulb, ChevronDown, ChevronUp } from "lucide-react";

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
    <main className="mx-auto max-w-5xl px-4 py-8">
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

      <div className="space-y-4">
        <ConsentStrip />
        <div className="text-sm">
          <a 
            className="text-primary hover:underline inline-flex items-center gap-1" 
            href={CRISIS_PATH}
            data-testid="link-crisis"
          >
            Need urgent help? Visit crisis resources
          </a>
        </div>
        <SafetyFooterStrip />
      </div>
    </main>
  );
}
