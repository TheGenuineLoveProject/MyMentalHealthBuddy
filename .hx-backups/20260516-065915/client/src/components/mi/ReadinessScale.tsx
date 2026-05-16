/**
 * ReadinessScale Component
 * Interactive 0-10 readiness scale based on Motivational Interviewing
 * Shows contextual prompts and follow-ups based on score
 */

import { useState } from "react";
import { getReadinessResponse, type ReadinessResponse } from "@/lib/miPatterns";
import { Gauge, TrendingUp, Heart } from "lucide-react";

interface ReadinessScaleProps {
  question?: string;
  context?: string;
  onScoreChange?: (score: number, response: ReadinessResponse) => void;
  className?: string;
}

export function ReadinessScale({
  question = "How ready are you to take one small step?",
  context,
  onScoreChange,
  className = ""
}: ReadinessScaleProps) {
  const [score, setScore] = useState<number | null>(null);
  const [hoveredScore, setHoveredScore] = useState<number | null>(null);

  const displayScore = hoveredScore ?? score;
  const response = displayScore !== null ? getReadinessResponse(displayScore) : null;

  const handleSelect = (value: number) => {
    setScore(value);
    const resp = getReadinessResponse(value);
    onScoreChange?.(value, resp);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "low": return "text-amber-600 dark:text-amber-400";
      case "medium": return "text-blue-600 dark:text-blue-400";
      case "high": return "text-emerald-600 dark:text-emerald-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  const getLevelBg = (level: string) => {
    switch (level) {
      case "low": return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
      case "medium": return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      case "high": return "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800";
      default: return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <div className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 ${className}`} data-testid="readiness-scale">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-full bg-rose-100 dark:bg-rose-800">
          <Gauge className="w-5 h-5 text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">Readiness Check</h3>
          {context && <p className="text-sm text-gray-500 dark:text-gray-400">{context}</p>}
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4">{question}</p>

      <div className="flex justify-between mb-2">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            onMouseEnter={() => setHoveredScore(value)}
            onMouseLeave={() => setHoveredScore(null)}
            className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
              score === value
                ? "bg-rose-500 text-white scale-110 shadow-lg"
                : hoveredScore === value
                ? "bg-rose-200 dark:bg-rose-700 text-rose-700 dark:text-rose-200"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            data-testid={`button-score-${value}`}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500 mb-4">
        <span>Not at all ready</span>
        <span>Completely ready</span>
      </div>

      {response && (
        <div className={`p-4 rounded-lg border ${getLevelBg(response.level)} transition-all`}>
          <div className="flex items-center gap-2 mb-2">
            {response.level === "high" ? (
              <TrendingUp className={`w-4 h-4 ${getLevelColor(response.level)}`} />
            ) : (
              <Heart className={`w-4 h-4 ${getLevelColor(response.level)}`} />
            )}
            <span className={`text-sm font-medium ${getLevelColor(response.level)} capitalize`}>
              {response.level} readiness
            </span>
          </div>
          
          <p className="text-gray-800 dark:text-gray-200 mb-2">{response.prompt}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">{response.followUp}</p>
        </div>
      )}

      {!response && (
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tap a number to check your readiness
          </p>
        </div>
      )}
    </div>
  );
}

export default ReadinessScale;
