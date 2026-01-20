import { useState } from "react";
import { Link } from "wouter";
import { 
  CreditCard, ArrowLeft, Check, Crown, Zap, Star,
  Download, Calendar, Shield, Sparkles, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    icon: Star,
    features: ["Basic mood tracking", "5 journal entries/month", "Community access"],
    current: false
  },
  {
    id: "premium",
    name: "Premium",
    price: "$12",
    period: "/month",
    icon: Zap,
    features: ["Unlimited journaling", "AI chat support", "Advanced insights", "Priority support"],
    current: true,
    popular: true
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "$199",
    period: "one-time",
    icon: Crown,
    features: ["All Premium features", "Lifetime access", "Early access to new features", "Exclusive content"],
    current: false
  }
];

const INVOICES = [
  { id: "INV-001", date: "Jan 1, 2026", amount: "$12.00", status: "Paid" },
  { id: "INV-002", date: "Dec 1, 2025", amount: "$12.00", status: "Paid" },
  { id: "INV-003", date: "Nov 1, 2025", amount: "$12.00", status: "Paid" }
];

export default function Billing() {
  const [selectedPlan, setSelectedPlan] = useState("premium");

  return (
    <div className="min-h-screen hero-gradient">
      <div className="content-wrapper py-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-body-sm text-[var(--sage-500)] hover:text-[var(--teal-600)] mb-4 transition" data-testid="link-back">
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="icon-container icon-xl icon-gradient-gold">
                <CreditCard className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-display-lg text-teal" data-testid="text-page-title">Billing & Subscription</h1>
                <p className="text-lead">Manage your plan and payment details</p>
              </div>
            </div>
          </header>

          <div className="space-y-8">
            <section className="card-bordered bg-gradient-to-r from-[var(--sage-50)] to-[var(--gold-50)]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="icon-container icon-xl icon-soft-gold">
                    <Zap className="h-7 w-7" />
                  </div>
                  <div>
                    <h2 className="text-heading-lg text-teal">Premium Plan</h2>
                    <p className="text-body-sm text-[var(--sage-600)]">Your subscription renews on Feb 1, 2026</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-display-md text-teal">$12</p>
                  <p className="text-caption">/month</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-heading-md text-teal mb-4">Available Plans</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {PLANS.map(plan => (
                  <div 
                    key={plan.id}
                    className={`card-bordered relative transition-all ${
                      plan.current 
                        ? 'ring-2 ring-[var(--teal-500)] bg-[var(--sage-50)]' 
                        : 'hover:border-[var(--sage-400)]'
                    }`}
                    data-testid={`plan-${plan.id}`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[var(--gold-500)] to-[var(--gold-400)] text-white text-caption font-medium">
                        Current Plan
                      </span>
                    )}
                    <div className="text-center mb-4 pt-2">
                      <div className={`icon-container icon-lg mx-auto mb-3 ${plan.current ? 'icon-soft-teal' : 'icon-soft-sage'}`}>
                        <plan.icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-heading-sm text-teal">{plan.name}</h3>
                      <p className="text-display-md text-teal">{plan.price}</p>
                      <p className="text-caption">{plan.period}</p>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-body-sm">
                          <Check className="h-4 w-4 text-[var(--sage-500)]" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.current ? 'btn-secondary-premium' : 'btn-premium'}`}
                      disabled={plan.current}
                      data-testid={`button-select-${plan.id}`}
                    >
                      {plan.current ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </div>
                ))}
              </div>
            </section>

            <section className="card-bordered">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-heading-md text-teal flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[var(--sage-500)]" />
                  Payment History
                </h2>
                <Button variant="outline" size="sm" className="btn-secondary-premium" data-testid="button-download-all">
                  <Download className="h-4 w-4 mr-2" />
                  Download All
                </Button>
              </div>
              <div className="space-y-3">
                {INVOICES.map(invoice => (
                  <div key={invoice.id} className="flex items-center justify-between p-4 rounded-xl bg-[var(--sage-50)]" data-testid={`invoice-${invoice.id}`}>
                    <div className="flex items-center gap-4">
                      <div className="icon-container icon-sm icon-soft-sage">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-body-sm font-medium">{invoice.id}</p>
                        <p className="text-caption">{invoice.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-body-sm font-medium">{invoice.amount}</span>
                      <span className="px-2 py-1 rounded-full bg-[var(--sage-200)] text-[var(--sage-700)] text-caption">{invoice.status}</span>
                      <Button variant="ghost" size="sm" data-testid={`button-download-${invoice.id}`}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="card-bordered">
              <div className="flex items-center gap-3 mb-4">
                <div className="icon-container icon-md icon-soft-teal">
                  <Shield className="h-5 w-5" />
                </div>
                <h2 className="text-heading-md text-teal">Payment Method</h2>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--sage-50)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 rounded bg-gradient-to-r from-[var(--teal-600)] to-[var(--teal-400)] flex items-center justify-center">
                    <span className="text-white text-caption font-bold">VISA</span>
                  </div>
                  <div>
                    <p className="text-body-sm font-medium">•••• •••• •••• 4242</p>
                    <p className="text-caption">Expires 12/27</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" data-testid="button-update-payment">
                  Update
                </Button>
              </div>
            </section>

            <div className="text-center py-4">
              <p className="text-caption flex items-center justify-center gap-1">
                <Sparkles className="h-4 w-4 text-[var(--gold-500)]" />
                Questions? Contact our support team
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
