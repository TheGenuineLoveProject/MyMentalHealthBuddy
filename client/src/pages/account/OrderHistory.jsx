import { useState } from "react";
import { Receipt, Download, Calendar, CreditCard, FileText } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";

const MOCK_ORDERS = [
  { id: "ord_001", date: "2026-01-25", description: "Premium Monthly", amount: 19.99, status: "paid" },
  { id: "ord_002", date: "2025-12-25", description: "Premium Monthly", amount: 19.99, status: "paid" },
  { id: "ord_003", date: "2025-11-25", description: "Premium Monthly", amount: 19.99, status: "paid" },
  { id: "ord_004", date: "2025-10-15", description: "Self-Love Journal (Digital)", amount: 9.99, status: "paid" }
];

export default function OrderHistory() {
  const [orders] = useState(MOCK_ORDERS);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Order History — The Genuine Love Project"
        description="View your past orders and receipts."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Receipt className="w-5 h-5" />
            <span className="text-sm font-medium">Account</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Order History
          </h1>
          <p className="text-muted-foreground">
            View your past orders and download receipts.
          </p>
        </header>

        {orders.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">No Orders Yet</h2>
            <p className="text-muted-foreground">
              Your order history will appear here once you make a purchase.
            </p>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map(order => (
                  <div 
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                    data-testid={`order-${order.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{order.description}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(order.date)}
                          <span className="text-green-600 dark:text-green-400">{order.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">${order.amount.toFixed(2)}</span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        data-testid={`download-${order.id}`}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8">
          Need a receipt for a specific order? Click the download button.
        </p>
      </main>

      <SafetyFooter />
    </div>
  );
}
