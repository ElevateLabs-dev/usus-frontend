"use client";

import { useState } from "react";

import { CompanyAdminHeader } from "@/components/company-admin/company-admin-header";
import { CompanyAdminSidebar } from "@/components/company-admin/company-admin-sidebar";
import { RoleGuard } from "@/components/auth/role-guard";

export default function CompanyAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoleGuard allowedRoles={["company_admin"]}>
      <div className="min-h-screen bg-[var(--usus-background)] text-[var(--usus-text)]">

        {/* Sidebar */}
        <CompanyAdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="min-h-screen md:ml-64">

          {/* Header */}
          <CompanyAdminHeader
            onMenuClick={() => setSidebarOpen((prev) => !prev)}
          />

          {/* Page content */}
          <main className="min-h-screen pt-[72px] md:pt-[90px]">
            {children}
          </main>

        </div>
      </div>
    </RoleGuard>
  );
}