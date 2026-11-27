"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import {
  AlertCircle,
  Check,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";

import {
  getOnboardingChecklist,
  type OnboardingChecklist,
} from "@/services/onboarding-service";

interface OrganisationSetupChecklistProps {
  subscriptionHref: string;
  knowledgeBaseHref: string;
  settingsHref: string;
  teamHref: string;
}

export function OrganisationSetupChecklist({
  subscriptionHref,
  knowledgeBaseHref,
  settingsHref,
  teamHref,
}: OrganisationSetupChecklistProps) {
  const [checklist, setChecklist] =
    useState<OnboardingChecklist | null>(null);

  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Prevent overlapping API requests.
  const requestInProgress = useRef(false);

  // Prevent state updates after unmount.
  const mounted = useRef(false);

  /*
   * ============================================================
   * CHECKLIST DESTINATIONS
   * ============================================================
   */

  const destinations: Record<string, string> = {
    subscription: subscriptionHref,
    subscription_setup: subscriptionHref,
    billing: subscriptionHref,
    plan: subscriptionHref,

    knowledge_base: knowledgeBaseHref,
    knowledge: knowledgeBaseHref,
    upload_documents: knowledgeBaseHref,
    documents: knowledgeBaseHref,

    team: teamHref,
    managers: teamHref,
    invite_team: teamHref,
    team_management: teamHref,
    invite_managers: teamHref,

    settings: settingsHref,
    company_settings: settingsHref,
    organisation_settings: settingsHref,
    profile: settingsHref,
    company_profile: settingsHref,
  };

  function getDestination(key: string): string {
    const normalisedKey = key.toLowerCase().trim();

    return destinations[normalisedKey] ?? settingsHref;
  }

  /*
   * ============================================================
   * LOAD CHECKLIST
   * ============================================================
   */

  const loadChecklist = useCallback(async () => {
    if (requestInProgress.current) return;

    requestInProgress.current = true;

    try {
      const result = await getOnboardingChecklist();

      if (!mounted.current) return;

      setChecklist(result);
      setError("");
    } catch (err) {
      if (!mounted.current) return;

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your setup checklist.",
      );
    } finally {
      requestInProgress.current = false;

      if (mounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  /*
   * ============================================================
   * INITIAL LOAD AND AUTOMATIC REFRESH
   * ============================================================
   */

 useEffect(() => {
  mounted.current = true;

  // Initial loading state is already true.
  // Deferring via queueMicrotask avoids synchronous setState inside the effect.
  queueMicrotask(() => {
    if (mounted.current) {
      void loadChecklist();
    }
  });

  // Refresh every 30 seconds.
  const interval = window.setInterval(() => {
    if (document.visibilityState === "visible") {
      void loadChecklist();
    }
  }, 30_000);

  // Refresh when the browser tab becomes visible.
  function handleVisibilityChange() {
    if (document.visibilityState === "visible") {
      void loadChecklist();
    }
  }

  // Allow other components to request a refresh.
  function handleChecklistRefresh() {
    void loadChecklist();
  }

  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange,
  );

  window.addEventListener(
    "usus-onboarding-checklist-refresh",
    handleChecklistRefresh,
  );

  return () => {
    mounted.current = false;

    window.clearInterval(interval);

    document.removeEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    window.removeEventListener(
      "usus-onboarding-checklist-refresh",
      handleChecklistRefresh,
    );
  };
}, [loadChecklist]);


  /*
   * ============================================================
   * RETRY
   * ============================================================
   */

  function handleRetry() {
    setError("");
    setIsLoading(true);
    void loadChecklist();
  }

  /*
   * ============================================================
   * CLOSE CHECKLIST
   * ============================================================
   */

  function handleClose() {
    setIsOpen(false);
  }

  /*
   * ============================================================
   * PROGRESS CALCULATION
   * ============================================================
   */

  const completed = checklist?.completed ?? 0;
  const total = checklist?.total ?? 0;

  const progress =
    total > 0
      ? Math.min(100, Math.round((completed / total) * 100))
      : 0;

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <>
      {/* FLOATING CHECKLIST BUTTON */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open organisation setup checklist"
          className="
            fixed right-6 top-[110px] z-[90]
            flex h-14 w-14 items-center justify-center
            rounded-full border border-[var(--usus-border)]
            bg-[var(--usus-surface)]
            shadow-xl transition-colors
            hover:border-[var(--usus-primary)]
          "
        >
          <span
            className="
              relative flex h-11 w-11 items-center justify-center
              rounded-full bg-[var(--usus-primary-soft)]
            "
          >
            <span
              className="
                text-sm font-bold
                text-[var(--usus-primary)]
              "
            >
              {isLoading && !checklist ? "..." : `${progress}%`}
            </span>

            {progress < 100 && (
              <span
                className="
                  absolute -right-1 -top-1 h-3 w-3
                  rounded-full border-2
                  border-[var(--usus-surface)]
                  bg-[var(--usus-primary)]
                "
              />
            )}
          </span>
        </button>
      )}

      {/* CHECKLIST PANEL */}
      <aside
        aria-label="Organisation setup checklist"
        aria-hidden={!isOpen}
        className={`
          fixed bottom-0 right-0 top-0 z-[100]
          flex w-[min(100%,380px)] flex-col
          border-l border-[var(--usus-border)]
          bg-[var(--usus-surface)]
          shadow-2xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div
          className="
            flex items-start justify-between
            border-b border-[var(--usus-border)] p-6
          "
        >
          <div>
            <p
              className="
                text-xs font-semibold uppercase tracking-wider
                text-[var(--usus-primary)]
              "
            >
              Organisation setup
            </p>

            <h2
              className="
                mt-2 text-xl font-bold
                text-[var(--usus-text)]
              "
            >
              Getting started
            </h2>

            <p
              className="
                mt-1 text-sm
                text-[var(--usus-text-muted)]
              "
            >
              Complete these steps to get your organisation ready.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close setup panel"
            className="
              flex h-9 w-9 shrink-0
              items-center justify-center
              text-[var(--usus-text-muted)]
              transition-colors
              hover:text-[var(--usus-text)]
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* PROGRESS */}
        <div className="border-b border-[var(--usus-border-soft)] p-6">
          <div className="mb-3 flex items-center justify-between">
            <span
              className="
                text-sm font-semibold
                text-[var(--usus-text)]
              "
            >
              Setup progress
            </span>

            <span
              className="
                text-sm font-bold
                text-[var(--usus-primary)]
              "
            >
              {progress}%
            </span>
          </div>

          <div
            className="
              h-2 w-full overflow-hidden
              rounded-full bg-[var(--usus-muted)]
            "
            role="progressbar"
            aria-label="Organisation setup progress"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="
                h-full rounded-full
                bg-[var(--usus-primary)]
                transition-all duration-500
              "
              style={{ width: `${progress}%` }}
            />
          </div>

          <p
            className="
              mt-3 text-xs
              text-[var(--usus-text-muted)]
            "
          >
            {completed} of {total} steps completed
          </p>
        </div>

        {/* CHECKLIST ITEMS */}
        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {/* LOADING */}
          {isLoading && !checklist && (
            <div
              className="
                flex items-center justify-center
                gap-2 py-8 text-sm
                text-[var(--usus-text-muted)]
              "
            >
              <Loader2 size={17} className="animate-spin" />
              Loading setup progress...
            </div>
          )}

          {/* ERROR */}
          {!isLoading && error && !checklist && (
            <div
              className="
                border border-[var(--usus-danger)]/30
                bg-[var(--usus-surface-soft)] p-4
              "
            >
              <div className="flex items-start gap-2">
                <AlertCircle
                  size={17}
                  className="
                    mt-0.5 shrink-0
                    text-[var(--usus-danger)]
                  "
                />

                <div>
                  <p
                    className="
                      text-sm font-semibold
                      text-[var(--usus-text)]
                    "
                  >
                    Unable to load checklist
                  </p>

                  <p
                    className="
                      mt-1 text-xs
                      text-[var(--usus-text-muted)]
                    "
                  >
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={handleRetry}
                    className="
                      mt-3 text-xs font-semibold
                      text-[var(--usus-primary)]
                      hover:underline
                    "
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* REFRESH ERROR WITH PREVIOUS DATA */}
          {!isLoading && error && checklist && (
            <div
              className="
                flex items-center gap-2
                rounded-lg border
                border-[var(--usus-danger)]/30
                p-3 text-xs
                text-[var(--usus-danger)]
              "
            >
              <AlertCircle size={15} />

              <span>
                Unable to refresh checklist. Showing previous progress.
              </span>

              <button
                type="button"
                onClick={handleRetry}
                className="ml-auto font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* CHECKLIST */}
          {checklist?.steps.map((step) => (
            <div
              key={step.key}
              className={`
                border p-4 transition-colors
                ${
                  step.done
                    ? "border-[var(--usus-primary)] bg-[var(--usus-primary-soft)]"
                    : "border-[var(--usus-border-soft)] bg-[var(--usus-surface-soft)]"
                }
              `}
            >
              <div className="flex items-start gap-3">
                {/* COMPLETION STATUS */}
                <span
                  className={`
                    mt-0.5 flex h-5 w-5 shrink-0
                    items-center justify-center border
                    ${
                      step.done
                        ? "border-[var(--usus-primary)] bg-[var(--usus-primary)] text-black"
                        : "border-[var(--usus-border)] bg-[var(--usus-surface)]"
                    }
                  `}
                >
                  {step.done && (
                    <Check size={13} strokeWidth={3} />
                  )}
                </span>

                {/* STEP DETAILS */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`
                      text-sm font-semibold
                      ${
                        step.done
                          ? "text-[var(--usus-text-muted)]"
                          : "text-[var(--usus-text)]"
                      }
                    `}
                  >
                    {step.title}
                  </p>

                  <p
                    className="
                      mt-1 text-xs leading-5
                      text-[var(--usus-text-muted)]
                    "
                  >
                    {step.description}
                  </p>

                  <Link
                    href={getDestination(step.key)}
                    onClick={handleClose}
                    className="
                      mt-3 inline-flex items-center gap-1
                      text-xs font-semibold
                      text-[var(--usus-primary)]
                      hover:underline
                    "
                  >
                    {step.done ? "View page" : "Get started"}
                    <ChevronRight size={14} />
                  </Link>
                </div>

                {step.done && (
                  <span
                    className="
                      shrink-0 text-[10px] font-semibold
                      text-[var(--usus-primary)]
                    "
                  >
                    DONE
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* EMPTY CHECKLIST */}
          {!isLoading &&
            !error &&
            checklist &&
            checklist.steps.length === 0 && (
              <p
                className="
                  py-8 text-center text-sm
                  text-[var(--usus-text-muted)]
                "
              >
                No setup steps are currently available.
              </p>
            )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-[var(--usus-border)] p-5">
          {progress === 100 &&
          !isLoading &&
          !error &&
          total > 0 ? (
            <div className="text-center">
              <div
                className="
                  mx-auto flex h-10 w-10
                  items-center justify-center
                  rounded-full bg-[var(--usus-primary-soft)]
                  text-[var(--usus-primary)]
                "
              >
                <Check size={20} />
              </div>

              <p
                className="
                  mt-3 text-sm font-semibold
                  text-[var(--usus-text)]
                "
              >
                Organisation setup complete!
              </p>

              <button
                type="button"
                onClick={handleClose}
                className="
                  mt-4 text-xs font-semibold
                  text-[var(--usus-text-muted)]
                  transition-colors
                  hover:text-[var(--usus-primary)]
                "
              >
                Close checklist
              </button>
            </div>
          ) : (
            <div>
              <p
                className="
                  text-xs leading-5
                  text-[var(--usus-text-muted)]
                "
              >
                These steps are optional and do not restrict access
                to your organisation.
              </p>

              <button
                type="button"
                onClick={handleClose}
                className="
                  mt-4 text-xs font-semibold
                  text-[var(--usus-text-muted)]
                  transition-colors
                  hover:text-[var(--usus-primary)]
                "
              >
                Hide checklist
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}