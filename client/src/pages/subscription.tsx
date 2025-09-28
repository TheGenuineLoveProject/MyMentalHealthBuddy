/** 
 * © 2025 Aaliyah Draws Art LLC. All rights reserved.
 * Unauthorized copying or distribution of this file is prohibited.
 * Built with GPT-4o, MIT/Proprietary license, integrated with evidence-based mental health models.
 */
import { useEffect, useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, Loader2, Shield, Zap, Heart, Star } from 'lucide-react';

// Initialize Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

// Subscription form component
const SubscriptionForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/subscription/success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="w-full"
        data-testid="button-subscribe"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Subscribe Now
          </>
        )}
      </Button>
    </form>
  );
};

// Pricing plans
const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    interval: 'forever',
    description: 'Get started with basic mental health support',
    features: [
      '5 AI chat sessions per month',
      'Basic mood tracking',
      'Community support',
      'Educational resources'
    ],
    highlighted: false,
    current: true
  },
  {
    name: 'Premium',
    price: '$19',
    interval: 'month',
    description: 'Comprehensive mental health companion',
    features: [
      'Unlimited AI chat sessions',
      'Advanced mood analytics',
      'Voice support',
      'Priority response time',
      'Personalized insights',
      'Export your data'
    ],
    highlighted: true,
    current: false
  },
  {
    name: 'Professional',
    price: '$49',
    interval: 'month',
    description: 'For therapists and healthcare providers',
    features: [
      'Everything in Premium',
      'Multi-user management',
      'Clinical tools',
      'HIPAA compliance',
      'API access',
      'Dedicated support'
    ],
    highlighted: false,
    current: false
  }
];

export default function Subscription() {
  const [clientSecret, setClientSecret] = useState("");
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const { toast } = useToast();
  
  // For demo purposes, using a test user ID
  const userId = 'test-user';

  // Query subscription status
  const { data: subscriptionStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/billing/subscription-status', userId],
    enabled: !!userId
  });

  // Mutation to create subscription
  const createSubscription = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/billing/create-subscription', {
        userId,
        email: 'test@example.com'
      });
    },
    onSuccess: async (response) => {
      const data = await response.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
      }
      if (data.status === 'existing') {
        toast({
          title: "Active Subscription",
          description: "You already have an active subscription!",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to initialize subscription. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Mutation to cancel subscription
  const cancelSubscription = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/billing/cancel-subscription', { userId });
    },
    onSuccess: async () => {
      toast({
        title: "Subscription Cancelled",
        description: "Your subscription will remain active until the end of the billing period.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/billing/subscription-status'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSelectPlan = (planName: string) => {
    if (planName === 'free') return;
    setSelectedPlan(planName.toLowerCase());
    createSubscription.mutate();
  };

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4" data-testid="text-title">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground">
          Unlock premium features to enhance your mental wellness journey
        </p>
      </div>

      {/* Current subscription status */}
      {subscriptionStatus && subscriptionStatus.status === 'active' && (
        <Card className="mb-8 border-green-500 bg-green-50 dark:bg-green-950">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <CardTitle>Active Subscription</CardTitle>
              </div>
              <Badge className="bg-green-600">
                {subscriptionStatus.tier || 'Premium'}
              </Badge>
            </div>
            <CardDescription>
              Your subscription is active until {new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={() => cancelSubscription.mutate()}
              disabled={cancelSubscription.isPending}
              data-testid="button-cancel-subscription"
            >
              {cancelSubscription.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Subscription'
              )}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Pricing cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {pricingPlans.map((plan) => (
          <Card 
            key={plan.name} 
            className={`relative ${plan.highlighted ? 'border-primary shadow-lg scale-105' : ''}`}
            data-testid={`card-plan-${plan.name.toLowerCase()}`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  <Star className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader className="pb-8">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/{plan.interval}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.current ? (
                <Button disabled className="w-full" variant="secondary">
                  Current Plan
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={() => handleSelectPlan(plan.name)}
                  disabled={createSubscription.isPending || plan.name === 'Professional'}
                  data-testid={`button-select-${plan.name.toLowerCase()}`}
                >
                  {plan.name === 'Professional' ? 'Coming Soon' : 'Select Plan'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Payment form modal/section */}
      {clientSecret && stripePromise && (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Complete Your Subscription
            </CardTitle>
            <CardDescription>
              Enter your payment details to start your premium subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <SubscriptionForm />
            </Elements>
          </CardContent>
        </Card>
      )}

      {/* Benefits section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-8">Why Choose Premium?</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Unlimited Support</h3>
            <p className="text-sm text-muted-foreground">
              Get 24/7 access to AI mental health support whenever you need it
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Personalized Care</h3>
            <p className="text-sm text-muted-foreground">
              Receive tailored insights and recommendations based on your journey
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Privacy First</h3>
            <p className="text-sm text-muted-foreground">
              Your data is encrypted and never shared. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}