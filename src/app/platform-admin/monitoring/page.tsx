"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityList,
  AlertList,
  CHECK_LABELS,
  OVERALL_LABELS,
  formatDateTime,
} from "@/components/platform-admin/platform-status";

import {
  getPlatformActivity,
  getPlatformAlerts,
  getPlatformStatus,
  type ActivityItem,
  type AlertItem,
  type PlatformStatus,
  type StatusCheck,
} from "@/services/platform-service";

const STATE_VALUES: Record<
  StatusCheck["state"],
  string
> = {
  ok: "OK",
  not_configured: "Not configured",
  error: "Error",
};

export default function MonitoringPage() {
  const [status, setStatus] =
    useState<PlatformStatus | null>(null);

  const [activity, setActivity] = useState<
    ActivityItem[]
  >([]);

  const [alerts, setAlerts] = useState<
    AlertItem[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setError("");

      const [
        nextStatus,
        nextActivity,
        nextAlerts,
      ] = await Promise.all([
        getPlatformStatus(),
        getPlatformActivity(20),
        getPlatformAlerts(),
      ]);

      setStatus(nextStatus);
      setActivity(nextActivity);
      setAlerts(nextAlerts);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load monitoring data.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [load]);

  const check = (name: string) =>
    status?.checks.find(
      (item) => item.name === name,
    );

  const api = check("api");
  const database = check("database");

  /*
   * Email and AI are shown together as
   * "Services".
   */
  const services = ["email", "ai"]
    .map(check)
    .filter(
      (item): item is StatusCheck =>
        item !== undefined,
    );

  const failingServices = services.filter(
    (item) => item.state !== "ok",
  );

  return (
    <div className="min-h-full bg-[var(--usus-background)]">
      <section className="px-6 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          {/* Page heading */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium text-[var(--usus-primary)]">
                Platform
              </p>

              <h1 className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
                Monitoring
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-[var(--usus-text-muted)]">
                Monitor platform activity, system status, and
                important events across USUS.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                void load();
              }}
              disabled={loading}
              className="w-fit cursor-pointer rounded-lg border border-[var(--usus-border)] bg-[var(--usus-surface)] px-4 py-2 text-xs font-medium text-[var(--usus-text)] transition-colors hover:border-[var(--usus-primary)] hover:text-[var(--usus-primary)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-[var(--usus-danger)] bg-[var(--usus-surface)] px-4 py-3 text-sm text-[var(--usus-danger)]"
            >
              {error}
            </div>
          )}

          {/* Platform status */}
          <section className="mt-8">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-[var(--usus-text)]">
                Platform Status
              </h2>

              <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
                {status
                  ? `Checked ${formatDateTime(status.checked_at)} · ${status.environment} · v${status.version}`
                  : "Current platform health information will appear here."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatusCard
                title="Platform"
                value={
                  status
                    ? OVERALL_LABELS[status.overall]
                    : "—"
                }
                description={
                  status?.maintenance_mode
                    ? "Maintenance mode is on"
                    : "Overall platform status"
                }
              />

              <StatusCard
                title="API"
                value={
                  api
                    ? STATE_VALUES[api.state]
                    : "—"
                }
                description={
                  api?.detail ??
                  "Backend API status"
                }
              />

              <StatusCard
                title="Database"
                value={
                  database
                    ? STATE_VALUES[database.state]
                    : "—"
                }
                description={
                  database?.detail ??
                  "Database status"
                }
              />

              <StatusCard
                title="Services"
                value={
                  services.length === 0
                    ? "—"
                    : failingServices.length === 0
                      ? "OK"
                      : "Attention"
                }
                description={
                  services.length === 0
                    ? "Platform services"
                    : services
                        .map(
                          (item) =>
                            `${CHECK_LABELS[item.name]}: ${STATE_VALUES[item.state]}`,
                        )
                        .join(" · ")
                }
              />
            </div>

            {failingServices.length > 0 && (
              <ul className="mt-4 space-y-1 text-xs text-[var(--usus-text-muted)]">
                {failingServices.map((item) => (
                  <li key={item.name}>
                    {CHECK_LABELS[item.name]}:{" "}
                    {item.detail}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Activity */}
          <section className="mt-8 rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
            <div className="border-b border-[var(--usus-border)] px-6 py-5">
              <h2 className="text-base font-semibold text-[var(--usus-text)]">
                Recent Activity
              </h2>

              <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
                Organisations onboarded, users added and
                training sessions completed.
              </p>
            </div>

            {activity.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <h3 className="text-sm font-semibold text-[var(--usus-text)]">
                  {loading
                    ? "Loading activity..."
                    : "No activity yet"}
                </h3>
              </div>
            ) : (
              <div className="px-6 py-5">
                <ActivityList items={activity} />
              </div>
            )}
          </section>

          {/* System events */}
          <section className="mt-6 rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
            <div className="border-b border-[var(--usus-border)] px-6 py-5">
              <h2 className="text-base font-semibold text-[var(--usus-text)]">
                System Events
              </h2>

              <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
                Invite emails that were not delivered and
                evaluations that did not finish.
              </p>
            </div>

            {alerts.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <h3 className="text-sm font-semibold text-[var(--usus-text)]">
                  {loading
                    ? "Loading events..."
                    : "No system events"}
                </h3>

                {!loading && (
                  <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--usus-text-muted)]">
                    There is nothing that needs your
                    attention.
                  </p>
                )}
              </div>
            ) : (
              <AlertList alerts={alerts} />
            )}
          </section>
        </div>
      </section>
    </div>
  );
}

function StatusCard({
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
};
