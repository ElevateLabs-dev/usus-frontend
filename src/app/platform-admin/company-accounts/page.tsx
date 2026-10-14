"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  getOrganisation,
  getOrganisations,
  resendMemberInvite,
  setMemberActive,
} from "@/services/organisations-service";

const rowActionClassName =
  "cursor-pointer text-xs font-medium text-[var(--usus-text-muted)] transition-colors hover:text-[var(--usus-primary)] disabled:cursor-not-allowed disabled:opacity-60";

interface CompanyAccount {
  id: string;
  organisationId: string;
  company: string;
  companyUsers: number;
  name: string | null;
  email: string;
  status: string;
  isActive: boolean;
  invitedAt: string | null;
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

/**
 * Company administrators across every
 * organisation.
 */
async function getCompanyAccounts(): Promise<
  CompanyAccount[]
> {
  const organisations =
    await getOrganisations();

  const details = await Promise.all(
    organisations.map((organisation) =>
      getOrganisation(organisation.id),
    ),
  );

  return details.flatMap((organisation) =>
    organisation.staff
      .filter(
        (user) =>
          user.role === "company_admin",
      )
      .map((user) => ({
        id: user.id,
        organisationId: organisation.id,
        company: organisation.name,
        companyUsers:
          organisation.users_count,
        name: user.full_name,
        email: user.email,
        status: !user.is_active
          ? "Deactivated"
          : user.must_change_password
            ? "Invited"
            : "Active",
        isActive: user.is_active,
        invitedAt: user.invite_sent_at,
      })),
  );
}

export default function CompanyAccountsPage() {
  const router = useRouter();

  const [accounts, setAccounts] =
    useState<CompanyAccount[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [busyId, setBusyId] =
    useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    try {
      setError("");
      setAccounts(await getCompanyAccounts());
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load company accounts.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAccounts();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadAccounts]);

  async function runAction(
    account: CompanyAccount,
    action: () => Promise<unknown>,
    success?: string,
  ) {
    setBusyId(account.id);
    setError("");
    setNotice("");

    try {
      await action();

      if (success) {
        setNotice(success);
      }

      await loadAccounts();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update the account.",
      );
    } finally {
      setBusyId(null);
    }
  }

  /*
   * A company account is created together
   * with its organisation.
   */
  function createCompanyAccount() {
    router.push(
      "/platform-admin/organisations/new",
    );
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
              Company Accounts
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[var(--usus-text-muted)]">
              Manage company administrator accounts across
              organisations using the USUS platform.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[var(--usus-text)]">
                Company Accounts
              </h2>

              <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
                Company administrator accounts will appear
                here.
              </p>
            </div>

            <button
              type="button"
              onClick={createCompanyAccount}
              className="w-fit cursor-pointer rounded-lg bg-[var(--usus-primary)] px-4 py-2 text-xs font-medium text-[#111111] transition-colors hover:bg-[var(--usus-primary-hover)]"
            >
              Create Company Account
            </button>
          </div>

          {/* Error */}
          {error && accounts.length > 0 && (
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

          {/* Accounts table */}
          <section className="mt-6 overflow-hidden rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
            {/* Table header */}
            <div className="hidden grid-cols-[1.5fr_1.5fr_1fr_0.7fr_1fr_1.4fr] gap-4 border-b border-[var(--usus-border)] px-6 py-4 text-xs font-medium text-[var(--usus-text-muted)] md:grid">
              <span>Company</span>
              <span>Administrator</span>
              <span>Status</span>
              <span>Users</span>
              <span>Invited</span>
              <span className="md:text-right">
                Actions
              </span>
            </div>

            {loading ? (
              <div className="px-6 py-14 text-center text-sm text-[var(--usus-text-muted)]">
                Loading company accounts...
              </div>
            ) : error && accounts.length === 0 ? (
              <div
                role="alert"
                className="px-6 py-14 text-center text-sm text-[var(--usus-danger)]"
              >
                {error}
              </div>
            ) : accounts.length === 0 ? (
              <>
              {/* Empty state */}
              <div className="px-6 py-14 text-center">
                <div className="mx-auto max-w-md">
                  <h3 className="text-sm font-semibold text-[var(--usus-text)]">
                    No company accounts yet
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[var(--usus-text-muted)]">
                    Company administrator accounts will
                    appear here once they are created.
                  </p>

                  <button
                    type="button"
                    onClick={createCompanyAccount}
                    className="mt-5 cursor-pointer rounded-lg border border-[var(--usus-border)] bg-[var(--usus-surface)] px-4 py-2 text-xs font-medium text-[var(--usus-text)] transition-colors hover:border-[var(--usus-primary)] hover:text-[var(--usus-primary)]"
                  >
                    Create your first company account
                  </button>
                </div>
              </div>
              </>
            ) : (
              accounts.map((account) => (
                <div
                  key={account.id}
                  className="grid gap-2 border-b border-[var(--usus-border)] px-6 py-4 text-sm last:border-b-0 md:grid-cols-[1.5fr_1.5fr_1fr_0.7fr_1fr_1.4fr] md:items-center md:gap-4"
                >
                  <Link
                    href={`/platform-admin/organisations/${account.organisationId}`}
                    className="truncate font-medium text-[var(--usus-text)] transition-colors hover:text-[var(--usus-primary)]"
                  >
                    {account.company}
                  </Link>

                  <div className="min-w-0">
                    <p className="truncate text-[var(--usus-text)]">
                      {account.name || account.email}
                    </p>

                    {account.name && (
                      <p className="truncate text-xs text-[var(--usus-text-muted)]">
                        {account.email}
                      </p>
                    )}
                  </div>

                  <span
                    className={
                      account.status === "Active"
                        ? "text-[var(--usus-text)]"
                        : "text-[var(--usus-text-muted)]"
                    }
                  >
                    {account.status}
                  </span>

                  <span className="text-[var(--usus-text-muted)]">
                    {account.companyUsers}
                  </span>

                  <span className="text-[var(--usus-text-muted)]">
                    {account.invitedAt ||
                    account.status !== "Active"
                      ? formatDate(account.invitedAt)
                      : "—"}
                  </span>

                  <div className="flex flex-wrap gap-4 md:justify-end">
                    <button
                      type="button"
                      disabled={
                        busyId === account.id ||
                        !account.isActive
                      }
                      onClick={() =>
                        runAction(
                          account,
                          () =>
                            resendMemberInvite(
                              account.organisationId,
                              account.id,
                            ),
                          `A new invitation is on its way to ${account.email}.`,
                        )
                      }
                      className={rowActionClassName}
                    >
                      Resend invite
                    </button>

                    <button
                      type="button"
                      disabled={busyId === account.id}
                      onClick={() =>
                        runAction(account, () =>
                          setMemberActive(
                            account.organisationId,
                            account.id,
                            !account.isActive,
                          ),
                        )
                      }
                      className={rowActionClassName}
                    >
                      {account.isActive
                        ? "Deactivate"
                        : "Reactivate"}
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