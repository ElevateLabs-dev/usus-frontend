import { Loader2 } from "lucide-react";

export function Loading({
  text = "Loading...",
}: {
  text?: string;
}) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3">
      <Loader2 className="animate-spin text-slate-500" size={24} />

      <p className="text-sm text-slate-500">
        {text}
      </p>
    </div>
  );
}
