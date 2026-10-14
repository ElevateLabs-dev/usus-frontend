"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ProgressBar } from "@/components/ui/progress-bar";

import {
  getTeamMembersProgress,
  getTeamSkills,
  type TeamMemberProgress,
  type TeamSkills,
} from "@/services/performance-service";

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

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

export default function CompanyPerformancePage() {
  const [team, setTeam] = useState<
    TeamMemberProgress[]
  >([]);

  const [skills, setSkills] =
    useState<TeamSkills | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getTeamMembersProgress(),
      getTeamSkills(),
    ])
      .then(([nextTeam, nextSkills]) => {
        if (!cancelled) {
          setTeam(nextTeam);
          setSkills(nextSkills);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load performance.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const practising = team.filter(
    (member) => member.sessions_completed > 0,
  ).length;

  const weakest = skills?.dimensions.find(
    (dimension) =>
      dimension.id === skills.weakest_dimension,
  );

  /*
   * Trainees with the most practice first.
   */
  const sortedTeam = [...team].sort(
    (a, b) =>
      b.sessions_completed - a.sessions_completed,
  );

  return (
    <div className="min-h-full bg-[var(--usus-background)]">
      <section className="px-6 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Page heading */}
          <div>
            <p className="text-xs font-medium text-[var(--usus-primary)]">
              Organisation
            </p>

            <h1 className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
              Performance
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[var(--usus-text-muted)]">
              Track your team&apos;s training activity
              and scores, and see which skills need the
              most attention.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-[var(--usus-danger)] bg-[var(--usus-surface)] px-4 py-3 text-sm text-[var(--usus-danger)]"
            >
              {error}
            </div>
          )}

          {/* Overview */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              title="Sessions Completed"
              value={
                skills
                  ? String(skills.sessions_completed)
                  : "—"
              }
              description="Evaluated training sessions"
            />

            <SummaryCard
              title="Team Average"
              value={score(
                skills?.average_score ?? null,
              )}
              description="Across every evaluated session"
            />

            <SummaryCard
              title="Trainees Practising"
              value={
                loading
                  ? "—"
                  : `${practising} / ${team.length}`
              }
              description="Completed at least one session"
            />

            <SummaryCard
              title="Focus Skill"
              value={weakest?.name ?? "—"}
              description={
                weakest
                  ? `Lowest team average (${weakest.average}%)`
                  : "Appears after the first evaluation"
              }
            />
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Skills */}
            <Panel
              title="Team Skills"
              description="Average score per skill, weakest first."
            >
              {skills &&
              skills.dimensions.length > 0 ? (
                <ul className="space-y-4">
                  {skills.dimensions.map(
                    (dimension) => (
                      <li key={dimension.id}>
                        <div className="mb-1.5 flex items-center justify-between text-sm">
                          <span className="text-[var(--usus-text)]">
                            {dimension.name}
                          </span>

                          <span className="font-medium text-[var(--usus-text)]">
                            {dimension.average}%
                          </span>
                        </div>

                        <ProgressBar
                          value={dimension.average}
                        />
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <EmptyState
                  message={
                    loading
                      ? "Loading..."
                      : "Skill scores appear once trainees complete sessions."
                  }
                />
              )}
            </Panel>

            {/* Categories */}
            <Panel
              title="Training Categories"
              description="Sessions and average score per category."
            >
              {skills ? (
                <ul className="divide-y divide-[var(--usus-border-soft)]">
                  {skills.categories.map(
                    (category) => (
                      <li
                        key={category.id}
                        className="flex items-center justify-between gap-4 py-3 text-sm first:pt-0 last:pb-0"
                      >
                        <div>
                          <p className="text-[var(--usus-text)]">
                            {category.name}
                          </p>

                          <p className="text-xs text-[var(--usus-text-muted)]">
                            {category.sessions_completed}{" "}
                            {category.sessions_completed ===
                            1
                              ? "session"
                              : "sessions"}
                          </p>
                        </div>

                        <span className="font-medium text-[var(--usus-text)]">
                          {score(
                            category.average_score,
                          )}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <EmptyState
                  message={
                    loading
                      ? "Loading..."
                      : "No category data."
                  }
                />
              )}
            </Panel>
          </div>

          {/* Trainees */}
          <section className="overflow-hidden rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
            <div className="border-b border-[var(--usus-border)] px-6 py-5">
              <h2 className="text-base font-semibold text-[var(--usus-text)]">
                Trainees
              </h2>

              <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
                Select a trainee to see their full
                report.
              </p>
            </div>

            <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-[var(--usus-border)] px-6 py-4 text-xs font-medium text-[var(--usus-text-muted)] md:grid">
              <span>Trainee</span>
              <span>Sessions</span>
              <span>Average</span>
              <span>Latest</span>
              <span>Last Active</span>
            </div>

            {loading ? (
              <div className="px-6 py-14 text-center text-sm text-[var(--usus-text-muted)]">
                Loading trainees...
              </div>
            ) : sortedTeam.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <p className="text-sm text-[var(--usus-text-muted)]">
                  No trainees yet.{" "}
                  <Link
                    href="/company-admin/trainees"
                    className="font-medium text-[var(--usus-text)] hover:text-[var(--usus-primary)]"
                  >
                    Add trainees
                  </Link>
                </p>
              </div>
            ) : (
              sortedTeam.map((member) => (
                <Link
                  key={member.user_id}
                  href={`/company-admin/performance/${member.user_id}`}
                  className="grid gap-2 border-b border-[var(--usus-border)] px-6 py-4 text-sm transition-colors last:border-b-0 hover:bg-[var(--usus-surface-soft)] md:grid-cols-[2fr_1fr_1fr_1fr_1fr] md:items-center md:gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[var(--usus-text)]">
                      {member.full_name ||
                        member.email}
                    </p>

                    <p className="truncate text-xs text-[var(--usus-text-muted)]">
                      {member.must_change_password
                        ? "Has not signed in yet"
                        : member.email}
                    </p>
                  </div>

                  <span className="text-[var(--usus-text-muted)]">
                    {member.sessions_completed}
                  </span>

                  <span className="text-[var(--usus-text)]">
                    {score(member.average_score)}
                  </span>

                  <span className="text-[var(--usus-text)]">
                    {score(member.latest_score)}
                  </span>

                  <span className="text-[var(--usus-text-muted)]">
                    {formatDate(member.last_active_at)}
                  </span>
                </Link>
              ))
            )}
          </section>
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

      <p className="mt-3 truncate text-2xl font-semibold text-[var(--usus-text)]">
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
