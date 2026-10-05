"use client";

import { PlatformAdminHeader } from "@/components/platform-admin/platform-admin-header";
import { PlatformAdminSidebar } from "@/components/platform-admin/platform-admin-sidebar";
import { RoleGuard } from "@/components/auth/role-guard";

export default function PlatformAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["platform_admin"]}>
      <div className="min-h-screen bg-[var(--usus-background)] text-[var(--usus-text)]">
        <PlatformAdminSidebar />

        <div className="min-h-screen md:ml-64">
          <PlatformAdminHeader />

          <main className="min-h-screen pt-[72px]">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
};