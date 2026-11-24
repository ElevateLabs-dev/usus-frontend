"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";

export type SetupTaskId =
  | "subscription"
  | "knowledge"
  | "settings"
  | "team";

interface OrganisationSetupChecklistProps {
  subscriptionHref: string;
  knowledgeBaseHref: string;
  settingsHref: string;
  teamHref: string;

  // Progress received from the backend.
  completedItems?: SetupTaskId[];

  // Backend update handler.
  onToggleComplete?: (
    taskId: SetupTaskId,
    completed: boolean
  ) => Promise<void>;

  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const setupItems: {
  id: SetupTaskId;
  title: string;
  description: string;
  action: string;
}[] = [
  {
    id: "subscription",
    title: "Choose a Subscription Plan",
    description: "Select a plan for your organisation.",
    action: "Choose plan",
  },
  {
    id: "knowledge",
    title: "Upload Knowledge Base",
    description: "Add your company documents and policies.",
    action: "Upload files",
  },
  {
    id: "settings",
    title: "Set Up Company Account",
    description: "Complete your organisation details.",
    action: "Set up",
  },
  {
    id: "team",
    title: "Add Your Team",
    description: "Invite managers and trainees.",
    action: "Add members",
  },
];

export function OrganisationSetupChecklist({
  subscriptionHref,
  knowledgeBaseHref,
  settingsHref,
  teamHref,
  completedItems = [],
  onToggleComplete,
  isLoading = false,
  error = null,
  onRetry,
}: OrganisationSetupChecklistProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<
    SetupTaskId[]
  >([]);
  const [actionError, setActionError] = useState<string | null>(
    null
  );

  const destinations: Record<SetupTaskId, string> = {
    subscription: subscriptionHref,
    knowledge: knowledgeBaseHref,
    settings: settingsHref,
    team: teamHref,
  };

  // Only count valid, unique completed tasks.
  const validCompletedItems = Array.from(
    new Set(
      completedItems.filter((id) =>
        setupItems.some((item) => item.id === id)
      )
    )
  );

  const completedCount = validCompletedItems.length;

  const progress = Math.round(
    (completedCount / setupItems.length) * 100
  );

  async function handleToggleComplete(taskId: SetupTaskId) {
    if (!onToggleComplete || updatingItems.includes(taskId)) {
      return;
    }

    const currentlyCompleted =
      validCompletedItems.includes(taskId);

    setActionError(null);

    setUpdatingItems((previous) => [...previous, taskId]);

    try {
      await onToggleComplete(
        taskId,
        !currentlyCompleted
      );
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : "Unable to update setup progress."
      );
    } finally {
      setUpdatingItems((previous) =>
        previous.filter((id) => id !== taskId)
      );
    }
  }

  return (
    <>
      {/* BACKDROP */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close setup panel"
          onClick={() => setIsOpen(false)}
          className="
            fixed inset-0 z-[80]
            cursor-default
            bg-black/30
            backdrop-blur-[2px]
          "
        />
      )}

      {/* FLOATING CIRCULAR REMINDER */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open organisation setup checklist"
          className="
            fixed right-6 top-[110px] z-[90]
            flex h-16 w-16
            items-center justify-center
            rounded-full
            border border-[var(--usus-border)]
            bg-[var(--usus-surface)]
            text-[var(--usus-text)]
            shadow-xl
            transition-transform duration-200
            hover:scale-105
            usus-reminder-breathe
            md:right-8
          "
        >
          <span
            className="
              relative flex h-11 w-11
              items-center justify-center
              rounded-full
              bg-[var(--usus-primary-soft)]
            "
          >
            <span className="text-sm font-bold text-[var(--usus-primary)]">
              {isLoading ? "..." : `${progress}%`}
            </span>

            {!isLoading && progress < 100 && (
              <span
                className="
                  absolute -right-1 -top-1
                  h-3 w-3 rounded-full
                  border-2 border-[var(--usus-surface)]
                  bg-[var(--usus-primary)]
                "
              />
            )}
          </span>
        </button>
      )}

      {/* SLIDE-OUT PANEL */}
      <aside
  aria-label="Organisation setup checklist"
  aria-hidden={!isOpen}
  className={`
    fixed inset-y-0 right-0 z-[100]
    flex w-[min(100vw,380px)] flex-col
    border-l border-[var(--usus-border)]
    bg-[var(--usus-surface)]
    shadow-2xl
    transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "translate-x-[calc(100%+2px)]"}
    ${!isOpen ? "pointer-events-none" : ""}
  `}
>
        {/* HEADER */}
        <div className="flex items-start justify-between border-b border-[var(--usus-border)] p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--usus-primary)]">
              Organisation setup
            </p>

            <h2 className="mt-2 text-xl font-bold text-[var(--usus-text)]">
              Getting started
            </h2>

            <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
              Complete these steps to get your organisation ready.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close setup panel"
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              text-[var(--usus-text-muted)]
              transition-colors
              hover:bg-[var(--usus-surface-soft)]
              hover:text-[var(--usus-text)]
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* PROGRESS */}
        <div className="border-b border-[var(--usus-border-soft)] p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-[var(--usus-text)]">
              Setup progress
            </span>

            <span className="text-sm font-bold text-[var(--usus-primary)]">
              {isLoading ? "Loading..." : `${progress}%`}
            </span>
          </div>

          <div
            className="h-2 w-full overflow-hidden rounded-full bg-[var(--usus-muted)]"
            role="progressbar"
            aria-label="Organisation setup progress"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-[var(--usus-primary)] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="mt-3 text-xs text-[var(--usus-text-muted)]">
            {isLoading
              ? "Retrieving organisation progress..."
              : `${completedCount} of ${setupItems.length} steps completed`}
          </p>
        </div>

        {/* CHECKLIST */}
        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-[var(--usus-text-muted)]">
              <Loader2 size={17} className="animate-spin" />
              Loading setup progress...
            </div>
          )}

          {!isLoading && error && (
            <div className="border border-[var(--usus-danger)]/30 p-4">
              <div className="flex items-start gap-2">
                <AlertCircle
                  size={17}
                  className="mt-0.5 shrink-0 text-[var(--usus-danger)]"
                />

                <div>
                  <p className="text-sm font-semibold text-[var(--usus-text)]">
                    Unable to load progress
                  </p>

                  <p className="mt-1 text-xs text-[var(--usus-text-muted)]">
                    {error}
                  </p>

                  {onRetry && (
                    <button
                      type="button"
                      onClick={onRetry}
                      className="mt-3 text-xs font-semibold text-[var(--usus-primary)] hover:underline"
                    >
                      Try again
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {!isLoading &&
            !error &&
            setupItems.map((item) => {
              const isCompleted =
                validCompletedItems.includes(item.id);

              const isUpdating =
                updatingItems.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`
                    border p-4 transition-colors
                    ${
                      isCompleted
                        ? "border-[var(--usus-primary)] bg-[var(--usus-primary-soft)]"
                        : "border-[var(--usus-border-soft)] bg-[var(--usus-surface-soft)]"
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    {/* COMPLETION CONTROL */}
                    <button
                      type="button"
                      disabled={!onToggleComplete || isUpdating}
                      onClick={() => handleToggleComplete(item.id)}
                      aria-label={
                        isCompleted
                          ? `Mark ${item.title} as incomplete`
                          : `Mark ${item.title} as complete`
                      }
                      aria-pressed={isCompleted}
                      className={`
                        mt-0.5 flex h-5 w-5 shrink-0
                        items-center justify-center
                        border transition-colors
                        ${
                          isCompleted
                            ? "border-[var(--usus-primary)] bg-[var(--usus-primary)] text-black"
                            : "border-[var(--usus-border)] bg-[var(--usus-surface)]"
                        }
                        ${!onToggleComplete ? "cursor-not-allowed opacity-60" : ""}
                      `}
                    >
                      {isUpdating ? (
                        <Loader2
                          size={12}
                          className="animate-spin"
                        />
                      ) : isCompleted ? (
                        <Check size={13} strokeWidth={3} />
                      ) : null}
                    </button>

                    {/* TASK DETAILS */}
                    <div className="min-w-0 flex-1">
                      <p
                        className={`
                          text-sm font-semibold
                          ${
                            isCompleted
                              ? "text-[var(--usus-text-muted)] line-through"
                              : "text-[var(--usus-text)]"
                          }
                        `}
                      >
                        {item.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-[var(--usus-text-muted)]">
                        {item.description}
                      </p>

                      <Link
                        href={destinations[item.id]}
                        onClick={() => setIsOpen(false)}
                        className="
                          mt-3 inline-flex items-center gap-1
                          text-xs font-semibold
                          text-[var(--usus-primary)]
                          hover:underline
                        "
                      >
                        {isCompleted ? "View details" : item.action}
                        <ChevronRight size={14} />
                      </Link>
                    </div>

                    {isCompleted && (
                      <span className="shrink-0 text-[10px] font-semibold text-[var(--usus-primary)]">
                        DONE
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

          {actionError && (
            <p
              role="alert"
              className="border border-[var(--usus-danger)]/30 p-3 text-xs text-[var(--usus-danger)]"
            >
              {actionError}
            </p>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-[var(--usus-border)] p-5">
          {progress === 100 && !isLoading && !error ? (
            <div className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--usus-primary-soft)] text-[var(--usus-primary)]">
                <Check size={20} />
              </div>

              <p className="mt-3 text-sm font-semibold text-[var(--usus-text)]">
                Organisation setup complete!
              </p>
            </div>
          ) : (
            <p className="text-xs leading-5 text-[var(--usus-text-muted)]">
              Complete each step to finish setting up your organisation.
            </p>
          )}
        </div>
      </aside>
    </>
  );
}