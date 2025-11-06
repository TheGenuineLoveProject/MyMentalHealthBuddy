import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CreditCard, Calendar, CheckCircle2, XCircle, Clock, DollarSign, ArrowUpCircle, Sparkles, Zap, Crown } from "lucide-react";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { StripeStatus } from "@/components/stripe/StripeStatus";
const CURRENT_USER_ID = "user-1";
export default function BillingPage() {
    const [selectedTier, setSelectedTier] = useState(null);
    const { data: tiers, isLoading: tiersLoading } = useQuery({
        queryKey: ["/api/stripe/tiers"],
    });
    const { data: transactions, isLoading: transactionsLoading } = useQuery({
        queryKey: ["/api/transactions", CURRENT_USER_ID],
        retry: 1,
    });
    const { createSubscriptionCheckout, isLoading: checkoutLoading, error, clearError } = useStripeCheckout();
    const handleUpgrade = (tier) => {
        setSelectedTier(tier);
        clearError();
        createSubscriptionCheckout({ tier });
    };
    const getStatusIcon = (status) => {
        switch (status) {
            case "completed":
                return _jsx(CheckCircle2, { className: "h-4 w-4 text-green-600" });
            case "failed":
                return _jsx(XCircle, { className: "h-4 w-4 text-red-600" });
            case "pending":
                return _jsx(Clock, { className: "h-4 w-4 text-yellow-600" });
            case "cancelled":
                return _jsx(XCircle, { className: "h-4 w-4 text-gray-600" });
            default:
                return _jsx(Clock, { className: "h-4 w-4 text-blue-600" });
        }
    };
    const getStatusBadge = (status) => {
        const colors = {
            completed: "bg-green-100 text-green-800",
            failed: "bg-red-100 text-red-800",
            pending: "bg-yellow-100 text-yellow-800",
            cancelled: "bg-gray-100 text-gray-800",
        };
        return (_jsx("span", { className: `px-2 py-1 text-xs rounded-full font-medium capitalize ${colors[status] || "bg-blue-100 text-blue-800"}`, children: status }));
    };
    const getTierIcon = (tier) => {
        switch (tier.toLowerCase()) {
            case "free":
                return _jsx(Sparkles, { className: "h-5 w-5" });
            case "premium":
                return _jsx(Zap, { className: "h-5 w-5" });
            case "professional":
                return _jsx(Crown, { className: "h-5 w-5" });
            default:
                return _jsx(CreditCard, { className: "h-5 w-5" });
        }
    };
    return (_jsxs("div", { className: "container mx-auto p-6 max-w-7xl", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-2", children: "Billing & Subscriptions" }), _jsx("p", { className: "text-gray-600", children: "Manage your subscription plan and view transaction history" }), _jsx("div", { className: "mt-4", children: _jsx(StripeStatus, {}) })] }), error && (_jsx("div", { className: "mb-6 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg", "data-testid": "alert-checkout-error", children: error })), _jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Choose Your Plan" }), tiersLoading ? (_jsx("div", { className: "grid md:grid-cols-3 gap-6", children: [1, 2, 3].map((i) => (_jsx("div", { className: "bg-gray-100 animate-pulse h-96 rounded-lg" }, i))) })) : (_jsx("div", { className: "grid md:grid-cols-3 gap-6", children: tiers && Object.entries(tiers).map(([key, tier]) => {
                            const tierKey = key;
                            const isPopular = tierKey === "professional";
                            return (_jsxs("div", { className: `relative bg-white border-2 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow ${isPopular ? "border-blue-500" : "border-gray-200"}`, "data-testid": `card-subscription-${key}`, children: [isPopular && (_jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2", children: _jsx("span", { className: "bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium", children: "Most Popular" }) })), _jsxs("div", { className: "flex items-center gap-2 mb-4", children: [getTierIcon(key), _jsx("h3", { className: "text-xl font-bold capitalize", children: tier.name })] }), _jsxs("div", { className: "text-3xl font-bold mb-6", children: ["$", (tier.price / 100).toFixed(2), _jsx("span", { className: "text-sm font-normal text-gray-500", children: "/month" })] }), _jsx("ul", { className: "space-y-3 mb-6", children: tier.features.map((feature, index) => (_jsxs("li", { className: "flex items-start gap-2", children: [_jsx(CheckCircle2, { className: "h-5 w-5 text-blue-500 shrink-0 mt-0.5" }), _jsx("span", { className: "text-sm text-gray-700", children: feature })] }, index))) }), tierKey === "free" ? (_jsx("button", { className: "w-full py-2 px-4 bg-gray-200 text-gray-600 rounded-md font-medium cursor-not-allowed", disabled: true, "data-testid": "button-current-plan", children: "Current Plan" })) : (_jsx("button", { onClick: () => handleUpgrade(tierKey), disabled: checkoutLoading && selectedTier === tierKey, className: `w-full py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${isPopular
                                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                                            : "bg-gray-800 hover:bg-gray-900 text-white"} ${checkoutLoading && selectedTier === tierKey ? "opacity-50 cursor-not-allowed" : ""}`, "data-testid": `button-upgrade-${key}`, children: checkoutLoading && selectedTier === tierKey ? ("Processing...") : (_jsxs(_Fragment, { children: [_jsx(ArrowUpCircle, { className: "h-4 w-4" }), "Upgrade to ", tier.name] })) }))] }, key));
                        }) }))] }), _jsx("hr", { className: "my-8 border-gray-300" }), _jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Transaction History" }), transactionsLoading ? (_jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => (_jsx("div", { className: "bg-gray-100 animate-pulse h-20 rounded-lg" }, i))) })) : transactions && transactions.length > 0 ? (_jsx("div", { className: "bg-white border border-gray-200 rounded-lg overflow-hidden", "data-testid": "card-transaction-history", children: _jsx("div", { className: "divide-y divide-gray-200", children: transactions.map((transaction) => (_jsxs("div", { className: "p-4 flex items-center justify-between hover:bg-gray-50 transition-colors", "data-testid": `row-transaction-${transaction.id}`, children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-2 bg-gray-100 rounded-full", children: getStatusIcon(transaction.status) }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", "data-testid": `text-description-${transaction.id}`, children: transaction.description }), _jsxs("div", { className: "flex items-center gap-3 mt-1", children: [_jsxs("p", { className: "text-sm text-gray-500 flex items-center gap-1", children: [_jsx(Calendar, { className: "h-3 w-3" }), new Date(transaction.createdAt).toLocaleDateString()] }), getStatusBadge(transaction.status)] })] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("p", { className: `text-lg font-semibold ${transaction.status === "completed" ? "text-green-600" : "text-gray-900"}`, "data-testid": `text-amount-${transaction.id}`, children: [transaction.status === "failed" ? "-" : "", transaction.currency, " $", parseFloat(transaction.amount).toFixed(2)] }), _jsx("p", { className: "text-xs text-gray-500 capitalize", children: transaction.type })] })] }, transaction.id))) }) })) : (_jsxs("div", { className: "bg-blue-50 border border-blue-200 p-6 rounded-lg flex items-start gap-3", children: [_jsx(DollarSign, { className: "h-5 w-5 text-blue-600 mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-blue-900", children: "No transactions yet" }), _jsx("p", { className: "text-blue-700 text-sm", children: "Upgrade to a premium plan to get started!" })] })] }))] })] }));
}
