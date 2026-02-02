import { useState, useEffect } from "react";
import { Bell, AlertTriangle, CheckCircle, Info, XCircle, Clock, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useToast } from "@/hooks/use-toast";
import SEO from "../../components/SEO";

const DEFAULT_ALERTS = [
  { id: 1, type: "error", title: "Database Connection Timeout", message: "Connection pool exhausted at 14:32 UTC", time: "2 hours ago", resolved: false },
  { id: 2, type: "warning", title: "High Memory Usage", message: "Memory usage exceeded 85% threshold", time: "4 hours ago", resolved: true },
  { id: 3, type: "info", title: "Deployment Completed", message: "v2.4.1 deployed successfully to production", time: "6 hours ago", resolved: true },
  { id: 4, type: "error", title: "Payment Webhook Failed", message: "Stripe webhook returned 500 error", time: "1 day ago", resolved: true },
  { id: 5, type: "warning", title: "SSL Certificate Expiring", message: "Certificate expires in 30 days", time: "2 days ago", resolved: false }
];

export default function SystemAlerts() {
  const [filter, setFilter] = useState("all");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const cached = localStorage.getItem("glp_admin_alerts");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setAlerts(parsed);
        } else {
          throw new Error("Invalid format");
        }
      } else {
        setAlerts(DEFAULT_ALERTS);
        localStorage.setItem("glp_admin_alerts", JSON.stringify(DEFAULT_ALERTS));
      }
    } catch {
      setAlerts(DEFAULT_ALERTS);
      setTimeout(() => toast({ title: "Cache reset", description: "Using default alert data." }), 100);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleResolve = async (id) => {
    setResolving(id);
    await new Promise(r => setTimeout(r, 400));
    
    setAlerts(prev => {
      const alert = prev.find(a => a.id === id);
      const updated = prev.map(a => a.id === id ? { ...a, resolved: true, resolvedAt: new Date().toISOString() } : a);
      try {
        localStorage.setItem("glp_admin_alerts", JSON.stringify(updated));
        toast({ title: "Alert resolved", description: `${alert?.title || "Alert"} marked as resolved.` });
      } catch {}
      return updated;
    });
    
    setResolving(null);
  };

  const getIcon = (type) => {
    switch (type) {
      case "error": return <XCircle className="w-5 h-5 text-red-600" />;
      case "warning": return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case "info": return <Info className="w-5 h-5 text-blue-600" />;
      default: return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case "error": return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
      case "warning": return "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
      case "info": return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
      default: return "bg-muted";
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "all") return true;
    if (filter === "unresolved") return !alert.resolved;
    return alert.type === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title="System Alerts — Admin" noIndex />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold" data-testid="text-page-title">System Alerts</h1>
              <p className="text-muted-foreground">Monitor system health notifications</p>
            </div>
          </div>
        </header>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["all", "unresolved", "error", "warning", "info"].map(f => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="min-h-[40px] capitalize"
              data-testid={`filter-${f}`}
            >
              {f}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredAlerts.map(alert => (
            <Card key={alert.id} className={`border ${getBg(alert.type)}`}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  {getIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{alert.title}</h3>
                      {alert.resolved && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {alert.time}
                    </p>
                  </div>
                  {!alert.resolved && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="min-h-[40px]"
                      onClick={() => handleResolve(alert.id)}
                      disabled={resolving === alert.id}
                      data-testid={`resolve-${alert.id}`}
                    >
                      {resolving === alert.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Resolve"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <p className="text-muted-foreground">No alerts matching your filter</p>
          </div>
        )}
      </main>
    </div>
  );
}
