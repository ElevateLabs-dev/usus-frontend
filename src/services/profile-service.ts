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

/** Fired on window when the signed-in user's picture changes. */
export const AVATAR_CHANGED_EVENT = "profile-picture-updated";

/**
 * Upload a new profile picture (JPEG, PNG or WebP,
 * up to 2 MB). Returns the updated profile.
 */
export async function uploadAvatar(file: File): Promise<OrgUser> {
  const body = new FormData();
  body.append("file", file);

  const profile = await apiClient<OrgUser>("/users/me/avatar", {
    method: "PUT",
    body,
  });

  window.dispatchEvent(
    new CustomEvent(AVATAR_CHANGED_EVENT, {
      detail: profile.avatar_url,
    }),
  );

  return profile;
}
