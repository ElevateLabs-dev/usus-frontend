"use client";

import Link from "next/link";

import { RoleNavigation } from "@/components/navigation/role-navigation";

export function CompanyAdminSidebar() {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-[var(--usus-header-border)] bg-[var(--usus-sidebar)] md:flex">
      {/* Brand */}
      <div className="flex h-[72px] flex-col justify-center border-b border-[var(--usus-header-border)] px-6">
        <Link
          href="/company-admin"
          className="text-xl font-semibold tracking-tight text-[var(--usus-text)] transition-colors hover:text-[var(--usus-primary)]"
        >
          USUS
        </Link>

        <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
          Company Administration
        </p>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--usus-text-muted)]">
          Organisation
        </p>

        <RoleNavigation />
      </div>

      {/* Bottom */}
      <div className="border-t border-[var(--usus-header-border)] px-4 py-4">
        <p className="px-3 text-[10px] font-medium text-[var(--usus-text-muted)]">
          Company Admin
        </p>

        <p className="mt-1 px-3 text-[10px] text-[var(--usus-text-muted)]">
          Organisation Management
        </p>
      </div>
    </aside>
  );
};