"use client";

interface OverallProgressProps {
  score: number;
  completion: number;
  completed: number;
  total: number;
}

export function OverallProgress({
  score,
  completion,
  completed,
  total,
}: OverallProgressProps) {
  const safeCompletion = Math.min(
    100,
    Math.max(0, completion)
  );

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference -
    (safeCompletion / 100) * circumference;

  return (
    <section
      className="
        rounded-[var(--usus-radius)]
        border
        border-[var(--usus-border)]
        bg-[var(--usus-surface)]
        p-6
        shadow-[var(--usus-shadow)]
        transition-all
        duration-200
        hover:-translate-y-0.5
        hover:border-[var(--usus-primary)]
        hover:shadow-lg
      "
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div>
          <p className="text-sm font-medium text-[var(--usus-text-muted)]">
            Overall progress
          </p>

          <div className="mt-2 flex items-end gap-2">
            <span className="text-3xl font-bold tracking-tight text-[var(--usus-text)]">
              {score}
            </span>

            <span className="mb-1 text-sm text-[var(--usus-text-muted)]">
              /100
            </span>
          </div>

          <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
            {completed} of {total} scenarios completed
          </p>
        </div>

        {/* Circular progress */}
        <div className="relative h-20 w-20 shrink-0">
          <svg
            className="h-20 w-20 -rotate-90"
            viewBox="0 0 80 80"
          >
            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="var(--usus-progress-track)"
              strokeWidth="7"
            />

            <circle
              cx="40"
              cy="40"
              r={radius}
              fill="none"
              stroke="var(--usus-primary)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-[var(--usus-text)]">
              {Math.round(safeCompletion)}%
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal progress */}
      <div className="mt-7">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-[var(--usus-text-muted)]">
            Training completion
          </span>

          <span className="text-sm font-semibold text-[var(--usus-text)]">
            {Math.round(safeCompletion)}%
          </span>
        </div>

        <div
          className="
            h-2.5
            w-full
            overflow-hidden
            rounded-full
            bg-[var(--usus-progress-track)]
          "
        >
          <div
            className="
              h-full
              rounded-full
              bg-[var(--usus-primary)]
              transition-all
              duration-700
              ease-out
            "
            style={{
              width: `${safeCompletion}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
};