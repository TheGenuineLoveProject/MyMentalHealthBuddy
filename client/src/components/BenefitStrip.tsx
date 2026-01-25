import { BENEFITS } from "@/lib/benefits";

const keys = ["calm", "clarity", "consistency"] as const;

export function BenefitStrip() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {keys.map((k) => (
        <div key={k} className="rounded-xl border p-4">
          <div className="font-semibold">{BENEFITS[k].title}</div>
          <div className="text-sm opacity-80">{BENEFITS[k].body}</div>
        </div>
      ))}
    </div>
  );
}