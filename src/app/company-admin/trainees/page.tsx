"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Input, Modal } from "@/components/ui";

import {
  downloadImportTemplate,
  getOrgUsers,
  importTrainees,
  inviteUser,
  resendInvite,
  setUserActive,
  type ImportTraineesResult,
  type OrgUser,
} from "@/services/users-service";

const primaryButtonClassName =
  "w-fit cursor-pointer rounded-lg bg-[var(--usus-primary)] px-4 py-2 text-xs font-medium text-[#111111] transition-colors hover:bg-[var(--usus-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60";

const secondaryButtonClassName =
  "w-fit cursor-pointer rounded-lg border border-[var(--usus-border)] bg-[var(--usus-surface)] px-4 py-2 text-xs font-medium text-[var(--usus-text)] transition-colors hover:border-[var(--usus-primary)] hover:text-[var(--usus-primary)] disabled:cursor-not-allowed disabled:opacity-60";

const rowActionClassName =
  "cursor-pointer text-xs font-medium text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-primary)] disabled:cursor-not-allowed disabled:opacity-60";

function getStatus(trainee: OrgUser) {
  if (!trainee.is_active) {
    return "Deactivated";
  }

  return trainee.must_change_password
    ? "Invited"
    : "Active";
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not sent yet";
  }

  return new Date(value).toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
}

export default function CompanyTraineesPage() {
  /*
   * ============================================================
   * TRAINEES
   * ============================================================
   */

  const [trainees, setTrainees] =
    useState<OrgUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [notice, setNotice] = useState("");

  const [busyUserId, setBusyUserId] =
    useState<string | null>(null);

  const loadTrainees = useCallback(async () => {
    try {
      setError("");

      setTrainees(
        await getOrgUsers("trainee"),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load trainees.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTrainees();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadTrainees]);

  /*
   * Invitation emails are sent in the background,
   * a moment after the request returns. Refresh
   * once more so the "Invitation" column catches up.
   */
  function refreshAfterInvites() {
    window.setTimeout(() => {
      void loadTrainees();
    }, 4000);
  }

  /*
   * ============================================================
   * ADD ONE TRAINEE
   * ============================================================
   */

  const [addOpen, setAddOpen] =
    useState(false);

  const [adding, setAdding] =
    useState(false);

  const [addError, setAddError] =
    useState("");

  async function handleAddTrainee(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setAddError("");

    const form = new FormData(
      event.currentTarget,
    );

    const email = String(
      form.get("email") ?? "",
    ).trim();

    const fullName = String(
      form.get("fullName") ?? "",
    ).trim();

    if (!/\S+@\S+\.\S+/.test(email)) {
      setAddError(
        "Please enter a valid email address.",
      );
      return;
    }

    setAdding(true);

    try {
      await inviteUser({
        email,
        fullName,
        role: "trainee",
      });

      setAddOpen(false);

      setNotice(
        `${email} was added and will receive an invitation email.`,
      );

      await loadTrainees();

      refreshAfterInvites();
    } catch (err) {
      setAddError(
        err instanceof Error
          ? err.message
          : "Unable to add the trainee.",
      );
    } finally {
      setAdding(false);
    }
  }

  /*
   * ============================================================
   * IMPORT FROM EXCEL
   * ============================================================
   */

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [importing, setImporting] =
    useState(false);

  const [importResult, setImportResult] =
    useState<ImportTraineesResult | null>(
      null,
    );

  async function handleImport(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    // Allow choosing the same file again.
    event.target.value = "";

    if (!file) {
      return;
    }

    setError("");
    setNotice("");
    setImportResult(null);
    setImporting(true);

    try {
      setImportResult(
        await importTrainees(file),
      );

      await loadTrainees();

      refreshAfterInvites();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to import the file.",
      );
    } finally {
      setImporting(false);
    }
  }

  async function handleDownloadTemplate() {
    try {
      setError("");

      await downloadImportTemplate();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to download the template.",
      );
    }
  }

  /*
   * ============================================================
   * ROW ACTIONS
   * ============================================================
   */

  async function handleResendInvite(
    trainee: OrgUser,
  ) {
    setBusyUserId(trainee.id);
    setError("");
    setNotice("");

    try {
      await resendInvite(trainee.id);

      setNotice(
        `A new invitation is being sent to ${trainee.email}.`,
      );

      refreshAfterInvites();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to resend the invitation.",
      );
    } finally {
      setBusyUserId(null);
    }
  }

  async function handleToggleActive(
    trainee: OrgUser,
  ) {
    setBusyUserId(trainee.id);
    setError("");
    setNotice("");

    try {
      await setUserActive(
        trainee.id,
        !trainee.is_active,
      );

      await loadTrainees();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update the trainee.",
      );
    } finally {
      setBusyUserId(null);
    }
  }

  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

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
              Trainees
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[var(--usus-text-muted)]">
              Add the people who will train on USUS. Each
              trainee receives an email with a temporary
              password and chooses their own password when
              they first sign in.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--usus-text)]">
                {trainees.length}{" "}
                {trainees.length === 1
                  ? "trainee"
                  : "trainees"}
              </h2>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="mt-1 cursor-pointer text-sm text-[var(--usus-text-muted)] underline-offset-2 transition-colors hover:text-[var(--usus-primary)] hover:underline"
              >
                Download the Excel import template
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.csv"
                onChange={handleImport}
                className="hidden"
                aria-label="Trainee list file"
              />

              <button
                type="button"
                disabled={importing}
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className={
                  secondaryButtonClassName
                }
              >
                {importing
                  ? "Importing..."
                  : "Import from Excel"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAddError("");
                  setAddOpen(true);
                }}
                className={primaryButtonClassName}
              >
                Add Trainee
              </button>
            </div>
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

          {/* Import result */}
          {importResult && (
            <div
              role="status"
              className="mt-6 rounded-xl border border-[var(--usus-border)] bg-[var(--usus-surface)] px-4 py-3 text-sm text-[var(--usus-text)]"
            >
              <p className="font-medium">
                {importResult.created.length}{" "}
                {importResult.created.length === 1
                  ? "trainee was"
                  : "trainees were"}{" "}
                added and invited by email.
              </p>

              {importResult.skipped.length > 0 && (
                <div className="mt-2 text-[var(--usus-text-muted)]">
                  <p>
                    {importResult.skipped.length}{" "}
                    {importResult.skipped.length === 1
                      ? "row was"
                      : "rows were"}{" "}
                    skipped:
                  </p>

                  <ul className="mt-1 list-disc pl-5">
                    {importResult.skipped.map(
                      (row) => (
                        <li
                          key={`${row.email}-${row.reason}`}
                        >
                          {row.email} — {row.reason}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Trainees table */}
          <section className="mt-6 overflow-hidden rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
            {/* Table header */}
            <div className="hidden grid-cols-[2fr_1fr_1fr_1.4fr] gap-4 border-b border-[var(--usus-border)] px-6 py-4 text-xs font-medium text-[var(--usus-text-muted)] md:grid">
              <span>Trainee</span>
              <span>Status</span>
              <span>Invitation</span>
              <span className="md:text-right">
                Actions
              </span>
            </div>

            {loading ? (
              <div className="px-6 py-14 text-center text-sm text-[var(--usus-text-muted)]">
                Loading trainees...
              </div>
            ) : trainees.length === 0 ? (
              /* Empty state */
              <div className="px-6 py-14 text-center">
                <div className="mx-auto max-w-md">
                  <h3 className="text-sm font-semibold text-[var(--usus-text)]">
                    No trainees yet
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[var(--usus-text-muted)]">
                    Add trainees one at a time, or import
                    your whole team from an Excel file.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setAddError("");
                      setAddOpen(true);
                    }}
                    className={`mt-5 ${secondaryButtonClassName}`}
                  >
                    Add your first trainee
                  </button>
                </div>
              </div>
            ) : (
              trainees.map((trainee) => {
                const status = getStatus(trainee);

                const busy =
                  busyUserId === trainee.id;

                return (
                  <div
                    key={trainee.id}
                    className="grid gap-2 border-b border-[var(--usus-border)] px-6 py-4 text-sm last:border-b-0 md:grid-cols-[2fr_1fr_1fr_1.4fr] md:items-center md:gap-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[var(--usus-text)]">
                        {trainee.full_name ||
                          trainee.email}
                      </p>

                      {trainee.full_name && (
                        <p className="truncate text-xs text-[var(--usus-text-muted)]">
                          {trainee.email}
                        </p>
                      )}
                    </div>

                    <span
                      className={
                        status === "Active"
                          ? "text-[var(--usus-text)]"
                          : "text-[var(--usus-text-muted)]"
                      }
                    >
                      {status}
                    </span>

                    <span className="text-[var(--usus-text-muted)]">
                      {formatDate(
                        trainee.invite_sent_at,
                      )}
                    </span>

                    <div className="flex flex-wrap gap-4 md:justify-end">
                      <button
                        type="button"
                        disabled={
                          busy || !trainee.is_active
                        }
                        onClick={() =>
                          handleResendInvite(trainee)
                        }
                        className={rowActionClassName}
                      >
                        Resend invite
                      </button>

                      <button
                        type="button"
                        disabled={busy}
                        onClick={() =>
                          handleToggleActive(trainee)
                        }
                        className={rowActionClassName}
                      >
                        {trainee.is_active
                          ? "Deactivate"
                          : "Reactivate"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        </div>
      </section>

      {/* Add trainee */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add trainee"
      >
        <form
          onSubmit={handleAddTrainee}
          noValidate
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="trainee-email"
              className="mb-2 block text-xs font-medium text-slate-700"
            >
              Email
            </label>

            <Input
              id="trainee-email"
              name="email"
              type="email"
              placeholder="jane.doe@company.com"
              autoComplete="off"
              required
              disabled={adding}
            />
          </div>

          <div>
            <label
              htmlFor="trainee-name"
              className="mb-2 block text-xs font-medium text-slate-700"
            >
              Full name (optional)
            </label>

            <Input
              id="trainee-name"
              name="fullName"
              placeholder="Jane Doe"
              autoComplete="off"
              disabled={adding}
            />
          </div>

          {addError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-600"
            >
              {addError}
            </div>
          )}

          <button
            type="submit"
            disabled={adding}
            className={`w-full ${primaryButtonClassName.replace("w-fit ", "")} h-10`}
          >
            {adding
              ? "Adding..."
              : "Add and send invitation"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
