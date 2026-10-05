import Link from "next/link";

export function HistoryActions() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Link
        href="/scenarios"
        className="
          rounded-2xl
          border border-[var(--usus-border)]
          bg-[var(--usus-surface)]
          p-5
          transition-all duration-200
          hover:-translate-y-1
          hover:border-[var(--usus-primary)]
          hover:bg-[var(--usus-primary-soft)]
        "
      >
        <p className="font-semibold text-[var(--usus-text)]">
          Browse scenarios
        </p>

        <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
          Find another scenario to practice.
        </p>
      </Link>

      <Link
        href="/dashboard"
        className="
          rounded-2xl
          border border-[var(--usus-border)]
          bg-[var(--usus-surface)]
          p-5
          transition-all duration-200
          hover:-translate-y-1
          hover:border-[var(--usus-primary)]
          hover:bg-[var(--usus-primary-soft)]
        "
      >
        <p className="font-semibold text-[var(--usus-text)]">
          Back to dashboard
        </p>

        <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
          See your overall training progress.
        </p>
      </Link>

      <Link
        href="/learning-path"
        className="
          rounded-2xl
          border border-[var(--usus-border)]
          bg-[var(--usus-surface)]
          p-5
          transition-all duration-200
          hover:-translate-y-1
          hover:border-[var(--usus-primary)]
          hover:bg-[var(--usus-primary-soft)]
        "
      >
        <p className="font-semibold text-[var(--usus-text)]">
          Continue learning
        </p>

        <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
          Continue along your learning path.
        </p>
      </Link>
    </section>
  );
};