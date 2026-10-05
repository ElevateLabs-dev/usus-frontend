"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui";

type PasswordInputProps =
  React.InputHTMLAttributes<HTMLInputElement>;

export function PasswordInput({
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={visible ? "text" : "password"}
        className="pr-10"
      />

      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--usus-muted)]"
        aria-label={
          visible
            ? "Hide password"
            : "Show password"
        }
      >
        {visible ? (
          <EyeOff size={15} />
        ) : (
          <Eye size={15} />
        )}
      </button>
    </div>
  );
}


