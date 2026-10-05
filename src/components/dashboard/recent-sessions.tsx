import Link from "next/link";

interface RecentSession {
  id?: string;
  scenarioId?: string;
  title: string;
  category: string;
  date: string;
  score: number;
}

interface RecentSessionsProps {
  sessions: RecentSession[];
}

export function RecentSessions({
  sessions,
}: RecentSessionsProps) {
  return (
    <section
      className="
        overflow-hidden
        rounded-[var(--usus-radius)]
        border
        border-[var(--usus-border)]
        bg-[var(--usus-surface)]
        shadow-[var(--usus-shadow)]
        transition-all
        duration-200
        hover:border-[var(--usus-primary)]
        hover:shadow-lg
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-[var(--usus-border)]
          px-5
          py-5
        "
      >
        <div>
          <h2 className="font-semibold text-[var(--usus-text)]">
            Recent sessions
          </h2>

          <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
            Your latest training activity.
          </p>
        </div>

        <Link
          href="/history"
          className="
            cursor-pointer
            text-sm
            font-medium
            text-[var(--usus-text-muted)]
            transition-colors
            hover:text-[var(--usus-primary)]
          "
        >
          View history
        </Link>
      </div>

      <div>
        {sessions.map((session, index) => {
          const sessionId = session.id;

          if (!sessionId) {
            return null;
          }

          return (
            <Link
              key={sessionId}
              href={`/history/${sessionId}`}
              className="
                group
                flex
                w-full
                cursor-pointer
                items-center
                justify-between
                gap-4
                border-b
                border-[var(--usus-border)]
                px-5
                py-5
                text-left
                transition-colors
                duration-200
                last:border-b-0
                hover:bg-[var(--usus-sidebar-hover)]
                focus:outline-none
                focus:ring-2
                focus:ring-inset
                focus:ring-[var(--usus-primary)]
              "
            >
              <div className="min-w-0">
                <h3
                  className="
                    truncate
                    text-sm
                    font-semibold
                    text-[var(--usus-text)]
                    transition-colors
                    group-hover:text-[var(--usus-primary-hover)]
                  "
                >
                  {session.title}
                </h3>

                <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
                  {session.category} · {session.date}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-base font-bold text-[var(--usus-text)]">
                  {session.score}%
                </p>

                <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
                  Completed
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};