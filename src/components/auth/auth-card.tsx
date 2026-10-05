import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({
  children,
  className,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[430px]",
        "rounded-2xl",
        "border border-[var(--usus-border)]",
        "bg-[var(--usus-surface)]",
        "px-7 py-8 sm:px-9 sm:py-9",
        "shadow-[var(--usus-shadow)]",
        "transition-colors duration-200",
        className,
      )}
    >
      {children}
    </div>
  );
};