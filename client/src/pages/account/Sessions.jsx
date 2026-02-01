/**
 * Sessions Page (P113)
 * Basic session list with revoke capability
 */

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, Globe, Clock, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

function getDeviceIcon(userAgent) {
  if (!userAgent) return Monitor;
  if (/mobile|android|iphone/i.test(userAgent)) return Smartphone;
  return Monitor;
}

function formatDate(dateStr) {
  if (!dateStr) return 'Unknown';
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function SessionsPage() {
  const { toast } = useToast();
  const [revokingId, setRevokingId] = useState(null);

  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ['/api/account/sessions'],
  });

  const revokeMutation = useMutation({
    mutationFn: (sessionId) => apiRequest("DELETE", `/api/account/sessions/${sessionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/account/sessions'] });
      toast({
        title: 'Session revoked',
        description: 'The session has been signed out.',
      });
      setRevokingId(null);
    },
    onError: (error) => {
      toast({
        title: 'Could not revoke session',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
      setRevokingId(null);
    },
  });

  const handleRevoke = (sessionId) => {
    setRevokingId(sessionId);
    revokeMutation.mutate(sessionId);
  };

  if (isLoading) {
    return (
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>Manage your signed-in devices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="animate-pulse motion-reduce:animate-none bg-gray-200 dark:bg-gray-700 h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="animate-pulse motion-reduce:animate-none bg-gray-200 dark:bg-gray-700 h-4 w-32 rounded" />
                  <div className="animate-pulse motion-reduce:animate-none bg-gray-200 dark:bg-gray-700 h-3 w-48 rounded" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Unable to load sessions. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sessionList = sessions?.sessions || sessions || [];

  return (
    <div className="container max-w-2xl py-12">
      <Card>
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
            <Globe className="h-6 w-6" />
            Active Sessions
          </CardTitle>
          <CardDescription className="text-base mt-2">
            These are the devices currently signed in to your account. 
            If you don't recognize a session, revoke it immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sessionList.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No active sessions found.
            </p>
          ) : (
            sessionList.map((session) => {
              const DeviceIcon = getDeviceIcon(session.userAgent);
              const isCurrent = session.isCurrent;
              
              return (
                <div 
                  key={session.id}
                  className={`flex items-center gap-4 p-4 border rounded-lg ${
                    isCurrent ? 'border-primary bg-primary/5' : ''
                  }`}
                  data-testid={`session-item-${session.id}`}
                >
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <DeviceIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {session.deviceName || 'Unknown Device'}
                      </span>
                      {isCurrent && (
                        <Badge variant="outline" className="text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(session.lastActive || session.createdAt)}
                      </span>
                      {session.location && (
                        <span>{session.location}</span>
                      )}
                    </div>
                  </div>
                  
                  {!isCurrent && (
                    <Button
                      variant="ghost"
                      onClick={() => handleRevoke(session.id)}
                      disabled={revokingId === session.id}
                      className="min-h-[44px] min-w-[44px] p-2 rounded-lg text-destructive hover:text-destructive"
                      data-testid={`revoke-session-${session.id}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
