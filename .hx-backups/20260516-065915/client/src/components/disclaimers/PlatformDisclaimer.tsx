import { AlertCircle, Heart, Shield } from "lucide-react";

interface DisclaimerProps {
  variant?: "platform" | "mirror" | "ai" | "community" | "crisis" | "therapy";
  className?: string;
}

const disclaimers = {
  platform: {
    icon: Shield,
    text: "This platform does not replace professional care. It exists to support reflection, not to provide diagnosis or treatment.",
    subtext: "You know yourself best.",
  },
  mirror: {
    icon: Heart,
    text: "This is a gentle reflection of what you wrote. It may not fully capture your experience.",
    subtext: "Please keep only what feels true to you.",
  },
  ai: {
    icon: Heart,
    text: "These observations are offered gently. They may not fully capture your experience.",
    subtext: "Please ignore anything that doesn't feel accurate or helpful. You know yourself best.",
  },
  community: {
    icon: Heart,
    text: "These reflections are shared anonymously. They are not advice, and they are not a measure of anyone's progress.",
    subtext: "Take what serves you.",
  },
  crisis: {
    icon: AlertCircle,
    text: "If you're in immediate danger, please contact emergency services or a crisis helpline.",
    subtext: "This platform cannot provide crisis intervention, but support is available.",
  },
  therapy: {
    icon: Shield,
    text: "This is not therapy. It's a space for reflection and self-exploration.",
    subtext: "Professional support may be helpful alongside this practice.",
  },
};

export function PlatformDisclaimer({ variant = "platform", className = "" }: DisclaimerProps) {
  const config = disclaimers[variant];
  const Icon = config.icon;

  return (
    <div
      data-testid={`disclaimer-${variant}`}
      className={`rounded-lg border border-sage-200 dark:border-sage-700 bg-sage-50/50 dark:bg-sage-800/30 p-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-sage-500 dark:text-sage-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm text-sage-700 dark:text-sage-300 leading-relaxed">
            {config.text}
          </p>
          {config.subtext && (
            <p className="text-xs text-sage-500 dark:text-sage-400 italic">
              {config.subtext}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function FooterReminder() {
  return (
    <p className="text-center text-xs text-sage-500 dark:text-sage-400 italic py-4">
      You know yourself best. Take what serves you.
    </p>
  );
}

export function GentleReminder({ text }: { text: string }) {
  return (
    <p className="text-xs text-sage-500 dark:text-sage-400 italic">
      {text}
    </p>
  );
}
