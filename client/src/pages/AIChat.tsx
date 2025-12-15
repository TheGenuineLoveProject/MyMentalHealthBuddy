import { AI_CHAT_COPY } from "../copy/aiChat";
import { DISCLAIMERS_COPY } from "../copy/disclaimers";

export default function AIChat() {
  return (
    <div className="page ai-chat">
      <h1>{AI_CHAT_COPY.intro.title}</h1>
      <p>{AI_CHAT_COPY.intro.message}</p>

      <p className="disclaimer">{DISCLAIMERS_COPY.aiChat}</p>

      <div className="chat-box">
        <p>{AI_CHAT_COPY.startPrompt}</p>
      </div>

      <div className="next-steps">
        <p>{AI_CHAT_COPY.nextStep.label}</p>
        <ul>
          {AI_CHAT_COPY.nextStep.options.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
      </div>

      <div className="actions">
        <button>{AI_CHAT_COPY.exit.journal}</button>
        <button>{AI_CHAT_COPY.exit.mood}</button>
        <button>{AI_CHAT_COPY.exit.end}</button>
      </div>
    </div>
  );
}