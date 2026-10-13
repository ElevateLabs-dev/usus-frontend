import { apiClient } from "@/services/api-client";
import type {
  EvaluationData,
  EvaluationInsight,
} from "@/types/evaluation";
import {
  getScenario,
  type BackendScenario,
} from "@/services/scenario-service";
import type {
  BackendDimensionScore,
  BackendEvaluation,
  BackendRedFlag,
} from "@/services/simulation-service";

/*
 * The backend generates the evaluation in the
 * background after a session ends (usually
 * 10-30 seconds). Until it is ready the
 * endpoint answers with this message.
 */
const EVALUATION_PENDING_MESSAGE =
  "Evaluation is still being generated.";

const EVALUATION_POLL_INTERVAL_MS = 2500;

const EVALUATION_MAX_WAIT_MS = 90000;

function wait(ms: number) {
  return new Promise((resolve) =>
    window.setTimeout(resolve, ms),
  );
}

/**
 * Get the evaluation, waiting while the
 * backend is still generating it.
 */
async function waitForEvaluation(
  sessionId: string,
): Promise<BackendEvaluation> {
  const startedAt = Date.now();

  while (true) {
    try {
      return await apiClient<BackendEvaluation>(
        `/simulations/${sessionId}/evaluation`,
      );
    } catch (error) {
      const stillGenerating =
        error instanceof Error &&
        error.message ===
          EVALUATION_PENDING_MESSAGE;

      if (!stillGenerating) {
        throw error;
      }

      if (
        Date.now() - startedAt >
        EVALUATION_MAX_WAIT_MS
      ) {
        throw new Error(
          "Your evaluation is taking longer than expected. Please refresh this page in a moment.",
        );
      }

      await wait(
        EVALUATION_POLL_INTERVAL_MS,
      );
    }
  }
}

function formatDifficulty(
  difficulty: BackendScenario["difficulty"],
): "Beginner" | "Intermediate" | "Advanced" {
  switch (difficulty) {
    case "beginner":
      return "Beginner";

    case "intermediate":
      return "Intermediate";

    case "advanced":
      return "Advanced";
  }
}

function mapInsights(
  dimensionScores: BackendDimensionScore[],
  redFlags: BackendRedFlag[],
  missedOpportunities: string[],
): EvaluationInsight[] {
  const dimensionInsights: EvaluationInsight[] =
    dimensionScores.map((dimension) => {
      // Scores are 0-100; 70+ is "Good".
      const isPositive = dimension.score >= 70;

      return {
        id: dimension.id,
        category: "Performance",
        title: dimension.dimension_name,
        description: dimension.rationale,
        type: isPositive
          ? "positive"
          : "improvement",
      };
    });

  const redFlagInsights: EvaluationInsight[] =
    redFlags.map((flag) => ({
      id: flag.id,
      category: "Observation",
      title: flag.reason,
      description: flag.description,
      type: "improvement",
    }));

  const missedOpportunityInsights: EvaluationInsight[] =
    missedOpportunities.map(
      (opportunity, index) => ({
        id: `missed-${index}`,
        category: "Missed opportunity",
        title: "Missed opportunity",
        description: opportunity,
        type: "improvement",
      }),
    );

  return [
    ...dimensionInsights,
    ...missedOpportunityInsights,
    ...redFlagInsights,
  ];
}

function mapEvaluation(
  evaluation: BackendEvaluation,
  scenario: BackendScenario,
  completionTime: number,
): EvaluationData {
  const skills =
    evaluation.dimension_scores.map(
      (dimension) => ({
        id: dimension.id,

        name:
          dimension.dimension_name,

        // Backend scores are already 0–100.
        score:
          dimension.score,

        description:
          dimension.rationale,
      }),
    );

  return {
    sessionId:
      evaluation.session_id,

    scenarioId:
      scenario.id,

    scenario: {
      id: scenario.id,

      title:
        scenario.name,

      category:
        scenario.category?.name ??
        "Customer scenario",

      difficulty:
        formatDifficulty(
          scenario.difficulty,
        ),
    },

    overallScore:
      evaluation.overall_score ?? 0,

    completionTime,

    summary:
      evaluation.summary ??
      "No evaluation summary was provided.",

    skills,

    strengths:
      evaluation.strengths ?? [],

    improvements:
      evaluation.improvements ?? [],

    insights:
      mapInsights(
        evaluation.dimension_scores,
        evaluation.red_flags,
        evaluation.missed_opportunities ??
          [],
      ),

    recommendations:
      evaluation.recommendations ?? [],

    createdAt:
      evaluation.created_at,
  };
}

export async function getEvaluation({
  scenarioId,
  sessionId,
}: {
  scenarioId: string;
  sessionId: string;
}): Promise<EvaluationData | null> {
  /*
   * Get the real evaluation generated
   * by the backend, waiting while it is
   * still being generated.
   */
  const evaluation =
    await waitForEvaluation(sessionId);

  /*
   * Get the real scenario so the
   * evaluation page can display
   * its name and difficulty.
   */
  const scenario =
    await getScenario(scenarioId);

  let completionTime = 0;

  /*
   * Duration was passed from the
   * role-play page through the URL.
   */
  if (
    typeof window !== "undefined"
  ) {
    const params =
      new URLSearchParams(
        window.location.search,
      );

    const duration =
      Number(
        params.get("duration"),
      );

    if (
      Number.isFinite(duration) &&
      duration >= 0
    ) {
      completionTime =
        duration;
    }
  }

  return mapEvaluation(
    evaluation,
    scenario,
    completionTime,
  );
};