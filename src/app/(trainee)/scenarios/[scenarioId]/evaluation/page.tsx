"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

import type { EvaluationData } from "@/types/evaluation";

import { getEvaluation } from "@/services/evaluation-service";

import { EvaluationHeader } from "@/components/evaluation/evaluation-header";
import { OverallScore } from "@/components/evaluation/overall-score";
import { SkillBreakdown } from "@/components/evaluation/skill-breakdown";
import { PerformanceFeedback } from "@/components/evaluation/performance-feedback";
import { ConversationInsights } from "@/components/evaluation/conversation-insights";
import { Recommendations } from "@/components/evaluation/recommendations";
import { EvaluationActions } from "@/components/evaluation/evaluation-actions";

export default function EvaluationPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const scenarioId =
    typeof params.scenarioId === "string"
      ? params.scenarioId
      : "";

  const sessionId =
    searchParams.get("sessionId");

  const [evaluation, setEvaluation] =
    useState<EvaluationData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  /*
   * ============================================================
   * LOAD EVALUATION
   * ============================================================
   */

  useEffect(() => {
    let cancelled = false;

    async function loadEvaluation() {
      try {
        setLoading(true);
        setError(null);
        setEvaluation(null);

        /*
         * Both IDs are required.
         */

        if (!scenarioId) {
          throw new Error(
            "Scenario ID is missing."
          );
        }

        if (!sessionId) {
          throw new Error(
            "Session ID is missing."
          );
        }

        /*
         * Get evaluation through the service.
         *
         * The page does not know whether the data
         * comes from mock data or the real API.
         */

        const result =
          await getEvaluation({
            scenarioId,
            sessionId,
          });

        if (cancelled) {
          return;
        }

        if (!result) {
          throw new Error(
            "Evaluation could not be found for this session."
          );
        }

        setEvaluation(result);
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load evaluation:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load evaluation."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadEvaluation();

    return () => {
      cancelled = true;
    };
  }, [scenarioId, sessionId]);

  /*
   * ============================================================
   * LOADING
   * ============================================================
   */

  if (loading) {
    return (
      <main
        className="
          min-h-screen
          bg-[var(--usus-background)]
          text-[var(--usus-text)]
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[60vh]
            w-full
            max-w-7xl
            items-center
            justify-center
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <div className="text-center">
            <div
              className="
                mx-auto
                h-8
                w-8
                animate-spin
                rounded-full
                border-2
                border-[var(--usus-border)]
                border-t-[var(--usus-primary)]
              "
            />

            <p
              className="
                mt-4
                text-sm
                text-[var(--usus-text-muted)]
              "
            >
              Preparing your evaluation...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ============================================================
   * ERROR
   * ============================================================
   */

  if (error || !evaluation) {
    return (
      <main
        className="
          min-h-screen
          bg-[var(--usus-background)]
          text-[var(--usus-text)]
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[60vh]
            w-full
            max-w-3xl
            items-center
            justify-center
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <div
            className="
              w-full
              rounded-2xl
              border
              border-[var(--usus-border)]
              bg-[var(--usus-surface)]
              p-8
              text-center
            "
          >
            <h1
              className="
                text-xl
                font-semibold
                text-[var(--usus-text)]
              "
            >
              Evaluation unavailable
            </h1>

            <p
              className="
                mt-2
                text-sm
                text-[var(--usus-text-muted)]
              "
            >
              {error ??
                "We could not load the evaluation for this session."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ============================================================
   * EVALUATION
   * ============================================================
   */

  return (
    <main
      className="
        min-h-screen
        bg-[var(--usus-background)]
        text-[var(--usus-text)]
        transition-colors
        duration-200
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-7xl
          px-4
          py-6
          sm:px-6
          lg:px-8
        "
      >
        <div className="space-y-6">

          {/* ==================================================
              HEADER
          ================================================== */}

          <EvaluationHeader
            scenario={evaluation.scenario}
            completionTime={
              evaluation.completionTime
            }
          />

          {/* ==================================================
              OVERALL SCORE + SKILL BREAKDOWN
          ================================================== */}

          <section
            className="
              grid
              gap-6
              lg:grid-cols-[0.9fr_1.1fr]
            "
          >
            <OverallScore
              score={
                evaluation.overallScore
              }
              summary={
                evaluation.summary
              }
            />

            <SkillBreakdown
              skills={
                evaluation.skills
              }
            />
          </section>

          {/* ==================================================
              PERFORMANCE FEEDBACK
          ================================================== */}

          <PerformanceFeedback
            strengths={
              evaluation.strengths
            }
            improvements={
              evaluation.improvements
            }
          />

          {/* ==================================================
              CONVERSATION INSIGHTS
          ================================================== */}

          <ConversationInsights
            insights={
              evaluation.insights
            }
          />

          {/* ==================================================
              RECOMMENDATIONS
          ================================================== */}

          <Recommendations
            recommendations={
              evaluation.recommendations
            }
          />

          {/* ==================================================
              ACTIONS
          ================================================== */}

          <EvaluationActions
            scenarioId={
              evaluation.scenarioId
            }
            sessionId={
              evaluation.sessionId
            }
          />

        </div>
      </div>
    </main>
  );
};