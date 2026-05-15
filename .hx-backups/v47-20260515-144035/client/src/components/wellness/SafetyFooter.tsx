import { Link } from "wouter";
import { AlertTriangle, Heart, Phone } from "lucide-react";

interface SafetyFooterProps {
  showCrisisLink?: boolean;
  className?: string;
}

export function SafetyFooter({ 
  showCrisisLink = true,
  className = ""
}: SafetyFooterProps) {
  return (
    <footer 
      className={`mt-8 rounded-xl border border-white/10 bg-black/20 p-4 text-sm ${className}`}
      role="contentinfo"
      aria-label="Safety information"
      data-testid="wellness-safety-footer"
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-2">
          <Heart className="h-4 w-4 mt-0.5 text-rose-400 shrink-0" />
          <p className="opacity-80">
            This content is educational only — not therapy, medical advice, or treatment. 
            You can pause or stop anytime. Your pace, your choice.
          </p>
        </div>
        
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 mt-0.5 text-amber-400 shrink-0" />
          <p className="opacity-80">
            For ages 18+. If you're under 18, please explore with a trusted adult.
          </p>
        </div>

        {showCrisisLink && (
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="opacity-80">Need immediate support?</span>
            <Link 
              href="/crisis" 
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
              data-testid="link-crisis-footer"
            >
              Crisis Resources
            </Link>
          </div>
        )}
      </div>
    </footer>
  );
}

export default SafetyFooter;
