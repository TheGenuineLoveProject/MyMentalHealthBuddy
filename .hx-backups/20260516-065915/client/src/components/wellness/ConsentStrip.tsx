import { CRISIS_PATH, PAUSE_STOP_LINE, SAFETY_DISCLAIMER_SHORT } from "@/lib/safety";
import { Shield, ExternalLink } from "lucide-react";

export function ConsentStrip({
  tone = "gentle",
}: {
  tone?: "gentle" | "direct";
}) {
  const line =
    tone === "direct"
      ? "Pause, skip, or stop anytime. Only do what feels safe for you."
      : "You're in control. Pause, skip, or stop anytime. Choose what feels safe.";

  return (
    <div
      className="rounded-xl border border-border bg-card p-4 text-sm"
      data-testid="consent-strip"
    >
      <div className="flex items-start gap-3">
        <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
        <div className="space-y-2">
          <p className="font-medium text-foreground">{line}</p>
          <p className="text-muted-foreground">
            {SAFETY_DISCLAIMER_SHORT}{" "}
            <a
              className="text-primary hover:underline inline-flex items-center gap-1"
              href={CRISIS_PATH}
              data-testid="link-crisis-consent"
            >
              Need urgent help? Visit crisis resources
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </p>
          <p className="text-muted-foreground text-xs">{PAUSE_STOP_LINE}</p>
        </div>
      </div>
    </div>
  );
}
