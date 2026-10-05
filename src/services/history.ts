import type {
  HistoryFilters,
  HistoryResponse,
  HistorySession,
} from "@/types/history";

import { historyData } from "@/data/history";

/**
 * Get trainee training history.
 *
 * NOTE:
 * The backend currently does not expose
 * a history/list endpoint.
 *
 * This service therefore remains the
 * temporary data source for History.
 *
 * When the backend provides a history
 * endpoint, only this service needs to
 * change. The History page and UI
 * components can remain unchanged.
 */
export async function getHistory(
  filters?: HistoryFilters,
): Promise<HistoryResponse> {
  let sessions: HistorySession[] = [
    ...historyData.sessions,
  ];

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

  const averageScore =
    sessions.length > 0
      ? Math.round(
          sessions.reduce(
            (total, session) =>
              total + session.score,
            0,
          ) / sessions.length,
        )
      : 0;

  const bestScore =
    sessions.length > 0
      ? Math.max(
          ...sessions.map(
            (session) =>
              session.score,
          ),
        )
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

    performanceTrend:
      historyData.performanceTrend ??
      [],
  };
}

/**
 * Get one training session by ID.
 *
 * This remains local for now because
 * the backend does not currently provide
 * a session-history endpoint.
 */
export async function getHistorySession(
  sessionId: string,
): Promise<HistorySession | null> {
  const session =
    historyData.sessions.find(
      (item) =>
        item.sessionId ===
        sessionId,
    );

  return session ?? null;
};