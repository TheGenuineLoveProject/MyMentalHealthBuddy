import { useQuery } from "@tanstack/react-query";
import { Phone, Globe, AlertCircle } from "lucide-react";

export function CrisisPage() {
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["/api/crisis-resources?country=US"],
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
          <div>
            <h2 className="text-lg font-semibold text-red-900 mb-1">
              If you're in crisis, please reach out for help immediately
            </h2>
            <p className="text-red-800">
              These resources provide free, confidential support 24/7. You are not alone.
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-6">Crisis Resources</h1>

      {isLoading ? (
        <p className="text-gray-500">Loading resources...</p>
      ) : (
        <div className="space-y-4">
          {resources.map((resource: any) => (
            <div
              key={resource.id}
              className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500"
              data-testid={`crisis-resource-${resource.id}`}
            >
              <h3 className="text-xl font-semibold mb-2">{resource.name}</h3>
              <p className="text-gray-600 mb-4">{resource.description}</p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {resource.phoneNumber && (
                  <a
                    href={`tel:${resource.phoneNumber}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center"
                    data-testid={`button-call-${resource.id}`}
                  >
                    <Phone size={18} />
                    {resource.phoneNumber}
                  </a>
                )}
                
                {resource.website && (
                  <a
                    href={resource.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 text-center"
                    data-testid={`button-website-${resource.id}`}
                  >
                    <Globe size={18} />
                    Visit Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">Remember:</h3>
        <ul className="space-y-2 text-gray-700">
          <li>• Seeking help is a sign of strength, not weakness</li>
          <li>• Mental health crises are temporary and treatable</li>
          <li>• Professional support can make a real difference</li>
          <li>• You deserve care and compassion</li>
        </ul>
      </div>
    </div>
  );
}
