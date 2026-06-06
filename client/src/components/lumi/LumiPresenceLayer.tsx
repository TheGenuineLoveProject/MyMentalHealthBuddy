import "./LumiPresenceLayer.css";

type LumiPresenceMode =
  | "calm"
  | "breathe"
  | "support"
  | "celebrate"
  | "reflect"
  | "concerned"
  | "guide";

function getModeFromPath(pathname: string): LumiPresenceMode {
  const path = pathname.toLowerCase();

  if (path.includes("crisis") || path.includes("safety")) return "concerned";
  if (path.includes("breath") || path.includes("breathe")) return "breathe";
  if (path.includes("journal") || path.includes("reflect")) return "reflect";
  if (path.includes("pricing") || path.includes("premium") || path.includes("subscription") || path.includes("billing")) return "celebrate";
  if (path.includes("tools") || path.includes("wellness") || path.includes("check") || path.includes("mood")) return "support";
  if (path.includes("journey") || path.includes("start") || path.includes("growth")) return "guide";

  return "calm";
}

function getCaption(mode: LumiPresenceMode) {
  switch (mode) {
    case "breathe":
      return ["Breathe with Lumi", "slow • soft • steady"];
    case "support":
      return ["Lumi is listening", "you are not alone"];
    case "celebrate":
      return ["Lumi celebrates you", "keep glowing gently"];
    case "reflect":
      return ["Lumi reflects with you", "name it softly"];
    case "concerned":
      return ["Support stays close", "help is visible"];
    case "guide":
      return ["Lumi walks beside you", "one clear step"];
    default:
      return ["Lumi is here", "one soft step"];
  }
}

export default function LumiPresenceLayer() {
  if (typeof window === "undefined") return null;

  const mode = getModeFromPath(window.location.pathname);
  const [title, subtitle] = getCaption(mode);

  return (
    <aside
      className={`lumi-presence-layer lumi-presence-layer--${mode}`}
      aria-label={`${title}: ${subtitle}`}
    >
      <div className="lumi-kinetic-stage" aria-hidden="true">
        <div className="lumi-aura lumi-aura--one" />
        <div className="lumi-aura lumi-aura--two" />
        <div className="lumi-spark-field" />

        <div className="lumi-character">
          <div className="lumi-halo" />
          <div className="lumi-leaf lumi-leaf--one" />
          <div className="lumi-leaf lumi-leaf--two" />

          <div className="lumi-ear lumi-ear--left">
            <span />
          </div>
          <div className="lumi-ear lumi-ear--right">
            <span />
          </div>

          <div className="lumi-body">
            <div className="lumi-face">
              <div className="lumi-brow lumi-brow--left" />
              <div className="lumi-brow lumi-brow--right" />

              <div className="lumi-eye lumi-eye--left">
                <span className="lumi-pupil" />
                <span className="lumi-shine" />
              </div>
              <div className="lumi-eye lumi-eye--right">
                <span className="lumi-pupil" />
                <span className="lumi-shine" />
              </div>

              <div className="lumi-cheek lumi-cheek--left" />
              <div className="lumi-cheek lumi-cheek--right" />

              <div className="lumi-mouth">
                <span className="lumi-mouth-line" />
              </div>
            </div>

            <div className="lumi-belly">
              <div className="lumi-heart-core" />
              <div className="lumi-emotion-orb">
                <span className="lumi-emotion-dot lumi-emotion-dot--joy" />
                <span className="lumi-emotion-dot lumi-emotion-dot--calm" />
                <span className="lumi-emotion-dot lumi-emotion-dot--sad" />
                <span className="lumi-emotion-dot lumi-emotion-dot--care" />
              </div>
            </div>

            <div className="lumi-arm lumi-arm--left">
              <span className="lumi-paw" />
            </div>
            <div className="lumi-arm lumi-arm--right">
              <span className="lumi-paw" />
            </div>

            <div className="lumi-leg lumi-leg--left">
              <span />
            </div>
            <div className="lumi-leg lumi-leg--right">
              <span />
            </div>
          </div>

          <div className="lumi-ground-shadow" />
        </div>
      </div>

      <div className="lumi-presence-layer__caption">
        <strong>{title}</strong>
        <span>{subtitle}</span>
      </div>
    </aside>
  );
}
