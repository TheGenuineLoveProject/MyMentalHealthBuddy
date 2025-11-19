import { CreditCard, Calendar, CheckCircle2 } from "lucide-react";

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onSetDefault?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export function PaymentMethodCard({
  paymentMethod,
  onSetDefault,
  onRemove,
}: PaymentMethodCardProps) {
  const getBrandIcon = (brand: string) => {
    return <CreditCard className="h-5 w-5" />;
  };

  return (
    <div className="border rounded-lg p-4" data-testid={`payment-method-${paymentMethod.id}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getBrandIcon(paymentMethod.brand)}
          <h3 className="text-lg font-semibold capitalize">{paymentMethod.brand}</h3>
        </div>
        {paymentMethod.isDefault && (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded" data-testid="badge-default-payment">
            <CheckCircle2 className="h-3 w-3" />
            Default
          </span>
        )}
      </div>
      <p className="text-gray-600 text-sm mb-2">
        •••• •••• •••• {paymentMethod.last4}
      </p>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Calendar className="h-4 w-4" />
        <span>
          Expires {paymentMethod.expiryMonth}/{paymentMethod.expiryYear}
        </span>
      </div>
    </div>
  );
}
