"use client";

import Link from "next/link";
import { useStaffArea } from "@/hooks/use-staff-area";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  CATEGORIES,
  DIFFICULTIES,
  PERSONAS,
  archiveScenario,
  getManagedScenarios,
  optionLabel,
  restoreScenario,
  type ManagedScenario,
} from "@/services/training-service";

const rowActionClassName =
  "cursor-pointer text-xs font-medium text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-primary)] disabled:cursor-not-allowed disabled:opacity-60";

type View = "active" | "archived";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function CompanyTrainingPage() {
  const area = useStaffArea();

  const [scenarios, setScenarios] = useState<
    ManagedScenario[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [view, setView] = useState<View>("active");

  const [busyId, setBusyId] = useState<string | null>(
    null,
  );

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const loadScenarios = useCallback(async () => {
    try {
      setError("");
      setScenarios(await getManagedScenarios());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load scenarios.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadScenarios();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadScenarios]);

  // Close modal with Escape key.
  useEffect(() => {
    if (!showCreateModal) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setShowCreateModal(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [showCreateModal]);

  async function handleArchiveToggle(
    scenario: ManagedScenario,
  ) {
    setBusyId(scenario.id);
    setError("");
    setNotice("");

    try {
      if (scenario.is_archived) {
        await restoreScenario(scenario.id);

        setNotice(
          `"${scenario.name}" was restored. Trainees can practise it again.`,
        );
      } else {
        await archiveScenario(scenario.id);

        setNotice(
          `"${scenario.name}" was archived. Trainees no longer see it; its history is kept.`,
        );
      }

      await loadScenarios();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update the scenario.",
      );
    } finally {
      setBusyId(null);
    }
  }

  const active = scenarios.filter(
    (scenario) => !scenario.is_archived,
  );

  const archived = scenarios.filter(
    (scenario) => scenario.is_archived,
  );

  const visible =
    view === "active" ? active : archived;

  return (
    <div className="min-h-full bg-[var(--usus-background)]">
      <section className="px-6 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">

          {/* Page heading */}
          <div>
            <p className="text-xs font-medium text-[var(--usus-primary)]">
              Organisation
            </p>

            <h1 className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
              Training
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[var(--usus-text-muted)]">
              Create and manage the scenarios your trainees
              practise.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            {/* Active / Archived tabs */}
            <div
              role="tablist"
              aria-label="Scenario status"
              className="flex gap-2"
            >
              {(
                [
                  ["active", `Active (${active.length})`],
                  ["archived", `Archived (${archived.length})`],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={view === value}
                  onClick={() => setView(value)}
                  className={[
                    "cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    view === value
                      ? "border-[var(--usus-primary)] bg-[var(--usus-primary-soft)] text-[var(--usus-text)]"
                      : "border-[var(--usus-border)] bg-[var(--usus-surface)] text-[var(--usus-text-muted)] hover:border-[var(--usus-primary)]",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* New Scenario button */}
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="w-fit cursor-pointer rounded-lg bg-[var(--usus-primary)] px-4 py-2 text-xs font-medium text-[#111111] transition-colors hover:bg-[var(--usus-primary-hover)]"
            >
              + New Scenario
            </button>
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-[var(--usus-danger)] bg-[var(--usus-surface)] px-4 py-3 text-sm text-[var(--usus-danger)]"
            >
              {error}
            </div>
          )}

          {/* Notice */}
          {notice && (
            <div
              role="status"
              className="mt-6 rounded-xl border border-[var(--usus-primary)] bg-[var(--usus-primary-soft)] px-4 py-3 text-sm text-[var(--usus-text)]"
            >
              {notice}
            </div>
          )}

          {/* Scenarios */}
          <section className="mt-6 overflow-hidden rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">

            {/* Table heading */}
            <div className="hidden grid-cols-[2.5fr_1fr_1fr_1fr_0.7fr_1fr] gap-4 border-b border-[var(--usus-border)] px-6 py-4 text-xs font-medium text-[var(--usus-text-muted)] md:grid">
              <span>Scenario</span>
              <span>Category</span>
              <span>Difficulty</span>
              <span>Customer</span>
              <span>Minutes</span>
              <span className="md:text-right">
                Actions
              </span>
            </div>

            {/* Loading and scenario list */}
            {loading ? (
              <div className="px-6 py-14 text-center text-sm text-[var(--usus-text-muted)]">
                Loading scenarios...
              </div>
            ) : visible.length === 0 ? (
              <div className="px-6 py-14 text-center text-sm text-[var(--usus-text-muted)]">
                {view === "active"
                  ? "No active scenarios. Create one to get your trainees practising."
                  : "No archived scenarios."}
              </div>
            ) : (
              visible.map((scenario) => (
                <div
                  key={scenario.id}
                  className="grid gap-2 border-b border-[var(--usus-border)] px-6 py-4 text-sm last:border-b-0 md:grid-cols-[2.5fr_1fr_1fr_1fr_0.7fr_1fr] md:items-center md:gap-4"
                >
                  <div className="min-w-0">
                    <Link
                      href={`${area.scenarios}/${scenario.id}`}
                      className="block truncate font-medium text-[var(--usus-text)] transition-colors hover:text-[var(--usus-primary)]"
                    >
                      {scenario.name}
                    </Link>

                    <p className="line-clamp-1 text-xs text-[var(--usus-text-muted)]">
                      {scenario.description}
                    </p>

                    <p className="mt-1 text-[11px] text-[var(--usus-text-muted)]">
                      Created: {formatDate(scenario.created_at)}
                    </p>
                  </div>

                  <span className="text-[var(--usus-text-muted)]">
                    {optionLabel(
                      CATEGORIES,
                      scenario.category,
                    )}
                  </span>

                  <span className="text-[var(--usus-text-muted)]">
                    {optionLabel(
                      DIFFICULTIES,
                      scenario.difficulty,
                    )}
                  </span>

                  <span className="text-[var(--usus-text-muted)]">
                    {optionLabel(
                      PERSONAS,
                      scenario.persona,
                    )}
                  </span>

                  <span className="text-[var(--usus-text-muted)]">
                    {scenario.estimated_minutes}
                  </span>

                  {/* Row actions */}
                  <div className="flex flex-wrap gap-4 md:justify-end">
                    <Link
                      href={`${area.scenarios}/${scenario.id}`}
                      className={rowActionClassName}
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      disabled={busyId === scenario.id}
                      onClick={() =>
                        handleArchiveToggle(scenario)
                      }
                      className={rowActionClassName}
                    >
                      {busyId === scenario.id
                        ? "Please wait..."
                        : scenario.is_archived
                          ? "Restore"
                          : "Archive"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </section>

      {/* Create Scenario Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowCreateModal(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-scenario-title"
            className="w-full max-w-lg rounded-2xl border border-[var(--usus-border)] bg-[var(--usus-surface)] p-6 shadow-2xl"
          >
            {/* Modal heading */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-[var(--usus-primary)]">
                  SCENARIO CREATION
                </p>

                <h2
                  id="create-scenario-title"
                  className="mt-2 text-xl font-semibold text-[var(--usus-text)]"
                >
                  How would you like to create?
                </h2>

                <p className="mt-2 text-sm leading-6 text-[var(--usus-text-muted)]">
                  Choose a creation method for your new
                  training scenario.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                aria-label="Close modal"
                className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-lg text-[var(--usus-text-muted)] transition-colors hover:bg-[var(--usus-muted)] hover:text-[var(--usus-text)]"
              >
                ×
              </button>
            </div>

            {/* Creation options */}
            <div className="mt-7 grid gap-4 sm:grid-cols-2">

              {/* Manual creation */}
              <Link
                href={`${area.scenarios}/new`}
                onClick={() => setShowCreateModal(false)}
                className="group rounded-xl border border-[var(--usus-border)] bg-[var(--usus-surface)] p-5 transition-colors hover:border-[var(--usus-primary)] hover:bg-[var(--usus-primary-soft)]/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--usus-border)] text-sm font-semibold text-[var(--usus-text-muted)]">
                  M
                </div>

                <h3 className="mt-4 font-semibold text-[var(--usus-text)]">
                  Create Manually
                </h3>

                <p className="mt-2 text-xs leading-5 text-[var(--usus-text-muted)]">
                  Build your training scenario from scratch.
                  Enter the details and configure the scenario
                  yourself.
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--usus-primary)]">
                    Start creating
                  </span>

                  <span className="text-sm text-[var(--usus-text-muted)] transition-colors group-hover:text-[var(--usus-primary)]">
                    →
                  </span>
                </div>
              </Link>

              {/* AI creation */}
              <Link
                href={`${area.scenarios}/new-ai`}
                onClick={() => setShowCreateModal(false)}
                className="group rounded-xl border border-[var(--usus-border)] bg-[var(--usus-surface)] p-5 transition-colors hover:border-[var(--usus-primary)] hover:bg-[var(--usus-primary-soft)]/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--usus-border)] text-sm font-semibold text-[var(--usus-text-muted)]">
                  AI
                </div>

                <h3 className="mt-4 font-semibold text-[var(--usus-text)]">
                  Generate with AI
                </h3>

                <p className="mt-2 text-xs leading-5 text-[var(--usus-text-muted)]">
                  Describe the training situation and let AI
                  help generate a structured scenario.
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--usus-primary)]">
                    Generate scenario
                  </span>

                  <span className="text-sm text-[var(--usus-text-muted)] transition-colors group-hover:text-[var(--usus-primary)]">
                    →
                  </span>
                </div>
              </Link>
            </div>

            {/* Cancel */}
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="mt-6 w-full cursor-pointer rounded-lg border border-[var(--usus-border)] px-4 py-2.5 text-xs font-medium text-[var(--usus-text-muted)] transition-colors hover:bg-[var(--usus-muted)]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}