import { useState, useMemo } from "react";

const QUESTION_BANKS = {
  awareness: [
    "What are you noticing in your body right now?",
    "If this feeling had a color, what would it be?",
    "What part of this situation feels heaviest?",
    "What would you say to a friend in this exact moment?",
    "What truth are you not saying out loud?",
  ],
  agency: [
    "What is one thing you can control right now?",
    "What would be a kind next step - not a fix, just a step?",
    "What permission do you need to give yourself?",
    "What would 10% better look like?",
    "What boundary needs attention?",
  ],
  relationships: [
    "Who comes to mind when you think of safety?",
    "What do you wish someone understood about you?",
    "What kind of support would feel right, not overwhelming?",
    "When did you last feel truly seen?",
    "What relationship pattern keeps repeating?",
  ],
  meaning: [
    "What matters most to you right now - not in general, right now?",
    "What would make today feel worthwhile?",
    "What story are you telling yourself about this?",
    "What do you want to be true a year from now?",
    "If nothing needed to change, what would you appreciate?",
  ],
};

type Category = keyof typeof QUESTION_BANKS;

export default function QuestionReflection() {
  const [category, setCategory] = useState<Category>("awareness");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [response, setResponse] = useState("");
  const [responses, setResponses] = useState<{ q: string; a: string }[]>([]);

  const questions = useMemo(() => QUESTION_BANKS[category], [category]);
  const currentQuestion = questions[currentIndex];

  function saveAndNext() {
    if (response.trim()) {
      setResponses((prev) => [...prev, { q: currentQuestion, a: response.trim() }]);
    }
    setResponse("");
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  }

  function shuffleQuestion() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * questions.length);
    } while (newIndex === currentIndex && questions.length > 1);
    setCurrentIndex(newIndex);
    setResponse("");
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">Question-Only Reflection</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Socratic self-inquiry. The answers come from you.
        </p>
      </div>

      <div className="flex justify-center gap-2">
        {(Object.keys(QUESTION_BANKS) as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setCurrentIndex(0);
              setResponse("");
            }}
            className={`rounded-lg px-3 py-1.5 text-sm capitalize ${
              category === cat
                ? "bg-primary text-primary-foreground"
                : "border hover:bg-muted"
            }`}
            data-testid={`button-category-${cat}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="rounded-xl border p-6 text-center">
        <p className="text-lg font-medium leading-relaxed" data-testid="text-current-question">
          {currentQuestion}
        </p>
        <button
          onClick={shuffleQuestion}
          className="mt-3 text-sm text-muted-foreground underline underline-offset-4"
        >
          Different question
        </button>
      </div>

      <textarea
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Your reflection..."
        className="w-full min-h-[120px] rounded-xl border p-4 leading-relaxed resize-none"
        data-testid="textarea-question-response"
      />

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setResponse("")}
          disabled={!response.trim()}
          className="rounded-lg border px-4 py-2 text-sm disabled:opacity-50"
        >
          Clear
        </button>
        <button
          onClick={saveAndNext}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          data-testid="button-save-next"
        >
          {response.trim() ? "Save & Next" : "Skip to Next"}
        </button>
      </div>

      {responses.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Your Reflections ({responses.length})</h3>
          {responses.map((r, i) => (
            <div key={i} className="rounded-lg border p-3 text-sm">
              <p className="font-medium text-muted-foreground">{r.q}</p>
              <p className="mt-1">{r.a}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
