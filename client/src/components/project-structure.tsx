import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ProjectStructure, Script } from "@shared/schema";

export default function ProjectStructure() {
  const { data: structure = [], isLoading: structureLoading } = useQuery<ProjectStructure[]>({
    queryKey: ["/api/structure"],
  });

  const { data: scripts = [], isLoading: scriptsLoading } = useQuery<Script[]>({
    queryKey: ["/api/scripts"],
  });

  const isLoading = structureLoading || scriptsLoading;

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-2 mb-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-3 mb-3">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const getFileIcon = (type: string, name: string) => {
    if (type === 'folder') return 'fas fa-folder text-blue-600';
    if (name.endsWith('.json')) return 'fas fa-file text-yellow-600';
    if (name.endsWith('.ts') || name.endsWith('.tsx')) return 'fas fa-file text-blue-600';
    if (name.endsWith('.js') || name.endsWith('.jsx')) return 'fas fa-file text-yellow-600';
    return 'fas fa-file text-gray-600';
  };

  const getScriptButtonColor = (environment: string) => {
    switch (environment) {
      case 'backend': return 'bg-green-600 hover:bg-green-700';
      case 'frontend': return 'bg-blue-600 hover:bg-blue-700';
      case 'fullstack': return 'bg-purple-600 hover:bg-purple-700';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Structure */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4" data-testid="section-project-structure">
              Project Structure
            </h3>
            <div className="space-y-1 text-sm font-mono">
              {structure.map((item) => (
                <div 
                  key={item.id} 
                  className="flex items-center space-x-2"
                  data-testid={`structure-item-${item.id}`}
                >
                  <i className={getFileIcon(item.type, item.name)}></i>
                  <span data-testid={`structure-name-${item.id}`}>{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scripts Panel */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4" data-testid="section-development-scripts">
              Development Scripts
            </h3>
            <div className="space-y-3">
              {scripts.map((script) => (
                <div 
                  key={script.id} 
                  className="border border-gray-200 rounded-lg p-3"
                  data-testid={`script-${script.id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="font-medium text-gray-900"
                      data-testid={`script-name-${script.id}`}
                    >
                      {script.name}
                    </span>
                    <button 
                      className={`text-white text-xs px-3 py-1 rounded-md transition-colors ${getScriptButtonColor(script.environment)}`}
                      data-testid={`button-run-script-${script.id}`}
                    >
                      Run
                    </button>
                  </div>
                  <code 
                    className="text-xs text-gray-600 font-mono"
                    data-testid={`script-command-${script.id}`}
                  >
                    {script.command}
                  </code>
                  {script.description && (
                    <p 
                      className="text-xs text-gray-500 mt-1"
                      data-testid={`script-description-${script.id}`}
                    >
                      {script.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
