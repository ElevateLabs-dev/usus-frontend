import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",

        variant === "primary" &&
          "bg-slate-900 text-white hover:bg-slate-800",

        variant === "secondary" &&
          "bg-slate-100 text-slate-900 hover:bg-slate-200",

        variant === "outline" &&
          "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",

        variant === "ghost" &&
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900",

        variant === "danger" &&
          "bg-red-600 text-white hover:bg-red-700",

        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-10 px-4 text-sm",
        size === "lg" && "h-12 px-6 text-base",

        className
      )}
      {...props}
    />
  );
}
