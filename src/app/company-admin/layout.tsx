"use client";

import { useState } from "react";

import { CompanyAdminHeader } from "@/components/company-admin/company-admin-header";
import { CompanyAdminSidebar } from "@/components/company-admin/company-admin-sidebar";
import { OrganisationSetupChecklist } from "@/components/company-admin/organisation-setup-checklist";

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

        {/* MAIN NAVIGATION */}
        <CompanyAdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* MAIN AREA */}
        <div className="min-h-screen md:ml-64">

          {/* HEADER */}
          <CompanyAdminHeader
            onMenuClick={() => setSidebarOpen((previous) => !previous)}
          />

          {/* PAGE CONTENT */}
          <main className="min-h-screen pt-[72px] md:pt-[90px]">
            <div className="mx-auto w-full max-w-[1800px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              {children}
            </div>
          </main>
        </div>

        {/* FLOATING ORGANISATION SETUP CHECKLIST */}
        <OrganisationSetupChecklist
          subscriptionHref="/company-admin/subscription"
          knowledgeBaseHref="/company-admin/knowledge-base"
          settingsHref="/company-admin/settings"
          teamHref="/company-admin/managers"
        />

      </div>
    </RoleGuard>
  );
}