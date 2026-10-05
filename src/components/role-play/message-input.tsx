"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

interface MessageInputProps {
  disabled?: boolean;
  onSend: (message: string) => void;
}

export function MessageInput({
  disabled = false,
  onSend,
}: MessageInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = value.trim();

    if (!message || disabled) {
      return;
    }

    onSend(message);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex items-end gap-3
        border-t border-[var(--usus-border)]
        p-4
      "
    >
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={disabled}
        rows={1}
        placeholder={
          disabled
            ? "Customer is responding..."
            : "Type your response..."
        }
        className="
          min-h-12 flex-1 resize-none
          rounded-xl
          border border-[var(--usus-border)]
          bg-[var(--usus-background)]
          px-4 py-3
          text-sm
          text-[var(--usus-text)]
          outline-none
          transition-all
          placeholder:text-[var(--usus-text-soft)]
          focus:border-[var(--usus-primary)]
          focus:ring-2
          focus:ring-[var(--usus-primary-soft)]
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
        onKeyDown={(event) => {
          if (
            event.key === "Enter" &&
            !event.shiftKey
          ) {
            event.preventDefault();

            event.currentTarget.form?.requestSubmit();
          }
        }}
      />

      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="
          flex h-12 shrink-0 cursor-pointer
          items-center justify-center gap-2
          rounded-xl
          bg-[var(--usus-primary)]
          px-5
          text-sm font-semibold
          text-[#111111]
          transition-all duration-200
          hover:brightness-95
          hover:shadow-md
          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        <Send size={16} />

        <span className="hidden sm:inline">
          Send
        </span>
      </button>
    </form>
  );
};