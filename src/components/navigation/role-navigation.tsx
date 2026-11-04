"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { roleNavigation } from "@/config/role-navigation";

interface RoleNavigationProps {
  onNavigate?: () => void;
}

const DASHBOARD_ROUTES = [
  "/platform-admin",
  "/company-admin",
  "/manager",
];

export function RoleNavigation({
  onNavigate,
}: RoleNavigationProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const items = roleNavigation[user.role];

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (!DASHBOARD_ROUTES.includes(item.href) &&
            pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={[
              "flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
              active
                ? "bg-[var(--usus-primary)] text-black"
                : "text-[var(--usus-text-secondary)] hover:bg-[var(--usus-surface-hover)] hover:text-[var(--usus-text)]",
            ].join(" ")}
          >
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}