"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import type {
  SessionUsage,
  UsageReport,
} from "@/services/usage-service";

const PERIODS = [7, 30, 90];

interface UsageReportViewProps {
  title: string;
  description: string;
  load: (days: number) => Promise<UsageReport>;
  /** Show the organisation column and breakdown */
  showOrganizations?: boolean;
}

export function formatCost(value: number) {
  if (value === 0) return "$0.00";
  if (value < 0.01) return `$${value.toFixed(4)}`;
  return `$${value.toFixed(2)}`;
}

export function formatDuration(seconds: number | null) {
  if (seconds === null) return "In progress";
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  if (minutes === 0) return `${rest}s`;
  return `${minutes}m ${rest.toString().padStart(2, "0")}s`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatNumber(value: number) {
  return value.toLocaleString();
}

export function UsageReportView({
  title,
  description,
  load,
  showOrganizations = false,
}: UsageReportViewProps) {
  const [days, setDays] = useState(30);
  const [report, setReport] =
    useState<UsageReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setReport(await load(days));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load usage.",
      );
    } finally {
      setLoading(false);
    }
  }, [days, load]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [refresh]);

  const totals = report?.totals;

  return (
    <div className="min-h-full bg-[var(--usus-background)]">
      <section className="px-6 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          {/* Heading */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-[var(--usus-text)]">
                {title}
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-[var(--usus-text-muted)]">
                {description}
              </p>
            </div>

            <div className="flex gap-2">
              {PERIODS.map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => setDays(period)}
                  disabled={loading}
                  className={[
                    "cursor-pointer rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                    days === period
                      ? "border-[var(--usus-primary)] bg-[var(--usus-primary)] text-black"
                      : "border-[var(--usus-border)] bg-[var(--usus-surface)] text-[var(--usus-text)] hover:border-[var(--usus-primary)]",
                  ].join(" ")}
                >
                  {period} days
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-[var(--usus-danger)] bg-[var(--usus-surface)] px-4 py-3 text-sm text-[var(--usus-danger)]"
            >
              {error}
            </div>
          )}

          {/* Totals */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TotalCard
              title="Sessions"
              value={totals ? formatNumber(totals.sessions) : "—"}
              description={
                totals
                  ? `${totals.text_sessions} text · ${totals.voice_sessions} voice`
                  : "Training sessions"
              }
            />
            <TotalCard
              title="Time"
              value={
                totals ? `${formatNumber(totals.session_minutes)} min` : "—"
              }
              description={
                totals
                  ? `${formatNumber(totals.voice_minutes)} min on voice calls`
                  : "Time spent training"
              }
            />
            <TotalCard
              title="AI cost (OpenAI)"
              value={totals ? formatCost(totals.ai_cost) : "—"}
              description={
                totals
                  ? `${formatNumber(totals.input_tokens + totals.output_tokens)} tokens`
                  : "Customer replies and scoring"
              }
            />
            <TotalCard
              title="Total cost"
              value={totals ? formatCost(totals.total_cost) : "—"}
              description={
                totals
                  ? `Voice (Vapi): ${formatCost(totals.voice_cost)}`
                  : "AI and voice together"
              }
            />
          </div>

          {/* Per organisation */}
          {showOrganizations && (
            <Panel
              title="By organisation"
              description="Most expensive first."
            >
              {!report || report.organizations.length === 0 ? (
                <Empty loading={loading} text="No usage yet" />
              ) : (
                <Table
                  headers={[
                    "Organisation",
                    "Sessions",
                    "Voice min",
                    "AI cost",
                    "Voice cost",
                    "Total",
                  ]}
                >
                  {report.organizations.map((org) => (
                    <tr
                      key={org.organization_id}
                      className="border-t border-[var(--usus-border)]"
                    >
                      <Cell strong>{org.organization_name}</Cell>
                      <Cell>{formatNumber(org.sessions)}</Cell>
                      <Cell>{formatNumber(org.voice_minutes)}</Cell>
                      <Cell>{formatCost(org.ai_cost)}</Cell>
                      <Cell>{formatCost(org.voice_cost)}</Cell>
                      <Cell strong>{formatCost(org.total_cost)}</Cell>
                    </tr>
                  ))}
                </Table>
              )}
            </Panel>
          )}

          {/* Sessions */}
          <Panel
            title="Sessions"
            description="Latest sessions first, with how long each took and what it cost."
          >
            {!report || report.sessions.length === 0 ? (
              <Empty loading={loading} text="No sessions in this period" />
            ) : (
              <Table
                headers={[
                  "Started",
                  ...(showOrganizations ? ["Organisation"] : []),
                  "Trainee",
                  "Scenario",
                  "Mode",
                  "Duration",
                  "Tokens",
                  "AI cost",
                  "Voice cost",
                  "Total",
                ]}
              >
                {report.sessions.map((session) => (
                  <SessionRow
                    key={session.session_id}
                    session={session}
                    showOrganization={showOrganizations}
                  />
                ))}
              </Table>
            )}
          </Panel>
        </div>
      </section>
    </div>
  );
}

function SessionRow({
  session,
  showOrganization,
}: {
  session: SessionUsage;
  showOrganization: boolean;
}) {
  const aiCost =
    session.conversation_cost + session.evaluation_cost;

  return (
    <tr className="border-t border-[var(--usus-border)]">
      <Cell>{formatDate(session.started_at)}</Cell>
      {showOrganization && (
        <Cell>{session.organization_name}</Cell>
      )}
      <Cell>
        <span className="block text-[var(--usus-text)]">
          {session.trainee_name ?? session.trainee_email ?? "—"}
        </span>
        {session.trainee_name && session.trainee_email && (
          <span className="block text-xs text-[var(--usus-text-muted)]">
            {session.trainee_email}
          </span>
        )}
      </Cell>
      <Cell>{session.scenario_name ?? "—"}</Cell>
      <Cell>
        {session.mode === "voice" ? "Voice" : "Text"}
      </Cell>
      <Cell>
        {formatDuration(session.duration_seconds)}
        {session.mode === "voice" && (
          <span className="block text-xs text-[var(--usus-text-muted)]">
            Call {formatDuration(session.voice_seconds)}
          </span>
        )}
      </Cell>
      <Cell>
        {formatNumber(session.input_tokens + session.output_tokens)}
      </Cell>
      <Cell>
        <span
          title={`Conversation ${formatCost(session.conversation_cost)} · Scoring ${formatCost(session.evaluation_cost)}`}
        >
          {formatCost(aiCost)}
        </span>
      </Cell>
      <Cell>
        {session.mode === "voice"
          ? formatCost(session.voice_cost)
          : "—"}
      </Cell>
      <Cell strong>{formatCost(session.total_cost)}</Cell>
    </tr>
  );
}

function TotalCard({
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
    <section className="mt-8 rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
      <div className="border-b border-[var(--usus-border)] px-6 py-5">
        <h2 className="text-base font-semibold text-[var(--usus-text)]">
          {title}
        </h2>
        <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

function Table({
  headers,
  children,
}: {
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-6 py-3 text-xs font-medium text-[var(--usus-text-muted)]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function Cell({
  children,
  strong = false,
}: {
  children: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <td
      className={[
        "px-6 py-3 align-top",
        strong
          ? "font-semibold text-[var(--usus-text)]"
          : "text-[var(--usus-text-secondary)]",
      ].join(" ")}
    >
      {children}
    </td>
  );
}

function Empty({
  loading,
  text,
}: {
  loading: boolean;
  text: string;
}) {
  return (
    <div className="px-6 py-14 text-center">
      <h3 className="text-sm font-semibold text-[var(--usus-text)]">
        {loading ? "Loading usage..." : text}
      </h3>
    </div>
  );
}
