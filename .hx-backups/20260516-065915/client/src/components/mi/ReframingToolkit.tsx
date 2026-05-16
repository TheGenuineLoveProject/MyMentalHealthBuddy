/**
 * ReframingToolkit Component
 * Interactive NLP reframing patterns for self-talk
 * Educational tool - no manipulation, safe language only
 */

import { useState } from "react";
import { RefreshCw, Copy, ChevronDown, Lightbulb, MessageCircle, Compass, Pause } from "lucide-react";
import { 
  REFRAME_TEMPLATES, 
  getAllCategories, 
  getReframesByCategory,
  getRandomReframe,
  SAFE_NLP_DISCLAIMER,
  type ReframeTemplate 
} from "@/content/tools/nlpReframes";

interface ReframingToolkitProps {
  className?: string;
  compact?: boolean;
}

const CATEGORY_ICONS = {
  labeling: MessageCircle,
  reframe: Lightbulb,
  future: Compass,
  interrupt: Pause,
};

const CATEGORY_COLORS = {
  labeling: "blue",
  reframe: "amber",
  future: "purple",
  interrupt: "rose",
};

function ReframeCard({ template, onCopy }: { template: ReframeTemplate; onCopy: (text: string) => void }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = CATEGORY_ICONS[template.category];

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        data-testid={`button-reframe-${template.id}`}
      >
        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
          <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white">{template.name}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{template.description}</p>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pattern</p>
            <p className="text-gray-800 dark:text-gray-200 font-mono text-sm">{template.pattern}</p>
          </div>
          
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Example</p>
            <p className="text-gray-700 dark:text-gray-300 italic text-sm">"{template.example}"</p>
          </div>

          <button
            onClick={() => onCopy(template.pattern)}
            className="inline-flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            data-testid={`button-copy-${template.id}`}
          >
            <Copy className="w-4 h-4 mr-1.5" />
            Copy pattern
          </button>
        </div>
      )}
    </div>
  );
}

export function ReframingToolkit({ className = "", compact = false }: ReframingToolkitProps) {
  const [activeCategory, setActiveCategory] = useState<ReframeTemplate["category"] | "all">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const categories = getAllCategories();

  const templates = activeCategory === "all" 
    ? REFRAME_TEMPLATES 
    : getReframesByCategory(activeCategory);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRandom = () => {
    const random = getRandomReframe();
    setActiveCategory(random.category);
  };

  if (compact) {
    const randomTemplate = getRandomReframe();
    return (
      <div className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Reframe Practice
          </h3>
          <button
            onClick={handleRandom}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            data-testid="button-random-reframe"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 mb-3">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1">{randomTemplate.name}</p>
          <p className="text-gray-700 dark:text-gray-300 font-mono text-sm">{randomTemplate.pattern}</p>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-500">{randomTemplate.description}</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-background ${className}`} data-testid="reframing-toolkit">
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Reframing Toolkit
          </h3>
          <button
            onClick={handleRandom}
            className="inline-flex items-center px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            data-testid="button-surprise-me"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Surprise me
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              activeCategory === "all"
                ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            data-testid="button-category-all"
          >
            All
          </button>
          {categories.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.category];
            return (
              <button
                key={cat.category}
                onClick={() => setActiveCategory(cat.category)}
                className={`inline-flex items-center px-3 py-1.5 text-sm rounded-full transition-colors ${
                  activeCategory === cat.category
                    ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                data-testid={`button-category-${cat.category}`}
              >
                <Icon className="w-3.5 h-3.5 mr-1.5" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 space-y-3 max-h-[500px] overflow-y-auto">
        {templates.map((template) => (
          <ReframeCard key={template.id} template={template} onCopy={handleCopy} />
        ))}
      </div>

      <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
          {SAFE_NLP_DISCLAIMER}
        </p>
      </div>
    </div>
  );
}

export default ReframingToolkit;
