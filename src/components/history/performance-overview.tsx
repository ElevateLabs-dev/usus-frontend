import type { HistorySession } from "@/types/history";

interface PerformanceOverviewProps {
  session: HistorySession;
}

export function PerformanceOverview({
  session,
}: PerformanceOverviewProps) {
  return (
    <section
      className="
        rounded-[var(--usus-radius)]
        border
        border-[var(--usus-border)]
        bg-[var(--usus-surface)]
        p-6
        shadow-[var(--usus-shadow)]
      "
    >
      {/* Header */}

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[var(--usus-text)]">
          Performance breakdown
        </h2>

        <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
          Your performance across the skills tested
          during this session.
        </p>
      </div>

      {/* Overall score */}

      <div className="mb-7 flex items-center justify-between rounded-xl bg-[var(--usus-surface-soft)] p-4">
        <div>
          <p className="text-sm text-[var(--usus-text-muted)]">
            Overall score
          </p>

          <p className="mt-1 text-3xl font-bold text-[var(--usus-text)]">
            {session.score}%
          </p>
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-[var(--usus-primary)]">
          <span className="text-sm font-bold text-[var(--usus-text)]">
            {session.score}
          </span>
        </div>
      </div>

      {/* Skills */}

      <div className="space-y-5">
        {session.skills.map((skill) => (
          <div key={skill.id}>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--usus-text)]">
                {skill.name}
              </span>

              <span className="text-sm font-semibold text-[var(--usus-text)]">
                {skill.score}%
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-[var(--usus-progress-track)]">
              <div
                className="
                  h-full
                  rounded-full
                  bg-[var(--usus-primary)]
                  transition-all
                  duration-500
                "
                style={{
                  width: `${Math.min(
                    Math.max(skill.score, 0),
                    100,
                  )}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};