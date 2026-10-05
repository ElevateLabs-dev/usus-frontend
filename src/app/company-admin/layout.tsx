"use client";

import { CompanyAdminHeader } from "@/components/company-admin/company-admin-header";
import { CompanyAdminSidebar } from "@/components/company-admin/company-admin-sidebar";
import { RoleGuard } from "@/components/auth/role-guard";

export default function CompanyAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["company_admin"]}>
      <div className="min-h-screen bg-[var(--usus-background)] text-[var(--usus-text)]">
        <CompanyAdminSidebar />

        <div className="min-h-screen md:ml-64">
          <CompanyAdminHeader />

          <main className="min-h-screen pt-[72px]">
            {children}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
};