/** 
 * © 2025 Aaliyah Draws Art LLC. All rights reserved.
 * Unauthorized copying or distribution of this file is prohibited.
 * Built with GPT-4o, MIT/Proprietary license, integrated with evidence-based mental health models.
 */
import Sidebar from "@/components/sidebar";
import ServiceStatus from "@/components/service-status";
import ApiEndpoints from "@/components/api-endpoints";
import ProjectStructure from "@/components/project-structure";
import PackageInfo from "@/components/package-info";
import { PerformanceMetrics } from "@/components/performance-metrics";
import { useQuery } from "@tanstack/react-query";
import type { Service } from "@shared/schema";

export default function Dashboard() {
  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const healthQuery = useQuery({
    queryKey: ["/api/health"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-green-700">
               Platform Healing Activated • v50^ Deployed • Self-Evolving AI Online
              </h2>
              <h2 className="text-2xl font-bold text-gray-900" data-testid="page-title">
                Development Dashboard
              </h2>
              <p className="text-gray-600 mt-1" data-testid="page-subtitle">
                Node.js Express + React Vite Project
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${healthQuery.data ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-sm text-gray-600" data-testid="system-status">
                  {healthQuery.data ? 'All systems operational' : 'System check failed'}
                </span>
              </div>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                data-testid="button-open-terminal"
              >
                <i className="fas fa-terminal"></i>
                <span>Open Terminal</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <ServiceStatus services={services} isLoading={isLoading} />
          <PerformanceMetrics />
          <ApiEndpoints />
          <ProjectStructure />
          <PackageInfo />
        </main>
      </div>
    </div>
  );
}
