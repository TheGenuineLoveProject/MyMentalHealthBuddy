import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { CreditCard, Check, ExternalLink, Calendar, Shield, ArrowRight } from "lucide-react";
import SEO from "../../components/SEO";
import SafetyFooter from "../../components/ui/SafetyFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card.jsx";
import { Button } from "@/components/ui/Button.jsx";

const MOCK_SUBSCRIPTION = {
  plan: "Premium",
  status: "active",
  currentPeriodEnd: "2026-02-25",
  cancelAtPeriodEnd: false,
  features: [
    "Unlimited AI chat sessions",
    "All wellness tools",
    "Priority support",
    "Advanced analytics"
  ]
};

export default function Subscription() {
  const [subscription] = useState(MOCK_SUBSCRIPTION);

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
        <header className="mb-8">
          <div className="flex items-center gap-2 text-primary mb-2">
            <CreditCard className="w-5 h-5" />
            <span className="text-sm font-medium">Account</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Subscription
          </h1>
          <p className="text-muted-foreground">
            Manage your plan and billing preferences.
          </p>
        </header>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Current Plan</CardTitle>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                subscription.status === "active"
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
              }`}>
                {subscription.status === "active" ? "Active" : "Inactive"}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-1">
                {subscription.plan}
              </h2>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {subscription.cancelAtPeriodEnd 
                  ? `Cancels on ${formatDate(subscription.currentPeriodEnd)}`
                  : `Renews on ${formatDate(subscription.currentPeriodEnd)}`
                }
              </p>
            </div>

            <div className="space-y-2 mb-6">
              <h3 className="text-sm font-medium">Included Features</h3>
              {subscription.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="w-4 h-4 text-green-500" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" data-testid="button-billing-portal">
                <ExternalLink className="w-4 h-4 mr-2" />
                Billing Portal
              </Button>
              {subscription.cancelAtPeriodEnd ? (
                <Button className="flex-1" data-testid="button-resume">
                  Resume Subscription
                </Button>
              ) : (
                <Button variant="ghost" className="flex-1 text-muted-foreground" data-testid="button-cancel">
                  Cancel Plan
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

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
