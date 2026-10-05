"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { roleNavigation } from "@/config/role-navigation";

export function RoleNavigation() {
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
          (item.href !== "/platform-admin" &&
            pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "block rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
              active
                ? "bg-[var(--usus-sidebar-active)] text-[var(--usus-text)]"
                : "text-[var(--usus-text-muted)] hover:bg-[var(--usus-sidebar-hover)] hover:text-[var(--usus-text)]",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};