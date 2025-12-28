import React from "react";

type Props = {
  variant?: "card" | "inline";
  showCrisis?: boolean;
};

export default function EthicsSafetyBlock({
  variant = "card",
  showCrisis = true,
}: Props) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    variant === "inline" ? (
      <div className="text-sm text-muted-foreground">{children}</div>
    ) : (
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="mb-2 text-sm font-medium">Safety & Ethics</div>
        <div className="text-sm text-muted-foreground">{children}</div>
      </div>
    );

  return (
    <Wrapper>
      <p className="mb-3">
        The Genuine Love Project provides reflection tools for self-awareness and
        emotional support. It is <span className="font-medium">not</span> a
        substitute for professional medical, psychological, or crisis care.
      </p>

      <ul className="mb-3 list-disc space-y-2 pl-5">
        <li>
          We do not diagnose conditions, prescribe treatments, or provide
          emergency services.
        </li>
        <li>
          Any AI responses (when enabled) are informational and supportive—not
          clinical advice.
        </li>
        <li>
          If something feels unsafe, please seek immediate help from local
          emergency services or a licensed professional.
        </li>
      </ul>

      {showCrisis && (
        <div className="rounded-lg bg-muted p-3">
          <div className="text-sm font-medium">If you’re in immediate danger</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Call your local emergency number right now. In the U.S., you can also
            call or text <span className="font-medium">988</span> (Suicide & Crisis
            Lifeline).
          </div>
        </div>
      )}
    </Wrapper>
  );
}