"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { getLearningPath } from "@/services/learning-path-service";

import type { LearningPathData } from "@/types/learning-path";

export default function LearningPathPage() {
  const [data, setData] =
    useState<LearningPathData | null>(null);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLearningPath() {
      try {
        const result =
          await getLearningPath();

        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your learning path.",
          );
        }
      }
    }

    loadLearningPath();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!data) {
    return (
      <div className="min-h-full bg-[var(--usus-background)]">
        <main className="mx-auto w-full max-w-[1440px] px-5 py-16 text-center sm:px-8 lg:px-10 xl:px-12">
          <p
            role={error ? "alert" : undefined}
            className="text-sm text-[var(--usus-text-muted)]"
          >
            {error ||
              "Loading your learning path..."}
          </p>
        </main>
      </div>
    );
  }

  const {
    overall,
    levels,
    categories,
    currentLevel,
  } = data;

  const remaining = Math.max(
    0,
    overall.total - overall.completed
  );

  return (
    <div className="min-h-full bg-[var(--usus-background)]">
      <main className="mx-auto w-full max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 xl:px-12">

        {/* =====================================================
            PAGE HEADER
        ===================================================== */}
        <section className="mb-8">
          <p className="text-sm font-medium text-[var(--usus-text-muted)]">
            Learning
          </p>

          <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--usus-text)] sm:text-4xl">
                Your Learning Path
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--usus-text-muted)]">
                Build your customer service skills step by step through
                structured practice and realistic scenarios.
              </p>
            </div>

            <div
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-[var(--usus-border)]
                bg-[var(--usus-surface)]
                px-4
                py-2
                text-sm
                shadow-[var(--usus-shadow)]
              "
            >
              <span className="h-2 w-2 rounded-full bg-[var(--usus-primary)]" />

              <span className="text-[var(--usus-text-muted)]">
                Overall progress
              </span>

              <span className="font-semibold text-[var(--usus-text)]">
                {overall.percentage}%
              </span>
            </div>
          </div>
        </section>

        {/* =====================================================
            OVERALL PROGRESS
        ===================================================== */}
        <section
          className="
            mb-10
            overflow-hidden
            rounded-3xl
            border
            border-[var(--usus-border)]
            bg-[var(--usus-surface)]
            shadow-[var(--usus-shadow)]
          "
        >
          <div className="grid lg:grid-cols-[1.35fr_0.65fr]">

            {/* Main progress */}
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex items-start justify-between gap-6">

                <div>
                  <p className="text-sm font-medium text-[var(--usus-text-muted)]">
                    Overall training progress
                  </p>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tight text-[var(--usus-text)]">
                      {overall.percentage}%
                    </span>

                    <span className="text-sm text-[var(--usus-text-muted)]">
                      complete
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-[var(--usus-text-muted)]">
                    {overall.completed} of {overall.total} scenarios completed
                  </p>
                </div>

                {/* Circular progress */}
                <div className="relative h-24 w-24 shrink-0">
                  <svg
                    className="h-24 w-24 -rotate-90"
                    viewBox="0 0 100 100"
                    aria-label={`${overall.percentage}% complete`}
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="var(--usus-progress-track)"
                      strokeWidth="8"
                    />

                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="var(--usus-primary)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${overall.percentage * 2.513} 251.3`}
                      className="transition-all duration-700"
                    />
                  </svg>

                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[var(--usus-text)]">
                    {overall.percentage}%
                  </span>
                </div>
              </div>

              {/* Main progress bar */}
              <div className="mt-8">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="text-[var(--usus-text-muted)]">
                    Training completion
                  </span>

                  <span className="font-semibold text-[var(--usus-text)]">
                    {overall.percentage}%
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-[var(--usus-progress-track)]">
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-[var(--usus-primary)]
                      transition-all
                      duration-700
                      ease-out
                    "
                    style={{
                      width: `${overall.percentage}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div
              className="
                border-t
                border-[var(--usus-border)]
                bg-[var(--usus-surface-soft)]
                lg:border-l
                lg:border-t-0
              "
            >
              <div className="grid grid-cols-2 lg:grid-cols-1">

                {/* Completed */}
                <div
                  className="
                    flex
                    flex-col
                    justify-center
                    border-b
                    border-r
                    border-[var(--usus-border)]
                    px-6
                    py-6
                    lg:border-r-0
                  "
                >
                  <span className="text-xs font-medium text-[var(--usus-text-muted)]">
                    Completed
                  </span>

                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[var(--usus-text)]">
                      {overall.completed}
                    </span>

                    <span className="text-xs text-[var(--usus-text-muted)]">
                      / {overall.total}
                    </span>
                  </div>

                  <span className="mt-0.5 text-xs text-[var(--usus-text-muted)]">
                    scenarios
                  </span>
                </div>

                {/* Remaining */}
                <div
                  className="
                    flex
                    flex-col
                    justify-center
                    border-b
                    border-[var(--usus-border)]
                    px-6
                    py-6
                  "
                >
                  <span className="text-xs font-medium text-[var(--usus-text-muted)]">
                    Remaining
                  </span>

                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[var(--usus-text)]">
                      {remaining}
                    </span>

                    <span className="text-xs text-[var(--usus-text-muted)]">
                      scenarios
                    </span>
                  </div>

                  <span className="mt-0.5 text-xs text-[var(--usus-text-muted)]">
                    to complete
                  </span>
                </div>

                {/* Current level */}
                <div
                  className="
                    flex
                    flex-col
                    justify-center
                    border-r
                    border-[var(--usus-border)]
                    px-6
                    py-6
                    lg:border-r-0
                  "
                >
                  <span className="text-xs font-medium text-[var(--usus-text-muted)]">
                    Current level
                  </span>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[var(--usus-primary)]" />

                    <span className="text-base font-bold text-[var(--usus-text)]">
                      {currentLevel}
                    </span>
                  </div>

                  <span className="mt-1 text-xs text-[var(--usus-text-muted)]">
                    Your active learning stage
                  </span>
                </div>

                {/* Levels */}
                <div
                  className="
                    flex
                    flex-col
                    justify-center
                    px-6
                    py-6
                  "
                >
                  <span className="text-xs font-medium text-[var(--usus-text-muted)]">
                    Learning stages
                  </span>

                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-[var(--usus-text)]">
                      {levels.length}
                    </span>

                    <span className="text-xs text-[var(--usus-text-muted)]">
                      levels
                    </span>
                  </div>

                  <span className="mt-0.5 text-xs text-[var(--usus-text-muted)]">
                    Beginner to Advanced
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            LEARNING PROGRESSION
        ===================================================== */}
        <section className="mb-10">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-[var(--usus-text)]">
              Learning progression
            </h2>

            <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
              Progress through increasingly challenging customer situations.
            </p>
          </div>

          <div className="relative">

            {/* Connecting line */}
            <div
              className="
                absolute
                left-[16.66%]
                right-[16.66%]
                top-7
                hidden
                h-px
                bg-[var(--usus-border)]
                lg:block
              "
            />

            <div className="grid gap-5 lg:grid-cols-3">
              {levels.map((level, index) => {
                const isCurrent = level.status === "current";
                const isComplete = level.status === "completed";
                const isLocked = level.status === "locked";

                const cardClassName = `
                      group
                      relative
                      w-full
                      rounded-2xl
                      border
                      border-[var(--usus-border)]
                      bg-[var(--usus-surface)]
                      p-6
                      text-left
                      shadow-[var(--usus-shadow)]
                      transition-all
                      duration-200
                      focus:outline-none
                      focus:ring-2
                      focus:ring-[var(--usus-primary)]
                      ${
                        isLocked
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer hover:-translate-y-1 hover:border-[var(--usus-primary)] hover:shadow-lg"
                      }
                    `;

                const content = (
                  <>
                    <div className="relative z-10 flex items-center justify-between">

                      <span
                        className={`
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center
                          rounded-full
                          border-4
                          ${
                            isComplete || isCurrent
                              ? "border-[var(--usus-primary)] bg-[var(--usus-primary-soft)]"
                              : "border-[var(--usus-border)] bg-[var(--usus-muted)]"
                          }
                        `}
                      >
                        <span className="text-sm font-bold text-[var(--usus-text)]">
                          {index + 1}
                        </span>
                      </span>

                      <span className="text-xs font-medium text-[var(--usus-text-muted)]">
                        {level.completed}/{level.total}
                      </span>
                    </div>

                    <div className="mt-5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold text-[var(--usus-text)]">
                          {level.name}
                        </h3>

                        {isCurrent && (
                          <span className="rounded-full bg-[var(--usus-primary-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--usus-text)]">
                            Current
                          </span>
                        )}

                        {isComplete && (
                          <span className="rounded-full bg-[var(--usus-primary-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--usus-text)]">
                            Completed
                          </span>
                        )}

                        {isLocked && (
                          <span className="rounded-full bg-[var(--usus-muted)] px-2.5 py-1 text-[10px] font-semibold text-[var(--usus-text-muted)]">
                            Locked
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-sm leading-6 text-[var(--usus-text-muted)]">
                        {level.description}
                      </p>
                    </div>

                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-[var(--usus-text-muted)]">
                          Progress
                        </span>

                        <span className="font-semibold text-[var(--usus-text)]">
                          {level.percentage}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-[var(--usus-progress-track)]">
                        <div
                          className="h-full rounded-full bg-[var(--usus-primary)] transition-all duration-700"
                          style={{
                            width: `${level.percentage}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-5 text-sm font-semibold text-[var(--usus-text)] transition-colors group-hover:text-[var(--usus-primary-hover)]">
                      {isLocked
                        ? level.lockedReason ??
                          "Complete the previous level"
                        : "Explore level →"}
                    </div>
                  </>
                );

                /*
                 * An open level opens the scenarios
                 * page filtered to that level.
                 */
                return isLocked ? (
                  <div
                    key={level.id}
                    aria-disabled="true"
                    className={cardClassName}
                  >
                    {content}
                  </div>
                ) : (
                  <Link
                    key={level.id}
                    href={`/scenarios?difficulty=${level.id}`}
                    className={cardClassName}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            TRAINING CATEGORIES
        ===================================================== */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-[var(--usus-text)]">
              Training categories
            </h2>

            <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
              Strengthen individual skills through focused scenario practice.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className="
                  group
                  w-full
                  cursor-pointer
                  rounded-2xl
                  border
                  border-[var(--usus-border)]
                  bg-[var(--usus-surface)]
                  p-6
                  text-left
                  shadow-[var(--usus-shadow)]
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:border-[var(--usus-primary)]
                  hover:shadow-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--usus-primary)]
                "
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[var(--usus-text)]">
                      {category.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[var(--usus-text-muted)]">
                      {category.description}
                    </p>
                  </div>

                  <span className="shrink-0 text-lg font-bold text-[var(--usus-text)]">
                    {category.percentage}%
                  </span>
                </div>

                <div className="mt-6">
                  <div className="h-2.5 overflow-hidden rounded-full bg-[var(--usus-progress-track)]">
                    <div
                      className="
                        h-full
                        rounded-full
                        bg-[var(--usus-primary)]
                        transition-all
                        duration-700
                        ease-out
                      "
                      style={{
                        width: `${category.percentage}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-[var(--usus-text-muted)]">
                    {category.completed} of {category.total} completed
                  </span>

                  <span className="text-sm font-semibold text-[var(--usus-text)] transition-colors group-hover:text-[var(--usus-primary-hover)]">
                    View scenarios →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};