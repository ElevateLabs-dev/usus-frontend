import { apiClient } from "@/services/api-client";

import type { OrgUser } from "@/services/users-service";

/*
 * ============================================================
 * BACKEND SHAPES (platform admins only)
 * ============================================================
 */

export type CheckState =
  | "ok"
  | "not_configured"
  | "error";

export interface StatusCheck {
  /** "api", "database", "email" or "ai" */
  name: string;
  state: CheckState;
  detail: string;
}

export interface PlatformStatus {
  overall:
    | "operational"
    | "degraded"
    | "maintenance";
  environment: string;
  version: string;
  maintenance_mode: boolean;
  checks: StatusCheck[];
  checked_at: string;
}

export interface ActivityItem {
  type:
    | "organization_created"
    | "user_added"
    | "session_completed";
  message: string;
  organization_id: string | null;
  organization_name: string | null;
  occurred_at: string;
}

export interface AlertItem {
  type:
    | "invite_not_delivered"
    | "evaluation_missing";
  message: string;
  organization_id: string | null;
  organization_name: string | null;
  occurred_at: string;
}

export interface PlatformSettings {
  maintenance_mode: boolean;
  updated_at: string | null;
}

/*
 * ============================================================
 * STATUS AND ACTIVITY
 * ============================================================
 */

/**
 * Health of the API, database, email
 * and AI provider.
 */
export async function getPlatformStatus(): Promise<PlatformStatus> {
  return apiClient<PlatformStatus>(
    "/platform/status",
  );
}

/**
 * Latest events across all
 * organisations, newest first.
 */
export async function getPlatformActivity(
  limit = 20,
): Promise<ActivityItem[]> {
  return apiClient<ActivityItem[]>(
    `/platform/activity?limit=${limit}`,
  );
}

/**
 * Problems to fix: undelivered invites
 * and evaluations that did not finish.
 */
export async function getPlatformAlerts(): Promise<
  AlertItem[]
> {
  return apiClient<AlertItem[]>(
    "/platform/alerts",
  );
}

/*
 * ============================================================
 * SETTINGS
 * ============================================================
 */

export async function getPlatformSettings(): Promise<PlatformSettings> {
  return apiClient<PlatformSettings>(
    "/platform/settings",
  );
}

/**
 * While maintenance mode is on, only
 * platform admins can sign in.
 */
export async function setMaintenanceMode(
  enabled: boolean,
): Promise<PlatformSettings> {
  return apiClient<PlatformSettings>(
    "/platform/settings",
    {
      method: "PATCH",
      body: JSON.stringify({
        maintenance_mode: enabled,
      }),
    },
  );
}

/*
 * ============================================================
 * PLATFORM ADMINS
 * ============================================================
 */

export async function getPlatformAdmins(): Promise<
  OrgUser[]
> {
  return apiClient<OrgUser[]>(
    "/platform/admins",
  );
}

/**
 * Add a member of the USUS team. They
 * are emailed a temporary password.
 */
export async function addPlatformAdmin(input: {
  email: string;
  fullName?: string;
}): Promise<OrgUser> {
  return apiClient<OrgUser>(
    "/platform/admins",
    {
      method: "POST",
      body: JSON.stringify({
        email: input.email,
        full_name: input.fullName || null,
      }),
    },
  );
}

export async function setPlatformAdminActive(
  userId: string,
  isActive: boolean,
): Promise<OrgUser> {
  return apiClient<OrgUser>(
    `/platform/admins/${userId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        is_active: isActive,
      }),
    },
  );
}

export async function resendPlatformAdminInvite(
  userId: string,
): Promise<void> {
  await apiClient(
    `/platform/admins/${userId}/resend-invite`,
    { method: "POST" },
  );
}
