"use client";

import { use, useEffect, useState } from "react";

import Link from "next/link";

import { getHistorySession } from "@/services/history";

import type { HistorySession } from "@/types/history";

interface HistoryReviewPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default function HistoryReviewPage({
  params,
}: HistoryReviewPageProps) {
  const { sessionId } = use(params);

  const [session, setSession] =
    useState<HistorySession | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      const data =
        await getHistorySession(sessionId);

      if (!cancelled) {
        setSession(data);
        setLoading(false);
      }
    }

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (loading) {
    return (
      <main
        className="
          min-h-full
          bg-[var(--usus-background)]
        "
      >
        <div
          className="
            mx-auto
            max-w-3xl
            px-4
            py-16
            text-center
          "
        >
          <p className="text-sm text-[var(--usus-text-muted)]">
            Loading session...
          </p>
        </div>
      </main>
    );
  }

  /*
   * ============================================================
   * SESSION NOT FOUND
   * ============================================================
   */

  if (!session) {
    return (
      <main
        className="
          min-h-full
          bg-[var(--usus-background)]
        "
      >
        <div
          className="
            mx-auto
            max-w-3xl
            px-4
            py-16
            text-center
          "
        >
          <h1
            className="
              text-2xl
              font-bold
              text-[var(--usus-text)]
            "
          >
            Session not found
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-[var(--usus-text-muted)]
            "
          >
            We could not find the training session
            you requested.
          </p>

          <Link
            href="/history"
            className="
              mt-6
              inline-flex
              rounded-xl
              bg-[var(--usus-primary)]
              px-5
              py-3
              text-sm
              font-semibold
              text-black
              transition
              hover:bg-[var(--usus-primary-hover)]
            "
          >
            Back to history
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main
      className="
        min-h-full
        bg-[var(--usus-background)]
      "
    >
      <div
        className="
          mx-auto
          max-w-5xl
          space-y-6
          px-4
          py-8
          sm:px-6
          lg:px-8
        "
      >
        {/* ====================================================
            BACK TO HISTORY
        ==================================================== */}

        <Link
          href="/history"
          className="
            inline-flex
            text-sm
            font-medium
            text-[var(--usus-text-muted)]
            transition
            hover:text-[var(--usus-text)]
          "
        >
          ← Back to history
        </Link>

        {/* ====================================================
            SESSION HEADER
        ==================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-[var(--usus-border)]
            bg-[var(--usus-surface)]
            p-6
            shadow-[var(--usus-shadow)]
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-start
              sm:justify-between
            "
          >
            <div>
              <p
                className="
                  text-sm
                  text-[var(--usus-text-muted)]
                "
              >
                {session.category}
              </p>

              <h1
                className="
                  mt-2
                  text-2xl
                  font-bold
                  text-[var(--usus-text)]
                "
              >
                {session.scenarioTitle}
              </h1>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className="
                    rounded-full
                    border
                    border-[var(--usus-border)]
                    px-3
                    py-1
                    text-xs
                    text-[var(--usus-text-muted)]
                  "
                >
                  {session.difficulty}
                </span>

                <span
                  className="
                    rounded-full
                    bg-[var(--usus-primary-soft)]
                    px-3
                    py-1
                    text-xs
                    text-[var(--usus-text)]
                  "
                >
                  {session.status}
                </span>
              </div>
            </div>

            <div className="sm:text-right">
              <p
                className="
                  text-sm
                  text-[var(--usus-text-muted)]
                "
              >
                Session score
              </p>

              <p
                className="
                  mt-1
                  text-4xl
                  font-bold
                  text-[var(--usus-primary)]
                "
              >
                {session.score}%
              </p>
            </div>
          </div>
        </section>

        {/* ====================================================
            SKILL PERFORMANCE
        ==================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-[var(--usus-border)]
            bg-[var(--usus-surface)]
            p-6
          "
        >
          <h2
            className="
              text-lg
              font-semibold
              text-[var(--usus-text)]
            "
          >
            Skill performance
          </h2>

          <div className="mt-5 space-y-5">
            {session.skills.map((skill) => (
              <div key={skill.id}>
                <div
                  className="
                    mb-2
                    flex
                    items-center
                    justify-between
                  "
                >
                  <span
                    className="
                      text-sm
                      text-[var(--usus-text)]
                    "
                  >
                    {skill.name}
                  </span>

                  <span
                    className="
                      text-sm
                      font-semibold
                      text-[var(--usus-text)]
                    "
                  >
                    {skill.score}%
                  </span>
                </div>

                <div
                  className="
                    h-2
                    overflow-hidden
                    rounded-full
                    bg-[var(--usus-progress-track)]
                  "
                >
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-[var(--usus-primary)]
                      transition-all
                      duration-500
                    "
                    style={{
                      width: `${Math.min(
                        Math.max(skill.score, 0),
                        100,
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ====================================================
            SESSION INFORMATION
        ==================================================== */}

        <section
          className="
            rounded-2xl
            border
            border-[var(--usus-border)]
            bg-[var(--usus-surface)]
            p-6
          "
        >
          <h2
            className="
              text-lg
              font-semibold
              text-[var(--usus-text)]
            "
          >
            Session information
          </h2>

          <div
            className="
              mt-5
              grid
              gap-5
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {/* Started */}
            <div>
              <p
                className="
                  text-xs
                  text-[var(--usus-text-soft)]
                "
              >
                Started
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                  text-[var(--usus-text)]
                "
              >
                {new Date(
                  session.startedAt,
                ).toLocaleString()}
              </p>
            </div>

            {/* Completed */}
            <div>
              <p
                className="
                  text-xs
                  text-[var(--usus-text-soft)]
                "
              >
                Completed
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                  text-[var(--usus-text)]
                "
              >
                {new Date(
                  session.completedAt,
                ).toLocaleString()}
              </p>
            </div>

            {/* Duration */}
            <div>
              <p
                className="
                  text-xs
                  text-[var(--usus-text-soft)]
                "
              >
                Duration
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-medium
                  text-[var(--usus-text)]
                "
              >
                {Math.floor(
                  session.durationSeconds / 60,
                )}{" "}
                min{" "}
                {session.durationSeconds % 60} sec
              </p>
            </div>

            {/* Session ID */}
            <div>
              <p
                className="
                  text-xs
                  text-[var(--usus-text-soft)]
                "
              >
                Session ID
              </p>

              <p
                className="
                  mt-1
                  truncate
                  text-sm
                  font-medium
                  text-[var(--usus-text)]
                "
                title={session.sessionId}
              >
                {session.sessionId}
              </p>
            </div>
          </div>
        </section>

        {/* ====================================================
            ACTIONS
        ==================================================== */}

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/scenarios/${session.scenarioId}`}
            className="
              rounded-xl
              bg-[var(--usus-primary)]
              px-5
              py-3
              text-sm
              font-semibold
              text-black
              transition
              hover:bg-[var(--usus-primary-hover)]
            "
          >
            Practice again
          </Link>

          <Link
            href="/scenarios"
            className="
              rounded-xl
              border
              border-[var(--usus-border)]
              bg-[var(--usus-surface)]
              px-5
              py-3
              text-sm
              font-medium
              text-[var(--usus-text)]
              transition
              hover:border-[var(--usus-primary)]
            "
          >
            Browse scenarios
          </Link>
        </div>
      </div>
    </main>
  );
};