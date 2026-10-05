export function AuthDivider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-[var(--usus-border)]" />

      <span className="text-[10px] text-[var(--usus-muted)]">
        OR
      </span>

      <div className="h-px flex-1 bg-[var(--usus-border)]" />
    </div>
  );
}
