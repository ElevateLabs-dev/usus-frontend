"use client";

import { ArrowLeft, Clock, LogOut } from "lucide-react";

interface SimulationHeaderProps {
  category: string;
  difficulty: string;
  title: string;
  durationMinutes: number;
  onExit: () => void;
}

export function SimulationHeader({
  category,
  difficulty,
  title,
  durationMinutes,
  onExit,
}: SimulationHeaderProps) {
  return (
    <header
      className="
        flex flex-col gap-4
        border-b border-[var(--usus-border)]
        pb-5
        sm:flex-row sm:items-center sm:justify-between
      "
    >
      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={onExit}
          aria-label="Exit simulation"
          className="
            flex h-9 w-9 shrink-0 cursor-pointer
            items-center justify-center rounded-lg
            border border-[var(--usus-border)]
            bg-[var(--usus-surface)]
            text-[var(--usus-text-muted)]
            transition-all duration-200
            hover:border-[var(--usus-primary)]
            hover:bg-[var(--usus-primary-soft)]
            hover:text-[var(--usus-text)]
          "
        >
          <ArrowLeft size={17} />
        </button>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[var(--usus-text-muted)]">
              {category}
            </span>

            <span className="text-[var(--usus-text-soft)]">•</span>

            <span className="text-xs font-medium text-[var(--usus-text-muted)]">
              {difficulty}
            </span>
          </div>

          <h1 className="mt-1 truncate text-lg font-semibold text-[var(--usus-text)]">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="
            flex items-center gap-2
            rounded-lg
            border border-[var(--usus-border)]
            bg-[var(--usus-surface)]
            px-3 py-2
            text-xs text-[var(--usus-text-muted)]
          "
        >
          <Clock size={14} />

          <span>~{durationMinutes} min</span>
        </div>

        <button
          type="button"
          onClick={onExit}
          className="
            inline-flex items-center gap-2
            cursor-pointer rounded-lg
            border border-[var(--usus-border)]
            bg-[var(--usus-surface)]
            px-3 py-2
            text-xs font-medium
            text-[var(--usus-text-muted)]
            transition-all duration-200
            hover:border-[var(--usus-danger)]
            hover:bg-[var(--usus-danger)]
            hover:text-white
          "
        >
          <LogOut size={14} />
          Exit
        </button>
      </div>
    </header>
  );
};