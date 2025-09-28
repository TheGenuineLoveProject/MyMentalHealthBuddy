import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ApiEndpoint } from "@shared/schema";

export default function ApiEndpoints() {
  const { toast } = useToast();
  
  const { data: endpoints = [], isLoading } = useQuery<ApiEndpoint[]>({
    queryKey: ["/api/endpoints"],
  });

  const testEndpointMutation = useMutation({
    mutationFn: async (endpoint: Pick<ApiEndpoint, 'method' | 'path'>) => {
      const response = await apiRequest("POST", "/api/test-endpoint", endpoint);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Endpoint Test Successful",
        description: `Response time: ${data.responseTime}`,
      });
    },
    onError: () => {
      toast({
        title: "Endpoint Test Failed",
        description: "Could not reach the endpoint",
        variant: "destructive",
      });
    },
  });

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-yellow-100 text-yellow-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">API Endpoints</h3>
        <Card>
          <CardContent className="p-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4" data-testid="section-api-endpoints">
        API Endpoints
      </h3>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {endpoints.map((endpoint) => (
            <div 
              key={endpoint.id} 
              className="border-b border-gray-100 last:border-b-0"
              data-testid={`endpoint-${endpoint.id}`}
            >
              <div className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span 
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getMethodColor(endpoint.method)}`}
                      data-testid={`endpoint-method-${endpoint.id}`}
                    >
                      {endpoint.method.toUpperCase()}
                    </span>
                    <code 
                      className="text-sm font-mono text-gray-900"
                      data-testid={`endpoint-path-${endpoint.id}`}
                    >
                      {endpoint.path}
                    </code>
                    <span 
                      className="text-sm text-gray-600"
                      data-testid={`endpoint-description-${endpoint.id}`}
                    >
                      {endpoint.description}
                    </span>
                  </div>
                  <button 
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
                    onClick={() => testEndpointMutation.mutate({ method: endpoint.method, path: endpoint.path })}
                    disabled={testEndpointMutation.isPending}
                    data-testid={`button-test-endpoint-${endpoint.id}`}
                  >
                    {testEndpointMutation.isPending ? 'Testing...' : 'Test'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
