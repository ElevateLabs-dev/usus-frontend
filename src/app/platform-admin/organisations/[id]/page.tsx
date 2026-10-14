"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Input, Modal } from "@/components/ui";

import {
  addCompanyAdmin,
  getOrganisation,
  renameOrganisation,
  resendMemberInvite,
  setMemberActive,
  setOrganisationActive,
  type OrganisationDetail,
} from "@/services/organisations-service";

import type { OrgUser } from "@/services/users-service";

const primaryButtonClassName =
  "w-fit cursor-pointer rounded-lg bg-[var(--usus-primary)] px-4 py-2 text-xs font-medium text-[#111111] transition-colors hover:bg-[var(--usus-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60";

const secondaryButtonClassName =
  "w-fit cursor-pointer rounded-lg border border-[var(--usus-border)] bg-[var(--usus-surface)] px-4 py-2 text-xs font-medium text-[var(--usus-text)] transition-colors hover:border-[var(--usus-primary)] hover:text-[var(--usus-primary)] disabled:cursor-not-allowed disabled:opacity-60";

const rowActionClassName =
  "cursor-pointer text-xs font-medium text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-primary)] disabled:cursor-not-allowed disabled:opacity-60";

const ROLE_LABELS: Record<string, string> = {
  company_admin: "Company admin",
  manager: "Manager",
};

function getStatus(user: OrgUser) {
  if (!user.is_active) {
    return "Deactivated";
  }

  return user.must_change_password
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

export default function OrganisationDetailPage() {
  const params = useParams<{ id: string }>();
  const organisationId = params.id;

  const [organisation, setOrganisation] =
    useState<OrganisationDetail | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  /** Organisation action or user id in progress. */
  const [busy, setBusy] = useState<
    string | null
  >(null);

  const [renameOpen, setRenameOpen] =
    useState(false);

  const [addOpen, setAddOpen] =
    useState(false);

  const [formError, setFormError] =
    useState("");

  const loadOrganisation =
    useCallback(async () => {
      try {
        setError("");

        setOrganisation(
          await getOrganisation(organisationId),
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load the organisation.",
        );
      } finally {
        setLoading(false);
      }
    }, [organisationId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadOrganisation();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadOrganisation]);

  async function runAction(
    key: string,
    action: () => Promise<unknown>,
    success?: string,
  ) {
    setBusy(key);
    setError("");
    setNotice("");

    try {
      await action();

      if (success) {
        setNotice(success);
      }

      await loadOrganisation();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    } finally {
      setBusy(null);
    }
  }

  async function handleRename(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const name = String(
      new FormData(event.currentTarget).get(
        "name",
      ) ?? "",
    ).trim();

    if (name.length < 2) {
      setFormError(
        "Enter a name of at least 2 characters.",
      );
      return;
    }

    setBusy("rename");
    setFormError("");

    try {
      await renameOrganisation(
        organisationId,
        name,
      );

      setRenameOpen(false);
      await loadOrganisation();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Unable to rename the organisation.",
      );
    } finally {
      setBusy(null);
    }
  }

  async function handleAddAdmin(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form = new FormData(
      event.currentTarget,
    );

    const email = String(
      form.get("email") ?? "",
    ).trim();

    const fullName = String(
      form.get("fullName") ?? "",
    ).trim();

    if (!email) {
      setFormError("Enter an email address.");
      return;
    }

    setBusy("add-admin");
    setFormError("");

    try {
      await addCompanyAdmin(organisationId, {
        email,
        fullName,
      });

      setAddOpen(false);
      setNotice(
        `${email} was added as a company admin and invited by email.`,
      );

      await loadOrganisation();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Unable to add the company admin.",
      );
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-full bg-[var(--usus-background)] px-6 py-14 text-center text-sm text-[var(--usus-text-muted)]">
        Loading organisation...
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[var(--usus-background)]">
      <section className="px-6 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          {/* Back */}
          <Link
            href="/platform-admin/organisations"
            className="text-xs font-medium text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-primary)]"
          >
            ← Back to Organisations
          </Link>

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

          {organisation && (
            <>
              {/* Heading */}
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-medium text-[var(--usus-primary)]">
                    Organisation
                  </p>

                  <h1 className="mt-2 text-2xl font-semibold text-[var(--usus-text)]">
                    {organisation.name}
                  </h1>

                  <p className="mt-2 text-sm text-[var(--usus-text-muted)]">
                    {organisation.is_active
                      ? "Active"
                      : "Inactive — its users cannot sign in"}{" "}
                    · Created{" "}
                    {formatDate(
                      organisation.created_at,
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormError("");
                      setRenameOpen(true);
                    }}
                    className={
                      secondaryButtonClassName
                    }
                  >
                    Rename
                  </button>

                  <button
                    type="button"
                    disabled={busy === "active"}
                    onClick={() =>
                      runAction(
                        "active",
                        () =>
                          setOrganisationActive(
                            organisationId,
                            !organisation.is_active,
                          ),
                        organisation.is_active
                          ? `${organisation.name} was deactivated. Its users can no longer sign in.`
                          : `${organisation.name} was activated.`,
                      )
                    }
                    className={
                      secondaryButtonClassName
                    }
                  >
                    {organisation.is_active
                      ? "Deactivate"
                      : "Activate"}
                  </button>
                </div>
              </div>

              {/* Counts */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <CountCard
                  title="Users"
                  value={organisation.users_count}
                />

                <CountCard
                  title="Trainees"
                  value={
                    organisation.trainees_count
                  }
                />

                <CountCard
                  title="Active Scenarios"
                  value={
                    organisation.scenarios_count
                  }
                />

                <CountCard
                  title="Sessions Completed"
                  value={
                    organisation.sessions_completed
                  }
                />
              </div>

              {/* Staff */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[var(--usus-text)]">
                    Admins and Managers
                  </h2>

                  <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
                    Company admins manage the
                    organisation&apos;s users and
                    training.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setFormError("");
                    setAddOpen(true);
                  }}
                  className={primaryButtonClassName}
                >
                  Add Company Admin
                </button>
              </div>

              <section className="mt-6 overflow-hidden rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
                <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1.4fr] gap-4 border-b border-[var(--usus-border)] px-6 py-4 text-xs font-medium text-[var(--usus-text-muted)] md:grid">
                  <span>User</span>
                  <span>Role</span>
                  <span>Status</span>
                  <span>Invitation</span>
                  <span className="md:text-right">
                    Actions
                  </span>
                </div>

                {organisation.staff.length === 0 ? (
                  <div className="px-6 py-14 text-center text-sm text-[var(--usus-text-muted)]">
                    No admins or managers yet.
                  </div>
                ) : (
                  organisation.staff.map((member) => {
                    const status =
                      getStatus(member);

                    const memberBusy =
                      busy === member.id;

                    return (
                      <div
                        key={member.id}
                        className="grid gap-2 border-b border-[var(--usus-border)] px-6 py-4 text-sm last:border-b-0 md:grid-cols-[2fr_1fr_1fr_1fr_1.4fr] md:items-center md:gap-4"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-medium text-[var(--usus-text)]">
                            {member.full_name ||
                              member.email}
                          </p>

                          {member.full_name && (
                            <p className="truncate text-xs text-[var(--usus-text-muted)]">
                              {member.email}
                            </p>
                          )}
                        </div>

                        <span className="text-[var(--usus-text-muted)]">
                          {ROLE_LABELS[member.role] ??
                            member.role}
                        </span>

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
                          {member.invite_sent_at ||
                          status !== "Active"
                            ? formatDate(
                                member.invite_sent_at,
                              )
                            : "—"}
                        </span>

                        <div className="flex flex-wrap gap-4 md:justify-end">
                          <button
                            type="button"
                            disabled={
                              memberBusy ||
                              !member.is_active
                            }
                            onClick={() =>
                              runAction(
                                member.id,
                                () =>
                                  resendMemberInvite(
                                    organisationId,
                                    member.id,
                                  ),
                                `A new invitation is on its way to ${member.email}.`,
                              )
                            }
                            className={
                              rowActionClassName
                            }
                          >
                            Resend invite
                          </button>

                          <button
                            type="button"
                            disabled={memberBusy}
                            onClick={() =>
                              runAction(
                                member.id,
                                () =>
                                  setMemberActive(
                                    organisationId,
                                    member.id,
                                    !member.is_active,
                                  ),
                              )
                            }
                            className={
                              rowActionClassName
                            }
                          >
                            {member.is_active
                              ? "Deactivate"
                              : "Reactivate"}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </section>
            </>
          )}
        </div>
      </section>

      {/* Rename */}
      <Modal
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        title="Rename organisation"
      >
        <form
          onSubmit={handleRename}
          noValidate
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="organisation-name"
              className="mb-2 block text-xs font-medium text-slate-700"
            >
              Organisation name
            </label>

            <Input
              id="organisation-name"
              name="name"
              defaultValue={organisation?.name}
              autoComplete="off"
              required
              disabled={busy === "rename"}
            />
          </div>

          {formError && (
            <FormError message={formError} />
          )}

          <button
            type="submit"
            disabled={busy === "rename"}
            className={`w-full ${primaryButtonClassName.replace("w-fit ", "")} h-10`}
          >
            {busy === "rename"
              ? "Saving..."
              : "Save name"}
          </button>
        </form>
      </Modal>

      {/* Add company admin */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add company admin"
      >
        <form
          onSubmit={handleAddAdmin}
          noValidate
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="admin-email"
              className="mb-2 block text-xs font-medium text-slate-700"
            >
              Email
            </label>

            <Input
              id="admin-email"
              name="email"
              type="email"
              placeholder="name@company.com"
              autoComplete="off"
              required
              disabled={busy === "add-admin"}
            />
          </div>

          <div>
            <label
              htmlFor="admin-name"
              className="mb-2 block text-xs font-medium text-slate-700"
            >
              Full name (optional)
            </label>

            <Input
              id="admin-name"
              name="fullName"
              placeholder="Jane Doe"
              autoComplete="off"
              disabled={busy === "add-admin"}
            />
          </div>

          {formError && (
            <FormError message={formError} />
          )}

          <button
            type="submit"
            disabled={busy === "add-admin"}
            className={`w-full ${primaryButtonClassName.replace("w-fit ", "")} h-10`}
          >
            {busy === "add-admin"
              ? "Adding..."
              : "Add and send invitation"}
          </button>
        </form>
      </Modal>
    </div>
  );
}

function CountCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] p-5 shadow-[var(--usus-shadow)]">
      <p className="text-sm font-medium text-[var(--usus-text-muted)]">
        {title}
      </p>

      <p className="mt-3 text-2xl font-semibold text-[var(--usus-text)]">
        {value}
      </p>
    </div>
  );
}

function FormError({
  message,
}: {
  message: string;
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-600"
    >
      {message}
    </div>
  );
};
