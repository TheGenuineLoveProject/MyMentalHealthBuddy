import { Info } from "lucide-react";

interface ConsentRibbonProps {
  className?: string;
}

export function ConsentRibbon({ className = "" }: ConsentRibbonProps) {
  return (
    <aside 
      className={`rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm ${className}`}
      role="note"
      aria-label="Consent and comfort notice"
      data-testid="wellness-consent-ribbon"
    >
      <div className="flex items-start gap-3">
        <Info className="h-4 w-4 mt-0.5 text-sky-400 shrink-0" />
        <div className="space-y-1">
          <p className="font-medium">Your comfort comes first</p>
          <p className="opacity-80">
            You can pause, skip, or stop at any time. There's no pressure to continue. 
            This is your space, at your pace.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default ConsentRibbon;
