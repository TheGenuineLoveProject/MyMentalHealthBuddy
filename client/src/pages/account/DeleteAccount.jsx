/**
 * Delete Account Request Page (P119)
 * Allows users to request account deletion
 */

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Heart, CheckCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function DeleteAccountPage() {
  const { toast } = useToast();
  const [confirmation, setConfirmation] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/account/delete-request', { confirmation: 'DELETE MY ACCOUNT' });
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: 'Request submitted',
        description: 'Your account deletion request has been received.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Request failed',
        description: error.message || 'Please try again or contact support.',
        variant: 'destructive',
      });
    },
  });

  const canSubmit = confirmation === 'DELETE MY ACCOUNT' && acknowledged;

  if (submitted) {
    return (
      <div className="container max-w-lg py-12">
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle className="h-5 w-5" />
              <CardTitle>Request Received</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your account deletion request has been submitted. Here's what happens next:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>You'll receive a confirmation email within 24 hours</li>
              <li>Your account will be deactivated within 7 days</li>
              <li>All personal data will be permanently deleted within 30 days</li>
              <li>You can cancel this request by contacting support before deletion</li>
            </ul>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">We're here for you</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                    If you're going through a difficult time, please know that support is available. 
                    Visit our <a href="/crisis" className="underline font-medium">crisis resources</a> page 
                    or reach out anytime.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-lg py-16">
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <CardTitle>Delete Your Account</CardTitle>
          </div>
          <CardDescription>
            This action is permanent and cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-100">Warning</h4>
                <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                  Deleting your account will permanently remove:
                </p>
                <ul className="list-disc list-inside text-sm text-red-800 dark:text-red-200 mt-2">
                  <li>Your profile and personal information</li>
                  <li>All journal entries and mood logs</li>
                  <li>Progress data and achievements</li>
                  <li>Subscription and billing history</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Before you go</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  Is there something we could do better? We'd love to hear your feedback 
                  and help if something isn't working.
                </p>
                <a 
                  href="/support" 
                  className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline mt-2"
                >
                  Contact support instead
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="confirmation" className="text-sm font-medium">
                Type <span className="font-mono font-bold bg-gray-100 dark:bg-gray-800 px-1 rounded">DELETE MY ACCOUNT</span> to confirm:
              </label>
              <input
                type="text"
                id="confirmation"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder="Type confirmation text"
                className="w-full px-3 py-2 border rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:border-gray-700"
                data-testid="input-delete-confirmation"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mt-1 h-4 w-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
                data-testid="checkbox-acknowledge-deletion"
              />
              <span className="text-sm text-muted-foreground leading-relaxed">
                I understand that this action is permanent and all my data will be deleted. 
                I have exported any data I wish to keep.
              </span>
            </label>
          </div>
        </CardContent>
        <CardFooter className="flex gap-4 pt-6">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="flex-1 min-h-[44px] px-6 py-3 rounded-lg"
            data-testid="button-cancel-delete"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => deleteMutation.mutate()}
            disabled={!canSubmit || deleteMutation.isPending}
            className="flex-1 min-h-[44px] px-6 py-3 rounded-lg"
            data-testid="button-confirm-delete"
          >
            {deleteMutation.isPending ? 'Submitting...' : 'Delete My Account'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
