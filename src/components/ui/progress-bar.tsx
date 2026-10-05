interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({
  value,
  className = "",
}: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-[var(--usus-muted)] ${className}`}
      role="progressbar"
      aria-valuenow={safeValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="
          h-full rounded-full
          bg-[var(--usus-primary)]
          transition-[width]
          duration-500
          ease-out
        "
        style={{
          width: `${safeValue}%`,
        }}
      />
    </div>
  );
};