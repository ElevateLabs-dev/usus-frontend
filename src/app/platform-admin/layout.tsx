"use client";

import { useState } from "react";

import { PlatformAdminHeader } from "@/components/platform-admin/platform-admin-header";
import { PlatformAdminSidebar } from "@/components/platform-admin/platform-admin-sidebar";
import { RoleGuard } from "@/components/auth/role-guard";

export default function PlatformAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoleGuard allowedRoles={["platform_admin"]}>
      <div className="min-h-screen bg-[var(--usus-background)] text-[var(--usus-text)]">
        {/* Sidebar */}
        <PlatformAdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="min-h-screen md:ml-64">
          {/* Header */}
          <PlatformAdminHeader
            onMenuClick={() => setSidebarOpen((prev) => !prev)}
          />

          {/* Main content */}
          <main className="min-h-screen pt-[72px] md:pt-[90px]">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}