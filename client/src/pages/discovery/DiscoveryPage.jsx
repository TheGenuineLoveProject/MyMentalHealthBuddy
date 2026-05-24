import React from "react";
import ToolCard from "../../components/discovery/ToolCard";
import { useToolSearch } from "../../hooks/useToolSearch";

export default function DiscoveryPage() {
  const {
    query,
    setQuery,
    category,
    setCategory,
    results,
    categories
  } = useToolSearch();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-5xl font-bold mb-4">
        Discover Wellness Tools
      </h1>

      <p className="text-lg opacity-70 mb-8">
        Explore emotional wellness tools,
        calming systems, reflections,
        growth practices, and healing experiences.
      </p>

      <div className="grid gap-4 md:grid-cols-2 mb-8">

        <input
          className="border rounded-xl p-4"
          placeholder="Search tools..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="border rounded-xl p-4"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

      </div>

      <div className="mb-8 text-sm opacity-70">
        {results.length} tools discovered
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {results.map(tool => (
          <ToolCard
            key={tool.id}
            tool={tool}
          />
        ))}
      </div>

    </div>
  );
}
