import { useStripe } from "@/contexts/StripeContext";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function StripeStatus() {
  const { stripe, isLoading, error, isTestMode } = useStripe();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-blue-600" data-testid="stripe-status-loading">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Initializing secure payment processing...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600" data-testid="stripe-status-error">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">
          Payment System Error: {error.message || "Failed to initialize"}
        </span>
      </div>
    );
  }

  if (!stripe) {
    return (
      <div className="flex items-center gap-2 text-red-600" data-testid="stripe-status-unavailable">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">
          Payment System Unavailable - Please refresh the page
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2" data-testid="stripe-status-ready">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <span className="text-sm text-gray-600">
        Secure payments powered by Stripe
      </span>
      {isTestMode && (
        <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded border border-yellow-300" data-testid="badge-test-mode">
          Test Mode
        </span>
      )}
    </div>
  );
}

export function StripeDebugInfo() {
  const { publicKey, isTestMode, stripe } = useStripe();

  if (import.meta.env.PROD) return null;

  return (
    <div className="p-4 bg-gray-100 rounded-lg text-xs font-mono space-y-1" data-testid="stripe-debug-info">
      <div><strong>Stripe Status:</strong> {stripe ? "✅ Loaded" : "❌ Not Loaded"}</div>
      <div><strong>Public Key:</strong> {publicKey.substring(0, 25)}...</div>
      <div><strong>Mode:</strong> {isTestMode ? "🧪 Test" : "🔴 Live"}</div>
      <div><strong>Environment:</strong> {import.meta.env.MODE}</div>
    </div>
  );
}
