import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import { SEO } from "@/components/SEO";
import SafetyFooter from "@/components/ui/SafetyFooter";

const LEVEL_LABELS = {
  beginner: { label: "Beginner", color: "sage" },
  intermediate: { label: "Intermediate", color: "amber" },
  advanced: { label: "Advanced", color: "rose" },
};

function ExampleItem({ level, title, situation, action, result, isOpen, onToggle }) {
  const levelConfig = LEVEL_LABELS[level] || LEVEL_LABELS.beginner;
  const ChevronIcon = isOpen ? ChevronDown : ChevronRight;

  return (
    <div
      className="border rounded-xl overflow-hidden bg-background dark:bg-[hsl(var(--gray-900))] border-[hsl(var(--gray-200))] dark:border-[hsl(var(--gray-700))]"
      data-testid={`example-item-${level}`}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--sage-500))] focus-visible:ring-inset"
        aria-expanded={isOpen}
        data-testid={`button-toggle-example-${level}`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium bg-[hsl(var(--${levelConfig.color}-100))] dark:bg-[hsl(var(--${levelConfig.color}-800))] text-[hsl(var(--${levelConfig.color}-700))] dark:text-[hsl(var(--${levelConfig.color}-200))]`}
            data-testid={`badge-level-${level}`}
          >
            {levelConfig.label}
          </span>
          <span className="font-medium text-sm text-foreground" data-testid={`text-example-title-${level}`}>
            {title}
          </span>
        </div>
        <ChevronIcon className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-3" data-testid={`content-example-${level}`}>
          {situation && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Situation
              </span>
              <p className="text-sm text-foreground mt-0.5" data-testid={`text-situation-${level}`}>
                {situation}
              </p>
            </div>
          )}

          {action && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Action
              </span>
              <p className="text-sm text-foreground mt-0.5" data-testid={`text-action-${level}`}>
                {action}
              </p>
            </div>
          )}

          {result && (
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Result
              </span>
              <p className="text-sm text-foreground mt-0.5" data-testid={`text-result-${level}`}>
                {result}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExamplesAccordion({
  examples = [],
  title = "See examples",
  className = "",
  defaultOpen = null,
}) {
  const [openLevel, setOpenLevel] = useState(defaultOpen);

  const handleToggle = (level) => {
    setOpenLevel(openLevel === level ? null : level);
  };

  if (!examples || examples.length === 0) return null;

  return (
    <section
      className={`${className}`}
      aria-labelledby="examples-accordion-title"
      data-testid="examples-accordion"
    >
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
        <h4
          id="examples-accordion-title"
          className="text-sm font-semibold text-foreground"
          data-testid="text-examples-title"
        >
          {title}
        </h4>
      </div>

      <div className="space-y-2" data-testid="list-examples">
        {examples.map((example) => (
          <ExampleItem
            key={example.level}
            level={example.level}
            title={example.title}
            situation={example.situation}
            action={example.action}
            result={example.result}
            isOpen={openLevel === example.level}
            onToggle={() => handleToggle(example.level)}
          />
        ))}
      </div>
    </section>
  );
}
