import type { UserRole } from "@/types/auth";

export function getRoleHome(role: UserRole): string {
  switch (role) {
    case "platform_admin":
      return "/platform-admin";

    case "company_admin":
      return "/company-admin";

    case "manager":
      return "/manager";

    case "trainee":
      return "/dashboard";

    default:
      return "/login";
  }
};