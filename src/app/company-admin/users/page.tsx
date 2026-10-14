"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useAuth } from "@/components/auth/auth-provider";

import {
  getOrgUsers,
  resendInvite,
  setUserActive,
  type OrgUser,
} from "@/services/users-service";

const rowActionClassName =
  "cursor-pointer text-xs font-medium text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-primary)] disabled:cursor-not-allowed disabled:opacity-60";

const ROLE_FILTERS = [
  { value: "all", label: "All" },
  { value: "trainee", label: "Trainees" },
  { value: "manager", label: "Managers" },
  {
    value: "company_admin",
    label: "Company admins",
  },
] as const;

type RoleFilter =
  (typeof ROLE_FILTERS)[number]["value"];

const ROLE_LABELS: Record<string, string> = {
  trainee: "Trainee",
  manager: "Manager",
  company_admin: "Company admin",
};

function getStatus(user: OrgUser) {
  if (!user.is_active) {
    return "Deactivated";
  }

  return user.must_change_password
    ? "Invited"
    : "Active";
}

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

export default function CompanyUsersPage() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState<
    OrgUser[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [roleFilter, setRoleFilter] =
    useState<RoleFilter>("all");

  const [search, setSearch] = useState("");

  const [busyUserId, setBusyUserId] =
    useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setError("");
      setUsers(await getOrgUsers());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load users.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadUsers();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadUsers]);

  async function runAction(
    user: OrgUser,
    action: () => Promise<unknown>,
    success?: string,
  ) {
    setBusyUserId(user.id);
    setError("");
    setNotice("");

    try {
      await action();

      if (success) {
        setNotice(success);
      }

      await loadUsers();
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

  const query = search.trim().toLowerCase();

  const visibleUsers = users.filter(
    (user) =>
      (roleFilter === "all" ||
        user.role === roleFilter) &&
      (!query ||
        user.email.toLowerCase().includes(query) ||
        (user.full_name ?? "")
          .toLowerCase()
          .includes(query)),
  );

  const countFor = (filter: RoleFilter) =>
    filter === "all"
      ? users.length
      : users.filter(
          (user) => user.role === filter,
        ).length;

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
              Users
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[var(--usus-text-muted)]">
              Everyone in your organisation and their
              roles. Add people from{" "}
              <Link
                href="/company-admin/trainees"
                className="font-medium text-[var(--usus-text)] hover:text-[var(--usus-primary)]"
              >
                Trainees
              </Link>{" "}
              or{" "}
              <Link
                href="/company-admin/managers"
                className="font-medium text-[var(--usus-text)] hover:text-[var(--usus-primary)]"
              >
                Managers
              </Link>
              .
            </p>
          </div>

          {/* Filters */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div
              role="tablist"
              aria-label="Filter by role"
              className="flex flex-wrap gap-2"
            >
              {ROLE_FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  role="tab"
                  aria-selected={
                    roleFilter === filter.value
                  }
                  onClick={() =>
                    setRoleFilter(filter.value)
                  }
                  className={[
                    "cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                    roleFilter === filter.value
                      ? "border-[var(--usus-primary)] bg-[var(--usus-primary-soft)] text-[var(--usus-text)]"
                      : "border-[var(--usus-border)] bg-[var(--usus-surface)] text-[var(--usus-text-muted)] hover:border-[var(--usus-primary)]",
                  ].join(" ")}
                >
                  {filter.label} (
                  {countFor(filter.value)})
                </button>
              ))}
            </div>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by name or email"
              aria-label="Search users"
              className="h-9 w-full rounded-lg border border-[var(--usus-border)] bg-[var(--usus-surface)] px-3 text-sm text-[var(--usus-text)] outline-none transition-colors placeholder:text-[var(--usus-text-soft)] focus:border-[var(--usus-primary)] sm:w-64"
            />
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
            <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_1.4fr] gap-4 border-b border-[var(--usus-border)] px-6 py-4 text-xs font-medium text-[var(--usus-text-muted)] md:grid">
              <span>User</span>
              <span>Role</span>
              <span>Status</span>
              <span>Added</span>
              <span className="md:text-right">
                Actions
              </span>
            </div>

            {loading ? (
              <div className="px-6 py-14 text-center text-sm text-[var(--usus-text-muted)]">
                Loading users...
              </div>
            ) : visibleUsers.length === 0 ? (
              <div className="px-6 py-14 text-center text-sm text-[var(--usus-text-muted)]">
                {users.length === 0
                  ? "No users yet."
                  : "No users match your filters."}
              </div>
            ) : (
              visibleUsers.map((user) => {
                const status = getStatus(user);

                const busy =
                  busyUserId === user.id;

                const isYou =
                  user.id === currentUser?.user_id;

                return (
                  <div
                    key={user.id}
                    className="grid gap-2 border-b border-[var(--usus-border)] px-6 py-4 text-sm last:border-b-0 md:grid-cols-[2fr_1fr_1fr_1fr_1.4fr] md:items-center md:gap-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-[var(--usus-text)]">
                        {user.full_name || user.email}
                        {isYou && (
                          <span className="ml-2 text-xs font-normal text-[var(--usus-text-muted)]">
                            (you)
                          </span>
                        )}
                      </p>

                      {user.full_name && (
                        <p className="truncate text-xs text-[var(--usus-text-muted)]">
                          {user.email}
                        </p>
                      )}
                    </div>

                    <span className="text-[var(--usus-text-muted)]">
                      {ROLE_LABELS[user.role] ??
                        user.role}
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
                      {formatDate(user.created_at)}
                    </span>

                    <div className="flex flex-wrap gap-4 md:justify-end">
                      {user.role === "trainee" && (
                        <Link
                          href={`/company-admin/performance/${user.id}`}
                          className={rowActionClassName}
                        >
                          Report
                        </Link>
                      )}

                      {!isYou && (
                        <>
                          <button
                            type="button"
                            disabled={
                              busy || !user.is_active
                            }
                            onClick={() =>
                              runAction(
                                user,
                                () =>
                                  resendInvite(user.id),
                                `A new invitation is being sent to ${user.email}.`,
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
                              runAction(user, () =>
                                setUserActive(
                                  user.id,
                                  !user.is_active,
                                ),
                              )
                            }
                            className={
                              rowActionClassName
                            }
                          >
                            {user.is_active
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
    </div>
  );
}
