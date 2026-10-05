interface SessionStatusProps {
  objective: string;
  status: "idle" | "sending" | "customer-responding" | "ready" | "error" | "session-ended";
  elapsedSeconds: number;
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

export function SessionStatus({
  objective,
  status,
  elapsedSeconds,
}: SessionStatusProps) {
  const statusLabel = {
    idle: "Ready",
    sending: "Sending",
    "customer-responding": "Customer responding",
    ready: "Ready",
    error: "Error",
    "session-ended": "Session ended",
  }[status];

  const statusColor =
    status === "error"
      ? "var(--usus-danger)"
      : status === "customer-responding"
        ? "var(--usus-warning)"
        : "var(--usus-primary)";

  return (
    <section
      className="
        rounded-2xl
        border border-[var(--usus-border)]
        bg-[var(--usus-surface)]
        p-5
        shadow-[var(--usus-shadow)]
      "
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--usus-text-muted)]">
            Objective
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--usus-text)]">
            {objective}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-5">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[var(--usus-text-soft)]">
              Time
            </p>

            <p className="mt-1 font-mono text-sm font-semibold text-[var(--usus-text)]">
              {formatTime(elapsedSeconds)}
            </p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-[var(--usus-text-soft)]">
              Status
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: statusColor }}
              />

              <span className="text-xs font-semibold text-[var(--usus-text)]">
                {statusLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};