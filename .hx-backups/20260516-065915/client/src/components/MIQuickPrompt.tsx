import { MICROCOPY } from "@/lib/microcopy";

export function MIQuickPrompt() {
  const prompts = MICROCOPY.motivationMI;
  const prompt = prompts[Math.floor(Math.random() * prompts.length)];
  return (
    <div className="rounded-xl border p-4">
      <div className="text-sm font-semibold">Quick reflection</div>
      <div className="mt-2 text-sm opacity-90">{prompt}</div>
    </div>
  );
}