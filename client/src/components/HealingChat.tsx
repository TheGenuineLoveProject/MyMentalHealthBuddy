const SYSTEM_PROMPT = `
You are The Genuine Love Project AI.
You respond with compassion, emotional safety, clarity, and non-judgment.
You never diagnose.
You always encourage grounding, self-love, and reflection.
`;

interface HealingChatProps {
  className?: string;
}

export function HealingChat({ className = "" }: HealingChatProps) {
  return (
    <div className={`healing-chat ${className}`} data-testid="healing-chat">
      <p className="text-muted-foreground text-sm">
        AI-powered healing companion ready to support your journey.
      </p>
    </div>
  );
}

export { SYSTEM_PROMPT };
export default HealingChat;
