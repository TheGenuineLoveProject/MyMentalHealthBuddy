import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Package } from "@shared/schema";

export default function PackageInfo() {
  const { data: packages = [], isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const backendPackages = packages.filter(pkg => pkg.environment === 'backend');
  const frontendPackages = packages.filter(pkg => pkg.environment === 'frontend');

  if (isLoading) {
    return (
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Package Information</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-3" />
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <h3 className="text-lg font-semibold text-gray-900 mb-4" data-testid="section-package-information">
        Package Information
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backend Dependencies */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-900 mb-3" data-testid="backend-dependencies-title">
              Backend Dependencies
            </h4>
            <div className="space-y-2">
              {backendPackages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                  data-testid={`backend-package-${pkg.id}`}
                >
                  <span 
                    className="text-sm font-mono text-gray-900"
                    data-testid={`package-name-${pkg.id}`}
                  >
                    {pkg.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span 
                      className="text-sm text-gray-600"
                      data-testid={`package-version-${pkg.id}`}
                    >
                      {pkg.version}
                    </span>
                    {pkg.isDev && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        dev
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Frontend Dependencies */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-900 mb-3" data-testid="frontend-dependencies-title">
              Frontend Dependencies
            </h4>
            <div className="space-y-2">
              {frontendPackages.map((pkg) => (
                <div 
                  key={pkg.id} 
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                  data-testid={`frontend-package-${pkg.id}`}
                >
                  <span 
                    className="text-sm font-mono text-gray-900"
                    data-testid={`package-name-${pkg.id}`}
                  >
                    {pkg.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span 
                      className="text-sm text-gray-600"
                      data-testid={`package-version-${pkg.id}`}
                    >
                      {pkg.version}
                    </span>
                    {pkg.isDev && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        dev
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
