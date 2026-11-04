"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";

import { UsusLogo } from "@/components/brand/usus-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { NotificationBell } from "@/components/notifications/notification-bell";

import { useAuth } from "@/components/auth/auth-provider";
import { useStaffArea } from "@/hooks/use-staff-area";

interface CompanyAdminHeaderProps {
  onMenuClick?: () => void;
}

export function CompanyAdminHeader({
  onMenuClick,
}: CompanyAdminHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const area = useStaffArea();

  const displayEmail = user?.email ?? user?.user_id ?? "Loading...";

  const displayRole = area.isManager
    ? "Manager"
    : "Company Admin";

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <header
      className="
        fixed inset-x-0 top-0 z-50
        h-[72px] border-b
        border-[var(--usus-header-border)]
        bg-[var(--usus-header)]
        transition-colors duration-200
        md:h-[90px]
      "
    >
      <div className="flex h-full items-center justify-between px-3 sm:px-6 lg:px-8">

        {/* LOGO */}
        <div className="flex shrink-0 items-center">
          <UsusLogo />
        </div>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* NOTIFICATIONS */}
          <NotificationBell />

          {/* THEME TOGGLE */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {/* MOBILE MENU */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            aria-expanded={undefined}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl text-[var(--usus-text-muted)]
              transition-colors duration-200
              hover:bg-[var(--usus-sidebar-hover)]
              hover:text-[var(--usus-text)]
              focus:outline-none focus:ring-2
              focus:ring-[var(--usus-primary)]
              md:hidden
            "
          >
            <Menu size={23} strokeWidth={1.9} />
          </button>

          {/* DESKTOP USER INFORMATION AND LOGOUT */}
          <div className="hidden items-center gap-3 md:flex">

            {/* EMAIL AND ROLE */}
            <div className="max-w-[200px] text-right">
              <p className="truncate text-xs font-semibold text-[var(--usus-text)]">
                {displayEmail}
              </p>

              <p className="mt-1 text-[10px] text-[var(--usus-text-muted)]">
                {displayRole}
              </p>
            </div>

            {/* LOGOUT BESIDE EMAIL */}
            <button
              type="button"
              onClick={handleLogout}
              className="
                flex shrink-0 items-center gap-2
                rounded-xl border
                border-[var(--usus-border)]
                bg-[var(--usus-surface)]
                px-3 py-2.5
                text-xs font-medium
                text-[var(--usus-danger)]
                transition-all duration-200
                hover:border-[var(--usus-danger)]
                hover:bg-[var(--usus-sidebar-hover)]
                focus:outline-none focus:ring-2
                focus:ring-[var(--usus-primary)]
              "
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}