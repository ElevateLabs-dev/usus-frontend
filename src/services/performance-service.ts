import { apiClient } from "@/services/api-client";

import type { BackendProgress } from "@/services/dashboard-service";

/*
 * ============================================================
 * BACKEND SHAPES (company admins and managers)
 * ============================================================
 */

/** One trainee in GET /progress/team. */
export interface TeamMemberProgress {
  user_id: string;
  email: string;
  full_name: string | null;
  /** True = has not signed in yet. */
  must_change_password: boolean;
  sessions_completed: number;
  average_score: number | null;
  latest_score: number | null;
  last_active_at: string | null;
}

export interface CategoryScore {
  id: string;
  name: string;
  sessions_completed: number;
  average_score: number | null;
}

/** GET /progress/team/skills */
export interface TeamSkills {
  sessions_completed: number;
  average_score: number | null;
  /** Weakest first. */
  dimensions: {
    id: string;
    name: string;
    average: number;
    sessions: number;
  }[];
  weakest_dimension: string | null;
  categories: CategoryScore[];
}

/** GET /progress/users/{id}: the same report a trainee sees. */
export interface TraineeReport extends BackendProgress {
  score_history: {
    session_id: string;
    scenario_name: string;
    category: string | null;
    completed_at: string;
    overall_score: number;
  }[];
  categories: CategoryScore[];
}

/*
 * ============================================================
 * REQUESTS
 * ============================================================
 */

export async function getTeamMembersProgress(): Promise<
  TeamMemberProgress[]
> {
  return apiClient<TeamMemberProgress[]>(
    "/progress/team",
  );
}

export async function getTeamSkills(): Promise<TeamSkills> {
  return apiClient<TeamSkills>(
    "/progress/team/skills",
  );
}

export async function getTraineeReport(
  userId: string,
): Promise<TraineeReport> {
  return apiClient<TraineeReport>(
    `/progress/users/${userId}`,
  );
}
