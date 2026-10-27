"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui";

type PasswordInputProps =
  React.InputHTMLAttributes<HTMLInputElement>;

export function PasswordInput({
  className = "",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className={`
          h-11
          w-full
          rounded-xl
          border-[var(--usus-border)]
          bg-[var(--usus-surface)]
          text-[var(--usus-text)]
          placeholder:text-[var(--usus-text-soft)]
          focus-visible:border-[var(--usus-primary)]
          focus-visible:ring-[var(--usus-primary)]
          pr-10
          [color-scheme:light]
          autofill:!bg-[var(--usus-surface)]
          autofill:!text-[var(--usus-text)]
          ${className}
        `}
        style={{
          color: "var(--usus-text)",
          backgroundColor: "var(--usus-surface)",
          WebkitTextFillColor: "var(--usus-text)",
          ...props.style,
        }}
      />

      <button
        type="button"
        onClick={() =>
          setVisible((current) => !current)
        }
        disabled={props.disabled}
        className="
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          text-[var(--usus-text-muted)]
          transition-colors
          hover:text-[var(--usus-text)]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--usus-primary)]
          disabled:cursor-not-allowed
          disabled:opacity-50
        "
        aria-label={
          visible
            ? "Hide password"
            : "Show password"
        }
        aria-controls={props.id}
        aria-pressed={visible}
      >
        {visible ? (
          <EyeOff size={16} aria-hidden="true" />
        ) : (
          <Eye size={16} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}