import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Service } from "@shared/schema";

interface ServiceStatusProps {
  services: Service[];
  isLoading: boolean;
}

export default function ServiceStatus({ services, isLoading }: ServiceStatusProps) {
  const healthQuery = useQuery({
    queryKey: ["/api/health"],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <CardContent className="p-0">
                <Skeleton className="h-6 w-32 mb-4" />
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  const getServiceIcon = (type: string) => {
    if (type.includes("Express")) return "fas fa-server text-green-600";
    if (type.includes("React")) return "fab fa-react text-blue-600";
    return "fas fa-heartbeat text-purple-600";
  };

  const getServiceIconBg = (type: string) => {
    if (type.includes("Express")) return "bg-green-100";
    if (type.includes("React")) return "bg-blue-100";
    return "bg-purple-100";
  };

  return (
    <section className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4" data-testid="section-service-status">
        Service Status
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${getServiceIconBg(service.type)} rounded-lg flex items-center justify-center`}>
                    <i className={getServiceIcon(service.type)}></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900" data-testid={`service-name-${service.id}`}>
                      {service.name}
                    </h4>
                    <p className="text-sm text-gray-600" data-testid={`service-type-${service.id}`}>
                      {service.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${service.status === 'running' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                  <span className={`text-sm font-medium ${service.status === 'running' ? 'text-green-600' : 'text-red-600'}`} data-testid={`service-status-${service.id}`}>
                    {service.status === 'running' ? 'Running' : 'Stopped'}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Port:</span>
                  <span className="font-mono text-gray-900" data-testid={`service-port-${service.id}`}>
                    {service.port}
                  </span>
                </div>
                {service.pid && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">PID:</span>
                    <span className="font-mono text-gray-900" data-testid={`service-pid-${service.id}`}>
                      {service.pid}
                    </span>
                  </div>
                )}
                {service.uptime && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uptime:</span>
                    <span className="font-mono text-gray-900" data-testid={`service-uptime-${service.id}`}>
                      {service.uptime}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <button 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  data-testid={`button-view-logs-${service.id}`}
                >
                  View Logs
                </button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Health Check Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-heartbeat text-purple-600"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900" data-testid="health-check-title">
                    Health Check
                  </h4>
                  <p className="text-sm text-gray-600" data-testid="health-check-subtitle">
                    API Status
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${healthQuery.data ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                <span className={`text-sm font-medium ${healthQuery.data ? 'text-green-600' : 'text-red-600'}`} data-testid="health-status">
                  {healthQuery.data ? 'Healthy' : 'Unhealthy'}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Response Time:</span>
                <span className="font-mono text-gray-900" data-testid="health-response-time">
                  {(healthQuery.data as any)?.responseTime || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last Check:</span>
                <span className="font-mono text-gray-900" data-testid="health-last-check">
                  {healthQuery.dataUpdatedAt ? new Date(healthQuery.dataUpdatedAt).toLocaleTimeString() : 'Never'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Success Rate:</span>
                <span className="text-green-600 text-sm font-medium" data-testid="health-success-rate">
                  {healthQuery.data ? '100%' : '0%'}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                onClick={() => healthQuery.refetch()}
                data-testid="button-run-health-check"
              >
                Run Check
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
