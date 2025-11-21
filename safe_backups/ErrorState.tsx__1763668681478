import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function ErrorState({ 
  title = "Something went wrong", 
  message, 
  retry 
}: ErrorStateProps) {
  return (
    <div className="text-center py-12 px-4" data-testid="error-state">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
        <AlertCircle className="text-red-500" size={32} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 max-w-sm mx-auto">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          data-testid="error-state-retry"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
