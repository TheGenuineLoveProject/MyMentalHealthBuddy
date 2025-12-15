import { MOOD_COPY } from "../copy/mood";

export default function MoodTracker() {
  return (
    <div className="page mood-tracker">
      <h1>{MOOD_COPY.intro.title}</h1>
      <p>{MOOD_COPY.intro.question}</p>

      <div className="mood-options">
        {["Calm", "Heavy", "Tired", "Hopeful", "Stressed"].map((mood) => (
          <button key={mood}>{mood}</button>
        ))}
      </div>

      <p>{MOOD_COPY.tags.label}</p>
      <small>{MOOD_COPY.tags.helper}</small>

      <p>{MOOD_COPY.reflection.prompt}</p>

      <div className="next-steps">
        <p>{MOOD_COPY.nextStep.label}</p>
        <ul>
          {MOOD_COPY.nextStep.options.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>

      <div className="actions">
        <button>{MOOD_COPY.exit.save}</button>
        <button>{MOOD_COPY.exit.journal}</button>
        <button>{MOOD_COPY.exit.end}</button>
      </div>
    </div>
  );
}