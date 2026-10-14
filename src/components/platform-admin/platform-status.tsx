"use client";

import Link from "next/link";

import type {
  ActivityItem,
  AlertItem,
  CheckState,
  PlatformStatus,
  StatusCheck,
} from "@/services/platform-service";

export const CHECK_LABELS: Record<
  string,
  string
> = {
  api: "API",
  database: "Database",
  email: "Email",
  ai: "AI Provider",
};

export const OVERALL_LABELS: Record<
  PlatformStatus["overall"],
  string
> = {
  operational: "Operational",
  degraded: "Degraded",
  maintenance: "Maintenance",
};

const STATE_LABELS: Record<
  CheckState,
  string
> = {
  ok: "OK",
  not_configured: "Not configured",
  error: "Error",
};

export function stateClassName(
  state: CheckState,
) {
  return state === "ok"
    ? "text-[var(--usus-text)]"
    : state === "error"
      ? "text-[var(--usus-danger)]"
      : "text-[var(--usus-text-muted)]";
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString(
    undefined,
    {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

/**
 * One row per status check.
 */
export function CheckList({
  checks,
}: {
  checks: StatusCheck[];
}) {
  return (
    <div className="space-y-3">
      {checks.map((check) => (
        <div
          key={check.name}
          className="flex flex-col gap-1 border-b border-[var(--usus-border-soft)] pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--usus-text)]">
              {CHECK_LABELS[check.name] ??
                check.name}
            </p>

            <p className="text-xs text-[var(--usus-text-muted)]">
              {check.detail}
            </p>
          </div>

          <span
            className={`text-sm font-medium ${stateClassName(check.state)}`}
          >
            {STATE_LABELS[check.state]}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Platform events, newest first.
 */
export function ActivityList({
  items,
}: {
  items: ActivityItem[];
}) {
  return (
    <ul className="divide-y divide-[var(--usus-border-soft)]">
      {items.map((item) => (
        <li
          key={`${item.type}-${item.occurred_at}-${item.message}`}
          className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        >
          <div className="min-w-0">
            <p className="text-sm text-[var(--usus-text)]">
              {item.message}
            </p>

            {item.organization_name && (
              <p className="text-xs text-[var(--usus-text-muted)]">
                {item.organization_name}
              </p>
            )}
          </div>

          <span className="shrink-0 text-xs text-[var(--usus-text-muted)]">
            {formatDateTime(item.occurred_at)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function alertHint(alert: AlertItem) {
  if (alert.type === "evaluation_missing") {
    return "The evaluation can be re-run for this session.";
  }

  return alert.organization_id
    ? "Resend the invite from the organisation's page."
    : "Resend the invite from Platform Users.";
}

/**
 * Problems that need attention.
 */
export function AlertList({
  alerts,
}: {
  alerts: AlertItem[];
}) {
  return (
    <ul className="divide-y divide-[var(--usus-border-soft)]">
      {alerts.map((alert) => (
        <li
          key={`${alert.type}-${alert.occurred_at}-${alert.message}`}
          className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-[var(--usus-text)]">
              {alert.message}
            </p>

            <p className="text-xs text-[var(--usus-text-muted)]">
              {alert.organization_id && (
                <>
                  <Link
                    href={`/platform-admin/organisations/${alert.organization_id}`}
                    className="font-medium text-[var(--usus-text)] transition-colors hover:text-[var(--usus-primary)]"
                  >
                    {alert.organization_name}
                  </Link>
                  {" · "}
                </>
              )}
              {alertHint(alert)}
            </p>
          </div>

          <span className="shrink-0 text-xs text-[var(--usus-text-muted)]">
            {formatDateTime(alert.occurred_at)}
          </span>
        </li>
      ))}
    </ul>
  );
}
