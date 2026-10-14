import { apiClient } from "@/services/api-client";

import type { OrgUser } from "@/services/users-service";

/**
 * The signed-in user's profile.
 */
export async function getMyProfile(): Promise<OrgUser> {
  return apiClient<OrgUser>("/users/me");
}

/**
 * Change the signed-in user's name.
 */
export async function updateMyName(
  fullName: string,
): Promise<OrgUser> {
  return apiClient<OrgUser>("/users/me", {
    method: "PATCH",
    body: JSON.stringify({
      full_name: fullName,
    }),
  });
}
