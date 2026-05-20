/**
 * LoadingSpinner — minimal centered loading indicator anchored on Lumi.
 *
 * Renders a small Lumi (waving pose) inside a subtly rotating wrapper so
 * the wait feels companion-led rather than mechanical. Honors
 * prefers-reduced-motion at the CSS layer (no spin when reduced).
 *
 * Note: BuddyAvatar's `motion` is derived from `state`, not a prop —
 * the gentle pulse motion comes from the calm-state contract.
 */
import { MMHBFloatAvatar } from "@/avatar-life/components/MMHBFloatAvatar";
import { getOfficialLumi } from "@/avatar-life/officialLumiAssets";

export interface LoadingSpinnerProps {
  text?: string;
  className?: string;
  "data-testid"?: string;
}

export default function LoadingSpinner({
  text,
  className = "",
  "data-testid": testId = "loading-spinner",
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      data-testid={testId}
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "loadingSpinnerRotate 2.6s linear infinite",
        }}
      >
        <MMHBFloatAvatar
          imageSrc={getOfficialLumi("calm")}
          size={48}
          alt="Lumi loading companion"
          data-testid="loading-spinner-buddy"
        />
      </div>
      {text ? (
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            color: "var(--text-2, #6b6b6b)",
          }}
          data-testid="loading-spinner-text"
        >
          {text}
        </p>
      ) : null}
      <span className="sr-only">Loading…</span>
      <style>{`
        @keyframes loadingSpinnerRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-testid="${testId}"] > div { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
