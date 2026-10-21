"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useStaffArea } from "@/hooks/use-staff-area";

export function CompanyAdminHeader() {
  const { user, logout } = useAuth();
  const area = useStaffArea();

  return (
    <header className="fixed left-64 right-0 top-0 z-30 hidden h-[72px] border-b border-[var(--usus-header-border)] bg-[var(--usus-header)] md:flex md:items-center md:justify-between">
      {/* Left */}
      <div className="px-6">
        <p className="text-xs text-[var(--usus-text-muted)]">
          {area.isManager
            ? "Team Management"
            : "Company Administration"}
        </p>

        <h2 className="text-sm font-semibold text-[var(--usus-text)]">
          {area.isManager
            ? "Manager Dashboard"
            : "Company Dashboard"}
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 px-6">
        <ThemeToggle />

        <div className="h-7 w-px bg-[var(--usus-border)]" />

        <div className="text-right">
          <p className="text-xs font-medium text-[var(--usus-text)]">
            {area.isManager ? "Manager" : "Company Admin"}
          </p>

          <p className="max-w-[180px] truncate text-[10px] text-[var(--usus-text-muted)]">
            {user?.email ?? user?.user_id}
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-[var(--usus-border)] bg-[var(--usus-surface)] px-3 py-2 text-xs font-medium text-[var(--usus-text)] transition-colors hover:border-[var(--usus-primary)] hover:bg-[var(--usus-sidebar-hover)] hover:text-[var(--usus-primary)]"
        >
          Sign out
        </button>
      </div>
    </header>
  );
};