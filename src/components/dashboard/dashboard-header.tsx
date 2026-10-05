"use client";

import { Bell } from "lucide-react";
import { UsusLogo } from "@/components/brand/usus-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";

interface DashboardHeaderProps {
  name: string;
}

export function DashboardHeader({
  name,
}: DashboardHeaderProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <header
      className="
        h-20
        border-b
        border-[var(--usus-header-border)]
        bg-[var(--usus-header)]
        transition-colors
        duration-200
      "
    >
      <div className="flex h-full items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <div className="flex min-w-0 items-center">
          <UsusLogo size="md" />
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Notification */}
          <button
            type="button"
            aria-label="Notifications"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              text-[var(--usus-text-muted)]
              transition-all
              duration-200
              hover:bg-[var(--usus-sidebar-hover)]
              hover:text-[var(--usus-text)]
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--usus-primary)]
              focus:ring-offset-2
              focus:ring-offset-[var(--usus-header)]
            "
          >
            <Bell size={18} strokeWidth={1.8} />
          </button>

          {/* User */}
          <button
            type="button"
            className="
              flex
              items-center
              gap-3
              rounded-xl
              px-2
              py-1.5
              transition-all
              duration-200
              hover:bg-[var(--usus-sidebar-hover)]
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--usus-primary)]
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[var(--usus-primary)]
                text-sm
                font-bold
                text-black
              "
            >
              {initial}
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold text-[var(--usus-text)]">
                {name}
              </p>

              <p className="text-xs text-[var(--usus-text-muted)]">
                Trainee
              </p>
            </div>
          </button>

          {/* Theme */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};