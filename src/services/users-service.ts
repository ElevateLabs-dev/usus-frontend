import { apiClient } from "@/services/api-client";

import type { UserRole } from "@/types/auth";

/*
 * ============================================================
 * BACKEND SHAPES
 * ============================================================
 */

/**
 * A user as seen by their organisation's
 * admins and managers (GET /users/).
 */
export interface OrgUser {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  tenant_id: string | null;
  is_active: boolean;
  /** True until they replace their temporary password. */
  must_change_password: boolean;
  /** When the invite email was sent; null if it failed. */
  invite_sent_at: string | null;
  created_at: string;
}

export interface SkippedTrainee {
  email: string;
  reason: string;
}

export interface ImportTraineesResult {
  created: OrgUser[];
  skipped: SkippedTrainee[];
}

export type OrgRole =
  | "trainee"
  | "manager"
  | "company_admin";

/*
 * ============================================================
 * REQUESTS
 * ============================================================
 */

/**
 * List the organisation's users,
 * optionally only one role.
 */
export async function getOrgUsers(
  role?: OrgRole,
): Promise<OrgUser[]> {
  return apiClient<OrgUser[]>(
    role
      ? `/users/?role=${role}`
      : "/users/",
  );
}

/**
 * Create a user and email them an invite
 * with a temporary password.
 */
export async function inviteUser(input: {
  email: string;
  fullName?: string;
  role: OrgRole;
}): Promise<OrgUser> {
  return apiClient<OrgUser>("/users/", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      full_name: input.fullName || null,
      role: input.role,
    }),
  });
}

/**
 * Add many trainees from an Excel (.xlsx)
 * or CSV file with an "email" column and an
 * optional "full_name" column.
 */
export async function importTrainees(
  file: File,
): Promise<ImportTraineesResult> {
  const body = new FormData();

  body.append("file", file);

  return apiClient<ImportTraineesResult>(
    "/users/trainees/import",
    {
      method: "POST",
      body,
    },
  );
}

/**
 * Download the Excel template for
 * importing trainees.
 */
export async function downloadImportTemplate() {
  const token = localStorage.getItem(
    "usus_access_token",
  );

  const response = await fetch(
    "/api/backend/users/trainees/import-template",
    {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    },
  );

  if (!response.ok) {
    throw new Error(
      "Unable to download the template.",
    );
  }

  const url = URL.createObjectURL(
    await response.blob(),
  );

  const link = document.createElement("a");

  link.href = url;
  link.download =
    "usus-trainees-template.xlsx";
  link.click();

  URL.revokeObjectURL(url);
}

/**
 * Email the user a new temporary password.
 */
export async function resendInvite(
  userId: string,
): Promise<void> {
  await apiClient(
    `/users/${userId}/resend-invite`,
    {
      method: "POST",
    },
  );
}

/**
 * Deactivate or reactivate a user.
 * Their training history is kept.
 */
export async function setUserActive(
  userId: string,
  isActive: boolean,
): Promise<OrgUser> {
  return apiClient<OrgUser>(
    `/users/${userId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        is_active: isActive,
      }),
    },
  );
}
