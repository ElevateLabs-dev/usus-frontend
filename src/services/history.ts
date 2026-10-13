import { apiClient } from "@/services/api-client";
import type { BackendEvaluation } from "@/services/simulation-service";

import type {
  HistoryDifficulty,
  HistoryFilters,
  HistoryResponse,
  HistorySession,
  HistoryStatus,
  HistoryTrendPoint,
} from "@/types/history";

/*
 * ============================================================
 * BACKEND SHAPES
 * ============================================================
 */

interface BackendHistoryItem {
  id: string;
  scenario: {
    id: string;
    name: string;
    category: {
      id: string;
      name: string;
    } | null;
    difficulty:
      | "beginner"
      | "intermediate"
      | "advanced";
  };
  status:
    | "not_started"
    | "in_progress"
    | "completed"
    | "evaluated";
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  /** 0-100; null until evaluated */
  overall_score: number | null;
  message_count: number;
}

interface BackendHistoryPage {
  items: BackendHistoryItem[];
  total: number;
}

interface BackendSessionDetail
  extends BackendHistoryItem {
  evaluation: BackendEvaluation | null;
}

/*
 * ============================================================
 * MAPPING
 * ============================================================
 */

function mapDifficulty(
  difficulty: BackendHistoryItem["scenario"]["difficulty"],
): HistoryDifficulty {
  switch (difficulty) {
    case "beginner":
      return "Beginner";

    case "intermediate":
      return "Intermediate";

    case "advanced":
      return "Advanced";
  }
}

function mapStatus(
  status: BackendHistoryItem["status"],
): HistoryStatus {
  return status === "completed" ||
    status === "evaluated"
    ? "completed"
    : "in-progress";
}

function mapSession(
  item: BackendHistoryItem,
  evaluation: BackendEvaluation | null = null,
): HistorySession {
  return {
    sessionId: item.id,

    scenarioId: item.scenario.id,

    scenarioTitle: item.scenario.name,

    category:
      item.scenario.category?.name ??
      "Customer scenario",

    difficulty:
      mapDifficulty(
        item.scenario.difficulty,
      ),

    score: item.overall_score ?? 0,

    status: mapStatus(item.status),

    startedAt: item.started_at,

    completedAt:
      item.ended_at ?? item.started_at,

    durationSeconds:
      item.duration_seconds ?? 0,

    /*
     * Skill scores come with the
     * evaluation, which only the
     * single-session endpoint returns.
     */
    skills: (
      evaluation?.dimension_scores ?? []
    ).map((dimension) => ({
      id: dimension.id,
      name: dimension.dimension_name,
      score: dimension.score,
    })),
  };
}

/**
 * Get trainee training history
 * from GET /simulations/.
 *
 * Filters are applied here so the
 * History page and UI components
 * stay unchanged.
 */
export async function getHistory(
  filters?: HistoryFilters,
): Promise<HistoryResponse> {
  const page =
    await apiClient<BackendHistoryPage>(
      "/simulations/?limit=200",
    );

  /*
   * Score over time, oldest first,
   * from the evaluated sessions.
   */
  const performanceTrend: HistoryTrendPoint[] =
    page.items
      .filter(
        (item) =>
          item.overall_score !== null,
      )
      .map((item) => ({
        date:
          item.ended_at ??
          item.started_at,
        score: item.overall_score ?? 0,
      }))
      .reverse();

  let sessions: HistorySession[] =
    page.items.map((item) =>
      mapSession(item),
    );

  // Search
  if (filters?.search?.trim()) {
    const search =
      filters.search
        .trim()
        .toLowerCase();

    sessions = sessions.filter(
      (session) =>
        [
          session.scenarioTitle,
          session.category,
          session.difficulty,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search),
    );
  }

  // Category
  if (
    filters?.category &&
    filters.category !== "All"
  ) {
    sessions = sessions.filter(
      (session) =>
        session.category ===
        filters.category,
    );
  }

  // Difficulty
  if (
    filters?.difficulty &&
    filters.difficulty !== "All"
  ) {
    sessions = sessions.filter(
      (session) =>
        session.difficulty ===
        filters.difficulty,
    );
  }

  // Status
  if (
    filters?.status &&
    filters.status !== "All"
  ) {
    sessions = sessions.filter(
      (session) =>
        session.status ===
        filters.status,
    );
  }

  /*
   * Only evaluated sessions have a score.
   */
  const scores = page.items
    .filter(
      (item) =>
        item.overall_score !== null &&
        sessions.some(
          (session) =>
            session.sessionId === item.id,
        ),
    )
    .map(
      (item) => item.overall_score ?? 0,
    );

  const averageScore =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (total, score) =>
              total + score,
            0,
          ) / scores.length,
        )
      : 0;

  const bestScore =
    scores.length > 0
      ? Math.max(...scores)
      : 0;

  return {
    summary: {
      totalSessions:
        sessions.length,

      completedSessions:
        sessions.filter(
          (session) =>
            session.status ===
            "completed",
        ).length,

      averageScore,

      bestScore,
    },

    sessions,

    performanceTrend,
  };
}

/**
 * Get one training session by ID
 * from GET /simulations/{id},
 * including its skill scores.
 */
export async function getHistorySession(
  sessionId: string,
): Promise<HistorySession | null> {
  try {
    const detail =
      await apiClient<BackendSessionDetail>(
        `/simulations/${sessionId}`,
      );

    return mapSession(
      detail,
      detail.evaluation,
    );
  } catch {
    return null;
  }
}
