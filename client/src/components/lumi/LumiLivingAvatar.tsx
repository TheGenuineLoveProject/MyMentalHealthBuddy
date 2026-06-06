import "./LumiLivingAvatar.css";

export type LumiLivingState =
  | "calm"
  | "breathe"
  | "support"
  | "celebrate"
  | "reflect"
  | "concerned"
  | "guide";

export interface LumiLivingAvatarProps {
  src?: string;
  alt?: string;
  state?: LumiLivingState;
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
}

const stateCopy: Record<LumiLivingState, string> = {
  calm: "Lumi is calm and present.",
  breathe: "Lumi is breathing with you.",
  support: "Lumi is here with steady support.",
  celebrate: "Lumi is celebrating your progress.",
  reflect: "Lumi is holding a reflective space.",
  concerned: "Lumi is gently noticing that you may need support.",
  guide: "Lumi is guiding the next step.",
};

export default function LumiLivingAvatar({
  src,
  alt,
  state = "calm",
  size = "lg",
  label,
}: LumiLivingAvatarProps) {
  const accessibleLabel = label || stateCopy[state];

  return (
    <figure
      className={`lumi-living-avatar lumi-living-avatar--${state} lumi-living-avatar--${size}`}
      aria-label={accessibleLabel}
    >
      <div className="lumi-living-avatar__aura" aria-hidden="true" />
      <div className="lumi-living-avatar__sparkles" aria-hidden="true" />
      {src ? (
        <img className="lumi-living-avatar__image" src={src} alt={alt || accessibleLabel} />
      ) : (
        <div className="lumi-living-avatar__fallback" aria-hidden="true">
          <span className="lumi-living-avatar__face" />
          <span className="lumi-living-avatar__belly" />
        </div>
      )}
      <figcaption className="sr-only">{accessibleLabel}</figcaption>
    </figure>
  );
}
