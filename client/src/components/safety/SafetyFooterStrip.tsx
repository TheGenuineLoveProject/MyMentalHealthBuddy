import { 
  CRISIS_PATH, 
  SAFETY_DISCLAIMER_SHORT, 
  AGE_18_NOTICE,
  PAUSE_STOP_LINE 
} from "@/lib/safety";

interface SafetyFooterStripProps {
  variant?: "compact" | "full";
}

export function SafetyFooterStrip({ variant = "compact" }: SafetyFooterStripProps) {
  return (
    <footer className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--text-muted)]">
      <div className="space-y-2">
        <p>{SAFETY_DISCLAIMER_SHORT}</p>
        {variant === "full" && (
          <>
            <p>{AGE_18_NOTICE}</p>
            <p>{PAUSE_STOP_LINE}</p>
          </>
        )}
        <p>
          <a 
            href={CRISIS_PATH} 
            className="underline text-[var(--primary)] hover:opacity-80"
            data-testid="link-crisis-footer"
          >
            Need urgent help? Visit our crisis resources.
          </a>
        </p>
      </div>
    </footer>
  );
}
