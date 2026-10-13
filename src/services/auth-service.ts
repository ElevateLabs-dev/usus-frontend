import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
} from "@/types/auth";

import { apiClient } from "@/services/api-client";

const API_URL = "/api/backend";

/**
 * Login user and store authentication tokens.
 */
export async function login(
  credentials: LoginRequest,
): Promise<LoginResponse> {
  const body = new URLSearchParams();

  body.append(
    "grant_type",
    "password",
  );

  body.append(
    "username",
    credentials.username,
  );

  body.append(
    "password",
    credentials.password,
  );

  const tenantId =
    credentials.tenant_id?.trim();

  const url = tenantId
    ? `${API_URL}/auth/token?tenant_id=${encodeURIComponent(
        tenantId,
      )}`
    : `${API_URL}/auth/token`;

  const response = await fetch(
    url,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
        Accept: "application/json",
      },

      body,
    },
  );

  if (!response.ok) {
    let message = "Login failed.";

    try {
      const data =
        await response.json();

      if (
        typeof data?.detail ===
        "string"
      ) {
        message =
          data.detail;
      } else if (
        Array.isArray(
          data?.detail,
        )
      ) {
        message =
          data.detail
            .map(
              (
                error: {
                  msg?: string;
                },
              ) =>
                error.msg ||
                "Validation error",
            )
            .join(", ");
      }
    } catch {
      // Keep default login error.
    }

    throw new Error(message);
  }

  const data =
    (await response.json()) as LoginResponse;

  storeTokens(data);

  return data;
}

/**
 * Save the tokens returned by the backend
 * and tell the app the signed-in user changed.
 */
function storeTokens(data: LoginResponse) {
  localStorage.setItem(
    "usus_access_token",
    data.access_token,
  );

  localStorage.setItem(
    "usus_token_type",
    data.token_type,
  );

  localStorage.setItem(
    "usus_token_expires_in",
    String(data.expires_in),
  );

  window.dispatchEvent(
    new Event(
      "usus-auth-change",
    ),
  );
}

/**
 * Replace the signed-in user's password.
 *
 * Used on first sign-in to swap the emailed
 * temporary password for a real one. The backend
 * returns a new token without the password-change
 * restriction, which replaces the stored one.
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<LoginResponse> {
  const data =
    await apiClient<LoginResponse>(
      "/auth/change-password",
      {
        method: "POST",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      },
    );

  storeTokens(data);

  return data;
}


/**
 * Remove authentication tokens.
 *
 * IMPORTANT:
 * This function does NOT delete:
 * - training sessions
 * - evaluations
 * - progress
 * - history
 *
 * Those records remain in the backend database.
 */
export function logout() {
  localStorage.removeItem(
    "usus_access_token",
  );

  localStorage.removeItem(
    "usus_token_type",
  );

  localStorage.removeItem(
    "usus_token_expires_in",
  );

  window.dispatchEvent(
    new Event(
      "usus-auth-change",
    ),
  );
}


/**
 * Get the current access token.
 */
export function getAccessToken() {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  return localStorage.getItem(
    "usus_access_token",
  );
}


/**
 * Decode the JWT payload.
 *
 * This does NOT verify the JWT.
 * The backend remains responsible for
 * authentication and authorization.
 */
function decodeJwtPayload(
  token: string,
): Record<string, unknown> | null {
  try {
    const payload =
      token.split(".")[1];

    if (!payload) {
      return null;
    }

    const base64 =
      payload
        .replace(/-/g, "+")
        .replace(/_/g, "/");

    const padded =
      base64 +
      "=".repeat(
        (4 - (base64.length % 4)) % 4,
      );

    const decoded =
      atob(padded);

    return JSON.parse(
      decoded,
    ) as Record<
      string,
      unknown
    >;
  } catch {
    return null;
  }
}


/**
 * Get the authenticated user
 * from the currently stored JWT.
 */
export function getAuthenticatedUser():
  | AuthUser
  | null {
  const token =
    getAccessToken();

  if (!token) {
    return null;
  }

  const payload =
    decodeJwtPayload(token);

  if (!payload) {
    return null;
  }

  if (
    typeof payload.user_id !==
    "string"
  ) {
    return null;
  }

  if (
    typeof payload.email !==
    "string"
  ) {
    return null;
  }

  if (
    typeof payload.role !==
    "string"
  ) {
    return null;
  }

  return {
    id: payload.user_id,
    email: payload.email,
    role: payload.role as AuthUser["role"],
  };
};