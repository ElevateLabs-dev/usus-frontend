import type { UserRole } from "@/types/auth";

export interface AuthUser {
  user_id: string;
  role: UserRole;
  tenant_id?: string;
  exp: number;
}

function decodeBase64Url(value: string): string {
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const padded =
    base64 + "=".repeat((4 - (base64.length % 4)) % 4);

  return atob(padded);
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem("usus_access_token");

  if (!token) {
    return null;
  }

  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(
      decodeBase64Url(parts[1]),
    ) as AuthUser;

    if (!payload.user_id || !payload.role || !payload.exp) {
      return null;
    }

    if (payload.exp * 1000 <= Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getAuthUser() !== null;
}

export function getUserRole(): UserRole | null {
  return getAuthUser()?.role ?? null;
}

export function getTenantId(): string | null {
  return getAuthUser()?.tenant_id ?? null;
};