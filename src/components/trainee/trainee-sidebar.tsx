"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, History, LayoutDashboard, Sparkles, X } from "lucide-react";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Learning Path", href: "/learning-path", icon: BookOpen },
  { label: "Scenarios", href: "/scenarios", icon: Sparkles },
  { label: "History", href: "/history", icon: History },
];

interface TraineeSidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export function TraineeSidebar({ open = false, onClose }: TraineeSidebarProps) {
  const pathname = usePathname();

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
          fixed left-0 top-[72px] z-[60] h-[calc(100vh-72px)] w-[280px]
          shrink-0 border-r border-[var(--usus-border)] bg-[var(--usus-sidebar)]
          shadow-2xl transition-transform duration-200 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:top-[90px] md:z-40 md:h-[calc(100vh-90px)] md:w-64
          md:translate-x-0 md:border-r md:shadow-none
        `}
      >
        <div className="flex h-full flex-col">
          {/* Mobile drawer header */}
          <div className="flex items-center justify-between border-b border-[var(--usus-border)] px-5 py-4 md:hidden">
            <div>
              <p className="text-sm font-semibold text-[var(--usus-text)]">Navigation</p>
              <p className="mt-0.5 text-xs text-[var(--usus-text-muted)]">USUS Training Platform</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--usus-text-muted)] transition-colors hover:bg-[var(--usus-sidebar-hover)] hover:text-[var(--usus-text)] focus:outline-none focus:ring-2 focus:ring-[var(--usus-primary)]"
            >
              <X size={19} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={[
                    "flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[var(--usus-primary)] text-black"
                      : "text-[var(--usus-text-secondary)] hover:bg-[var(--usus-surface-hover)] hover:text-[var(--usus-text)]",
                  ].join(" ")}
                >
                  <Icon size={19} strokeWidth={1.8} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[var(--usus-border)] p-4">
            <p className="text-xs text-[var(--usus-text-muted)]">USUS Training Platform</p>
          </div>
        </div>
      </aside>
    </>
  );
}
