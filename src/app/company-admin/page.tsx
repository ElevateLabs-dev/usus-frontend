"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getMyOrganisation,
  getTeamProgress,
  type MyOrganisation,
  type TraineeSummary,
} from "@/services/company-service";

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

export default function CompanyAdminPage() {
  const [organisation, setOrganisation] =
    useState<MyOrganisation | null>(null);

  const [team, setTeam] = useState<
    TraineeSummary[] | null
  >(null);

  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getMyOrganisation(),
      getTeamProgress(),
    ])
      .then(([nextOrganisation, nextTeam]) => {
        if (!cancelled) {
          setOrganisation(nextOrganisation);
          setTeam(nextTeam);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load the dashboard.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const metric = (value?: number) =>
    value === undefined ? "—" : String(value);

  /*
   * Team average: the mean of each
   * trainee's average score.
   */
  const scored = (team ?? []).filter(
    (trainee) =>
      trainee.average_score !== null,
  );

  const teamAverage =
    scored.length > 0
      ? Math.round(
          scored.reduce(
            (total, trainee) =>
              total + (trainee.average_score ?? 0),
            0,
          ) / scored.length,
        )
      : null;

  const notSignedIn = (team ?? []).filter(
    (trainee) => trainee.must_change_password,
  ).length;

  const recentlyActive = (team ?? [])
    .filter((trainee) => trainee.last_active_at)
    .sort((a, b) =>
      (b.last_active_at ?? "").localeCompare(
        a.last_active_at ?? "",
      ),
    )
    .slice(0, 5);

  return (
    <div className="min-h-full bg-[var(--usus-background)]">
      <section className="px-6 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Welcome */}
          <div>
            <p className="text-xs font-medium text-[var(--usus-primary)]">
              {organisation?.name ?? "Organisation"}
            </p>

            <h1 className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
              Company Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-[var(--usus-text-muted)]">
              Manage your organisation, users, training,
              and company performance.
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
            <DashboardCard
              title="Users"
              value={metric(
                organisation?.users_count,
              )}
              description="Everyone in your organisation"
            />

            <DashboardCard
              title="Trainees"
              value={metric(
                organisation?.trainees_count,
              )}
              description={
                team
                  ? `${notSignedIn} not signed in yet`
                  : "People in training"
              }
            />

            <DashboardCard
              title="Sessions Completed"
              value={metric(
                organisation?.sessions_completed,
              )}
              description="Evaluated training sessions"
            />

            <DashboardCard
              title="Team Average"
              value={
                teamAverage === null
                  ? "—"
                  : `${teamAverage}%`
              }
              description="Average score across trainees"
            />
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent activity */}
            <DashboardSection
              title="Recently Active Trainees"
              description="Trainees who practised most recently."
              action={{
                href: "/company-admin/performance",
                label: "View performance",
              }}
            >
              {recentlyActive.length === 0 ? (
                <EmptyState
                  message={
                    team
                      ? "No training sessions yet."
                      : "Loading..."
                  }
                />
              ) : (
                <ul className="divide-y divide-[var(--usus-border-soft)]">
                  {recentlyActive.map((trainee) => (
                    <li
                      key={trainee.user_id}
                      className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[var(--usus-text)]">
                          {trainee.full_name ||
                            trainee.email}
                        </p>

                        <p className="text-xs text-[var(--usus-text-muted)]">
                          {trainee.sessions_completed}{" "}
                          {trainee.sessions_completed === 1
                            ? "session"
                            : "sessions"}
                          {trainee.last_active_at &&
                            ` · last active ${formatDate(trainee.last_active_at)}`}
                        </p>
                      </div>

                      <span className="shrink-0 text-sm font-semibold text-[var(--usus-text)]">
                        {trainee.latest_score === null
                          ? "—"
                          : `${trainee.latest_score}%`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </DashboardSection>

            {/* Quick links */}
            <DashboardSection
              title="Quick Actions"
              description="Common tasks for your organisation."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <QuickLink
                  href="/company-admin/trainees"
                  title="Add trainees"
                  description="Invite one by one or import from Excel."
                />

                <QuickLink
                  href="/company-admin/managers"
                  title="Manage staff"
                  description="Managers and company admins."
                />

                <QuickLink
                  href="/company-admin/training"
                  title="Training scenarios"
                  description={`${metric(organisation?.scenarios_count)} active scenarios.`}
                />

                <QuickLink
                  href="/company-admin/settings"
                  title="Settings"
                  description="Your organisation's details."
                />
              </div>
            </DashboardSection>
          </div>
        </div>
      </section>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] p-5 shadow-[var(--usus-shadow)] transition-colors hover:border-[var(--usus-primary)]">
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

function DashboardSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] p-5 shadow-[var(--usus-shadow)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[var(--usus-text)]">
            {title}
          </h2>

          <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
            {description}
          </p>
        </div>

        {action && (
          <Link
            href={action.href}
            className="shrink-0 text-xs font-medium text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-primary)]"
          >
            {action.label}
          </Link>
        )}
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-[var(--usus-border)] px-4 py-3 transition-colors hover:border-[var(--usus-primary)]"
    >
      <p className="text-sm font-medium text-[var(--usus-text)]">
        {title}
      </p>

      <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
        {description}
      </p>
    </Link>
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
