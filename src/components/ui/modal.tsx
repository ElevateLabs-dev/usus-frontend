"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        className="
          absolute
          inset-0
          bg-black/40
          backdrop-blur-sm
        "
        onClick={onClose}
      />

      {/* Modal container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || "Dialog"}
        className={cn(
          `
            relative
            z-10
            w-full
            max-w-lg
            overflow-hidden
            rounded-xl
            border
            border-[var(--usus-border)]
            bg-[var(--usus-surface)]
            text-[var(--usus-text)]
            shadow-[var(--usus-shadow)]
          `,
          className
        )}
      >
        {/* Header */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            border-b
            border-[var(--usus-border)]
            p-5
          "
        >
          {title && (
            <h2 className="text-lg font-semibold text-[var(--usus-text)]">
              {title}
            </h2>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="
              rounded-lg
              p-2
              text-[var(--usus-text-muted)]
              transition-colors
              hover:bg-[var(--usus-background)]
              hover:text-[var(--usus-text)]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--usus-primary)]
            "
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Modal content */}
        <div className="p-5 text-[var(--usus-text)]">
          {children}
        </div>
      </div>
    </div>
  );
}