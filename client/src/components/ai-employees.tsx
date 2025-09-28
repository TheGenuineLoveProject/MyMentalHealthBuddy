import { useQuery } from "@tanstack/react-query";
import { Brain, Heart, Shield, Zap, Activity } from "lucide-react";

interface AIEmployee {
  name: string;
  role: string;
  status: string;
  tasksCompleted: number;
  responseTime: string;
  accuracy: string;
}

interface DashboardData {
  systemStatus: {
    status: string;
    uptime: number;
    timestamp: string;
    database: { status: string; responseTime: number };
    memory: { used: number; total: number; percentage: number };
    cache: { hits: number; misses: number; size: number };
  };
  aiEmployees: AIEmployee[];
  services: Array<{
    id: string;
    name: string;
    status: string;
    health: string;
  }>;
  stats: {
    totalUsers: number;
    activeSessionsToday: number;
    moodEntriesTotal: number;
    journalEntriesTotal: number;
    aiSessionsCompleted: number;
    averageResponseTime: string;
    platformVersion: string;
  };
}

export default function AIEmployees() {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const getAIIcon = (name: string) => {
    if (name.includes("Mind")) return <Brain className="w-5 h-5 text-purple-500" />;
    if (name.includes("Heal")) return <Heart className="w-5 h-5 text-pink-500" />;
    if (name.includes("Debug")) return <Shield className="w-5 h-5 text-blue-500" />;
    if (name.includes("Evolution")) return <Zap className="w-5 h-5 text-yellow-500" />;
    return <Activity className="w-5 h-5 text-green-500" />;
  };

  const getStatusColor = (status: string) => {
    return status === "active" ? "text-green-600" : "text-gray-500";
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">AI Employees</h2>
        </div>
        <div className="text-gray-500">Loading AI status...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Brain className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">AI Employees</h2>
        </div>
        <div className="text-red-500">Failed to load AI status</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6" data-testid="ai-employees-container">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Brain className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800" data-testid="ai-employees-title">
            AI Employees Performance
          </h2>
        </div>
        <div className="text-sm text-gray-500">
          Platform v{data.stats.platformVersion}
        </div>
      </div>

      {/* AI Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-700" data-testid="ai-sessions-count">
            {data.stats.aiSessionsCompleted.toLocaleString()}
          </div>
          <div className="text-xs text-purple-600">Total AI Sessions</div>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-700" data-testid="avg-response-time">
            {data.stats.averageResponseTime}
          </div>
          <div className="text-xs text-blue-600">Avg Response Time</div>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-700" data-testid="active-ai-count">
            {data.aiEmployees.filter(ai => ai.status === "active").length}
          </div>
          <div className="text-xs text-green-600">Active AI Agents</div>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4">
          <div className="text-2xl font-bold text-amber-700" data-testid="total-tasks">
            {data.aiEmployees.reduce((sum, ai) => sum + ai.tasksCompleted, 0).toLocaleString()}
          </div>
          <div className="text-xs text-amber-600">Total Tasks Completed</div>
        </div>
      </div>

      {/* AI Employees List */}
      <div className="space-y-3">
        {data.aiEmployees.map((ai) => (
          <div
            key={ai.name}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
            data-testid={`ai-employee-${ai.name.replace(/\s+/g, '-').toLowerCase()}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getAIIcon(ai.name)}
                <div>
                  <h3 className="font-semibold text-gray-800">{ai.name}</h3>
                  <p className="text-sm text-gray-500">{ai.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-700">
                    {ai.tasksCompleted.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">tasks</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600">
                    {ai.responseTime}
                  </div>
                  <div className="text-xs text-gray-500">response</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {ai.accuracy}
                  </div>
                  <div className="text-xs text-gray-500">accuracy</div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  ai.status === "active" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {ai.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* System Resources */}
      {data.systemStatus && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">System Resources</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {data.systemStatus.memory && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Memory Usage</span>
                  <span className="font-medium">{(data.systemStatus.memory.percentage || 0).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                    style={{ width: `${data.systemStatus.memory.percentage || 0}%` }}
                  />
                </div>
              </div>
            )}
            {data.systemStatus.cache && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Cache Hit Rate</span>
                  <span className="font-medium">
                    {(data.systemStatus.cache.hits && data.systemStatus.cache.misses !== undefined 
                      ? ((data.systemStatus.cache.hits / (data.systemStatus.cache.hits + data.systemStatus.cache.misses)) * 100) 
                      : 0).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                    style={{ 
                      width: `${(data.systemStatus.cache.hits && data.systemStatus.cache.misses !== undefined
                        ? (data.systemStatus.cache.hits / (data.systemStatus.cache.hits + data.systemStatus.cache.misses)) * 100
                        : 0)}%` 
                    }}
                  />
                </div>
              </div>
            )}
            {data.systemStatus.database && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Database Response</span>
                  <span className="font-medium">{data.systemStatus.database.responseTime || 0}ms</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      (data.systemStatus.database.responseTime || 0) < 100 
                        ? 'bg-gradient-to-r from-green-400 to-green-600' 
                        : 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                    }`}
                    style={{ width: `${Math.min(100, (100 - (data.systemStatus.database.responseTime || 0) / 5))}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}