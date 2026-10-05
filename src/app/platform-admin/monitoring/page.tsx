"use client";

export default function MonitoringPage() {
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
              Monitoring
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[var(--usus-text-muted)]">
              Monitor platform activity, system status, and
              important events across USUS.
            </p>
          </div>

          {/* Platform status */}
          <section className="mt-8">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-[var(--usus-text)]">
                Platform Status
              </h2>

              <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
                Current platform health information will
                appear here.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatusCard
                title="Platform"
                value="—"
                description="Overall platform status"
              />

              <StatusCard
                title="API"
                value="—"
                description="Backend API status"
              />

              <StatusCard
                title="Database"
                value="—"
                description="Database status"
              />

              <StatusCard
                title="Services"
                value="—"
                description="Platform services"
              />
            </div>
          </section>

          {/* Activity */}
          <section className="mt-8 rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
            <div className="border-b border-[var(--usus-border)] px-6 py-5">
              <h2 className="text-base font-semibold text-[var(--usus-text)]">
                Recent Activity
              </h2>

              <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
                Important platform events and activity will
                appear here.
              </p>
            </div>

            <div className="px-6 py-14 text-center">
              <h3 className="text-sm font-semibold text-[var(--usus-text)]">
                No activity yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--usus-text-muted)]">
                Platform activity will be displayed here
                once monitoring data becomes available.
              </p>
            </div>
          </section>

          {/* System events */}
          <section className="mt-6 rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] shadow-[var(--usus-shadow)]">
            <div className="border-b border-[var(--usus-border)] px-6 py-5">
              <h2 className="text-base font-semibold text-[var(--usus-text)]">
                System Events
              </h2>

              <p className="mt-1 text-sm text-[var(--usus-text-muted)]">
                System warnings, errors, and important events
                will appear here.
              </p>
            </div>

            <div className="px-6 py-14 text-center">
              <h3 className="text-sm font-semibold text-[var(--usus-text)]">
                No system events
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--usus-text-muted)]">
                There are currently no system events to
                display.
              </p>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

function StatusCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[var(--usus-radius)] border border-[var(--usus-border)] bg-[var(--usus-surface)] p-5 shadow-[var(--usus-shadow)] transition-colors hover:border-[var(--usus-primary)]">
      <p className="text-sm font-medium text-[var(--usus-text-muted)]">
        {title}
      </p>

      <p className="mt-3 text-2xl font-semibold text-[var(--usus-text)]">
        {value}
      </p>

      <p className="mt-2 text-xs text-[var(--usus-text-muted)]">
        {description}
      </p>
    </div>
  );
};