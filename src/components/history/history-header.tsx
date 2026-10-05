interface HistoryHeaderProps {
  totalSessions: number;
}

export function HistoryHeader({
  totalSessions,
}: HistoryHeaderProps) {
  return (
    <section>
      <p className="text-sm text-[var(--usus-text-muted)]">
        Trainee / History & Review
      </p>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--usus-text)]">
            History & Review
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--usus-text-muted)]">
            Review your training sessions, track your
            progress, and identify where you can improve.
          </p>
        </div>

        <div
          className="
            rounded-xl
            border border-[var(--usus-border)]
            bg-[var(--usus-surface)]
            px-4 py-2
            text-sm
            text-[var(--usus-text-muted)]
          "
        >
          {totalSessions} sessions
        </div>
      </div>
    </section>
  );
};