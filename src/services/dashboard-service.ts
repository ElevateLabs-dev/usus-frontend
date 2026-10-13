import { apiClient } from "@/services/api-client";
import {
  getScenarios,
  type BackendScenario,
} from "@/services/scenario-service";
import { getHistory } from "@/services/history";

/*
 * ============================================================
 * BACKEND SHAPE (GET /progress/me)
 * ============================================================
 */

export interface BackendProgress {
  user_id: string;
  sessions_started: number;
  sessions_completed: number;
  total_practice_minutes: number;
  /** 0-100; null before any evaluation */
  average_score: number | null;
  best_score: number | null;
  latest_score: number | null;
  score_change: number | null;
  improving: boolean | null;
  dimensions: {
    id: string;
    name: string;
    average: number;
    latest: number;
    change: number;
  }[];
}

/*
 * ============================================================
 * DASHBOARD SHAPE (what the components render)
 * ============================================================
 */

export interface DashboardData {
  overall: {
    score: number;
    completion: number;
    scenariosCompleted: number;
    totalScenarios: number;
  };
  skills: {
    name: string;
    score: number;
  }[];
  continueTraining: {
    id: string;
    title: string;
    category: string;
    level: string;
    progress: number;
  }[];
  recentSessions: {
    id: string;
    scenarioId: string;
    title: string;
    category: string;
    date: string;
    score: number;
  }[];
  recommendations: {
    id: string;
    title: string;
    category: string;
    duration: string;
    description: string;
    level: string;
  }[];
}

function formatLevel(
  difficulty: BackendScenario["difficulty"],
) {
  return (
    difficulty.charAt(0).toUpperCase() +
    difficulty.slice(1)
  );
}

function categoryName(
  scenario: BackendScenario,
) {
  return (
    scenario.category?.name ??
    "Customer scenario"
  );
}

/**
 * Build the trainee dashboard from
 * the real progress, scenarios and
 * session history.
 */
export async function getDashboard(): Promise<DashboardData> {
  const [progress, scenarios, history] =
    await Promise.all([
      apiClient<BackendProgress>(
        "/progress/me",
      ),
      getScenarios(),
      getHistory(),
    ]);

  const completed = scenarios.filter(
    (scenario) =>
      scenario.progress.status ===
      "completed",
  );

  /*
   * Continue training: scenarios already
   * started, weakest score first.
   */
  const started = scenarios
    .filter(
      (scenario) =>
        scenario.progress.attempts > 0,
    )
    .sort(
      (a, b) =>
        (a.progress.best_score ?? 0) -
        (b.progress.best_score ?? 0),
    );

  /*
   * Recommended: scenarios not tried yet.
   */
  const untried = scenarios.filter(
    (scenario) =>
      scenario.progress.attempts === 0,
  );

  return {
    overall: {
      score: progress.average_score ?? 0,

      completion:
        scenarios.length > 0
          ? Math.round(
              (completed.length /
                scenarios.length) *
                100,
            )
          : 0,

      scenariosCompleted:
        completed.length,

      totalScenarios: scenarios.length,
    },

    skills: progress.dimensions.map(
      (dimension) => ({
        name: dimension.name,
        score: dimension.average,
      }),
    ),

    continueTraining: started
      .slice(0, 3)
      .map((scenario) => ({
        id: scenario.id,
        title: scenario.name,
        category: categoryName(scenario),
        level: formatLevel(
          scenario.difficulty,
        ),
        progress:
          scenario.progress.best_score ??
          0,
      })),

    recentSessions: history.sessions
      .slice(0, 3)
      .map((session) => ({
        id: session.sessionId,
        scenarioId: session.scenarioId,
        title: session.scenarioTitle,
        category: session.category,
        date: new Date(
          session.completedAt,
        ).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        score: session.score,
      })),

    recommendations: untried
      .slice(0, 2)
      .map((scenario) => ({
        id: scenario.id,
        title: scenario.name,
        category: categoryName(scenario),
        duration: `${scenario.estimated_minutes} min`,
        description: scenario.description,
        level: formatLevel(
          scenario.difficulty,
        ),
      })),
  };
}
