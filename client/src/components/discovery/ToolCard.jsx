import React from "react";

export default function ToolCard({ tool }) {
  return (
    <div className="rounded-2xl border p-6 shadow-sm bg-white/80">
      <div className="text-xs uppercase opacity-60 mb-2">
        {tool.category}
      </div>

      <h2 className="text-2xl font-semibold mb-3">
        {tool.title}
      </h2>

      <div className="mb-3 opacity-75">
        Emotional Goal: {tool.emotionalGoal}
      </div>

      <div className="mb-4">
        Intensity: {tool.intensity}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(tool.tags || []).map(tag => (
          <span
            key={tag}
            className="px-2 py-1 rounded-full border text-sm"
          >
            {tag}
          </span>
        ))}
      </div>

      <a
        href={tool.route}
        className="underline"
      >
        Open Tool
      </a>
    </div>
  );
}
