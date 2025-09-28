import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, Zap, Database, TrendingUp, RefreshCw, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HealthMetrics {
  status: string;
  timestamp: string;
  uptime: number;
  performance: {
    totalRequests: number;
    requestsPerMinute: number;
    averageResponseTime: string;
    p95ResponseTime: string;
    p99ResponseTime: string;
    errorRate: string;
  };
  memory: {
    rss: string;
    heapTotal: string;
    heapUsed: string;
    external: string;
  };
  lastReset: string;
}

interface CacheStats {
  keys: number;
  hits: number;
  misses: number;
  hitRate: number;
}

interface MetricsResponse {
  health: HealthMetrics;
  cache: {
    api: CacheStats;
    health: CacheStats;
    ai: CacheStats;
  };
  timestamp: string;
}

export function PerformanceMetrics() {
  const { toast } = useToast();
  
  const { data: metrics, isLoading, refetch } = useQuery<MetricsResponse>({
    queryKey: ["/api/metrics"],
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  const clearCache = async () => {
    try {
      const response = await fetch("/api/cache/clear", {
        method: "POST",
        credentials: "include",
      });
      
      if (response.ok) {
        toast({
          title: "Cache Cleared",
          description: "All caches have been cleared successfully",
        });
        refetch();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cache",
        variant: "destructive",
      });
    }
  };

  if (isLoading || !metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const health = metrics?.health;
  const cache = metrics?.cache;

  const cacheHitRate = cache ? 
    ((cache.api.hitRate + cache.health.hitRate + cache.ai.hitRate) / 3 * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Health Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </CardTitle>
          <CardDescription>Real-time performance monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Status</p>
              <div className="flex items-center gap-2">
                <Badge variant={health?.status === "healthy" ? "default" : "destructive"}>
                  {health?.status || "unknown"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {health?.uptime ? `${Math.floor(health.uptime / 60)}m uptime` : ""}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Response Time</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Avg</span>
                  <span className="font-mono">{health?.performance?.averageResponseTime || "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>P95</span>
                  <span className="font-mono">{health?.performance?.p95ResponseTime || "-"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Request Rate</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{health?.performance?.requestsPerMinute || 0}</span>
                <span className="text-sm text-muted-foreground">req/min</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Error Rate</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{health?.performance?.errorRate || "0%"}</span>
                {parseFloat(health?.performance?.errorRate) > 5 && (
                  <Badge variant="destructive" className="text-xs">HIGH</Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cache Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cache Performance
          </CardTitle>
          <CardDescription>Cache hit rates and statistics</CardDescription>
          <div className="flex gap-2 mt-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => refetch()}
              className="gap-2"
              data-testid="button-refresh-metrics"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={clearCache}
              className="gap-2"
              data-testid="button-clear-cache"
            >
              <Trash2 className="h-4 w-4" />
              Clear Cache
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Hit Rate</span>
                <span className="font-mono">{cacheHitRate}%</span>
              </div>
              <Progress value={Number(cacheHitRate)} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* API Cache */}
              <div className="space-y-2">
                <p className="text-sm font-medium">API Cache</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Keys</span>
                    <span>{cache?.api?.keys || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hits</span>
                    <span>{cache?.api?.hits || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hit Rate</span>
                    <span>{((cache?.api?.hitRate || 0) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Health Cache */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Health Cache</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Keys</span>
                    <span>{cache?.health?.keys || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hits</span>
                    <span>{cache?.health?.hits || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hit Rate</span>
                    <span>{((cache?.health?.hitRate || 0) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* AI Cache */}
              <div className="space-y-2">
                <p className="text-sm font-medium">AI Cache</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Keys</span>
                    <span>{cache?.ai?.keys || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hits</span>
                    <span>{cache?.ai?.hits || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hit Rate</span>
                    <span>{((cache?.ai?.hitRate || 0) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memory Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Memory Usage
          </CardTitle>
          <CardDescription>Server memory utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">RSS</p>
              <p className="font-mono">{health?.memory?.rss || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Heap Total</p>
              <p className="font-mono">{health?.memory?.heapTotal || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Heap Used</p>
              <p className="font-mono">{health?.memory?.heapUsed || "-"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">External</p>
              <p className="font-mono">{health?.memory?.external || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}