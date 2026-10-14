"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import {
  ActivityList,
  CheckList,
  OVERALL_LABELS,
} from "@/components/platform-admin/platform-status";

import {
  getOrganisations,
  type Organisation,
} from "@/services/organisations-service";

import {
  getPlatformActivity,
  getPlatformStatus,
  type ActivityItem,
  type PlatformStatus,
} from "@/services/platform-service";

export default function PlatformAdminPage() {
  const { user } = useAuth();

  /*
   * Overview numbers come from the
   * organisations list.
   */
  const [organisations, setOrganisations] =
    useState<Organisation[] | null>(null);

  const [activity, setActivity] = useState<
    ActivityItem[] | null
  >(null);

  const [status, setStatus] =
    useState<PlatformStatus | null>(null);

  useEffect(() => {
    let cancelled = false;

    getOrganisations()
      .then((data) => {
        if (!cancelled) {
          setOrganisations(data);
        }
      })
      .catch(() => {
        // Keep the "—" placeholders.
      });

    getPlatformActivity(6)
      .then((data) => {
        if (!cancelled) {
          setActivity(data);
        }
      })
      .catch(() => {
        // Keep the empty state.
      });

    getPlatformStatus()
      .then((data) => {
        if (!cancelled) {
          setStatus(data);
        }
      })
      .catch(() => {
        // Keep the empty state.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const metric = (
    count: (items: Organisation[]) => number,
  ) =>
    organisations
      ? String(count(organisations))
      : "—";

  return (
    <div className="min-h-full bg-[var(--usus-background)]">
      <section className="px-6 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Welcome */}
          <div>
            <p className="text-xs font-medium text-[var(--usus-primary)]">
              Platform Overview
            </p>

            <h1 className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
              Platform Dashboard
            </h1>

            <p className="mt-2 text-sm text-[var(--usus-text-muted)]">
              Overview of the USUS platform and customer
              organisations.
            </p>
          </div>

          {/* Overview */}
          <section>
            <div className="mb-4">
              <h2 className="text-base font-semibold text-[var(--usus-text)]">
                Overview
              </h2>

              <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
                Key platform metrics.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DashboardCard
                title="Organisations"
                value={metric(
                  (items) => items.length,
                )}
                description="Customer organisations"
              />

              <DashboardCard
                title="Active Organisations"
                value={metric(
                  (items) =>
                    items.filter(
                      (item) => item.is_active,
                    ).length,
                )}
                description="Currently active"
              />

              <DashboardCard
                title="Total Users"
                value={metric((items) =>
                  items.reduce(
                    (total, item) =>
                      total + item.users_count,
                    0,
                  ),
                )}
                description="Across all organisations"
              />

              <DashboardCard
                title="Training Activity"
                value={metric((items) =>
                  items.reduce(
                    (total, item) =>
                      total +
                      item.sessions_completed,
                    0,
                  ),
                )}
                description="Training sessions completed"
              />
            </div>
          </section>

          {/* Activity and Health */}
          <div className="grid gap-6 lg:grid-cols-2">
            <DashboardSection
              title="Platform Activity"
              description="Recent activity across the USUS platform."
            >
              {activity && activity.length > 0 ? (
                <ActivityList items={activity} />
              ) : (
                <EmptyState message="No platform activity data available yet." />
              )}
            </DashboardSection>

            <DashboardSection
              title="Platform Health"
              description={
                status
                  ? `${OVERALL_LABELS[status.overall]} · ${status.environment}`
                  : "System and organisation health information."
              }
            >
              {status ? (
                <CheckList checks={status.checks} />
              ) : (
                <EmptyState message="Platform health information will appear here." />
              )}
            </DashboardSection>
          </div>

          {/* Current Account */}
          <DashboardSection
            title="Current Account"
            description="Information about the authenticated platform administrator."
          >
            <div className="space-y-4">
              <InfoRow
                label="Role"
                value={user?.role ?? "—"}
              />

              <InfoRow
                label="User ID"
                value={user?.user_id ?? "—"}
              />

              <InfoRow
                label="Tenant"
                value={user?.tenant_id ?? "Platform-wide"}
              />
            </div>
          </DashboardSection>
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

      <div className="mt-5">
        {children}
      </div>
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

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-[var(--usus-border-soft)] pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-[var(--usus-text-muted)]">
        {label}
      </span>

      <span className="break-all text-sm font-medium text-[var(--usus-text)]">
        {value}
      </span>
    </div>
  );
};