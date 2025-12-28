import { TodaysInsight } from "@/components/insight/TodaysInsight";
import { StateTracker } from "@/components/state/StateTracker";
import { journalPrompts } from "@/data/journalPrompts";

export function DailyFlow() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: 24 }}>
      <TodaysInsight />
      <hr />

      <StateTracker />
      <hr />

      <section>
        <h3>Journal</h3>
        {Object.entries(journalPrompts).map(([group, prompts]) => (
          <div key={group}>
            <h4>{group}</h4>
            <ul>
              {prompts.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}