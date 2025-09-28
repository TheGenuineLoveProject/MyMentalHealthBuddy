import { AlertCircle, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface ErrorAlertProps {
  title?: string;
  message: string;
  errors?: Array<{ field: string; message: string }>;
  onClose?: () => void;
  variant?: "default" | "destructive";
}

export function ErrorAlert({ 
  title = "Error", 
  message, 
  errors, 
  onClose,
  variant = "destructive" 
}: ErrorAlertProps) {
  return (
    <Alert variant={variant} className="relative">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="pr-8" data-testid="text-error-title">{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="space-y-2">
          <p data-testid="text-error-message">{message}</p>
          {errors && errors.length > 0 && (
            <ul className="list-disc list-inside space-y-1 text-sm">
              {errors.map((error, index) => (
                <li key={index} data-testid={`text-error-field-${error.field}`}>
                  <span className="font-medium">{formatFieldName(error.field)}:</span> {error.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      </AlertDescription>
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={onClose}
          data-testid="button-close-error"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  );
}

// Helper function to format field names for display
function formatFieldName(field: string): string {
  // Convert camelCase to Title Case
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}