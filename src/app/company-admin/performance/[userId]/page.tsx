"use client";

import Link from "next/link";
import { useStaffArea } from "@/hooks/use-staff-area";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ProgressBar } from "@/components/ui/progress-bar";

import {
  getTeamMembersProgress,
  getTraineeReport,
  type TeamMemberProgress,
  type TraineeReport,
} from "@/services/performance-service";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
}

function score(value: number | null) {
  return value === null ? "—" : `${value}%`;
}

export default function TraineePerformancePage() {
  const area = useStaffArea();

  const { userId } = useParams<{
    userId: string;
  }>();

  const [report, setReport] =
    useState<TraineeReport | null>(null);

  /** Name and email come from the team list. */
  const [member, setMember] =
    useState<TeamMemberProgress | null>(null);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getTraineeReport(userId),
      getTeamMembersProgress(),
    ])
      .then(([nextReport, team]) => {
        if (cancelled) {
          return;
        }

        setReport(nextReport);
        setMember(
          team.find(
            (item) => item.user_id === userId,
          ) ?? null,
        );
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load the report.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const recentSessions = [
    ...(report?.score_history ?? []),
  ]
    .reverse()
    .slice(0, 10);

  return (
    <div className="min-h-full bg-[var(--usus-background)]">
      <section className="px-6 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl space-y-8">
          <div>
            <Link
              href={area.performance}
              className="text-xs font-medium text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-primary)]"
            >
              ← Back to Performance
            </Link>

            <p className="mt-6 text-xs font-medium text-[var(--usus-primary)]">
              Trainee report
            </p>

            <h1 className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
              {member?.full_name ||
                member?.email ||
                "Trainee"}
            </h1>

            {member?.full_name && (
              <p className="mt-2 text-sm text-[var(--usus-text-muted)]">
                {member.email}
              </p>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-[var(--usus-danger)] bg-[var(--usus-surface)] px-4 py-3 text-sm text-[var(--usus-danger)]"
            >
              {error}
            </div>
          )}

          {!report && !error && (
            <p className="text-sm text-[var(--usus-text-muted)]">
              Loading report...
            </p>
          )}

          {report && (
            <>
              {/* Overview */}
              <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SummaryCard
                  title="Sessions Completed"
                  value={String(
                    report.sessions_completed,
                  )}
                  description={`${report.total_practice_minutes} minutes of practice`}
                />

                <SummaryCard
                  title="Average Score"
                  value={score(report.average_score)}
                  description={`Best ${score(report.best_score)}`}
                />

                <SummaryCard
                  title="Latest Score"
                  value={score(report.latest_score)}
                  description="Most recent session"
                />

                <SummaryCard
                  title="Trend"
                  value={
                    report.score_change === null
                      ? "—"
                      : `${report.score_change > 0 ? "+" : ""}${report.score_change}`
                  }
                  description={
                    report.improving === null
                      ? "Needs two or more sessions"
                      : report.improving
                        ? "Improving"
                        : "Not improving yet"
                  }
                />
              </section>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Skills */}
                <Panel
                  title="Skills"
                  description="Average score per skill, with the change since the first session."
                >
                  {report.dimensions.length === 0 ? (
                    <EmptyState message="No evaluated sessions yet." />
                  ) : (
                    <ul className="space-y-4">
                      {report.dimensions.map(
                        (dimension) => (
                          <li key={dimension.id}>
                            <div className="mb-1.5 flex items-center justify-between text-sm">
                              <span className="text-[var(--usus-text)]">
                                {dimension.name}
                              </span>

                              <span className="text-[var(--usus-text)]">
                                <span className="font-medium">
                                  {dimension.average}%
                                </span>{" "}
                                <span className="text-xs text-[var(--usus-text-muted)]">
                                  (
                                  {dimension.change > 0
                                    ? "+"
                                    : ""}
                                  {dimension.change})
                                </span>
                              </span>
                            </div>

                            <ProgressBar
                              value={dimension.average}
                            />
                          </li>
                        ),
                      )}
                    </ul>
                  )}
                </Panel>

                {/* Sessions */}
                <Panel
                  title="Recent Sessions"
                  description="The last 10 evaluated sessions."
                >
                  {recentSessions.length === 0 ? (
                    <EmptyState message="No evaluated sessions yet." />
                  ) : (
                    <ul className="divide-y divide-[var(--usus-border-soft)]">
                      {recentSessions.map(
                        (session) => (
                          <li
                            key={session.session_id}
                            className="flex items-center justify-between gap-4 py-3 text-sm first:pt-0 last:pb-0"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-[var(--usus-text)]">
                                {session.scenario_name}
                              </p>

                              <p className="text-xs text-[var(--usus-text-muted)]">
                                {formatDate(
                                  session.completed_at,
                                )}
                              </p>
                            </div>

                            <span className="shrink-0 font-semibold text-[var(--usus-text)]">
                              {session.overall_score}%
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  )}
                </Panel>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] p-5 shadow-[var(--usus-shadow)]">
      <p className="text-sm font-medium text-[var(--usus-text-muted)]">
        {title}
      </p>

      <p className="mt-3 text-2xl font-semibold text-[var(--usus-text)]">
        {value}
      </p>

      <p className="mt-2 text-xs text-[var(--usus-text-muted)]">
        {description}
      </p>
    </div>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] p-5 shadow-[var(--usus-shadow)]">
      <h2 className="text-base font-semibold text-[var(--usus-text)]">
        {title}
      </h2>

      <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
        {description}
      </p>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function EmptyState({
  message,
}: {
  message: string;
}) {
  return (
    <div className="rounded-lg border border-dashed border-[var(--usus-border)] px-4 py-8 text-center">
      <p className="text-sm text-[var(--usus-text-muted)]">
        {message}
      </p>
    </div>
  );
}
