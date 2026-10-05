import { apiClient } from "@/services/api-client";
import type {
  EvaluationData,
  EvaluationInsight,
} from "@/types/evaluation";
import {
  getScenario,
  type BackendScenario,
} from "@/services/scenario-service";

interface BackendDimensionScore {
  id: string;
  evaluation_id: string;
  dimension_name: string;
  score: number;
  rationale: string;
}

interface BackendRedFlag {
  id: string;
  evaluation_id: string;
  reason: string;
  description: string;
}

interface BackendEvaluation {
  id: string;
  tenant_id: string;
  session_id: string;
  overall_score: number | null;
  summary: string | null;
  dimension_scores: BackendDimensionScore[];
  red_flags: BackendRedFlag[];
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
): EvaluationInsight[] {
  const dimensionInsights: EvaluationInsight[] =
    dimensionScores.map((dimension) => {
      const isPositive = dimension.score >= 7;

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

  return [
    ...dimensionInsights,
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

        // Backend: 1–10
        // Frontend: 0–100
        score:
          dimension.score * 10,

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

    /*
     * The backend currently does not
     * return separate strengths.
     */
    strengths: [],

    /*
     * The backend currently does not
     * return separate improvements.
     */
    improvements: [],

    insights:
      mapInsights(
        evaluation.dimension_scores,
        evaluation.red_flags,
      ),

    /*
     * The backend currently does not
     * return recommendations.
     */
    recommendations: [],

    createdAt:
      undefined,
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
   * by the backend.
   */
  const evaluation =
    await apiClient<BackendEvaluation>(
      `/simulations/${sessionId}/evaluation`,
    );

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