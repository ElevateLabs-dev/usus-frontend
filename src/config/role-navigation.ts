import type { UserRole } from "@/types/auth";

export interface NavigationItem {
  label: string;
  href: string;
}

export const roleNavigation: Record<
  UserRole,
  NavigationItem[]
> = {
  platform_admin: [
    {
      label: "Dashboard",
      href: "/platform-admin",
    },
    {
      label: "Organisations",
      href: "/platform-admin/organisations",
    },
    {
      label: "Company Accounts",
      href: "/platform-admin/company-accounts",
    },
    {
      label: "Platform Users",
      href: "/platform-admin/users",
    },
    {
      label: "Monitoring",
      href: "/platform-admin/monitoring",
    },
    {
      label: "Settings",
      href: "/platform-admin/settings",
    },
  ],

  company_admin: [
    {
      label: "Dashboard",
      href: "/company-admin",
    },
    {
      label: "Users",
      href: "/company-admin/users",
    },
    {
      label: "Managers",
      href: "/company-admin/managers",
    },
    {
      label: "Trainees",
      href: "/company-admin/trainees",
    },
    {
      label: "Training",
      href: "/company-admin/training",
    },
    {
      label: "Performance",
      href: "/company-admin/performance",
    },
    {
      label: "Settings",
      href: "/company-admin/settings",
    },
  ],

  manager: [
    {
      label: "Dashboard",
      href: "/manager",
    },
    {
      label: "My Team",
      href: "/manager/team",
    },
    {
      label: "Training",
      href: "/manager/training",
    },
    {
      label: "Performance",
      href: "/manager/performance",
    },
  ],

  trainee: [
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Scenarios",
      href: "/scenarios",
    },
    {
      label: "Learning Path",
      href: "/learning-path",
    },
    {
      label: "History",
      href: "/history",
    },
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Settings",
      href: "/settings",
    },
  ],
};