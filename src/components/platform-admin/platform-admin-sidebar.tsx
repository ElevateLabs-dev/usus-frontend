"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { RoleNavigation } from "@/components/navigation/role-navigation";
import { useAuth } from "@/components/auth/auth-provider";

interface PlatformAdminSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function PlatformAdminSidebar({
  open = false,
  onClose,
}: PlatformAdminSidebarProps) {
  const router = useRouter();
  const { logout } = useAuth();

  function handleLogout() {
    onClose?.();
    logout();
    router.replace("/login");
  }

  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[55] bg-black/40 transition-opacity duration-200 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`
          fixed left-0 top-[72px] z-[60] flex h-[calc(100vh-72px)] w-[280px]
          flex-col border-r border-[var(--usus-border)]
          bg-[var(--usus-header)] shadow-2xl
          transition-transform duration-200 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:top-[90px] md:z-40 md:h-[calc(100vh-90px)] md:w-64
          md:translate-x-0 md:shadow-none
        `}
      >
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4">
          <RoleNavigation onNavigate={onClose} />
        </div>

        {/* Bottom section */}
        <div className="border-t border-[var(--usus-border)] p-4">
          <p className="text-xs font-medium text-[var(--usus-text)]">
            Platform Admin
          </p>

          <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
            USUS Platform
          </p>

          {/* Mobile logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="
              mt-4 flex w-full items-center gap-3 rounded-xl
              px-4 py-3 text-sm font-medium
              text-[var(--usus-danger)]
              transition-colors
              hover:bg-[var(--usus-sidebar-hover)]
              md:hidden
            "
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}