"use client";

import { useState } from "react";

import { TraineeHeader } from "@/components/trainee/trainee-header";
import { TraineeSidebar } from "@/components/trainee/trainee-sidebar";
import { RoleGuard } from "@/components/auth/role-guard";

export default function TraineeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoleGuard
      allowedRoles={["trainee", "platform_admin"]}
    >
      <div className="min-h-screen overflow-x-hidden bg-[var(--usus-background)] text-[var(--usus-text)]">
        <TraineeHeader
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="pt-[72px] md:pt-[90px]">
          <TraineeSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <main className="min-w-0 overflow-x-hidden pt-4 md:ml-64 md:pt-6">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
};