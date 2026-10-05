"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { RoleGuard } from "@/components/auth/role-guard";

export default function ManagerPage() {
  const { user } = useAuth();

  return (
    <RoleGuard allowedRoles={["manager"]}>
      <main className="min-h-screen bg-[var(--usus-background)] p-8 text-[var(--usus-text)]">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-[var(--usus-muted)]">
            USUS
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Manager Dashboard
          </h1>

          <p className="mt-2 text-sm text-[var(--usus-muted)]">
            Monitor your team, training progress, and
            employee performance.
          </p>

          <div className="mt-8 rounded-xl border border-[var(--usus-border)] bg-[var(--usus-card)] p-6">
            <p className="text-sm">
              Role:{" "}
              <span className="font-medium">
                {user?.role}
              </span>
            </p>
          </div>
        </div>
      </main>
    </RoleGuard>
  );
}