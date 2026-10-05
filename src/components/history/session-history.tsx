"use client";

import { useRouter } from "next/navigation";

import type { HistorySession } from "@/types/history";

import { SessionRow } from "./session-row";

interface SessionHistoryProps {
  sessions: HistorySession[];
}

export function SessionHistory({
  sessions,
}: SessionHistoryProps) {
  const router = useRouter();

  const handleViewSession = (
    session: HistorySession,
  ) => {
    router.push(
      `/history/${session.sessionId}`,
    );
  };

  return (
    <section
      className="
        overflow-hidden
        rounded-[var(--usus-radius)]
        border
        border-[var(--usus-border)]
        bg-[var(--usus-surface)]
        shadow-[var(--usus-shadow)]
      "
    >
      {/* Header */}
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          border-b
          border-[var(--usus-border)]
          px-5
          py-5
        "
      >
        <div>
          <h2 className="text-lg font-semibold text-[var(--usus-text)]">
            Session history
          </h2>

          <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
            Review your previous training sessions.
          </p>
        </div>

        <span
          className="
            rounded-full
            bg-[var(--usus-muted)]
            px-3
            py-1
            text-xs
            font-medium
            text-[var(--usus-text-muted)]
          "
        >
          {sessions.length} sessions
        </span>
      </div>

      {/* Sessions */}
      {sessions.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <p className="font-medium text-[var(--usus-text)]">
            No sessions found
          </p>

          <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
            Try changing your filters.
          </p>
        </div>
      ) : (
        <div>
          {sessions.map((session) => (
            <SessionRow
              key={session.sessionId}
              session={session}
              onView={handleViewSession}
            />
          ))}
        </div>
      )}
    </section>
  );
};