"use client";

import Link from "next/link";

import {
  ArrowRight,
  BookOpen,
  History,
  Play,
} from "lucide-react";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: "play" | "book" | "history";
  href: string;
}

const actions: QuickAction[] = [
  {
    id: "continue",
    title: "Continue training",
    description: "Resume your current scenario",
    icon: "play",
    href: "/scenarios",
  },
  {
    id: "browse",
    title: "Browse scenarios",
    description: "Find a new situation to practice",
    icon: "book",
    href: "/scenarios",
  },
  {
    id: "history",
    title: "View history",
    description: "Review your previous sessions",
    icon: "history",
    href: "/history",
  },
];

function ActionIcon({
  type,
}: {
  type: QuickAction["icon"];
}) {
  if (type === "play") {
    return <Play size={18} />;
  }

  if (type === "book") {
    return <BookOpen size={18} />;
  }

  return <History size={18} />;
}

export function QuickActions() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[var(--usus-text)]">
          Quick actions
        </h2>
      </div>

      <div className="space-y-3">
        {actions.map((action) => (
          <Link
            key={action.id}
            href={action.href}
            className="
              group
              flex
              w-full
              cursor-pointer
              items-center
              gap-4
              rounded-[var(--usus-radius)]
              border
              border-[var(--usus-border)]
              bg-[var(--usus-surface)]
              p-4
              text-left
              shadow-[var(--usus-shadow)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:border-[var(--usus-primary)]
              hover:bg-[var(--usus-sidebar-hover)]
              hover:shadow-lg
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--usus-primary)]
              focus:ring-offset-2
              focus:ring-offset-[var(--usus-background)]
            "
          >
            <span
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[var(--usus-muted)]
                text-[var(--usus-text)]
                transition-colors
                duration-200
                group-hover:bg-[var(--usus-primary-soft)]
                group-hover:text-[var(--usus-text)]
              "
            >
              <ActionIcon type={action.icon} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-[var(--usus-text)]">
                {action.title}
              </span>

              <span className="mt-1 block text-xs text-[var(--usus-text-muted)]">
                {action.description}
              </span>
            </span>

            <ArrowRight
              size={18}
              className="
                shrink-0
                text-[var(--usus-text-muted)]
                transition-all
                duration-200
                group-hover:translate-x-1
                group-hover:text-[var(--usus-primary)]
              "
            />
          </Link>
        ))}
      </div>
    </section>
  );
};