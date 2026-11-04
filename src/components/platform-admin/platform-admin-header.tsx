"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";

import { UsusLogo } from "@/components/brand/usus-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { useAuth } from "@/components/auth/auth-provider";

interface PlatformAdminHeaderProps {
  onMenuClick?: () => void;
}

export function PlatformAdminHeader({
  onMenuClick,
}: PlatformAdminHeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const displayEmail = user?.email ?? user?.user_id ?? "Loading...";

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[72px] border-b border-[var(--usus-border)] bg-[var(--usus-header)] md:h-[90px]">
      <div className="flex h-full items-center justify-between px-3 sm:px-6 lg:px-8">
        <UsusLogo />

        <div className="flex items-center gap-3 sm:gap-5">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--usus-text-muted)] hover:bg-[var(--usus-sidebar-hover)] md:hidden"
          >
            <Menu size={23} />
          </button>

          {/* Desktop user information */}
          <div className="hidden items-center gap-3 md:flex">
            <div className="text-right">
              <p className="max-w-[190px] truncate text-xs font-semibold text-[var(--usus-text)]">
                {displayEmail}
              </p>
              <p className="text-[10px] text-[var(--usus-text-muted)]">
                Platform Admin
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-[var(--usus-border)] bg-[var(--usus-surface)] px-3 py-2 text-xs font-medium text-[var(--usus-danger)] hover:bg-[var(--usus-sidebar-hover)]"
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