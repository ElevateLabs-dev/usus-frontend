import { apiClient } from "@/services/api-client";

import type { OrgUser } from "@/services/users-service";

/*
 * ============================================================
 * BACKEND SHAPES (company admins and managers)
 * ============================================================
 */

export interface MyOrganisation {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  users_count: number;
  trainees_count: number;
  /** Active (not archived) scenarios */
  scenarios_count: number;
  /** Evaluated training sessions */
  sessions_completed: number;
  /** Company admins and managers */
  staff: OrgUser[];
}

/** One trainee in GET /progress/team. */
export interface TraineeSummary {
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

/*
 * ============================================================
 * REQUESTS
 * ============================================================
 */

/**
 * The signed-in user's organisation with
 * its counts and staff.
 */
export async function getMyOrganisation(): Promise<MyOrganisation> {
  return apiClient<MyOrganisation>(
    "/organizations/me",
  );
}

/**
 * Rename the organisation (company
 * admins only; 409 if the name is taken).
 */
export async function renameMyOrganisation(
  name: string,
): Promise<MyOrganisation> {
  return apiClient<MyOrganisation>(
    "/organizations/me",
    {
      method: "PATCH",
      body: JSON.stringify({ name }),
    },
  );
}

/**
 * Every trainee with their sessions,
 * scores and last activity.
 */
export async function getTeamProgress(): Promise<
  TraineeSummary[]
> {
  return apiClient<TraineeSummary[]>(
    "/progress/team",
  );
}
