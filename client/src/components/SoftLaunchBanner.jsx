import { useState, useEffect } from "react";
import { X, MessageSquare } from "lucide-react";
import { Link } from "wouter";

export default function SoftLaunchBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem("soft_launch_banner_dismissed");
    if (wasDismissed) {
      setDismissed(true);
      return;
    }
    fetch("/api/health")
      .then(r => r.json())
      .then(data => {
        if (data.softLaunch) setEnabled(true);
      })
      .catch(() => {});
  }, []);

  if (!enabled || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("soft_launch_banner_dismissed", "true");
  };

  return (
    <div
      role="status"
      aria-label="Soft launch notice"
      data-testid="banner-soft-launch"
      className="relative w-full py-3 px-4 text-center text-sm"
      style={{
        background: "linear-gradient(135deg, var(--glp-sage-10), var(--glp-gold-10))",
        borderBottom: "1px solid var(--glp-sage-15)",
        color: "var(--glp-ink)"
      }}
    >
      <span>
        Soft launch — thank you for being early. If something feels off, you can{" "}
        <Link
          href="/contact"
          className="underline font-medium"
          style={{ color: "var(--glp-sage-deep)" }}
          data-testid="link-soft-launch-feedback"
        >
          share feedback
        </Link>
        .
      </span>
      <button
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors hover:bg-black/10"
        aria-label="Dismiss banner"
        data-testid="button-dismiss-soft-launch"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
