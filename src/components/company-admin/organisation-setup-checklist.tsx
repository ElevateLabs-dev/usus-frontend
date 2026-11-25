"use client";

import { useEffect, useState } from "react";
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
  updateOnboardingChecklist,
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

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  // Map backend checklist keys to dashboard routes.
  const destinations: Record<string, string> = {
    subscription: subscriptionHref,
    knowledge_base: knowledgeBaseHref,
    knowledge: knowledgeBaseHref,
    team: teamHref,
    managers: teamHref,
    settings: settingsHref,
    company_settings: settingsHref,
  };

  // Fetch checklist from backend.
  useEffect(() => {
    let active = true;

    async function loadChecklist() {
      try {
        const result = await getOnboardingChecklist();

        if (active) {
          setChecklist(result);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load your setup checklist.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadChecklist();

    return () => {
      active = false;
    };
  }, []);

  // Retry checklist request.
  async function handleRetry() {
    setError("");
    setIsLoading(true);

    try {
      const result = await getOnboardingChecklist();
      setChecklist(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load your setup checklist.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Hide or show checklist through backend.
  async function handleDismiss(dismissed: boolean) {
    setError("");
    setIsUpdating(true);

    try {
      const result = await updateOnboardingChecklist(dismissed);

      setChecklist(result);

      if (dismissed) {
        setIsOpen(false);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update your checklist.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  const completed = checklist?.completed ?? 0;
  const total = checklist?.total ?? 0;

  const progress =
    total > 0
      ? Math.round((completed / total) * 100)
      : 0;

  if (isLoading && !checklist) {
    return null;
  }

  return (
    <>
      {/* FLOATING REMINDER */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);

            if (checklist?.dismissed) {
              void handleDismiss(false);
            }
          }}
          aria-label="Open organisation setup checklist"
          className="
            fixed bottom-6 left-5 z-[90]
            flex h-16 w-16 items-center justify-center
            rounded-full border border-[var(--usus-border)]
            bg-[var(--usus-surface)]
            text-[var(--usus-text)]
            shadow-xl transition-colors
            hover:border-[var(--usus-primary)]
            md:left-[17rem]
          "
        >
          <span className="
            relative flex h-11 w-11 items-center justify-center
            rounded-full bg-[var(--usus-primary-soft)]
          ">
            <span className="
              text-sm font-bold
              text-[var(--usus-primary)]
            ">
              {isLoading ? "..." : `${progress}%`}
            </span>

            {progress < 100 && (
              <span className="
                absolute -right-1 -top-1 h-3 w-3
                rounded-full border-2
                border-[var(--usus-surface)]
                bg-[var(--usus-primary)]
              " />
            )}
          </span>
        </button>
      )}

      {/* BACKDROP */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close setup panel"
          onClick={() => setIsOpen(false)}
          className="
            fixed inset-0 z-[80]
            cursor-default bg-black/30
            backdrop-blur-[2px]
          "
        />
      )}

      {/* CHECKLIST PANEL */}
      <aside
        aria-label="Organisation setup checklist"
        aria-hidden={!isOpen}
        className={`
          fixed bottom-0 left-0 top-0 z-[100]
          flex w-[min(100%,380px)] flex-col
          border-r border-[var(--usus-border)]
          bg-[var(--usus-surface)]
          shadow-2xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="
          flex items-start justify-between
          border-b border-[var(--usus-border)] p-6
        ">
          <div>
            <p className="
              text-xs font-semibold uppercase tracking-wider
              text-[var(--usus-primary)]
            ">
              Organisation setup
            </p>

            <h2 className="
              mt-2 text-xl font-bold
              text-[var(--usus-text)]
            ">
              Getting started
            </h2>

            <p className="
              mt-1 text-sm
              text-[var(--usus-text-muted)]
            ">
              Your company setup checklist.
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
              hover:text-[var(--usus-text)]
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* PROGRESS */}
        <div className="
          border-b border-[var(--usus-border-soft)] p-6
        ">
          <div className="mb-3 flex items-center justify-between">
            <span className="
              text-sm font-semibold
              text-[var(--usus-text)]
            ">
              Setup progress
            </span>

            <span className="
              text-sm font-bold
              text-[var(--usus-primary)]
            ">
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

          <p className="
            mt-3 text-xs
            text-[var(--usus-text-muted)]
          ">
            {completed} of {total} steps completed
          </p>
        </div>

        {/* CHECKLIST STEPS */}
        <div className="flex-1 space-y-3 overflow-y-auto p-5">
          {isLoading && (
            <div className="
              flex items-center justify-center
              gap-2 py-8 text-sm
              text-[var(--usus-text-muted)]
            ">
              <Loader2 size={17} className="animate-spin" />
              Loading setup progress...
            </div>
          )}

          {!isLoading && error && (
            <div className="
              border border-[var(--usus-danger)]/30
              bg-[var(--usus-surface-soft)] p-4
            ">
              <div className="flex items-start gap-2">
                <AlertCircle
                  size={17}
                  className="mt-0.5 shrink-0 text-[var(--usus-danger)]"
                />

                <div>
                  <p className="
                    text-sm font-semibold
                    text-[var(--usus-text)]
                  ">
                    Unable to load checklist
                  </p>

                  <p className="
                    mt-1 text-xs
                    text-[var(--usus-text-muted)]
                  ">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={() => void handleRetry()}
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

          {!isLoading &&
            !error &&
            checklist?.steps.map((step) => {
              const destination = destinations[step.key];

              return (
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

                    {/* STEP INFORMATION */}
                    <div className="min-w-0 flex-1">
                      <p className={`
                        text-sm font-semibold
                        ${
                          step.done
                            ? "text-[var(--usus-text-muted)]"
                            : "text-[var(--usus-text)]"
                        }
                      `}>
                        {step.title}
                      </p>

                      <p className="
                        mt-1 text-xs leading-5
                        text-[var(--usus-text-muted)]
                      ">
                        {step.description}
                      </p>

                      {destination && (
                        <Link
                          href={destination}
                          onClick={() => setIsOpen(false)}
                          className="
                            mt-3 inline-flex items-center gap-1
                            text-xs font-semibold
                            text-[var(--usus-primary)]
                            hover:underline
                          "
                        >
                          View details
                          <ChevronRight size={14} />
                        </Link>
                      )}
                    </div>

                    {step.done && (
                      <span className="
                        shrink-0 text-[10px] font-semibold
                        text-[var(--usus-primary)]
                      ">
                        DONE
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* FOOTER */}
        <div className="
          border-t border-[var(--usus-border)] p-5
        ">
          {progress === 100 && !isLoading && !error ? (
            <div className="text-center">
              <div className="
                mx-auto flex h-10 w-10
                items-center justify-center
                rounded-full bg-[var(--usus-primary-soft)]
                text-[var(--usus-primary)]
              ">
                <Check size={20} />
              </div>

              <p className="
                mt-3 text-sm font-semibold
                text-[var(--usus-text)]
              ">
                Organisation setup complete!
              </p>
            </div>
          ) : (
            <div>
              <p className="
                text-xs leading-5
                text-[var(--usus-text-muted)]
              ">
                These steps are optional and do not restrict access to your organisation.
              </p>

              <button
                type="button"
                disabled={isUpdating}
                onClick={() => void handleDismiss(true)}
                className="
                  mt-4 text-xs font-semibold
                  text-[var(--usus-text-muted)]
                  transition-colors hover:text-[var(--usus-primary)]
                  disabled:opacity-50
                "
              >
                {isUpdating ? "Updating..." : "Hide checklist"}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}