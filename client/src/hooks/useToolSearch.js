import { useMemo, useState } from "react";
import { toolRegistry } from "../tool-registry/toolRegistry";

export function useToolSearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const results = useMemo(() => {
    return toolRegistry.filter(tool => {
      const matchesQuery =
        JSON.stringify(tool)
          .toLowerCase()
          .includes(query.toLowerCase());

      const matchesCategory =
        category === "all"
          ? true
          : tool.category === category;

      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

  const categories = [
    "all",
    ...new Set(toolRegistry.map(t => t.category))
  ];

  return {
    query,
    setQuery,
    category,
    setCategory,
    results,
    categories
  };
}
