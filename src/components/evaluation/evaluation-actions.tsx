import Link from "next/link";

interface EvaluationActionsProps {
  scenarioId: string;
  sessionId: string;
}

export function EvaluationActions({
  scenarioId,
  sessionId,
}: EvaluationActionsProps) {
  return (
    <section className="rounded-2xl border border-[var(--usus-border)] bg-[var(--usus-surface)] p-6 shadow-[var(--usus-shadow)] transition-colors duration-200">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-[var(--usus-text)]">
            What would you like to do next?
          </h2>

          <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
            Continue practising or review your previous training activity.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/scenarios/${scenarioId}`}
            className="inline-flex items-center justify-center rounded-xl border border-[var(--usus-border)] bg-[var(--usus-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--usus-text)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--usus-primary)] hover:bg-[var(--usus-primary-soft)]"
          >
            Try again
          </Link>

          <Link
            href="/history"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--usus-primary)] px-4 py-2.5 text-sm font-semibold text-black transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--usus-primary-hover)]"
          >
            View history
          </Link>
        </div>
      </div>

      {/* API/session identifier is intentionally available to the component.
          It can later be used for retry, sharing, or session-specific actions. */}
      <div className="mt-4 border-t border-[var(--usus-border-soft)] pt-4">
        <p className="text-xs text-[var(--usus-text-soft)]">
          Session: {sessionId}
        </p>
      </div>
    </section>
  );
};