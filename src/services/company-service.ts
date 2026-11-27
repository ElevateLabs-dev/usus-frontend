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
  logo_url: string | null;
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
 * ORGANISATION REQUESTS
 * ============================================================
 */

/**
 * Get the signed-in user's organisation,
 * including its counts, staff and logo.
 */
export async function getMyOrganisation(): Promise<MyOrganisation> {
  return apiClient<MyOrganisation>("/organizations/me");
}

/**
 * Rename the organisation.
 */
export async function renameMyOrganisation(
  name: string,
): Promise<MyOrganisation> {
  return apiClient<MyOrganisation>("/organizations/me", {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

/*
 * ============================================================
 * ORGANISATION LOGO REQUESTS
 * ============================================================
 */

/**
 * Upload or replace the organisation logo.
 *
 * The logo belongs to the organisation,
 * not to the individual company admin.
 */
export async function uploadMyOrganisationLogo(
  file: File,
): Promise<MyOrganisation> {
  const formData = new FormData();

  formData.append("file", file);

  return apiClient<MyOrganisation>("/organizations/me/logo", {
    method: "PUT",
    body: formData,
  });
}

/**
 * Remove the organisation logo.
 */
export async function removeMyOrganisationLogo(): Promise<MyOrganisation> {
  return apiClient<MyOrganisation>("/organizations/me/logo", {
    method: "DELETE",
  });
}

/*
 * ============================================================
 * TEAM PROGRESS REQUESTS
 * ============================================================
 */

/**
 * Get every trainee with their sessions,
 * scores and last activity.
 */
export async function getTeamProgress(): Promise<TraineeSummary[]> {
  return apiClient<TraineeSummary[]>("/progress/team");
}