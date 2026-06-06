import "./LumiPresenceLayer.css";

type LumiPresenceMode =
  | "calm"
  | "breathe"
  | "support"
  | "celebrate"
  | "reflect"
  | "concerned";

function getModeFromPath(pathname: string): LumiPresenceMode {
  const path = pathname.toLowerCase();

  if (path.includes("crisis") || path.includes("safety")) return "concerned";
  if (path.includes("breath") || path.includes("breathe")) return "breathe";
  if (path.includes("journal") || path.includes("reflect")) return "reflect";
  if (path.includes("pricing") || path.includes("premium") || path.includes("subscription")) return "celebrate";
  if (path.includes("tools") || path.includes("wellness") || path.includes("check")) return "support";

  return "calm";
}

export default function LumiPresenceLayer() {
  if (typeof window === "undefined") return null;

  const mode = getModeFromPath(window.location.pathname);

  return (
    <aside
      className={`lumi-presence-layer lumi-presence-layer--${mode}`}
      aria-label="Lumi is gently present on this page"
    >
      <div className="lumi-presence-layer__orb" aria-hidden="true">
        <span className="lumi-presence-layer__face" />
        <span className="lumi-presence-layer__belly" />
        <span className="lumi-presence-layer__glow" />
        <span className="lumi-presence-layer__sparkles" />
      </div>
      <div className="lumi-presence-layer__caption">
        <strong>Lumi is here</strong>
        <span>
          {mode === "breathe"
            ? "Breathe slowly."
            : mode === "concerned"
              ? "Support is close."
              : mode === "celebrate"
                ? "Keep going gently."
                : "One soft step."}
        </span>
      </div>
    </aside>
  );
}
