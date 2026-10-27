import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "flex h-10 w-full rounded-lg border px-3 py-2",
        "border-[var(--usus-border)]",
        "bg-[var(--usus-surface)]",
        "text-sm text-[var(--usus-text)]",
        "placeholder:text-[var(--usus-text-soft)]",
        "outline-none transition-colors",
        "focus:border-[var(--usus-primary)]",
        "focus:ring-2 focus:ring-[var(--usus-primary)]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "[&:-webkit-autofill]:!bg-[var(--usus-surface)]",
        "[&:-webkit-autofill]:!text-[var(--usus-text)]",
        className
      )}
      style={{
        color: "var(--usus-text)",
        colorScheme: "light",
        ...props.style,
      }}
    />
  );
}