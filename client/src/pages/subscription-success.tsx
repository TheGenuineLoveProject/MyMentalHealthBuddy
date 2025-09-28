/** 
 * © 2025 Aaliyah Draws Art LLC. All rights reserved.
 * Unauthorized copying or distribution of this file is prohibited.
 * Built with GPT-4o, MIT/Proprietary license, integrated with evidence-based mental health models.
 */
import { useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Heart, Shield, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SubscriptionSuccess() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    // Show success toast
    toast({
      title: "Welcome to Premium!",
      description: "Your subscription has been activated successfully.",
    });
    
    // Get session ID from URL if available
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      console.log('Checkout session completed:', sessionId);
    }
  }, [toast]);

  return (
    <div className="container max-w-4xl mx-auto p-6 min-h-screen flex items-center justify-center">
      <div className="w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-4">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4" data-testid="text-success-title">
            Welcome to Premium!
          </h1>
          <p className="text-lg text-muted-foreground">
            Your subscription has been activated. You now have access to all premium features.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Start exploring your new premium features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Unlimited AI Conversations</h3>
                  <p className="text-sm text-muted-foreground">
                    Chat with your AI mental health companion anytime, without limits
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Voice Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Enable voice conversations for a more natural experience
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Priority Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Get faster responses and priority access to new features
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg" data-testid="button-go-dashboard">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/subscription">
            <Button variant="outline" size="lg" data-testid="button-manage-subscription">
              Manage Subscription
            </Button>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-muted rounded-lg text-center">
          <h3 className="font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you have any questions about your subscription or need assistance, we're here to help.
          </p>
          <Button variant="link" className="text-primary">
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}