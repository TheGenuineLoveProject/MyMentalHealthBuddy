// client/src/components/GuardianHeartPanel.tsx
// Guardian Heart — Maria's intention panel 💛
// This shows the same messages as the Guardian CLI tool,
// but inside the React dashboard UI.

import { Heart } from "lucide-react";

type GuardianHeartPanelProps = {
  name?: string | null;
};

const messages: string[] = [
  "You are not broken. You are learning.",
  "Your feelings are real and allowed.",
  "Honesty with yourself is healing, not punishment.",
  "You are allowed to rest while building something beautiful.",
  "You matter just by existing, not by how much you produce.",
  "Every user here is a human first, not a metric."
];

export default function GuardianHeartPanel({ name }: GuardianHeartPanelProps) {
  const firstName =
    typeof name === "string" && name.trim().length > 0
      ? name.trim().split(" ")[0]
      : "Friend";

  return (
    <section
      data-testid="guardian-heart-panel"
      aria-label="Guardian Heart message"
      className="card p-6 mb-8 animate-fade-in"
      style={{
        background:
          "linear-gradient(135deg, rgba(253, 242, 248, 1) 0%, rgba(219, 234, 254, 1) 40%, rgba(221, 239, 253, 1) 100%)",
        borderRadius: "1.5rem",
        boxShadow: "0 15px 40px rgba(15, 23, 42, 0.18)",
        border: "1px solid rgba(148, 163, 184, 0.35)"
      }}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-100/90">
          <Heart className="w-7 h-7 text-pink-500" aria-hidden="true" />
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Guardian Heart
            </p>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-800 mt-1">
              Hi {firstName}, you are safe to be honest here.
            </h2>
          </div>

          <ul className="space-y-1.5 text-sm md:text-base text-slate-700">
            {messages.map((msg, index) => (
              <li key={index} className="flex gap-2">
                <span className="mt-0.5 text-pink-500" aria-hidden="true">•</span>
                <span>{msg}</span>
              </li>
            ))}
          </ul>

          <p className="text-xs md:text-sm text-slate-500 mt-2">
            This space is here to protect humans with genuine love, kindness,
            and self-respect — including you, right now.
          </p>
        </div>
      </div>
    </section>
  );
}
