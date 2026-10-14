"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Input, Modal } from "@/components/ui";

import {
  getOrgUsers,
  inviteUser,
  resendInvite,
  setUserActive,
  setUserRole,
  type OrgRole,
  type OrgUser,
} from "@/services/users-service";

const primaryButtonClassName =
  "w-fit cursor-pointer rounded-lg bg-[var(--usus-primary)] px-4 py-2 text-xs font-medium text-[#111111] transition-colors hover:bg-[var(--usus-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60";

const rowActionClassName =
  "cursor-pointer text-xs font-medium text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-primary)] disabled:cursor-not-allowed disabled:opacity-60";

const STAFF_ROLES: {
  value: Exclude<OrgRole, "trainee">;
  label: string;
}[] = [
  { value: "manager", label: "Manager" },
  {
    value: "company_admin",
    label: "Company admin",
  },
];

function roleLabel(role: string) {
  return (
    STAFF_ROLES.find(
      (item) => item.value === role,
    )?.label ?? role
  );
}

/** "a manager" / "a company admin" */
function roleWithArticle(role: string) {
  return `a ${roleLabel(role).toLowerCase()}`;
}

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

export default function CompanyManagersPage() {
  const { user: currentUser } = useAuth();

  const [staff, setStaff] = useState<
    OrgUser[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [busyUserId, setBusyUserId] =
    useState<string | null>(null);

  const [addOpen, setAddOpen] =
    useState(false);

  const [adding, setAdding] =
    useState(false);

  const [addError, setAddError] =
    useState("");

  /*
   * Managers and company admins.
   */
  const loadStaff = useCallback(async () => {
    try {
      setError("");

      const users = await getOrgUsers();

      setStaff(
        users.filter(
          (user) => user.role !== "trainee",
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load managers.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadStaff();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadStaff]);

  /*
   * Invitation emails are sent in the
   * background; refresh once more so the
   * "Invitation" column catches up.
   */
  function refreshAfterInvites() {
    window.setTimeout(() => {
      void loadStaff();
    }, 4000);
  }

  async function runAction(
    member: OrgUser,
    action: () => Promise<unknown>,
    success?: string,
  ) {
    setBusyUserId(member.id);
    setError("");
    setNotice("");

    try {
      await action();

      if (success) {
        setNotice(success);
      }

      await loadStaff();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update the user.",
      );
    } finally {
      setBusyUserId(null);
    }
  }

  async function handleAdd(
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

    const role = String(
      form.get("role") ?? "manager",
    ) as OrgRole;

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
        role,
      });

      setAddOpen(false);
      setNotice(
        `${email} was added as ${roleWithArticle(role)} and will receive an invitation email.`,
      );

      await loadStaff();
      refreshAfterInvites();
    } catch (err) {
      setAddError(
        err instanceof Error
          ? err.message
          : "Unable to add the user.",
      );
    } finally {
      setAdding(false);
    }
  }

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
              Managers
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[var(--usus-text-muted)]">
              Managers add and follow trainees. Company
              admins can also manage staff, training and
              settings.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold text-[var(--usus-text)]">
              {staff.length}{" "}
              {staff.length === 1
                ? "staff member"
                : "staff members"}
            </h2>

            <button
              type="button"
              onClick={() => {
                setAddError("");
                setAddOpen(true);
              }}
              className={primaryButtonClassName}
            >
              Add Manager
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

          {/* Staff table */}
          <section className="mt-6 overflow-hidden rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
            <div className="hidden grid-cols-[2fr_1.2fr_1fr_1fr_1.4fr] gap-4 border-b border-[var(--usus-border)] px-6 py-4 text-xs font-medium text-[var(--usus-text-muted)] md:grid">
              <span>User</span>
              <span>Role</span>
              <span>Status</span>
              <span>Invitation</span>
              <span className="md:text-right">
                Actions
              </span>
            </div>

            {loading ? (
              <div className="px-6 py-14 text-center text-sm text-[var(--usus-text-muted)]">
                Loading managers...
              </div>
            ) : (
              staff.map((member) => {
                const status = getStatus(member);

                const busy =
                  busyUserId === member.id;

                const isYou =
                  member.id ===
                  currentUser?.user_id;

                return (
                  <div
                    key={member.id}
                    className="grid gap-2 border-b border-[var(--usus-border)] px-6 py-4 text-sm last:border-b-0 md:grid-cols-[2fr_1.2fr_1fr_1fr_1.4fr] md:items-center md:gap-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[var(--usus-text)]">
                        {member.full_name ||
                          member.email}
                        {isYou && (
                          <span className="ml-2 text-xs font-normal text-[var(--usus-text-muted)]">
                            (you)
                          </span>
                        )}
                      </p>

                      {member.full_name && (
                        <p className="truncate text-xs text-[var(--usus-text-muted)]">
                          {member.email}
                        </p>
                      )}
                    </div>

                    {isYou ? (
                      <span className="text-[var(--usus-text-muted)]">
                        {roleLabel(member.role)}
                      </span>
                    ) : (
                      <select
                        aria-label={`Role of ${member.email}`}
                        value={member.role}
                        disabled={busy}
                        onChange={(event) =>
                          runAction(
                            member,
                            () =>
                              setUserRole(
                                member.id,
                                event.target
                                  .value as OrgRole,
                              ),
                            `${member.email} is now ${roleWithArticle(event.target.value)}.`,
                          )
                        }
                        className="h-8 w-fit rounded-lg border border-[var(--usus-border)] bg-[var(--usus-surface)] px-2 text-xs text-[var(--usus-text)] outline-none focus:border-[var(--usus-primary)] disabled:opacity-60"
                      >
                        {STAFF_ROLES.map((role) => (
                          <option
                            key={role.value}
                            value={role.value}
                          >
                            {role.label}
                          </option>
                        ))}
                      </select>
                    )}

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
                      {!isYou && (
                        <>
                          <button
                            type="button"
                            disabled={
                              busy ||
                              !member.is_active
                            }
                            onClick={() =>
                              runAction(
                                member,
                                async () => {
                                  await resendInvite(
                                    member.id,
                                  );
                                  refreshAfterInvites();
                                },
                                `A new invitation is being sent to ${member.email}.`,
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
                            disabled={busy}
                            onClick={() =>
                              runAction(
                                member,
                                () =>
                                  setUserActive(
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
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </section>
        </div>
      </section>

      {/* Add manager */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add manager"
      >
        <form
          onSubmit={handleAdd}
          noValidate
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="manager-email"
              className="mb-2 block text-xs font-medium text-slate-700"
            >
              Email
            </label>

            <Input
              id="manager-email"
              name="email"
              type="email"
              placeholder="team.lead@company.com"
              autoComplete="off"
              required
              disabled={adding}
            />
          </div>

          <div>
            <label
              htmlFor="manager-name"
              className="mb-2 block text-xs font-medium text-slate-700"
            >
              Full name (optional)
            </label>

            <Input
              id="manager-name"
              name="fullName"
              placeholder="Jane Doe"
              autoComplete="off"
              disabled={adding}
            />
          </div>

          <div>
            <label
              htmlFor="manager-role"
              className="mb-2 block text-xs font-medium text-slate-700"
            >
              Role
            </label>

            <select
              id="manager-role"
              name="role"
              defaultValue="manager"
              disabled={adding}
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-400"
            >
              {STAFF_ROLES.map((role) => (
                <option
                  key={role.value}
                  value={role.value}
                >
                  {role.label}
                </option>
              ))}
            </select>
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
