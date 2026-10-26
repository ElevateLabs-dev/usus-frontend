import { logout } from "@/services/auth-service";

const API_URL = "/api/backend";

/** An API error with the HTTP status, so pages can tell e.g. 404 apart. */
export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * A readable message for errors that have no
 * JSON detail (timeouts, crashes, the free
 * server waking up).
 */
function fallbackMessage(status: number) {
  if (status === 502 || status === 503 || status === 504) {
    return "The server took too long to respond. Refresh the page to check whether your change was saved before trying again.";
  }

  if (status >= 500) {
    return "Something went wrong on the server. Refresh the page to check whether your change was saved before trying again.";
  }

  return "Something went wrong.";
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("usus_access_token")
      : null;

  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`,
    );
  }

  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers,
    },
  );

  /*
   * No valid sign-in (expired, deactivated, or
   * signed out in another tab): start again.
   */
  if (response.status === 401) {
    logout();
    window.location.replace("/login");

    throw new ApiError(
      "Your session has ended. Please sign in again.",
      401,
    );
  }

  if (!response.ok) {
    let errorMessage = fallbackMessage(
      response.status,
    );

    try {
      const errorData =
        await response.json();

      if (
        typeof errorData?.detail ===
        "string"
      ) {
        errorMessage =
          errorData.detail;
      } else if (
        Array.isArray(errorData?.detail)
      ) {
        errorMessage =
          errorData.detail
            .map(
              (error: {
                msg?: string;
              }) =>
                error.msg ||
                "Validation error",
            )
            .join(", ");
      }
    } catch {
      // Ignore JSON parsing errors.
    }

    throw new ApiError(
      errorMessage,
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};