interface WorkInProgressProps {
  title: string;
  description: string;
}

/**
 * Placeholder for company admin pages
 * that are not built yet.
 */
export function WorkInProgress({
  title,
  description,
}: WorkInProgressProps) {
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
              {title}
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[var(--usus-text-muted)]">
              {description}
            </p>
          </div>

          {/* Work in progress */}
          <section className="mt-8 overflow-hidden rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
            <div className="px-6 py-14 text-center">
              <div className="mx-auto max-w-md">
                <h2 className="text-sm font-semibold text-[var(--usus-text)]">
                  Work in progress
                </h2>

                <p className="mt-2 text-sm leading-6 text-[var(--usus-text-muted)]">
                  This page is being built and will be
                  available soon.
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
