import { JOURNAL_COPY } from "../copy/journal";

export default function Journal() {
  return (
    <div className="page journal">
      <h1>{JOURNAL_COPY.intro.title}</h1>
      <p>{JOURNAL_COPY.intro.message}</p>

      <textarea
        placeholder={JOURNAL_COPY.editor.placeholder}
        rows={8}
      />

      <p className="helper">{JOURNAL_COPY.editor.helper}</p>

      <div className="next-steps">
        <p>{JOURNAL_COPY.nextStep.label}</p>
        <ul>
          {JOURNAL_COPY.nextStep.options.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>

      <div className="actions">
        <button>{JOURNAL_COPY.exit.save}</button>
        <button>{JOURNAL_COPY.exit.mood}</button>
        <button>{JOURNAL_COPY.exit.end}</button>
      </div>
    </div>
  );
}