"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useStaffArea } from "@/hooks/use-staff-area";

import {
  getMyOrganisation,
  getTeamProgress,
  type MyOrganisation,
  type TraineeSummary,
} from "@/services/company-service";

/* ============================================================
   DATE FORMATTER
============================================================ */

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

/* ============================================================
   COMPANY ADMIN DASHBOARD
============================================================ */

export default function CompanyAdminPage() {
  const area = useStaffArea();

  const [organisation, setOrganisation] =
    useState<MyOrganisation | null>(null);

  const [team, setTeam] = useState<TraineeSummary[] | null>(null);

  const [error, setError] = useState("");

  /* ============================================================
     FETCH DASHBOARD DATA
  ============================================================ */

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

  /* ============================================================
     DASHBOARD CALCULATIONS
  ============================================================ */

  const metric = (value?: number) =>
    value === undefined ? "—" : String(value);

  // Team average: mean of each trainee's average score.
  const scored = (team ?? []).filter(
    (trainee) => trainee.average_score !== null,
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

  /* ============================================================
     DASHBOARD UI
  ============================================================ */

  return (
    <main className="w-full min-w-0 space-y-8">

      {/* ======================================================
          WELCOME HEADER
      ====================================================== */}

      <div>
        <p className="text-xs font-medium text-[var(--usus-primary)]">
          {organisation?.name ?? "Organisation"}
        </p>

        <h1 className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
          {area.isManager
            ? "Manager Dashboard"
            : "Company Admin Dashboard"}
        </h1>

        <p className="mt-2 text-sm text-[var(--usus-text-muted)]">
          {area.isManager
            ? "Manage your team, their training, and their performance."
            : "Manage your organisation, users, training, and company performance."}
        </p>
      </div>

      {/* ======================================================
          ERROR MESSAGE
      ====================================================== */}

      {error && (
        <div
          role="alert"
          className="border border-[var(--usus-danger)] bg-[var(--usus-surface)] px-4 py-3 text-sm text-[var(--usus-danger)]"
        >
          {error}
        </div>
      )}

      {/* ======================================================
          OVERVIEW STATISTICS
      ====================================================== */}

      <section
        id="dashboard-overview"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4"
      >
        <DashboardCard
          title="Users"
          value={metric(organisation?.users_count)}
          description="Everyone in your organisation"
        />

        <DashboardCard
          title="Trainees"
          value={metric(organisation?.trainees_count)}
          description={
            team
              ? `${notSignedIn} not signed in yet`
              : "People in training"
          }
        />

        <DashboardCard
          title="Sessions Completed"
          value={metric(organisation?.sessions_completed)}
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

      {/* ======================================================
          RECENT ACTIVITY AND QUICK ACTIONS
      ====================================================== */}

      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2">

        {/* RECENTLY ACTIVE TRAINEES */}

        <DashboardSection
          title="Recently Active Trainees"
          description="Trainees who practised most recently."
          action={{
            href: area.performance,
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
                      {trainee.full_name || trainee.email}
                    </p>

                    <p className="text-xs text-[var(--usus-text-muted)]">
                      {trainee.sessions_completed}{" "}
                      {trainee.sessions_completed === 1
                        ? "session"
                        : "sessions"}

                      {trainee.last_active_at &&
                        ` · Last active: ${formatDate(
                          trainee.last_active_at,
                        )}`}
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

        {/* QUICK ACTIONS */}

        <DashboardSection
          title="Quick Actions"
          description="Common tasks for your organisation."
        >
          <div className="grid gap-3 sm:grid-cols-2">

            <QuickLink
              href={area.trainees}
              title="Add trainees"
              description="Invite one by one or import from Excel."
            />

            {area.isManager ? (
              <QuickLink
                href={area.performance}
                title="Team performance"
                description="Scores and progress for each trainee."
              />
            ) : (
              <QuickLink
                href="/company-admin/managers"
                title="Manage staff"
                description="Managers and company admins."
              />
            )}

            <QuickLink
              href={area.scenarios}
              title="Training scenarios"
              description={`${metric(
                organisation?.scenarios_count,
              )} active scenarios.`}
            />

            {!area.isManager && (
              <QuickLink
                href="/company-admin/settings"
                title="Settings"
                description="Your organisation's details."
              />
            )}

          </div>
        </DashboardSection>

      </div>
    </main>
  );
}

/* ============================================================
   DASHBOARD CARD
============================================================ */

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

/* ============================================================
   DASHBOARD SECTION
============================================================ */

function DashboardSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action?: {
    href: string;
    label: string;
  };
  children: React.ReactNode;
}) {
  return (
    <section className="h-full rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] p-5 shadow-[var(--usus-shadow)]">

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

      <div className="mt-5">
        {children}
      </div>

    </section>
  );
}

/* ============================================================
   QUICK LINK
============================================================ */

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
      className="rounded-lg border border-[var(--usus-border)] px-4 py-3 transition-colors hover:border-[var(--usus-primary)] hover:bg-[var(--usus-surface-soft)]"
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

/* ============================================================
   EMPTY STATE
============================================================ */

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