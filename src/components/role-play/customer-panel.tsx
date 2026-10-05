interface CustomerPanelProps {
  name: string;
  personality: string;
  emotionalState: string;
  background: string;
}

export function CustomerPanel({
  name,
  personality,
  emotionalState,
  background,
}: CustomerPanelProps) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <aside
      className="
        rounded-2xl
        border border-[var(--usus-border)]
        bg-[var(--usus-surface)]
        p-5
        shadow-[var(--usus-shadow)]
      "
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--usus-text-muted)]">
        Customer
      </p>

      <div className="mt-5 flex items-center gap-3">
        <div
          className="
            flex h-12 w-12 shrink-0
            items-center justify-center
            rounded-full
            bg-[var(--usus-primary-soft)]
            text-sm font-bold
            text-[var(--usus-text)]
          "
        >
          {initials}
        </div>

        <div className="min-w-0">
          <h2 className="truncate font-semibold text-[var(--usus-text)]">
            {name}
          </h2>

          <p className="mt-0.5 text-xs text-[var(--usus-text-muted)]">
            {personality}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <p className="text-xs text-[var(--usus-text-muted)]">
            Emotional state
          </p>

          <span
            className="
              mt-2 inline-flex rounded-full
              bg-[var(--usus-primary-soft)]
              px-3 py-1
              text-xs font-medium
              text-[var(--usus-text)]
            "
          >
            {emotionalState}
          </span>
        </div>

        <div>
          <p className="text-xs text-[var(--usus-text-muted)]">
            Background
          </p>

          <p className="mt-1.5 text-sm leading-6 text-[var(--usus-text-muted)]">
            {background}
          </p>
        </div>
      </div>
    </aside>
  );
};