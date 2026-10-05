// ============================================================
// HISTORY TYPES
// ============================================================

export type HistoryStatus =
  | "completed"
  | "in-progress"
  | "abandoned";

export type HistoryDifficulty =
  | "Beginner"
  | "Intermediate"
  | "Advanced";

// ============================================================
// SKILL
// ============================================================

export interface HistorySkill {
  id: string;
  name: string;
  score: number;
}

// ============================================================
// PERFORMANCE TREND
// ============================================================

export interface HistoryTrendPoint {
  date: string;
  score: number;
}

// ============================================================
// SESSION
// ============================================================

export interface HistorySession {
  sessionId: string;

  scenarioId: string;

  scenarioTitle: string;

  category: string;

  difficulty: HistoryDifficulty;

  score: number;

  status: HistoryStatus;

  /**
   * Session start time.
   */
  startedAt: string;

  /**
   * Session completion time.
   */
  completedAt: string;

  /**
   * Session duration in seconds.
   */
  durationSeconds: number;

  /**
   * Optional legacy duration value.
   */
  duration?: number;

  /**
   * Skills evaluated during the session.
   */
  skills: HistorySkill[];
}

// ============================================================
// FILTERS
// ============================================================

export interface HistoryFilters {
  search?: string;

  category?: string;

  difficulty?: HistoryDifficulty | "All";

  status?: HistoryStatus | "All";
}

// ============================================================
// SUMMARY
// ============================================================

export interface HistorySummary {
  totalSessions: number;

  completedSessions: number;

  averageScore: number;

  bestScore: number;
}

// ============================================================
// API RESPONSE
// ============================================================

export interface HistoryResponse {
  summary: HistorySummary;

  sessions: HistorySession[];

  performanceTrend?: HistoryTrendPoint[];
};