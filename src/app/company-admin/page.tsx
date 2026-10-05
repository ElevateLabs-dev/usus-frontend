"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { RoleGuard } from "@/components/auth/role-guard";

export default function CompanyAdminPage() {
  const { user } = useAuth();

  return (
    <RoleGuard allowedRoles={["company_admin"]}>
      <main className="min-h-screen bg-[var(--usus-background)] p-8 text-[var(--usus-text)]">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-sm text-[var(--usus-muted)]">
              USUS
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              Company Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-[var(--usus-muted)]">
              Manage your organisation, users, training,
              and company performance.
            </p>
          </div>

          <div className="rounded-xl border border-[var(--usus-border)] bg-[var(--usus-card)] p-6">
            <p className="text-sm">
              Role:{" "}
              <span className="font-medium">
                {user?.role}
              </span>
            </p>

            <p className="mt-2 text-xs text-[var(--usus-muted)]">
              Company administrators can manage their
              organisation and its users.
            </p>
          </div>
        </div>
      </main>
    </RoleGuard>
  );
}