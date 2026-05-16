import { useState } from "react";
import { 
  COGNITIVE_FRAMEWORKS, 
  getFrameworksByCategory, 
  getDailyFramework,
  type CognitiveFramework 
} from "@/lib/frameworks/cognitiveFrameworks";
import { Brain, Lightbulb, Network, Compass, Sparkles, Eye, ChevronRight } from "lucide-react";

const CATEGORY_ICONS: Record<CognitiveFramework["category"], typeof Brain> = {
  philosophy: Lightbulb,
  psychology: Brain,
  systems: Network,
  decision: Compass,
  creativity: Sparkles,
  metacognition: Eye,
};

const CATEGORY_LABELS: Record<CognitiveFramework["category"], string> = {
  philosophy: "Philosophy",
  psychology: "Psychology",
  systems: "Systems Thinking",
  decision: "Decision Making",
  creativity: "Creativity",
  metacognition: "Metacognition",
};

interface FrameworkExplorerProps {
  onSelectQuestion?: (question: string) => void;
}

export default function FrameworkExplorer({ onSelectQuestion }: FrameworkExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<CognitiveFramework["category"] | "all">("all");
  const [expandedFramework, setExpandedFramework] = useState<string | null>(null);
  const dailyFramework = getDailyFramework();

  const frameworks = selectedCategory === "all" 
    ? COGNITIVE_FRAMEWORKS 
    : getFrameworksByCategory(selectedCategory);

  const categories: (CognitiveFramework["category"] | "all")[] = [
    "all", "decision", "systems", "psychology", "philosophy", "metacognition", "creativity"
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-amber-400" />
          <span className="font-medium">Today's Framework</span>
        </div>
        <h3 className="text-lg font-semibold">{dailyFramework.name}</h3>
        <p className="text-sm opacity-80 mt-1">{dailyFramework.description}</p>
        <p className="text-sm italic mt-3 opacity-90">{dailyFramework.question}</p>
        {onSelectQuestion && (
          <button
            onClick={() => onSelectQuestion(dailyFramework.question)}
            className="mt-3 text-sm underline underline-offset-2 opacity-70 hover:opacity-100"
            data-testid="button-use-daily-framework"
          >
            Reflect on this question
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const Icon = cat === "all" ? Brain : CATEGORY_ICONS[cat];
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
                selectedCategory === cat
                  ? "bg-white/20 font-medium"
                  : "bg-white/5 opacity-70 hover:opacity-100"
              }`}
              data-testid={`button-category-${cat}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {cat === "all" ? "All" : CATEGORY_LABELS[cat]}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {frameworks.map((framework) => {
          const isExpanded = expandedFramework === framework.id;
          const Icon = CATEGORY_ICONS[framework.category];
          
          return (
            <div
              key={framework.id}
              className="rounded-xl border border-white/10 bg-black/10 overflow-hidden"
            >
              <button
                onClick={() => setExpandedFramework(isExpanded ? null : framework.id)}
                className="w-full flex items-center justify-between p-4 text-left"
                data-testid={`button-framework-${framework.id}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 opacity-70" />
                  <div>
                    <div className="font-medium">{framework.name}</div>
                    <div className="text-xs opacity-60">{framework.source}</div>
                  </div>
                </div>
                <ChevronRight className={`h-4 w-4 opacity-60 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-4">
                  <p className="text-sm opacity-80">{framework.description}</p>
                  
                  <div>
                    <div className="text-xs font-medium opacity-60 mb-2">STEPS</div>
                    <ol className="space-y-1.5">
                      {framework.steps.map((step, idx) => (
                        <li key={idx} className="flex gap-2 text-sm">
                          <span className="opacity-50">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="rounded-lg bg-white/5 p-3">
                    <div className="text-xs font-medium opacity-60 mb-1">KEY QUESTION</div>
                    <p className="text-sm italic">{framework.question}</p>
                    {onSelectQuestion && (
                      <button
                        onClick={() => onSelectQuestion(framework.question)}
                        className="mt-2 text-xs underline underline-offset-2 opacity-70 hover:opacity-100"
                        data-testid={`button-use-question-${framework.id}`}
                      >
                        Use this question
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      framework.difficulty === "foundational" ? "bg-green-500/20 text-green-300" :
                      framework.difficulty === "intermediate" ? "bg-blue-500/20 text-blue-300" :
                      "bg-purple-500/20 text-purple-300"
                    }`}>
                      {framework.difficulty}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
                      {CATEGORY_LABELS[framework.category]}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
