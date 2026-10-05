import type { HistorySession } from "@/types/history";

interface SessionRowProps {
  session: HistorySession;
  onView?: (session: HistorySession) => void;
}

function getScoreClass(score: number) {
  if (score >= 80) {
    return "text-[var(--usus-primary)]";
  }

  if (score >= 60) {
    return "text-[var(--usus-text)]";
  }

  return "text-[var(--usus-danger)]";
}

function getStatusLabel(
  status: HistorySession["status"],
) {
  switch (status) {
    case "completed":
      return "Completed";

    case "in-progress":
      return "In progress";

    case "abandoned":
      return "Abandoned";

    default:
      return status;
  }
}

function formatDate(date: string) {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

function formatDuration(
  durationSeconds: number,
) {
  if (!Number.isFinite(durationSeconds)) {
    return "—";
  }

  const minutes = Math.floor(
    durationSeconds / 60,
  );

  const seconds = durationSeconds % 60;

  if (minutes === 0) {
    return `${seconds} sec`;
  }

  if (seconds === 0) {
    return `${minutes} min`;
  }

  return `${minutes} min ${seconds} sec`;
}

export function SessionRow({
  session,
  onView,
}: SessionRowProps) {
  return (
    <button
      type="button"
      onClick={() => onView?.(session)}
      className="
        group
        w-full
        border-b
        border-[var(--usus-border-soft)]
        px-5
        py-5
        text-left
        transition
        duration-200
        last:border-b-0
        hover:bg-[var(--usus-sidebar-hover)]
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-[var(--usus-primary)]
      "
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        {/* Session information */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className="
                font-semibold
                text-[var(--usus-text)]
                transition
                group-hover:text-[var(--usus-primary)]
              "
            >
              {session.scenarioTitle}
            </h3>

            <span
              className="
                rounded-full
                bg-[var(--usus-primary-soft)]
                px-2.5
                py-1
                text-xs
                font-medium
                text-[var(--usus-text)]
              "
            >
              {session.difficulty}
            </span>
          </div>

          <div
            className="
              mt-2
              flex
              flex-wrap
              items-center
              gap-x-3
              gap-y-1
              text-sm
              text-[var(--usus-text-muted)]
            "
          >
            <span>{session.category}</span>

            <span aria-hidden="true">
              •
            </span>

            <span>
              {formatDate(
                session.completedAt,
              )}
            </span>

            <span aria-hidden="true">
              •
            </span>

            <span>
              {formatDuration(
                session.durationSeconds,
              )}
            </span>
          </div>

          {/* Skills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {session.skills.map((skill) => (
              <span
                key={skill.id}
                className="
                  rounded-md
                  border
                  border-[var(--usus-border)]
                  bg-[var(--usus-surface-soft)]
                  px-2.5
                  py-1
                  text-xs
                  text-[var(--usus-text-muted)]
                "
              >
                {skill.name}: {skill.score}%
              </span>
            ))}
          </div>
        </div>

        {/* Score */}
        <div className="shrink-0 text-left sm:text-right">
          <p
            className={`text-2xl font-bold ${getScoreClass(
              session.score,
            )}`}
          >
            {session.score}%
          </p>

          <p
            className="
              mt-1
              text-xs
              text-[var(--usus-text-muted)]
            "
          >
            {getStatusLabel(
              session.status,
            )}
          </p>

          <span
            className="
              mt-3
              inline-block
              text-sm
              font-medium
              text-[var(--usus-text-muted)]
              transition
              group-hover:text-[var(--usus-primary)]
            "
          >
            View →
          </span>
        </div>
      </div>
    </button>
  );
};