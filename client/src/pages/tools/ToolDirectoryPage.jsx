import React, { useMemo, useState } from "react";
import { toolRegistry } from "../../tool-registry/toolRegistry";

export default function ToolDirectoryPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return toolRegistry.filter(tool =>
      JSON.stringify(tool)
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-4">
        Wellness Tool Universe
      </h1>

      <p className="text-lg opacity-80 mb-8">
        Explore calming tools, reflection systems,
        growth practices, emotional wellness supports,
        and guided experiences.
      </p>

      <input
        className="w-full border rounded-xl p-4 mb-8"
        placeholder="Search tools..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(tool => (
          <div
            key={tool.id}
            className="border rounded-2xl p-6 shadow-sm"
          >
            <div className="text-sm opacity-60 mb-2">
              {tool.category}
            </div>

            <h2 className="text-2xl font-semibold mb-3">
              {tool.title}
            </h2>

            <p className="opacity-70 mb-4">
              {tool.emotionalGoal}
            </p>

            <a
              href={tool.route}
              className="underline"
            >
              Open Tool
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
