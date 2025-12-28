cat > client/src/features/community/SharedReflectionsPage.jsx <<'EOF'
import React from "react";

const REFLECTIONS = [
  {
    text: "I realized I don’t need to solve everything today. Rest is also progress.",
    author: "Anonymous"
  },
  {
    text: "Naming what I feel softly helped me stop fighting myself.",
    author: "Anonymous"
  },
  {
    text: "I can be both unfinished and worthy at the same time.",
    author: "Anonymous"
  }
];

export default function SharedReflectionsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-neutral-900">
        Shared Reflections
      </h1>

      <p className="mt-3 text-neutral-700">
        These reflections are shared to remind you that you are not alone.
        There is no ranking, no discussion, and no comparison.
      </p>

      <div className="mt-6 space-y-4">
        {REFLECTIONS.map((r, i) => (
          <div
            key={i}
            className="rounded-xl border bg-white/60 p-4"
          >
            <p className="text-neutral-800 leading-relaxed">
              “{r.text}”
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              — {r.author}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
EOF