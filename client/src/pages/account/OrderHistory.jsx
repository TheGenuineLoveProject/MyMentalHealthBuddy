import { useQuery } from "@tanstack/react-query";
import { Receipt, Download, Calendar, CreditCard, FileText, Loader2, ExternalLink, AlertCircle, RefreshCw } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/ReflectionFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";

export default function OrderHistory() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["/api/billing/invoices"],
  });
  
  const orders = data?.invoices || [];

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Order History — The Genuine Love Project"
        description="View your past orders and receipts."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <header className="mb-8" data-testid="header-order-history">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Receipt className="w-5 h-5" />
            <span className="text-sm font-medium" data-testid="text-breadcrumb">Account</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="heading-order-history">
            Order History
          </h1>
          <p className="text-muted-foreground" data-testid="text-description">
            View your past orders and download receipts.
          </p>
        </header>

        {isLoading ? (
          <Card className="p-12 flex items-center justify-center" data-testid="loading-indicator">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </Card>
        ) : isError ? (
          <Card className="p-12 text-center" data-testid="error-state">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">Unable to Load Orders</h2>
            <p className="text-muted-foreground mb-4">
              {error?.message || "We couldn't retrieve your order history. Please try again."}
            </p>
            <Button onClick={() => refetch()} variant="outline" data-testid="button-retry">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center" data-testid="empty-state">
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
                        <div className="font-medium" data-testid={`text-description-${order.id}`}>
                          {order.description || "Invoice"}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span data-testid={`text-date-${order.id}`}>{formatDate(order.date)}</span>
                          <span className="text-green-600 dark:text-green-400" data-testid={`text-status-${order.id}`}>
                            {order.status || "completed"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold" data-testid={`text-amount-${order.id}`}>${(order.amount || 0).toFixed(2)}</span>
                      {order.invoicePdf ? (
                        <a href={order.invoicePdf} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" data-testid={`download-${order.id}`}>
                            <Download className="w-4 h-4" />
                          </Button>
                        </a>
                      ) : order.hostedUrl ? (
                        <a href={order.hostedUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" data-testid={`view-${order.id}`}>
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      ) : null}
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
