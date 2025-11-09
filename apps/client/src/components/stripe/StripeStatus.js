import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useStripe } from "@/contexts/StripeContext";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
export function StripeStatus() {
    const { stripe, isLoading, error, isTestMode } = useStripe();
    if (isLoading) {
        return (_jsxs("div", { className: "flex items-center gap-2 text-blue-600", "data-testid": "stripe-status-loading", children: [_jsx(Loader2, { className: "h-4 w-4 animate-spin" }), _jsx("span", { className: "text-sm", children: "Initializing secure payment processing..." })] }));
    }
    if (error) {
        return (_jsxs("div", { className: "flex items-center gap-2 text-red-600", "data-testid": "stripe-status-error", children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsxs("span", { className: "text-sm", children: ["Payment System Error: ", error.message || "Failed to initialize"] })] }));
    }
    if (!stripe) {
        return (_jsxs("div", { className: "flex items-center gap-2 text-red-600", "data-testid": "stripe-status-unavailable", children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsx("span", { className: "text-sm", children: "Payment System Unavailable - Please refresh the page" })] }));
    }
    return (_jsxs("div", { className: "flex items-center gap-2", "data-testid": "stripe-status-ready", children: [_jsx(CheckCircle2, { className: "h-4 w-4 text-green-600" }), _jsx("span", { className: "text-sm text-gray-600", children: "Secure payments powered by Stripe" }), isTestMode && (_jsx("span", { className: "ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded border border-yellow-300", "data-testid": "badge-test-mode", children: "Test Mode" }))] }));
}
export function StripeDebugInfo() {
    const { publicKey, isTestMode, stripe } = useStripe();
    if (import.meta.env.PROD)
        return null;
    return (_jsxs("div", { className: "p-4 bg-gray-100 rounded-lg text-xs font-mono space-y-1", "data-testid": "stripe-debug-info", children: [_jsxs("div", { children: [_jsx("strong", { children: "Stripe Status:" }), " ", stripe ? "✅ Loaded" : "❌ Not Loaded"] }), _jsxs("div", { children: [_jsx("strong", { children: "Public Key:" }), " ", publicKey.substring(0, 25), "..."] }), _jsxs("div", { children: [_jsx("strong", { children: "Mode:" }), " ", isTestMode ? "🧪 Test" : "🔴 Live"] }), _jsxs("div", { children: [_jsx("strong", { children: "Environment:" }), " ", import.meta.env.MODE] })] }));
}
