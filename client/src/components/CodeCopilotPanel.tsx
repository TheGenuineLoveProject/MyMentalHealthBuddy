// client/src/components/CodeCopilotPanel.tsx
// Maria's Code Copilot Canva Panel 💛
// A gentle "developer buddy" card that lives on the dashboard.

type CodeCopilotPanelProps = {
  name?: string;
};

const CodeCopilotPanel = ({ name }: CodeCopilotPanelProps) => {
  const displayName = name || "Friend";

  const tips = [
    "Keep changes small and test often. Tiny steps = fewer errors.",
    "When something breaks, read the FIRST error line slowly. It usually tells you what file + line to inspect.",
    "If TypeScript or the build complains, fix the red squiggles in the editor before running npm scripts.",
    "Use your Guardian tools (ensure-tools, guardian, heal) before each deploy. They are here to protect you.",
    "You are allowed to learn at your own pace. No one is born knowing how to code.",
  ];

  const randomTip = tips[new Date().getMinutes() % tips.length];

  return (
    <section
      aria-label="Code Copilot helper"
      className="card p-6 mb-4 animate-fade-in"
      data-testid="panel-code-copilot"
      style={{
        background:
          "linear-gradient(135deg, rgba(15,23,42,1) 0%, rgba(30,64,175,1) 40%, rgba(56,189,248,1) 100%)",
        borderRadius: "1.5rem",
        boxShadow: "0 18px 45px rgba(15,23,42,0.45)",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2 max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-200">
            CODE COPILOT • DEV CANVA
          </p>
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            Hey {displayName}, you are not alone while you build this.
          </h2>
          <p className="text-sm text-sky-100/90 leading-relaxed">
            This panel is your gentle engineering buddy. It reminds you that
            every commit, every error, every fix is part of your growth — not a
            test you&apos;re failing. You are allowed to learn, pause, and try
            again.
          </p>
          <div className="mt-3 p-3 rounded-xl bg-slate-900/60 border border-sky-500/40 text-xs md:text-sm text-sky-100">
            <p className="font-semibold mb-1 text-sky-200">
              Today&apos;s Copilot Hint
            </p>
            <p>{randomTip}</p>
          </div>
        </div>

        <div className="w-full md:w-64 lg:w-72">
          <div
            className="relative rounded-2xl overflow-hidden p-4"
            style={{
              background:
                "radial-gradient(circle at 0% 0%, #22c55e 0%, transparent 45%), radial-gradient(circle at 100% 100%, #38bdf8 0%, transparent 45%), rgba(15,23,42,0.9)",
              border: "1px solid rgba(148, 163, 184, 0.7)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-100">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                Build Status Helper
              </span>
              <span className="text-[10px] text-slate-300">SAFE • HUMAN-LED</span>
            </div>

            <div className="space-y-2 text-xs text-slate-100">
              <p className="text-slate-200/90">
                ✅ Step 1: <code className="font-mono">npm run ensure-tools</code>
              </p>
              <p className="text-slate-200/90">
                ✅ Step 2: <code className="font-mono">npm run guardian</code>
              </p>
              <p className="text-slate-200/90">
                ✅ Step 3:{" "}
                <code className="font-mono">npm run build-and-start</code>
              </p>
              <p className="pt-1 text-[11px] text-slate-300/90">
                If something fails, breathe, read the message slowly, and fix
                one thing at a time. You&apos;re doing real engineering work. 💛
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-300/90">
              <span>Guardian-aligned • No hidden automation</span>
              <span className="font-mono text-emerald-300">ROGER.dev</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodeCopilotPanel;
