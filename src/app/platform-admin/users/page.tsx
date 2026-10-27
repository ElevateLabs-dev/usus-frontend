"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { Input, Modal } from "@/components/ui";

import {
  addPlatformAdmin,
  getPlatformAdmins,
  resendPlatformAdminInvite,
  setPlatformAdminActive,
} from "@/services/platform-service";

import type { OrgUser } from "@/services/users-service";

const primaryButtonClassName =
  "w-fit cursor-pointer rounded-lg bg-[var(--usus-primary)] px-4 py-2 text-xs font-medium text-[#111111] transition-colors hover:bg-[var(--usus-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60";

const rowActionClassName =
  "cursor-pointer text-xs font-medium text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-primary)] disabled:cursor-not-allowed disabled:opacity-60";

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
    return "—";
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

export default function PlatformUsersPage() {
  const { user: currentUser } = useAuth();

  const [admins, setAdmins] = useState<
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

  const loadAdmins = useCallback(async () => {
    try {
      setError("");
      setAdmins(await getPlatformAdmins());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load platform users.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAdmins();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadAdmins]);

  function openAddForm() {
    setAddError("");
    setAddOpen(true);
  }

  async function handleAdd(
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
      setAddError("Enter an email address.");
      return;
    }

    setAdding(true);
    setAddError("");

    try {
      await addPlatformAdmin({
        email,
        fullName,
      });

      setAddOpen(false);
      setNotice(
        `${email} was added and invited by email.`,
      );

      await loadAdmins();
    } catch (err) {
      setAddError(
        err instanceof Error
          ? err.message
          : "Unable to add the platform user.",
      );
    } finally {
      setAdding(false);
    }
  }

  async function handleResendInvite(
    admin: OrgUser,
  ) {
    setBusyUserId(admin.id);
    setError("");
    setNotice("");

    try {
      await resendPlatformAdminInvite(admin.id);

      setNotice(
        `A new invitation is on its way to ${admin.email}.`,
      );
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
    admin: OrgUser,
  ) {
    setBusyUserId(admin.id);
    setError("");
    setNotice("");

    try {
      await setPlatformAdminActive(
        admin.id,
        !admin.is_active,
      );

      await loadAdmins();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update the platform user.",
      );
    } finally {
      setBusyUserId(null);
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
              Platform Users
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[var(--usus-text-muted)]">
              Members of the USUS team with platform admin
              access. New users receive an email with a
              temporary password.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--usus-text)]">
                Users
              </h2>

              <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
                {admins.length}{" "}
                {admins.length === 1
                  ? "platform admin"
                  : "platform admins"}
              </p>
            </div>

            <button
              type="button"
              onClick={openAddForm}
              className={primaryButtonClassName}
            >
              Add Platform User
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

          {/* Users table */}
          <section className="mt-6 overflow-hidden rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
            {/* Table header */}
            <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1.4fr] gap-4 border-b border-[var(--usus-border)] px-6 py-4 text-xs font-medium text-[var(--usus-text-muted)] md:grid">
              <span>User</span>
              <span>Status</span>
              <span>Invited</span>
              <span>Added</span>
              <span className="md:text-right">
                Actions
              </span>
            </div>

            {loading ? (
              <div className="px-6 py-14 text-center text-sm text-[var(--usus-text-muted)]">
                Loading platform users...
              </div>
            ) : (
              admins.map((admin) => {
                const status = getStatus(admin);

                const busy =
                  busyUserId === admin.id;

                const isYou =
                  admin.id === currentUser?.user_id;

                return (
                  <div
                    key={admin.id}
                    className="grid gap-2 border-b border-[var(--usus-border)] px-6 py-4 text-sm last:border-b-0 md:grid-cols-[2fr_1fr_1fr_1fr_1.4fr] md:items-center md:gap-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[var(--usus-text)]">
                        {admin.full_name ||
                          admin.email}
                        {isYou && (
                          <span className="ml-2 text-xs font-normal text-[var(--usus-text-muted)]">
                            (you)
                          </span>
                        )}
                      </p>

                      {admin.full_name && (
                        <p className="truncate text-xs text-[var(--usus-text-muted)]">
                          {admin.email}
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
                      {status === "Invited" &&
                      !admin.invite_sent_at
                        ? "Not sent yet"
                        : formatDate(
                            admin.invite_sent_at,
                          )}
                    </span>

                    <span className="text-[var(--usus-text-muted)]">
                      {formatDate(admin.created_at)}
                    </span>

                    <div className="flex flex-wrap gap-4 md:justify-end">
                      {!isYou && (
                        <>
                          <button
                            type="button"
                            disabled={
                              busy ||
                              !admin.is_active
                            }
                            onClick={() =>
                              handleResendInvite(admin)
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
                              handleToggleActive(admin)
                            }
                            className={
                              rowActionClassName
                            }
                          >
                            {admin.is_active
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

      {/* Add platform user */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add platform user"
      >
        <form
          onSubmit={handleAdd}
          noValidate
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="admin-email"
              className="mb-2 block text-xs font-medium text-[var(--usus-text)]"
            >
              Email
            </label>

            <Input
              id="admin-email"
              name="email"
              type="email"
              placeholder="name@meetusus.com"
              autoComplete="off"
              required
              disabled={adding}
            />
          </div>

          <div>
            <label
              htmlFor="admin-name"
              className="mb-2 block text-xs font-medium text-[var(--usus-text)]"
            >
              Full name (optional)
            </label>

            <Input
              id="admin-name"
              name="fullName"
              placeholder="Jane Doe"
              autoComplete="off"
              disabled={adding}
            />
          </div>

          {addError && (
  <div
    role="alert"
    className="rounded-xl border
      border-red-300
      bg-[var(--usus-surface)]
      px-3
      py-2.5
      text-xs
      leading-5
      text-[var(--usus-danger)]
      dark:border-red-900
    "
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
};
