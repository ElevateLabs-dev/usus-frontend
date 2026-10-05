import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        `
          rounded-xl
          border
          border-[var(--usus-border)]
          bg-[var(--usus-surface)]
          text-[var(--usus-text)]
          shadow-[var(--usus-shadow)]
          transition-colors
          duration-200
        `,
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        `
          border-b
          border-[var(--usus-border-soft)]
          p-5
          text-[var(--usus-text)]
          transition-colors
          duration-200
        `,
        className,
      )}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        `
          p-5
          text-[var(--usus-text)]
          transition-colors
          duration-200
        `,
        className,
      )}
      {...props}
    />
  );
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        `
          border-t
          border-[var(--usus-border-soft)]
          p-5
          text-[var(--usus-text)]
          transition-colors
          duration-200
        `,
        className,
      )}
      {...props}
    />
  );
};