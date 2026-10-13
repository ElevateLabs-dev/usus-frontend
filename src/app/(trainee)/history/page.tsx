"use client";

import { useEffect, useState } from "react";

import { getHistory } from "@/services/history";

import type { HistorySession } from "@/types/history";

import { SessionHistory } from "@/components/history/session-history";

export default function HistoryPage() {
  const [sessions, setSessions] =
    useState<HistorySession[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      try {
        const history =
          await getHistory();

        if (!cancelled) {
          setSessions(history.sessions);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your history.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadHistory();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main
      className="
        mx-auto
        w-full
        max-w-7xl
        px-6
        py-8
        lg:px-8
      "
    >
      {/* Page header */}
      <div className="mb-8">
        <p className="text-sm text-[var(--usus-text-muted)]">
          Trainee / History
        </p>

        <h1
          className="
            mt-2
            text-3xl
            font-bold
            text-[var(--usus-text)]
          "
        >
          Training history
        </h1>

        <p
          className="
            mt-2
            max-w-2xl
            text-sm
            text-[var(--usus-text-muted)]
          "
        >
          Review your previous simulations, scores,
          skills and performance.
        </p>
      </div>

      {/* Session history */}
      {loading ? (
        <p className="text-sm text-[var(--usus-text-muted)]">
          Loading your history...
        </p>
      ) : error ? (
        <p
          role="alert"
          className="text-sm text-[var(--usus-danger)]"
        >
          {error}
        </p>
      ) : (
        <SessionHistory sessions={sessions} />
      )}
    </main>
  );
};