import { ONBOARDING_COPY } from "../copy/onboarding";
import { DISCLAIMERS_COPY } from "../copy/disclaimers";

export default function Onboarding() {
  return (
    <div className="page onboarding">
      <h1>{ONBOARDING_COPY.welcome.title}</h1>
      <p>{ONBOARDING_COPY.welcome.subtitle}</p>

      <p>{ONBOARDING_COPY.explanation.whatItIs}</p>
      <p>{ONBOARDING_COPY.explanation.whatItIsNot}</p>

      <p className="disclaimer">{DISCLAIMERS_COPY.onboarding}</p>

      <h3>{ONBOARDING_COPY.start.question}</h3>
      <ul>
        {ONBOARDING_COPY.start.options.map((option) => (
          <li key={option}>
            <button>{option}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}