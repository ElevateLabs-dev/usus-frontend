"use client";

import { useAuth } from "@/components/auth/auth-provider";

export function AuthDebug() {
  const {
    user,
    isAuthenticated,
    loading,
  } = useAuth();

  if (loading) {
    return <p>Loading authentication...</p>;
  }

  return (
    <div className="space-y-2 text-sm">
      <p>
        Authenticated:{" "}
        {isAuthenticated ? "Yes" : "No"}
      </p>

      <p>
        User ID: {user?.user_id ?? "None"}
      </p>

      <p>
        Role: {user?.role ?? "None"}
      </p>

      <p>
        Tenant ID: {user?.tenant_id ?? "None"}
      </p>

      <p>
        Token expiry:{" "}
        {user?.exp
          ? new Date(
              user.exp * 1000,
            ).toLocaleString()
          : "None"}
      </p>
    </div>
  );
};
