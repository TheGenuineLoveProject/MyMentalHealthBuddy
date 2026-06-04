import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CreditCard, Check, ExternalLink, Calendar, Shield, ArrowRight, Loader2 } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/ReflectionFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const PLAN_FEATURES = {
  free: ["Mood tracking", "Basic journaling", "Core wellness tools"],
  pro: ["Unlimited AI chat sessions", "All wellness tools", "Advanced analytics", "Healing journeys"],
  team: ["Everything in Pro", "Team dashboard", "Admin controls", "Priority support"],
  premium: ["Unlimited AI chat sessions", "All wellness tools", "Priority support", "Advanced analytics"]
};

export default function Subscription() {
  const { toast } = useToast();
  const [portalLoading, setPortalLoading] = useState(false);
  
  const { data: subscription, isLoading, error } = useQuery({
    queryKey: ["/api/billing/subscription-status"],
  });
  const openPortal = async () => {
    setPortalLoading(true);
    try {

        const res = await apiRequest(
          "POST",
          "/api/billing/portal"
        );

        const portalUrl = res?.url || res?.data?.url;

        if (portalUrl) {
          window.location.href = portalUrl;
        } else {
        toast({ title: "Error", description: "Unable to open billing portal", variant: "destructive" });
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to access billing portal", variant: "destructive" });
    } finally {
      setPortalLoading(false);
    }
  };
  
  const subData = subscription || { plan: "free", status: "none" };
  const planFeatures = PLAN_FEATURES[subData.plan] || PLAN_FEATURES.free;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="My Subscription — The Genuine Love Project"
        description="Manage your subscription and billing."
      />
      
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-primary mb-4">
            <CreditCard className="w-5 h-5" />
            <span className="text-sm font-medium">Account</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            My Subscription
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your plan and billing preferences.
          </p>
        </header>

        {isLoading ? (
          <Card className="mb-6 p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </Card>
        ) : (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Current Plan</CardTitle>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                subData.status === "active" || subData.status === "trialing"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
              }`}>
                {subData.status === "active" ? "Active" : subData.status === "trialing" ? "Trial" : subData.plan === "free" ? "Free" : "Inactive"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-1 capitalize">
                {subData.plan || "Free"}
              </h2>
              {subData.currentPeriodEnd && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {subData.cancelAtPeriodEnd 
                    ? `Cancels on ${formatDate(subData.currentPeriodEnd)}`
                    : `Renews on ${formatDate(subData.currentPeriodEnd)}`
                  }
                </p>
              )}
            </div>

            <div className="space-y-2 mb-6">
              <h3 className="text-sm font-medium">Included Features</h3>
              {planFeatures.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-green-500" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              {subData.plan !== "free" ? (
                <>
                  <Button 
                    variant="outline" 
                    className="flex-1 min-h-[44px] px-6 py-3 rounded-lg" 
                    data-testid="button-billing-portal"
                    onClick={openPortal}
                    disabled={portalLoading}
                  >
                    {portalLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ExternalLink className="w-4 h-4 mr-2" />}
                    Billing Portal
                  </Button>
                  {subData.cancelAtPeriodEnd ? (
                    <Button className="flex-1 min-h-[44px] px-6 py-3 rounded-lg" data-testid="button-resume" onClick={openPortal}>
                      Resume Subscription
                    </Button>
                  ) : (
                    <Button variant="ghost" className="flex-1 min-h-[44px] px-6 py-3 rounded-lg text-muted-foreground" data-testid="button-cancel" onClick={openPortal}>
                      Manage Plan
                    </Button>
                  )}
                </>
              ) : (
                <Link href="/pricing" className="flex-1">
                  <Button className="w-full min-h-[44px] px-6 py-3 rounded-lg" data-testid="button-upgrade">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-muted-foreground" />
              Payment Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Your payment information is securely processed by Stripe. 
              We never store your full card details on our servers.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="px-2 py-1 bg-muted rounded">Visa</span>
              <span className="px-2 py-1 bg-muted rounded">Mastercard</span>
              <span className="px-2 py-1 bg-muted rounded">Amex</span>
              <span className="px-2 py-1 bg-muted rounded">Discover</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Questions about billing, refunds, or your subscription?
            </p>
            <Link href="/help/billing">
              <Button variant="outline" data-testid="button-billing-help">
                Billing Help
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>

      <SafetyFooter />
    </div>
  );
}
