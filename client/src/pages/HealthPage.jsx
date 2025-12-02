import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function HealthPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/health"],
  });

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-neutral-900 to-neutral-950 text-white">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-neutral-400 hover:text-white transition" data-testid="link-back">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl font-bold" data-testid="text-title">Health Check</h1>
        </div>

        <div className="bg-neutral-800 rounded-xl p-6" data-testid="section-health">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-3 text-red-400">
              <XCircle className="w-6 h-6" />
              <span>Health check failed</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-lg font-medium">System Status: {data?.status || "Unknown"}</span>
              </div>
              <pre className="p-4 bg-neutral-900 rounded-lg text-sm overflow-x-auto" data-testid="text-health-data">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
