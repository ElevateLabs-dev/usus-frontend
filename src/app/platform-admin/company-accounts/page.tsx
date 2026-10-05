"use client";

export default function CompanyAccountsPage() {
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
              className="w-fit rounded-lg bg-[var(--usus-primary)] px-4 py-2 text-xs font-medium text-[#111111] transition-colors hover:bg-[var(--usus-primary-hover)]"
            >
              Create Company Account
            </button>
          </div>

          {/* Accounts table */}
          <section className="mt-6 overflow-hidden rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
            {/* Table header */}
            <div className="hidden grid-cols-[2fr_1.5fr_1fr_1fr_1fr] gap-4 border-b border-[var(--usus-border)] px-6 py-4 text-xs font-medium text-[var(--usus-text-muted)] md:grid">
              <span>Company</span>
              <span>Administrator</span>
              <span>Status</span>
              <span>Users</span>
              <span>Last Activity</span>
            </div>

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
                  className="mt-5 rounded-lg border border-[var(--usus-border)] bg-[var(--usus-surface)] px-4 py-2 text-xs font-medium text-[var(--usus-text)] transition-colors hover:border-[var(--usus-primary)] hover:text-[var(--usus-primary)]"
                >
                  Create your first company account
                </button>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};