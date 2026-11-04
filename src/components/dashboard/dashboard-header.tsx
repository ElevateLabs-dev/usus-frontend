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
  const initial = name?.charAt(0).toUpperCase() || "U";

  return (
    <header
      className="
        sticky
        top-0
        z-40
        h-16
        sm:h-18
        lg:h-20
        border-b
        border-[var(--usus-header-border)]
        bg-[var(--usus-header)]
        transition-colors
        duration-200
      "
    >
      <div
        className="
          flex
          h-full
          w-full
          items-center
          justify-between
          gap-2
          px-3
          sm:px-5
          lg:px-8
        "
      >
        
        {/* Logo */}
<div className="flex min-w-0 items-center">
  <UsusLogo />
</div>

        {/* Right controls */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2 lg:gap-3">

          {/* Notifications */}
          <button
            type="button"
            aria-label="Notifications"
            className="
              flex
              h-9
              w-9
              sm:h-10
              sm:w-10
              shrink-0
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

          {/* User profile */}
          <button
            type="button"
            aria-label="User profile"
            className="
              flex
              shrink-0
              items-center
              gap-2
              rounded-xl
              px-1.5
              py-1.5
              sm:px-2
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
                h-9
                w-9
                sm:h-10
                sm:w-10
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

            {/* Name hidden on mobile */}
            <div className="hidden text-left md:block max-w-[140px]">
              <p className="truncate text-sm font-semibold text-[var(--usus-text)]">
                {name}
              </p>

              <p className="text-xs text-[var(--usus-text-muted)]">
                Trainee
              </p>
            </div>
          </button>

          {/* Theme toggle */}
          <div className="shrink-0">
            <ThemeToggle />
          </div>

        </div>
      </div>
    </header>
  );
}