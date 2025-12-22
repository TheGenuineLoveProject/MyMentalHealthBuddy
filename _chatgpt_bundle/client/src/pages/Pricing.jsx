import { useAuth } from "../context/AuthContext.jsx";

const tiers = [
  {
    name: "Free",
    price: "$0",
    features: ["Mood tracking", "Basic journaling", "Crisis resources"],
    planId: null,
  },
  {
    name: "Plus",
    price: "$9/mo",
    features: ["Everything in Free", "AI reflections", "Weekly insights", "Export journal"],
    planId: "plus",
  },
  {
    name: "Pro",
    price: "$19/mo",
    features: ["Everything in Plus", "Advanced programs", "Voice + TTS", "Priority support"],
    planId: "pro",
  },
];

export default function Pricing() {
  const { user } = useAuth();

  const startCheckout = async (planId) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ planId }),
    });

    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else alert(data.error || "Checkout failed");
  };

  return (
    <div className="min-h-screen bg-gradient-mesh py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4" data-testid="text-pricing-title">Pricing</h1>
        <p className="text-center text-[var(--text-secondary)] mb-12">
          Choose the plan that works for you
        </p>
        
        <div className="grid gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div 
              key={tier.name} 
              className="bg-white/80 dark:bg-white/10 backdrop-blur-sm border border-gray-200 dark:border-white/20 rounded-2xl p-8 shadow-lg"
              data-testid={`card-pricing-${tier.name.toLowerCase()}`}
            >
              <h2 className="text-2xl font-bold mb-2">{tier.name}</h2>
              <div className="text-3xl font-bold text-[var(--primary)] mb-6">{tier.price}</div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              {tier.planId ? (
                <button 
                  onClick={() => startCheckout(tier.planId)}
                  className="w-full py-3 px-6 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  data-testid={`button-choose-${tier.name.toLowerCase()}`}
                >
                  Choose {tier.name}
                </button>
              ) : (
                <button 
                  disabled 
                  className="w-full py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-500 rounded-xl font-semibold cursor-not-allowed"
                  data-testid="button-current-plan"
                >
                  Current Plan
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}