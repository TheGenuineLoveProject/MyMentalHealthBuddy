import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CreditCard, Calendar, CheckCircle2 } from "lucide-react";
export function PaymentMethodCard({ paymentMethod, onSetDefault, onRemove, }) {
    const getBrandIcon = (brand) => {
        return _jsx(CreditCard, { className: "h-5 w-5" });
    };
    return (_jsxs("div", { className: "border rounded-lg p-4", "data-testid": `payment-method-${paymentMethod.id}`, children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [getBrandIcon(paymentMethod.brand), _jsx("h3", { className: "text-lg font-semibold capitalize", children: paymentMethod.brand })] }), paymentMethod.isDefault && (_jsxs("span", { className: "flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded", "data-testid": "badge-default-payment", children: [_jsx(CheckCircle2, { className: "h-3 w-3" }), "Default"] }))] }), _jsxs("p", { className: "text-gray-600 text-sm mb-2", children: ["\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 ", paymentMethod.last4] }), _jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-500", children: [_jsx(Calendar, { className: "h-4 w-4" }), _jsxs("span", { children: ["Expires ", paymentMethod.expiryMonth, "/", paymentMethod.expiryYear] })] })] }));
}
