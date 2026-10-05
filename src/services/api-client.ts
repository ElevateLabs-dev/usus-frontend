const API_URL = "/api/backend";

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

  if (!response.ok) {
    let errorMessage =
      "Something went wrong.";

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

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};