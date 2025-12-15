import { healingPrompts } from "../content/healingPrompts";
import { PromptCard } from "../components/PromptCard";

export default function Heal() {
  return (
    <div className="min-h-screen bg-ivory px-6 py-12">
      <h1 className="font-playfair text-3xl text-center mb-6">
        Your Healing Space
      </h1>

      <div className="max-w-2xl mx-auto">
        {healingPrompts.map((p, i) => (
          <PromptCard key={i} prompt={p} />
        ))}
      </div>
    </div>
  );
}