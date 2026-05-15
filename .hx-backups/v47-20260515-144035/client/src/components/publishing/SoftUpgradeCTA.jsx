import { Link } from "wouter";
import { Heart, Sparkles } from "lucide-react";
import { trackSignalEvent } from "../../utils/trackSignalEvent";

export default function SoftUpgradeCTA({ surface = "blog", variant = "light" }) {
  const handleClick = () => {
    trackSignalEvent("pricing_view", { surface, source: "soft_cta" });
  };

  if (variant === "compact") {
    return (
      <div
        className="mt-6 p-4 rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/30 text-center"
        data-testid={`soft-upgrade-cta-${surface}`}
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          If you find this helpful, Pro unlocks deeper tools and supports the project.
        </p>
        <Link
          href="/pricing"
          onClick={handleClick}
          className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
          data-testid="link-see-plans"
        >
          See plans
        </Link>
      </div>
    );
  }

  return (
    <div
      className="my-8 p-6 rounded-xl border border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/30"
      data-testid={`soft-upgrade-cta-${surface}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50">
          <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            Support This Project
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            If this resonates with you, upgrading to Pro unlocks extended wellness tools
            and directly supports keeping this space available for everyone. No pressure at all.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              onClick={handleClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
              data-testid="link-see-plans"
            >
              <Sparkles className="w-4 h-4" />
              See Plans
            </Link>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              Core tools are always free
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
