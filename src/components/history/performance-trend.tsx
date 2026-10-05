import type { HistoryTrendPoint } from "@/types/history";

interface PerformanceTrendProps {
  trend: HistoryTrendPoint[];
}

export function PerformanceTrend({
  trend,
}: PerformanceTrendProps) {
  const latest =
    trend.length > 0
      ? trend[trend.length - 1].score
      : 0;

  const previous =
    trend.length > 1
      ? trend[trend.length - 2].score
      : latest;

  const difference = latest - previous;

  return (
    <section
      className="
        rounded-2xl
        border border-[var(--usus-border)]
        bg-[var(--usus-surface)]
        p-5
        shadow-[var(--usus-shadow)]
      "
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-semibold text-[var(--usus-text)]">
            Performance trend
          </h2>

          <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
            See how your scores have changed over time.
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-[var(--usus-text)]">
            {latest}%
          </p>

          <p
            className={
              difference >= 0
                ? "text-xs text-[var(--usus-primary)]"
                : "text-xs text-[var(--usus-danger)]"
            }
          >
            {difference >= 0 ? "+" : ""}
            {difference}% from previous
          </p>
        </div>
      </div>

      <div className="mt-8 flex h-48 items-end gap-2 overflow-hidden">
        {trend.map((point) => (
          <div
            key={point.date}
            className="group flex h-full flex-1 flex-col justify-end"
          >
            <div className="relative flex h-full items-end">
              <div
                className="
                  w-full rounded-t-lg
                  bg-[var(--usus-primary)]
                  transition-all duration-200
                  group-hover:opacity-80
                "
                style={{
                  height: `${Math.max(
                    point.score,
                    5
                  )}%`,
                }}
                title={`${point.score}%`}
              />
            </div>

            <span className="mt-2 truncate text-center text-[10px] text-[var(--usus-text-soft)]">
              {new Date(point.date).toLocaleDateString(
                undefined,
                {
                  month: "short",
                  day: "numeric",
                }
              )}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};