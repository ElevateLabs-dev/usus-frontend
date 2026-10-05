import Link from "next/link";

import type { EvaluationScenario } from "@/types/evaluation";

interface EvaluationHeaderProps {
  scenario: EvaluationScenario;
  completionTime: number;
}

export function EvaluationHeader({
  scenario,
  completionTime,
}: EvaluationHeaderProps) {
  return (
    <section className="rounded-2xl border border-[var(--usus-border)] bg-[var(--usus-surface)] p-6 shadow-[var(--usus-shadow)] transition-colors duration-200">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href={`/scenarios/${scenario.id}`}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-text)]"
          >
            <span aria-hidden="true">←</span>
            Back to scenario
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--usus-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--usus-text)]">
              {scenario.category}
            </span>

            <span className="rounded-full border border-[var(--usus-border)] bg-[var(--usus-surface-soft)] px-3 py-1 text-xs font-medium text-[var(--usus-text-muted)]">
              {scenario.difficulty}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-[var(--usus-text)] sm:text-3xl">
            Evaluation & Feedback
          </h1>

          <p className="mt-2 text-base font-medium text-[var(--usus-text)]">
            {scenario.title}
          </p>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--usus-text-muted)]">
            Review your performance, understand your strengths, and see where
            you can improve in your next training session.
          </p>
        </div>

        <div className="shrink-0 rounded-xl border border-[var(--usus-border)] bg-[var(--usus-surface-soft)] px-4 py-3">
          <p className="text-xs font-medium text-[var(--usus-text-muted)]">
            Session time
          </p>

          <p className="mt-1 text-lg font-bold text-[var(--usus-text)]">
            {completionTime} min
          </p>
        </div>
      </div>
    </section>
  );
};