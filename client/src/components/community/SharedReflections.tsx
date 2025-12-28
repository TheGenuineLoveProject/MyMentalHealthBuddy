import { sharedReflections } from "@/data/sharedReflections";
import { safeTextOrFallback } from "@/safety/languageCheck";

export function SharedReflections() {
  return (
    <section style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>
      <h3>Shared Reflections (read-only)</h3>
      <p style={{ opacity: 0.8 }}>
        Anonymous reflections offered without advice, comparison, or metrics. Please take only what feels supportive.
      </p>

      <div style={{ display: "grid", gap: 12 }}>
        {sharedReflections.map((r) => (
          <div key={r.id} style={{ padding: 12, borderRadius: 10, border: "1px solid #f0f0f0" }}>
            {safeTextOrFallback(
              r.text,
              "A reflection is here. Please take only what feels kind and helpful."
            )}
          </div>
        ))}
      </div>
    </section>
  );
}