"use client";

import { AlertTriangle, X } from "lucide-react";

interface EndSessionDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function EndSessionDialog({
  open,
  onClose,
  onConfirm,
}: EndSessionDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/50
        px-4
        backdrop-blur-sm
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="end-session-title"
    >
      <div
        className="
          w-full max-w-md
          rounded-2xl
          border border-[var(--usus-border)]
          bg-[var(--usus-surface)]
          p-6
          shadow-2xl
        "
      >
        <div className="flex items-start justify-between gap-4">
          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-full
              bg-[var(--usus-primary-soft)]
              text-[var(--usus-text)]
            "
          >
            <AlertTriangle size={18} />
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="
              cursor-pointer
              rounded-lg p-2
              text-[var(--usus-text-muted)]
              transition-colors
              hover:bg-[var(--usus-muted)]
              hover:text-[var(--usus-text)]
            "
          >
            <X size={18} />
          </button>
        </div>

        <h2
          id="end-session-title"
          className="mt-5 text-lg font-semibold text-[var(--usus-text)]"
        >
          End this simulation?
        </h2>

        <p className="mt-2 text-sm leading-6 text-[var(--usus-text-muted)]">
          Your current conversation will be submitted for
          evaluation. You may not be able to continue this
          session afterward.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="
              cursor-pointer rounded-xl
              border border-[var(--usus-border)]
              bg-[var(--usus-surface)]
              px-4 py-2.5
              text-sm font-medium
              text-[var(--usus-text)]
              transition-all
              hover:bg-[var(--usus-muted)]
            "
          >
            Continue
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="
              cursor-pointer rounded-xl
              bg-[var(--usus-primary)]
              px-4 py-2.5
              text-sm font-semibold
              text-[#111111]
              transition-all
              hover:brightness-95
              hover:shadow-md
            "
          >
            End simulation
          </button>
        </div>
      </div>
    </div>
  );
};