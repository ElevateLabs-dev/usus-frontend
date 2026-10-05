interface OverallScoreProps {
  score: number;
  summary: string;
  completionTime?: number;
}

export function OverallScore({
  score,
  summary,
  completionTime,
}: OverallScoreProps) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (score / 100) * circumference;

  return (
    <section className="rounded-2xl border border-[var(--usus-border)] bg-[var(--usus-surface)] p-6 shadow-[var(--usus-shadow)]">
      <div className="grid gap-6 md:grid-cols-[180px_1fr] md:items-center">
        <div className="flex justify-center">
          <div className="relative h-36 w-36">
            <svg
              className="h-full w-full -rotate-90"
              viewBox="0 0 128 128"
            >
              <circle
                cx="64"
                cy="64"
                r={radius}
                fill="none"
                stroke="var(--usus-progress-track)"
                strokeWidth="10"
              />

              <circle
                cx="64"
                cy="64"
                r={radius}
                fill="none"
                stroke="var(--usus-primary)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={progress}
                className="transition-all duration-700"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-[var(--usus-text)]">
                {score}
              </span>

              <span className="text-xs text-[var(--usus-text-muted)]">
                / 100
              </span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-[var(--usus-primary-hover)]">
            Overall performance
          </p>

          <h2 className="mt-1 text-xl font-bold text-[var(--usus-text)]">
            Strong performance
          </h2>

          <p className="mt-3 text-sm leading-6 text-[var(--usus-text-muted)]">
            {summary}
          </p>

          {completionTime !== undefined && (
            <div className="mt-5 flex items-center gap-2 text-sm text-[var(--usus-text-muted)]">
              <span>Session duration:</span>

              <span className="font-semibold text-[var(--usus-text)]">
                {completionTime} min
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};