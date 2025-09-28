/** 
 * © 2025 Aaliyah Draws Art LLC. All rights reserved.
 * Unauthorized copying or distribution of this file is prohibited.
 * Built with GPT-4o, MIT/Proprietary license, integrated with evidence-based mental health models.
 */
import { Link } from 'wouter';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, MessageCircle } from 'lucide-react';

export default function SubscriptionCancel() {
  return (
    <div className="container max-w-4xl mx-auto p-6 min-h-screen flex items-center justify-center">
      <div className="w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 dark:bg-yellow-900 rounded-full mb-4">
            <XCircle className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold mb-4" data-testid="text-cancel-title">
            Subscription Cancelled
          </h1>
          <p className="text-lg text-muted-foreground">
            Your subscription process was cancelled. No charges were made.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Changed Your Mind?</CardTitle>
            <CardDescription>
              We'd love to have you join our premium community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Premium membership gives you unlimited access to AI-powered mental health support, 
                advanced mood tracking, and personalized insights to help you on your wellness journey.
              </p>
              
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Special Offer</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Complete your subscription today and get your first month at a discounted rate!
                </p>
                <Link href="/subscription">
                  <Button className="w-full" data-testid="button-try-again">
                    Try Again - View Plans
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button variant="outline" size="lg" data-testid="button-back-dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/subscription">
            <Button variant="ghost" size="lg" data-testid="button-view-plans">
              View Plans Again
            </Button>
          </Link>
        </div>

        <Card className="mt-12 border-dashed">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MessageCircle className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Have Questions?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Our team is here to help you understand the benefits of premium membership.
                </p>
                <div className="flex gap-2">
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Chat with Support
                  </Button>
                  <span className="text-muted-foreground">•</span>
                  <Button variant="link" className="p-0 h-auto text-primary">
                    View FAQ
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}