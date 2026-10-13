"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getOrganisations,
  setOrganisationActive,
  type Organisation,
} from "@/services/organisations-service";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
}

export default function OrganisationsPage() {
  const [organisations, setOrganisations] =
    useState<Organisation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [busyId, setBusyId] =
    useState<string | null>(null);

  const loadOrganisations =
    useCallback(async () => {
      try {
        setError("");

        setOrganisations(
          await getOrganisations(),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load organisations.",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadOrganisations();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadOrganisations]);

  async function handleToggleActive(
    organisation: Organisation,
  ) {
    setBusyId(organisation.id);
    setError("");

    try {
      await setOrganisationActive(
        organisation.id,
        !organisation.is_active,
      );

      await loadOrganisations();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update the organisation.",
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-full bg-[var(--usus-background)]">
      <section className="px-6 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          {/* Page heading */}
          <div>
            <p className="text-xs font-medium text-[var(--usus-primary)]">
              Platform
            </p>

            <h1 className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
              Organisations
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[var(--usus-text-muted)]">
              Manage the customer organisations using the
              USUS platform.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--usus-text)]">
                Customer Organisations
              </h2>

              <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
                Organisations created on the USUS platform
                will appear here.
              </p>
            </div>

            <Link
              href="/platform-admin/organisations/new"
              className="w-fit rounded-lg bg-[var(--usus-primary)] px-4 py-2 text-xs font-medium text-[#111111] transition-colors hover:bg-[var(--usus-primary-hover)]"
            >
              Create Organisation
            </Link>
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

          {/* Organisation list */}
          <section className="mt-6 overflow-hidden rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
            {/* Table header */}
            <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-4 border-b border-[var(--usus-border)] px-6 py-4 text-xs font-medium text-[var(--usus-text-muted)] md:grid">
              <span>Organisation</span>
              <span>Status</span>
              <span>Users</span>
              <span>Created</span>
              <span className="md:text-right">
                Actions
              </span>
            </div>

            {loading ? (
              <div className="px-6 py-14 text-center text-sm text-[var(--usus-text-muted)]">
                Loading organisations...
              </div>
            ) : organisations.length === 0 ? (
              <>
              {/* Empty state */}
              <div className="px-6 py-14 text-center">
                <div className="mx-auto max-w-md">
                  <h3 className="text-sm font-semibold text-[var(--usus-text)]">
                    No organisations yet
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[var(--usus-text-muted)]">
                    Customer organisations will appear here
                    once they are created on the platform.
                  </p>

                  <Link
                    href="/platform-admin/organisations/new"
                    className="mt-5 inline-block rounded-lg border border-[var(--usus-border)] bg-[var(--usus-surface)] px-4 py-2 text-xs font-medium text-[var(--usus-text)] transition-colors hover:border-[var(--usus-primary)] hover:text-[var(--usus-primary)]"
                  >
                    Create your first organisation
                  </Link>
                </div>
              </div>
              </>
            ) : (
              organisations.map((organisation) => (
                <div
                  key={organisation.id}
                  className="grid gap-2 border-b border-[var(--usus-border)] px-6 py-4 text-sm last:border-b-0 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] md:items-center md:gap-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[var(--usus-text)]">
                      {organisation.name}
                    </p>

                    <p className="text-xs text-[var(--usus-text-muted)]">
                      {organisation.trainees_count}{" "}
                      {organisation.trainees_count === 1
                        ? "trainee"
                        : "trainees"}{" "}
                      ·{" "}
                      {organisation.sessions_completed}{" "}
                      {organisation.sessions_completed ===
                      1
                        ? "session"
                        : "sessions"}{" "}
                      completed
                    </p>
                  </div>

                  <span
                    className={
                      organisation.is_active
                        ? "text-[var(--usus-text)]"
                        : "text-[var(--usus-text-muted)]"
                    }
                  >
                    {organisation.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>

                  <span className="text-[var(--usus-text-muted)]">
                    {organisation.users_count}
                  </span>

                  <span className="text-[var(--usus-text-muted)]">
                    {formatDate(
                      organisation.created_at,
                    )}
                  </span>

                  <div className="md:text-right">
                    <button
                      type="button"
                      disabled={
                        busyId === organisation.id
                      }
                      onClick={() =>
                        handleToggleActive(
                          organisation,
                        )
                      }
                      className="cursor-pointer text-xs font-medium text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {organisation.is_active
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>
        </div>
      </section>
    </div>
  );
};