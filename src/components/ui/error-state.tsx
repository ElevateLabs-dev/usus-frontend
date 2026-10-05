import { AlertCircle } from "lucide-react";
import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this information. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center">
      <AlertCircle className="text-red-500" size={28} />

      <h3 className="font-semibold text-slate-900">
        {title}
      </h3>

      <p className="max-w-md text-sm text-slate-500">
        {message}
      </p>

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
        >
          Try again
        </Button>
      )}
    </div>
  );
}
