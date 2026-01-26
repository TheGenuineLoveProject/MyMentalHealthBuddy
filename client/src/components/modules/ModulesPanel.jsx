// client/src/components/modules/ModulesPanel.jsx
import React from "react";

export default function ModulesPanel({ modules = [] }) {
  return (
    <section className="mt-8 space-y-6">
      {modules.map((m) => (
        <div key={m.key} className="rounded-xl border p-4">
          <h2 className="text-lg font-semibold">{m.title}</h2>
          <p className="text-sm opacity-80">{m.description}</p>

          <pre className="mt-3 whitespace-pre-wrap text-sm">
            {JSON.stringify(m.payload, null, 2)}
          </pre>
        </div>
      ))}
    </section>
  );
}